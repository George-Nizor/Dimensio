// The Adjust Last Operation panel after Object > Shade Smooth, with Keep Sharp Edges ticked.
export default (kit) => kit.svg({ width: 440, height: 140 },
  `<rect x="20" y="20" width="260" height="94" rx="6" class="d-ui" stroke-width="1"/>`,
  kit.text(34, 44, 'Shade Smooth', { size: 13 }),
  `<rect x="36" y="64" width="16" height="16" rx="3" class="d-key-mark" stroke-width="1.2"/>`,
  kit.polyline([[39.5, 72], [43.5, 76], [48.5, 68]], { cls: 'd-key', width: 1.9 }),
  kit.text(62, 77, 'Keep Sharp Edges', { size: 12 }),
  kit.text(300, 72, 'on by default', { size: 12 }),
);
