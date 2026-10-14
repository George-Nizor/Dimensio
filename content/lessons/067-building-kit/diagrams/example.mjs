// A small building laid out in Godot's GridMap from the kit: two by two cells of floor, walls with
// a door and a window at the front, corner pieces, and a flat roof one level up.
import { view, drawMesh, join } from '../../../diagrams/mesh.mjs';
import { floor, wall, corner, door, windowWall, roof, place } from './kit.mjs';

export default (kit) => {
  const parts = [
    place(floor(), 0, 0), place(floor(), 1, 0), place(floor(), 0, 1), place(floor(), 1, 1),
    place(corner(), 0, 1, 0, 0), place(corner(), 1, 1, 0, -90), place(windowWall(), 1, 0, 0, 180), place(door(), 0, 0, 0, 180),
    place(wall(), 0, 0, 0, 90), place(wall(), 1, 0, 0, -90),
    place(roof(), 0, 0, 1), place(roof(), 1, 0, 1), place(roof(), 0, 1, 1), place(roof(), 1, 1, 1),
  ];
  const v = view({ azimuth: 32, elevation: 24, scale: 40, at: [240, 140], target: [1, 1, 1.4] });
  return kit.svg({ width: 480, height: 260 }, drawMesh(kit, join(...parts), v, { width: 1.2 }));
};
