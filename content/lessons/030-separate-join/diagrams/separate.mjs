// P > Selection. Left, one object in Edit Mode with the shade selected. Right, two objects in
// Object Mode, and the Outliner listing Lamp and the new Lamp.001.
import { view, join } from '../../../diagrams/mesh.mjs';
import { lamp, shade } from './props.mjs';
import { paint, panel, step } from './paint.mjs';

function outliner(kit, x, y, rows) {
  return [
    `<rect x="${x}" y="${y}" width="104" height="${22 + rows.length * 20}" rx="4" class="d-ui" stroke-width="1"/>`,
    kit.text(x + 8, y + 15, 'Outliner', { size: 11 }),
    rows.map((name, i) => [
      `<rect x="${x + 4}" y="${y + 21 + i * 20}" width="96" height="18" rx="3" class="${i === rows.length - 1 ? 'd-ui-mark' : 'd-ui'}" stroke-width="0.8"/>`,
      kit.text(x + 12, y + 34 + i * 20, name, { size: 11 }),
    ]),
  ];
}

export default (kit) => {
  const left = view({ azimuth: 24, elevation: 22, at: [86, 178], scale: 250, target: [0, 0, 0] });
  const right = view({ azimuth: 24, elevation: 22, at: [306, 178], scale: 250, target: [0, 0, 0] });
  const all = join(lamp(), shade());
  const first = lamp().faces.length;
  return kit.svg({ width: 520, height: 230 },
    panel(kit, 14, 14, 150, 186, 'one object'),
    paint(kit, all, left, { width: 1.2, inside: true, fill: (i) => (i >= first ? 'd-face-sel' : null) }),
    step(kit, 176, 104, 224), kit.text(200, 92, 'P', { anchor: 'middle', size: 12 }),
    panel(kit, 234, 14, 150, 186, 'two objects'),
    paint(kit, lamp(), right, { width: 1.2 }),
    paint(kit, shade(), right, { width: 1.2, inside: true, rim: 'd-mark' }),
    outliner(kit, 400, 40, ['Lamp', 'Lamp.001']),
  );
};
