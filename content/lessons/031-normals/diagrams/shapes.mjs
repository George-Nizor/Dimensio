// The exercise's crate and barrel, with faces turned inwards, and a few interface pieces. Not a
// diagram itself. The barrel has 12 sides, three rows of faces and flat caps, as in the starter.
import { mesh, cube, translate, orientOutward, normal } from '../../../diagrams/mesh.mjs';

const reverse = (m, test) => { m.faces = m.faces.map((f, i) => (test(normal(m, f), i) ? [...f].reverse() : f)); return m; };

// The crate: a 1 m box; `flipped` turns its top and front faces inwards.
export function crate(flipped = true) {
  const m = translate(cube(1), [0, 0, 0.5]);
  return flipped ? reverse(m, (n) => n[2] > 0.9 || n[1] < -0.9) : m;
}

export function barrel(insideOut = true) {
  const profile = [[0, 0.36], [0.3, 0.42], [0.7, 0.42], [1, 0.36]];
  const verts = profile.flatMap(([z, r]) => [...Array(12).keys()].map((i) => [Math.cos((i * Math.PI) / 6) * r, Math.sin((i * Math.PI) / 6) * r, z]));
  const faces = [];
  for (let k = 0; k < 3; k += 1) for (let i = 0; i < 12; i += 1) faces.push([k * 12 + i, k * 12 + ((i + 1) % 12), (k + 1) * 12 + ((i + 1) % 12), (k + 1) * 12 + i]);
  faces.push([...Array(12).keys()], [...Array(12).keys()].map((i) => 36 + i));
  const m = orientOutward(mesh(verts, faces));
  return insideOut ? reverse(m, () => true) : m;
}

// Red for the back of a face, as the Face Orientation overlay shows it.
export const red = (i, back) => (back ? 'd-key-bad' : null);

// A popover or panel: a title and rows of checkboxes, the picked one ticked and marked.
export function checkboxes(kit, x, y, title, rows, width = 190) {
  const h = 30 + rows.length * 24;
  return [
    `<rect x="${x}" y="${y}" width="${width}" height="${h}" rx="6" class="d-ui" stroke-width="1"/>`,
    kit.text(x + 12, y + 20, title, { size: 12 }),
    rows.map(([label, on], i) => {
      const ry = y + 32 + i * 24;
      return [
        `<rect x="${x + 12}" y="${ry}" width="14" height="14" rx="3" class="${on ? 'd-key-mark' : 'd-key'}" stroke-width="1.2"/>`,
        on ? kit.polyline([[x + 15, ry + 7], [x + 18.5, ry + 10.5], [x + 23, ry + 3.5]], { cls: 'd-key', width: 1.8 }) : '',
        kit.text(x + 34, ry + 12, label, { size: 12 }),
      ];
    }),
  ];
}
