// One material for the whole model: an Image Texture holding the palette, its Interpolation set to
// Closest, its Color linked to Base Color.
import { node, link } from './nodes.mjs';
import { palette } from './palette.mjs';

export default (kit) => {
  const tex = node(kit, { x: 16, y: 20, w: 170, title: 'Image Texture', outputs: ['Color', 'Alpha'], fields: [{ image: 'palette' }, 'palette', { text: 'Closest', mark: true }, 'Flat', 'Repeat', 'sRGB'], inputs: ['Vector'] });
  const bsdf = node(kit, { x: 250, y: 30, w: 150, title: 'Principled BSDF', outputs: ['BSDF'], inputs: ['Base Color', { name: 'Metallic', value: '0.000' }, { name: 'Roughness', value: '0.500' }] });
  // The node's image preview, drawn over its preview row.
  const py = 20 + 22 + 4 + 2 * 19 + 3;
  return kit.svg({ width: 420, height: tex.h + 40 },
    link(kit, tex.sockets['out:Color'], bsdf.sockets['in:Base Color'], { mark: true }),
    tex.svg, bsdf.svg,
    `<rect x="26" y="${py}" width="150" height="32" class="d-paper" stroke-width="0"/>`,
    palette(kit, 85, py, 32),
  );
};
