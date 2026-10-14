// The Animation panel with the AnimationPlayer selected: walk chosen in the list and Play Animation from
// Start pressed, then idle chosen with Autoplay on Load turned on, shown by the A beside it.
import { playButton, loopSign } from './helpers.mjs';

export default (kit) => {
  const bar = (y, name, auto) => [
    `<rect x="20" y="${y}" width="470" height="40" rx="6" class="d-ui" stroke-width="1"/>`,
    playButton(kit, 32, y + 9, { on: !auto }),
    `<rect x="66" y="${y + 9}" width="150" height="22" rx="4" class="d-sunk" stroke-width="1"/>`,
    auto ? kit.text(74, y + 24, 'A', { size: 11, cls: 'd-tag' }) : '',
    kit.text(auto ? 88 : 74, y + 24, name, { size: 11 }),
    loopSign(kit, 196, y + 19),
    `<rect x="226" y="${y + 9}" width="64" height="22" rx="4" class="d-ui" stroke-width="1"/>`,
    kit.text(258, y + 24, 'Animation', { anchor: 'middle', size: 10 }),
    `<rect x="298" y="${y + 9}" width="28" height="22" rx="4" class="${auto ? 'd-key-mark' : 'd-key'}" stroke-width="1.2"/>`,
    kit.text(312, y + 24, 'A', { anchor: 'middle', size: 11, cls: auto ? 'd-key-text d-key-text-mark' : 'd-key-text' }),
  ];
  return kit.svg({ width: 510, height: 190 },
    bar(14, 'walk', false),
    kit.text(340, 38, 'Play Animation from Start', { size: 11 }),
    bar(100, 'idle', true),
    kit.text(340, 124, 'Autoplay on Load', { size: 11 }),
    kit.text(20, 172, 'The AnimationPlayer is selected in the Scene dock.', { size: 11 }),
  );
};
