// The starting point: the reference pictures, drawn here as dashed outlines, behind the default
// cube. The cube has been scaled in Edit Mode to the torso in the front view (Numpad 1) and in the
// side view (Numpad 3).
import { views, drawMesh, box } from '../../../diagrams/mesh.mjs';
import { character, frame } from './charkit.mjs';

export default (kit) => {
  const torso = box({ size: [0.38, 0.22, 0.5], center: [0, 0, 1.2] });
  const cell = (x, make, label) => {
    const v = make({ at: [x + 100, 140], scale: 120, target: [0, 0, 0.9] });
    return [
      frame(kit, x, 14, 200, 250, label),
      drawMesh(kit, character().mesh, v, { mode: 'wire', cls: 'd-guide', width: 0.6 }),
      drawMesh(kit, torso, v, { width: 1.6, select: { faces: torso.faces.map((_, i) => i) } }),
    ];
  };
  return kit.svg({ width: 460, height: 290 },
    cell(14, views.front, 'front: Numpad 1'),
    cell(246, views.right, 'side: Numpad 3'),
  );
};
