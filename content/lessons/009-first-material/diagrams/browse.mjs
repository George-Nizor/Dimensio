// The browse list open with Red, Blue and Green, Red picked out. After choosing it, the name field
// reads Red with a 2 beside it: two objects use it.
import { menu } from './parts.mjs';

export default (kit) => kit.svg({ width: 440, height: 200 },
  `<rect x="20" y="20" width="30" height="24" rx="4" class="d-key-mark" stroke-width="1.2"/>`,
  kit.circle(35, 32, 6, { cls: 'd-paper', width: 1.6 }),
  menu(kit, 20, 50, ['Blue', 'Green', 'Red'], { width: 140, mark: 'Red', row: 24 }),
  [['Blue', 'd-gizmo-z'], ['Green', 'd-gizmo-y'], ['Red', 'd-gizmo-x']].map(([, cls], i) => `<rect x="134" y="${60 + i * 24}" width="14" height="14" rx="3" class="${cls}" stroke-width="0"/>`),
  kit.line(170, 116, 220, 116, { cls: 'd-mark', width: 2 }), kit.arrowhead(220, 116, 0, { size: 8 }),
  `<rect x="234" y="104" width="30" height="24" rx="4" class="d-key" stroke-width="1.2"/>`,
  kit.circle(249, 116, 6, { cls: 'd-ink', width: 1.4 }),
  `<rect x="268" y="104" width="110" height="24" rx="4" class="d-sunk" stroke-width="1"/>`,
  kit.text(280, 121, 'Red', { size: 12 }),
  `<rect x="382" y="104" width="30" height="24" rx="4" class="d-ui-mark" stroke-width="1"/>`,
  kit.text(397, 121, '2', { anchor: 'middle', size: 12, cls: 'd-key-text' }),
  kit.text(397, 150, 'users', { anchor: 'middle', size: 11 }),
);
