// The roughness map linked to Roughness, and the normal map going through a Normal Map node into
// Normal.
import { node, link } from './nodes.mjs';

export default (kit) => {
  const rough = node(kit, { x: 12, y: 14, w: 196, title: 'Image Texture', outputs: ['Color', 'Alpha'], fields: ['bricks059-roughness.jpg', 'Non-Color'] });
  const normal = node(kit, { x: 12, y: 132, w: 196, title: 'Image Texture', outputs: ['Color', 'Alpha'], fields: ['bricks059-normal-gl.jpg', 'Non-Color'] });
  const map = node(kit, { x: 232, y: 140, w: 136, title: 'Normal Map', outputs: ['Normal'], fields: ['Tangent Space'], inputs: [{ name: 'Strength', value: '1.000' }, { name: 'Color', mark: true }] });
  const bsdf = node(kit, { x: 404, y: 20, w: 150, title: 'Principled BSDF', outputs: ['BSDF'], inputs: ['Base Color', { name: 'Metallic', value: '0.000' }, { name: 'Roughness', mark: true }, { name: 'IOR', value: '1.500' }, { name: 'Alpha', value: '1.000' }, { name: 'Normal', mark: true }] });
  return kit.svg({ width: 570, height: 262 },
    link(kit, rough.sockets['out:Color'], bsdf.sockets['in:Roughness'], { mark: true }),
    link(kit, normal.sockets['out:Color'], map.sockets['in:Color'], { mark: true }),
    link(kit, map.sockets['out:Normal'], bsdf.sockets['in:Normal'], { mark: true }),
    rough.svg, normal.svg, map.svg, bsdf.svg,
  );
};
