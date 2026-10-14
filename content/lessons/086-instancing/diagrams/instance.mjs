// Instance on Points puts the Props collection on every point. Collection Info has Separate Children
// and Reset Children ticked, and Pick Instance is ticked, so each point gets the rock or the tree.
import { node, link } from './nodes.mjs';

export default (kit) => {
  const d = node(kit, { x: 10, y: 14, w: 130, title: 'Distribute Points', outputs: [{ name: 'Points', type: 'geo' }] });
  const c = node(kit, { x: 10, y: 96, w: 150, title: 'Collection Info', outputs: [{ name: 'Instances', type: 'geo' }], inputs: [{ name: 'Collection', type: 'collection', value: 'Props' }, { name: 'Separate Children', check: true }, { name: 'Reset Children', check: true }] });
  const i = node(kit, { x: 250, y: 14, w: 150, title: 'Instance on Points', mark: true, outputs: [{ name: 'Instances', type: 'geo' }], inputs: [{ name: 'Points', type: 'geo' }, { name: 'Selection', type: 'bool', field: true }, { name: 'Instance', type: 'geo' }, { name: 'Pick Instance', check: true }, { name: 'Instance Index', type: 'int', field: true }, { name: 'Rotation', type: 'rotation', field: true }, { name: 'Scale', type: 'vector', field: true }] });
  return kit.svg({ width: 440, height: 210 },
    d.svg, c.svg, i.svg,
    link(kit, d.out.Points, i.in.Points), link(kit, c.out.Instances, i.in.Instance),
  );
};
