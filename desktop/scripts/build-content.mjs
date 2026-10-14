// Builds public/content.json from the repository's content/ folder: the course, the written lessons
// with their diagrams, practice items, resources, example models and modelling prompts. It refuses
// to build anything that breaks the lesson format, a word budget or the copy rules in
// docs/course/WRITING.md. Ported from Delineare's scripts/build-content.mjs; the changes are the
// ones docs/course/PLAN.md lists under "The lesson format".
//
//   node scripts/build-content.mjs                    check and write public/content.json
//   node scripts/build-content.mjs --check            check only
//   node scripts/build-content.mjs --check --content <dir>   check another content folder
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import YAML from 'yaml';
import { marked } from 'marked';
import { isKeys, lintProse, words } from './copy-rules.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentFlag = process.argv.indexOf('--content');
const contentDir = contentFlag > 0 ? path.resolve(process.argv[contentFlag + 1]) : path.join(root, '..', 'content');
const repo = path.dirname(contentDir);
const publicDir = path.join(root, 'public');
const startersDir = path.join(repo, 'blender', 'starters');
const METRICS = JSON.parse(fs.readFileSync(path.join(root, 'src', 'course', 'engine', 'metrics.json'), 'utf8'));
const checkOnly = process.argv.includes('--check');

const errors = [];
const warnings = [];
const fail = (where, message) => errors.push(`${where}: ${message}`);
const warn = (where, message) => warnings.push(`${where}: ${message}`);

const BUDGET = { title: 5, summary: 15, intro: 70, step: 45, mistake: 50, exercise: 60, check: 15, lesson: 500 };
const KINDS = ['drill', 'warm-up', 'timed', 'copy', 'fix', 'project', 'imagination', 'retest'];
const SECTIONS = ['Steps', 'Common mistake', 'Checking your model'];
const VIEWS = ['persp', 'front', 'right', 'top'];
const ID = /^[a-z0-9-]+$/;

const readYaml = (file) => YAML.parse(fs.readFileSync(file, 'utf8'));
const yamlFiles = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir).filter((name) => name.endsWith('.yaml')).sort().map((name) => path.join(dir, name)) : []);

// ---- Inline text ------------------------------------------------------------------------------
// Lesson prose is stored as a small tree (text, strong, em, link, code) the app renders itself,
// so no HTML from content ever reaches the page. Code spans are keys, shown as key caps.

