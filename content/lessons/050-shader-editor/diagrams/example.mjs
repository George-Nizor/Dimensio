// The finished material from this lesson: a Gradient Texture drives the Factor of a Mix node, the
// Mix node's Result feeds the Principled BSDF's Base Color, and the Principled BSDF feeds the
// Material Output. Beside it, the cube fading from blue to red.
import { node, link } from './nodes.mjs';
import { fadeCube } from './fade.mjs';

export default (kit) => {
  const grad = node(kit, { x: 12, y: 40, w: 124, title: 'Gradient Texture', outputs: ['Color', 'Factor'], fields: ['Linear'], inputs: ['Vector'] });
  const mix = node(kit, { x: 160, y: 20, w: 112, title: 'Mix', outputs: ['Result'], fields: ['Color'], inputs: ['Factor', { name: 'A', swatch: 'd-gizmo-z' }, { name: 'B', swatch: 'd-gizmo-x' }] });
  const bsdf = node(kit, { x: 296, y: 20, w: 128, title: 'Principled BSDF', outputs: ['BSDF'], inputs: ['Base Color', { name: 'Metallic', value: '0.000' }, { name: 'Roughness', value: '0.500' }, { name: 'Alpha', value: '1.000' }] });
  const out = node(kit, { x: 448, y: 30, w: 112, title: 'Material Output', fields: ['All'], inputs: ['Surface', 'Volume'] });
  return kit.svg({ width: 580, height: 250 },
    link(kit, grad.sockets['out:Factor'], mix.sockets['in:Factor']),
    link(kit, mix.sockets['out:Result'], bsdf.sockets['in:Base Color']),
    link(kit, bsdf.sockets['out:BSDF'], out.sockets['in:Surface']),
    grad.svg, mix.svg, bsdf.svg, out.svg,
    fadeCube(kit, { at: [504, 186], scale: 26 }),
  );
};
