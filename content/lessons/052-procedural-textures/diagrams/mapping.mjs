// Texture Coordinate's Object output feeding a Mapping node, whose Vector feeds the Wave Texture.
// Mapping's Scale X at 0.3 draws the pattern over three times longer along X: below, the plank's
// grain with Scale X at 1 and at 0.3.
import { view } from '../../../diagrams/mesh.mjs';
import { node, link } from './nodes.mjs';
import { planks } from './surface.mjs';

export default (kit) => {
  const coords = node(kit, { x: 12, y: 14, w: 120, title: 'Texture Coordinate', outputs: ['Generated', 'Normal', 'UV', { name: 'Object', mark: true }, 'Camera'] });
  const mapping = node(kit, { x: 160, y: 14, w: 130, title: 'Mapping', outputs: ['Vector'], fields: ['Point'], inputs: [{ name: 'Vector', mark: true }, 'Location', 'Rotation', 'Scale', { name: 'X', value: '0.300', socket: false, mark: true }, { name: 'Y', value: '1.000', socket: false }, { name: 'Z', value: '1.000', socket: false }] });
  const wave = node(kit, { x: 318, y: 14, w: 120, title: 'Wave Texture', outputs: ['Color', 'Factor'], fields: ['Bands', 'Y'], inputs: [{ name: 'Vector', mark: true }] });
  const v1 = view({ at: [140, 300], scale: 58, azimuth: 8, elevation: 50 });
  const v2 = view({ at: [370, 300], scale: 58, azimuth: 8, elevation: 50 });
  return kit.svg({ width: 460, height: 360 },
    link(kit, coords.sockets['out:Object'], mapping.sockets['in:Vector'], { mark: true }),
    link(kit, mapping.sockets['out:Vector'], wave.sockets['in:Vector'], { mark: true }),
    coords.svg, mapping.svg, wave.svg,
    planks(kit, v1, [-1.6, -0.25, 1.6, 0.25], { count: 1, grain: 4, stretch: 0.3 }),
    kit.text(140, 348, 'Scale X 1', { anchor: 'middle', size: 12 }),
    planks(kit, v2, [-1.6, -0.25, 1.6, 0.25], { count: 1, grain: 4, stretch: 1 }),
    kit.text(370, 348, 'Scale X 0.3: stretched', { anchor: 'middle', size: 12 }),
  );
};
