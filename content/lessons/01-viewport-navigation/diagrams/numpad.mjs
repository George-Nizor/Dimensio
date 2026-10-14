// Snap to a view: the numpad, with the keys this lesson uses marked and named.
export default ({ svg, rect, text }) => {
  const size = 46;
  const gap = 8;
  const x0 = 24;
  const y0 = 18;
  const at = (col, row) => [x0 + col * (size + gap), y0 + row * (size + gap)];
  // [label, column, row, width in keys, height in keys, name or null]
  const keys = [
    ['Num', 0, 0, 1, 1, null], ['/', 1, 0, 1, 1, null], ['*', 2, 0, 1, 1, null], ['-', 3, 0, 1, 1, null],
    ['7', 0, 1, 1, 1, 'top'], ['8', 1, 1, 1, 1, null], ['9', 2, 1, 1, 1, null], ['+', 3, 1, 1, 2, null],
    ['4', 0, 2, 1, 1, null], ['5', 1, 2, 1, 1, 'persp'], ['6', 2, 2, 1, 1, null],
    ['1', 0, 3, 1, 1, 'front'], ['2', 1, 3, 1, 1, null], ['3', 2, 3, 1, 1, 'right'], ['Enter', 3, 3, 1, 2, null],
    ['0', 0, 4, 2, 1, null], ['.', 2, 4, 1, 1, 'frame'],
  ];
  const names = { top: 'Top', persp: 'Persp / Ortho', front: 'Front', right: 'Right', frame: 'Frame' };
  const out = [];
  for (const [label, col, row, w, h, name] of keys) {
    const [x, y] = at(col, row);
    const width = w * size + (w - 1) * gap;
    const height = h * size + (h - 1) * gap;
    out.push(rect(x, y, width, height, { cls: name ? 'd-sunk d-key-on' : 'd-paper', rx: 7, stroke: name ? 2.4 : 1.2 }));
    out.push(text(x + width / 2, y + (name ? 21 : height / 2 + 6), label, { cls: name ? 'd-tag' : 'd-label', anchor: 'middle', size: label.length > 1 ? 13 : 17 }));
    if (name) out.push(text(x + width / 2, y + 37, names[name], { cls: 'd-label', anchor: 'middle', size: name === 'persp' ? 8.5 : 10.5 }));
  }
  return svg({ width: 4 * size + 3 * gap + 2 * x0, height: 5 * size + 4 * gap + 2 * y0 }, out);
};
