// Left, a muted Color Ramp: its title greyed and a red line through it, as Blender shows a node
// that passes its input straight on. Right, Shift+Alt and a left click on the Gradient Texture
// link it straight to the Material Output, to see it alone.
import { keycap, mouse } from '../../../diagrams/mesh.mjs';
import { node, link } from './nodes.mjs';

export default (kit) => {
  const ramp = node(kit, { x: 70, y: 30, w: 120, title: 'Color Ramp', outputs: ['Color', 'Alpha'], fields: [{ bar: { from: 'd-dot', to: 'd-key', stops: [0, 1] } }], inputs: ['Factor'] });
  const [ix, iy] = ramp.sockets['in:Factor'];
  const [ox, oy] = ramp.sockets['out:Color'];
  const grad = node(kit, { x: 330, y: 30, w: 128, title: 'Gradient Texture', outputs: ['Color', 'Factor'], fields: ['Linear'], mark: true });
  const out = node(kit, { x: 494, y: 44, w: 116, title: 'Material Output', fields: ['All'], inputs: ['Surface', 'Volume'] });
  return kit.svg({ width: 630, height: 220 },
    kit.line(14, iy, ix, iy, { cls: 'd-bad', width: 2 }),
    kit.line(ox, oy, 250, oy, { cls: 'd-bad', width: 2 }),
    `<g opacity="0.55">${ramp.svg.join('')}</g>`,
    kit.path(`M ${ix} ${iy} C ${ix + 50} ${iy} ${ox - 50} ${oy} ${ox} ${oy}`, { cls: 'd-bad', width: 2 }),
    keycap(kit, 130, 186, 'M'),
    kit.text(130, 214, 'muted', { anchor: 'middle', size: 12 }),
    link(kit, grad.sockets['out:Color'], out.sockets['in:Surface'], { mark: true }),
    grad.svg, out.svg,
    keycap(kit, 420, 186, 'Shift+Alt', { size: 11 }), kit.text(462, 190, '+', { anchor: 'middle', size: 13 }),
    mouse(kit, 486, 182, { button: 'left', size: 0.42 }),
    kit.text(450, 214, 'previewing one node', { anchor: 'middle', size: 12 }),
  );
};
