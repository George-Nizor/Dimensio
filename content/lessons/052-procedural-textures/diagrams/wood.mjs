// Wood grain: Texture Coordinate (Object) into Mapping (Scale X 0.3) into a Wave Texture (Bands,
// direction Y, Scale 3, Distortion 6), its Factor coloured dark to light brown by a Color Ramp, into
// Base Color. Below, the planks it makes.
import { view } from '../../../diagrams/mesh.mjs';
import { node, link } from './nodes.mjs';
import { planks } from './surface.mjs';

export default (kit) => {
  const s = 10;
  const coords = node(kit, { x: 10, y: 14, w: 122, size: s, title: 'Texture Coordinate', outputs: ['UV', 'Object'] });
  const mapping = node(kit, { x: 148, y: 14, w: 100, size: s, title: 'Mapping', outputs: ['Vector'], inputs: ['Vector', 'Scale', { name: 'X', value: '0.3', socket: false, mark: true }] });
  const wave = node(kit, { x: 264, y: 14, w: 118, size: s, title: 'Wave Texture', outputs: ['Color', 'Factor'], fields: ['Bands', { text: 'Y', mark: true }], inputs: ['Vector', { name: 'Scale', value: '3.0' }, { name: 'Distortion', value: '6.0', mark: true }] });
  const ramp = node(kit, { x: 398, y: 24, w: 110, size: s, title: 'Color Ramp', outputs: ['Color'], fields: [{ bar: { from: 'd-face-3', to: 'd-face-sel', stops: [0, 1] } }], inputs: ['Factor'] });
  const bsdf = node(kit, { x: 524, y: 14, w: 114, size: s, title: 'Principled BSDF', outputs: ['BSDF'], inputs: ['Base Color'] });
  const v = view({ at: [316, 260], scale: 70, azimuth: 10, elevation: 45 });
  return kit.svg({ width: 650, height: 330 },
    link(kit, coords.sockets['out:Object'], mapping.sockets['in:Vector']),
    link(kit, mapping.sockets['out:Vector'], wave.sockets['in:Vector']),
    link(kit, wave.sockets['out:Factor'], ramp.sockets['in:Factor']),
    link(kit, ramp.sockets['out:Color'], bsdf.sockets['in:Base Color']),
    coords.svg, mapping.svg, wave.svg, ramp.svg, bsdf.svg,
    planks(kit, v, [-2.2, -0.6, 2.2, 0.6], { count: 4, grain: 3 }),
  );
};
