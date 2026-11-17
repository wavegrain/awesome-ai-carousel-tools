#!/usr/bin/env node
// Builds README.md, lists/*.md, downloads/* and the header art from data/tools.json.
// Usage: node scripts/build.mjs          (write all generated files)
//        node scripts/build.mjs --check  (validate the data and fail if a generated file is out of date)
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { headerSvg } from './header-svg.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const data = JSON.parse(read('data/tools.json'));
const check = process.argv.includes('--check');
const T = data.tools;
const OSS = data.openSource;

// ---------- validation ----------

const PLATFORMS = ['linkedin', 'instagram', 'tiktok', 'facebook', 'threads', 'pinterest', 'x', 'youtube', 'bluesky'];
const FOCUS = ['linkedin', 'instagram', 'tiktok', 'all-round'];
const EXPORTS = ['PNG', 'JPG', 'PDF', 'MP4', 'GIF', 'ZIP', 'PPTX', 'SVG'];
const AI_KEYS = ['text', 'images', 'photos', 'brandKit'];
const CLAIMABLE = ['platforms', 'exports', 'postsTo', 'api', 'mcp', 'freePlan', ...AI_KEYS.map((k) => `ai.${k}`)];
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const URL_OK = /^https:\/\/[^\s?#]+$/;

function validate() {
  const errors = [];
  const names = new Set();
  const urls = new Set();
  const seen = (at, name, url) => {
    if (names.has(name.toLowerCase())) errors.push(`${at} is listed twice`);
    names.add(name.toLowerCase());
    if (!URL_OK.test(url)) errors.push(`${at}: url must be https with no query string`);
    if (urls.has(url)) errors.push(`${at}: url is used twice`);
    urls.add(url);
  };
  for (const d of T) {
    const at = `"${d.name}"`;
    seen(at, d.name, d.url);
    if (!FOCUS.includes(d.focus)) errors.push(`${at}: focus "${d.focus}" is not one of ${FOCUS.join(', ')}`);
    for (const k of ['platforms', 'postsTo']) for (const v of d[k]) if (!PLATFORMS.includes(v)) errors.push(`${at}: ${k} "${v}" is unknown`);
    if (!d.platforms.length) errors.push(`${at}: platforms is empty`);
    for (const v of d.exports) if (!EXPORTS.includes(v)) errors.push(`${at}: export "${v}" is unknown`);
    for (const k of AI_KEYS) if (![true, false, null].includes(d.ai?.[k])) errors.push(`${at}: ai.${k} must be true, false or null`);
    for (const k of ['api', 'mcp']) if (![true, false, null].includes(d[k])) errors.push(`${at}: ${k} must be true, false or null`);
    if (!['yes', 'no'].includes(d.freePlan)) errors.push(`${at}: freePlan must be yes or no`);
    for (const c of d.claimed) if (!CLAIMABLE.includes(c)) errors.push(`${at}: claimed "${c}" is not a field that can be claimed`);
    if (d.claimed.length && !d.claimedFrom) errors.push(`${at}: say where the claimed facts come from`);
    if (!d.makes || !d.note) errors.push(`${at}: makes and note are required`);
    if (!/[.!?]$/.test(d.note)) errors.push(`${at}: the note must be one full sentence`);
    if (!DATE.test(d.read)) errors.push(`${at}: read must be YYYY-MM-DD`);
    if (!d.sources.length || d.sources.some((s) => !s.startsWith('https://'))) errors.push(`${at}: needs https sources`);
  }
  for (const o of OSS) {
    const at = `"${o.name}"`;
    seen(at, o.name, o.url);
    if (o.url !== `https://github.com/${o.repo}`) errors.push(`${at}: url must be https://github.com/<repo>`);
    if (!['app', 'library'].includes(o.kind)) errors.push(`${at}: kind must be app or library`);
    if (!o.license || !Number.isInteger(o.stars) || !DATE.test(o.lastPush) || !DATE.test(o.read)) errors.push(`${at}: needs license, whole stars, lastPush and read dates`);
    if (!/[.!?]$/.test(o.note)) errors.push(`${at}: the note must be one full sentence`);
  }
  const text = JSON.stringify(data);
  if (text.includes('\u2014')) errors.push('the data holds an em dash; use a plain dash');
  if (/\$\s?\d|€\s?\d|\d\s?(usd|eur)\b|per month|\/mo\b/i.test(text)) errors.push('the data holds a price; this list records no prices');
  if (/listings\+|main media/i.test(text)) errors.push('the data holds a private address or name');
  return errors;
}

// ---------- formatting helpers ----------

const NET = { linkedin: 'LinkedIn', instagram: 'Instagram', tiktok: 'TikTok', facebook: 'Facebook', threads: 'Threads', pinterest: 'Pinterest', x: 'X', youtube: 'YouTube', bluesky: 'Bluesky' };
const AI_ICON = { text: '✍️', images: '🎨', photos: '📷', brandKit: '🎯' };
const FOCUS_INFO = {
  linkedin: { title: 'LinkedIn carousels', file: 'linkedin.md', blurb: 'Tools built mainly for LinkedIn document posts: text-led slides, exported as a PDF.' },
  instagram: { title: 'Instagram carousels', file: 'instagram.md', blurb: 'Tools built mainly for Instagram carousels and other square or 4:5 image posts.' },
  tiktok: { title: 'TikTok slideshows', file: 'tiktok.md', blurb: 'Tools built mainly for TikTok photo slideshows, often for faceless accounts or app marketing.' },
  'all-round': { title: 'All-round design and content tools', file: 'all-round.md', blurb: 'Bigger design or social suites where carousels are one format among many.' },
};

const esc = (s) => String(s).replace(/\|/g, '\\|');
const mark = (d, field, s) => (d.claimed.includes(field) ? `${s} ¹` : s);
const nbsp = (s) => s.replace(/ /g, ' ');
const byName = (a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });
const sorted = (list) => [...list].sort(byName);

