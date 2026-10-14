// The NLA editor after stashing: the armature has no active action, and below it two muted
// tracks, each holding one action as a strip, idle-loop and walk-loop.
import { menuPath } from './helpers.mjs';

export default (kit) => {
  const track = (y, name, strip, x, w) => [
    `<rect x="20" y="${y}" width="150" height="26" rx="3" class="d-ui" stroke-width="1"/>`,
    kit.text(30, y + 17, name, { size: 11 }),
    `<rect x="${x}" y="${y + 3}" width="${w}" height="20" rx="3" class="d-ui-mark" stroke-width="1"/>`,
    kit.text(x + 8, y + 17, strip, { size: 11 }),
  ];
  return kit.svg({ width: 500, height: 190 },
    `<rect x="10" y="10" width="480" height="122" rx="6" class="d-sunk" stroke-width="1"/>`,
    `<rect x="20" y="20" width="150" height="26" rx="3" class="d-ui" stroke-width="1"/>`,
    kit.text(30, 37, 'Armature', { size: 11 }),
    kit.text(190, 37, 'no active action', { size: 11 }),
    track(56, '[Action Stash]', 'idle-loop', 190, 200),
    track(92, '[Action Stash]', 'walk-loop', 190, 110),
    menuPath(kit, 20, 152, ['Action', 'Stash Action']).svg,
    kit.text(200, 167, 'in the Action Editor', { size: 11 }),
  );
};