function inline(tokens = [], where = '') {
  const out = [];
  for (const token of tokens) {
    switch (token.type) {
      case 'text':
        if (token.tokens?.length) out.push(...inline(token.tokens, where));
        else out.push({ t: 'text', v: decode(token.text) });
        break;
      case 'escape': out.push({ t: 'text', v: decode(token.text) }); break;
      case 'strong': out.push({ t: 'strong', c: inline(token.tokens, where) }); break;
      case 'em': out.push({ t: 'em', c: inline(token.tokens, where) }); break;
      case 'codespan': {
        const keys = decode(token.text);
        if (where && !isKeys(keys)) warn(where, `\`${keys}\` is in backticks but is not a key. Backticks show as key caps; write menu paths and names as plain text.`);
        out.push({ t: 'code', v: keys });
        break;
      }
      case 'link':
        if (!/^https:\/\//.test(token.href)) fail(where || 'content', `link "${token.href}" must be https`);
        out.push({ t: 'link', href: token.href, c: inline(token.tokens, where) });
        break;
      case 'br': out.push({ t: 'text', v: ' ' }); break;
      case 'image': break;
      default: throw new Error(`unsupported inline markdown: ${token.type}`);
    }
  }
  return out;
}

const decode = (text) => text.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const plain = (nodes) => nodes.map((node) => (node.c ? plain(node.c) : node.v)).join('');
const images = (tokens = []) => tokens.flatMap((token) => (token.type === 'image' ? [{ name: token.href, alt: decode(token.text) }] : images(token.tokens || [])));

// Turns markdown text into paragraphs of inline nodes.
function paragraphs(markdown, where = '') {
  return marked.lexer(String(markdown ?? '').trim()).filter((token) => token.type === 'paragraph').map((token) => inline(token.tokens, where));
}

// ---- Prose checks -----------------------------------------------------------------------------

function checkProse(where, text, budget) {
  for (const finding of lintProse(text)) {
    const line = `${finding.rule} ("${finding.match}"). ${finding.why}`;
    if (finding.level === 'error') fail(where, line);
    else warn(where, line);
  }
  if (budget && words(text) > budget) fail(where, `${words(text)} words, over the budget of ${budget}.`);
  return words(text);
}

// ---- Diagrams ---------------------------------------------------------------------------------

const lib = await import(pathToFileURL(path.join(contentDir, 'diagrams', 'lib.mjs')).href);

// A diagram is named by its script in the lesson's diagrams/ folder ("numpad"), or by another
// lesson's folder and name ("001-viewport-navigation/numpad"). "diagrams/" and ".mjs" may be
// written out. Its id is the owning lesson's slug and the name, so it stays the same when lessons
// are renumbered.
function diagramFile(folder, ref) {
  const clean = String(ref ?? '').trim().replace(/^\.\//, '').replace(/\.mjs$/, '');
  let match = /^(?:diagrams\/)?([a-z0-9-]+)$/.exec(clean);
  if (match) return { folder, name: match[1] };
  match = /^(?:\.\.\/)?(\d{3}-[a-z0-9-]+)\/(?:diagrams\/)?([a-z0-9-]+)$/.exec(clean);
  if (match) return { folder: path.join(lessonsDir, match[1]), name: match[2] };
  return null;
}

async function diagram(lessonFolder, ref, alt, where) {
  const found = diagramFile(lessonFolder, ref);
  const folder = found?.folder;
  const name = found?.name ?? String(ref);
  const file = found ? path.join(folder, 'diagrams', `${name}.mjs`) : '';
  if (!found || !fs.existsSync(file)) {
    fail(where, `diagram "${ref}" has no ${found && folder !== lessonFolder ? `${path.basename(folder)}/` : ''}diagrams/${name}.mjs`);
    return null;
  }
  const slug = path.basename(folder).replace(/^\d{3}-/, '');
  const module = await import(`${pathToFileURL(file).href}?v=${fs.statSync(file).mtimeMs}`);
  const svg = module.default(lib);
  if (typeof svg !== 'string' || !svg.startsWith('<svg') || /<script|on\w+=/i.test(svg)) {
    fail(where, `diagrams/${name}.mjs did not return plain SVG markup`);
    return null;
  }
  if (alt !== undefined && !alt.trim()) fail(where, `diagram "${name}" needs a description in its alt text`);
  return { id: `${slug}/${name}`, svg, alt: alt ?? '' };
}

// ---- Lessons ----------------------------------------------------------------------------------

function splitFrontMatter(source, where) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    fail(where, 'missing front matter between --- lines');
    return { meta: {}, body: source };
  }
  return { meta: YAML.parse(match[1]) || {}, body: match[2] };
}

// The first strong run of a list item is its title ("**Orbit.** Hold the middle mouse button"),
// the rest its text.
function titled(nodes) {
  const [first, ...rest] = nodes;
  if (!first || first.t !== 'strong') return null;
  const title = plain(first.c).trim().replace(/[.:]$/, '');
  const text = [...rest];
  if (text[0]?.t === 'text') text[0] = { t: 'text', v: text[0].v.replace(/^\s+/, '') };
  return { title, text };
}

function itemTokens(item) {
  return item.tokens.flatMap((token) => (token.type === 'paragraph' || token.type === 'text' ? [token] : []));
}

