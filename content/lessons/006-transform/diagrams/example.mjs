// One block moved along X, turned around Z and stretched along Z. Each result is drawn solid beside
// a faint outline of the block it started as.
import { view, drawMesh, translate, rotate, scale } from '../../../diagrams/mesh.mjs';
import { block } from './block.mjs';

export default (kit) => {
  const cells = [
    ['moved', (m) => translate(m, [0.9, 0, 0]), [0.45, 0, 0.6]],
    ['rotated', (m) => rotate(m, 'z', 45), [0, 0, 0.6]],
    ['scaled', (m) => translate(scale(translate(m, [0, 0, -0.5]), [1, 1, 1.5]), [0, 0, 0.5]), [0, 0, 0.75]],
  ];
  return kit.svg({ width: 540, height: 250 }, cells.map(([label, change, target], i) => {
    const x = 90 + i * 180;
    const v = view({ at: [x, 118], scale: 100, target });
    const start = block([0, 0, 0.5]);
    return [
      drawMesh(kit, change(start), v, { width: 1.8 }),
      drawMesh(kit, start, v, { mode: 'wire', cls: 'd-guide', width: 1.1 }),
      kit.text(x, 238, label, { anchor: 'middle', size: 13 }),
    ];
  }));
};
