// The Spin tool from the top view: the outline, seen edge on as a line from the 3D cursor, copied
// round the cursor in 12 steps to make the same round shape as real geometry.
export default (kit) => {
  const cx = 200;
  const cy = 128;
  const r = 96;
  const out = [kit.circle(cx, cy, r, { cls: 'd-guide', width: 1, dash: '4 5' })];
  for (let k = 0; k < 12; k += 1) {
    const t = (k / 12) * Math.PI * 2;
    out.push(kit.line(cx + Math.cos(t) * 10, cy - Math.sin(t) * 10, cx + Math.cos(t) * r, cy - Math.sin(t) * r, { cls: k === 0 ? 'd-ink' : 'd-guide', width: k === 0 ? 2.4 : 1.2 }));
  }
  const pts = Array.from({ length: 13 }, (_, k) => { const t = (k / 12) * Math.PI * 2; return [cx + Math.cos(t) * r, cy - Math.sin(t) * r]; });
  out.push(kit.polyline(pts, { cls: 'd-ink', width: 1.6 }));
  out.push(...kit.arcArrow(cx + r + 14, cy - 10, cx + 40, cy - r - 12, { lift: -40 }));
  // The 3D cursor: a ring with a cross through it.
  out.push(kit.circle(cx, cy, 7, { cls: 'd-bad', width: 2, dash: '3 3' }), kit.line(cx - 12, cy, cx + 12, cy, { cls: 'd-ink', width: 1.2 }), kit.line(cx, cy - 12, cx, cy + 12, { cls: 'd-ink', width: 1.2 }));
  out.push(kit.text(cx + r + 10, cy + 6, 'the outline,', { size: 12 }), kit.text(cx + r + 10, cy + 22, 'edge on', { size: 12 }));
  out.push(kit.text(cx - 14, cy + 26, '3D cursor', { anchor: 'end', size: 12 }));
  return kit.svg({ width: 440, height: 256 }, out, kit.text(200, 248, 'top view, Steps 12, Angle 360°', { anchor: 'middle', size: 12 }));
};
