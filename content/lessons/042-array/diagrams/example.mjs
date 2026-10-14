// The exercise: a fence of ten planks from one plank, and a ring of twelve stones from one stone.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { plank, stone, line, circle } from './shapes.mjs';

export default (kit) => kit.svg({ width: 520, height: 230 },
  drawMesh(kit, line(plank(), 10, 1.5), view({ at: [70, 150], scale: 115, target: [0, 0, 0] }), { width: 1 }),
  drawMesh(kit, circle(stone(), 12, 1), view({ at: [390, 110], scale: 75, elevation: 34 }), { width: 1 }),
  kit.text(140, 218, 'ten planks', { anchor: 'middle', size: 12 }),
  kit.text(390, 218, 'twelve stones', { anchor: 'middle', size: 12 }),
);
