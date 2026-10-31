// Draws the shared header and footer so every page stays in step.
(function () {
  const C = window.CGC;

  let savedLang = 'en';
  try { savedLang = localStorage.getItem('cgc-lang') || 'en'; } catch (e) { /* private window */ }
  document.documentElement.lang = savedLang === 'ta' ? 'ta' : 'en';

  const icon = {
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    play: '<path d="M7 4.5v15l12.5-7.5z" fill="currentColor"/>',
    pray: '<path d="M12 3v18M6 9h12"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    youtube: '<rect x="3" y="6" width="18" height="12" rx="3"/><path d="M10.5 9.5v5l4-2.5z" fill="currentColor"/>',
  };
  const svg = name => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon[name]}</svg>`;
  C.icon = svg;

  C.mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(C.address.mapQuery)}`;
  C.mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(C.address.mapQuery)}&z=16&output=embed`;

  const pages = [
    ['home', 'index.html', 'Home'],
    ['about', 'about.html', 'About'],
    ['watch', 'watch.html', 'Watch'],
    ['visit', 'visit.html', 'Visit'],
    ['calendar', 'calendar.html', 'Calendar'],
    ['connect', 'connect.html', 'Connect'],
  ];
  const current = document.body.dataset.page;
  const logo = `<img src="${C.logo}" alt="" width="60" height="60" onerror="this.onerror=null;this.src='assets/img/emblem.svg'">`;

  document.getElementById('site-header').innerHTML = `
    <a class="skip" href="#main" data-i18n="nav.skip">Skip to content</a>
    <div class="header-inner">
      <a class="brand" href="index.html" aria-label="${C.name}, ${C.city}">
        ${logo}
        <span class="brand-name"><strong>${C.name}</strong><span>${C.city}</span></span>
      </a>
      <button class="lang-toggle lang-toggle-top" type="button" data-lang-toggle><span data-i18n="nav.langSwitch">தமிழ்</span></button>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-i18n-attr="aria-label:nav.menu" aria-label="Menu">${svg('menu')}</button>
      <nav id="site-nav" class="site-nav" data-i18n-attr="aria-label:nav.label" aria-label="Main">
        <ul>
          ${pages.map(([key, href, label]) => `<li><a href="${href}"${key === current ? ' aria-current="page"' : ''} data-i18n="nav.${key}">${label}</a></li>`).join('')}
        </ul>
        <div class="nav-actions">
          <button class="lang-toggle" type="button" data-lang-toggle><span data-i18n="nav.langSwitch">தமிழ்</span></button>
          <a class="btn btn-red btn-small" href="watch.html#live">${svg('play')}<span data-i18n="nav.live">Watch live</span></a>
        </div>
      </nav>
    </div>`;

  window.CGC.renderFooter = function () {
    document.getElementById('site-footer').innerHTML = `
      <div class="footer-inner">
        <div class="footer-brand">
          <span class="footer-logo">${logo}</span>
          <p class="footer-name">${C.name}<br>${C.city}</p>
          <p class="footer-motto" data-i18n="footer.motto">Go and preach.</p>
        </div>
        <div>
          <h2 data-i18n="footer.visit">Visit</h2>
          <address>${C.address.line1}<br>${C.address.line2}<br>${C.address.line3}</address>
          <a class="footer-link" href="${C.mapLink}" target="_blank" rel="noopener" data-i18n="footer.directions">Get directions</a>
        </div>
        <div>
          <h2 data-i18n="footer.gather">Gather</h2>
          <p data-i18n="footer.sunday">Sunday service<br>8:00 to 11:00 AM</p>
          <p data-i18n="footer.daily">5-Minute Meditation<br>every day on YouTube</p>
        </div>
        <div>
          <h2 data-i18n="footer.talk">Talk to us</h2>
          ${C.phones.map(p => `<a class="footer-link" href="tel:${p.tel}">${p.display}</a>`).join('')}
          <a class="footer-link" href="${C.youtube.url}" target="_blank" rel="noopener">YouTube</a>
          <a class="footer-link" href="connect.html#prayer" data-i18n="footer.prayer">Send a prayer request</a>
        </div>
      </div>
      <p class="footer-legal">© ${new Date().getFullYear()} ${C.name}, ${C.city}.</p>`;

    const bar = document.createElement('nav');
    bar.className = 'action-bar';
    bar.setAttribute('aria-label', 'Quick actions');
    bar.innerHTML = `
      <a href="tel:${C.phones[0].tel}">${svg('phone')}<span data-i18n="bar.call">Call</span></a>
      <a href="${C.mapLink}" target="_blank" rel="noopener">${svg('pin')}<span data-i18n="bar.directions">Directions</span></a>
      <a href="connect.html#prayer">${svg('pray')}<span data-i18n="bar.pray">Prayer</span></a>
      <a href="watch.html#live">${svg('play')}<span data-i18n="bar.watch">Watch</span></a>`;
    document.body.appendChild(bar);
  };
})();
