// Refreshes assets/js/videos.js from the church's YouTube channel.
// Run from the project folder:  node tools/update-videos.mjs
// New videos are merged in; older ones already in the file are kept.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const CHANNEL = 'https://www.youtube.com/@christgospelchurchcoimbatore';
const OUT = fileURLToPath(new URL('../assets/js/videos.js', import.meta.url));
const MAX_VIDEOS = 240;
const HEADERS = {
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
  'accept-language': 'en-IN,en;q=0.9',
  cookie: 'CONSENT=YES+1; SOCS=CAI',
};

// Special services that have rolled off the channel's "latest" tabs.
const KEEP_IDS = [
  'tuJWfA1egjY', 'O5zSoemxq28', 'tbiWJq1oNdE', 'GtwuXpfSrU0', 'tNA25wda0ZM',
  '2-f-RyM7cmU', 'NeXqn1PHzXE', 'mtXMmq9gHKM', 'qTCjhu8gFPk',
  'Z8D-vq9gIYs', 'PWmUy9Fceqk', 'OEkbX-mmefY', 'kj1jkWTis7Y', 'AXQDzRZmyJE',
];

const SPEAKERS = [
  [/rev\.?\s*dr\.?\s*p\.?\s*chandran|rev\s*p\s*chandran/i, 'Rev. Dr. P. Chandran'],
  [/prema\s*chandran/i, 'Ps. Prema Chandran'],
  [/keerthi\s*kumar/i, 'Bro. Keerthi Kumar'],
  [/lelin\s*livingston/i, 'Ps. Lelin Livingston'],
  [/jegavalan/i, 'Ps. Jegavalan'],
  [/obeth/i, 'Ps. Obeth Julius'],
  [/manu\s*menon/i, 'Bishop Manu Menon'],
  [/charles\s*christopher/i, 'Ps. Charles Christopher'],
  [/eva\.?\s*jeeva/i, 'Eva. Jeeva'],
  [/ashok\s*kumar/i, 'Dr. Ashok Kumar'],
];

const EVENTS = [
  [/anniversary/i, 'anniversary'],
  [/good\s*friday/i, 'goodfriday'],
  [/resurrection|easter/i, 'resurrection'],
  [/christmas/i, 'christmas'],
  [/old\s*year/i, 'oldyear'],
  [/new\s*year/i, 'newyear'],
  [/healing/i, 'healing'],
  [/\d+\s*hours?\s*of\s*praise/i, 'worshipnight'],
];

const PARTS = [
  [/psalms/i, 'psalms'],
  [/testimony/i, 'testimony'],
  [/sermon|word\s*of\s*god|god'?s?\s*word|message/i, 'sermon'],
  [/praise|worship/i, 'worship'],
];

const firstMatch = (table, text) => table.find(([re]) => re.test(text))?.[1] ?? null;

async function getPage(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  return res.text();
}

function collectIds(html) {
  const match = html.match(/var ytInitialData = (\{.*?\});<\/script>/s);
  if (!match) throw new Error('YouTube page had no video data');
  const found = [];
  (function walk(node) {
    if (!node || typeof node !== 'object') return;
    const id = node.lockupViewModel?.contentId ?? node.videoRenderer?.videoId ?? node.gridVideoRenderer?.videoId;
    if (id) { found.push(id); return; }
    Object.values(node).forEach(walk);
  })(JSON.parse(match[1]));
  return found;
}

function unescapeJson(text) {
  try { return JSON.parse(`"${text}"`); } catch { return text; }
}

function meditationTitle(raw) {
  const first = raw.replace(/\s-\s*5\s*minutes?\s*meditation.*$/i, '').split('|').map(s => s.trim()).find(s => s && !/minutes?\s*meditation/i.test(s));
  const cleaned = (first ?? '').replace(/^["“”\s-]+|["“”\s,-]+$/g, '').trim();
  return /^(rev|\d)/i.test(cleaned) ? '' : cleaned;
}

async function describe(id) {
  const html = await getPage(`https://www.youtube.com/watch?v=${id}`);
  const raw = html.match(/"title":\{"simpleText":"((?:[^"\\]|\\.)*)"/)?.[1];
  if (!raw) return null;
  const title = unescapeJson(raw);
  const description = unescapeJson(html.match(/"shortDescription":"((?:[^"\\]|\\.)*)"/)?.[1] ?? '');
  const when = html.match(/"startTimestamp":"([^"]+)"/)?.[1] ?? html.match(/"uploadDate":"([^"]+)"/)?.[1];
  const seconds = Number(html.match(/"lengthSeconds":"(\d+)"/)?.[1] ?? 0);
  const embeddable = html.match(/"playableInEmbed":(true|false)/)?.[1] !== 'false';
  const isMeditation = /minutes?\s*meditation/i.test(title);
  const date = when ? new Date(when).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }) : '';
  const video = {
    id,
    date,
    kind: isMeditation ? 'meditation' : (firstMatch(EVENTS, title) ? 'special' : 'sunday'),
    event: isMeditation ? 'meditation' : (firstMatch(EVENTS, title) ?? 'sunday'),
    part: isMeditation ? null : (firstMatch(PARTS, title) ?? firstMatch(PARTS, description.slice(0, 200))),
    speaker: firstMatch(SPEAKERS, title) ?? firstMatch(SPEAKERS, description.slice(0, 400)),
    minutes: Math.round(seconds / 60),
    embeddable,
    raw: title,
  };
  if (isMeditation) video.topic = meditationTitle(title);
  return video;
}

async function inBatches(items, size, work) {
  const results = [];
  for (let i = 0; i < items.length; i += size) {
    results.push(...await Promise.all(items.slice(i, i + size).map(work)));
  }
  return results;
}

async function readExisting() {
  try {
    const text = await readFile(OUT, 'utf8');
    return JSON.parse(text.slice(text.indexOf('['), text.lastIndexOf(']') + 1));
  } catch {
    return [];
  }
}

const existing = new Map((await readExisting()).map(v => [v.id, v]));
const latestIds = (await Promise.all(['videos', 'streams'].map(tab => getPage(`${CHANNEL}/${tab}`).then(collectIds)))).flat();
const wanted = [...new Set([...latestIds, ...KEEP_IDS])];
const fresh = (await inBatches(wanted, 6, id => describe(id).catch(err => { console.warn(`skipped ${id}: ${err.message}`); return null; }))).filter(Boolean);

fresh.forEach(v => existing.set(v.id, v));
const all = [...existing.values()]
  .filter(v => v.date)
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, MAX_VIDEOS);

await writeFile(OUT, `// Generated by tools/update-videos.mjs. Do not edit by hand; run the tool again instead.\nwindow.CGC_VIDEOS = ${JSON.stringify(all, null, 1)};\n`);
const count = kind => all.filter(v => v.kind === kind).length;
console.log(`Saved ${all.length} videos: ${count('sunday')} Sunday, ${count('meditation')} meditation, ${count('special')} special. Newest: ${all[0]?.date}`);
