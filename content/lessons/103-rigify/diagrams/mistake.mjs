// Side view of a leg's two bones. Wrong: fitted dead straight, so the generated knee may bend
// backwards. Right: the knee joint pulled a little forward, so the knee bends forward.
import { bone, panel } from './helpers.mjs';

export default (kit) => {
  const leg = (x, kneeShift, ghost, tone) => {
    const hip = [x, 40];
    const knee = [x - kneeShift, 110];
    const ankle = [x, 178];
    const out = [bone(kit, hip, knee, { width: 1.4 }), bone(kit, knee, ankle, { width: 1.4 })];
    const g = ghost;
    out.push(kit.polyline([hip, [x + g, 112], [x + g * 0.3, 176]], { cls: tone === 'bad' ? 'd-bad' : 'd-mark', width: 2, dash: '5 5' }));
    out.push(kit.line(x - 40, 186, x + 40, 186, { cls: 'd-guide', width: 1.4 }));
    out.push(kit.line(x - 74, 32, x - 56, 32, { cls: 'd-guide', width: 1.4 }), kit.arrowhead(x - 74, 32, Math.PI, { size: 6, cls: 'd-guide', width: 1.4 }), kit.text(x - 50, 36, 'front', { size: 11 }));
    return out;
  };
  return kit.svg({ width: 460, height: 240 },
    panel(kit, 20, 14, 200, 186),
    leg(120, 0, 34, 'bad'),
    kit.tag(120, 228, 'straight leg', { tone: 'bad' }),
    panel(kit, 240, 14, 200, 186),
    leg(340, 10, -34),
    kit.tag(340, 228, 'knee bent a little'),
  );
};
