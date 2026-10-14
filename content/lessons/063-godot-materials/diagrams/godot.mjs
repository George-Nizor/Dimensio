// Plain schematics of Godot's editor docks for this lesson's diagrams. Not a diagram itself.

// A dock or window: a frame with a title strip. `tabs` are names drawn in the strip, the first one
// picked out as the open tab.
export function dock(kit, { x, y, w, h, title, tabs }) {
  const out = [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" class="d-ui" stroke-width="1"/>`,
    `<rect x="${x}" y="${y}" width="${w}" height="24" rx="5" class="d-sunk" stroke-width="1"/>`,
  ];
  if (tabs) {
    let tx = x + 10;
    tabs.forEach((tab, i) => {
      out.push(kit.text(tx, y + 16, tab, { size: 11, cls: i === 0 ? 'd-tag' : 'd-label' }));
      tx += tab.length * 7 + 18;
    });
  } else if (title) out.push(kit.text(x + 10, y + 16, title, { size: 11 }));
  return out;
}

// One option row: a label on the left and its value on the right, optionally picked out.
export function option(kit, x, y, w, label, value, { mark = false, indent = 0 } = {}) {
  return [
    mark ? `<rect x="${x + 4}" y="${y - 14}" width="${w - 8}" height="20" rx="3" class="d-ui-mark" stroke-width="1"/>` : '',
    kit.text(x + 12 + indent, y, label, { size: 11 }),
    value === true || value === false
      ? [`<rect x="${x + w - 26}" y="${y - 10}" width="12" height="12" rx="2" class="${value ? 'd-key-mark' : 'd-key'}" stroke-width="1.2"/>`]
      : kit.text(x + w - 12, y, String(value ?? ''), { size: 11, anchor: 'end', cls: 'd-key-text' }),
  ];
}

// A heading inside a dock, such as "Meshes".
export const heading = (kit, x, y, label) => kit.text(x + 10, y, label, { size: 11, cls: 'd-key-text' });

// A button.
export function button(kit, x, y, w, label, { mark = false } = {}) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="22" rx="4" class="${mark ? 'd-key-mark' : 'd-key'}" stroke-width="1.2"/>`,
    kit.text(x + w / 2, y + 15, label, { size: 11, anchor: 'middle', cls: mark ? 'd-key-text d-key-text-mark' : 'd-key-text' }),
  ];
}

// A scene tree: rows of [depth, name, type], with optional marks: 'mark' picks a row out,
// 'dim' draws an inherited row in the label colour.
export function tree(kit, x, y, rows, { step = 22, width = 230 } = {}) {
  const out = [];
  rows.forEach(([depth, name, type, flag], i) => {
    const ry = y + i * step;
    if (flag === 'mark') out.push(`<rect x="${x - 4}" y="${ry - 14}" width="${width}" height="20" rx="3" class="d-ui-mark" stroke-width="1"/>`);
    if (depth > 0) out.push(kit.polyline([[x + depth * 16 - 10, ry - 16], [x + depth * 16 - 10, ry - 4], [x + depth * 16 - 3, ry - 4]], { cls: 'd-guide', width: 1 }));
    out.push(`<rect x="${x + depth * 16}" y="${ry - 10}" width="10" height="10" rx="2" class="d-key" stroke-width="1"/>`);
    out.push(kit.text(x + depth * 16 + 16, ry, name, { size: 11, cls: flag === 'dim' ? 'd-label' : 'd-key-text' }));
    if (type) out.push(kit.text(x + width - 6, ry, type, { size: 10, anchor: 'end' }));
  });
  return out;
}

// A file row in the FileSystem dock.
export function file(kit, x, y, name, { mark = false } = {}) {
  return [
    mark ? `<rect x="${x - 4}" y="${y - 14}" width="150" height="20" rx="3" class="d-ui-mark" stroke-width="1"/>` : '',
    `<rect x="${x}" y="${y - 10}" width="10" height="12" rx="1" class="d-key" stroke-width="1"/>`,
    kit.text(x + 16, y, name, { size: 11, cls: 'd-key-text' }),
  ];
}
