// Wrong: the default cube reads Scale 1 and measures 2 m, so Scale 1 is not 1 m. Right: a cube with
// its Dimensions set to 1 m on every side.
import { cube, translate, view, drawMesh, dimension } from '../../../diagrams/mesh.mjs';
import { panel } from './parts.mjs';

export default (kit) => {
  const cell = (x, size, read, tag, tone) => {
    const v = view({ at: [x + 110, 130], scale: 32, target: [0, 0, 1] });
    return [
      panel(kit, x, 14, 220, 184),
      drawMesh(kit, translate(cube(size), [0, 0, size / 2]), v, { width: 1.6 }),
      dimension(kit, v, [-size / 2, -size / 2, 0], [size / 2, -size / 2, 0], { offset: [0, -0.6, 0] }),
      kit.text(x + 12, 34, read, { size: 12 }),
      kit.tag(x + 110, 220, tag, { tone }),
    ];
  };
  return kit.svg({ width: 500, height: 232 },
    cell(14, 2, 'Scale X 1.000', 'scale 1 is 2 m here', 'bad'),
    cell(266, 1, 'Dimensions X 1 m', 'read Dimensions'),
  );
};
