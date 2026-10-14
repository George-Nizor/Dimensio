// Shapes shared by this lesson's diagrams. Not a diagram itself.
import { box, join, translate, rotate } from '../../../diagrams/mesh.mjs';

// The exercise's plank: 10 cm wide, 2 cm deep, 1 m tall, standing on the ground.
export const plank = () => box({ size: [0.1, 0.02, 1], center: [0, 0, 0.5] });

// A stone for the ring: a small block, longer along Y.
export const stone = () => box({ size: [0.24, 0.4, 0.2], center: [0, 0, 0.1] });

// The Array modifier with Shape Line and Offset Method Relative: each copy moved by `offset` times
// the object's width along X.
export function line(m, count, offset) {
  const xs = m.verts.map((v) => v[0]);
  const width = Math.max(...xs) - Math.min(...xs);
  return join(...Array.from({ length: count }, (_, i) => translate(m, [i * offset * width, 0, 0])));
}

// The Array modifier with Shape Circle: copies spread round the origin at `radius`, each turned to
// follow the circle (Align Rotation).
export function circle(m, count, radius) {
  return join(...Array.from({ length: count }, (_, i) => {
    const a = (360 * i) / count;
    const t = (a * Math.PI) / 180;
    return translate(rotate(m, 'z', a), [Math.cos(t) * radius, Math.sin(t) * radius, 0]);
  }));
}
