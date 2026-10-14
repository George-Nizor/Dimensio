// Realize Instances turns the copies into real mesh, and Join Geometry puts the hill back with them
// before Group Output.
import { node, link, groupInput, groupOutput } from './nodes.mjs';

export default (kit) => {
  const a = groupInput(kit, 8, 110, [], { w: 100 });
  const i = node(kit, { x: 8, y: 10, w: 130, title: 'Instance on Points', outputs: [{ name: 'Instances', type: 'geo' }] });
  const r = node(kit, { x: 168, y: 10, w: 130, title: 'Realize Instances', mark: true, outputs: [{ name: 'Geometry', type: 'geo' }], inputs: [{ name: 'Geometry', type: 'geo' }] });
  const j = node(kit, { x: 326, y: 60, w: 100, title: 'Join Geometry', outputs: [{ name: 'Geometry', type: 'geo' }], inputs: [{ name: 'Geometry', type: 'geo', multi: true }] });
  const b = groupOutput(kit, 444, 60, { w: 90 });
  return kit.svg({ width: 540, height: 200 },
    i.svg, r.svg, a.svg, j.svg, b.svg,
    link(kit, i.out.Instances, r.in.Geometry),
    link(kit, r.out.Geometry, [j.in.Geometry[0], j.in.Geometry[1] - 4]),
    link(kit, a.out.Geometry, [j.in.Geometry[0], j.in.Geometry[1] + 4]),
    link(kit, j.out.Geometry, b.in.Geometry),
    kit.text(200, 180, 'Group Input keeps the hill', { anchor: 'middle', size: 12 }),
  );
};
