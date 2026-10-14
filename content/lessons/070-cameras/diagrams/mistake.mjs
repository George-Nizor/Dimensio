// Wrong: orbiting in camera view with Camera to View off leaves camera view, and the camera stays
// where it was. Right: with it ticked, the frame stays and the camera moves with the view.
import { drawMesh, view } from '../../../diagrams/mesh.mjs';
import { props, cameraSymbol, cameraPanel, shot, AIM } from './stage.mjs';

export default (kit) => {
  const v = view({ azimuth: 20, elevation: 24, target: AIM, at: [150, 104], scale: 44 });
  const right = cameraPanel(kit, 262, 20, 226, 170, { frame: 0.82, locked: true, clip: 'cameras-mistake' });
  return kit.svg({ width: 500, height: 232 },
    `<rect x="14" y="20" width="226" height="170" rx="6" class="d-ui" stroke-width="1"/>`,
    drawMesh(kit, props(), v, { width: 1.4 }),
    cameraSymbol(kit, v, [-0.9, -2.3, 1.2], AIM, { size: 0.55, width: 1.4 }),
    kit.text(127, 180, 'no frame: the camera stayed', { anchor: 'middle', size: 11 }),
    kit.tag(127, 218, 'Camera to View off', { tone: 'bad' }),
    right.svg, right.inside(drawMesh(kit, props(), shot(right.frame, [4.2, -3.8, 2.3]), { width: 1.5 })), right.border,
    kit.tag(375, 218, 'Camera to View on'),
  );
};
