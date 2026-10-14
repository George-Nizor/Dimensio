// Wrong: the normal map's Color linked straight to Normal, and the wall turns dark. Right: a Normal
// Map node between them, and the bricks are lit with their mortar sunk in.
import { node, link } from './nodes.mjs';
import { bricks } from './bricks.mjs';

function half(kit, x, right) {
  const tex = node(kit, { x, y: 14, w: 116, title: 'Image Texture', outputs: ['Color'], fields: ['normal-gl'] });
  const bsdf = node(kit, { x: x + (right ? 164 : 150), y: 30, w: 118, title: 'Principled BSDF', outputs: ['BSDF'], inputs: ['Base Color', 'Normal'] });
  const out = [tex.svg, bsdf.svg];
  if (right) {
    const map = node(kit, { x: x + 34, y: 96, w: 106, title: 'Normal Map', outputs: ['Normal'], inputs: ['Color'] });
    out.unshift(link(kit, tex.sockets['out:Color'], map.sockets['in:Color'], { mark: true }), link(kit, map.sockets['out:Normal'], bsdf.sockets['in:Normal'], { mark: true }));
    out.push(map.svg);
  } else {
    out.unshift(link(kit, tex.sockets['out:Color'], bsdf.sockets['in:Normal'], { cls: 'd-bad' }));
  }
  out.push(bricks(kit, x + 40, 170, 190, 96, { rows: 5, perRow: 4, relief: right, dark: !right }));
  out.push(kit.tag(x + 135, 290, right ? 'through a Normal Map node' : 'straight into Normal: dark', { tone: right ? 'mark' : 'bad' }));
  return out;
}

export default (kit) => kit.svg({ width: 600, height: 304 }, half(kit, 12, false), half(kit, 310, true));
