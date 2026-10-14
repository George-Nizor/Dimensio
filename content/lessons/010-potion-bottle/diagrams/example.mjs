// The finished bottle from the front and a little above: a flattened eight-sided body in red, a
// grey neck ring and an orange cork that widens towards the top.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { drawColoured } from './parts.mjs';
import { body, neck, cork } from './bottle.mjs';

export default (kit) => {
  const v = view({ azimuth: 22, elevation: 18, at: [200, 124], scale: 520, target: [0, 0, 0.2] });
  return kit.svg({ width: 400, height: 250 },
    drawColoured(kit, body(), v, 'd-gizmo-x', { width: 1.5 }),
    drawMesh(kit, neck(), v, { width: 1.5 }),
    drawColoured(kit, cork(), v, 'd-mark-fill', { width: 1.5, strength: 0.6 }),
  );
};
