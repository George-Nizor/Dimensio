// The same Cycles render twice: at Noise Threshold 0.1 with Denoise off it is grainy; at 0.01 with
// Denoise on it is clean.
import { render } from './stage.mjs';

export default (kit) => kit.svg({ width: 520, height: 170 },
  render(kit, 10, 10, 244, { grain: 900, clip: 'cycles-example-0' }),
  kit.text(132, 162, 'threshold 0.1, no denoise', { anchor: 'middle', size: 12 }),
  render(kit, 266, 10, 244, { clip: 'cycles-example-1' }),
  kit.text(388, 162, 'threshold 0.01, denoised', { anchor: 'middle', size: 12 }),
);
