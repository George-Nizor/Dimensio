// Wrong: looking for a filter setting in the palette image's Import dock, which has none. Right:
// the extracted material's Sampling > Filter set to Nearest Mipmap.
import { dock, option, heading } from './godot.mjs';

export default (kit) => kit.svg({ width: 500, height: 250 },
  dock(kit, { x: 14, y: 14, w: 222, h: 190, tabs: ['Import'] }),
  option(kit, 14, 58, 222, 'palette.png', ''),
  heading(kit, 14, 86, 'Compress'),
  option(kit, 14, 108, 222, 'Mode', 'VRAM Compressed', { indent: 8 }),
  heading(kit, 14, 136, 'Mipmaps'),
  option(kit, 14, 158, 222, 'Generate', true, { indent: 8 }),
  kit.text(125, 190, 'no filter setting here', { size: 12, anchor: 'middle', cls: 'd-tag d-tag-bad' }),
  kit.tag(125, 236, 'the image', { tone: 'bad' }),
  dock(kit, { x: 264, y: 14, w: 222, h: 190, tabs: ['Inspector'] }),
  option(kit, 264, 58, 222, 'Palette.tres', ''),
  heading(kit, 264, 86, 'Sampling'),
  option(kit, 264, 108, 222, 'Filter', 'Nearest Mipmap', { mark: true, indent: 8 }),
  option(kit, 264, 130, 222, 'Repeat', true, { indent: 8 }),
  kit.tag(375, 236, 'the material'),
);
