// The lesson's crate at each stage, built the way the steps build it: 0.5 m across, a 1 cm chamfer,
// a 0.04 m inset and panels sunk 0.025 m. Not a diagram itself.
// The diagonal on each side is the one Ctrl+T (Triangulate Faces, Beauty) picks in Blender 5.2.2.
import { bevelledBox, cube, translate, extrude, normal, centroid } from '../../../diagrams/mesh.mjs';

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const len = (a) => Math.hypot(...a);

// Ends of each side's diagonal, as signs of the corner on the side's two other axes.
const DIAGONAL = {
  '-0': [[1, -1], [-1, 1]], '+0': [[-1, -1], [1, 1]],
  '-1': [[-1, -1], [1, 1]], '+1': [[1, -1], [-1, 1]],
  '-2': [[-1, -1], [1, 1]], '+2': [[1, -1], [-1, 1]],
};

// Insets a triangle by an even border `t`, as Inset Faces with Offset Even does: the inner
// triangle is the face scaled about its incentre. Returns the inner face's index.
function insetTriangle(m, fi, t) {
  const [a, b, c] = m.faces[fi].map((i) => m.verts[i]);
  const la = len(sub(b, c)); const lb = len(sub(c, a)); const lc = len(sub(a, b));
  const p = la + lb + lc;
  const centre = mul(add(add(mul(a, la), mul(b, lb)), mul(c, lc)), 1 / p);
  const area = len([(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])]) / 2;
  const r = (2 * area) / p;
  const k = (r - t) / r;
  const face = m.faces[fi];
  const inner = face.map((i) => m.verts.push(add(centre, mul(sub(m.verts[i], centre), k))) - 1);
  face.forEach((i, j) => { const n = (j + 1) % face.length; m.faces.push([i, face[n], inner[n], inner[j]]); });
  m.faces[fi] = inner;
  return fi;
}

// stage: 'cube' (2 m default cube), 'sized', 'chamfer', 'faces' (six big faces picked out),
// 'split', 'inset', 'done'. region: inset each side's two triangles as one shape (the mistake).
export function crate(stage = 'done', { region = false, size = 0.5, chamfer = 0.01, border = 0.04, depth = 0.025 } = {}) {
  if (stage === 'cube') return { mesh: cube(2), picked: [] };
  if (stage === 'sized') return { mesh: translate(cube(size), [0, 0, size / 2]), picked: [] };
  const m = bevelledBox({ size: [size, size, size], width: chamfer, center: [0, 0, size / 2] });
  const big = [0, 1, 2, 3, 4, 5];
  if (stage === 'chamfer') return { mesh: m, picked: m.faces.map((_, i) => i).filter((i) => i > 5) };
  if (stage === 'faces') return { mesh: m, picked: big };
  // Split each big face along its diagonal.
  const tris = [];
  for (const fi of big) {
    const n = normal(m, m.faces[fi]);
    const axis = n.findIndex((x) => Math.abs(x) > 0.9);
    const [u, v] = [0, 1, 2].filter((a) => a !== axis);
    const ends = DIAGONAL[`${n[axis] < 0 ? '-' : '+'}${axis}`];
    const face = m.faces[fi];
    const sign = (i) => [Math.sign(m.verts[i][u]), Math.sign(m.verts[i][v] - (v === 2 ? size / 2 : 0))];
    const start = face.findIndex((i) => { const s = sign(i); return (s[0] === ends[0][0] && s[1] === ends[0][1]) || (s[0] === ends[1][0] && s[1] === ends[1][1]); });
    const r = [...face.slice(start), ...face.slice(0, start)];
    m.faces[fi] = [r[0], r[1], r[2]];
    tris.push(fi, m.faces.push([r[0], r[2], r[3]]) - 1);
  }
  if (stage === 'split') return { mesh: m, picked: tris };
  let inner;
  if (region) {
    // The mistake: both triangles of a side inset as one square, then sunk together.
    inner = [];
    for (let s = 0; s < 6; s += 1) {
      const [t1, t2] = [tris[2 * s], tris[2 * s + 1]];
      const square = [...new Set([...m.faces[t1], ...m.faces[t2]])];
      const middle = centroid(m, square);
      const moved = new Map(square.map((i) => {
        const d = sub(m.verts[i], middle);
        const half = (size - 2 * chamfer) / 2;
        return [i, m.verts.push(add(middle, mul(d, (half - border) / half))) - 1];
      }));
      for (const t of [t1, t2]) {
        const f = m.faces[t];
        f.forEach((a, j) => {
          const b = f[(j + 1) % 3];
          if (m.faces[t1 === t ? t2 : t1].includes(a) && m.faces[t1 === t ? t2 : t1].includes(b)) return;
          m.faces.push([a, b, moved.get(b), moved.get(a)]);
        });
        m.faces[t] = f.map((i) => moved.get(i));
      }
      inner.push(t1, t2);
    }
  } else {
    inner = tris.map((fi) => insetTriangle(m, fi, border));
  }
  if (stage === 'inset') return { mesh: m, picked: inner };
  let out = m;
  if (region) {
    for (let s = 0; s < 6; s += 1) out = extrude(out, [inner[2 * s], inner[2 * s + 1]], -depth).mesh;
  } else {
    for (const fi of inner) out = extrude(out, [fi], -depth).mesh;
  }
  return { mesh: out, picked: inner };
}
