// The six spheres from this lesson's exercise, each made with the Principled BSDF alone: painted
// wood, rough stone, gold, shiny red plastic, a glowing crystal and see-through glass made with Alpha, in front of a striped
// wall so the last two show what is behind them.
import { sphere, stripes } from './spheres.mjs';

export default (kit) => {
  const items = [
    ['painted wood', { body: 'd-face-sel', roughness: 0.5 }],
    ['rough stone', { body: 'd-face-2', roughness: 1 }],
    ['gold', { body: 'd-mark-fill', roughness: 0.15, metal: true }],
    ['red plastic', { body: 'd-gizmo-x', roughness: 0.1 }],
    ['crystal', { body: 'd-gizmo-z', roughness: 0.5, glow: true }],
    ['glass', { body: 'd-face-2', roughness: 0.1, alpha: 0.35 }],
  ];
  return kit.svg({ width: 600, height: 150 },
    stripes(kit, 10, 30, 580, 82, { width: 10 }),
    items.map(([label, options], i) => {
      const cx = 55 + i * 98;
      return [sphere(kit, cx, 71, 30, options), kit.text(cx, 140, label, { anchor: 'middle', size: 12 })];
    }),
  );
};
