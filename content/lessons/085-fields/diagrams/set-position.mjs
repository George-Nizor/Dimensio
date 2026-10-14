// Set Position between Group Input and Group Output. Its Selection, Position and Offset sockets are
// diamonds: each takes a field, a value that can differ for every point.
import { node, link, groupInput, groupOutput } from './nodes.mjs';

export default (kit) => {
  const a = groupInput(kit, 16, 40, [], { w: 110 });
  const s = node(kit, { x: 196, y: 24, w: 130, title: 'Set Position', mark: true, outputs: [{ name: 'Geometry', type: 'geo' }], inputs: [{ name: 'Geometry', type: 'geo' }, { name: 'Selection', type: 'bool', field: true }, { name: 'Position', type: 'vector', field: true }, { name: 'Offset', type: 'vector', field: true }] });
  const b = groupOutput(kit, 394, 40, { w: 110 });
  return kit.svg({ width: 520, height: 196 },
    a.svg, s.svg, b.svg,
    link(kit, a.out.Geometry, s.in.Geometry), link(kit, s.out.Geometry, b.in.Geometry),
    kit.text(260, 188, 'Shift+A > Geometry > Write > Set Position', { anchor: 'middle', size: 12 }),
  );
};
