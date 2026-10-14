// Pack Islands with Margin set to 0.01: every island inside the square with a gap round it. Beside
// it, the redo panel with Margin picked out.
import { uvSquare, drawUVs } from './uv.mjs';
import { packed } from './chestuv.mjs';

export default (kit) => {
  const { uvs } = packed();
  const rows = [['Shape Method', 'Exact Shape'], ['Scale', 'on'], ['Rotate', 'on'], ['Margin Method', 'Scaled'], ['Margin', '0.010']];
  const panel = rows.flatMap(([label, value], i) => {
    const y = 60 + i * 24;
    const mark = label === 'Margin';
    return [
      mark ? `<rect x="272" y="${y - 4}" width="226" height="22" rx="4" class="d-ui-mark" stroke-width="1"/>` : '',
      kit.text(370, y + 11, label, { size: 11, anchor: 'end' }),
      `<rect x="378" y="${y - 1}" width="114" height="16" rx="3" class="d-sunk" stroke-width="1"/>`,
      kit.text(386, y + 11, value, { size: 11, cls: 'd-key-text' }),
    ];
  });
  return kit.svg({ width: 510, height: 260 },
    uvSquare(kit, 20, 20, 220, { labels: false }),
    drawUVs(kit, uvs, 20, 20, 220),
    `<rect x="266" y="30" width="238" height="156" rx="6" class="d-paper" stroke-width="1.2"/>`,
    kit.text(278, 48, 'Pack Islands', { size: 12, cls: 'd-key-text' }),
    panel,
  );
};
