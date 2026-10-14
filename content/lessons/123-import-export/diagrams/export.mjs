// The FBX exporter's options: Include > Limit to Selected Objects ticked, and Transform with Scale
// 1.00, Forward -Z and Up Y, the conversion to apps where Y points up.
import { area, check, field } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => kit.svg({ width: 380, height: 260 },
  area(kit, 16, 14, 348, 92, { title: 'Include' }),
  kit.text(110, 54, 'Limit to', { anchor: 'end', size: 11 }),
  check(kit, 120, 44, 'Selected Objects', true, { mark: true }),
  check(kit, 120, 70, 'Visible Objects', false),
  area(kit, 16, 116, 348, 132, { title: 'Transform' }),
  field(kit, 140, 146, 'Scale', '1.00', { width: 200 }),
  field(kit, 140, 172, 'Forward', '-Z Forward', { width: 200 }),
  field(kit, 140, 198, 'Up', 'Y Up', { width: 200 }),
);
