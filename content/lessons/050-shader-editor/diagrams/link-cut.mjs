// Left, a link dragged from a Color output to a Base Color input. Right, a dashed cutting line drawn
// across a link while Ctrl and the right mouse button are held.
import { keycap, cursor, mouse } from '../../../diagrams/mesh.mjs';
import { node, link } from './nodes.mjs';

export default (kit) => {
  const pair = (x) => [
    node(kit, { x, y: 24, w: 124, title: 'Gradient Texture', outputs: ['Color', 'Factor'], fields: ['Linear'] }),
    node(kit, { x: x + 160, y: 50, w: 118, title: 'Principled BSDF', outputs: ['BSDF'], inputs: ['Base Color', { name: 'Metallic', value: '0.000' }] }),
  ];
  const [a, b] = pair(12);
  const [c, d] = pair(318);
  const [cx, cy] = c.sockets['out:Color'];
  const [dx, dy] = d.sockets['in:Base Color'];
  const mx = (cx + dx) / 2;
  const my = (cy + dy) / 2;
  return kit.svg({ width: 610, height: 220 },
    link(kit, a.sockets['out:Color'], b.sockets['in:Base Color'], { mark: true }),
    a.svg, b.svg,
    cursor(kit, b.sockets['in:Base Color'][0] - 1, b.sockets['in:Base Color'][1] - 1),
    kit.text(150, 200, 'drag an output to an input', { anchor: 'middle', size: 12 }),
    link(kit, [cx, cy], [dx, dy]),
    c.svg, d.svg,
    kit.line(mx - 10, my - 36, mx + 10, my + 34, { cls: 'd-mark', width: 2, dash: '5 4' }),
    keycap(kit, 424, 168, 'Ctrl', { size: 11 }), kit.text(450, 172, '+', { anchor: 'middle', size: 13 }),
    mouse(kit, 474, 164, { button: 'right', size: 0.42 }),
    kit.text(456, 210, 'right drag across a link', { anchor: 'middle', size: 12 }),
  );
};
