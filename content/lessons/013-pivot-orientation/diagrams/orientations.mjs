// The tilted sign with two sets of axes from its middle: the world's Global axes, straight, and its
// own Local axes, tilted and turned with it.
import { view, drawMesh, axes } from '../../../diagrams/mesh.mjs';
import { panel } from './parts.mjs';
import { sign, signAxes } from './planks.mjs';

export default (kit) => {
  const cell = (x, label, local) => {
    const v = view({ at: [x + 110, 110], scale: 96, target: [5, -1, 1.5] });
    const out = [panel(kit, x, 14, 220, 180, label), drawMesh(kit, sign(0), v, { width: 1.4 })];
    if (!local) out.push(axes(kit, v, { origin: [5, -1, 1.5], length: 0.9 }));
    else {
      const o = v.project([5, -1, 1.5]);
      signAxes().forEach((d, i) => {
        const name = ['x', 'y', 'z'][i];
        const e = v.project([5 + d[0] * 0.9, -1 + d[1] * 0.9, 1.5 + d[2] * 0.9]);
        const a = Math.atan2(e[1] - o[1], e[0] - o[0]);
        out.push(kit.line(o[0], o[1], e[0], e[1], { cls: `d-axis-${name}`, width: 2 }), kit.arrowhead(e[0], e[1], a, { cls: `d-axis-${name}` }));
        out.push(kit.text(e[0] + Math.cos(a) * 12, e[1] + Math.sin(a) * 12 + 5, name.toUpperCase(), { cls: `d-label d-axis-${name}-text`, anchor: 'middle', size: 13 }));
      });
    }
    return out;
  };
  return kit.svg({ width: 500, height: 220 }, cell(14, 'Global', false), cell(266, 'Local', true));
};
