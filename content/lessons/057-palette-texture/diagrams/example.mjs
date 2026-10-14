// The palette image beside the barrel it colours: wooden staves from the wood row, grey bands from
// the grey row and darker ends, all from one material.
import { view } from '../../../diagrams/mesh.mjs';
import { palette, barrel, swatchStyle, drawFaces } from './palette.mjs';

export default (kit) => {
  const { mesh: m, parts } = barrel();
  const v = view({ at: [370, 150], scale: 140, target: [0, 0, 0.6], azimuth: 30, elevation: 22 });
  const style = (f) => (parts.bands.includes(f) ? swatchStyle(1, 1) : parts.ends.includes(f) ? swatchStyle(0, 1) : swatchStyle(0, 3));
  return kit.svg({ width: 500, height: 280 },
    palette(kit, 30, 40, 200),
    kit.text(130, 268, 'the palette image', { anchor: 'middle', size: 12 }),
    drawFaces(kit, m, v, style),
    kit.text(370, 268, 'one material, one image', { anchor: 'middle', size: 12 }),
  );
};
