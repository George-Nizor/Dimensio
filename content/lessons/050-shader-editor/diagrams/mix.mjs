// A Mix node set to Color, Factor 0.5, with two colours in A and B, its Result linked to the
// Principled BSDF's Base Color.
import { node, link } from './nodes.mjs';

export default (kit) => {
  const mix = node(kit, {
    x: 20, y: 20, w: 150, title: 'Mix', outputs: ['Result'], fields: ['Color', 'Mix'],
    inputs: [{ name: 'Factor', value: '0.500', mark: true }, { name: 'A', swatch: 'd-gizmo-z' }, { name: 'B', swatch: 'd-gizmo-x' }],
  });
  const bsdf = node(kit, {
    x: 240, y: 20, w: 160, title: 'Principled BSDF', outputs: ['BSDF'],
    inputs: ['Base Color', { name: 'Metallic', value: '0.000' }, { name: 'Roughness', value: '0.500' }, { name: 'IOR', value: '1.500' }],
  });
  return kit.svg({ width: 420, height: Math.max(mix.h, bsdf.h) + 64 },
    link(kit, mix.sockets['out:Result'], bsdf.sockets['in:Base Color'], { mark: true }),
    mix.svg, bsdf.svg,
    kit.text(95, mix.h + 44, 'Factor 0 gives A, 1 gives B', { anchor: 'middle', size: 12 }),
  );
};
