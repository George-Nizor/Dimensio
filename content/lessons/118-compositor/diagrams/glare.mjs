// The Glare node with Type set to Bloom and its default Threshold, Strength and Size, beside a
// bright light before and after: the bloom spreads a soft glow round it.
import { node } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => {
  const g = node(kit, { x: 20, y: 20, w: 170, title: 'Glare', outputs: ['Image', 'Glare', 'Highlights'], inputs: [{ name: 'Image', linked: true }, { name: 'Type', value: 'Bloom', noSocket: true, mark: true }, { name: 'Quality', value: 'Medium', noSocket: true }, { name: 'Threshold', value: '1.000' }, { name: 'Strength', value: '1.000' }, { name: 'Size', value: '0.500' }] });
  const light = (cx, glow) => [
    `<rect x="${cx - 55}" y="60" width="110" height="110" rx="4" class="d-sunk" stroke-width="1"/>`,
    glow ? [42, 32, 23].map((r, i) => `<circle cx="${cx}" cy="115" r="${r}" class="${['d-face-3', 'd-face-2', 'd-face-sel'][i]}"/>`) : '',
    `<circle cx="${cx}" cy="115" r="14" class="d-paper" stroke-width="1.4" style="stroke:var(--d-ink)"/>`,
  ];
  return kit.svg({ width: 480, height: 230 },
    g.svg,
    light(285, false), light(415, true),
    kit.text(285, 194, 'before', { anchor: 'middle', size: 12 }),
    kit.text(415, 194, 'Bloom', { anchor: 'middle', size: 12 }),
  );
};
