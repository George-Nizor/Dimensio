// The glTF export settings this lesson changes, each ticked: Selected Objects under Include,
// Export Deformation Bones Only under Data > Armature, and Set All glTF Animation Starting at 0
// under Animation > Rest & Ranges, with Animation Mode left on Actions.
import { checkbox, field } from './helpers.mjs';

export default (kit) => {
  const head = (y, text) => [`<rect x="20" y="${y}" width="460" height="22" rx="4" class="d-sunk" stroke-width="1"/>`, kit.text(30, y + 15, text, { size: 11 })];
  return kit.svg({ width: 500, height: 250 },
    `<rect x="10" y="10" width="480" height="230" rx="6" class="d-ui" stroke-width="1"/>`,
    head(20, 'Include'),
    checkbox(kit, 40, 50, 'Selected Objects', true),
    head(76, 'Data > Armature'),
    checkbox(kit, 40, 106, 'Export Deformation Bones Only', true),
    head(132, 'Animation'),
    field(kit, 30, 160, 300, 'Animation Mode', 'Actions', { labelWidth: 0.42 }),
    kit.text(30, 205, 'Rest & Ranges', { size: 11 }),
    checkbox(kit, 140, 194, 'Set All glTF Animation Starting at 0', true),
  );
};
