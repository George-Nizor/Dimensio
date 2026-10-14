// Renders lesson diagrams onto one sheet, in light and dark, for a person to look over while drawing
// them. Writes test-results/diagrams/<lesson folder>-light.png and -dark.png.
//
//   node scripts/diagram-sheet.mjs 003-navigation     one lesson folder, straight from its
//                                                     diagrams/*.mjs, so it works while other
//                                                     lessons are half written
//
// Chromium needs a few system libraries this machine may lack; set LD_LIBRARY_PATH to a folder that
// has them if it fails to start (docs/course/AGENT-BRIEF.md names one).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const desktop = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repo = path.resolve(desktop, '..');
const lesson = process.argv[2];
if (!lesson) {
  console.error('Name a lesson folder, for example: node scripts/diagram-sheet.mjs 003-navigation');
  process.exit(1);
}
const lessonDir = path.join(repo, 'content', 'lessons', lesson);
const folder = path.join(lessonDir, 'diagrams');
if (!fs.existsSync(folder)) {
  console.error(`No diagrams folder in content/lessons/${lesson}`);
  process.exit(1);
}
const kit = await import(pathToFileURL(path.join(repo, 'content', 'diagrams', 'lib.mjs')).href);
const css = fs.readFileSync(path.join(repo, 'content', 'diagrams', 'theme.css'), 'utf8');
const text = ['lesson.md', 'practice.yaml'].map((name) => path.join(lessonDir, name)).filter((file) => fs.existsSync(file)).map((file) => fs.readFileSync(file, 'utf8')).join('\n');
const esc = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const cells = [];
for (const file of fs.readdirSync(folder).filter((name) => name.endsWith('.mjs')).sort()) {
  const module = await import(`${pathToFileURL(path.join(folder, file)).href}?v=${Date.now()}`);
  // Shared helpers sit beside the diagrams; only a file whose default export draws is a diagram.
  if (typeof module.default !== 'function') continue;
  const name = file.replace(/\.mjs$/, '');
  const alt = (text.match(new RegExp(String.raw`!\[([^\]]*)\]\(${name}\)`)) || text.match(new RegExp(String.raw`diagram: ${name}, alt: "([^"]*)"`)) || [])[1] || '(not used in lesson.md)';
  let svg;
  try {
    svg = module.default(kit);
  } catch (error) {
    svg = `<p style="color:#c22f4f">${esc(String(error.stack || error))}</p>`;
  }
  cells.push(`<figure><div class="art">${svg}</div><figcaption><b>${name}</b> ${esc(alt)}</figcaption></figure>`);
}

const out = path.join(desktop, 'test-results', 'diagrams');
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
for (const theme of ['light', 'dark']) {
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.setContent(`<!doctype html><html data-theme="${theme}"><head><style>${css}
    body { margin: 0; padding: 20px; background: ${theme === 'dark' ? '#171513' : '#f4f1ec'}; color: ${theme === 'dark' ? '#ddd' : '#333'}; font: 12px sans-serif; }
    main { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .art { background: var(--d-paper); border: 1px solid var(--d-edge); border-radius: 10px; padding: 8px; }
    svg { width: 100%; height: auto; display: block; } figcaption { margin-top: 6px; }</style></head>
    <body><main>${cells.join('')}</main></body></html>`);
  await page.screenshot({ path: path.join(out, `${lesson}-${theme}.png`), fullPage: true });
}
await browser.close();
console.log(`${cells.length} diagrams: test-results/diagrams/${lesson}-light.png and -dark.png`);
