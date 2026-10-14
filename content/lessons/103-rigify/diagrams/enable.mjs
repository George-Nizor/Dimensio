// The Add-ons section of the Preferences: "rigify" typed in the search field and the checkbox
// beside Rigify ticked.
import { checkbox } from './helpers.mjs';

export default (kit) => {
  const sections = ['Interface', 'Viewport', 'Editing', 'Animation', 'Add-ons', 'Get Extensions', 'Input'];
  return kit.svg({ width: 460, height: 230 },
    `<rect x="10" y="10" width="440" height="210" rx="6" class="d-ui" stroke-width="1"/>`,
    kit.text(22, 32, 'Preferences', { size: 12 }),
    sections.map((name, i) => [
      `<rect x="20" y="${44 + i * 24}" width="110" height="20" rx="4" class="${name === 'Add-ons' ? 'd-ui-mark' : 'd-ui'}" stroke-width="${name === 'Add-ons' ? 1 : 0}"/>`,
      kit.text(30, 58 + i * 24, name, { size: 11 }),
    ]),
    `<rect x="146" y="44" width="290" height="22" rx="4" class="d-sunk" stroke-width="1"/>`,
    kit.circle(158, 55, 4.5, { cls: 'd-guide', width: 1.4 }), kit.line(161, 58, 165, 62, { cls: 'd-guide', width: 1.4 }),
    kit.text(172, 59, 'rigify', { size: 12 }),
    `<rect x="146" y="80" width="290" height="34" rx="4" class="d-paper" stroke-width="1"/>`,
    kit.text(156, 101, '>', { size: 11 }),
    kit.text(172, 101, 'Rigify', { size: 12 }),
    kit.text(250, 101, 'Rigging', { size: 11 }),
    checkbox(kit, 410, 90, '', true),
    kit.tag(300, 160, 'tick to turn it on'),
    kit.line(372, 146, 410, 110, { cls: 'd-mark', width: 1.6 }),
  );
};
