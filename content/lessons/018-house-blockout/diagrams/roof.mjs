// The house from the side (Numpad 3): the roof is a square box turned 45 degrees, its middle on top
// of the walls. The top half is the roof; the bottom half, dashed, sits inside the house.
import { views, dimension } from '../../../diagrams/mesh.mjs';
import { floor, backWall, sideWalls, frontWall, roofTop, drawParts } from './shapes.mjs';

export default (kit) => {
  const v = views.right({ at: [200, 150], scale: 40, target: [0, 0, 2.2] });
  const h = (3.1 * Math.SQRT2) / 2;
  const p = (y, z) => v.project([2.4, y, z]);
  const [front, bottom, back] = [p(-h, 2.7), p(0, 2.7 - h), p(h, 2.7)];
  return kit.svg({ width: 440, height: 300 },
    drawParts(kit, v, [floor(), backWall(), ...sideWalls(), ...frontWall()]),
    drawParts(kit, v, [roofTop()]),
    kit.line(front[0], front[1], bottom[0], bottom[1], { cls: 'd-guide', width: 1.6, dash: '5 5' }),
    kit.line(bottom[0], bottom[1], back[0], back[1], { cls: 'd-guide', width: 1.6, dash: '5 5' }),
    dimension(kit, v, [0, 2.0, 0], [0, 2.0, 2.7], { offset: [0, 0.9, 0], label: '2.7 m' }),
    kit.text(200, 290, 'R X 45, its middle at the top of the walls', { anchor: 'middle', size: 12 }),
  );
};