async function readLesson(folder, entry, diagrams) {
  const slug = entry.slug;
  const where = `content/lessons/${path.basename(folder)}`;
  const { meta, body } = splitFrontMatter(fs.readFileSync(path.join(folder, 'lesson.md'), 'utf8'), where);
  const tokens = marked.lexer(body).filter((token) => token.type !== 'space');
  const lesson = { slug, number: entry.number, part: entry.part, title: entry.title, summary: entry.summary, intro: [], needs: [], steps: [], howNotes: [], mistake: null, checkIntro: [], checks: [], checkNotes: [], watch: [], exercise: '', practice: [], example: null };
  let prose = 0;

  // The title must match the course file, which is its one source. Then the introduction: one to
  // three plain sentences saying what the lesson teaches, before any picture or section.
  const [h1, ...afterTitle] = tokens;
  if (h1?.type !== 'heading' || h1.depth !== 1 || h1.text.trim() !== entry.title) fail(where, `the first line must be "# ${entry.title}" (from course.yaml)`);
  let rest = afterTitle;
  while (rest[0]?.type === 'paragraph' && !images([rest[0]]).length) {
    lesson.intro.push(inline(rest[0].tokens, `${where}, introduction`));
    rest = rest.slice(1);
  }
  if (!lesson.intro.length) fail(where, 'the paragraph after the title must be the introduction');
  prose += checkProse(`${where}, introduction`, lesson.intro.map(plain).join(' '), BUDGET.intro);
  // An optional example picture follows the introduction.
  if (rest[0]?.type === 'paragraph' && images([rest[0]]).length) {
    const exampleImage = images([rest[0]])[0];
    const art = await diagram(folder, exampleImage.name, exampleImage.alt, where);
    if (art) diagrams.set(art.id, art);
    lesson.example = art?.id ?? null;
    rest = rest.slice(1);
  }

  // Sections.
  const sections = new Map();
  let current = null;
  for (const token of rest) {
    if (token.type === 'heading' && token.depth === 2) {
      if (!SECTIONS.includes(token.text.trim())) fail(where, `unknown section "## ${token.text}". Sections are: ${SECTIONS.join(', ')}`);
      current = token.text.trim();
      sections.set(current, []);
    } else if (current) sections.get(current).push(token);
    else fail(where, `unexpected ${token.type} before the first section`);
  }
  for (const required of ['Steps', 'Checking your model']) if (!sections.has(required)) fail(where, `missing "## ${required}"`);

  for (const token of sections.get('Steps') || []) {
    if (token.type === 'list') {
      if (!token.ordered) fail(where, 'Steps must be a numbered list');
      if (token.items.length < 3 || token.items.length > 6) fail(where, `Steps has ${token.items.length} steps; it needs 3 to 6`);
      for (const item of token.items) {
        const parts = itemTokens(item);
        const at = `${where}, step "${item.text.slice(0, 30)}"`;
        const parsed = titled(inline(parts[0]?.tokens || [], at));
        if (!parsed) { fail(where, `a step must start with a bold title, "**Orbit.** ..." ("${item.text.slice(0, 40)}")`); continue; }
        const more = parts.slice(1).flatMap((t) => inline(t.tokens || [], at));
        const text = more.length ? [...parsed.text, { t: 'text', v: ' ' }, ...more] : parsed.text;
        prose += checkProse(`${where}, step "${parsed.title}"`, `${parsed.title}. ${plain(text)}`, BUDGET.step);
        const image = images(item.tokens)[0];
        const art = image ? await diagram(folder, image.name, image.alt, where) : null;
        if (art) diagrams.set(art.id, art);
        lesson.steps.push({ title: parsed.title, text, diagram: art?.id ?? null });
      }
    } else if (token.type === 'paragraph') {
      prose += checkProse(`${where}, note under Steps`, token.text);
      lesson.howNotes.push(inline(token.tokens, `${where}, note under Steps`));
    } else fail(where, `Steps holds the numbered steps and short notes, not a ${token.type}`);
  }

  // Common mistake is optional; when present it has text and may have a wrong-and-right diagram.
  if (sections.has('Common mistake')) {
    const mistake = sections.get('Common mistake');
    const mistakeImage = images(mistake)[0];
    const mistakeArt = mistakeImage ? await diagram(folder, mistakeImage.name, mistakeImage.alt, where) : null;
    if (mistakeArt) diagrams.set(mistakeArt.id, mistakeArt);
    const mistakeText = mistake.filter((token) => token.type === 'paragraph' && !images([token]).length);
    if (!mistakeText.length) fail(where, 'Common mistake needs a paragraph saying what goes wrong');
    prose += checkProse(`${where}, common mistake`, mistakeText.map((token) => token.text).join(' '), BUDGET.mistake);
    lesson.mistake = { diagram: mistakeArt?.id ?? null, text: mistakeText.map((token) => inline(token.tokens, `${where}, common mistake`)) };
  }

  let seenList = false;
  for (const token of sections.get('Checking your model') || []) {
    if (token.type === 'list') {
      if (seenList) fail(where, 'Checking your model holds one list');
      seenList = true;
      if (token.items.length < 3 || token.items.length > 5) fail(where, `Checking your model has ${token.items.length} items; it needs 3 to 5`);
      for (const item of token.items) {
        const nodes = inline(itemTokens(item).flatMap((t) => t.tokens || []), `${where}, check`);
        prose += checkProse(`${where}, check "${plain(nodes).slice(0, 30)}"`, plain(nodes), BUDGET.check);
        lesson.checks.push(nodes);
      }
    } else if (token.type === 'paragraph') {
      prose += checkProse(`${where}, note under Checking your model`, token.text);
      (seenList ? lesson.checkNotes : lesson.checkIntro).push(inline(token.tokens, `${where}, note under Checking your model`));
    } else fail(where, `Checking your model holds a list and short notes, not a ${token.type}`);
  }

  // Front matter: what the lesson needs, its exercise, and what to watch.
  lesson.needs = (meta.needs || []).map(String);
  lesson.exercise = String(meta.exercise || '');
  lesson.watch = (meta.watch || []).map(String);
  if (!lesson.exercise) fail(where, 'front matter needs "exercise:", the id of the main practice item');
  if (lesson.watch.length < 1 || lesson.watch.length > 2) fail(where, 'front matter "watch:" lists one or two resources');
  if (!Array.isArray(meta.sources) || !meta.sources.length) fail(where, 'front matter "sources:" must name where the method comes from');
  return { lesson, prose };
}

