// Offset Method Relative from the front. Offset X 1 puts the planks edge to edge; 1.5 moves each one
// a plank and a half, leaving a gap half a plank wide.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel } from '../../037-modifiers/diagrams/modkit.mjs';
import { plank, line } from './shapes.mjs';

export default (kit) => {
  const v1 = views.front({ at: [96, 180], scale: 160, target: [0, 0, 0] });
  const v2 = views.front({ at: [336, 180], scale: 160, target: [0, 0, 0] });
  return kit.svg({ width: 510, height: 250 },
    panel(kit, 14, 14, 232, 204, 'Offset X 1'),
    drawMesh(kit, line(plank(), 4, 1), v1, { width: 1.4 }),
    panel(kit, 264, 14, 232, 204, 'Offset X 1.5'),
    drawMesh(kit, line(plank(), 4, 1.5), v2, { width: 1.4 }),
    kit.text(130, 208, 'edge to edge', { anchor: 'middle', size: 12 }),
    kit.text(380, 208, 'gaps half a plank wide', { anchor: 'middle', size: 12 }),
  );
};
