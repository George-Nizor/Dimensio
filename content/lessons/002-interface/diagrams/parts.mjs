// The Topbar and the Status Bar picked out, with the four areas of the Layout workspace between.
import { blenderWindow } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const win = blenderWindow(kit, { x: 10, y: 10, width: 520, height: 300, highlight: ['topbar', 'statusbar'], labels: false });
  const label = (name, text) => {
    const [x, y, w, h] = win.areas[name];
    return kit.text(x + w / 2, y + h / 2 + 4, text, { anchor: 'middle', size: 12 });
  };
  return kit.svg({ width: 540, height: 352 },
    win.svg,
    label('viewport', '3D Viewport'), label('outliner', 'Outliner'), label('properties', 'Properties'), label('timeline', 'Timeline'),
    kit.text(20, 338, 'Topbar along the top, Status Bar along the bottom', { size: 12, cls: 'd-tag' }),
  );
};