// One measurement to run on a learner's model after they tick their own checks:
// { metric: ngons, max: 0, label: "No n-gons" }. The metric is a name from the report in
// docs/course/PLAN.md ("Measurement"), and the limit's type follows the metric. A count is of the
// model after modifiers; "base.ngons" is the same count before them.
function readMeasure(at, raw) {
  if (!raw || typeof raw !== 'object') { fail(at, 'a measure is { metric, max | min | equals, label }'); return null; }
  for (const key of Object.keys(raw)) if (!['metric', 'max', 'min', 'equals', 'label'].includes(key)) fail(at, `a measure has an unexpected key "${key}"`);
  const name = String(raw.metric ?? '');
  const before = name.startsWith('base.');
  const metric = METRICS[before ? name.slice(5) : name];
  if (!metric || (before && metric.from !== 'sum')) {
    const counts = Object.keys(METRICS).filter((key) => METRICS[key].from === 'sum');
    fail(at, `unknown metric "${name}". Metrics are: ${Object.keys(METRICS).join(', ')}, and base.<count> for ${counts.join(', ')} before modifiers`);
    return null;
  }
  const limits = ['max', 'min', 'equals'].filter((key) => raw[key] !== undefined);
  if (limits.length !== 1) fail(at, `measure "${raw.metric}" needs exactly one of max, min or equals`);
  const limit = limits[0];
  const value = raw[limit];
  if (metric.kind === 'flag' && (limit !== 'equals' || typeof value !== 'boolean')) fail(at, `measure "${raw.metric}" takes equals: true or equals: false`);
  if (metric.kind === 'text' && (limit !== 'equals' || !metric.values.includes(value))) fail(at, `measure "${raw.metric}" takes equals: ${metric.values.join(' or ')}`);
  if ((metric.kind === 'size' || metric.kind === 'problem') && !(Number.isInteger(value) && value >= 0)) fail(at, `measure "${raw.metric}" needs a whole number limit`);
  const label = String(raw.label || '');
  if (!label) fail(at, `measure "${raw.metric}" needs a label, a plain fact such as "No n-gons"`);
  else if (words(label) > 8) fail(at, `measure label "${label}" is over 8 words`);
  checkProse(`${at}, measure label`, label);
  return { metric: raw.metric, [limit]: value, label };
}

