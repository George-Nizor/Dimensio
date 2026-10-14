// The Dope Sheet's header in the Animation workspace with its mode menu open and Action Editor
// picked out.
import { frame, field, menu } from '../../092-drivers/diagrams/animkit.mjs';

export default (kit) => kit.svg({ width: 440, height: 240 },
  frame(kit, 14, 14, 412, 210),
  `<rect x="24" y="24" width="392" height="30" rx="4" class="d-paper" stroke-width="1"/>`,
  field(kit, 32, 28, 130, 'Dope Sheet', { anchor: 'start', mark: true }),
  kit.text(176, 44, 'View   Select   Marker   Channel   Key', { size: 12 }),
  menu(kit, 32, 60, ['Dope Sheet', 'Action Editor', 'Shape Key Editor', 'Grease Pencil', 'Mask', 'Cache File'], { w: 170, mark: 'Action Editor' }),
  kit.text(230, 120, 'one action at a time:', { size: 12 }),
  kit.text(230, 140, 'its keys, its name', { size: 12 }),
  kit.text(230, 160, 'and its slot', { size: 12 }),
);
