// An HDRI laid out flat, as Poly Haven shows it: the whole surroundings in one wide picture, sky
// above the horizon, ground below, and the sun as the brightest spot.
export default (kit) => kit.svg({ width: 500, height: 210 },
  `<rect x="30" y="20" width="440" height="148" class="d-face-1" stroke-width="0"/>`,
  `<rect x="30" y="94" width="440" height="74" class="d-face-2" stroke-width="0"/>`,
  kit.polyline([[30, 20], [470, 20], [470, 168], [30, 168], [30, 20]], { cls: 'd-ink', width: 1.4 }),
  kit.line(30, 94, 470, 94, { cls: 'd-guide', width: 1.4 }),
  kit.dot(330, 48, { r: 9, cls: 'd-mark-fill' }),
  kit.text(344, 52, 'sun', { size: 12 }),
  kit.text(60, 60, 'sky', { size: 12 }), kit.text(60, 130, 'ground', { size: 12 }),
  kit.text(250, 192, 'one picture of everything around one spot, 2:1', { size: 12, anchor: 'middle' }),
);
