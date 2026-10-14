// Wrong: the wave linked into Set Position's Position replaces every point's whole location with
// (0, 0, height), so the grid collapses into a line
// (its old outline dashed). Right: linked into Offset, each point moves up
// or down from where it was.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { rippled, height } from './wave.mjs';
import { panel } from './nodes.mjs';

export default (kit) => {
  const v = (x) => view({ azimuth: 20, elevation: 32, at: [x, 104], scale: 40 });
  const collapsed = Array.from({ length: 41 }, (_, i) => v(124).project([0, 0, height(-2 + i * 0.1)]));
  return kit.svg({ width: 500, height: 240 },
    panel(kit, 14, 14, 220, 170, 'linked to Position'),
    (() => { const c = [[-2, -2], [2, -2], [2, 2], [-2, 2], [-2, -2]].map(([x, y]) => v(124).project([x, y, 0])); return kit.polyline(c, { cls: 'd-guide', width: 1.2, dash: '4 4' }); })(),
    [[-2, -2], [2, -2], [2, 2], [-2, 2]].map(([x, y]) => { const [ax, ay] = v(124).project([x, y, 0]); const [bx, by] = v(124).project([0, 0, 0]); return [kit.line(ax, ay, bx + (ax - bx) * 0.25, by + (ay - by) * 0.25, { cls: 'd-bad', width: 1.4 }), kit.arrowhead(bx + (ax - bx) * 0.25, by + (ay - by) * 0.25, Math.atan2(by - ay, bx - ax), { cls: 'd-bad', size: 7 })]; }),
    kit.line(collapsed[0][0], Math.max(...collapsed.map((p) => p[1])), collapsed[0][0], Math.min(...collapsed.map((p) => p[1])), { cls: 'd-ink', width: 2 }),
    collapsed.map(([x, y]) => kit.dot(x, y, { r: 2.4 })),
    kit.tag(124, 228, 'every point on one line', { tone: 'bad' }),
    panel(kit, 266, 14, 220, 170, 'linked to Offset'),
    drawMesh(kit, rippled(12), v(376), { width: 0.8 }),
    kit.tag(376, 228, 'each point moves'),
  );
};
