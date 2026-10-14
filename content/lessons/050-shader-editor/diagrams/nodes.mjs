// Node schematics for this lesson's diagrams, drawn the way the Shader Editor draws nodes. Not a
// diagram itself. A node is a rounded box with a title bar, its outputs on the right, then its
// settings, then its inputs on the left. An unconnected input shows its value in a field, as
// Blender does. Links are curves from an output socket to an input socket.
//
// Rows, in the order Blender draws them:
//   outputs: ['Color', { name: 'Alpha', mark: true }]
//   fields:  ['Linear', { text: 'sRGB', mark: true }]      drop-down menus with no socket
//            { bar: { from: 'd-dot', to: 'd-key', stops: [0, 1] } } a Color Ramp's colour bar
//            { image: 'checker' }                           an image preview, two rows tall
//   inputs:  ['Vector', { name: 'Roughness', value: '0.500' }, { name: 'Base Color', swatch: 'd-face-2' },
//             { name: 'Emission', panel: true }, { name: 'Normal', socket: false }]
// mark: true picks a row out in the selection colour. A node's `sockets` maps 'out:Color' and
// 'in:Base Color' to the socket's position, for links.

const ROW = 19;
const TITLE = 22;

const rowOf = (row, key) => (typeof row === 'string' ? { [key]: row } : row);

