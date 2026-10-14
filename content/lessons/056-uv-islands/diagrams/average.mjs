// Average Islands Scale. Left, islands at uneven sizes: the body's side strip too big, its top and
// bottom too small. Right, each island scaled to match its size on the model.
import { uvSquare, drawUVs } from './uv.mjs';
import { messy, even } from './chestuv.mjs';

export default (kit) => {
  const before = messy();
  const after = even();
  return kit.svg({ width: 520, height: 270 },
    `<clipPath id="uv-islands-average"><rect x="0" y="0" width="262" height="270"/></clipPath>`,
    uvSquare(kit, 30, 20, 210, { labels: false }),
    `<g clip-path="url(#uv-islands-average)">${drawUVs(kit, before.uvs, 30, 20, 210, { select: [...before.islands.strip, ...before.islands.top, ...before.islands.bottom] }).flat(Infinity).join('')}</g>`,
    kit.text(135, 258, 'uneven sizes', { anchor: 'middle', size: 12 }),
    uvSquare(kit, 290, 20, 210, { labels: false }),
    drawUVs(kit, after.uvs, 290, 20, 210, { select: [...after.islands.strip, ...after.islands.top, ...after.islands.bottom] }),
    kit.text(395, 258, 'Average Islands Scale', { anchor: 'middle', size: 12 }),
  );
};
