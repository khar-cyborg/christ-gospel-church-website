// Page behaviour: language switch, service status, videos, calendar, prayer form, globe.
(function () {
  const C = window.CGC;
  const VIDEOS = window.CGC_VIDEOS || [];
  const TZ = 'Asia/Kolkata';
  const IST_OFFSET_MS = 5.5 * 3600 * 1000;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const escapeHtml = text => String(text).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  C.renderFooter();

  /* ---------- Language ---------- */
  const renderers = [];
  let lang = document.documentElement.lang === 'ta' ? 'ta' : 'en';
  const t = (key, fallback) => (lang === 'ta' && window.CGC_TA[key]) || fallback;
  const pick = value => value[lang] || value.en;
  const locale = () => (lang === 'ta' ? 'ta-IN' : 'en-IN');

  function applyLanguage() {
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(el => {
      if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
      const key = el.dataset.i18n;
      el.innerHTML = lang === 'ta' && window.CGC_TA[key] ? window.CGC_TA[key] : el.dataset.en;
    });
    $$('[data-i18n-attr]').forEach(el => {
      el.dataset.i18nAttr.split(',').forEach(pair => {
        const [attr, key] = pair.split(':');
        const store = `en${attr.replace(/[^a-z]/g, '')}`;
        if (el.dataset[store] === undefined) el.dataset[store] = el.getAttribute(attr) || '';
        el.setAttribute(attr, lang === 'ta' && window.CGC_TA[key] ? window.CGC_TA[key] : el.dataset[store]);
      });
    });
    const titleKey = document.body.dataset.titleKey;
    if (titleKey) {
      if (!document.body.dataset.enTitle) document.body.dataset.enTitle = document.title;
      document.title = lang === 'ta' && window.CGC_TA[titleKey] ? window.CGC_TA[titleKey] : document.body.dataset.enTitle;
    }
    renderers.forEach(render => render());
  }

  document.addEventListener('click', event => {
    if (!event.target.closest('[data-lang-toggle]')) return;
    lang = lang === 'ta' ? 'en' : 'ta';
    try { localStorage.setItem('cgc-lang', lang); } catch (e) { /* private window */ }
    applyLanguage();
  });

  /* ---------- Mobile menu ---------- */
  const menuButton = $('.menu-toggle');
  const nav = $('#site-nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.innerHTML = C.icon(open ? 'close' : 'menu');
  }
  menuButton.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });

  /* ---------- Service timing, always worked out in India time ---------- */
  function serviceState(now = new Date()) {
    const ist = new Date(now.getTime() + IST_OFFSET_MS);
    const day = ist.getUTCDay();
    const minutes = ist.getUTCHours() * 60 + ist.getUTCMinutes();
    const { day: serviceDay, startHour, endHour } = C.service;
    const live = day === serviceDay && minutes >= startHour * 60 && minutes < endHour * 60;
    let daysAhead = (serviceDay - day + 7) % 7;
    if (daysAhead === 0 && minutes >= startHour * 60) daysAhead = 7;
    const next = new Date(Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate() + daysAhead, startHour, 0) - IST_OFFSET_MS);
    return { live, next, msLeft: next - now };
  }

  function countdownText(ms) {
    const total = Math.max(0, Math.floor(ms / 60000));
    const days = Math.floor(total / 1440);
    const hours = Math.floor((total % 1440) / 60);
    const mins = total % 60;
    const showMinutes = !days && (mins > 0 || !hours);
    if (lang === 'ta') {
      return `இன்னும் ${[days && `${days} நாள்`, hours && `${hours} மணி`, showMinutes && `${mins} நிமிடம்`].filter(Boolean).join(' ')}`;
    }
    const unit = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
    return `in ${[days && unit(days, 'day'), hours && unit(hours, 'hour'), showMinutes && unit(mins, 'minute')].filter(Boolean).join(', ')}`;
  }

  function renderStatus() {
    const state = serviceState();
    const viewerZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const dateText = new Intl.DateTimeFormat(locale(), { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long' }).format(state.next);
    const elsewhere = viewerZone && viewerZone !== TZ && viewerZone !== 'Asia/Calcutta'
      ? `<span class="status-local">${t('status.yourTime', 'Your time')}: ${new Intl.DateTimeFormat(locale(), { weekday: 'short', hour: 'numeric', minute: '2-digit' }).format(state.next)}</span>`
      : '';
    $$('[data-service-status]').forEach(el => {
      el.innerHTML = state.live
        ? `<p class="status-label status-live"><span class="pulse"></span>${t('status.liveLabel', 'Sunday service is on now')}</p>
           <p class="status-when">${t('status.liveBody', 'Come in, or join the livestream.')}</p>
           <a class="btn btn-red" href="watch.html#live">${C.icon('play')}${t('status.watch', 'Watch live')}</a>`
        : `<p class="status-label">${t('status.next', 'Next service')}</p>
           <p class="status-when">${escapeHtml(dateText)}<br><strong>${t('status.time', '8:00 AM')}</strong></p>
           <p class="status-count">${escapeHtml(countdownText(state.msLeft))}</p>${elsewhere}`;
    });
  }
  if ($('[data-service-status]')) {
    renderers.push(renderStatus);
    setInterval(renderStatus, 30000);
  }

  /* ---------- Verse of the day ---------- */
  function renderVerse() {
    const ist = new Date(Date.now() + IST_OFFSET_MS);
    const dayOfYear = Math.floor((Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate()) - Date.UTC(ist.getUTCFullYear(), 0, 0)) / 86400000);
    const verse = C.verses[dayOfYear % C.verses.length];
    $$('[data-verse]').forEach(el => {
      el.innerHTML = `<p class="verse-text">${escapeHtml(verse[lang])}</p><p class="verse-ref">${escapeHtml(verse.ref[lang])}</p>`;
    });
  }
  renderers.push(renderVerse);

  /* ---------- Video helpers ---------- */
  const EVENT_NAMES = {
    sunday: ['Sunday Service', 'ஞாயிறு ஆராதனை'],
    meditation: ['5-Minute Meditation', '5 நிமிட தியானம்'],
    anniversary: ['Anniversary', 'ஆண்டு நிறைவு விழா'],
    goodfriday: ['Good Friday', 'பெரிய வெள்ளி'],
    resurrection: ['Resurrection Sunday', 'உயிர்த்தெழுதல் ஞாயிறு'],
    christmas: ['Christmas', 'கிறிஸ்துமஸ்'],
    oldyear: ['Old Year Service', 'பழைய ஆண்டு ஆராதனை'],
    newyear: ['New Year Service', 'புத்தாண்டு ஆராதனை'],
    healing: ['Healing and Deliverance', 'சுகமளித்தல், விடுதலை ஆராதனை'],
    worshipnight: ['6 Hours of Praise', '6 மணி நேர துதி ஆராதனை'],
  };
  const PART_NAMES = {
    sermon: ['Sermon', 'தேவ செய்தி'],
    worship: ['Praise and Worship', 'துதி ஆராதனை'],
    psalms: ['Psalms', 'சங்கீதங்கள்'],
    testimony: ['Testimony', 'சாட்சி'],
  };
  const inLang = pair => pair[lang === 'ta' ? 1 : 0];

  function videoTitle(video) {
    if (video.kind === 'meditation') return video.topic || inLang(EVENT_NAMES.meditation);
    const event = inLang(EVENT_NAMES[video.event] || EVENT_NAMES.sunday);
    return video.part ? `${event}: ${inLang(PART_NAMES[video.part])}` : event;
  }

  function formatDate(iso, options = { day: 'numeric', month: 'short', year: 'numeric' }) {
    return new Intl.DateTimeFormat(locale(), { ...options, timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));
  }

  function videoMeta(video) {
    return [formatDate(video.date), video.speaker, video.minutes ? `${video.minutes} ${t('video.min', 'min')}` : ''].filter(Boolean).join(' · ');
  }

  const youtubeLink = id => `https://www.youtube.com/watch?v=${id}`;

  function videoCard(video) {
    const href = video.embeddable ? `watch.html#v=${video.id}` : youtubeLink(video.id);
    const external = video.embeddable ? '' : ' target="_blank" rel="noopener"';
    return `<li class="video-card">
      <a href="${href}"${external}>
        <span class="video-thumb"><img src="https://i.ytimg.com/vi/${video.id}/mqdefault.jpg" alt="" loading="lazy" width="320" height="180"><span class="video-play">${C.icon('play')}</span></span>
        <span class="video-title">${escapeHtml(videoTitle(video))}</span>
        <span class="video-meta">${escapeHtml(videoMeta(video))}</span>
      </a>
    </li>`;
  }

  const LIST_FILTERS = {
    meditation: v => v.kind === 'meditation',
    sermon: v => v.kind === 'sunday' && v.part === 'sermon',
    special: v => v.kind === 'special' && v.part === 'sermon',
  };
  function renderVideoLists() {
    $$('[data-video-list]').forEach(el => {
      const filter = LIST_FILTERS[el.dataset.videoList];
      el.innerHTML = VIDEOS.filter(filter).slice(0, Number(el.dataset.limit || 6)).map(videoCard).join('');
    });
  }
  if ($('[data-video-list]')) renderers.push(renderVideoLists);

  /* ---------- YouTube frames ---------- */
  const EMBED_BASE = 'https://www.youtube-nocookie.com/embed/';
  function frameHtml(src, title) {
    return `<iframe src="${src}" title="${escapeHtml(title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
  }
  $$('[data-series]').forEach(el => {
    const list = C.youtube[el.dataset.series];
    el.innerHTML = frameHtml(`${EMBED_BASE}videoseries?list=${list}&rel=0`, el.dataset.frameTitle || C.name);
  });

  /* ---------- Watch page ---------- */
  const playerBox = $('#player');
  if (playerBox) {
    const caption = $('#player-caption');
    const tabs = $$('[data-player-tab]');
    let currentView = null;

    function setTab(name) {
      tabs.forEach(tab => tab.setAttribute('aria-pressed', String(tab.dataset.playerTab === name)));
    }

    const views = {
      live(force) {
        setTab('live');
        const state = serviceState();
        if (state.live || force) {
          playerBox.innerHTML = frameHtml(`${EMBED_BASE}live_stream?channel=${C.youtube.channelId}&autoplay=1`, t('watch.tabLive', 'Live now'));
          caption.innerHTML = `<strong>${t('watch.liveTitle', 'Live from Christ Gospel Church')}</strong><span>${t('watch.liveNote', 'If the player says the video is unavailable, the stream has not started yet.')}</span>`;
          return;
        }
        const dateText = new Intl.DateTimeFormat(locale(), { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long' }).format(state.next);
        playerBox.innerHTML = `<div class="offair">
          <p class="offair-label">${t('watch.offAir', 'We are not live right now')}</p>
          <p class="offair-when">${escapeHtml(dateText)}, ${t('status.time', '8:00 AM')}</p>
          <p class="offair-count">${escapeHtml(countdownText(state.msLeft))}</p>
          <div class="offair-actions">
            <button class="btn btn-red" type="button" data-show="sunday">${C.icon('play')}${t('watch.watchLast', 'Watch the latest service')}</button>
            <button class="btn btn-ghost" type="button" data-show="liveForce">${t('watch.tryLive', 'Open the live player anyway')}</button>
          </div>
        </div>`;
        caption.innerHTML = `<strong>${t('watch.liveTitle', 'Live from Christ Gospel Church')}</strong><span>${t('watch.liveWhen', 'Sundays from about 8:15 AM, India time. Prayer requests are welcome in the live chat.')}</span>`;
      },
      liveForce() { views.live(true); },
      sunday() {
        setTab('sunday');
        playerBox.innerHTML = frameHtml(`${EMBED_BASE}videoseries?list=${C.youtube.latestStreams}&rel=0`, t('watch.tabSunday', 'Latest service'));
        caption.innerHTML = `<strong>${t('watch.sundayTitle', 'Latest service recordings')}</strong><span>${t('watch.autoNote', 'This player always starts with the newest video on the channel.')}</span>`;
      },
      meditation() {
        setTab('meditation');
        playerBox.innerHTML = frameHtml(`${EMBED_BASE}videoseries?list=${C.youtube.latestUploads}&rel=0`, t('watch.tabMeditation', "Today's meditation"));
        caption.innerHTML = `<strong>${t('watch.meditationTitle', '5-Minute Meditation with Rev. Dr. P. Chandran')}</strong><span>${t('watch.autoNote', 'This player always starts with the newest video on the channel.')}</span>`;
      },
      video(id) {
        setTab(null);
        const video = VIDEOS.find(v => v.id === id);
        playerBox.innerHTML = frameHtml(`${EMBED_BASE}${encodeURIComponent(id)}?rel=0&autoplay=1`, video ? videoTitle(video) : C.name);
        caption.innerHTML = video
          ? `<strong>${escapeHtml(videoTitle(video))}</strong><span>${escapeHtml(videoMeta(video))} · <a href="${youtubeLink(id)}" target="_blank" rel="noopener">${t('watch.openYoutube', 'Open on YouTube')}</a></span>`
          : `<strong>${C.name}</strong><span><a href="${youtubeLink(id)}" target="_blank" rel="noopener">${t('watch.openYoutube', 'Open on YouTube')}</a></span>`;
      },
    };

    function show(view, arg) {
      currentView = [view, arg];
      views[view](arg);
    }

    function routeFromHash() {
      const hash = decodeURIComponent(location.hash.slice(1));
      if (hash.startsWith('v=')) {
        show('video', hash.slice(2));
        $('#player-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (hash === 'live' || hash === 'meditation' || hash === 'sunday') {
        show(hash);
      } else {
        show(serviceState().live ? 'live' : 'sunday');
      }
    }

    document.addEventListener('click', event => {
      const trigger = event.target.closest('[data-player-tab], [data-show]');
      if (!trigger) return;
      const view = trigger.dataset.playerTab || trigger.dataset.show;
      show(view);
      if (trigger.dataset.playerTab) history.replaceState(null, '', `#${view}`);
    });
    window.addEventListener('hashchange', routeFromHash);
    routeFromHash();
    renderers.push(() => { if (currentView) views[currentView[0]](currentView[1]); });

    /* Library */
    const grid = $('#library');
    const search = $('#library-search');
    const empty = $('#library-empty');
    const more = $('#library-more');
    const count = $('#library-count');
    const chips = $$('[data-filter]');
    const PAGE = 12;
    let filter = 'all';
    let shown = PAGE;

    function renderLibrary() {
      const query = search.value.trim().toLowerCase();
      const matches = VIDEOS.filter(v => {
        if (filter !== 'all' && v.kind !== filter) return false;
        if (!query) return true;
        return [v.raw, videoTitle(v), v.speaker || ''].join(' ').toLowerCase().includes(query);
      });
      grid.innerHTML = matches.slice(0, shown).map(videoCard).join('');
      empty.hidden = matches.length > 0;
      more.hidden = matches.length <= shown;
      count.textContent = lang === 'ta' ? `${matches.length} காணொளிகள்` : `${matches.length} video${matches.length === 1 ? '' : 's'}`;
    }

    chips.forEach(chip => chip.addEventListener('click', () => {
      filter = chip.dataset.filter;
      shown = PAGE;
      chips.forEach(other => other.setAttribute('aria-pressed', String(other === chip)));
      renderLibrary();
    }));
    search.addEventListener('input', () => { shown = PAGE; renderLibrary(); });
    more.addEventListener('click', () => { shown += PAGE; renderLibrary(); });
    renderers.push(renderLibrary);
  }

  /* ---------- Calendar ---------- */
  function upcomingEvents() {
    const today = new Date(Date.now() + IST_OFFSET_MS).toISOString().slice(0, 10);
    return C.events.filter(event => event.sort >= today).sort((a, b) => a.sort.localeCompare(b.sort));
  }
  function renderEvents() {
    $$('[data-events]').forEach(el => {
      const limit = Number(el.dataset.events) || 99;
      const showNotes = el.dataset.eventsNotes !== undefined;
      const items = upcomingEvents().slice(0, limit);
      el.innerHTML = items.map(event => {
        const day = event.date ? formatDate(event.date, { day: 'numeric' }) : '';
        const month = event.date ? formatDate(event.date, { month: 'short', year: 'numeric' }) : pick(event.month);
        const weekday = event.date ? formatDate(event.date, { weekday: 'long' }) : '';
        return `<li class="event">
          <p class="event-date"><span class="event-day">${day}</span><span class="event-month">${escapeHtml(month)}</span></p>
          <div class="event-body">
            <h3>${escapeHtml(pick(event.title))}</h3>
            ${weekday ? `<p class="event-weekday">${escapeHtml(weekday)}</p>` : ''}
            ${showNotes ? `<p>${escapeHtml(pick(event.note))}</p><a class="text-link" href="watch.html#v=${event.replay}">${t('calendar.replay', 'Watch the last one')}</a>` : ''}
          </div>
        </li>`;
      }).join('') || `<li class="event-empty">${t('calendar.empty', 'New dates are coming soon. Call us to ask what is next.')}</li>`;
    });
  }
  if ($('[data-events]')) renderers.push(renderEvents);

  /* ---------- Prayer form: composes a message, nothing is stored here ---------- */
  const prayerForm = $('#prayer-form');
  if (prayerForm) {
    const field = name => prayerForm.elements[name];
    const error = $('#prayer-error');
    const copied = $('#prayer-copied');

    function composeMessage() {
      const typeSelect = field('type');
      const lines = [`${typeSelect.options[typeSelect.selectedIndex].text}`];
      if (field('name').value.trim()) lines.push(`${t('form.name', 'Name')}: ${field('name').value.trim()}`);
      if (field('phone').value.trim()) lines.push(`${t('form.phone', 'Phone')}: ${field('phone').value.trim()}`);
      lines.push('', field('message').value.trim());
      return lines.join('\n');
    }

    function requireMessage() {
      const ok = field('message').value.trim().length > 0;
      error.hidden = ok;
      field('message').setAttribute('aria-invalid', String(!ok));
      if (!ok) field('message').focus();
      return ok;
    }

    prayerForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!requireMessage()) return;
      window.open(`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(composeMessage())}`, '_blank', 'noopener');
    });
    field('message').addEventListener('input', () => { if (field('message').value.trim()) error.hidden = true; });
    $('#prayer-sms').addEventListener('click', () => {
      if (requireMessage()) location.href = `sms:${C.phones[0].tel}?body=${encodeURIComponent(composeMessage())}`;
    });
    $('#prayer-copy').addEventListener('click', async () => {
      if (!requireMessage()) return;
      try {
        await navigator.clipboard.writeText(composeMessage());
        copied.hidden = false;
        setTimeout(() => { copied.hidden = true; }, 4000);
      } catch (e) {
        field('message').select();
      }
    });
  }

  /* ---------- Giving details appear once they are filled in config.js ---------- */
  const givingBox = $('#giving-details');
  if (givingBox) {
    const g = C.giving;
    const render = () => {
      const rows = [
        [t('give.upi', 'UPI ID'), g.upi],
        [t('give.accountName', 'Account name'), g.accountName],
        [t('give.bank', 'Bank'), g.bankName],
        [t('give.accountNumber', 'Account number'), g.accountNumber],
        [t('give.ifsc', 'IFSC'), g.ifsc],
      ].filter(([, value]) => value);
      givingBox.hidden = rows.length === 0;
      $('#giving-fallback').hidden = rows.length > 0;
      givingBox.innerHTML = rows.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('');
    };
    renderers.push(render);
  }

  /* ---------- Shared links filled from config ---------- */
  $$('[data-phone]').forEach(el => {
    const phone = C.phones[Number(el.dataset.phone) || 0];
    el.href = `tel:${phone.tel}`;
    if (!el.dataset.keepText) el.textContent = phone.display;
  });
  $$('[data-map-link]').forEach(el => { el.href = C.mapLink; });
  $$('[data-map-frame]').forEach(el => {
    el.innerHTML = `<iframe src="${C.mapEmbed}" title="Map to ${C.name}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
  });
  $$('[data-address]').forEach(el => { el.innerHTML = `${C.address.line1}<br>${C.address.line2}<br>${C.address.line3}`; });
  $$('[data-youtube]').forEach(el => { el.href = C.youtube[el.dataset.youtube] || C.youtube.url; });
  $$('[data-playlist]').forEach(el => { el.href = `https://www.youtube.com/playlist?list=${C.youtube.playlists[el.dataset.playlist]}`; });
  $$('[data-logo]').forEach(el => {
    el.src = C.logo;
    el.onerror = () => { el.onerror = null; el.src = 'assets/img/emblem.svg'; };
  });

  /* ---------- Hero globe: the emblem's lines of longitude, turning slowly ---------- */
  const canvas = $('#globe');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const TILT = -0.32;
    const STEP = Math.PI / 12;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let spin = 0.6;
    let visible = true;
    let last = 0;

    function project(lat, lon, radius, cx, cy) {
      const x = Math.cos(lat) * Math.sin(lon + spin);
      const y = Math.sin(lat);
      const z = Math.cos(lat) * Math.cos(lon + spin);
      return [cx + radius * x, cy - radius * (y * Math.cos(TILT) - z * Math.sin(TILT)), y * Math.sin(TILT) + z * Math.cos(TILT)];
    }

    function drawCurve(points, front, back) {
      for (let i = 1; i < points.length; i++) {
        const target = points[i][2] >= 0 ? front : back;
        target.moveTo(points[i - 1][0], points[i - 1][1]);
        target.lineTo(points[i][0], points[i][1]);
      }
    }

    function draw() {
      const ratio = Math.min(devicePixelRatio || 1, 2);
      const size = canvas.clientWidth;
      if (!size) return;
      if (canvas.width !== Math.round(size * ratio)) {
        canvas.width = Math.round(size * ratio);
        canvas.height = Math.round(size * ratio);
      }
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, size, size);
      const center = size / 2;
      const radius = size / 2 - 2;
      const front = new Path2D();
      const back = new Path2D();
      for (let lon = 0; lon < Math.PI * 2; lon += STEP) {
        const points = [];
        for (let lat = -Math.PI / 2; lat <= Math.PI / 2 + 0.01; lat += 0.08) points.push(project(lat, lon, radius, center, center));
        drawCurve(points, front, back);
      }
      for (let lat = -Math.PI / 2 + STEP; lat < Math.PI / 2; lat += STEP) {
        const points = [];
        for (let lon = 0; lon <= Math.PI * 2 + 0.01; lon += 0.08) points.push(project(lat, lon, radius, center, center));
        drawCurve(points, front, back);
      }
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255,255,255,.09)';
      ctx.stroke(back);
      ctx.strokeStyle = 'rgba(255,255,255,.42)';
      ctx.stroke(front);
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(255,255,255,.6)';
      ctx.stroke();
    }

    function tick(time) {
      if (visible && time - last > 40) {
        spin += (time - last) * 0.00005;
        last = time;
        draw();
      }
      requestAnimationFrame(tick);
    }

    draw();
    window.addEventListener('resize', draw);
    if (!still) {
      new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }).observe(canvas);
      requestAnimationFrame(tick);
    }
  }

  applyLanguage();
})();
