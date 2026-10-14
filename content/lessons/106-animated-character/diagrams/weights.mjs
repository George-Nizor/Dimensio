// Cleaning up weights: one vertex pulled by six bones, and after Weights > Limit Total with Limit
// set to 4 only its four strongest stay, the most the exporter writes for each vertex.
import { menuPath } from './helpers.mjs';

export default (kit) => {
  const bars = (x, values, kept) => values.map(([name, v], i) => {
    const on = i < kept;
    return [
      kit.text(x, 40 + i * 22, name, { size: 11 }),
      `<rect x="${x + 72}" y="${28 + i * 22}" width="${v * 110}" height="14" rx="2" class="${on ? 'd-face-sel' : 'd-face-3'}" stroke-width="0"/>`,
      on ? '' : kit.line(x - 4, 36 + i * 22, x + 72 + v * 110 + 4, 36 + i * 22, { cls: 'd-bad', width: 1.6 }),
    ];
  });
  const groups = [['upper_arm.L', 0.5], ['chest', 0.25], ['forearm.L', 0.12], ['neck', 0.07], ['spine', 0.04], ['hips', 0.02]];
  return kit.svg({ width: 500, height: 230 },
    kit.text(20, 18, 'one vertex at the shoulder', { size: 12 }),
    bars(20, groups, 6),
    kit.line(225, 30, 225, 150, { cls: 'd-guide', width: 1 }),
    kit.text(260, 18, 'after Limit Total, Limit 4', { size: 12 }),
    bars(260, groups, 4),
    menuPath(kit, 20, 180, ['Weights', 'Limit Total']).svg,
    kit.text(196, 195, 'then', { size: 11 }),
    menuPath(kit, 236, 180, ['Weights', 'Normalize All']).svg,
  );
};
