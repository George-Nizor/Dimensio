// A Noise Texture's Factor feeding a Color Ramp whose stops sit close together, and the Color Ramp's
// Color feeding Base Color. Beside it, the grey noise before and the two-colour patches after.
import { node, link } from './nodes.mjs';
import { swatch, noise } from './patterns.mjs';

export default (kit) => {
  const f = noise(3, 4);
  const tex = node(kit, { x: 12, y: 20, w: 120, title: 'Noise Texture', outputs: ['Factor', 'Color'], inputs: ['Vector', { name: 'Scale', value: '5.000' }] });
  const ramp = node(kit, { x: 156, y: 30, w: 150, title: 'Color Ramp', outputs: ['Color', 'Alpha'], fields: [{ bar: { from: 'd-gizmo-z', to: 'd-mark-fill', stops: [0.45, 0.55] } }], inputs: ['Factor'] });
  const bsdf = node(kit, { x: 330, y: 20, w: 120, title: 'Principled BSDF', outputs: ['BSDF'], inputs: ['Base Color', { name: 'Roughness', value: '0.500' }] });
  return kit.svg({ width: 470, height: 290 },
    link(kit, tex.sockets['out:Factor'], ramp.sockets['in:Factor'], { mark: true }),
    link(kit, ramp.sockets['out:Color'], bsdf.sockets['in:Base Color'], { mark: true }),
    tex.svg, ramp.svg, bsdf.svg,
    swatch(kit, 60, 160, 100, f, { cells: 26 }),
    kit.text(110, 278, 'Factor alone', { anchor: 'middle', size: 12 }),
    kit.line(178, 210, 238, 210, { cls: 'd-mark', width: 2 }), kit.arrowhead(238, 210, 0, { size: 8 }),
    `<rect x="256" y="160" width="100" height="100" class="d-gizmo-z" stroke-width="0"/>`,
    swatch(kit, 256, 160, 100, (u, v) => (f(u, v) > 0.5 ? 1 : 0), { cells: 26, cls: 'd-mark-fill', back: false }),
    kit.text(306, 278, 'through the ramp', { anchor: 'middle', size: 12 }),
  );
};
