// The scatter-hill starter's hill, rock and tree, and seeded points on the hill. Not a diagram
// itself. The hill is a 12 m grid raised 2 m in the middle, as the starter builds it.
import { plane, cylinder, join, translate, scale, rotate } from '../../../diagrams/mesh.mjs';
import { random } from '../../../diagrams/lib.mjs';

const EDGE = Math.exp(-3.6);
export const hillHeight = (x, y) => Math.max((2 * (Math.exp(-(x * x + y * y) / 10) - EDGE)) / (1 - EDGE), 0);

export function hill(segments = 12) {
  const m = plane({ size: [12, 12], segments: [segments, segments] });
  return { verts: m.verts.map(([x, y]) => [x, y, hillHeight(x, y)]), faces: m.faces };
}

// A cone: `sides` triangles up to a point, and a base face.
function cone(sides, radius, height, z0) {
  const verts = Array.from({ length: sides }, (_, i) => [Math.cos((i / sides) * Math.PI * 2) * radius, Math.sin((i / sides) * Math.PI * 2) * radius, z0]);
  verts.push([0, 0, z0 + height]);
  const faces = verts.slice(0, sides).map((_, i) => [i, (i + 1) % sides, sides]);
  faces.push([...Array(sides).keys()].reverse());
  return { verts, faces };
}

export const tree = () => join(cylinder({ vertices: 6, radius: 0.15, depth: 0.8, center: [0, 0, 0.4] }), cone(6, 0.8, 1.8, 0.6));
export const rock = () => scale(cylinder({ vertices: 6, radius: 0.45, depth: 0.5, center: [0, 0, 0.25], caps: 'fan' }), [1, 0.8, 1]);

// Seeded points on the hill, each with a pick (0 rock, 1 tree), a turn and a size.
export function points(count = 46, seed = 5) {
  const next = random(seed);
  return Array.from({ length: count }, () => {
    const x = (next() - 0.5) * 11.4;
    const y = (next() - 0.5) * 11.4;
    return { p: [x, y, hillHeight(x, y)], pick: next() < 0.45 ? 0 : 1, turn: next() * 360, size: 0.7 + next() * 0.6 };
  });
}

// Every point's prop, turned and sized, as one mesh. `offset` moves them all, as an unreset
// collection offset does.
export function scattered(pts, offset = [0, 0, 0]) {
  return join(...pts.map(({ p, pick, turn, size }) => translate(scale(rotate(pick ? tree() : rock(), 'z', turn), [size, size, size]), [p[0] + offset[0], p[1] + offset[1], p[2] + offset[2]])));
}

// A rounded frame for one small view, with a label under it.
export function panel(kit, x, y, w, h, label) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="d-ui" stroke-width="1"/>`,
    label ? kit.text(x + w / 2, y + h + 16, label, { anchor: 'middle', size: 12 }) : '',
  ];
}
