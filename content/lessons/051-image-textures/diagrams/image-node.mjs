// A new Image Texture node before an image is chosen: the picture icon that lists images already in
// the file, then New and Open. Its Color output is linked to Base Color.
import { cursor } from '../../../diagrams/mesh.mjs';
import { node, link } from './nodes.mjs';

export default (kit) => {
  const tex = node(kit, { x: 20, y: 30, w: 190, title: 'Image Texture', outputs: ['Color', 'Alpha'], fields: ['', 'Linear', 'Flat', 'Repeat'], inputs: ['Vector'] });
  const bsdf = node(kit, { x: 280, y: 40, w: 150, title: 'Principled BSDF', outputs: ['BSDF'], inputs: ['Base Color', { name: 'Metallic', value: '0.000' }, { name: 'Roughness', value: '0.500' }] });
  // The image row: picture icon, New, Open, drawn over the first (empty) field.
  const rowY = 30 + 22 + 4 + 2 * 19 + 2;
  return kit.svg({ width: 450, height: 240 },
    link(kit, tex.sockets['out:Color'], bsdf.sockets['in:Base Color'], { mark: true }),
    tex.svg, bsdf.svg,
    `<rect x="29" y="${rowY}" width="26" height="15" rx="3" class="d-key-mark" stroke-width="1"/>`,
    `<rect x="35" y="${rowY + 3}" width="14" height="9" rx="1" class="d-paper" stroke-width="0"/>`,
    `<rect x="59" y="${rowY}" width="66" height="15" rx="3" class="d-key" stroke-width="1"/>`,
    kit.text(92, rowY + 11, '+ New', { size: 11, anchor: 'middle', cls: 'd-key-text' }),
    `<rect x="129" y="${rowY}" width="72" height="15" rx="3" class="d-key-mark" stroke-width="1"/>`,
    kit.text(165, rowY + 11, 'Open', { size: 11, anchor: 'middle', cls: 'd-key-text d-key-text-mark' }),
    cursor(kit, 186, rowY + 10),
    kit.text(42, 214, 'images in the file', { size: 12, anchor: 'start' }),
    kit.line(42, 202, 42, rowY + 18, { cls: 'd-guide', width: 1.2 }),
    kit.text(165, 214, 'a file on disk', { size: 12, anchor: 'start' }),
    kit.line(170, 202, 170, rowY + 30, { cls: 'd-guide', width: 1.2 }),
  );
};
