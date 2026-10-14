// How the two views turn render brightness into screen brightness. Standard climbs straight and
// stops flat at white; AgX bends over gently before it gets there.
import { propRow } from './stage.mjs';

export default (kit) => {
  const ox = 250;
  const oy = 170;
  const w = 220;
  const h = 140;
  const standard = [[0, 0], [0.55, 1], [1, 1]].map(([a, b]) => [ox + a * w, oy - b * h]);
  const agx = [];
  for (let i = 0; i <= 40; i += 1) {
    const a = i / 40;
    const b = 1 - Math.exp(-2.6 * a * a - 1.2 * a);
    agx.push([ox + a * w, oy - (b / (1 - Math.exp(-3.8))) * h * 0.97]);
  }
  return kit.svg({ width: 500, height: 200 },
    `<rect x="14" y="14" width="200" height="90" rx="6" class="d-paper" stroke-width="1.2"/>`,
    kit.text(26, 36, 'Color Management', { size: 12 }),
    propRow(kit, 24, 46, 'View Transform', 'AgX', { width: 180, split: 0.52, mark: true }),
    propRow(kit, 24, 72, 'Exposure', '0.000', { width: 180, split: 0.52 }),
    kit.line(ox, oy, ox + w, oy, { cls: 'd-guide', width: 1.4 }),
    kit.line(ox, oy, ox, oy - h - 10, { cls: 'd-guide', width: 1.4 }),
    kit.line(ox, oy - h, ox + w, oy - h, { cls: 'd-guide', width: 1, dash: '4 4' }),
    kit.text(ox - 6, oy - h + 4, 'white', { anchor: 'end', size: 10, cls: 'd-label' }),
    kit.text(ox + w / 2, oy + 18, 'brightness in the render', { anchor: 'middle', size: 11, cls: 'd-label' }),
    kit.polyline(standard, { cls: 'd-ink', width: 2 }),
    kit.text(ox + 0.58 * w, oy - h - 6, 'Standard', { size: 11 }),
    kit.smooth(agx, { cls: 'd-mark', width: 2.4 }),
    kit.text(ox + 0.7 * w, oy - 0.62 * h, 'AgX', { size: 12, cls: 'd-tag' }),
  );
};
