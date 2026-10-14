// Shapes shared by this lesson's diagrams. Not a diagram itself. The sword is 1 m tall, its parts
// sized from Kenney's Mini Dungeon sword in the reference pictures.
import { bevelledBox, join } from '../../../diagrams/mesh.mjs';
import { lathe, slab } from '../../037-modifiers/diagrams/modkit.mjs';

// The blade's right half as you draw it: one face from the middle line out to the edge, its top
// outer corner pulled down to the shoulder so the inner corner is the tip.
export const halfBlade = [[0, 0.384], [0.155, 0.384], [0.155, 0.864], [0, 1]];

// The blade after Mirror and Solidify: both halves, 6 cm thick.
export const blade = () => slab([[0, 0.384], [0.155, 0.384], [0.155, 0.864], [0, 1], [-0.155, 0.864], [-0.155, 0.384]], [[0, 1, 2, 3], [0, 3, 4, 5]], 0.06);

// The blade after Bevel too: every edge between the faces and the sides cut by 1.5 cm. Built as
// an eight-sided cross-section carried up to the shoulder, then drawn in to the tip.
export function bevelledBlade() {
  const w = 0.155;
  const t = 0.03;
  const c = 0.015;
  const section = [[w, -t + c], [w, t - c], [w - c, t], [-w + c, t], [-w, t - c], [-w, -t + c], [-w + c, -t], [w - c, -t]];
  const verts = [];
  const ring = (z, sx) => section.map(([x, y]) => verts.push([x * sx, y, z]) - 1);
  const base = ring(0.384, 1);
  const shoulder = ring(0.864, 1);
  const tip = ring(1, 0.04);
  const faces = [];
  const band = (a, b) => a.forEach((_, i) => { const j = (i + 1) % a.length; faces.push([a[i], a[j], b[j], b[i]]); });
  band(base, shoulder);
  band(shoulder, tip);
  faces.push([...base].reverse(), [...tip]);
  return { verts, faces };
}

export const guard = () => bevelledBox({ size: [0.52, 0.24, 0.16], width: 0.015, center: [0, 0, 0.305] });

// The grip: a cylinder with 8 vertices, its bottom widened and its end drawn in like the picture.
export const grip = () => lathe([[0, 0], [0.042, 0], [0.121, 0.051], [0.1, 0.225], [0, 0.225]], 8);

export const sword = () => join(bevelledBlade(), guard(), grip());
