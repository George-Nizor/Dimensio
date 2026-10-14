// The exercise's planks and sign. Not a diagram itself.
import { box, rotate, translate } from '../../../diagrams/mesh.mjs';

// A plank 0.3 m wide, 0.08 m thick and 1.2 m tall, standing 2 m along +Y, turned `deg` around the
// world's Z axis, the way R, Z with the pivot on the 3D cursor at the centre turns it.
export const plank = (deg = 0) => rotate(translate(box({ size: [0.3, 0.08, 1.2], center: [0, 0, 0.6] }), [0, 2, 0]), 'z', deg);

// The sign: 1.2 by 0.08 by 0.6 m, tipped 15 degrees around Y and turned 35 around Z, moved `along`
// metres along its own X axis.
export const sign = (along = 0) => {
  const b = box({ size: [1.2, 0.08, 0.6] });
  return translate(rotate(rotate(translate(b, [along, 0, 0]), 'y', 15), 'z', 35), [5, -1, 1.5]);
};

// The sign's own axes as directions in the world.
const r = (v, axis, deg) => { const m = rotate({ verts: [v], faces: [] }, axis, deg); return m.verts[0]; };
export const signAxes = () => [[1, 0, 0], [0, 1, 0], [0, 0, 1]].map((d) => r(r(d, 'y', 15), 'z', 35));
