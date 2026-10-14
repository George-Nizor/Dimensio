// Wrong: the mouse over the Outliner when Ctrl+J is pressed, so nothing happens. Right: the mouse
// over the 3D Viewport, where Ctrl+J joins the two selected objects.
import { blenderWindow, cursor, keycap } from '../../../diagrams/mesh.mjs';

const half = (kit, x, area, tag, tone) => {
  const win = blenderWindow(kit, { x, y: 40, width: 220, height: 140, highlight: [area], labels: false });
  const [ax, ay, aw, ah] = win.areas[area];
  return [
    win.svg,
    cursor(kit, ax + aw * 0.45, ay + ah * 0.4),
    keycap(kit, x + 110, 22, 'Ctrl+J', { size: 11 }),
    kit.tag(x + 110, 206, tag, { tone }),
  ];
};

export default (kit) => kit.svg({ width: 500, height: 220 },
  half(kit, 15, 'outliner', 'nothing happens', 'bad'),
  half(kit, 265, 'viewport', 'objects join'),
);
