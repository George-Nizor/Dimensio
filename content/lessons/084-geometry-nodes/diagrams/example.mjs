// The exercise's result: the default cube turned into a tower of three cubes by a Geometry Nodes
// modifier, each copy smaller than the one below.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { tower } from './shapes.mjs';

export default (kit) => {
  const v = view({ at: [210, 150], scale: 40, target: [0, 0, 1.2] });
  return kit.svg({ width: 420, height: 270 }, drawMesh(kit, tower(), v, { width: 1.6 }));
};
