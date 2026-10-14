// Holding Ctrl while moving with G: the block jumps in 1 m steps across the grid. Its earlier
// positions are drawn as faint outlines.
import { cube, translate, view, drawMesh, plane, keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const v = view({ azimuth: 12, elevation: 24, at: [220, 150], scale: 50, target: [1.5, 0, 0] });
  const grid = translate(plane({ size: [6, 3], segments: [6, 3] }), [1.5, 0, 0]);
  const block = (x) => translate(cube(1), [x, 0, 0.5]);
  return kit.svg({ width: 440, height: 240 },
    drawMesh(kit, grid, v, { mode: 'wire', cls: 'd-guide', width: 1 }),
    [0, 1, 2].map((x) => drawMesh(kit, block(x), v, { mode: 'wire', cls: 'd-guide', width: 1 })),
    drawMesh(kit, block(3), v, { width: 1.8, cls: 'd-mark' }),
    keycap(kit, 54, 36, 'G'), kit.text(76, 41, '+', { size: 13 }), keycap(kit, 108, 36, 'Ctrl'),
    kit.text(250, 228, '1 m at a time', { anchor: 'middle', size: 12 }),
  );
};
