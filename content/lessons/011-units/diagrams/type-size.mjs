// The Dimensions X field with 90cm typed into it, then Enter, and the same field afterwards
// reading 0.9 m.
import { keycap } from '../../../diagrams/mesh.mjs';
import { field } from './parts.mjs';

export default (kit) => kit.svg({ width: 460, height: 110 },
  field(kit, 10, 40, 'X', '90cm', { labelWidth: 30, width: 120, mark: true }),
  kit.line(147, 32, 147, 48, { cls: 'd-ink', width: 1.4 }),
  keycap(kit, 210, 40, 'Enter', { size: 11 }),
  kit.line(240, 40, 270, 40, { cls: 'd-mark', width: 2 }), kit.arrowhead(270, 40, 0, { size: 8 }),
  field(kit, 270, 40, 'X', '0.9 m', { labelWidth: 30, width: 120 }),
  kit.text(80, 82, 'typed', { anchor: 'middle', size: 12 }),
  kit.text(360, 82, 'read back in metres', { anchor: 'middle', size: 12 }),
);