async function readPractice(folder, lesson, diagrams, practice) {
  const where = `content/lessons/${path.basename(folder)}/practice.yaml`;
  const file = path.join(folder, 'practice.yaml');
  if (!fs.existsSync(file)) { fail(where, 'missing'); return 0; }
  const items = readYaml(file) || [];
  let mainWords = 0;
  const ITEM_KEYS = ['id', 'main', 'title', 'kind', 'minutes', 'text', 'steps', 'timer', 'reference', 'starter', 'measure', 'check'];
  const strict = (at, value, allowed, what) => {
    for (const key of Object.keys(value || {})) {
      if (!allowed.includes(key)) fail(at, `${what} has an unexpected key "${key}". A comma in an unquoted value inside { } ends it early, so quote the value.`);
    }
  };
  for (const raw of items) {
    const at = `${where}, ${raw.id}`;
    strict(at, raw, ITEM_KEYS, 'the item');
    strict(at, raw.timer, ['minutes', 'rounds'], 'timer');
    for (const round of raw.timer?.rounds || []) strict(at, round, ['label', 'minutes', 'seconds'], 'a timer round');
    strict(at, raw.reference, ['diagram', 'alt', 'prompt', 'images', 'model'], 'reference');
    if (!ID.test(raw.id || '')) { fail(where, `bad practice id "${raw.id}"`); continue; }
    if (practice.has(raw.id)) fail(at, 'duplicate practice id');
    if (!KINDS.includes(raw.kind)) fail(at, `kind must be one of ${KINDS.join(', ')}`);
    if (!(raw.minutes > 0)) fail(at, 'minutes must be a positive number');
    if (!raw.title || words(raw.title) > 6) fail(at, 'title is required and at most 6 words');
    checkProse(`${at}, title`, raw.title || '');
    const textWords = checkProse(at, raw.text || '', BUDGET.exercise);
    if (raw.main) mainWords = textWords;
    const timer = raw.timer || {};
    let rounds;
    if (Array.isArray(timer.rounds)) {
      rounds = timer.rounds.map((round) => ({ label: String(round.label || ''), seconds: Math.round((round.seconds ?? round.minutes * 60) || 0) }));
      if (rounds.some((round) => !(round.seconds > 0))) fail(at, 'every timer round needs seconds or minutes');
      for (const round of rounds) if (round.label) checkProse(`${at}, round "${round.label}"`, round.label);
    } else if (timer.minutes > 0) rounds = [{ label: '', seconds: Math.round(timer.minutes * 60) }];
    else fail(at, 'timer needs minutes or rounds');

    let reference = { type: 'none' };
    if (raw.reference?.diagram) {
      const art = await diagram(folder, raw.reference.diagram, raw.reference.alt, at);
      if (art) {
        const alt = art.alt || diagrams.get(art.id)?.alt || '';
        if (!alt) fail(at, `reference diagram "${raw.reference.diagram}" needs "alt:" because the lesson page does not describe it`);
        diagrams.set(art.id, { ...art, alt });
        reference = { type: 'diagram', diagram: art.id };
      }
    } else if (raw.reference?.model !== undefined) {
      // An example model from content/references/, shown as its renders and opened in Blender.
      const id = String(raw.reference.model);
      if (!models.has(id)) fail(at, `reference model "${id}" has no entry in content/references/*.yaml`);
      reference = { type: 'model', model: id, prompt: raw.reference.prompt ? String(raw.reference.prompt) : '' };
      if (raw.reference.prompt) checkProse(`${at}, reference prompt`, String(raw.reference.prompt));
    } else if (Array.isArray(raw.reference?.images)) {
      // Pictures to model from, each a file in public/reference/ with a credit in content/references/.
      const pics = raw.reference.images.map((file) => {
        const credit = pictures.get(file);
        if (!credit) fail(at, `reference image "${file}" has no entry in content/references/*.yaml`);
        return { src: `./reference/${file}`, credit: credit?.credit ?? '', alt: credit?.alt ?? '' };
      });
      if (!pics.length) fail(at, 'reference images: list at least one file');
      reference = { type: 'images', images: pics, prompt: raw.reference.prompt ? String(raw.reference.prompt) : '' };
    } else if (raw.reference?.prompt) {
      checkProse(`${at}, reference prompt`, String(raw.reference.prompt));
      reference = { type: 'prompt', prompt: String(raw.reference.prompt) };
    }

    // A starter is a script in blender/starters/ that builds the exercise's starting file:
    // `starter: unapplied-scale`, or `starter: { id: reference-images, imageFront: car-front.png }`
    // with options for it. An option naming a file in public/reference/ is passed as that file.
    // copy-reference gets the item's example model as its reference unless it names one. The
    // scripts are written beside blender/dimensio_starter.py, so a missing one is reported, not fatal.
    let starter = null;
    if (raw.starter !== undefined) {
      const given = typeof raw.starter === 'object' && raw.starter !== null ? raw.starter : { id: raw.starter };
      const id = String(given.id ?? '');
      const options = {};
      for (const [name, value] of Object.entries(given)) {
        if (name === 'id') continue;
        if (!/^[a-z][A-Za-z0-9]{0,40}$/.test(name)) fail(at, `starter option "${name}" must be camelCase, like imageFront`);
        else if (typeof value === 'number' || typeof value === 'boolean') options[name] = value;
        else if (typeof value === 'string' && /\.(blend|glb|gltf|fbx|obj|png|jpe?g|webp)$/i.test(value)) {
          if (value.includes('..') || !fs.existsSync(path.join(publicDir, 'reference', value))) fail(at, `starter option ${name}: "${value}" must be a file in public/reference/`);
          options[name] = `reference/${value}`;
        } else if (typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9 _.,]{0,79}$/.test(value)) options[name] = value;
        else fail(at, `starter option ${name} must be a number, a word or a file in public/reference/`);
      }
      if (id === 'copy-reference' && options.reference === undefined && raw.reference?.model !== undefined && models.has(String(raw.reference.model))) {
        options.reference = models.get(String(raw.reference.model)).file;
      }
      if (!ID.test(id)) fail(at, `starter "${id}" must be an id like "unapplied-scale"`);
      else if (!fs.existsSync(path.join(startersDir, `${id}.py`))) warn(at, `starter "${id}" has no blender/starters/${id}.py in this checkout`);
      starter = { id, options };
    }

    if (raw.measure !== undefined && !Array.isArray(raw.measure)) fail(at, 'measure is a list of { metric, max | min | equals, label }');
    const measure = (Array.isArray(raw.measure) ? raw.measure : []).map((entry) => readMeasure(at, entry)).filter(Boolean);

    const check = (raw.check || []).map((line) => { checkProse(`${at}, check`, line, BUDGET.check); return paragraphs(line, `${at}, check`)[0] || []; });
    if (!raw.main && (check.length < 1 || check.length > 3)) fail(at, 'a practice item needs 1 to 3 checks of its own');
    for (const step of raw.steps || []) checkProse(`${at}, step`, step);
    practice.set(raw.id, {
      id: raw.id, lesson: lesson.slug, main: Boolean(raw.main), title: raw.title, kind: raw.kind, minutes: raw.minutes,
      text: paragraphs(raw.text, at), steps: (raw.steps || []).map(String), rounds, reference, starter, measure, check,
    });
    lesson.practice.push(raw.id);
  }
  const main = items.filter((item) => item.main);
  if (main.length !== 1 || main[0].id !== lesson.exercise) fail(where, `exactly one item is main, and it is the lesson's exercise "${lesson.exercise}"`);
  return mainWords;
}

