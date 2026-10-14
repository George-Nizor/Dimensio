// Wrong: the crate scaled down in Object Mode and left with Scale 0.01, which looks right but
// carries the wrong scale into modifiers and exports. Right: the scale applied, Scale 1 and the
// same 0.5 m dimensions.
import { area, field } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

const panel = (kit, x, scale) => [
  area(kit, x, 16, 220, 186, { title: 'Item' }),
  kit.text(x + 12, 52, 'Scale', { size: 11, cls: 'd-label' }),
  ['X', 'Y', 'Z'].map((a, i) => field(kit, x + 40, 60 + i * 22, a, scale, { width: 160, mark: scale !== '1.000' })),
  kit.text(x + 12, 146, 'Dimensions', { size: 11, cls: 'd-label' }),
  field(kit, x + 40, 154, 'X', '0.5 m', { width: 160 }),
];

export default (kit) => kit.svg({ width: 500, height: 240 },
  panel(kit, 16, '0.010'),
  kit.tag(126, 228, 'scaled, not applied', { tone: 'bad' }),
  panel(kit, 264, '1.000'),
  kit.tag(374, 228, 'scale applied'),
);
