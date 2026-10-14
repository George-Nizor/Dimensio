// Wrong: a cube with no UV map shows its grid material as one flat colour, and the UV Maps panel
// in Object Data is empty. Right: with a UV map listed, the grid shows on every face.
import { cube, view } from '../../../diagrams/mesh.mjs';
import { drawTextured, boxUVs, CROSS } from './uv.mjs';

function panel(kit, x, y, listed) {
  return [
    `<rect x="${x}" y="${y}" width="150" height="58" rx="4" class="d-ui" stroke-width="1"/>`,
    kit.text(x + 8, y + 15, 'UV Maps', { size: 11 }),
    `<rect x="${x + 8}" y="${y + 22}" width="134" height="28" rx="3" class="d-sunk" stroke-width="1"/>`,
    listed ? kit.text(x + 16, y + 40, 'UVMap', { size: 11, cls: 'd-key-text' }) : '',
  ];
}

export default (kit) => {
  const m = cube(1);
  const left = view({ at: [110, 100], scale: 70 });
  const right = view({ at: [370, 100], scale: 70 });
  return kit.svg({ width: 500, height: 280 },
    drawTextured(kit, m, left, boxUVs(m, CROSS), { flat: 'd-face-3' }),
    panel(kit, 35, 180, false),
    kit.tag(110, 266, 'no UV map: one colour', { tone: 'bad' }),
    drawTextured(kit, m, right, boxUVs(m, CROSS), { cells: 16 }),
    panel(kit, 295, 180, true),
    kit.tag(370, 266, 'UVMap listed: the grid shows'),
  );
};
