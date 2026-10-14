// The finished brick material: three Image Texture nodes feeding the Principled BSDF. The colour
// map, in sRGB, feeds Base Color; the roughness map, in Non-Color, feeds Roughness; the normal map,
// in Non-Color, feeds a Normal Map node whose Normal feeds the Principled BSDF's Normal.
import { node, link } from './nodes.mjs';

export default (kit) => {
  const image = (y, name, space) => node(kit, { x: 12, y, w: 196, title: 'Image Texture', outputs: ['Color', 'Alpha'], fields: [name, { text: space, mark: space === 'Non-Color' }], inputs: ['Vector'] });
  const colour = image(10, 'bricks059-color.jpg', 'sRGB');
  const rough = image(140, 'bricks059-roughness.jpg', 'Non-Color');
  const normal = image(270, 'bricks059-normal-gl.jpg', 'Non-Color');
  const map = node(kit, { x: 232, y: 286, w: 136, title: 'Normal Map', outputs: ['Normal'], fields: ['Tangent Space'], inputs: [{ name: 'Strength', value: '1.000' }, 'Color'] });
  const bsdf = node(kit, { x: 404, y: 30, w: 150, title: 'Principled BSDF', outputs: ['BSDF'], inputs: ['Base Color', { name: 'Metallic', value: '0.000' }, 'Roughness', { name: 'IOR', value: '1.500' }, { name: 'Alpha', value: '1.000' }, 'Normal'] });
  return kit.svg({ width: 570, height: 400 },
    link(kit, colour.sockets['out:Color'], bsdf.sockets['in:Base Color']),
    link(kit, rough.sockets['out:Color'], bsdf.sockets['in:Roughness']),
    link(kit, normal.sockets['out:Color'], map.sockets['in:Color']),
    link(kit, map.sockets['out:Normal'], bsdf.sockets['in:Normal']),
    colour.svg, rough.svg, normal.svg, map.svg, bsdf.svg,
  );
};
