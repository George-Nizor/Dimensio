// Bridge Edge Loops: the open rims of two tube ends selected, then a ring of faces joining them.
import { view } from '../../../diagrams/mesh.mjs';
import { pipe, pipeRims, rimEdges } from './shapes.mjs';
import { paint, panel, step } from './paint.mjs';

export default (kit) => {
  const left = view({ azimuth: 16, elevation: 24, at: [112, 92], scale: 100, target: [0, 0, 0] });
  const right = view({ azimuth: 16, elevation: 24, at: [392, 92], scale: 100, target: [0, 0, 0] });
  const open = pipe(false);
  const done = pipe(true);
  const added = done.faces.map((_, i) => i).slice(open.faces.length);
  return kit.svg({ width: 500, height: 210 },
    panel(kit, 14, 14, 196, 160, 'both rims selected'),
    paint(kit, open, left, { inside: true, width: 1.5, select: { edges: pipeRims(open).flatMap(rimEdges) } }),
    step(kit, 220, 94, 280),
    panel(kit, 290, 14, 196, 160, 'bridged'),
    paint(kit, done, right, { width: 1.5, fill: (i) => (added.includes(i) ? 'd-face-sel' : null) }),
  );
};
