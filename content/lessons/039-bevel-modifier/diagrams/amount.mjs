// One edge of a box seen end on. The bevel cuts the corner off, and Amount is how far the new edges
// sit from the old corner, measured along each face.
export default (kit) => {
  const s = 150;
  const ox = 150;
  const oy = 230;
  const w = 0.45;
  const P = (x, y) => [ox + x * s, oy - y * s];
  const out = [
    kit.path(`M ${P(0, 0).join(' ')} L ${P(0, 1 - w).join(' ')} L ${P(w, 1).join(' ')} L ${P(1.5, 1).join(' ')} L ${P(1.5, 0).join(' ')} Z`, { cls: 'd-ink', width: 2 }),
  ];
  out.unshift(`<path d="M ${P(0, 0).join(' ')} L ${P(0, 1 - w).join(' ')} L ${P(w, 1).join(' ')} L ${P(1.5, 1).join(' ')} L ${P(1.5, 0).join(' ')} Z" class="d-face-2"/>`);
  out.push(kit.polyline([P(0, 1 - w), P(0, 1), P(w, 1)], { cls: 'd-guide', width: 1.4, dash: '5 4' }));
  out.push(`<path d="M ${P(0, 1 - w).join(' ')} L ${P(w, 1).join(' ')}" class="d-mark" stroke-width="4" fill="none"/>`);
  const [ax, ay] = P(0, 1);
  const [bx] = P(w, 1);
  out.push(kit.line(ax, ay - 16, bx, ay - 16, { cls: 'd-mark', width: 1.6 }), kit.arrowhead(ax, ay - 16, Math.PI, { size: 7 }), kit.arrowhead(bx, ay - 16, 0, { size: 7 }));
  out.push(kit.line(bx, ay - 24, bx, ay - 4, { cls: 'd-guide', width: 1 }));
  out.push(kit.text((ax + bx) / 2, ay - 24, 'Amount', { anchor: 'middle', size: 12 }));
  const [cx, cy] = P(0, 1);
  out.push(kit.text(cx - 26, cy - 4, 'the old corner', { anchor: 'end', size: 12 }));
  out.push(kit.line(cx - 22, cy - 8, cx - 4, cy - 2, { cls: 'd-guide', width: 1 }));
  const [fx, fy] = P(0.62, 0.72);
  out.push(kit.text(fx, fy + 30, 'the bevel face', { size: 12 }));
  out.push(kit.line(fx - 2, fy + 18, fx - 30, fy - 10, { cls: 'd-guide', width: 1 }));
  return kit.svg({ width: 420, height: 250 }, out);
};