// ---- Resources and prompts --------------------------------------------------------------------

function readResources() {
  const where = 'content/resources';
  const resources = new Map();
  const files = [path.join(contentDir, 'resources.yaml'), ...yamlFiles(path.join(contentDir, 'resources'))].filter((file) => fs.existsSync(file));
  for (const raw of files.flatMap((file) => readYaml(file) || [])) {
    const at = `${where}, ${raw.id}`;
    for (const key of Object.keys(raw)) if (!['id', 'title', 'teacher', 'url', 'kind', 'minutes', 'youtube', 'cost', 'checked', 'blender'].includes(key)) fail(at, `unexpected key "${key}"; quote values that contain a comma or colon`);
    if (resources.has(raw.id)) fail(at, 'duplicate id');
    if (!/^https:\/\//.test(raw.url || '')) fail(at, 'url must be https');
    if (!['free', 'paid'].includes(raw.cost)) fail(at, 'cost is free or paid');
    if (!raw.title || !raw.teacher || !raw.kind) fail(at, 'title, teacher and kind are required');
    if (raw.youtube && !/^[\w-]{11}$/.test(raw.youtube)) fail(at, 'youtube must be an 11-character video id');
    if (raw.blender !== undefined && !/^\d+\.\d+$/.test(String(raw.blender))) fail(at, 'blender is the version the resource was made with, quoted, like "4.2"');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(raw.checked || ''))) fail(at, 'checked must be the date someone last opened it, YYYY-MM-DD');
    resources.set(raw.id, { id: raw.id, title: raw.title, teacher: raw.teacher, url: raw.url, kind: raw.kind, minutes: raw.minutes ?? null, youtube: raw.youtube ?? null, cost: raw.cost, checked: String(raw.checked), blender: raw.blender === undefined ? null : String(raw.blender) });
  }
  return resources;
}

// content/references/*.yaml holds two kinds of entry. An example model has an id: a .blend file
// and its renders in public/reference/, with credit and licence. A picture has only a file: an
// image in public/reference/ to model from. Both say where they came from and under what licence.
const LICENCES = ['public domain', 'CC0'];

