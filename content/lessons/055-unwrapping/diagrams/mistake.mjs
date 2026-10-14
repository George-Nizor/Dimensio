// Wrong: the barrel unwrapped with seams round its ends but none down its side, so the side comes
// out as a ring, its faces tiny inside and large outside, red with stretching. Right: one seam down
// the back, and the side lies flat as an even strip.
import { uvSquare, drawUVs, stretch } from './uv.mjs';
import { barrel } from './props.mjs';

function half(kit, x, sideSeam) {
  const { mesh: m, uvs } = barrel({ sideSeam });
  const ratio = stretch(m, uvs);
  const only = m.faces.map((f, i) => i).filter((i) => i < 48);
  return [
    uvSquare(kit, x, 20, 200, { labels: false }),
    drawUVs(kit, uvs, x, 20, 200, { only, fill: (i) => (Math.abs(Math.log(Math.max(ratio[i], 1e-3))) > 0.35 ? 'd-gizmo-x' : 'd-gizmo-z') }),
    kit.tag(x + 100, 248, sideSeam ? 'a seam down the back' : 'no side seam: a ring', { tone: sideSeam ? 'mark' : 'bad' }),
  ];
}

export default (kit) => kit.svg({ width: 500, height: 262 }, half(kit, 25, false), half(kit, 275, true));
