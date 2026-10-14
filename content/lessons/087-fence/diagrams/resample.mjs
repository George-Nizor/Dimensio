// Resample Curve in Length mode puts points along the path at even spacing, with one at each end.
// Its Length comes from a group input named Spacing, so the modifier can change it.
import { views } from '../../../diagrams/mesh.mjs';
import { node, link, groupInput } from './nodes.mjs';
import { PATH, resample } from './fence.mjs';
import { pathPoints } from './curves.mjs';

export default (kit) => {
  const a = groupInput(kit, 8, 40, [{ name: 'Spacing', type: 'float' }], { w: 96 });
  const r = node(kit, { x: 140, y: 24, w: 128, title: 'Resample Curve', mark: true, outputs: [{ name: 'Curve', type: 'geo' }], inputs: [{ name: 'Curve', type: 'geo' }, { name: 'Mode', type: 'empty', value: 'Length' }, { name: 'Length', type: 'float', field: true }] });
  const v = views.top({ at: [418, 90], scale: 21 });
  const line = pathPoints(PATH, 16).map((p) => v.project(p));
  return kit.svg({ width: 560, height: 186 },
    a.svg, r.svg,
    link(kit, a.out.Geometry, r.in.Curve), link(kit, a.out.Spacing, r.in.Length, { cls: 'd-mark' }),
    kit.polyline(line, { cls: 'd-guide', width: 2 }),
    resample(pathPoints(PATH, 16), 1.5).map((p) => { const [x, y] = v.project(p); return kit.dot(x, y, { r: 4, cls: 'd-mark-fill' }); }),
    kit.text(418, 166, 'Spacing 1.5 m', { anchor: 'middle', size: 12 }),
  );
};
