// Wrong: only walk-loop was stashed, so idle-loop is on no track and Godot lists only walk.
// Right: both actions on stashed tracks, and Godot lists idle and walk.
import { panel } from './helpers.mjs';

export default (kit) => {
  const side = (x, both, tone) => [
    panel(kit, x, 14, 220, 150),
    kit.text(x + 12, 36, 'NLA', { size: 11 }),
    both ? [`<rect x="${x + 12}" y="46" width="196" height="22" rx="3" class="d-ui-mark" stroke-width="1"/>`, kit.text(x + 20, 61, 'idle-loop', { size: 11 })] : kit.text(x + 20, 61, 'idle-loop on no track', { size: 11, cls: tone === 'bad' ? 'd-tag d-tag-bad' : 'd-label' }),
    `<rect x="${x + 12}" y="74" width="196" height="22" rx="3" class="d-ui-mark" stroke-width="1"/>`, kit.text(x + 20, 89, 'walk-loop', { size: 11 }),
    kit.text(x + 12, 118, 'Godot', { size: 11 }),
    kit.text(x + 20, 140, both ? 'idle, walk' : 'walk', { size: 12 }),
  ];
  return kit.svg({ width: 480, height: 200 },
    side(10, false, 'bad'),
    kit.tag(120, 188, 'one stashed', { tone: 'bad' }),
    side(250, true),
    kit.tag(360, 188, 'both stashed'),
  );
};
