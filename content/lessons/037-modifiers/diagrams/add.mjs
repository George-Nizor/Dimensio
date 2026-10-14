// The Properties editor with the Modifiers tab (the wrench) picked out, the Add Modifier button,
// and its menu open at Generate, with Bevel picked out in the list beside it.
import { menu } from './modkit.mjs';

export default (kit) => {
  const out = [`<rect x="14" y="14" width="472" height="256" rx="6" class="d-ui" stroke-width="1"/>`];
  // The column of tabs down the left edge; the wrench is the Modifiers tab.
  for (let i = 0; i < 9; i += 1) {
    const y = 26 + i * 25;
    out.push(`<rect x="22" y="${y}" width="21" height="21" rx="4" class="${i === 5 ? 'd-ui-mark' : 'd-key'}" stroke-width="${i === 5 ? 1.8 : 1}"/>`);
  }
  const wy = 26 + 5 * 25;
  out.push(kit.circle(29, wy + 8, 3.4, { cls: 'd-ink', width: 1.6 }), kit.line(31.5, wy + 10.5, 38, wy + 17, { cls: 'd-ink', width: 2.6 }));
  out.push(`<rect x="58" y="26" width="200" height="26" rx="4" class="d-ui-mark" stroke-width="1.4"/>`);
  out.push(kit.text(158, 44, '+  Add Modifier', { anchor: 'middle', size: 13 }));
  out.push(menu(kit, 58, 60, ['Edit', 'Generate', 'Deform', 'Normals', 'Physics'], { w: 120, mark: 'Generate' }));
  out.push(kit.line(178, 95, 192, 95, { cls: 'd-guide', width: 1 }));
  out.push(menu(kit, 192, 60, ['Array', 'Array (Legacy)', 'Bevel', 'Boolean', 'Build', 'Curve to Tube', '...'], { w: 150, mark: 'Bevel' }));
  out.push(kit.text(70, 248, 'the Modifiers tab', { size: 13 }));
  out.push(...kit.arcArrow(66, 242, 46, 168, { lift: -14 }));
  return kit.svg({ width: 500, height: 284 }, out);
};