const aiCell = (d) => {
  const on = AI_KEYS.filter((k) => d.ai[k]).map((k) => mark(d, `ai.${k}`, AI_ICON[k]));
  return on.length ? on.join(' ') : '-';
};
const exportCell = (d) => (d.exports.length ? mark(d, 'exports', d.exports.join(', ')) : '?');
const postsCell = (d) => (d.postsTo.length ? mark(d, 'postsTo', d.postsTo.map((p) => NET[p]).join(', ')) : '-');
const yn = (v) => (v === true ? 'Yes' : v === false ? '-' : '?');
const devCell = (d) => {
  const parts = [];
  if (d.api) parts.push(mark(d, 'api', 'API'));
  if (d.mcp) parts.push(mark(d, 'mcp', 'MCP'));
  if (parts.length) return parts.join(' + ');
  return d.api === null && d.mcp === null ? '?' : '-';
};
const freeCell = (d) => mark(d, 'freePlan', d.freePlan === 'yes' ? 'Yes' : 'No');
const nameCell = (d) => `[${esc(d.name)}](${d.url})`;

const SHORT_COLS = ['Tool', 'What it makes', 'AI', 'Export', 'Posts to', 'API / MCP', 'Free plan', 'In one sentence'];
const shortRow = (d) => [nameCell(d), esc(d.makes), aiCell(d), exportCell(d), postsCell(d), devCell(d), freeCell(d), esc(d.note)];
const FULL_COLS = ['Tool', 'What it makes', 'Platforms', 'AI', 'Export', 'Posts to', 'API / MCP', 'Free plan', 'Read on', 'In one sentence'];
const fullRow = (d) => [nameCell(d), esc(d.makes), mark(d, 'platforms', d.platforms.map((p) => NET[p]).join(', ')), aiCell(d), exportCell(d), postsCell(d), devCell(d), freeCell(d), d.read, esc(d.note)];

// Pipes are aligned by string length, which is what awesome-lint's table-pipe-alignment rule measures.
function table(cols, rows) {
  const widths = cols.map((c, i) => Math.max(3, c.length, ...rows.map((r) => String(r[i]).length)));
  const line = (cells) => `| ${cells.map((c, i) => String(c).padEnd(widths[i])).join(' | ')} |`;
  return [line(cols), line(widths.map((w) => '-'.repeat(w))), ...rows.map(line)].join('\n');
}

const FOOTNOTE = '¹ Claimed: we could not see this on the tool\'s own site, so it comes from another source named in the data file.';
const GENERATED = '<!-- Generated by scripts/build.mjs from data/tools.json. Do not edit this file; edit the data file and run npm run build. -->';

// ---------- views ----------

