// A box with three planks on every side: loop cuts at the thirds, one more loop 10 cm under each,
// and the two strips pushed in 5 cm to make grooves.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { planks } from './shapes.mjs';

export default (kit) => {
  const v = view({ at: [200, 130], scale: 62 });
  return kit.svg({ width: 400, height: 270 }, drawMesh(kit, planks(), v, { width: 1.4 }));
};
