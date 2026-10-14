// Wrong: a viewport render with the floor grid, the axes and the 3D cursor still on. Right: the same
// render with them turned off, showing only the props and their wireframe.
import { shot } from './assets.mjs';

export default (kit) => kit.svg({ width: 500, height: 176 },
  shot(kit, 10, 10, 230, { wire: true, grid: true, clip: 'portfolio-mistake-0' }),
  kit.tag(125, 162, 'grid, axes and cursor', { tone: 'bad' }),
  shot(kit, 260, 10, 230, { wire: true, clip: 'portfolio-mistake-1' }),
  kit.tag(375, 162, 'overlays turned off'),
);
