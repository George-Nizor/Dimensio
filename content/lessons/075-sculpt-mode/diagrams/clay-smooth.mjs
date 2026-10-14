// Side on. Clay Strips builds the surface up in flat-topped layers. Holding Shift while sculpting
// smooths bumps away.
const curve = (x0, y0, w, shape) => Array.from({ length: 61 }, (_, i) => { const t = i / 60; return [x0 + t * w, y0 - shape(t)]; });

export default (kit) => {
  const plateau = (t) => 30 / (1 + Math.exp(-(t - 0.25) * 40)) / (1 + Math.exp((t - 0.75) * 40));
  const rough = (t) => 8 * Math.sin(t * 38) * Math.sin(t * 7) + 4;
  return kit.svg({ width: 500, height: 190 },
    kit.line(20, 130, 230, 130, { cls: 'd-guide', width: 1.2, dash: '4 4' }),
    kit.polyline(curve(20, 130, 210, plateau), { cls: 'd-ink', width: 2.4 }),
    kit.polyline(curve(20, 130, 210, (t) => plateau(t) * 0.55), { cls: 'd-guide', width: 1.4 }),
    kit.text(125, 170, 'Clay Strips: flat layers', { anchor: 'middle', size: 12 }),
    kit.polyline(curve(270, 110, 210, rough), { cls: 'd-guide', width: 1.4 }),
    kit.smooth(curve(270, 110, 210, () => 4), { cls: 'd-ink', width: 2.4 }),
    kit.text(375, 170, 'Shift: smooth', { anchor: 'middle', size: 12 }),
  );
};
