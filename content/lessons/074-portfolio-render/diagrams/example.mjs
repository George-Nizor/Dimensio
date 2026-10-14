// The three portfolio pictures of the same arranged assets: an EEVEE colour render, a clay render,
// and the clay render with the wireframe on top.
import { shot } from './assets.mjs';

export default (kit) => kit.svg({ width: 540, height: 130 }, [['colour', { tint: true }], ['clay', {}], ['clay with wireframe', { wire: true }]].map(([label, options], i) => [
  shot(kit, 6 + i * 179, 10, 170, { ...options, clip: `portfolio-example-${i}` }),
  kit.text(91 + i * 179, 124, label, { anchor: 'middle', size: 12 }),
]));
