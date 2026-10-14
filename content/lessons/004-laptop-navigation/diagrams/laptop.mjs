// A laptop keyboard and touchpad, shared by this lesson's diagrams. Not a diagram itself.

const ROW = ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='];

// The keyboard from (x, y), `k` pixels per key, with number-row keys picked out by label.
export function keyboard(kit, x, y, { k = 26, mark = [], rows = 4, space = rows > 1 } = {}) {
  const g = k * 0.14;
  const out = [];
  ROW.forEach((label, i) => {
    const on = mark.includes(label);
    const kx = x + i * (k + g);
    out.push(`<rect x="${kx.toFixed(1)}" y="${y}" width="${k}" height="${k}" rx="4" class="${on ? 'd-key-mark' : 'd-key'}" stroke-width="1.3"/>`);
    out.push(kit.text(kx + k / 2, y + k * 0.66, label, { anchor: 'middle', size: k * 0.46, cls: on ? 'd-key-text d-key-text-mark' : 'd-key-text' }));
  });
  for (let r = 1; r < rows; r += 1) {
    const shift = r * k * 0.3;
    for (let i = 0; i < 12 - (r > 2 ? 1 : 0); i += 1) {
      out.push(`<rect x="${(x + shift + i * (k + g)).toFixed(1)}" y="${(y + r * (k + g)).toFixed(1)}" width="${k}" height="${k}" rx="4" class="d-key" stroke-width="1"/>`);
    }
  }
  const sy = y + rows * (k + g);
  if (space) out.push(`<rect x="${(x + 3.6 * (k + g)).toFixed(1)}" y="${sy.toFixed(1)}" width="${(5.5 * (k + g)).toFixed(1)}" height="${k}" rx="4" class="d-key" stroke-width="1"/>`);
  return { svg: out, width: ROW.length * (k + g) - g, bottom: sy + k };
}

// A touchpad with two fingertips on it.
export function touchpad(kit, x, y, w, h, { fingers = [[0.42, 0.5], [0.58, 0.5]] } = {}) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" class="d-sunk" stroke-width="1.4"/>`,
    ...fingers.map(([fx, fy]) => kit.circle(x + fx * w, y + fy * h, Math.min(w, h) * 0.1, { cls: 'd-mark', width: 2.2 })),
  ];
}
