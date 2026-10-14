// Denoise, ticked under Sampling > Render, clears the grain left after sampling: the same render
// before and after.
import { render } from './stage.mjs';

export default (kit) => kit.svg({ width: 520, height: 200 },
  `<rect x="10" y="10" width="160" height="28" rx="3" class="d-ui-mark" stroke-width="1"/>`,
  `<rect x="20" y="17" width="14" height="14" rx="3" class="d-paper" stroke-width="1.2"/>`,
  kit.path('M 23 24 L 26 27 L 31 20', { cls: 'd-ink', width: 2 }),
  kit.text(44, 29, 'Denoise', { size: 12 }),
  render(kit, 10, 50, 220, { grain: 700, seed: 9, clip: 'cycles-denoise-0' }),
  kit.text(120, 190, 'before', { anchor: 'middle', size: 12 }),
  kit.line(240, 112, 278, 112, { cls: 'd-mark', width: 2 }), kit.arrowhead(280, 112, 0, { size: 8 }),
  render(kit, 290, 50, 220, { clip: 'cycles-denoise-1' }),
  kit.text(400, 190, 'after', { anchor: 'middle', size: 12 }),
);
