// Wrong: Distribute Points sits before the zone, feeding the Simulation Input, which reads its
// input only on the first frame, so every coin is made at once and falls as one sheet. Right:
// inside the zone, joined each frame, so the coins pour.
import { node, link, panel } from './helpers.mjs';

export default (kit) => {
  const half = (x, inside) => {
    const d = node(kit, x + (inside ? 20 : 10), inside ? 34 : 30, 104, 'Distribute Points', { inputs: ['Mesh'], outputs: ['Points'], size: 10, tone: inside ? undefined : 'bad' });
    const s = node(kit, x + 120, 120, 104, 'Simulation Input', { inputs: ['Geometry'], outputs: ['Geometry'], size: 10 });
    const out = [panel(kit, x, 14, 230, 190), `<rect x="${x + (inside ? 8 : 112)}" y="${inside ? 24 : 110}" width="${inside ? 214 : 118}" height="${inside ? 172 : 86}" rx="8" class="d-sunk" stroke-width="1"/>`];
    out.push(d.svg, s.svg);
    if (!inside) out.push(link(kit, d.at['out:Points'], s.at['in:Geometry'], { cls: 'd-bad', width: 2 }));
    else out.push(kit.text(x + 20, 132, 'joined each frame', { size: 11 }));
    return out;
  };
  return kit.svg({ width: 480, height: 236 },
    half(10, false),
    kit.tag(125, 228, 'made once, falls as a sheet', { tone: 'bad' }),
    half(250, true),
    kit.tag(365, 228, 'made each frame, pours'),
  );
};
