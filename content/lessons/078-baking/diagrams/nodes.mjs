// Nodes and links, shared by this lesson's diagrams. Not a diagram itself.

// A node: a header with its name, then one row per socket. Inputs sit on the left edge, outputs on
// the right. Returns the drawing and where each input (ins) and output (outs) socket is, by name.
export function node(kit, x, y, title, { width = 120, inputs = [], outputs = [], fields = [], mark = false } = {}) {
  const rows = Math.max(inputs.length + outputs.length + fields.length, 1);
  const h = 26 + rows * 20 + 6;
  const out = [
    `<rect x="${x}" y="${y}" width="${width}" height="${h}" rx="5" class="${mark ? 'd-ui-mark' : 'd-paper'}" stroke-width="1.4"/>`,
    `<rect x="${x}" y="${y}" width="${width}" height="22" rx="5" class="d-sunk" stroke-width="1"/>`,
    kit.text(x + 8, y + 15, title, { size: 11 }),
  ];
  const outs = {};
  const ins = {};
  let row = 0;
  for (const name of outputs) {
    const sy = y + 36 + row * 20;
    out.push(kit.text(x + width - 12, sy + 4, name, { anchor: 'end', size: 10 }), kit.dot(x + width, sy, { r: 4.2, cls: 'd-mark-fill' }));
    outs[name] = [x + width, sy];
    row += 1;
  }
  for (const [label, value] of fields) {
    const sy = y + 36 + row * 20;
    out.push(`<rect x="${x + 8}" y="${sy - 9}" width="${width - 16}" height="17" rx="3" class="d-key" stroke-width="1"/>`);
    out.push(kit.text(x + 14, sy + 4, label, { size: 10 }), kit.text(x + width - 14, sy + 4, value, { anchor: 'end', size: 10, cls: 'd-key-text' }));
    row += 1;
  }
  for (const name of inputs) {
    const sy = y + 36 + row * 20;
    out.push(kit.text(x + 12, sy + 4, name, { size: 10 }), kit.dot(x, sy, { r: 4.2, cls: 'd-mark-fill' }));
    ins[name] = [x, sy];
    row += 1;
  }
  return { svg: out, ins, outs, height: h };
}

// A link between two sockets, as the node editor draws it.
export function link(kit, from, to, { cls = 'd-ink', width = 2 } = {}) {
  const mid = (from[0] + to[0]) / 2;
  return kit.path(`M ${from[0]} ${from[1]} C ${mid} ${from[1]} ${mid} ${to[1]} ${to[0]} ${to[1]}`, { cls, width });
}
