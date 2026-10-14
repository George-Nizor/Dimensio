// Shared schematics for lessons 115 to 127: menus, editor areas, buttons, property rows, lines of
// code, node boxes and wires, and the Preferences window. Not a diagram itself (no default export).
// Every shape uses the theme classes from content/diagrams/theme.css.
import { keycap } from '../../../diagrams/mesh.mjs';

const r1 = (v) => Number(v.toFixed(1));

export function box(x, y, w, h, { cls = 'd-ui', rx = 3, stroke = 1 } = {}) {
  return `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="${rx}" class="${cls}" stroke-width="${stroke}"/>`;
}

// An area of the window: a frame with a header strip along its top and an optional title in it.
export function area(kit, x, y, w, h, { title, mark = false, header = 20, size = 11, fill = 'd-ui' } = {}) {
  const out = [box(x, y, w, h, { cls: mark ? 'd-ui-mark' : fill, rx: 4 })];
  if (header) {
    out.push(box(x, y, w, header, { cls: 'd-sunk', rx: 4 }));
    if (title) out.push(kit.text(x + 8, y + header / 2 + size * 0.36, title, { size }));
  }
  return out;
}

// A pop-up menu. Items are strings or { label, mark, key, arrow, dim }; '-' is a separator.
// Returns the markup, each item's row box and the menu's height.
export function menu(kit, x, y, items, { width = 180, title, row = 22, size = 12 } = {}) {
  const rows = [];
  let h = 6 + (title ? row : 0);
  for (const item of items) h += item === '-' ? 7 : row;
  h += 4;
  const out = [box(x, y, width, h, { cls: 'd-paper', rx: 5, stroke: 1.2 })];
  let cy = y + 5;
  if (title) {
    out.push(kit.text(x + 12, cy + row / 2 + size * 0.36, title, { size: size - 1, cls: 'd-label' }));
    out.push(kit.line(x + 8, cy + row - 1, x + width - 8, cy + row - 1, { cls: 'd-guide', width: 0.8 }));
    cy += row;
  }
  for (const raw of items) {
    if (raw === '-') {
      out.push(kit.line(x + 8, cy + 3.5, x + width - 8, cy + 3.5, { cls: 'd-guide', width: 0.8 }));
      cy += 7;
      continue;
    }
    const item = typeof raw === 'string' ? { label: raw } : raw;
    if (item.mark) out.push(box(x + 4, cy + 1, width - 8, row - 2, { cls: 'd-ui-mark', rx: 3 }));
    out.push(kit.text(x + 12, cy + row / 2 + size * 0.36, item.label, { size, cls: item.dim ? 'd-label' : 'd-label' }));
    if (item.key) out.push(kit.text(x + width - 12, cy + row / 2 + size * 0.36, item.key, { size: size - 1, anchor: 'end', cls: 'd-key-text' }));
    if (item.arrow) out.push(kit.path(`M ${x + width - 14} ${cy + row / 2 - 4} L ${x + width - 10} ${cy + row / 2} L ${x + width - 14} ${cy + row / 2 + 4}`, { cls: 'd-ink', width: 1.2 }));
    rows.push({ x, y: cy, w: width, h: row, label: item.label });
    cy += row;
  }
  return { svg: out, rows, height: h, row: (label) => rows.find((r) => r.label === label) };
}

// A button with a label, picked out in the accent when mark is set.
export function button(kit, x, y, label, { mark = false, size = 11, width, height = 20, bad = false } = {}) {
  const w = width ?? label.length * size * 0.6 + 16;
  const cls = mark ? (bad ? 'd-key-bad' : 'd-key-mark') : 'd-key';
  return [
    box(x, y, w, height, { cls, rx: 3, stroke: 1.2 }),
    kit.text(x + w / 2, y + height / 2 + size * 0.36, label, { anchor: 'middle', size, cls: mark ? 'd-key-text d-key-text-mark' : 'd-key-text' }),
  ];
}

