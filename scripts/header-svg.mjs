// Header art: a carousel of slides whose numbers come from the data.
// Plain SVG with CSS animation, so it works as an <img> on GitHub. Motion stops under prefers-reduced-motion.
// The resting state is the visible state: if a viewer pauses or skips the animation, the first slides still show.

const THEMES = {
  dark: {
    bg: '#0d1117', panel: '#151b23', tile: '#212830', tileEdge: '#2f3742', ink: '#e6edf3', muted: '#8b949e', line: '#30363d', skel: '#2f3742',
    accents: ['#e6edf3', '#4493f8', '#f778ba', '#39c5cf', '#3fb950', '#bc8cff', '#d29922', '#f0883e'],
  },
  light: {
    bg: '#ffffff', panel: '#f6f8fa', tile: '#ffffff', tileEdge: '#d1d9e0', ink: '#1f2328', muted: '#59636e', line: '#d1d9e0', skel: '#e6eaef',
    accents: ['#1f2328', '#0969da', '#bf3989', '#1b7c83', '#1a7f37', '#8250df', '#9a6700', '#bc4c00'],
  },
};

const xml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function headerSvg({ theme, stats, still = false }) {
  const t = THEMES[theme];
  const W = 1280;
  const H = 400;
  const slides = [
    [stats.total, 'AI TOOLS', 'IN THE LIST'],
    [stats.linkedin, 'MAKE LINKEDIN', 'CAROUSELS'],
    [stats.instagram, 'MAKE INSTAGRAM', 'CAROUSELS'],
    [stats.tiktok, 'MAKE TIKTOK', 'SLIDESHOWS'],
    [stats.posting, 'SCHEDULE OR', 'POST FOR YOU'],
    [stats.dev, 'HAVE AN API', 'OR MCP SERVER'],
    [stats.free, 'HAVE A', 'FREE PLAN'],
    [stats.oss, 'OPEN-SOURCE', 'PROJECTS'],
  ];
  const n = slides.length;
  const cardW = 180;
  const cardH = 225;
  const pitch = 204;
  const x0 = 72;
  const y0 = 104;

  const mono = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace";
  const sans = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

  const card = (s, i, copy) => {
    const x = x0 + (i + copy * n) * pitch;
    const a = t.accents[i];
    return `<g><rect class="card" x="${x}" y="${y0}" width="${cardW}" height="${cardH}" rx="14"/>`
      + `<rect x="${x + 16}" y="${y0 + 16}" width="28" height="5" rx="2.5" fill="${a}"/>`
      + `<text class="idx" x="${x + cardW - 16}" y="${y0 + 24}">${String(i + 1).padStart(2, '0')}/${String(n).padStart(2, '0')}</text>`
      + `<text class="num" x="${x + 14}" y="${y0 + 112}" fill="${a}">${xml(s[0])}</text>`
      + `<text class="lab" x="${x + 16}" y="${y0 + 146}">${xml(s[1])}</text>`
      + `<text class="lab" x="${x + 16}" y="${y0 + 165}">${xml(s[2])}</text>`
      + `<rect class="skel" x="${x + 16}" y="${y0 + 190}" width="${cardW - 52}" height="7" rx="3.5"/>`
      + `<rect class="skel" x="${x + 16}" y="${y0 + 204}" width="${cardW - 96}" height="7" rx="3.5"/></g>`;
  };
  // Two copies of the slides, so the track can loop without a visible jump.
  const track = [0, 1].map((c) => slides.map((s, i) => card(s, i, c)).join('')).join('');

  // One step per slide: hold, then swipe one card to the left.
  const seg = 100 / n;
  const hold = seg * 0.78;
  const pct = (v) => `${+v.toFixed(3)}%`;
  let trackKeys = '';
  let dotKeys = '';
  const dotPitch = 18;
  for (let i = 0; i < n; i++) {
    trackKeys += `${pct(i * seg)}, ${pct(i * seg + hold)} { transform: translateX(${-i * pitch}px); } `;
    dotKeys += `${pct(i * seg)}, ${pct(i * seg + hold)} { transform: translateX(${i * dotPitch}px); } `;
  }
  trackKeys += `100% { transform: translateX(${-n * pitch}px); }`;
  dotKeys += '100% { transform: translateX(0px); }';
  const cycle = (n * 2.8).toFixed(1);

  const dotsX = W / 2 - ((n - 1) * dotPitch) / 2;
  const dotsY = 350;
  const dots = slides.map((_, i) => `<circle class="dot" cx="${dotsX + i * dotPitch}" cy="${dotsY}" r="3.5"/>`).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="title desc">
<title id="title">Awesome AI Carousel Tools</title>
<desc id="desc">A carousel of slides with counts from the list: ${slides.map((s) => `${s[0]} ${s[1].toLowerCase()} ${s[2].toLowerCase()}`).join(', ')}.</desc>
<defs>
  <clipPath id="view"><rect x="41" y="96" width="${W - 82}" height="${cardH + 18}"/></clipPath>
  <linearGradient id="fadeL" x1="0" x2="1"><stop offset="0" stop-color="${t.panel}"/><stop offset="1" stop-color="${t.panel}" stop-opacity="0"/></linearGradient>
  <linearGradient id="fadeR" x1="0" x2="1"><stop offset="0" stop-color="${t.panel}" stop-opacity="0"/><stop offset="1" stop-color="${t.panel}"/></linearGradient>
</defs>
<style>
  .head { fill: ${t.muted}; font-family: ${mono}; font-size: 13px; letter-spacing: 2.5px; }
  .card { fill: ${t.tile}; stroke: ${t.tileEdge}; }
  .idx { fill: ${t.muted}; font-family: ${mono}; font-size: 12px; letter-spacing: 1px; text-anchor: end; }
  .num { font-family: ${sans}; font-size: 72px; font-weight: 750; letter-spacing: -2px; }
  .lab { fill: ${t.ink}; font-family: ${mono}; font-size: 13px; font-weight: 600; letter-spacing: 1.5px; }
  .skel { fill: ${t.skel}; }
  .dot { fill: ${t.line}; }
  .active { fill: ${t.ink}; }
  .track { animation: swipe ${cycle}s cubic-bezier(.6, 0, .3, 1) infinite; }
  .pager { animation: page ${cycle}s cubic-bezier(.6, 0, .3, 1) infinite; }
  @keyframes swipe { ${trackKeys} }
  @keyframes page { ${dotKeys} }
  @media (prefers-reduced-motion: reduce) { .track, .pager { animation: none; } }${still ? '\n  .track, .pager { animation: none !important; }' : ''}
</style>
<rect width="${W}" height="${H}" fill="${t.bg}"/>
<rect x="40" y="36" width="${W - 80}" height="${H - 72}" rx="18" fill="${t.panel}" stroke="${t.line}"/>
<text class="head" x="${x0}" y="76">AI CAROUSEL AND SLIDESHOW TOOLS</text>
<text class="head" x="${W - 72}" y="76" text-anchor="end">EACH READ ON ITS OWN SITE</text>
<line x1="${x0}" y1="88" x2="${W - 72}" y2="88" stroke="${t.line}"/>
<g clip-path="url(#view)"><g class="track">${track}</g></g>
<rect x="41" y="96" width="30" height="${cardH + 18}" fill="url(#fadeL)"/>
<rect x="${W - 131}" y="96" width="90" height="${cardH + 18}" fill="url(#fadeR)"/>
${dots}
<circle class="dot active pager" cx="${dotsX}" cy="${dotsY}" r="3.5"/>
</svg>
`;
}
