// The splash screen as a schematic, shared by this lesson's diagrams. Not a diagram itself.

// A choice of buttons side by side, like Mouse Select's Left and Right. The chosen one is filled.
export function segmented(kit, x, y, options, chosen, { width = 46, height = 18, bad = false } = {}) {
  return options.map((name, i) => {
    const on = name === chosen;
    const cls = on ? (bad ? 'd-key-bad' : 'd-key-mark') : 'd-key';
    return [
      `<rect x="${x + i * width}" y="${y}" width="${width}" height="${height}" rx="3" class="${cls}" stroke-width="1.2"/>`,
      kit.text(x + i * width + width / 2, y + height / 2 + 4, name, { anchor: 'middle', size: 10, cls: on ? 'd-key-text d-key-text-mark' : 'd-key-text' }),
    ];
  });
}

// One settings row: its name on the left, its control on the right.
export function row(kit, x, y, label, control) {
  return [kit.text(x, y + 13, label, { anchor: 'end', size: 10 }), control];
}

// The splash screen: the picture with the version in its top right, and below it either the first
// settings (setup: true) or the usual New File and Recent Files lists.
export function splash(kit, x, y, { width = 300, height = 200, setup = true, markVersion = false, mouse = 'Left' } = {}) {
  const pictureH = height * 0.42;
  const out = [
    `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="6" class="d-ui" stroke-width="1.2"/>`,
    `<rect x="${x}" y="${y}" width="${width}" height="${pictureH}" rx="6" class="d-sunk" stroke-width="0"/>`,
    kit.text(x + width - 10, y + 18, '5.2.2 LTS', { anchor: 'end', size: 11, cls: 'd-label' }),
  ];
  if (markVersion) {
    out.push(`<rect x="${x + width - 72}" y="${y + 5}" width="66" height="19" rx="9" class="d-mark" fill="none" stroke-width="2"/>`);
  }
  if (setup) {
    const lx = x + width * 0.45;
    const cx = x + width * 0.49;
    let ry = y + pictureH + 10;
    const step = (height - pictureH - 40) / 4;
    out.push(row(kit, lx, ry, 'Keymap', segmented(kit, cx, ry, ['Blender'], 'Blender', { width: 92 })));
    ry += step;
    out.push(row(kit, lx, ry, 'Mouse Select', segmented(kit, cx, ry, ['Left', 'Right'], mouse, { width: 48 })));
    ry += step;
    out.push(row(kit, lx, ry, 'Spacebar Action', segmented(kit, cx, ry, ['Play', 'Tools', 'Search'], 'Play', { width: 48 })));
    ry += step + 4;
    out.push(`<rect x="${cx}" y="${ry}" width="144" height="20" rx="3" class="d-key" stroke-width="1.2"/>`);
    out.push(kit.text(cx + 72, ry + 14, 'Save New Preferences', { anchor: 'middle', size: 9, cls: 'd-key-text' }));
  } else {
    const ly = y + pictureH + 22;
    out.push(kit.text(x + 16, ly, 'New File', { size: 11 }), kit.text(x + width / 2 + 8, ly, 'Recent Files', { size: 11 }));
    for (let i = 1; i < 4; i += 1) {
      out.push(kit.line(x + 16, ly + i * 18, x + width / 2 - 24, ly + i * 18, { cls: 'd-guide', width: 5 }));
      out.push(kit.line(x + width / 2 + 8, ly + i * 18, x + width - 30, ly + i * 18, { cls: 'd-guide', width: 5 }));
    }
  }
  return out;
}
