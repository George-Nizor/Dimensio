// Ctrl+Alt+Numpad 0: the camera leaves where it was (dashed) and jumps to the view you are looking
// from, aimed the same way.
import { drawMesh, keycap, view } from '../../../diagrams/mesh.mjs';
import { props, cameraSymbol, AIM } from './stage.mjs';

export default (kit) => {
  const v = view({ azimuth: 0, elevation: 55, target: AIM, at: [240, 128], scale: 58 });
  const before = [-2.7, -2.0, 1.1];
  const after = [2.6, -2.3, 1.5];
  return kit.svg({ width: 480, height: 258 },
    drawMesh(kit, props(), v, { width: 1.5 }),
    cameraSymbol(kit, v, before, AIM, { cls: 'd-guide', dash: '4 4', active: false, size: 0.75, width: 1.6 }),
    cameraSymbol(kit, v, after, AIM, { cls: 'd-mark', size: 0.75, width: 2 }),
    (() => { const a = v.project(before); const b = v.project(after); return kit.arcArrow(a[0] + 34, a[1] + 4, b[0] - 34, b[1] + 4, { lift: 10 }); })(),
    kit.text(96, 248, 'where it was', { anchor: 'middle', size: 12 }),
    kit.text(386, 248, 'your view', { anchor: 'middle', size: 12 }),
    keycap(kit, 240, 26, 'Ctrl+Alt+Numpad 0', { size: 11 }),
  );
};
