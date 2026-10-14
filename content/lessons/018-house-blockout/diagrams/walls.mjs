// The floor with the back wall and the two side walls standing on it. The back wall is 2.5 m high,
// and the side walls are 3.6 m long, to fit between the front and back walls.
import { view, dimension } from '../../../diagrams/mesh.mjs';
import { plot, floor, backWall, sideWalls, drawParts } from './shapes.mjs';

export default (kit) => {
  const v = view({ azimuth: 32, elevation: 24, at: [220, 156], scale: 32, target: [0, 0, 1.2] });
  return kit.svg({ width: 480, height: 280 },
    drawParts(kit, v, [floor(), backWall(), ...sideWalls()], { under: [plot()] }),
    dimension(kit, v, [2.5, 1.8, 0.2], [2.5, 1.8, 2.7], { offset: [0, 0.9, 0], label: '2.5 m' }),
    dimension(kit, v, [2.5, -1.8, 0.2], [2.5, 1.8, 0.2], { offset: [0.9, 0, -0.2], label: '3.6 m' }),
  );
};
