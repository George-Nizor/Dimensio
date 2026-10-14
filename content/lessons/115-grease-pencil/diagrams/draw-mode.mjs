// The 3D Viewport in Draw Mode: the mode menu in the header, the brush circle following the mouse,
// a stroke being drawn, and the asset shelf of brushes along the bottom with Ink Pen picked out.
import { button, box } from './ui-kit.mjs';

export default (kit) => {
  const brushes = ['Pencil', 'Pen', 'Ink Pen', 'Marker Bold', 'Airbrush'];
  const stroke = [[90, 150], [120, 110], [165, 92], [215, 100], [250, 128], [262, 160]];
  return kit.svg({ width: 460, height: 270 },
    box(20, 16, 420, 238, { cls: 'd-ui', rx: 4 }),
    box(20, 16, 420, 24, { cls: 'd-sunk', rx: 4 }),
    button(kit, 28, 18, 'Draw Mode', { mark: true, width: 92 }),
    kit.text(132, 32, 'View   Select   Brush', { size: 11 }),
    kit.smooth(stroke, { cls: 'd-ink', width: 3 }),
    kit.circle(262, 160, 14, { cls: 'd-guide', width: 1.4 }),
    kit.text(282, 166, 'brush', { size: 12 }),
    box(24, 196, 412, 54, { cls: 'd-sunk', rx: 3 }),
    brushes.map((name, i) => {
      const x = 32 + i * 80;
      return [
        box(x, 202, 72, 28, { cls: name === 'Ink Pen' ? 'd-ui-mark' : 'd-paper', rx: 3, stroke: 1.2 }),
        kit.line(x + 10, 216, x + 62, 216, { cls: 'd-ink', width: name === 'Pencil' ? 1 : name === 'Marker Bold' ? 4 : 2 }),
        kit.text(x + 36, 244, name, { anchor: 'middle', size: 10 }),
      ];
    }),
    kit.text(436, 190, 'asset shelf', { anchor: 'end', size: 12, cls: 'd-tag' }),
  );
};
