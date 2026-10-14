// Cut through the sculpt's surface. Wrong: a vertex moved with snapping off floats above the surface.
// Right: with Face Project snapping, it lands on the surface.
const surface = (x0) => Array.from({ length: 31 }, (_, i) => { const t = i / 30; return [x0 + t * 200, 150 - Math.sin(t * Math.PI) * 70 - Math.sin(t * 8) * 5]; });

export default (kit) => {
  const half = (x0, snapped) => {
    const s = surface(x0);
    const low = [s[0], s[8], s[15], s[22], s[30]];
    const moved = snapped ? s[15] : [s[15][0], s[15][1] - 40];
    const pts = [low[0], low[1], moved, low[3], low[4]];
    return [
      kit.smooth(s, { cls: 'd-guide', width: 2 }),
      kit.polyline(pts, { cls: snapped ? 'd-mark' : 'd-bad', width: 2 }),
      pts.map(([x, y]) => kit.dot(x, y, { r: 3.6, cls: snapped ? 'd-mark-fill' : 'd-dot' })),
    ];
  };
  return kit.svg({ width: 480, height: 200 },
    half(20, false), kit.tag(120, 188, 'snapping off: floating', { tone: 'bad' }),
    half(260, true), kit.tag(360, 188, 'Face Project: on the surface'),
  );
};
