// Wrong: after a preview the Gradient Texture still feeds the Material Output's Surface, so the cube
// shows the gradient flat, with no light or shade. Right: the Principled BSDF feeds Surface again
// and the cube is lit.
import { node, link } from './nodes.mjs';
import { fadeCube } from './fade.mjs';

function half(kit, x, previewing) {
  const grad = node(kit, { x, y: 20, w: 120, title: 'Gradient Texture', outputs: ['Color', 'Factor'] });
  const bsdf = node(kit, { x, y: 98, w: 120, title: 'Principled BSDF', outputs: ['BSDF'], inputs: ['Base Color'] });
  const out = node(kit, { x: x + 146, y: 56, w: 104, title: 'Material Output', inputs: ['Surface', 'Volume'] });
  return [
    previewing
      ? link(kit, grad.sockets['out:Color'], out.sockets['in:Surface'], { cls: 'd-bad' })
      : link(kit, bsdf.sockets['out:BSDF'], out.sockets['in:Surface'], { mark: true }),
    grad.svg, bsdf.svg, out.svg,
    previewing ? fadeCube(kit, { at: [x + 200, 196], scale: 24, from: 'd-face-3', to: 'd-face-1', flat: true }) : fadeCube(kit, { at: [x + 200, 196], scale: 24 }),
    kit.tag(x + 125, 262, previewing ? 'still previewing: flat' : 'Principled BSDF linked back', { tone: previewing ? 'bad' : 'mark' }),
  ];
}

export default (kit) => kit.svg({ width: 580, height: 276 }, half(kit, 14, true), half(kit, 304, false));
