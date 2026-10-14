// The Scatter on Surface modifier, set up like the node tree: Density 0.4, the Props collection
// with Realize Instances and Pick Instance ticked, Align Rotation off so trees stand upright, and
// Randomize on with a full turn about Z and some variation in scale.
export default (kit) => {
  const field = (y, label, value) => [kit.text(170, y + 14, label, { anchor: 'end', size: 12 }), `<rect x="180" y="${y}" width="150" height="20" rx="4" class="d-sunk" stroke-width="1"/>`, kit.text(190, y + 14, value, { size: 12, cls: 'd-key-text' })];
  const box = (x, y, on) => `<rect x="${x}" y="${y + 3}" width="14" height="14" rx="3" class="${on ? 'd-key-mark' : 'd-key'}" stroke-width="1"/>`;
  const tick = (y, label, on = true) => [box(180, y, on), kit.text(202, y + 14, label, { size: 12 })];
  const head = (y, label, toggle) => [kit.line(40, y, 390, y, { cls: 'd-guide', width: 1 }), toggle === undefined ? '' : box(46, y + 4, toggle), kit.text(toggle === undefined ? 46 : 68, y + 18, label, { size: 12 })];
  return kit.svg({ width: 430, height: 340 },
    `<rect x="30" y="14" width="370" height="318" rx="6" class="d-ui" stroke-width="1"/>`,
    `<rect x="30" y="14" width="370" height="28" rx="6" class="d-sunk" stroke-width="1"/>`,
    kit.text(46, 33, 'Scatter on Surface', { size: 12 }),
    field(52, 'Density', '0.4'),
    head(82, 'Instancing'),
    field(108, 'Instance Type', 'Collection'),
    field(132, 'Collection', 'Props'),
    tick(156, 'Realize Instances'),
    head(184, 'Pick Instance', true),
    head(212, 'Transform'),
    tick(236, 'Align Rotation', false),
    head(262, 'Randomize', true),
    field(286, 'Rotation Z', '360°'),
    field(308, 'Scale', '0.3'),
  );
};
