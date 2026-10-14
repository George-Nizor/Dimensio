// The Scripting workspace with each area named: the 3D Viewport, Python Console and Info editor
// down the left, the Text Editor in the middle, the Outliner and Properties editor on the right.
import { box } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => {
  // Proportions from the Scripting screen in Blender 5.2.2's startup file (1920 x 1080).
  const x0 = 10;
  const y0 = 10;
  const sx = 480 / 1920;
  const sy = 270 / 1080;
  const area = (x, y, w, h, name, mark) => {
    const ax = x0 + x * sx;
    const ay = y0 + (1080 - y - h) * sy;
    return [box(ax, ay, w * sx - 2, h * sy - 2, { cls: mark ? 'd-ui-mark' : 'd-ui', rx: 3 }), kit.text(ax + (w * sx) / 2, ay + (h * sy) / 2 + 4, name, { anchor: 'middle', size: 11 })];
  };
  return kit.svg({ width: 500, height: 290 },
    box(x0, y0, 480, 6, { cls: 'd-sunk', rx: 1 }),
    area(2, 661, 558, 393, '3D Viewport'),
    area(2, 195, 558, 463, 'Python Console', true),
    area(2, 23, 558, 169, 'Info', true),
    area(563, 23, 1013, 1031, 'Text Editor'),
    area(1579, 852, 339, 202, 'Outliner'),
    area(1579, 631, 339, 218, 'Outliner'),
    area(1579, 23, 339, 605, 'Properties'),
  );
};
