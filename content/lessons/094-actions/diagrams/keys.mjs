// The first action, renamed open in the Action Editor's header. Its Z rotation channel has keys at
// frames 1 and 24, and the door, seen from above, is shut at frame 1 and at -100 degrees at 24.
import { views } from '../../../diagrams/mesh.mjs';
import { frame, actionHeader, key, timeScale, doorSwing } from '../../092-drivers/diagrams/animkit.mjs';

export default (kit) => {
  const at = timeScale(170, 240, 1, 24);
  return kit.svg({ width: 460, height: 290 },
    frame(kit, 14, 14, 432, 262),
    actionHeader(kit, 26, 24, { name: 'open', mark: 'name' }).svg,
    doorSwing(kit, views.top({ at: [at(1), 110], scale: 58 }), 0),
    doorSwing(kit, views.top({ at: [at(24), 110], scale: 58 }), -100, { from: 0 }),
    kit.line(150, 206, 420, 206, { cls: 'd-guide', width: 1 }),
    [1, 6, 12, 18, 24].map((f) => [kit.line(at(f), 202, at(f), 210, { cls: 'd-guide', width: 1 }), kit.text(at(f), 198, String(f), { anchor: 'middle', size: 11 })]),
    kit.text(140, 241, 'Z Euler Rotation', { anchor: 'end', size: 12 }),
    kit.line(150, 236, 420, 236, { cls: 'd-guide', width: 1 }),
    key(kit, at(1), 236, { mark: true }),
    key(kit, at(24), 236, { mark: true }),
    kit.text(at(1), 262, '0°', { anchor: 'middle', size: 12 }),
    kit.text(at(24), 262, '-100°', { anchor: 'middle', size: 12 }),
  );
};
