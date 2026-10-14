// A row of a Properties panel, shared by this lesson's diagrams. Not a diagram itself.

// One row of a Properties panel: a label on the left and a value box on the right. `mark` picks
// the row out; `tick` draws a checkbox instead of a value.
export function propRow(kit, x, y, label, value, { width = 220, split = 0.5, mark = false, tick } = {}) {
  const vx = x + width * split;
  const out = [kit.text(vx - 8, y + 13, label, { anchor: 'end', size: 11 })];
  if (tick !== undefined) {
    out.push(`<rect x="${vx}" y="${y + 2}" width="14" height="14" rx="3" class="${tick ? 'd-ui-mark' : 'd-key'}" stroke-width="1.2"/>`);
    if (tick) out.push(kit.path(`M ${vx + 3} ${y + 9} L ${vx + 6} ${y + 12} L ${vx + 11} ${y + 5}`, { cls: 'd-ink', width: 2 }));
    if (value) out.push(kit.text(vx + 20, y + 13, value, { size: 11 }));
  } else {
    out.push(`<rect x="${vx}" y="${y}" width="${width * (1 - split)}" height="18" rx="3" class="${mark ? 'd-ui-mark' : 'd-key'}" stroke-width="1.2"/>`);
    out.push(kit.text(vx + (width * (1 - split)) / 2, y + 13, value, { anchor: 'middle', size: 11, cls: 'd-key-text' }));
  }
  return out;
}
