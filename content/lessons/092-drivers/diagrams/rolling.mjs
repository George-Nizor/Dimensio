// Why var / 0.4: a wheel 0.4 m in radius rolls 0.4 m to the right along the floor. The part of its
// rim that has touched the floor, also 0.4 m long, has turned up behind it through one radian
// (about 57 degrees).
export default (kit) => {
  const s = 220;
  const r = 0.4 * s;
  const gy = 250;
  const x0 = 130;
  const x1 = x0 + r;
  const cy = gy - r;
  const rim = (t) => [x1 - Math.sin(t) * r, cy + Math.cos(t) * r];
  const arc = [];
  for (let i = 0; i <= 24; i += 1) arc.push(rim(i / 24));
  return kit.svg({ width: 460, height: 310 },
    kit.text(230, 32, 'turn in radians = distance / radius', { anchor: 'middle', size: 13 }),
    kit.line(40, gy, 420, gy, { cls: 'd-guide', width: 1.6 }),
    kit.circle(x0, cy, r, { cls: 'd-guide', width: 1.2, dash: '5 5' }),
    kit.circle(x1, cy, r, { cls: 'd-ink', width: 2 }),
    kit.polyline(arc, { cls: 'd-mark', width: 4.5 }),
    kit.line(x1, cy, x1, gy, { cls: 'd-ink', width: 1.4 }),
    kit.line(x1, cy, ...rim(1), { cls: 'd-ink', width: 1.4 }),
    kit.text(x1 - 14, cy + 52, '1 radian', { anchor: 'end', size: 12 }),
    kit.line(x1, cy, x1 + r * 0.7, cy - r * 0.7, { cls: 'd-guide', width: 1.2 }),
    kit.text(x1 + r * 0.72 + 6, cy - r * 0.72, 'r = 0.4 m', { size: 12 }),
    kit.text(rim(0.75)[0] - 12, rim(0.75)[1] - 2, 'rim 0.4 m', { anchor: 'end', size: 12 }),
    kit.line(x0, gy + 18, x1, gy + 18, { cls: 'd-mark', width: 1.6 }),
    kit.arrowhead(x1, gy + 18, 0, { size: 7 }),
    kit.text((x0 + x1) / 2 + 40, gy + 38, 'rolled 0.4 m to the right', { anchor: 'middle', size: 12 }),
  );
};
