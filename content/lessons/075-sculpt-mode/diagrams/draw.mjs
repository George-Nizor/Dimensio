// The surface seen side on. Dragging the Draw brush raises it; holding Ctrl while dragging pushes it
// in.
const surface = (x0, y0, w, shape) => Array.from({ length: 41 }, (_, i) => {
  const t = i / 40;
  return [x0 + t * w, y0 - shape(t)];
});

export default (kit) => {
  const bump = (t) => 34 * Math.exp(-((t - 0.5) ** 2) / 0.02);
  return kit.svg({ width: 500, height: 190 },
    kit.line(20, 130, 230, 130, { cls: 'd-guide', width: 1.2, dash: '4 4' }),
    kit.smooth(surface(20, 130, 210, bump), { cls: 'd-ink', width: 2.4 }),
    kit.line(125, 70, 125, 92, { cls: 'd-mark', width: 2 }), kit.arrowhead(125, 66, -Math.PI / 2, { size: 8 }),
    kit.text(125, 170, 'drag', { anchor: 'middle', size: 13 }),
    kit.line(270, 100, 480, 100, { cls: 'd-guide', width: 1.2, dash: '4 4' }),
    kit.smooth(surface(270, 100, 210, (t) => -bump(t)), { cls: 'd-ink', width: 2.4 }),
    kit.line(375, 120, 375, 142, { cls: 'd-mark', width: 2 }), kit.arrowhead(375, 146, Math.PI / 2, { size: 8 }),
    kit.text(375, 170, 'Ctrl + drag', { anchor: 'middle', size: 13 }),
  );
};
