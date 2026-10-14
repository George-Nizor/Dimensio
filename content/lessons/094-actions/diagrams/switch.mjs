// Before switching, close's Fake User shield is pressed so it stays saved when nothing plays it.
// The browse list beside the name is open with close and open in it, and open picked out.
import { frame, actionHeader, menu } from '../../092-drivers/diagrams/animkit.mjs';

export default (kit) => kit.svg({ width: 460, height: 230 },
  frame(kit, 14, 14, 432, 202),
  actionHeader(kit, 26, 26, { name: 'close', mark: 'browse', fake: true }).svg,
  menu(kit, 26, 54, ['close', 'open'], { w: 140, mark: 'open', title: 'Actions' }),
  kit.text(250, 76, 'Fake User on:', { size: 12 }),
  kit.text(250, 96, 'close stays saved', { size: 12 }),
  kit.text(250, 116, 'when nothing plays it', { size: 12 }),
  kit.arcArrow(232, 70, 216, 50, { lift: -10 }),
);
