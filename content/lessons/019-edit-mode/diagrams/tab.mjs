// Left, the cube in Object Mode. Right, after Tab, the cube in Edit Mode, with a dot at every vertex.
import { cube, view, drawMesh, keycap } from '../../../diagrams/mesh.mjs';
import { panel, vertexDots } from './helpers.mjs';

export default (kit) => {
  const left = view({ at: [126, 104], scale: 40 });
  const right = view({ at: [394, 104], scale: 40 });
  return kit.svg({ width: 520, height: 220 },
    panel(kit, 14, 14, 224, 170, 'Object Mode'),
    drawMesh(kit, cube(), left, { width: 1.6 }),
    keycap(kit, 260, 100, 'Tab'),
    panel(kit, 282, 14, 224, 170, 'Edit Mode'),
    drawMesh(kit, cube(), right, { width: 1.6 }),
    vertexDots(kit, cube(), right),
  );
};
