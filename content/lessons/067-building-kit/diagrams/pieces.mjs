// Six of the kit's pieces, each in its own cell: floor_2m, wall_2m, wall_door, wall_window,
// wall_corner and roof_2m.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { floor, wall, corner, door, windowWall, roof } from './kit.mjs';

export default (kit) => {
  const pieces = [[floor(), 'floor_2m'], [wall(), 'wall_2m'], [door(), 'wall_door'], [windowWall(), 'wall_window'], [corner(), 'wall_corner'], [roof(), 'roof_2m']];
  return kit.svg({ width: 540, height: 290 }, pieces.map(([m, name], i) => {
    const x = 90 + (i % 3) * 180;
    const y = 80 + Math.floor(i / 3) * 140;
    const v = view({ azimuth: 25, elevation: 26, scale: 24, at: [x, y], target: [0, 0, 1] });
    return [drawMesh(kit, m, v, { width: 1.1 }), kit.text(x, y + 56, name, { size: 12, anchor: 'middle' })];
  }));
};
