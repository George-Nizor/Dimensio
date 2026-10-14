// Wrong: Ctrl+T on the whole lamp. Every face, quads included, becomes triangles. Right: only the
// shade's n-gons triangulated and joined back into quads; the base keeps its quads and flat caps.
import { view } from '../../../diagrams/mesh.mjs';
import { lamp, triangulated } from './lamp.mjs';
import { paint, panel } from './paint.mjs';

export default (kit) => {
  const left = view({ azimuth: 24, elevation: 24, at: [124, 184], scale: 330, target: [0, 0, 0] });
  const right = view({ azimuth: 24, elevation: 24, at: [376, 184], scale: 330, target: [0, 0, 0] });
  return kit.svg({ width: 500, height: 240 },
    panel(kit, 14, 14, 220, 184),
    paint(kit, triangulated(lamp('ngon')), left, { width: 1.1, inside: true }),
    kit.tag(124, 224, 'everything triangulated', { tone: 'bad' }),
    panel(kit, 266, 14, 220, 184),
    paint(kit, lamp('quads'), right, { width: 1.1, inside: true }),
    kit.tag(376, 224, 'only the n-gons rebuilt'),
  );
};
