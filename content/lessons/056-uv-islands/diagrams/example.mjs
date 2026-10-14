// The chest's UV map before and after arranging. Before: islands of uneven size, the lid's strip
// bent, islands overlapping and one running off the square. After: every island the same size per
// metre, the strip straight, all packed inside the square with a gap round each.
import { uvSquare, drawUVs } from './uv.mjs';
import { messy, packed } from './chestuv.mjs';

export default (kit) => {
  const before = messy();
  const after = packed();
  return kit.svg({ width: 520, height: 270 },
    `<clipPath id="uv-islands-example"><rect x="0" y="0" width="262" height="270"/></clipPath>`,
    uvSquare(kit, 30, 20, 210, { labels: false }),
    `<g clip-path="url(#uv-islands-example)">${drawUVs(kit, before.uvs, 30, 20, 210).flat(Infinity).join('')}</g>`,
    kit.text(135, 258, 'after unwrapping', { anchor: 'middle', size: 12 }),
    uvSquare(kit, 290, 20, 210, { labels: false }),
    drawUVs(kit, after.uvs, 290, 20, 210),
    kit.text(395, 258, 'arranged and packed', { anchor: 'middle', size: 12 }),
  );
};
