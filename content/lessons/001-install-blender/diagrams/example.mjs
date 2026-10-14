// Blender as it first opens: the Layout workspace, the default cube in the 3D Viewport, and the
// splash screen over the middle of the window with the cube showing past its corner.
import { blenderWindow, cube, view, drawMesh } from '../../../diagrams/mesh.mjs';
import { splash } from './splash-kit.mjs';

export default (kit) => {
  const win = blenderWindow(kit, { x: 10, y: 10, width: 520, height: 300, labels: false });
  const [vx, vy, vw, vh] = win.areas.viewport;
  const v = view({ at: [vx + vw * 0.3, vy + vh * 0.62], scale: 34 });
  return kit.svg({ width: 540, height: 320 },
    win.svg,
    drawMesh(kit, cube(), v, { width: 1.6 }),
    splash(kit, 175, 52, { width: 230, height: 150, setup: false }),
  );
};
