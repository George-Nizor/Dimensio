// Godot's animation list after exporting. Wrong: Animation Mode left on Actions, so each crate
// and the cart come in as an animation of their own. Right: Active actions merged, one fall.
import { panel } from './helpers.mjs';

export default (kit) => {
  const list = (x, names, tone) => [
    panel(kit, x, 14, 220, 176),
    kit.text(x + 12, 34, 'AnimationPlayer', { size: 11 }),
    names.map((name, i) => [`<rect x="${x + 10}" y="${44 + i * 20}" width="200" height="18" rx="3" class="${tone === 'bad' ? 'd-paper' : 'd-ui-mark'}" stroke-width="1"/>`, kit.text(x + 18, 57 + i * 20, name, { size: 10 })]),
  ];
  return kit.svg({ width: 480, height: 224 },
    list(10, ['CartTip', 'Crate.001Action', 'Crate.002Action', 'Crate.003Action', 'Crate.004Action', 'Crate.005Action', 'Crate.006Action'], 'bad'),
    kit.tag(120, 216, 'Actions: seven animations', { tone: 'bad' }),
    list(250, ['fall']),
    kit.tag(360, 216, 'merged: one animation'),
  );
};
