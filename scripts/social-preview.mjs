#!/usr/bin/env node
// Writes assets/social-preview.html from the data and renders it to assets/social-preview.png (1280x640)
// with headless Chrome. Run after npm run build, because it uses assets/social-board.svg.
// Set CHROME=/path/to/chrome if Chrome is not in the default macOS place.
import { readFileSync, writeFileSync, statSync, mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { tools, openSource, updated } = JSON.parse(readFileSync(join(root, 'data/tools.json'), 'utf8'));
const month = new Date(`${updated}T00:00:00Z`).toLocaleString('en', { month: 'long', year: 'numeric', timeZone: 'UTC' });

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Awesome AI Carousel Tools</title>
<style>
  html, body { margin: 0; width: 1280px; height: 640px; overflow: hidden; background: #0d1117; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; color: #e6edf3; }
  .top { height: 252px; gap: 40px; box-sizing: border-box; padding: 40px 72px 0; display: flex; justify-content: space-between; align-items: flex-start; }
  h1 { margin: 0; font-size: 58px; line-height: 1.02; letter-spacing: -1.5px; font-weight: 750; }
  h1 span { color: #8b949e; font-weight: 600; }
  p { margin: 16px 0 0; font-size: 23px; color: #c9d1d9; max-width: 880px; line-height: 1.3; }
  .count { text-align: right; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  .count b { display: block; font-size: 76px; line-height: 1; color: #58a6ff; letter-spacing: -2px; }
  .count small { display: block; margin-top: 8px; font-size: 16px; letter-spacing: 2px; color: #8b949e; }
  img { display: block; width: 1280px; height: 400px; margin-top: -12px; }
</style>
</head>
<body>
  <div class="top">
    <div>
      <h1>Awesome AI<br><span>Carousel Tools</span></h1>
      <p>LinkedIn carousels, Instagram carousels and TikTok slideshows.<br>Every tool read on its own website, ${month}.</p>
    </div>
    <div class="count"><b>${tools.length + openSource.length}</b><small>TOOLS AND PROJECTS</small></div>
  </div>
  <img src="social-board.svg" alt="">
</body>
</html>
`;

const htmlPath = join(root, 'assets/social-preview.html');
const pngPath = join(root, 'assets/social-preview.png');
writeFileSync(htmlPath, html);

const chrome = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const profile = mkdtempSync(join(tmpdir(), 'social-preview-'));
rmSync(pngPath, { force: true });
try {
  // Headless Chrome on macOS sometimes keeps running after it wrote the file, so it gets a time limit.
  execFileSync(chrome, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', `--user-data-dir=${profile}`,
    '--force-device-scale-factor=1', '--window-size=1280,640', '--virtual-time-budget=6000',
    `--screenshot=${pngPath}`, pathToFileURL(htmlPath).href,
  ], { stdio: 'ignore', timeout: 45000, killSignal: 'SIGKILL' });
} catch (error) {
  if (!existsSync(pngPath)) throw error;
} finally {
  rmSync(profile, { recursive: true, force: true });
}
if (!existsSync(pngPath)) throw new Error('Chrome wrote no screenshot');
const kb = Math.round(statSync(pngPath).size / 1024);
if (kb > 1000) throw new Error(`social-preview.png is ${kb} KB; GitHub wants under 1 MB`);
console.log(`Wrote assets/social-preview.png (${kb} KB).`);
