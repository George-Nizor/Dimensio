// Left, the lower canopy selected and still white. Right, after Ctrl+X, the same faces filled
// green while the rest of the tree stays white.
import { view, keycap } from '../../../diagrams/mesh.mjs';
import { tree, drawPainted, panel } from './parts.mjs';

export default (kit) => {
  const { mesh, part } = tree();
  const left = view({ azimuth: 30, elevation: 14, scale: 64, at: [110, 108], target: [0, 0, 1.3] });
  const right = view({ azimuth: 30, elevation: 14, scale: 64, at: [390, 108], target: [0, 0, 1.3] });
  return kit.svg({ width: 500, height: 250 },
    panel(kit, 14, 14, 192, 196, 'selected'),
    drawPainted(kit, mesh, left, (i) => (part(i) === 'low' ? 'd-face-sel' : null), { width: 0.9 }),
    keycap(kit, 250, 112, 'Ctrl+X', { size: 12 }),
    panel(kit, 294, 14, 192, 196, 'filled'),
    drawPainted(kit, mesh, right, (i) => (part(i) === 'low' ? 'd-gizmo-y' : null), { width: 0.9 }),
  );
};
