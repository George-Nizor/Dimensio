// The four kinds of light. Point: light in every direction from one spot. Spot: a cone. Area: a
// glowing square that faces one way. Sun: parallel light from one direction, from far away.
import { point } from './lights.mjs';

export default (kit) => {
  const cell = (x, label) => kit.text(x, 200, label, { size: 12, anchor: 'middle' });
  const floor = (x) => kit.line(x - 50, 160, x + 50, 160, { cls: 'd-guide', width: 1.4 });
  const out = [];
  // Point
  out.push(point(kit, 65, 70), floor(65), cell(65, 'Point'));
  // Spot: a dot and its cone down to the floor.
  out.push(kit.circle(190, 50, 7, { cls: 'd-mark', width: 1.8 }), kit.line(185, 56, 150, 160, { cls: 'd-mark', width: 1.4, dash: '4 4' }), kit.line(195, 56, 230, 160, { cls: 'd-mark', width: 1.4, dash: '4 4' }), floor(190), cell(190, 'Spot'));
  // Area: a square tilted down, with arrows coming off its face.
  out.push(kit.polyline([[290, 50], [340, 50], [340, 58], [290, 58], [290, 50]], { cls: 'd-mark', width: 2 }));
  for (const x of [298, 315, 332]) out.push(kit.line(x, 64, x, 110, { cls: 'd-mark', width: 1.2, dash: '3 4' }));
  out.push(floor(315), cell(315, 'Area'));
  // Sun: parallel slanted arrows.
  for (const dx of [0, 22, 44]) out.push(kit.line(395 + dx, 40, 425 + dx, 120, { cls: 'd-mark', width: 1.6 }), kit.arrowhead(425 + dx, 120, Math.atan2(80, 30), { size: 7 }));
  out.push(floor(440), cell(440, 'Sun'));
  return kit.svg({ width: 510, height: 215 }, out);
};