// A check box and its label. on fills the box; mark rings the row in the accent.
export function check(kit, x, y, label, on, { mark = false, size = 11 } = {}) {
  const out = [];
  if (mark) out.push(box(x - 4, y - 3, label.length * size * 0.56 + 28, 20, { cls: 'd-ui-mark', rx: 3 }));
  out.push(box(x, y, 13, 13, { cls: on ? 'd-key-mark' : 'd-key', rx: 2, stroke: 1.2 }));
  if (on) out.push(kit.path(`M ${x + 3} ${y + 6.5} L ${x + 5.6} ${y + 9.5} L ${x + 10} ${y + 3.5}`, { cls: 'd-ink', width: 1.6 }));
  out.push(kit.text(x + 19, y + 10.5, label, { size }));
  return out;
}

// A property row: its name right-aligned at x, its value in a field after it.
export function field(kit, x, y, label, value, { width = 120, mark = false, size = 11, height = 18 } = {}) {
  return [
    kit.text(x - 8, y + height / 2 + size * 0.36, label, { anchor: 'end', size }),
    box(x, y, width, height, { cls: mark ? 'd-ui-mark' : 'd-sunk', rx: 3, stroke: 1 }),
    kit.text(x + 8, y + height / 2 + size * 0.36, value, { size, cls: 'd-key-text' }),
  ];
}

// Lines of text in the monospace face, as the Text Editor, the Python Console and the Info editor
// show them. mark lists 0-based lines to pick out; numbers adds line numbers.
export function code(kit, x, y, lines, { size = 12, lead = 18, numbers = false, mark = [], width = 400 } = {}) {
  const out = [];
  lines.forEach((line, i) => {
    const ly = y + i * lead;
    if (mark.includes(i)) out.push(box(x - 4, ly - lead * 0.72, width, lead, { cls: 'd-ui-mark', rx: 2, stroke: 0.8 }));
    if (numbers) out.push(kit.text(x + 16, ly, String(i + 1), { anchor: 'end', size: size - 1, cls: 'd-label' }));
    out.push(`<text x="${r1(x + (numbers ? 26 : 0))}" y="${r1(ly)}" class="d-key-text" font-size="${size}" xml:space="preserve">${String(line).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text>`);
  });
  return out;
}

// ---- Nodes ------------------------------------------------------------------------------------

// A node box: a title bar, output sockets on the right, then input sockets on the left with their
// values. Returns the markup and the positions of its sockets.
export function node(kit, { x, y, w = 130, title, inputs = [], outputs = [], mark = false, size = 11, row = 18, extra = [] }) {
  const h = 22 + (outputs.length + inputs.length + extra.length) * row + 8;
  const out = [box(x, y, w, h, { cls: mark ? 'd-ui-mark' : 'd-paper', rx: 5, stroke: 1.3 })];
  out.push(box(x, y, w, 20, { cls: 'd-sunk', rx: 5, stroke: 1 }));
  out.push(kit.text(x + 8, y + 14, title, { size: size + 0.5 }));
  const sockets = { in: {}, out: {} };
  let cy = y + 22;
  for (const name of outputs) {
    out.push(kit.text(x + w - 12, cy + row / 2 + 4, name, { anchor: 'end', size }));
    out.push(`<circle cx="${r1(x + w)}" cy="${r1(cy + row / 2)}" r="4.5" class="d-key-mark" stroke-width="1.2"/>`);
    sockets.out[name] = [x + w, cy + row / 2];
    cy += row;
  }
  for (const line of extra) {
    if (typeof line === 'string') out.push(kit.text(x + 10, cy + row / 2 + 4, line, { size }));
    else out.push(box(x + 8, cy + 2, w - 16, row - 4, { cls: line.mark ? 'd-ui-mark' : 'd-sunk', rx: 3 }), kit.text(x + 14, cy + row / 2 + 4, line.label, { size: size - 0.5 }));
    cy += row;
  }
  for (const input of inputs) {
    const item = typeof input === 'string' ? { name: input } : input;
    if (item.mark) out.push(box(x + 6, cy + 2, w - 12, row - 4, { cls: 'd-ui-mark', rx: 3 }));
    if (!item.noSocket) out.push(`<circle cx="${r1(x)}" cy="${r1(cy + row / 2)}" r="4.5" class="${item.linked ? 'd-key-mark' : 'd-key'}" stroke-width="1.2"/>`);
    out.push(kit.text(x + 12, cy + row / 2 + 4, item.name, { size }));
    if (item.value !== undefined) out.push(kit.text(x + w - 10, cy + row / 2 + 4, item.value, { anchor: 'end', size, cls: 'd-key-text' }));
    sockets.in[item.name] = [x, cy + row / 2];
    cy += row;
  }
  return { svg: out, height: h, in: (name) => sockets.in[name], out: (name) => sockets.out[name] };
}

