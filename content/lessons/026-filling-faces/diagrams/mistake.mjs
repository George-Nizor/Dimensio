// Wrong: only part of the tank's rim is selected, so Grid Fill stops with an error. Right: the
// whole rim is selected and Grid Fill closes the hole with quads.
import { view } from '../../../diagrams/mesh.mjs';
import { tank, tankRim, rimEdges } from './shapes.mjs';
import { paint, panel } from './paint.mjs';

export default (kit) => {
  const left = view({ azimuth: 20, elevation: 50, at: [124, 84], scale: 108, target: [0, 0, 0.75] });
  const right = view({ azimuth: 20, elevation: 50, at: [376, 84], scale: 108, target: [0, 0, 0.75] });
  const rim = rimEdges(tankRim());
  const filled = tank('grid');
  const cap = filled.faces.map((f, j) => [f, j]).filter(([f]) => f.every((k) => filled.verts[k][2] > 0.999)).map(([, j]) => j);
  return kit.svg({ width: 500, height: 250 },
    panel(kit, 14, 14, 220, 176),
    paint(kit, tank('open'), left, { inside: true, width: 1.5, select: { edges: rim.slice(0, 8) } }),
    kit.text(124, 208, 'Grid Fill: loops are not connected', { anchor: 'middle', size: 12 }),
    kit.tag(124, 236, 'part of the rim', { tone: 'bad' }),
    panel(kit, 266, 14, 220, 176),
    paint(kit, filled, right, { width: 1.5, select: { edges: rim }, fill: (j) => (cap.includes(j) ? 'd-face-sel' : null) }),
    kit.text(376, 208, 'Grid Fill: nine quads', { anchor: 'middle', size: 12 }),
    kit.tag(376, 236, 'the whole rim'),
  );
};
