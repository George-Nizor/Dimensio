// Stone: a Voronoi Texture with Feature set to Distance to Edge and Scale 3, its Distance through a
// Color Ramp on Constant, with a dark stop at 0 for the gaps and a grey one at 0.05 for the stones.
// Beside it, the floor it makes.
import { view } from '../../../diagrams/mesh.mjs';
import { node, link } from './nodes.mjs';
import { stones } from './surface.mjs';

export default (kit) => {
  const vor = node(kit, { x: 12, y: 14, w: 140, title: 'Voronoi Texture', outputs: ['Distance'], fields: ['3D', { text: 'Distance to Edge', mark: true }], inputs: ['Vector', { name: 'Scale', value: '3.000', mark: true }, { name: 'Randomness', value: '1.000' }] });
  const ramp = node(kit, { x: 176, y: 30, w: 146, title: 'Color Ramp', outputs: ['Color', 'Alpha'], fields: [{ text: 'Constant', mark: true }, { bar: { from: 'd-dot', to: 'd-face-2', stops: [0.05, 0.06] } }], inputs: ['Factor'] });
  const v = view({ at: [416, 110], scale: 46, azimuth: 15, elevation: 50 });
  return kit.svg({ width: 520, height: 220 },
    link(kit, vor.sockets['out:Distance'], ramp.sockets['in:Factor'], { mark: true }),
    vor.svg, ramp.svg,
    kit.line(322, 66, 340, 66, { cls: 'd-ink', width: 1.6 }),
    kit.text(250, 210, 'Color to Base Color', { anchor: 'middle', size: 12 }),
    stones(kit, v, [-1.6, -1.6, 1.6, 1.6], { count: 4 }),
  );
};
