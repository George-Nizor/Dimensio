// Node schematics for the Geometry Nodes lessons. Not a diagram itself. A node is a rounded box with
// a title bar, its outputs listed first with sockets on the right edge, then its inputs with sockets
// on the left edge, the way Blender lays nodes out. Socket colours follow Blender's: geometry green,
// vectors blue, numbers grey, rotations and true/false pink, objects orange. A field socket is a
// diamond and a link that carries a field is dashed, as in the node editor. An input with `check`
// is drawn as a tick box with no socket.

const ROW = 20;
const HEAD = 22;
const SOCKET_CLASS = { geo: 'd-gizmo-y', vector: 'd-gizmo-z', float: 'd-key', int: 'd-key', bool: 'd-gizmo-x', rotation: 'd-gizmo-x', object: 'd-key-mark', collection: 'd-key', empty: 'd-ui' };

export function socket(kit, x, y, { type = 'float', field = false, multi = false } = {}) {
  const cls = SOCKET_CLASS[type] || 'd-key';
  if (multi) return `<rect x="${x - 4.5}" y="${y - 9}" width="9" height="18" rx="4.5" class="${cls}" stroke-width="1.4"/>`;
  if (field) return `<path d="M ${x} ${y - 6} L ${x + 6} ${y} L ${x} ${y + 6} L ${x - 6} ${y} Z" class="${cls}" stroke-width="1.4"/>`;
  return `<circle cx="${x}" cy="${y}" r="5" class="${cls}" stroke-width="1.4"/>`;
}

// node(kit, { x, y, w, title, outputs: [{ name, type, field }], inputs: [{ name, type, field,
// value, multi, check }], mark }) returns { svg, out, in, h }: out and in map socket names to [x, y].
export function node(kit, { x, y, w = 140, title, outputs = [], inputs = [], mark = false, settings = [] }) {
  const rows = outputs.length + settings.length + inputs.length;
  const h = HEAD + rows * ROW + 8;
  const svg = [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="d-paper" stroke-width="1.4"/>`,
    `<path d="M ${x} ${y + HEAD} L ${x} ${y + 6} Q ${x} ${y} ${x + 6} ${y} L ${x + w - 6} ${y} Q ${x + w} ${y} ${x + w} ${y + 6} L ${x + w} ${y + HEAD} Z" class="${mark ? 'd-ui-mark' : 'd-sunk'}" stroke-width="1.4"/>`,
    kit.text(x + 9, y + 15, title, { size: 12 }),
  ];
  const out = {};
  const inp = {};
  let row = 0;
  for (const s of outputs) {
    const sy = y + HEAD + 4 + row * ROW + ROW / 2;
    svg.push(kit.text(x + w - 12, sy + 4, s.name, { anchor: 'end', size: 11 }), socket(kit, x + w, sy, s));
    out[s.name] = [x + w, sy];
    row += 1;
  }
  for (const label of settings) {
    const sy = y + HEAD + 4 + row * ROW + ROW / 2;
    svg.push(`<rect x="${x + 8}" y="${sy - 8}" width="${w - 16}" height="16" rx="3" class="d-sunk" stroke-width="1"/>`, kit.text(x + 14, sy + 4, label, { size: 10.5 }));
    row += 1;
  }
  for (const s of inputs) {
    const sy = y + HEAD + 4 + row * ROW + ROW / 2;
    if (s.check !== undefined) {
      // A tick box, as Blender draws a true/false input that nothing is linked to.
      svg.push(`<rect x="${x + 12}" y="${sy - 6}" width="12" height="12" rx="2" class="${s.check ? 'd-key-mark' : 'd-key'}" stroke-width="1"/>`, kit.text(x + 30, sy + 4, s.name, { size: 11 }));
      row += 1;
      continue;
    }
    if (s.value !== undefined) {
      svg.push(`<rect x="${x + 10}" y="${sy - 8}" width="${w - 20}" height="16" rx="3" class="d-sunk" stroke-width="1"/>`,
        kit.text(x + 16, sy + 4, s.name, { size: 10.5 }), kit.text(x + w - 16, sy + 4, s.value, { anchor: 'end', size: 10.5, cls: 'd-key-text' }));
    } else {
      svg.push(kit.text(x + 12, sy + 4, s.name, { size: 11 }));
    }
    svg.push(socket(kit, x, sy, s));
    inp[s.name] = [x, sy];
    row += 1;
  }
  return { svg, out, in: inp, h };
}

// A link from an output socket to an input socket, as a smooth S curve.
export function link(kit, [x1, y1], [x2, y2], { field = false, cls = 'd-ink', width = 2 } = {}) {
  const dx = Math.max(30, Math.abs(x2 - x1) / 2);
  return kit.path(`M ${x1} ${y1} C ${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`, { cls, width, dash: field ? '5 4' : undefined });
}

// Group Input and Group Output, with the hollow socket that makes a new input or output.
export function groupInput(kit, x, y, extra = [], { w = 120 } = {}) {
  const n = node(kit, { x, y, w, title: 'Group Input', outputs: [{ name: 'Geometry', type: 'geo' }, ...extra, { name: '', type: 'empty' }] });
  return n;
}
export function groupOutput(kit, x, y, { w = 120 } = {}) {
  return node(kit, { x, y, w, title: 'Group Output', inputs: [{ name: 'Geometry', type: 'geo' }, { name: '', type: 'empty' }] });
}

// A rounded frame for one small view, with a label under it.
export function panel(kit, x, y, w, h, label) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="d-ui" stroke-width="1"/>`,
    label ? kit.text(x + w / 2, y + h + 16, label, { anchor: 'middle', size: 12 }) : '',
  ];
}