// A wire between two sockets, as a smooth curve.
export function wire(kit, from, to, { cls = 'd-ink', width = 1.8, dash } = {}) {
  const dx = Math.max(30, Math.abs(to[0] - from[0]) * 0.5);
  return kit.path(`M ${r1(from[0])} ${r1(from[1])} C ${r1(from[0] + dx)} ${r1(from[1])} ${r1(to[0] - dx)} ${r1(to[1])} ${r1(to[0])} ${r1(to[1])}`, { cls, width, dash });
}

// ---- The Preferences window -------------------------------------------------------------------

export const SECTIONS = ['Interface', 'Viewport', 'Lights', 'Editing', 'Animation', '-', 'Get Extensions', 'Add-ons', 'Themes', 'Asset Libraries', '-', 'Input', 'Navigation', 'Keymap', '-', 'System', 'Save & Load', 'File Paths'];

// The Preferences window: a search field and the section list on the left, the chosen section's
// content on the right. Returns the markup and the content box [x, y, w, h].
export function prefs(kit, x, y, w, h, { section, search = '', list = SECTIONS, size = 11, markSearch = false } = {}) {
  const side = 128;
  const out = [box(x, y, w, h, { cls: 'd-ui', rx: 6, stroke: 1.2 })];
  out.push(box(x + 8, y + 8, side - 16, 20, { cls: markSearch ? 'd-ui-mark' : 'd-sunk', rx: 10 }));
  out.push(kit.text(x + 18, y + 22, search || 'Search', { size: size - 1, cls: search ? 'd-key-text' : 'd-label' }));
  let cy = y + 36;
  const row = 16;
  for (const name of list) {
    if (name === '-') { cy += row * 0.45; continue; }
    if (name === section) out.push(box(x + 6, cy, side - 12, row - 1, { cls: 'd-ui-mark', rx: 3 }));
    out.push(kit.text(x + 14, cy + row / 2 + size * 0.34, name, { size: size - 1 }));
    cy += row;
  }
  out.push(box(x + side, y + 8, w - side - 8, h - 16, { cls: 'd-paper', rx: 4, stroke: 1 }));
  return { svg: out, content: [x + side, y + 8, w - side - 8, h - 16] };
}

// ---- Keys -------------------------------------------------------------------------------------

// A row of key caps with plus signs between them, like Shift + A. Returns the markup and its width.
export function keys(kit, x, y, names, { size = 12 } = {}) {
  const out = [];
  let cx = x;
  names.forEach((name, i) => {
    const w = Math.max(size * 2, name.length * size * 0.62 + size);
    out.push(keycap(kit, cx + w / 2, y, name, { size }));
    cx += w;
    if (i < names.length - 1) {
      out.push(kit.text(cx + 7, y + size * 0.36, '+', { anchor: 'middle', size }));
      cx += 14;
    }
  });
  return { svg: out, width: cx - x };
}
