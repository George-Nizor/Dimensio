// The market corner from the messy-scene starter, simplified, shared by this lesson's diagrams.
// Not a diagram itself.
import { box, cylinder, join, translate } from '../../../diagrams/mesh.mjs';

const crate = (x, y, z = 0) => box({ size: [0.8, 0.8, 0.8], center: [x, y, z + 0.4] });
export const barrel = (x, y) => translate(cylinder({ vertices: 12, radius: 0.4, depth: 1, caps: 'ngon' }), [x, y, 0.5]);

// Every mesh in the scene but the ground, as one mesh, with the face range of the barrel the
// diagrams pick out.
export function market() {
  const parts = [
    crate(-3, -1), crate(-2.1, -1.2), crate(-2.6, -1.1, 0.8), crate(-3.2, 0.4),
    barrel(2.4, -1.4), barrel(3.3, -1.0), barrel(2.8, -0.2),
    box({ size: [1.6, 0.9, 0.06], center: [0, 1.5, 0.75] }),
    ...[[-0.72, 1.12], [0.72, 1.12], [-0.72, 1.88], [0.72, 1.88]].map(([x, y]) => box({ size: [0.06, 0.06, 0.72], center: [x, y, 0.36] })),
    box({ size: [0.45, 0.25, 1.8], center: [0.6, -2.4, 0.9] }),
  ];
  let start = 0;
  const ranges = parts.map((p) => { const r = Array.from({ length: p.faces.length }, (_, i) => start + i); start += p.faces.length; return r; });
  return { mesh: join(...parts), barrel: ranges[4] };
}
