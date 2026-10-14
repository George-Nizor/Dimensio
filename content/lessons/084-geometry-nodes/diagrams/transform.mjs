// Transform Geometry dropped on the link between Group Input and Group Output, with Scale 0.7.
import { node, link, groupInput, groupOutput } from './nodes.mjs';

export default (kit) => {
  const a = groupInput(kit, 16, 40, [], { w: 110 });
  const t = node(kit, { x: 180, y: 24, w: 160, title: 'Transform Geometry', mark: true, outputs: [{ name: 'Geometry', type: 'geo' }], inputs: [{ name: 'Geometry', type: 'geo' }, { name: 'Translation', type: 'vector', value: '0 m' }, { name: 'Rotation', type: 'rotation', value: '0°' }, { name: 'Scale', type: 'vector', value: '0.7' }] });
  const b = groupOutput(kit, 394, 40, { w: 110 });
  return kit.svg({ width: 520, height: 180 },
    a.svg, t.svg, b.svg,
    link(kit, a.out.Geometry, t.in.Geometry), link(kit, t.out.Geometry, b.in.Geometry),
    kit.text(260, 170, 'Shift+A > Geometry > Operations > Transform Geometry', { anchor: 'middle', size: 12 }),
  );
};
