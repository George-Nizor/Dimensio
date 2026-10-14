// Wrong: the road traced with a point at every small bump, so the curve wobbles. Right: four points
// at the bends, with the handles doing the shaping.
import { drawCurve, curvePath, pt } from './bezier.mjs';

export default (kit) => {
  const road = (dx) => [pt(dx + 20, 176, -1.25, 34), pt(dx + 80, 96, -0.35, 34), pt(dx + 160, 82, 0, 30), pt(dx + 210, 36, -1.9, 26)];
  // Points along the left road's middle, each nudged a little off it, as a careless trace leaves them.
  const along = (pts, t) => {
    const seg = Math.min(Math.floor(t * (pts.length - 1)), pts.length - 2);
    const u = t * (pts.length - 1) - seg;
    const [a, b, c, d] = [pts[seg].p, pts[seg].r, pts[seg + 1].l, pts[seg + 1].p];
    const w = [(1 - u) ** 3, 3 * (1 - u) ** 2 * u, 3 * (1 - u) * u * u, u ** 3];
    return [0, 1].map((k) => w[0] * a[k] + w[1] * b[k] + w[2] * c[k] + w[3] * d[k]);
  };
  const wobbly = [];
  for (let i = 0; i <= 10; i += 1) {
    const [x, y] = along(road(0), i / 10);
    const n = i % 2 ? 6 : -6;
    wobbly.push(pt(x + n, y - n, -0.6, 6));
  }
  return kit.svg({ width: 480, height: 230 },
    kit.path(curvePath(road(0)), { cls: 'd-guide', width: 22 }),
    drawCurve(kit, wobbly, { width: 2 }),
    kit.tag(120, 218, 'a point at every bump', { tone: 'bad' }),
    kit.path(curvePath(road(250)), { cls: 'd-guide', width: 22 }),
    drawCurve(kit, road(250)),
    kit.tag(360, 218, 'four points at the bends'),
  );
};
