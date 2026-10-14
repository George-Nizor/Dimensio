// The crate with its top face pointing inwards. Wrong: Backface Culling off, so Blender draws the
// face's back and the crate looks whole. Right: culling on, as Godot will draw it, so the top is a
// hole you can see through.
import { view } from '../../../diagrams/mesh.mjs';
import { crate } from './shapes.mjs';
import { paint, panel } from './paint.mjs';
import { mesh, cube, translate, normal } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const left = view({ azimuth: 30, elevation: 30, at: [124, 108], scale: 100, target: [0, 0, 0.5] });
  const right = view({ azimuth: 30, elevation: 30, at: [376, 108], scale: 100, target: [0, 0, 0.5] });
  const m = translate(cube(1), [0, 0, 0.5]);
  m.faces = m.faces.map((f) => (normal(m, f)[2] > 0.9 ? [...f].reverse() : f));
  return kit.svg({ width: 500, height: 240 },
    panel(kit, 14, 14, 220, 184),
    paint(kit, m, left, { width: 1.6 }),
    kit.tag(124, 224, 'culling off: looks whole', { tone: 'bad' }),
    panel(kit, 266, 14, 220, 184),
    paint(kit, m, right, { width: 1.6, outward: false }),
    kit.tag(376, 224, 'culling on: the hole shows'),
  );
};
