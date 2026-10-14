// Dragging the Scale socket to Group Input's empty socket makes Scale an input of the group. It
// appears on the modifier in the Properties editor.
import { node, link, groupInput } from './nodes.mjs';

export default (kit) => {
  const a = groupInput(kit, 14, 40, [{ name: 'Scale', type: 'vector' }], { w: 110 });
  const t = node(kit, { x: 170, y: 24, w: 150, title: 'Transform Geometry', outputs: [{ name: 'Geometry', type: 'geo' }], inputs: [{ name: 'Geometry', type: 'geo' }, { name: 'Translation', type: 'vector', value: '0 m' }, { name: 'Scale', type: 'vector' }] });
  return kit.svg({ width: 540, height: 180 },
    a.svg, t.svg,
    link(kit, a.out.Geometry, t.in.Geometry), link(kit, a.out.Scale, t.in.Scale, { cls: 'd-mark' }),
    `<rect x="352" y="30" width="176" height="104" rx="6" class="d-ui" stroke-width="1"/>`,
    `<rect x="352" y="30" width="176" height="26" rx="6" class="d-sunk" stroke-width="1"/>`,
    kit.text(364, 48, 'GeometryNodes', { size: 12 }),
    kit.text(364, 80, 'Scale', { size: 12 }),
    [0, 1, 2].map((i) => [`<rect x="420" y="${66 + i * 20}" width="96" height="18" rx="3" class="${i === 0 ? 'd-ui-mark' : 'd-sunk'}" stroke-width="1"/>`, kit.text(468, 79 + i * 20, '0.7', { anchor: 'middle', size: 11, cls: 'd-key-text' })]),
    kit.text(440, 160, 'the modifier panel', { anchor: 'middle', size: 12 }),
  );
};
