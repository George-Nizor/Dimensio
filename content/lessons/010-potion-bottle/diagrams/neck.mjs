// The body with the eight-sided neck ring sitting on top of it.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { body, neck } from './bottle.mjs';

export default (kit) => {
  const v = view({ azimuth: 22, elevation: 18, at: [200, 120], scale: 560, target: [0, 0, 0.15] });
  return kit.svg({ width: 400, height: 230 },
    drawMesh(kit, body(), v, { width: 1.4 }),
    drawMesh(kit, neck(), v, { width: 1.8, cls: 'd-mark' }),
  );
};
