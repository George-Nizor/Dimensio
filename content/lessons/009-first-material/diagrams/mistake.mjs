// Wrong: in Solid shading the cube stays grey after its Base Color was made red. Right: the same
// cube in Material Preview is red.
import { cube, translate, view, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel, drawColoured } from './parts.mjs';
import { RED } from './shapes.mjs';

const button = (kit, x, y, label) => [
  `<rect x="${x}" y="${y}" width="${label.length * 6.4 + 16}" height="20" rx="4" class="d-key-mark" stroke-width="1"/>`,
  kit.text(x + 8, y + 14, label, { size: 11, cls: 'd-key-text d-key-text-mark' }),
];

export default (kit) => {
  const c = translate(cube(2), [0, 0, 1]);
  return kit.svg({ width: 500, height: 230 },
    panel(kit, 14, 14, 220, 176),
    button(kit, 24, 24, 'Solid'),
    drawMesh(kit, c, view({ at: [124, 132], scale: 34, target: [0, 0, 1] }), { width: 1.8 }),
    kit.tag(124, 214, 'Solid: still grey', { tone: 'bad' }),
    panel(kit, 266, 14, 220, 176),
    button(kit, 276, 24, 'Material Preview'),
    drawColoured(kit, c, view({ at: [376, 132], scale: 34, target: [0, 0, 1] }), RED, { width: 1.8 }),
    kit.tag(376, 214, 'Material Preview: red'),
  );
};
