// Two Random Value nodes give every point its own turn and size: a Vector from 0 to 6.283 on Z (a
// full turn in radians) into Rotation, and a Float from 0.7 to 1.3 into Scale.
import { node, link } from './nodes.mjs';

export default (kit) => {
  const r = node(kit, { x: 10, y: 10, w: 150, title: 'Random Value', settings: ['Vector'], outputs: [{ name: 'Value', type: 'vector', field: true }], inputs: [{ name: 'Min', type: 'vector', value: '0, 0, 0' }, { name: 'Max', type: 'vector', value: '0, 0, 6.283' }] });
  const s = node(kit, { x: 10, y: 136, w: 150, title: 'Random Value', settings: ['Float'], outputs: [{ name: 'Value', type: 'float', field: true }], inputs: [{ name: 'Min', type: 'float', value: '0.7' }, { name: 'Max', type: 'float', value: '1.3' }] });
  const i = node(kit, { x: 280, y: 40, w: 150, title: 'Instance on Points', outputs: [{ name: 'Instances', type: 'geo' }], inputs: [{ name: 'Points', type: 'geo' }, { name: 'Instance', type: 'geo' }, { name: 'Rotation', type: 'rotation', field: true }, { name: 'Scale', type: 'vector', field: true }] });
  return kit.svg({ width: 450, height: 260 },
    r.svg, s.svg, i.svg,
    link(kit, r.out.Value, i.in.Rotation, { field: true, cls: 'd-mark' }),
    link(kit, s.out.Value, i.in.Scale, { field: true, cls: 'd-mark' }),
  );
};
