// The Edit Driver popover for the wheel's Y rotation, filled in: Type Scripted Expression, the
// expression var / 0.4, and one variable, var, a Transform Channel reading the Cart's X Location in
// World Space. The Object field and the expression are picked out.
import { frame, row, field } from './animkit.mjs';

export default (kit) => {
  return kit.svg({ width: 420, height: 300 },
    frame(kit, 14, 14, 392, 272),
    kit.text(28, 36, 'Driven Property: Y Euler Rotation', { size: 13 }),
    row(kit, 20, 50, 110, 260, 'Type', 'Scripted Expression'),
    row(kit, 20, 80, 110, 260, 'Expression', 'var / 0.4', { mark: true }),
    `<rect x="30" y="118" width="362" height="152" rx="5" class="d-sunk" stroke-width="1"/>`,
    field(kit, 40, 128, 110, 'var'),
    field(kit, 160, 128, 220, 'Transform Channel'),
    row(kit, 30, 162, 110, 240, 'Object', 'Cart', { mark: true }),
    row(kit, 30, 194, 110, 240, 'Type', 'X Location'),
    row(kit, 30, 226, 110, 240, 'Space', 'World Space'),
  );
};
