// Drives the built course app the way a learner would, as Delineare's scripts/e2e.mjs does. The
// build is served by `vite preview`; with no Electron preload the course app answers Blender calls
// with its fake bridge (src/course/dev/), so the whole flow runs in a browser: Welcome, a lesson
// and its video, an exercise with a starter scene, adding a model, ticking checks, measuring,
// Models, Practice, Library, Credits and Settings, then a 126-lesson course in 16 parts. Fails on
// any console error, page error or content-policy violation, and leaves screenshots at 1440 and
// 390 px, light and dark, for a person to look at.
//
//   npm run build && npm run e2e
//   E2E_OUT=some/folder npm run e2e         screenshots somewhere else
//
// Chromium comes from Playwright (npx playwright install chromium). On a machine without its
// system libraries, point LD_LIBRARY_PATH at a folder that has them (see
// test-tools/screenshots/README.md).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { preview } from 'vite';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.resolve(process.env.E2E_OUT || path.join(root, 'test-results', 'e2e'));
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
if (!fs.existsSync(path.join(root, 'dist', 'index.html'))) {
  console.error('Build first: npm run build');
  process.exit(1);
}
// The run uses a small fixed course, test/fixtures/course, in place of the real one, so it does not
// change as lessons are written. It is built into dist/content.json for the run and the real
// content is put back afterwards.
const realContent = path.join(root, 'public', 'content.json');
execFileSync(process.execPath, [path.join(root, 'scripts', 'build-content.mjs'), '--content', path.join(root, 'test', 'fixtures', 'course'), '--out', path.join(root, 'dist', 'content.json')], { stdio: 'inherit' });
process.on('exit', () => { if (fs.existsSync(realContent)) fs.copyFileSync(realContent, path.join(root, 'dist', 'content.json')); });
const content = JSON.parse(fs.readFileSync(path.join(root, 'dist', 'content.json'), 'utf8'));

const problems = [];
let lastPage = null; // for a picture of where the flow stopped
const server = await preview({ root, configFile: path.join(root, 'vite.config.mjs'), preview: { port: 0, host: '127.0.0.1', strictPort: false }, logLevel: 'silent' });
const base = server.resolvedUrls.local[0].replace(/\/$/, '');
const browser = await chromium.launch();

// The course as long as the real one: the sample's two parts, then fourteen more of unwritten
// lessons, 126 in all, so the course page and Home are seen at full length.
function longCourse() {
  const parts = structuredClone(content.parts);
  let number = parts.reduce((sum, part) => sum + part.lessons.length, 0);
  const titles = ['Edit Mode', 'Extrude', 'Loop cuts', 'Bevel', 'Inset', 'Knife', 'Merge', 'Mirror', 'Array', 'Solidify', 'Subdivision', 'Booleans', 'Curves', 'Text', 'UV unwrapping', 'Materials', 'Lights', 'Cameras', 'Rendering', 'Rigging', 'Weight painting', 'Shape keys', 'Animation', 'Export to Godot'];
  const partTitles = ['Modelling tools', 'Modifiers', 'Hard surface', 'Curves and text', 'Organic shapes', 'UVs', 'Materials', 'Texturing', 'Lighting', 'Cameras and rendering', 'Rigging', 'Animation', 'Game assets', 'Godot'];
  parts.length = Math.min(parts.length, 2);
  for (let p = 0; parts.length < 16; p += 1) {
    const size = parts.length === 15 ? 126 - number : 8;
    const lessons = Array.from({ length: size }, (_, i) => {
      number += 1;
      return { slug: `later-${number}`, number, part: parts.length + 1, title: titles[(number + i) % titles.length], summary: 'A lesson that is being written, shown here so the course page can be seen at full length.', written: false };
    });
    parts.push({ number: parts.length + 1, title: partTitles[p % partTitles.length], lessons });
  }
  return { ...content, parts };
}

