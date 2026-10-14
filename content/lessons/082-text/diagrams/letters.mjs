// Block letters for this lesson's diagrams. Not a diagram itself. Each letter is an outline in its
// own plane (X across, Y up, in metres for a letter 1 m tall), extruded into a solid the way a text
// object with Extrude is, then stood up to face the front like the sign in the exercise.

const OUTLINES = {
  I: [[0, 0], [0.22, 0], [0.22, 1], [0, 1]],
  N: [[0, 0], [0.2, 0], [0.2, 0.62], [0.58, 0], [0.78, 0], [0.78, 1], [0.58, 1], [0.58, 0.38], [0.2, 1], [0, 1]],
};
const WIDTH = { I: 0.22, N: 0.78 };

// A flat outline extruded `depth` metres each way along Z: a front face, a back face and a side
// face for every edge of the outline.
export function extrudeOutline(points, depth) {
  const n = points.length;
  const verts = [...points.map(([x, y]) => [x, y, depth]), ...points.map(([x, y]) => [x, y, -depth])];
  const faces = [[...Array(n).keys()], [...Array(n).keys()].map((i) => n + i).reverse()];
  for (let i = 0; i < n; i += 1) {
    const j = (i + 1) % n;
    faces.push([i, n + i, n + j, j]);
  }
  return { verts, faces };
}

// A word set in these letters, `size` metres tall, `depth` extruded each way, centred on X like
// Paragraph > Alignment > Center, then turned 90 degrees on X so it faces -Y (the front view).
export function word(text, { size = 1, depth = 0.05, gap = 0.12, standing = true } = {}) {
  const total = [...text].reduce((s, c) => s + WIDTH[c], 0) + gap * (text.length - 1);
  let x = -total / 2;
  const verts = [];
  const faces = [];
  for (const c of text) {
    const m = extrudeOutline(OUTLINES[c].map(([u, v]) => [(u + x) , v]), depth / size);
    const offset = verts.length;
    verts.push(...m.verts);
    faces.push(...m.faces.map((f) => f.map((i) => i + offset)));
    x += WIDTH[c] + gap;
  }
  const scaled = verts.map(([u, v, w]) => [u * size, v * size, w * size]);
  // Standing: the letter's Y becomes Z and its Z (towards the reader) becomes -Y.
  return { verts: standing ? scaled.map(([u, v, w]) => [u, -w, v]) : scaled, faces };
}

// The same word as one mesh per letter, left to right, so a view from the right can draw the far
// letters first.
export function letters(text, options = {}) {
  const all = word(text, options);
  const out = [];
  let start = 0;
  for (const c of text) {
    const n = OUTLINES[c].length;
    const count = 2 * n;
    const faces = all.faces.filter((f) => f.every((i) => i >= start && i < start + count)).map((f) => f.map((i) => i - start));
    out.push({ verts: all.verts.slice(start, start + count), faces });
    start += count;
  }
  return out;
}

// A rounded frame for one small view, with a label under it.
export function panel(kit, x, y, w, h, label) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="d-ui" stroke-width="1"/>`,
    label ? kit.text(x + w / 2, y + h + 16, label, { anchor: 'middle', size: 12 }) : '',
  ];
}
