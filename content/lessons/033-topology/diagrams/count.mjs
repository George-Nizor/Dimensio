// How faces count as triangles: a quad is two, a six-sided n-gon four (corners minus two). The
// splits are dashed.
export default (kit) => {
  const quad = [[-0.85, -0.85], [0.85, -0.85], [0.85, 0.85], [-0.85, 0.85]];
  const hex = [...Array(6).keys()].map((i) => [Math.cos((i * Math.PI) / 3), Math.sin((i * Math.PI) / 3)]);
  const draw = (pts, cx, diagonals, label) => {
    const p = pts.map(([x, y]) => [cx + x * 60, 88 + y * 60]);
    return [
      `<path d="M ${p.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ')} Z" class="d-face-2"/>`,
      diagonals.map(([i, j]) => kit.line(p[i][0], p[i][1], p[j][0], p[j][1], { cls: 'd-mark', width: 1.6, dash: '5 4' })),
      kit.polyline([...p, p[0]], { cls: 'd-ink', width: 2 }),
      kit.text(cx, 178, label, { anchor: 'middle', size: 12 }),
    ];
  };
  return kit.svg({ width: 440, height: 190 },
    draw(quad, 110, [[0, 2]], 'quad: 2 triangles'),
    draw(hex, 320, [[0, 2], [0, 3], [0, 4]], '6 corners: 4 triangles'),
  );
};
