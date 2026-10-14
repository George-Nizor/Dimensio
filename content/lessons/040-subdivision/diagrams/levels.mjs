// The default cube with Subdivision Surface at levels 0 to 3, added with Ctrl+1, Ctrl+2 and
// Ctrl+3. Each level splits every face into four and rounds the shape further.
import { cube, view, drawMesh, keycap } from '../../../diagrams/mesh.mjs';
import { subdivide } from '../../037-modifiers/diagrams/modkit.mjs';

export default (kit) => {
  const cells = [['cube', null, 0], ['Ctrl+1', 'Ctrl+1', 1], ['Ctrl+2', 'Ctrl+2', 2], ['Ctrl+3', 'Ctrl+3', 3]];
  return kit.svg({ width: 520, height: 200 },
    cells.map(([, key, level], i) => {
      const x = 66 + i * 128;
      const m = level ? subdivide(cube(), level) : cube();
      return [
        drawMesh(kit, m, view({ at: [x, 86], scale: 30 }), { width: level > 1 ? 0.6 : 1.4 }),
        key ? keycap(kit, x, 160, key, { size: 11 }) : kit.text(x, 164, 'no modifier', { anchor: 'middle', size: 12 }),
        kit.text(x, 192, `${6 * 4 ** level} faces`, { anchor: 'middle', size: 12 }),
      ];
    }),
  );
};
