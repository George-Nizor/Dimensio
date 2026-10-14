// The character from above. Wrong: it faces +Y, so in Godot it walks backwards. Right: it faces
// -Y, Blender's front, which Godot imports facing +Z, the way Godot expects.
import { panel, axes2d } from './helpers.mjs';

export default (kit) => {
  const body = (x, y, facing) => [
    `<ellipse cx="${x}" cy="${y}" rx="44" ry="18" class="d-face-2 d-ink" stroke-width="2"/>`,
    `<ellipse cx="${x}" cy="${y}" rx="14" ry="14" class="d-face-1 d-ink" stroke-width="2"/>`,
    kit.polyline([[x - 6, y + facing * 12], [x, y + facing * 20], [x + 6, y + facing * 12]], { cls: 'd-mark', width: 2.4 }),
  ];
  return kit.svg({ width: 480, height: 240 },
    panel(kit, 20, 14, 200, 186),
    body(120, 96, -1),
    kit.text(120, 52, 'faces +Y', { anchor: 'middle', size: 12 }),
    axes2d(kit, 40, 186, { length: 30 }),
    kit.tag(120, 228, 'walks backwards', { tone: 'bad' }),
    panel(kit, 260, 14, 200, 186),
    body(360, 96, 1),
    kit.text(360, 140, 'faces -Y', { anchor: 'middle', size: 12 }),
    axes2d(kit, 280, 186, { length: 30 }),
    kit.tag(360, 228, 'walks forwards'),
  );
};
