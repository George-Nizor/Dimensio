// The chest from this lesson's exercise file (blender/starters/chest-unwrapped.py): a 1.2 by 0.8 by
// 0.6 m box with a half-cylinder lid on top, one mesh, unwrapped into seven islands. Not a diagram
// itself. Each island is first laid out true to size in metres, then scaled, turned and moved:
//   messy()  as the file opens: sizes uneven, the lid's strip bent, islands overlapping
//   even()   after Average Islands Scale and straightening: one size per metre everywhere
//   packed() after Pack Islands: even, inside the square, with a margin round each
// Each returns { mesh, uvs, islands }, islands being lists of face indices.
import { mesh } from '../../../diagrams/mesh.mjs';

const W = 1.2;
const D = 0.8;
const H = 0.6;
const R = D / 2;
const SEG = 6;

function build() {
  const verts = [];
  const at = (p) => {
    const i = verts.findIndex((q) => Math.abs(q[0] - p[0]) < 1e-9 && Math.abs(q[1] - p[1]) < 1e-9 && Math.abs(q[2] - p[2]) < 1e-9);
    return i >= 0 ? i : verts.push(p) - 1;
  };
  const faces = [];
  const flat = [];
  const islands = { strip: [], top: [], bottom: [], lid: [], endL: [], endR: [], under: [] };
  const add = (island, corners, metric) => { islands[island].push(faces.length); faces.push(corners.map(at)); flat.push(metric); };
  const x0 = -W / 2;
  const x1 = W / 2;
  const y0 = -D / 2;
  const y1 = D / 2;
  // The body's sides, unrolled into one strip: u round the body, v up it.
  add('strip', [[x0, y0, 0], [x1, y0, 0], [x1, y0, H], [x0, y0, H]], [[0, 0], [W, 0], [W, H], [0, H]]);
  add('strip', [[x1, y0, 0], [x1, y1, 0], [x1, y1, H], [x1, y0, H]], [[W, 0], [W + D, 0], [W + D, H], [W, H]]);
  add('strip', [[x1, y1, 0], [x0, y1, 0], [x0, y1, H], [x1, y1, H]], [[W + D, 0], [2 * W + D, 0], [2 * W + D, H], [W + D, H]]);
  add('strip', [[x0, y1, 0], [x0, y0, 0], [x0, y0, H], [x0, y1, H]], [[2 * W + D, 0], [2 * W + 2 * D, 0], [2 * W + 2 * D, H], [2 * W + D, H]]);
  add('bottom', [[x0, y1, 0], [x1, y1, 0], [x1, y0, 0], [x0, y0, 0]], [[0, D], [W, D], [W, 0], [0, 0]]);
  add('top', [[x0, y0, H], [x1, y0, H], [x1, y1, H], [x0, y1, H]], [[0, 0], [W, 0], [W, D], [0, D]]);
  // The lid: six faces round its curve, unrolled; its ends as half discs; its underside.
  const arc = (x, i) => { const a = Math.PI - (Math.PI * i) / SEG; return [x, Math.cos(a) * R, H + Math.sin(a) * R]; };
  const step = (Math.PI * R) / SEG;
  for (let i = 0; i < SEG; i += 1) add('lid', [arc(x0, i), arc(x0, i + 1), arc(x1, i + 1), arc(x1, i)], [[i * step, 0], [(i + 1) * step, 0], [(i + 1) * step, W], [i * step, W]]);
  for (let i = 0; i < SEG; i += 1) {
    const p = arc(x0, i);
    const q = arc(x0, i + 1);
    add('endL', [[x0, 0, H], q, p], [[R, 0], [R - q[1], q[2] - H], [R - p[1], p[2] - H]]);
    const p1 = arc(x1, i);
    const q1 = arc(x1, i + 1);
    add('endR', [[x1, 0, H], p1, q1], [[R, 0], [R + p1[1], p1[2] - H], [R + q1[1], q1[2] - H]]);
  }
  add('under', [[x0, y0, H], [x0, 0, H], [x1, 0, H], [x1, y0, H]], [[0, 0], [0, R], [W, R], [W, 0]]);
  add('under', [[x0, 0, H], [x0, y1, H], [x1, y1, H], [x1, 0, H]], [[0, R], [0, D], [W, D], [W, R]]);
  return { mesh: mesh(verts, faces), flat, islands };
}