const VIEWS = [
  ...Object.entries(FOCUS_INFO).map(([k, f]) => ({ id: k, title: f.title, file: f.file, intro: f.blurb, pick: (d) => d.focus === k, readme: true })),
  { id: 'makes-linkedin', title: 'Every tool that makes LinkedIn carousels', file: 'all-linkedin.md', intro: 'Every tool in the list that makes LinkedIn carousels, whatever its main focus.', pick: (d) => d.platforms.includes('linkedin') },
  { id: 'makes-instagram', title: 'Every tool that makes Instagram carousels', file: 'all-instagram.md', intro: 'Every tool in the list that makes Instagram carousels, whatever its main focus.', pick: (d) => d.platforms.includes('instagram') },
  { id: 'makes-tiktok', title: 'Every tool that makes TikTok slideshows', file: 'all-tiktok.md', intro: 'Every tool in the list that makes TikTok photo slideshows, whatever its main focus.', pick: (d) => d.platforms.includes('tiktok') },
  { id: 'posting', title: 'With scheduling and posting', file: 'with-posting.md', intro: 'Tools that can schedule or publish the finished post to a network themselves, so you skip the download and upload step.', pick: (d) => d.postsTo.length > 0 },
  { id: 'dev', title: 'With an API or MCP server', file: 'with-api-or-mcp.md', intro: 'Tools you can drive from code or from an AI agent. An MCP server lets assistants such as Claude or ChatGPT use the tool directly.', pick: (d) => d.api || d.mcp },
  { id: 'free', title: 'With a free plan', file: 'with-free-plan.md', intro: 'Tools with a free plan that does not end after a trial. Free plans often add a watermark or limit slides.', pick: (d) => d.freePlan === 'yes' },
];

const countOf = (pick) => T.filter(pick).length;
const viewFor = (id) => VIEWS.find((v) => v.id === id);

function focusSection(v) {
  const rows = sorted(T.filter(v.pick));
  return `### ${v.title}\n\n${v.intro}\n${rows.length} tools, A to Z; [lists/${v.file}](lists/${v.file}) adds the platforms and the date we read each site.\n\n${table(SHORT_COLS, rows.map(shortRow))}`;
}

// The filter tables repeat tools from the platform tables above, so they name each tool without a link
// (awesome-lint allows every URL only once per README). The linked full views live in lists/.
function postingTable() {
  const rows = sorted(T.filter(viewFor('posting').pick));
  return table(['Tool', 'Posts to', 'Makes slides with AI', 'Free plan'], rows.map((d) => [esc(d.name), postsCell(d), d.ai.text || d.ai.images ? 'Yes' : '-', freeCell(d)]));
}
function devTable() {
  const rows = sorted(T.filter(viewFor('dev').pick));
  return table(['Tool', 'API', 'MCP server', 'What you can do with it'], rows.map((d) => [esc(d.name), d.api ? mark(d, 'api', 'Yes') : yn(d.api), d.mcp ? mark(d, 'mcp', 'Yes') : yn(d.mcp), esc(d.apiNote || '-')]));
}
function platformCountTable() {
  const rows = ['linkedin', 'instagram', 'tiktok'].map((p) => {
    const v = viewFor(`makes-${p}`);
    return [NET[p], String(countOf(v.pick)), `[lists/${v.file}](lists/${v.file})`];
  });
  return table(['Platform', 'Tools that make it', 'Full view'], rows);
}
function ossTable(kind) {
  const rows = sorted(OSS.filter((o) => o.kind === kind));
  return table(['Project', 'What it does', 'License', 'Stars', 'Last push', 'In one sentence'],
    rows.map((o) => [`[${esc(o.name)}](${o.url})`, esc(o.makes), esc(o.license), o.stars.toLocaleString('en'), o.lastPush, esc(o.note)]));
}

const LEGEND = [
  ['AI', '✍️ writes the slide text · 🎨 makes images with AI · 📷 uses your own photos · 🎯 brand kit (your colors, fonts, logo or voice)'],
  ['Export', 'The file types you can download'],
  ['Posts to', 'Networks it can schedule or publish to itself; - means you download and post by hand'],
  ['API / MCP', 'A public API, an MCP server for AI agents, both, - for neither, ? when we could not tell'],
  ['Free plan', 'Yes when a free plan lasts beyond a trial; No for paid plans or trials only. This list records no prices'],
];