async function open(width, scheme, { long = false } = {}) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: scheme });
  const page = await context.newPage();
  lastPage = page;
  const tag = `${width}-${scheme}${long ? '-long' : ''}`;
  page.on('console', (message) => { if (message.type() === 'error') problems.push(`[${tag}] console: ${message.text()}`); });
  page.on('pageerror', (error) => problems.push(`[${tag}] page error: ${error.message}`));
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', (event) => console.error(`content policy: ${event.violatedDirective} ${event.blockedURI}`));
  });
  // YouTube's player is not loaded here; Electron plays it (see the report in the branch).
  await page.route('https://www.youtube-nocookie.com/**', (route) => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>player</title><body style="background:#111"></body>' }));
  if (long) await page.route('**/content.json', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify(longCourse()) }));
  return { context, page, tag };
}

async function shot(page, name, { full = true } = {}) {
  // Sections fade in as they scroll into view; a full-page capture never scrolls, so show them all.
  await page.evaluate(() => document.querySelectorAll('.reveal').forEach((el) => el.classList.add('shown')));
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(out, `${name}.png`), fullPage: full });
}

async function waitForSplash(page) {
  await page.locator('.splash').waitFor({ state: 'detached', timeout: 8000 });
}

const steps = [];
const step = (text) => { steps.push(text); console.log(`  ${text}`); };

// Finishes the exercise on screen: skip or stop the timer, add the model, tick every check, then
// measure or save.
async function finishExercise(page, { measure = true } = {}) {
  const skip = page.getByRole('button', { name: 'Skip the timer' });
  if (await skip.isVisible()) await skip.click();
  else await page.getByRole('button', { name: "I've finished my model" }).click();
  // After Open in Blender the starter file is already chosen; otherwise pick one.
  const add = page.getByRole('button', { name: 'Add your model' });
  if (await add.isVisible()) await add.click();
  await page.locator('.chosen-name').waitFor();
  for (const box of await page.getByRole('checkbox').all()) await box.check();
  if (measure) await page.getByRole('button', { name: /^(Measure and save|Save my model)$/ }).click();
}

