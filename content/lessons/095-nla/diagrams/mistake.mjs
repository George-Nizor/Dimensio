// Wrong: a keyframe inserted after Push Down. Blender makes a new action, DoorAction, in the orange
// Action Track; it sits above every strip and overrides them, so the door ignores open and close.
// Right: the open strip in tweak mode after Tab, so new keyframes go into open itself.
import { nla } from '../../092-drivers/diagrams/animkit.mjs';

export default (kit) => {
  const wrong = nla(kit, 10, 14, 250, [
    { name: 'DoorAction', kind: 'action', strips: [] },
    { name: 'open', kind: 'track', strips: [[1, 24, 'open'], [60, 83, 'close']] },
  ], { names: 100, step: 40 });
  const right = nla(kit, 268, 14, 250, [
    { name: 'open', kind: 'action', strips: [] },
    { name: 'open', kind: 'track', strips: [[1, 24, 'open', 'mark'], [60, 83, 'close']] },
  ], { names: 100, step: 40 });
  return kit.svg({ width: 528, height: wrong.bottom + 70 },
    wrong.svg,
    `<rect x="${wrong.at(0)}" y="42" width="${wrong.at(100) - wrong.at(0)}" height="22" rx="3" class="d-key-bad" stroke-width="1" opacity="0.35"/>`,
    kit.text(135, wrong.bottom + 22, 'overrides every strip', { anchor: 'middle', size: 12 }),
    kit.tag(135, wrong.bottom + 50, 'keyed after Push Down', { tone: 'bad' }),
    right.svg,
    kit.text(393, right.bottom + 22, 'Tab: editing open', { anchor: 'middle', size: 12 }),
    kit.tag(393, right.bottom + 50, 'tweak the strip'),
  );
};
