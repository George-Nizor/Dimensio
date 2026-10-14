// The lid from a cylinder. Left, a Cylinder with 12 vertices and Triangle Fan caps, turned 90
// degrees on Y so it lies along X. Right, its lower half deleted and the open bottom filled with
// triangles (Alt+F): half a cylinder, closed all round.
import { cylinder, rotate, translate, view, drawMesh, keycap } from '../../../diagrams/mesh.mjs';
import { lid } from './chest.mjs';

export default (kit) => {
  const whole = translate(rotate(cylinder({ vertices: 12, radius: 0.4, depth: 1.2, caps: 'fan' }), 'y', 90), [0, 0, 0.6]);
  const half = lid().mesh;
  const left = view({ at: [120, 110], scale: 130, azimuth: 30, elevation: 24, target: [0, 0, 0.6] });
  const right = view({ at: [370, 110], scale: 130, azimuth: 30, elevation: 24, target: [0, 0, 0.6] });
  return kit.svg({ width: 490, height: 226 },
    drawMesh(kit, whole, left, { width: 1.3 }),
    kit.text(120, 196, 'Cylinder, turned on Y', { anchor: 'middle', size: 12 }),
    kit.line(222, 110, 262, 110, { cls: 'd-mark', width: 2 }), kit.arrowhead(262, 110, 0, { size: 8 }),
    drawMesh(kit, half, right, { width: 1.3 }),
    keycap(kit, 330, 191, 'Alt+F', { size: 11 }), kit.text(362, 196, 'lower half gone,', { size: 12 }),
    kit.text(362, 212, 'bottom filled', { size: 12 }),
  );
};
