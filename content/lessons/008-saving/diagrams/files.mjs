// A file in a folder, drawn as a page with a folded corner and its name under it. Not a diagram.
export function file(kit, x, y, name, { mark = false, faint = false, w = 46 } = {}) {
  const h = w * 1.25;
  const f = w * 0.3;
  const cls = mark ? 'd-ui-mark' : 'd-paper';
  return [
    `<path d="M ${x} ${y} L ${x + w - f} ${y} L ${x + w} ${y + f} L ${x + w} ${y + h} L ${x} ${y + h} Z" class="${cls}" stroke-width="1.4"${faint ? ' opacity="0.55"' : ''}/>`,
    kit.path(`M ${x + w - f} ${y} L ${x + w - f} ${y + f} L ${x + w} ${y + f}`, { cls: 'd-guide', width: 1.2 }),
    kit.text(x + w / 2, y + h + 16, name, { anchor: 'middle', size: 11 }),
  ];
}
