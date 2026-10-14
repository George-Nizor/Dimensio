// The finished character: one palette material, a 15-bone armature inside it, and in Godot an
// AnimationPlayer with idle and walk, both looping.
import { silhouette, bone, panel, loopSign } from './helpers.mjs';
import { BONES, front, parts } from './figure.mjs';

export default (kit) => {
  const s = 120;
  const p = front(130, 236, s);
  return kit.svg({ width: 470, height: 270 },
    panel(kit, 20, 14, 220, 236),
    silhouette(kit, parts(p, s), { width: 1.4 }),
    BONES.map(([, h, t]) => bone(kit, p(h), p(t), { width: 1.2 })),
    kit.text(130, 268, '15 bones', { anchor: 'middle', size: 12 }),
    `<rect x="270" y="60" width="180" height="96" rx="6" class="d-ui" stroke-width="1"/>`,
    kit.text(282, 80, 'Godot, AnimationPlayer', { size: 11 }),
    `<rect x="280" y="90" width="160" height="24" rx="4" class="d-paper" stroke-width="1"/>`,
    kit.text(290, 106, 'idle', { size: 12 }), loopSign(kit, 418, 102),
    `<rect x="280" y="120" width="160" height="24" rx="4" class="d-paper" stroke-width="1"/>`,
    kit.text(290, 136, 'walk', { size: 12 }), loopSign(kit, 418, 132),
  );
};
