// The Layout workspace, every part labelled, with the default cube in the 3D Viewport.
import { blenderWindow, cube, view, drawMesh } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const win = blenderWindow(kit, { x: 120, y: 10, width: 420, height: 260, labels: false });
  const [vx, vy, vw, vh] = win.areas.viewport;
  const v = view({ at: [vx + vw * 0.5, vy + vh * 0.6], scale: 22 });
  const inside = (name, text, dy = 0) => {
    const [x, y, w, h] = win.areas[name];
    return kit.text(x + w / 2, y + h / 2 + 4 + dy, text, { anchor: 'middle', size: 12 });
  };
  const outside = (name, text) => {
    const [x, y, , h] = win.areas[name];
    return [kit.line(x - 4, y + h / 2, 104, y + h / 2, { cls: 'd-guide', width: 1.2 }), kit.text(98, y + h / 2 + 4, text, { anchor: 'end', size: 12 })];
  };
  return kit.svg({ width: 550, height: 280 },
    win.svg,
    drawMesh(kit, cube(), v, { width: 1.4 }),
    kit.text(vx + 24, vy + 22, '3D Viewport', { size: 12 }),
    inside('outliner', 'Outliner'), inside('properties', 'Properties'), inside('timeline', 'Timeline'),
    outside('topbar', 'Topbar'), outside('statusbar', 'Status Bar'),
  );
};
