// New Action, the button beside the action's name, picked out. Below, after clicking it: the
// header shows a copy, renamed close, and the NLA editor shows open kept on a muted
// [Action Stash] track.
import { frame, actionHeader, pageArrow, strip } from '../../092-drivers/diagrams/animkit.mjs';

export default (kit) => kit.svg({ width: 460, height: 260 },
  frame(kit, 14, 14, 432, 232),
  actionHeader(kit, 26, 26, { name: 'open', mark: 'new' }).svg,
  pageArrow(kit, 178, 54, 178, 82),
  actionHeader(kit, 26, 90, { name: 'close', mark: 'name' }).svg,
  kit.text(330, 104, 'the copy, renamed', { size: 12 }),
  kit.text(26, 150, 'in the NLA editor:', { size: 12 }),
  `<rect x="26" y="162" width="408" height="30" rx="3" class="d-sunk" stroke-width="1"/>`,
  kit.text(36, 181, '[Action Stash]', { size: 12 }),
  strip(kit, 170, 300, 166, 'open', { tone: 'muted' }),
  kit.text(26, 222, 'muted: kept and exported, not played', { size: 12 }),
);
