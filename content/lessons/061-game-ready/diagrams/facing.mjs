// The chair seen from the top: its open front faces -Y, the side the front view (Numpad 1) looks
// at. Godot treats Blender's -Y as an asset's front.
import { views, drawMesh, keycap } from '../../../diagrams/mesh.mjs';
import { chair } from './parts.mjs';

export default (kit) => {
  const v = views.top({ scale: 220, at: [150, 108], target: [0, 0, 0] });
  const [x0, yEdge] = v.project([0, -0.225, 0]);
  const [, yBack] = v.project([0, 0.24, 0]);
  return kit.svg({ width: 420, height: 230 },
    drawMesh(kit, chair(), v, { width: 1.3 }),
    kit.text(x0, yBack - 10, 'back (+Y)', { size: 12, anchor: 'middle' }),
    kit.line(x0, yEdge + 8, x0, yEdge + 58, { cls: 'd-axis-y', width: 2.2 }),
    kit.arrowhead(x0, yEdge + 58, Math.PI / 2, { cls: 'd-axis-y' }),
    kit.text(x0 + 12, yEdge + 54, 'front (-Y)', { size: 12, cls: 'd-label d-axis-y-text' }),
    keycap(kit, 330, 100, 'Numpad 1', { size: 12 }),
    kit.text(330, 134, 'looks at the front', { size: 12, anchor: 'middle' }),
  );
};
