// Two actions for one door, seen from above. open turns the door on its hinge from 0 to -100
// degrees; close turns it back from -100 to 0.
import { views } from '../../../diagrams/mesh.mjs';
import { frame, doorSwing } from '../../092-drivers/diagrams/animkit.mjs';

export default (kit) => {
  const card = (x, name, a, b) => [
    frame(kit, x, 14, 200, 196),
    kit.text(x + 160, 40, name, { anchor: 'middle', size: 14, cls: 'd-key-text' }),
    doorSwing(kit, views.top({ at: [x + 110, 72], scale: 80 }), b, { from: a }),
    kit.text(x + 100, 196, `${a}° to ${b}°`, { anchor: 'middle', size: 12 }),
  ];
  return kit.svg({ width: 460, height: 224 },
    card(14, 'open', 0, -100),
    card(246, 'close', -100, 0),
  );
};