try {
  // A learner's first run, wide and light.
  const { context, page } = await open(1440, 'light');
  await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
  await page.locator('.splash').waitFor();
  await page.waitForTimeout(1100);
  await page.screenshot({ path: path.join(out, '00-splash.png') });
  await waitForSplash(page);
  step('the opening animation plays and gets out of the way');

  await page.getByRole('heading', { name: 'Welcome to Dimensio' }).waitFor();
  await shot(page, '01-welcome');
  step('the first open explains the app and offers three ways in');

  await page.getByRole('link', { name: 'Start lesson 1' }).click();
  const first = content.lessons[content.parts[0].lessons[0].slug];
  await page.getByRole('heading', { name: `Lesson 1: ${first.title}`, level: 1 }).waitFor();
  if (!(await page.locator('.step kbd.key').count())) throw new Error('lesson 1 shows no key caps');
  await shot(page, '02-lesson-1');
  step('lesson 1 shows its format, with keys as key caps');

  await page.getByRole('button', { name: 'Hide the steps' }).click();
  await page.getByText(first.steps.map((s) => s.title).join(' · ')).waitFor();
  await page.getByRole('button', { name: 'Show the steps' }).click();
  step('steps hide and show');

  await page.locator('.video-poster').click();
  const frame = await page.locator('.video iframe').evaluate((el) => ({ credentialless: el.hasAttribute('credentialless'), src: el.getAttribute('src') }));
  if (!frame.credentialless || !frame.src?.startsWith('https://www.youtube-nocookie.com/embed/')) throw new Error(`the lesson video frame is not set up to play: ${JSON.stringify(frame)}`);
  step('a lesson video loads YouTube\'s privacy-enhanced player as a credentialless frame');

  await page.getByRole('link', { name: 'Start the exercise' }).click();
  await page.getByRole('button', { name: 'Start the timer' }).waitFor();
  await page.getByRole('button', { name: 'Open in Blender' }).click();
  await page.getByText(`Blender is opening ${content.lessons[first.slug].exercise}.blend in its own window.`).waitFor();
  await page.getByRole('button', { name: 'Start over' }).click();
  await page.getByText(/Replace .*\.blend with a new starter scene/).waitFor();
  await shot(page, '03-exercise-1-start-over', { full: false });
  await page.getByRole('button', { name: 'Keep my file' }).click();
  step('Open in Blender builds the starter scene, and Start over asks first');
  await page.getByRole('button', { name: 'Start the timer' }).click();
  await page.waitForTimeout(1300);
  await page.getByRole('button', { name: 'Pause' }).click();
  await page.getByText('Paused').waitFor();
  step('timer starts and pauses');
  await finishExercise(page);
  await page.getByText(/lesson 1 is done/).waitFor();
  await shot(page, '04-exercise-1-saved');
  step('a model with every check held finishes lesson 1');

  await page.getByRole('link', { name: 'Back to the lesson' }).click();
  await page.getByText('Done: every check held.').waitFor();
  await page.getByRole('link', { name: 'Home', exact: true }).click();
  const second = content.lessons[content.parts[0].lessons[1].slug];
  await page.getByRole('heading', { name: `Next: Lesson 2, ${second.title}` }).waitFor();
  await page.getByText('Your last model').waitFor();
  await shot(page, '05-home-after-lesson-1');
  step('Home moves on to lesson 2 and shows the last model');

  // Lesson 2's exercise copies the example model and is measured.
  await page.getByRole('link', { name: 'Open the lesson' }).click();
  await page.getByRole('heading', { name: `Lesson 2: ${second.title}`, level: 1 }).waitFor();
  await shot(page, '06-lesson-2');
  await page.getByRole('link', { name: 'Start the exercise' }).click();
  await page.locator('.reference-model img').waitFor();
  await shot(page, '07-exercise-2-ready', { full: false });
  await page.locator('.reference-model').getByRole('button', { name: 'Front' }).click();
  await page.getByRole('button', { name: 'Open the example in Blender' }).click();
  step('the exercise shows the example model from four sides and opens it in Blender');

  await finishExercise(page, { measure: false });
  if (await page.getByText('Measurements').count()) throw new Error('measurements showed before the checks were ticked and the model measured');
  await shot(page, '08-exercise-2-checks', { full: false });
  await page.getByRole('button', { name: 'Measure and save' }).click();
  await page.getByText(/Blender is measuring stool\.blend/).waitFor();
  await page.getByRole('heading', { name: 'Saved' }).waitFor();
  await page.getByText('No n-gons (0 found)').waitFor();
  await page.getByText('Scale applied on every part (not on Seat)').waitFor();
  await page.getByText('A seat and four legs (5 meshes)').waitFor();
  await page.getByRole('heading', { name: "The example's outline over yours" }).waitFor();
  const scoreLike = (await page.locator('.panel, .your-model').allTextContents()).join(' ');
  if (/\d+\s*%|\bscore\b|\bgrade\b|0\.85|0\.34/i.test(scoreLike)) throw new Error('the results show a score or the match figure');
  await shot(page, '09-exercise-2-measured');
  await page.locator('.reference').evaluate((el) => el.scrollTo(0, el.scrollHeight));
  await shot(page, '09b-exercise-2-outlines', { full: false });
  step('only after the checks are ticked, the model is measured: plain facts, renders and outline pictures, no score');

  await page.getByRole('link', { name: 'See it in Models' }).click();
  await page.getByRole('heading', { name: 'Models', level: 1 }).waitFor();
  await page.locator('.page-grid img').first().waitFor();
  await shot(page, '10-models');
  await page.getByLabel('Lesson').selectOption(content.parts[0].lessons[1].slug);
  await page.locator('.page-grid a').first().click();
  await page.getByRole('heading', { name: 'Measurements' }).waitFor();
  await page.getByText('Held').first().waitFor();
  await shot(page, '11-model-detail');
  step('Models keeps the renders, the measurements and the checks');

  await page.getByRole('link', { name: 'Course', exact: true }).click();
  await page.getByRole('heading', { name: 'Course', level: 1 }).waitFor();
  await shot(page, '12-course');
  step('the course lists its parts, the current one open');

  await page.getByRole('link', { name: 'Practice', exact: true }).click();
  await page.getByRole('heading', { name: 'Practice', level: 1 }).waitFor();
  await page.getByRole('button', { name: /Up to 5 min/ }).click();
  await page.getByText(/^Showing \d+ of \d+ exercises/).waitFor();
  await shot(page, '13-practice');
  step('the practice library filters');

  await page.getByRole('link', { name: 'Library', exact: true }).click();
  await page.getByRole('heading', { name: 'Library', level: 1 }).waitFor();
  await page.getByRole('heading', { name: 'Example models' }).waitFor();
  await page.getByText(/Blender 4\.0/).first().waitFor();
  await shot(page, '14-library');
  step('the library lists the teachers\' resources, older Blender versions named, and the example models');

  await page.getByRole('link', { name: 'Credits' }).click();
  await page.getByRole('heading', { name: 'Teachers and credits' }).waitFor();
  await shot(page, '15-credits');
  step('the credits name every teacher, example model and font');

  await page.getByRole('link', { name: 'Settings' }).click();
  await page.getByText('5.2.2').waitFor();
  await shot(page, '16-settings');
  await page.getByRole('radio', { name: 'Dark' }).check();
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
  await shot(page, '17-settings-dark');
  for (const [name, route] of [['18-lesson-2-dark', `#/lesson/${second.slug}`], ['19-course-dark', '#/course'], ['20-models-dark', '#/models'], ['21-library-dark', '#/library']]) {
    await page.goto(`${base}/${route}`, { waitUntil: 'networkidle' });
    await shot(page, name);
  }
  await page.goto(`${base}/#/do/${second.exercise}`, { waitUntil: 'networkidle' });
  await page.locator('.reference-model img').waitFor();
  await shot(page, '22-exercise-2-dark', { full: false });
  await finishExercise(page);
  await page.getByRole('heading', { name: 'Saved' }).waitFor();
  await shot(page, '23-exercise-2-measured-dark');
  step('the dark theme applies');

  // Every written lesson and every practice item renders, in light.
  await page.goto(`${base}/#/settings`, { waitUntil: 'networkidle' });
  await page.getByRole('radio', { name: 'Light' }).check();
  for (const lesson of Object.values(content.lessons)) {
    await page.goto(`${base}/#/lesson/${lesson.slug}`, { waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: `Lesson ${lesson.number}: ${lesson.title}`, level: 1 }).waitFor();
    await shot(page, `lesson-${String(lesson.number).padStart(3, '0')}-${lesson.slug}`);
  }
  for (const item of Object.values(content.practice)) {
    await page.goto(`${base}/#/do/${item.id}`, { waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: item.title, level: 1 }).waitFor();
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(out, `practice-${item.id}.png`) });
  }
  await page.goto(`${base}/#/free/3`, { waitUntil: 'networkidle' });
  await page.locator('.reference-prompt').waitFor();
  await shot(page, '24-modelling-prompt', { full: false });
  step('every written lesson, every practice item and a modelling prompt render');
  await context.close();

  // Narrow windows, both themes: the same flow in short.
  for (const scheme of ['light', 'dark']) {
    const narrow = await open(390, scheme);
    const p = narrow.page;
    await p.goto(`${base}/`, { waitUntil: 'networkidle' });
    await waitForSplash(p);
    await p.getByRole('heading', { name: 'Welcome to Dimensio' }).waitFor();
    await shot(p, `30-narrow-welcome-${scheme}`);
    await p.goto(`${base}/#/lesson/${first.slug}`, { waitUntil: 'networkidle' });
    await shot(p, `31-narrow-lesson-${scheme}`);
    await p.goto(`${base}/#/do/${second.exercise}`, { waitUntil: 'networkidle' });
    await p.locator('.reference-model img').waitFor();
    await shot(p, `32-narrow-exercise-${scheme}`, { full: false });
    await finishExercise(p);
    await p.getByRole('heading', { name: 'Saved' }).waitFor();
    await shot(p, `33-narrow-measured-${scheme}`);
    await p.goto(`${base}/#/models`, { waitUntil: 'networkidle' });
    await p.locator('.page-grid a').first().click();
    await p.getByRole('heading', { name: 'Measurements' }).waitFor();
    await shot(p, `34-narrow-model-${scheme}`);
    for (const [name, route] of [['35-narrow-home', '#/'], ['36-narrow-course', '#/course'], ['37-narrow-practice', '#/practice'], ['38-narrow-library', '#/library'], ['39-narrow-settings', '#/settings']]) {
      await p.goto(`${base}/${route}`, { waitUntil: 'networkidle' });
      await shot(p, `${name}-${scheme}`);
    }
    await narrow.context.close();
  }
  step('narrow windows render in both themes');

  // The real course is 126 lessons in 16 parts.
  for (const [width, scheme] of [[1440, 'light'], [390, 'light'], [390, 'dark']]) {
    const long = await open(width, scheme, { long: true });
    const p = long.page;
    await p.goto(`${base}/#/welcome`, { waitUntil: 'networkidle' });
    await waitForSplash(p);
    await p.getByText('Part 16:').waitFor();
    await shot(p, `40-long-welcome-${width}-${scheme}`);
    // "I've used Blender" opens the course with "I already know this" on every lesson.
    await p.getByRole('link', { name: 'Browse the course' }).click();
    await p.getByRole('heading', { name: 'Course', level: 1 }).waitFor();
    const opened = await p.locator('.course-part.open').count();
    if (opened !== 1) throw new Error(`a 16-part course should open one part, the one you're on, and opened ${opened}`);
    await p.getByRole('button', { name: 'I already know this' }).first().waitFor();
    await shot(p, `41-long-course-${width}-${scheme}`);
    await p.getByRole('button', { name: /Part 9:/ }).click();
    await p.locator('#part-9-lessons').waitFor();
    await shot(p, `42-long-course-part-9-${width}-${scheme}`);
    await p.getByRole('searchbox', { name: 'Find a lesson' }).fill('rigging');
    await p.getByText(/of \d+ lessons/).first().waitFor();
    await shot(p, `43-long-course-search-${width}-${scheme}`);
    await p.goto(`${base}/#/`, { waitUntil: 'networkidle' });
    await p.getByText('All 126 lessons.', { exact: false }).waitFor();
    await shot(p, `44-long-home-${width}-${scheme}`);
    await p.goto(`${base}/#/practice`, { waitUntil: 'networkidle' });
    await shot(p, `45-long-practice-${width}-${scheme}`);
    await long.context.close();
  }
  step('a course of 126 lessons in 16 parts stays readable');
} catch (error) {
  problems.push(`flow stopped: ${error.message.split('\n').slice(0, 3).join(' ')}`);
  await lastPage?.screenshot({ path: path.join(out, 'stopped-here.png'), fullPage: true }).catch(() => {});
} finally {
  await browser.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}

console.log(`\nScreenshots in ${path.relative(process.cwd(), out) || out}`);
if (problems.length) {
  console.error(problems.map((line) => `problem: ${line}`).join('\n'));
  process.exit(1);
}
console.log('No console errors, page errors or content-policy violations.');
