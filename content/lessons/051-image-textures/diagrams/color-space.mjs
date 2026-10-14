// The Color Space setting on three Image Texture nodes: sRGB for the colour map, Non-Color for the
// roughness map and the normal map.
import { node } from './nodes.mjs';

export default (kit) => {
  const maps = [['colour', 'bricks059-color.jpg', 'sRGB'], ['roughness', 'bricks059-roughness.jpg', 'Non-Color'], ['normal', 'bricks059-normal-gl.jpg', 'Non-Color']];
  return kit.svg({ width: 640, height: 150 },
    maps.map(([label, file, space], i) => {
      const x = 12 + i * 210;
      const n = node(kit, { x, y: 14, w: 196, title: 'Image Texture', outputs: ['Color'], fields: [file, 'Linear', { text: space, mark: space === 'Non-Color' }] });
      return [n.svg, kit.text(x + 98, n.h + 38, label, { anchor: 'middle', size: 12 })];
    }),
  );
};