// Places every island: scale s, turn by degrees, then move to [u, v].
function place(flat, islands, plan) {
  const uvs = flat.map((f) => f.map((p) => [...p]));
  for (const [name, faces] of Object.entries(islands)) {
    const { s, turn = 0, at, bend } = plan[name];
    const a = (turn * Math.PI) / 180;
    for (const f of faces) {
      uvs[f] = flat[f].map(([x, y]) => {
        if (bend) {
          // Bent strip: x runs round an arc, y outwards from its middle.
          const angle = bend.from + (x / (Math.PI * R)) * (bend.to - bend.from);
          const r = bend.radius + y * s;
          return [at[0] + Math.sin(angle) * r, at[1] + Math.cos(angle) * r];
        }
        const px = x * s;
        const py = y * s;
        return [at[0] + px * Math.cos(a) - py * Math.sin(a), at[1] + px * Math.sin(a) + py * Math.cos(a)];
      });
    }
  }
  return uvs;
}

export function messy() {
  const { mesh: m, flat, islands } = build();
  const uvs = place(flat, islands, {
    strip: { s: 0.3, at: [-0.08, 0.5] },
    top: { s: 0.1, at: [0.3, 0.32] },
    bottom: { s: 0.1, at: [0.62, 0.62] },
    lid: { s: 0.2, at: [0.5, -0.12], bend: { from: -0.75, to: 0.75, radius: 0.3 } },
    endL: { s: 0.2, at: [0.12, 0.22] },
    endR: { s: 0.2, at: [0.7, 0.24] },
    under: { s: 0.14, at: [0.42, 0.56], turn: 20 },
  });
  return { mesh: m, uvs, islands };
}

// One scale for every island, the lid's strip straight: what Average Islands Scale and Follow
// Active Quads leave, before packing.
export function even(s = 0.2) {
  const { mesh: m, flat, islands } = build();
  const uvs = place(flat, islands, {
    strip: { s, at: [0.02, 0.6] },
    top: { s, at: [0.3, 0.3] },
    bottom: { s, at: [0.62, 0.6] },
    lid: { s, at: [0.5, 0.02] },
    endL: { s, at: [0.1, 0.24] },
    endR: { s, at: [0.7, 0.24] },
    under: { s, at: [0.4, 0.5], turn: 20 },
  });
  return { mesh: m, uvs, islands };
}

// The even islands packed into rows inside the square, each with a gap round it. Pack Islands finds
// its own arrangement; this one is laid out by hand to the same rules.
export function packed() {
  const { mesh: m, flat, islands } = build();
  const s = 0.215;
  const g = 0.025;
  const lidW = Math.PI * R * s;
  const x1 = g + lidW + g;
  const x2 = x1 + W * s + g;
  const uvs = place(flat, islands, {
    strip: { s, at: [g, 1 - g - H * s] },
    lid: { s, at: [g, g] },
    under: { s, at: [x1, g] },
    top: { s, at: [x1, g + D * s + g] },
    bottom: { s, at: [x2, g] },
    endL: { s, at: [x2, g + D * s + g] },
    endR: { s, at: [x2 + D * s + g, g + D * s + g] },
  });
  return { mesh: m, uvs, islands };
}

// The same islands packed at uneven sizes, as Pack Islands leaves them when run before Average
// Islands Scale: the body's strip large on the image, the lid's islands small, so the lid gets far
// fewer pixels per metre.
export function packedUneven() {
  const { mesh: m, flat, islands } = build();
  const g = 0.025;
  const big = 0.235;
  const small = 0.07;
  const x1 = g + Math.PI * R * small + g;
  const uvs = place(flat, islands, {
    strip: { s: big, at: [g, 1 - g - H * big] },
    lid: { s: small, at: [g, g] },
    under: { s: small, at: [x1, g] },
    top: { s: 0.09, at: [x1 + W * small + g, g] },
    bottom: { s: 0.09, at: [x1 + W * small + g + W * 0.09 + g, g] },
    endL: { s: small, at: [x1, g + D * small + g] },
    endR: { s: small, at: [x1 + D * small + g, g + D * small + g] },
  });
  return { mesh: m, uvs, islands };
}
