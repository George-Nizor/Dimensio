// Four texture nodes' patterns in grey, as their Factor or Distance output shows them: Noise
// (cloudy blotches), Voronoi (cells), Wave (bands) and Brick.
import { swatch, noise, voronoi, wave, brick } from './patterns.mjs';

export default (kit) => {
  const items = [['Noise', noise(3, 4)], ['Voronoi', voronoi(5, 4)], ['Wave', wave(7, 4, 0.05)], ['Brick', brick(5, 3, 0.07)]];
  return kit.svg({ width: 560, height: 170 },
    items.map(([label, f], i) => {
      const x = 16 + i * 136;
      return [swatch(kit, x, 14, 120, f, { cells: 30 }), kit.text(x + 60, 156, `${label} Texture`, { anchor: 'middle', size: 12 })];
    }),
  );
};
