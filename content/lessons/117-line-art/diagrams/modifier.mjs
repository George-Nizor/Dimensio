// The Line Art modifier in the Modifier properties: its source collection, Line Radius set to 0.02,
// and the Edge Types it draws, with Crease Threshold at 130 degrees.
import { area, field, check } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => kit.svg({ width: 400, height: 330 },
  area(kit, 20, 14, 360, 304, { title: 'Line Art' }),
  field(kit, 160, 44, 'Source Type', 'Collection', { width: 190 }),
  field(kit, 160, 68, 'Collection', 'Kit', { width: 190 }),
  field(kit, 160, 92, 'Layer', 'Layer', { width: 190 }),
  field(kit, 160, 116, 'Material', 'Black', { width: 190 }),
  field(kit, 160, 140, 'Line Radius', '0.02', { width: 190, mark: true }),
  field(kit, 160, 164, 'Opacity', '1.000', { width: 190 }),
  kit.text(36, 204, 'Edge Types', { size: 11, cls: 'd-label' }),
  check(kit, 160, 194, 'Contour', true),
  check(kit, 160, 216, 'Crease', true),
  field(kit, 260, 236, 'Crease Threshold', '130°', { width: 90, mark: true }),
  check(kit, 160, 262, 'Intersections', true),
  check(kit, 160, 284, 'Material Borders', false),
);
