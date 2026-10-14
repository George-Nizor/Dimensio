// Combine XYZ turns the height into a vector with only Z, and Set Position's Offset moves every
// point up or down by its own amount.
import { node, link, groupInput, groupOutput } from './nodes.mjs';

export default (kit) => {
  const c = node(kit, { x: 24, y: 96, w: 110, title: 'Combine XYZ', outputs: [{ name: 'Vector', type: 'vector', field: true }], inputs: [{ name: 'X', type: 'float', value: '0' }, { name: 'Y', type: 'float', value: '0' }, { name: 'Z', type: 'float', field: true }] });
  const a = groupInput(kit, 24, 8, [], { w: 110 });
  const s = node(kit, { x: 200, y: 20, w: 130, title: 'Set Position', mark: true, outputs: [{ name: 'Geometry', type: 'geo' }], inputs: [{ name: 'Geometry', type: 'geo' }, { name: 'Selection', type: 'bool', field: true }, { name: 'Position', type: 'vector', field: true }, { name: 'Offset', type: 'vector', field: true }] });
  const b = groupOutput(kit, 404, 24, { w: 110 });
  return kit.svg({ width: 540, height: 216 },
    a.svg, c.svg, s.svg, b.svg,
    kit.line(2, c.in.Z[1], c.in.Z[0] - 7, c.in.Z[1], { cls: 'd-ink', width: 2, dash: '5 4' }),
    link(kit, a.out.Geometry, s.in.Geometry), link(kit, c.out.Vector, s.in.Offset, { field: true, cls: 'd-mark' }), link(kit, s.out.Geometry, b.in.Geometry),
    kit.text(290, 206, 'the last Math node links into Z', { anchor: 'middle', size: 12 }),
  );
};
