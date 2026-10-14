// The three kinds of face: a triangle (three corners), a quad (four) and an n-gon (here six).
export default (kit) => {
  const shapes = [
    ['triangle', [[0, -1], [0.95, 0.65], [-0.95, 0.65]]],
    ['quad', [[-0.85, -0.85], [0.85, -0.85], [0.85, 0.85], [-0.85, 0.85]]],
    ['n-gon', [...Array(6).keys()].map((i) => [Math.cos((i * Math.PI) / 3) * 1, Math.sin((i * Math.PI) / 3) * 1])],
  ];
  return kit.svg({ width: 500, height: 190 }, shapes.map(([label, pts], i) => {
    const cx = 90 + i * 160;
    const p = pts.map(([x, y]) => [cx + x * 56, 86 + y * 56]);
    return [
      `<path d="M ${p.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ')} Z" class="d-face-2"/>`,
      kit.polyline([...p, p[0]], { cls: 'd-ink', width: 2 }),
      p.map(([x, y]) => kit.dot(x, y, { r: 4, cls: 'd-mark-fill' })),
      kit.text(cx, 176, `${label}: ${pts.length} corners`, { anchor: 'middle', size: 12 }),
    ];
  }));
};
