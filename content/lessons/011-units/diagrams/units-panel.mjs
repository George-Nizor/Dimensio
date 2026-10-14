// The Scene tab's Units panel: Unit System Metric, Unit Scale 1.000, Rotation Degrees and Length
// Meters, as a new file starts.
import { field } from './parts.mjs';

export default (kit) => kit.svg({ width: 380, height: 180 },
  `<rect x="20" y="16" width="330" height="150" rx="4" class="d-ui" stroke-width="1"/>`,
  kit.text(34, 38, 'Units', { size: 12 }),
  field(kit, 20, 66, 'Unit System', 'Metric', { labelWidth: 130, width: 170, mark: true }),
  field(kit, 20, 92, 'Unit Scale', '1.000', { labelWidth: 130, width: 170, mark: true }),
  field(kit, 20, 118, 'Rotation', 'Degrees', { labelWidth: 130, width: 170 }),
  field(kit, 20, 144, 'Length', 'Meters', { labelWidth: 130, width: 170, mark: true }),
);
