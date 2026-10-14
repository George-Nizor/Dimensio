// Half the goblet's outline in the front view: a line of vertices from the origin out along the
// base, up to the rim and back down inside to the axis. The axis is the dashed Z line.
import { keycap } from '../../../diagrams/mesh.mjs';
import { goblet } from './shapes.mjs';

export default (kit) => {
  const s = 200;
  const ox = 150;
  const oy = 226;
  const pts = goblet.map(([r, z]) => [ox + r * s, oy - z * s]);
  return kit.svg({ width: 420, height: 250 },
    kit.line(ox, 14, ox, oy + 8, { cls: 'd-axis-z', width: 1.4, dash: '6 5' }),
    kit.text(ox - 8, 24, 'Z', { anchor: 'end', size: 13, cls: 'd-label d-axis-z-text' }),
    kit.polyline(pts, { cls: 'd-ink', width: 2 }),
    pts.map(([x, y], i) => kit.dot(x, y, { r: i === 0 ? 5 : 3.6, cls: i === 0 ? 'd-mark-fill' : 'd-dot' })),
    kit.text(ox - 10, oy + 4, 'start at the origin', { anchor: 'end', size: 12 }),
    keycap(kit, 330, 120, 'E', { size: 13 }),
    kit.text(330, 152, 'one vertex at a time', { anchor: 'middle', size: 12 }),
  );
};
