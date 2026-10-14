// After the Boolean: the window cut through the wall, and the cutter shown only as a wire frame
// (Display As Wire), so it no longer hides the opening.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { wallWithWindow, cutter, wallView } from './shapes.mjs';

export default (kit) => {
  const v = wallView([200, 110], 62);
  return kit.svg({ width: 420, height: 236 },
    drawMesh(kit, wallWithWindow('ngon'), v, { width: 1.4 }),
    drawMesh(kit, cutter(), v, { mode: 'wire', width: 1.2, cls: 'd-guide' }),
    kit.text(200, 226, 'the cutter set to Display As Wire', { anchor: 'middle', size: 12 }),
  );
};
