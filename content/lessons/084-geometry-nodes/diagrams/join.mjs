// Three Transform Geometry nodes, each taking the cube from Group Input, scaling it and moving it
// up, all linked into Join Geometry's long socket, which makes one mesh of them.
import { node, link, groupInput, groupOutput } from './nodes.mjs';
import { COPIES } from './shapes.mjs';

export default (kit) => {
  const a = groupInput(kit, 6, 150, [], { w: 96 });
  const ts = COPIES.map(([s, z], i) => node(kit, { x: 134, y: 10 + i * 118, w: 150, title: 'Transform Geometry', outputs: [{ name: 'Geometry', type: 'geo' }], inputs: [{ name: 'Geometry', type: 'geo' }, { name: 'Translation', type: 'vector', value: `Z ${z} m` }, { name: 'Scale', type: 'vector', value: String(s) }] }));
  const j = node(kit, { x: 316, y: 150, w: 104, title: 'Join Geometry', mark: true, outputs: [{ name: 'Geometry', type: 'geo' }], inputs: [{ name: 'Geometry', type: 'geo', multi: true }] });
  const b = groupOutput(kit, 444, 150, { w: 92 });
  return kit.svg({ width: 540, height: 360 },
    ts.map((t) => [t.svg, link(kit, a.out.Geometry, t.in.Geometry), link(kit, t.out.Geometry, [j.in.Geometry[0], j.in.Geometry[1] - 4 + ts.indexOf(t) * 4])]),
    a.svg, j.svg, b.svg,
    link(kit, j.out.Geometry, b.in.Geometry),
  );
};