export function node(kit, { x, y, w = 150, title, outputs = [], fields = [], inputs = [], mark = false, size = 11 }) {
  const out = [];
  const sockets = {};
  const rows = [
    ...outputs.map((row) => ({ kind: 'out', ...rowOf(row, 'name') })),
    ...fields.map((row) => ({ kind: 'field', ...rowOf(row, 'text') })),
    ...inputs.map((row) => ({ kind: 'in', ...rowOf(row, 'name') })),
  ];
  const tall = (row) => (row.bar || row.image ? 2 : 1);
  const h = TITLE + rows.reduce((sum, row) => sum + tall(row) * ROW, 0) + 8;
  out.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="${mark ? 'd-ui-mark' : 'd-paper'}" stroke-width="1.4"/>`);
  out.push(`<path d="M ${x} ${y + TITLE} L ${x} ${y + 6} Q ${x} ${y} ${x + 6} ${y} L ${x + w - 6} ${y} Q ${x + w} ${y} ${x + w} ${y + 6} L ${x + w} ${y + TITLE} Z" class="d-sunk" stroke-width="1"/>`);
  out.push(kit.text(x + 9, y + 15, title, { size: size + 1, cls: 'd-key-text' }));
  let top = y + TITLE + 4;
  rows.forEach((row) => {
    const mid = top + ROW / 2;
    const rowTop = top;
    top += tall(row) * ROW;
    if (row.mark) out.push(`<rect x="${x + 3}" y="${rowTop}" width="${w - 6}" height="${tall(row) * ROW - 2}" rx="3" class="d-ui-mark" stroke-width="1"/>`);
    if (row.bar) {
      out.push(...rampBar(kit, x + 10, rowTop + 4, w - 20, ROW, row.bar));
      return;
    }
    if (row.image) {
      out.push(...checker(x + 10, rowTop + 3, w - 20, 2 * ROW - 6));
      return;
    }
    if (row.kind === 'out') {
      out.push(kit.text(x + w - 12, mid + 4, row.name, { size, anchor: 'end' }));
      sockets[`out:${row.name}`] = [x + w, mid];
      out.push(socket(x + w, mid, row.mark));
    } else if (row.kind === 'field') {
      out.push(`<rect x="${x + 9}" y="${rowTop + 2}" width="${w - 18}" height="${ROW - 5}" rx="3" class="d-sunk" stroke-width="1"/>`);
      out.push(kit.text(x + 15, mid + 4, row.text, { size, cls: 'd-key-text' }));
      out.push(kit.path(`M ${x + w - 22} ${mid - 2} L ${x + w - 18} ${mid + 2} L ${x + w - 14} ${mid - 2}`, { cls: 'd-ink', width: 1.2 }));
    } else if (row.panel) {
      out.push(kit.path(`M ${x + 10} ${mid - 4} L ${x + 14} ${mid} L ${x + 10} ${mid + 4}`, { cls: 'd-ink', width: 1.4 }));
      out.push(kit.text(x + 20, mid + 4, row.name, { size }));
    } else if (row.value !== undefined || row.swatch) {
      out.push(`<rect x="${x + 9}" y="${rowTop + 2}" width="${w - 18}" height="${ROW - 5}" rx="3" class="d-sunk" stroke-width="1"/>`);
      out.push(kit.text(x + 15, mid + 4, row.name, { size }));
      if (row.value !== undefined) out.push(kit.text(x + w - 15, mid + 4, row.value, { size, anchor: 'end', cls: 'd-key-text' }));
      if (row.swatch) out.push(`<rect x="${x + w - 44}" y="${rowTop + 4}" width="30" height="${ROW - 9}" rx="2" class="${row.swatch}" stroke-width="1"/>`);
      if (row.socket !== false) {
        sockets[`in:${row.name}`] = [x, mid];
        out.push(socket(x, mid, row.mark));
      }
    } else {
      out.push(kit.text(x + 12, mid + 4, row.name, { size }));
      if (row.socket !== false) {
        sockets[`in:${row.name}`] = [x, mid];
        out.push(socket(x, mid, row.mark));
      }
    }
  });
  return { svg: out, sockets, h, w, x, y };
}

// A Color Ramp's bar: the first colour, then the second laid over it with rising opacity between
// the two stops, and a marker under each stop.
function rampBar(kit, x, y, w, h, { from, to, stops = [0, 1] }) {
  const out = [`<rect x="${x}" y="${y}" width="${w}" height="${h - 6}" class="${from}" stroke-width="0"/>`];
  const strips = 40;
  for (let i = 0; i < strips; i += 1) {
    const t = (i + 0.5) / strips;
    const a = Math.min(1, Math.max(0, (t - stops[0]) / Math.max(stops[1] - stops[0], 1e-6)));
    if (a > 0.01) out.push(`<rect x="${(x + (w * i) / strips).toFixed(2)}" y="${y}" width="${(w / strips + 0.3).toFixed(2)}" height="${h - 6}" class="${to}" stroke-width="0" opacity="${a.toFixed(2)}"/>`);
  }
  out.push(`<rect x="${x}" y="${y}" width="${w}" height="${h - 6}" class="d-ink" fill="none" stroke-width="1"/>`);
  for (const stop of stops) {
    const sx = x + w * stop;
    out.push(kit.path(`M ${sx} ${y + h - 6} L ${sx - 5} ${y + h + 2} L ${sx + 5} ${y + h + 2} Z`, { cls: 'd-ink', width: 1.2, fill: 'none' }));
  }
  return out;
}

// A small checkerboard, for an image texture's preview.
function checker(x, y, w, h) {
  const out = [`<rect x="${x}" y="${y}" width="${w}" height="${h}" class="d-face-1" stroke-width="0"/>`];
  const size = h / 4;
  for (let i = 0; i * size < w - 0.1; i += 1) {
    for (let j = 0; j < 4; j += 1) {
      if ((i + j) % 2) out.push(`<rect x="${(x + i * size).toFixed(2)}" y="${(y + j * size).toFixed(2)}" width="${Math.min(size, x + w - (x + i * size)).toFixed(2)}" height="${size.toFixed(2)}" class="d-face-3" stroke-width="0"/>`);
    }
  }
  out.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" class="d-ink" fill="none" stroke-width="1"/>`);
  return out;
}

function socket(x, y, mark) {
  return `<circle cx="${x}" cy="${y}" r="4.2" class="${mark ? 'd-key-mark' : 'd-key'}" stroke-width="1.3"/>`;
}

// A link from one socket position to another, curved the way node editors draw them.
export function link(kit, from, to, { mark = false, cls, dash } = {}) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const bend = Math.max(28, Math.abs(x2 - x1) * 0.5);
  return kit.path(`M ${x1} ${y1} C ${x1 + bend} ${y1} ${x2 - bend} ${y2} ${x2} ${y2}`, { cls: cls || (mark ? 'd-mark' : 'd-ink'), width: mark ? 2.4 : 1.6, dash });
}
