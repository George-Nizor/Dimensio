// Left, the market with one barrel selected. Right, local view after Numpad /: the barrel alone,
// filling the viewport.
import { view, drawMesh, keycap } from '../../../diagrams/mesh.mjs';
import { panel } from './helpers.mjs';
import { market, barrel } from './shapes.mjs';

export default (kit) => {
  const scene = market();
  const left = view({ at: [126, 112], scale: 22, target: [0, -0.3, 0.5] });
  const right = view({ at: [436, 108], scale: 80, target: [2.4, -1.4, 0.5] });
  return kit.svg({ width: 560, height: 220 },
    panel(kit, 14, 14, 224, 176, 'the whole scene'),
    drawMesh(kit, scene.mesh, left, { width: 1, select: { faces: scene.barrel } }),
    keycap(kit, 280, 102, 'Numpad /', { size: 11 }),
    panel(kit, 324, 14, 224, 176, 'local view'),
    drawMesh(kit, barrel(2.4, -1.4), right, { width: 1.5, select: { faces: barrel(0, 0).faces.map((_, i) => i) } }),
  );
};
