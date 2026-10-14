// Wrong: searching the Add-ons list for LoopTools, as an older tutorial says, and finding nothing.
// Right: searching Get Extensions for it and finding it with an Install button.
import { box, button } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

const panel = (kit, x, title) => [
  box(x, 16, 220, 160, { cls: 'd-ui', rx: 5 }),
  kit.text(x + 12, 36, title, { size: 12 }),
  box(x + 10, 46, 200, 22, { cls: 'd-sunk', rx: 11 }),
  kit.text(x + 22, 61, 'looptools', { size: 11, cls: 'd-key-text' }),
];

export default (kit) => kit.svg({ width: 500, height: 220 },
  panel(kit, 16, 'Add-ons'),
  kit.text(126, 120, 'no add-ons found', { anchor: 'middle', size: 12 }),
  kit.tag(126, 206, 'searching Add-ons', { tone: 'bad' }),
  panel(kit, 264, 'Get Extensions'),
  box(274, 80, 200, 40, { cls: 'd-ui-mark', rx: 4 }),
  kit.text(284, 104, 'LoopTools', { size: 12 }),
  button(kit, 400, 90, 'Install', { mark: true, width: 64 }),
  kit.tag(374, 206, 'searching Get Extensions'),
);
