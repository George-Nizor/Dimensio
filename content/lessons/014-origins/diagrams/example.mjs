// A crate with its origin at the middle of its base, and a door with its origin at the bottom of
// its hinge edge, swinging open around it. A dashed arc on the floor shows the swing.
import { view, drawMesh, rotate, translate } from '../../../diagrams/mesh.mjs';
import { origin } from './parts.mjs';
import { crate, door } from './props.mjs';

export default (kit) => {
  const v = view({ azimuth: 35, elevation: 22, at: [236, 168], scale: 66, target: [0.4, 0, 0.7] });
  const hinge = [0.9, 0, 0];
  const closed = door([1.35, 0]);
  const swung = translate(rotate(translate(closed, [-hinge[0], 0, 0]), 'z', -40), hinge);
  const arc = Array.from({ length: 12 }, (_, i) => {
    const a = ((-40 * i) / 11) * (Math.PI / 180);
    return v.project([hinge[0] + Math.cos(a) * 0.9, Math.sin(a) * 0.9, 0]);
  });
  const [cx, cy] = v.project([-1.1, 0, 0]);
  const [hx, hy] = v.project(hinge);
  return kit.svg({ width: 500, height: 250 },
    drawMesh(kit, crate([-1.1, 0]), v, { mode: 'xray', width: 1.6 }),
    origin(kit, cx, cy),
    kit.polyline(arc, { cls: 'd-guide', width: 1.2, dash: '4 4' }),
    drawMesh(kit, closed, v, { mode: 'wire', cls: 'd-guide', width: 1.1 }),
    drawMesh(kit, swung, v, { width: 1.6 }),
    origin(kit, hx, hy),
  );
};
