// The posts and both rails go into Join Geometry, then Realize Instances turns the posts into real
// mesh before Group Output.
import { node, link, groupOutput } from './nodes.mjs';

export default (kit) => {
  const i = node(kit, { x: 8, y: 10, w: 130, title: 'Instance on Points', outputs: [{ name: 'Instances', type: 'geo' }] });
  const t1 = node(kit, { x: 8, y: 66, w: 130, title: 'Transform (0.4 m)', outputs: [{ name: 'Geometry', type: 'geo' }] });
  const t2 = node(kit, { x: 8, y: 122, w: 130, title: 'Transform (0.8 m)', outputs: [{ name: 'Geometry', type: 'geo' }] });
  const j = node(kit, { x: 176, y: 56, w: 104, title: 'Join Geometry', outputs: [{ name: 'Geometry', type: 'geo' }], inputs: [{ name: 'Geometry', type: 'geo', multi: true }] });
  const r = node(kit, { x: 304, y: 56, w: 120, title: 'Realize Instances', mark: true, outputs: [{ name: 'Geometry', type: 'geo' }], inputs: [{ name: 'Geometry', type: 'geo' }] });
  const b = groupOutput(kit, 444, 56, { w: 90 });
  const into = (k) => [j.in.Geometry[0], j.in.Geometry[1] - 5 + k * 5];
  return kit.svg({ width: 540, height: 180 },
    i.svg, t1.svg, t2.svg, j.svg, r.svg, b.svg,
    link(kit, i.out.Instances, into(0)), link(kit, t1.out.Geometry, into(1)), link(kit, t2.out.Geometry, into(2)),
    link(kit, j.out.Geometry, r.in.Geometry), link(kit, r.out.Geometry, b.in.Geometry),
  );
};
