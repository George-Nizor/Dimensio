// The Vignette node with Factor at 0.4, beside a frame whose corners it darkens, leaving the
// middle as it was.
import { node, box } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => {
  const vg = node(kit, { x: 20, y: 40, w: 160, title: 'Vignette', outputs: ['Image', 'Mask'], inputs: [{ name: 'Image', linked: true }, { name: 'Factor', value: '0.4', mark: true }, { name: 'Feather', value: '0.4' }] });
  const x = 230;
  const y = 30;
  const w = 220;
  const h = 150;
  const cx = x + w / 2;
  const cy = y + h / 2;
  return kit.svg({ width: 470, height: 210 },
    vg.svg,
    box(x, y, w, h, { cls: 'd-face-3', rx: 0, stroke: 0 }),
    `<ellipse cx="${cx}" cy="${cy}" rx="${w / 2}" ry="${h / 2}" class="d-face-2"/>`,
    `<ellipse cx="${cx}" cy="${cy}" rx="${w / 2 - 18}" ry="${h / 2 - 14}" class="d-face-1"/>`,
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="d-guide" fill="none" stroke-width="1.2"/>`,
    `<rect x="${x - 6}" y="${y}" width="5" height="${h}" class="d-paper" stroke-width="0"/>`,
    kit.text(cx, cy + 4, 'the middle stays as it was', { anchor: 'middle', size: 12 }),
    kit.text(cx, y + h + 22, 'the corners get darker', { anchor: 'middle', size: 12 }),
  );
};
