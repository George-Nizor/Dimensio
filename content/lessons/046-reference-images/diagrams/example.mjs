// The exercise: the front and side pictures of the sword standing on the ground at right angles,
// 1 m tall, and the cube scaled to the blade between them.
import { box, view, drawMesh } from '../../../diagrams/mesh.mjs';
import { bothPictures } from './shapes.mjs';

export default (kit) => {
  const v = view({ at: [240, 214], scale: 190, azimuth: 32, elevation: 22, target: [0, 0, 0] });
  const blade = box({ size: [0.31, 0.12, 0.5], center: [0, 0, 0.634] });
  const ground = [[-0.6, -0.4, 0], [0.6, -0.4, 0], [0.6, 0.4, 0], [-0.6, 0.4, 0]].map((p) => v.project(p));
  return kit.svg({ width: 480, height: 240 },
    kit.polyline([...ground, ground[0]], { cls: 'd-guide', width: 1, dash: '4 5' }),
    bothPictures(kit, v),
    drawMesh(kit, blade, v, { mode: 'wire', width: 1.6, cls: 'd-mark' }),
  );
};
