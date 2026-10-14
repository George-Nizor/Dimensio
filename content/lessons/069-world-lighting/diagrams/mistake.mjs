// The viewport's shading popover in Material Preview. Wrong: Scene Lights and Scene World unticked,
// as they start, so Blender lights the props with a built-in HDRI and your World doesn't show.
// Right: both ticked. Rendered view uses the World already.
const popover = (kit, x, on) => [
  `<rect x="${x}" y="20" width="210" height="150" rx="5" class="d-ui" stroke-width="1"/>`,
  kit.text(x + 12, 42, 'Lighting', { size: 12, cls: 'd-key-text' }),
  `<rect x="${x + 12}" y="56" width="12" height="12" rx="2" class="${on ? 'd-key-mark' : 'd-key'}" stroke-width="1.2"/>`, kit.text(x + 32, 67, 'Scene Lights', { size: 12 }),
  `<rect x="${x + 6}" y="78" width="198" height="22" rx="3" class="${on ? 'd-ui-mark' : 'd-ui'}" stroke-width="1"/>`,
  `<rect x="${x + 12}" y="83" width="12" height="12" rx="2" class="${on ? 'd-key-mark' : 'd-key'}" stroke-width="1.2"/>`, kit.text(x + 32, 94, 'Scene World', { size: 12 }),
  on ? '' : [`<rect x="${x + 12}" y="112" width="186" height="44" rx="4" class="d-paper" stroke-width="1"/>`, kit.text(x + 22, 132, 'a built-in HDRI', { size: 11 }), kit.text(x + 22, 148, 'and its Strength', { size: 11 })],
];

export default (kit) => kit.svg({ width: 500, height: 210 },
  popover(kit, 20, false),
  kit.tag(125, 196, 'Blender\'s own HDRI', { tone: 'bad' }),
  popover(kit, 270, true),
  kit.tag(375, 196, 'your World'),
);
