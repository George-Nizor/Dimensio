// Wrong: the two band rows moved with E. A ring of faces has no one way out, so they all move one
// way (sideways here, as Blender 5.2.2 orients them) and the bands slide off to one side. Right:
// Extrude Faces Along Normals pushes each face out, so the bands stand out all round.
import { view } from '../../../diagrams/mesh.mjs';
import { barrel, fromRings, ring, profile } from './barrel.mjs';
import { paint, panel } from './paint.mjs';

export default (kit) => {
  const p = profile('bulge');
  const s = [-0.1, 0];
  const lopsided = fromRings([
    ring(...p[0]), ring(...p[1]), ring(p[1][0], p[1][1], s), ring(p[2][0], p[2][1], s), ring(...p[2]),
    ring(...p[3]), ring(p[3][0], p[3][1], s), ring(p[4][0], p[4][1], s), ring(...p[4]), ring(...p[5]),
  ]);
  const left = view({ azimuth: 10, elevation: 16, at: [124, 104], scale: 108, target: [0, 0, 0.6] });
  const right = view({ azimuth: 10, elevation: 16, at: [376, 104], scale: 108, target: [0, 0, 0.6] });
  const band = (i) => Math.floor(i / 12) === 2 || Math.floor(i / 12) === 6;
  return kit.svg({ width: 500, height: 240 },
    panel(kit, 14, 14, 220, 184),
    paint(kit, lopsided, left, { width: 1.2, inside: true, fill: (i) => (band(i) && i < 108 ? 'd-face-sel' : null) }),
    kit.tag(124, 224, 'E: the bands slide', { tone: 'bad' }),
    panel(kit, 266, 14, 220, 184),
    paint(kit, barrel('bands'), right, { outward: false, width: 1.2, fill: (i) => (band(i) && i < 108 ? 'd-face-sel' : null) }),
    kit.tag(376, 224, 'Alt+E: the bands stand out'),
  );
};