function page(v) {
  const rows = sorted(T.filter(v.pick));
  const dates = rows.map((d) => d.read).sort();
  const when = dates[0] === dates.at(-1) ? `on ${dates[0]}` : `between ${dates[0]} and ${dates.at(-1)}`;
  return `${GENERATED}

# ${v.title}

${v.intro}
${rows.length} tools, A to Z, read on their own websites ${when}.
Back to the [main list](../README.md).

${table(FULL_COLS, rows.map(fullRow))}

${FOOTNOTE}
`;
}

function csv() {
  const cols = ['name', 'url', 'focus', 'platforms', 'makes', 'ai.text', 'ai.images', 'ai.photos', 'ai.brandKit', 'exports', 'postsTo', 'api', 'mcp', 'apiNote', 'freePlan', 'claimed', 'claimedFrom', 'note', 'read', 'sources'];
  const get = (d, k) => k.split('.').reduce((o, p) => o?.[p], d);
  const cell = (v) => {
    const s = Array.isArray(v) ? v.join('; ') : v === null || v === undefined ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(','), ...sorted(T).map((d) => cols.map((k) => cell(get(d, k))).join(','))].join('\n') + '\n';
}

const stats = {
  total: T.length,
  oss: OSS.length,
  linkedin: countOf(viewFor('makes-linkedin').pick),
  instagram: countOf(viewFor('makes-instagram').pick),
  tiktok: countOf(viewFor('makes-tiktok').pick),
  posting: countOf(viewFor('posting').pick),
  dev: countOf(viewFor('dev').pick),
  mcp: countOf((d) => d.mcp),
  free: countOf(viewFor('free').pick),
  photos: countOf((d) => d.ai.photos),
};

function render(template) {
  const vars = {
    ...stats,
    updated: data.updated,
    legend: table(['Column', 'What it means'], LEGEND),
    footnote: FOOTNOTE,
    platformCounts: platformCountTable(),
    byPlatform: VIEWS.filter((v) => v.readme).map(focusSection).join('\n\n'),
    postingTable: postingTable(),
    devTable: devTable(),
    ossApps: ossTable('app'),
    ossLibraries: ossTable('library'),
    downloadTable: table(['File', 'What it holds'], [
      ['[`downloads/tools.csv`](downloads/tools.csv)', 'Every field, one row per tool, ready for a spreadsheet'],
      ['[`downloads/tools.json`](downloads/tools.json)', 'The tools and the open-source projects as JSON'],
      ['[`data/tools.json`](data/tools.json)', 'The source file this README is built from, with the source URLs'],
    ]),
  };
  return template.replace(/\{\{(\w+)\}\}/g, (m, k) => {
    if (!(k in vars)) throw new Error(`template uses unknown {{${k}}}`);
    return String(vars[k]);
  });
}

// ---------- main ----------

const errors = validate();
if (errors.length) {
  console.error(`data/tools.json has ${errors.length} problem(s):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

const outputs = new Map();
outputs.set('README.md', render(read('templates/README.md')));
for (const v of VIEWS) outputs.set(`lists/${v.file}`, page(v));
outputs.set('downloads/tools.csv', csv());
outputs.set('downloads/tools.json', JSON.stringify({ updated: data.updated, tools: sorted(T), openSource: sorted(OSS) }) + '\n');
outputs.set('assets/header-dark.svg', headerSvg({ theme: 'dark', stats }));
outputs.set('assets/header-light.svg', headerSvg({ theme: 'light', stats }));
outputs.set('assets/social-board.svg', headerSvg({ theme: 'dark', stats, still: true }));

for (const [file, content] of outputs) {
  if (content.includes('\u2014')) {
    console.error(`${file} would contain an em dash; fix the template or data`);
    process.exit(1);
  }
}

const stale = [];
for (const [file, content] of outputs) {
  const p = join(root, file);
  const current = existsSync(p) ? readFileSync(p, 'utf8') : null;
  if (current === content) continue;
  if (check) stale.push(file);
  else {
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, content);
  }
}
if (check && stale.length) {
  console.error(`Out of date, run npm run build: ${stale.join(', ')}`);
  process.exit(1);
}
console.log(`${check ? 'Checked' : 'Built'} ${outputs.size} files from ${T.length} tools and ${OSS.length} open-source projects.`);
