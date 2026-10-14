// The material slot list from the Material tab, for this lesson's diagrams. Not a diagram itself.
// Each slot is a row with a small swatch and the material's name; + and - sit to the right of the
// list. In Edit Mode, Assign, Select and Deselect appear under it.
//
//   slotList(kit, x, y, [['Walls', 'd-face-1'], ['Roof', 'd-gizmo-x']], { active: 1, editMode: true, mark: 'Assign' })
//   mark may be '+', 'Assign', 'Select' or 'Deselect'.

export function slotList(kit, x, y, slots, { active = 0, editMode = false, mark, w = 200 } = {}) {
  const ROW = 20;
  const rows = Math.max(slots.length, 3);
  const out = [`<rect x="${x}" y="${y}" width="${w - 30}" height="${rows * ROW + 8}" rx="4" class="d-sunk" stroke-width="1"/>`];
  slots.forEach(([name, swatch], i) => {
    const ry = y + 4 + i * ROW;
    if (i === active) out.push(`<rect x="${x + 3}" y="${ry}" width="${w - 36}" height="${ROW - 2}" rx="3" class="d-ui-mark" stroke-width="1"/>`);
    if (swatch) out.push(`<circle cx="${x + 16}" cy="${ry + ROW / 2 - 1}" r="6" class="${swatch}" stroke-width="0"/>`, kit.circle(x + 16, ry + ROW / 2 - 1, 6, { cls: 'd-ink', width: 1 }));
    else out.push(kit.circle(x + 16, ry + ROW / 2 - 1, 6, { cls: 'd-guide', width: 1, dash: '2 2' }));
    out.push(kit.text(x + 30, ry + 13, name || 'empty slot', { size: 11, cls: name ? 'd-key-text' : 'd-label' }));
  });
  // + and - beside the list.
  const bx = x + w - 24;
  out.push(`<rect x="${bx}" y="${y}" width="22" height="20" rx="4" class="${mark === '+' ? 'd-key-mark' : 'd-key'}" stroke-width="1.2"/>`);
  out.push(kit.text(bx + 11, y + 15, '+', { size: 14, anchor: 'middle', cls: mark === '+' ? 'd-key-text d-key-text-mark' : 'd-key-text' }));
  out.push(`<rect x="${bx}" y="${y + 24}" width="22" height="20" rx="4" class="d-key" stroke-width="1.2"/>`);
  out.push(kit.text(bx + 11, y + 38, '-', { size: 14, anchor: 'middle', cls: 'd-key-text' }));
  let bottom = y + rows * ROW + 8;
  if (editMode) {
    const labels = ['Assign', 'Select', 'Deselect'];
    const bw = (w - 8) / 3;
    labels.forEach((label, i) => {
      const lx = x + i * (bw + 4);
      const on = mark === label;
      out.push(`<rect x="${lx.toFixed(1)}" y="${bottom + 8}" width="${bw.toFixed(1)}" height="20" rx="4" class="${on ? 'd-key-mark' : 'd-key'}" stroke-width="1.2"/>`);
      out.push(kit.text(lx + bw / 2, bottom + 22, label, { size: 11, anchor: 'middle', cls: on ? 'd-key-text d-key-text-mark' : 'd-key-text' }));
    });
    bottom += 28;
  }
  return { svg: out, bottom };
}
