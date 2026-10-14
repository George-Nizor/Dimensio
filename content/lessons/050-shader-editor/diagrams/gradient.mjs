// A Gradient Texture's Factor feeding a Color Ramp whose Color drives the Mix node's Factor. Beside
// it, the cube fading from colour A on its left to colour B on its right, with the Color Ramp's
// stops pulled in so the fade is shorter.
import { node, link } from './nodes.mjs';
import { fadeCube } from './fade.mjs';

export default (kit) => {
  const grad = node(kit, { x: 14, y: 20, w: 128, title: 'Gradient Texture', outputs: ['Color', 'Factor'], fields: ['Linear'], inputs: ['Vector'] });
  const ramp = node(kit, { x: 166, y: 40, w: 140, title: 'Color Ramp', outputs: ['Color', 'Alpha'], fields: [{ bar: { from: 'd-dot', to: 'd-key', stops: [0.3, 0.7] } }], inputs: ['Factor'] });
  const mix = node(kit, { x: 330, y: 20, w: 120, title: 'Mix', outputs: ['Result'], fields: ['Color'], inputs: ['Factor', { name: 'A', swatch: 'd-gizmo-z' }, { name: 'B', swatch: 'd-gizmo-x' }] });
  return kit.svg({ width: 600, height: 210 },
    link(kit, grad.sockets['out:Factor'], ramp.sockets['in:Factor'], { mark: true }),
    link(kit, ramp.sockets['out:Color'], mix.sockets['in:Factor'], { mark: true }),
    grad.svg, ramp.svg, mix.svg,
    fadeCube(kit, { at: [526, 104], scale: 32, ramp: [0.3, 0.7] }),
    kit.text(526, 186, 'A left, B right', { anchor: 'middle', size: 12 }),
  );
};
