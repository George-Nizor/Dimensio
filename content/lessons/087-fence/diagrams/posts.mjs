// Instance on Points stands a post on every resampled point. Object Info brings in the post you
// modelled, which is 1 m tall with its origin at its base.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { node, link } from './nodes.mjs';
import { fence, PATH } from './fence.mjs';
import { pathPoints } from './curves.mjs';

export default (kit) => {
  const r = node(kit, { x: 8, y: 14, w: 120, title: 'Resample Curve', outputs: [{ name: 'Curve', type: 'geo' }] });
  const o = node(kit, { x: 8, y: 88, w: 120, title: 'Object Info', outputs: [{ name: 'Geometry', type: 'geo' }], inputs: [{ name: 'Object', type: 'object', value: 'Post' }] });
  const i = node(kit, { x: 172, y: 30, w: 130, title: 'Instance on Points', mark: true, outputs: [{ name: 'Instances', type: 'geo' }], inputs: [{ name: 'Points', type: 'geo' }, { name: 'Instance', type: 'geo' }] });
  const { posts } = fence();
  const v = view({ azimuth: 20, elevation: 30, at: [428, 96], scale: 26, target: [0, 0.4, 0.5] });
  return kit.svg({ width: 560, height: 180 },
    r.svg, o.svg, i.svg,
    link(kit, r.out.Curve, i.in.Points), link(kit, o.out.Geometry, i.in.Instance),
    kit.polyline(pathPoints(PATH, 16).map((p) => v.project(p)), { cls: 'd-guide', width: 1.6, dash: '5 4' }),
    drawMesh(kit, posts, v, { width: 1.2 }),
  );
};
