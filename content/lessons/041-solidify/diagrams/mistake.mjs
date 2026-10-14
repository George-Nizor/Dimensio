// A wall standing on the edge of a floor, seen from the side. Wrong: the wall's normals point into
// the room, so Solidify grows the thickness outwards, past the floor's edge. Right: the normals
// point out of the room and the thickness grows inwards, flush with the floor.
import { panel } from '../../037-modifiers/diagrams/modkit.mjs';

export default (kit) => {
  const side = (x, outwards) => {
    const fx = x + 30;
    const edge = x + 160;
    const floorY = 170;
    const t = 26;
    const wx = outwards ? edge : edge - t;
    const nx = outwards ? -1 : 1;
    return [
      panel(kit, x, 14, 232, 196),
      `<rect x="${fx}" y="${floorY}" width="${edge - fx}" height="20" class="d-face-2" stroke-width="0"/>`,
      kit.path(`M ${fx} ${floorY} L ${edge} ${floorY} L ${edge} ${floorY + 20} L ${fx} ${floorY + 20}`, { cls: 'd-ink', width: 1.4 }),
      `<rect x="${wx}" y="40" width="${t}" height="${floorY - 40}" class="d-face-sel" stroke-width="0"/>`,
      kit.path(`M ${wx} 40 L ${wx + t} 40 L ${wx + t} ${floorY} L ${wx} ${floorY} Z`, { cls: 'd-ink', width: 1.4 }),
      kit.line(edge, 34, edge, floorY, { cls: 'd-mark', width: 2.4, dash: '6 4' }),
      kit.line(edge, 90, edge + nx * 40, 90, { cls: 'd-mark', width: 1.6 }),
      kit.arrowhead(edge + nx * 40, 90, nx > 0 ? 0 : Math.PI, { size: 7 }),
      kit.text(x + 70, 60, 'room', { anchor: 'middle', size: 12 }),
    ];
  };
  return kit.svg({ width: 510, height: 250 },
    side(14, true), kit.tag(130, 236, 'normals point into the room', { tone: 'bad' }),
    side(264, false), kit.tag(380, 236, 'normals point out'),
  );
};