function readReferences() {
  const models = new Map();
  const pictures = new Map();
  const exists = (file) => typeof file === 'string' && !file.includes('..') && fs.existsSync(path.join(publicDir, 'reference', file));
  for (const file of yamlFiles(path.join(contentDir, 'references'))) {
    const name = path.basename(file);
    for (const raw of readYaml(file) || []) {
      if (raw.id !== undefined) {
        const at = `content/references/${name}, ${raw.id}`;
        for (const key of Object.keys(raw)) if (!['id', 'title', 'file', 'renders', 'credit', 'alt', 'source', 'licence', 'made'].includes(key)) fail(at, `unexpected key "${key}"; quote values that contain a comma or colon`);
        if (!ID.test(String(raw.id))) fail(at, 'id must be lower case letters, digits and dashes');
        if (models.has(raw.id)) fail(at, 'listed twice');
        if (!raw.title || words(String(raw.title)) > 6) fail(at, 'title is required and at most 6 words');
        if (!/\.blend$/.test(raw.file || '') || !exists(raw.file)) fail(at, 'file must be a .blend in public/reference/');
        const renders = {};
        for (const [view, render] of Object.entries(raw.renders || {})) {
          if (!VIEWS.includes(view)) fail(at, `renders has an unknown view "${view}". Views are: ${VIEWS.join(', ')}`);
          else if (!exists(render)) fail(at, `render "${render}" must exist in public/reference/`);
          else renders[view] = `./reference/${render}`;
        }
        if (!renders.persp) fail(at, 'renders needs at least persp, the picture shown first');
        if (!raw.credit || !raw.alt) fail(at, 'credit (who made it) and alt (what the model is) are required');
        if (raw.source !== undefined && !/^https:\/\//.test(raw.source)) fail(at, 'source must be the https page the model came from');
        if (raw.source === undefined && !raw.made) fail(at, 'a model needs source (where it came from) or made (the script in this repository that builds it)');
        if (raw.made !== undefined && !fs.existsSync(path.join(repo, String(raw.made)))) fail(at, `made names "${raw.made}", which does not exist`);
        if (!LICENCES.includes(raw.licence)) fail(at, `licence must be ${LICENCES.map((l) => `"${l}"`).join(' or ')}`);
        checkProse(`${at}, alt`, String(raw.alt || ''));
        models.set(String(raw.id), { id: String(raw.id), title: String(raw.title), file: `reference/${raw.file}`, renders, credit: String(raw.credit), alt: String(raw.alt), licence: raw.licence, source: raw.source ?? null });
      } else {
        const at = `content/references/${name}, ${raw.file}`;
        for (const key of Object.keys(raw)) if (!['file', 'credit', 'alt', 'source', 'licence'].includes(key)) fail(at, `unexpected key "${key}"; quote values that contain a comma or colon`);
        if (!exists(raw.file)) fail(at, 'file must exist in public/reference/');
        if (!raw.credit || !raw.alt) fail(at, 'credit (artist, title, date) and alt (what the picture shows) are required');
        if (!/^https:\/\//.test(raw.source || '')) fail(at, 'source must be the https page the picture came from');
        if (!LICENCES.includes(raw.licence)) fail(at, `licence must be ${LICENCES.map((l) => `"${l}"`).join(' or ')}`);
        if (pictures.has(raw.file)) fail(at, 'listed twice');
        pictures.set(raw.file, { credit: String(raw.credit), alt: String(raw.alt) });
      }
    }
  }
  return { models, pictures };
}

function readPrompts() {
  const prompts = readYaml(path.join(contentDir, 'prompts.yaml')) || {};
  for (const key of ['subjects', 'twists', 'limits']) {
    if (!Array.isArray(prompts[key]) || prompts[key].length < 5) fail('content/prompts.yaml', `${key} needs at least five entries`);
    for (const entry of prompts[key] || []) checkProse(`content/prompts.yaml, ${key}`, entry);
  }
  return { subjects: prompts.subjects || [], twists: prompts.twists || [], limits: prompts.limits || [] };
}

// ---- Course -----------------------------------------------------------------------------------

const course = readYaml(path.join(contentDir, 'course.yaml'));
// A written lesson is a folder named NNN-slug: three digits, its place in course.yaml.
const lessonsDir = path.join(contentDir, 'lessons');
const folders = new Map();
for (const entry of (fs.existsSync(lessonsDir) ? fs.readdirSync(lessonsDir, { withFileTypes: true }) : [])
  .filter((item) => item.isDirectory() && !/^[._]/.test(item.name))
  .sort((a, b) => a.name.localeCompare(b.name))) {
  const match = /^(\d{3})-([a-z0-9-]+)$/.exec(entry.name);
  if (!match) { fail(`content/lessons/${entry.name}`, 'a lesson folder is named NNN-slug, with three digits: 007-extrude'); continue; }
  if (folders.has(match[2])) { fail(`content/lessons/${entry.name}`, `a second folder for "${match[2]}"`); continue; }
  folders.set(match[2], { folder: path.join(lessonsDir, entry.name), number: Number(match[1]) });
}

const parts = [];
const lessons = {};
const diagrams = new Map();
const practice = new Map();
const resources = readResources();
const { models, pictures } = readReferences();
const slugs = new Set();
let number = 0;

for (const [index, part] of (course.parts || []).entries()) {
  const entries = [];
  if (!part.title) fail(`content/course.yaml, part ${index + 1}`, 'title is required');
  for (const raw of part.lessons || []) {
    number += 1;
    for (const key of Object.keys(raw)) if (!['slug', 'title', 'summary'].includes(key)) fail(`content/course.yaml, ${raw.slug}`, `unexpected key "${key}"; quote values that contain a comma`);
    const entry = { slug: raw.slug, number, part: index + 1, title: raw.title, summary: raw.summary };
    const at = `content/course.yaml, ${raw.slug}`;
    if (!ID.test(raw.slug || '')) fail(at, 'slug must be lower case letters, digits and dashes');
    if (slugs.has(raw.slug)) fail(at, 'duplicate slug');
    slugs.add(raw.slug);
    if (words(raw.title || '') > BUDGET.title) fail(at, `title over ${BUDGET.title} words`);
    if (/[:()]/.test(raw.title || '')) fail(at, 'a title has no colon or brackets');
    checkProse(`${at}, title`, raw.title || '');
    if (!raw.summary) fail(at, 'summary is required: one plain sentence for the course page');
    checkProse(`${at}, summary`, raw.summary || '', BUDGET.summary);
    const found = folders.get(raw.slug);
    const folder = found?.folder;
    if (found) {
      const expectedFolder = `${String(number).padStart(3, '0')}-${raw.slug}`;
      if (found.number !== number) fail(`content/lessons/${path.basename(folder)}`, `this is lesson ${number} in course.yaml, so the folder is ${expectedFolder}`);
      const { lesson, prose } = await readLesson(folder, entry, diagrams);
      const exerciseWords = await readPractice(folder, lesson, diagrams, practice);
      const total = prose + exerciseWords;
      if (total > BUDGET.lesson) fail(`content/lessons/${path.basename(folder)}`, `${total} words of lesson prose, over the budget of ${BUDGET.lesson}`);
      lesson.prose = total;
      lessons[raw.slug] = lesson;
    }
    entries.push({ ...entry, written: Boolean(folder) });
  }
  parts.push({ number: index + 1, title: part.title, lessons: entries });
}

for (const [slug, found] of folders) if (!slugs.has(slug)) fail(`content/lessons/${path.basename(found.folder)}`, 'folder has no entry in course.yaml');
if (number > 999) fail('content/course.yaml', 'more than 999 lessons do not fit three-digit folders');
for (const lesson of Object.values(lessons)) {
  for (const need of lesson.needs) if (!slugs.has(need)) fail(`lesson ${lesson.slug}`, `needs unknown lesson "${need}"`);
  for (const id of lesson.watch) if (!resources.has(id)) fail(`lesson ${lesson.slug}`, `watch lists unknown resource "${id}"`);
}
// "needs" must point backwards, which also rules out loops.
const order = new Map(parts.flatMap((part) => part.lessons).map((entry) => [entry.slug, entry.number]));
for (const lesson of Object.values(lessons)) for (const need of lesson.needs) if (order.get(need) >= lesson.number) fail(`lesson ${lesson.slug}`, `needs "${need}", which comes later`);

const prompts = readPrompts();

for (const line of warnings) console.warn(`warning  ${line}`);
if (errors.length) {
  for (const line of errors) console.error(`error    ${line}`);
  console.error(`\n${errors.length} content error${errors.length === 1 ? '' : 's'}. Nothing was written.`);
  process.exit(1);
}

const written = Object.values(lessons);
console.log(`Content: ${number} lessons in ${parts.length} parts, ${written.length} written (${written.map((lesson) => `${lesson.number}: ${lesson.prose} words`).join(', ')}), ${practice.size} practice items, ${resources.size} resources, ${models.size} example models, ${diagrams.size} diagrams.`);
if (!checkOnly) {
  const output = { format: 1, parts, lessons, practice: Object.fromEntries(practice), resources: Object.fromEntries(resources), references: Object.fromEntries(models), diagrams: Object.fromEntries(diagrams), prompts };
  fs.mkdirSync(publicDir, { recursive: true });
  fs.writeFileSync(path.join(publicDir, 'content.json'), `${JSON.stringify(output)}\n`);
}
