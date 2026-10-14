// Three Math nodes work on X for every point: Multiply by 3, Sine, Multiply by 0.2. The plot shows
// the result along one row of the grid: a wave 0.2 m high.
import { node, link } from './nodes.mjs';
import { height } from './wave.mjs';

export default (kit) => {
  const m1 = node(kit, { x: 10, y: 20, w: 110, title: 'Math', settings: ['Multiply'], outputs: [{ name: 'Value', type: 'float', field: true }], inputs: [{ name: 'Value', type: 'float', field: true }, { name: 'Value', type: 'float', value: '3' }] });
  const m2 = node(kit, { x: 146, y: 20, w: 110, title: 'Math', settings: ['Sine'], outputs: [{ name: 'Value', type: 'float', field: true }], inputs: [{ name: 'Value', type: 'float', field: true }] });
  const m3 = node(kit, { x: 282, y: 20, w: 110, title: 'Math', settings: ['Multiply'], outputs: [{ name: 'Value', type: 'float', field: true }], inputs: [{ name: 'Value', type: 'float', field: true }, { name: 'Value', type: 'float', value: '0.2' }] });
  const pts = Array.from({ length: 81 }, (_, i) => { const x = -2 + i * 0.05; return [418 + (x + 2) * 27, 82 - height(x) * 150]; });
  return kit.svg({ width: 540, height: 170 },
    m1.svg, m2.svg, m3.svg,
    link(kit, m1.out.Value, m2.in.Value, { field: true }), link(kit, m2.out.Value, m3.in.Value, { field: true }),
    kit.line(418, 82, 526, 82, { cls: 'd-guide', width: 1 }),
    kit.polyline(pts, { cls: 'd-mark', width: 2 }),
    kit.text(472, 140, 'height along X', { anchor: 'middle', size: 12 }),
  );
};
