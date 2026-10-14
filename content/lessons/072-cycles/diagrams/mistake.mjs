// Wrong: Render Engine Cycles with Device still on CPU. Right: Device set to GPU Compute.
import { propRow } from './stage.mjs';

const settings = (kit, x, device, bad) => [
  `<rect x="${x}" y="14" width="220" height="80" rx="6" class="d-paper" stroke-width="1.2"/>`,
  propRow(kit, x + 8, 28, 'Render Engine', 'Cycles', { width: 204, split: 0.48 }),
  propRow(kit, x + 8, 58, 'Device', device, { width: 204, split: 0.48, mark: !bad }),
  bad ? `<rect x="${x + 106}" y="58" width="106" height="18" rx="3" class="d-key-bad" fill-opacity="0.2" stroke-width="1.6"/>` : '',
];

export default (kit) => kit.svg({ width: 480, height: 136 },
  settings(kit, 10, 'CPU', true),
  kit.tag(120, 122, 'still on the CPU', { tone: 'bad' }),
  settings(kit, 250, 'GPU Compute', false),
  kit.tag(360, 122, 'on the graphics card'),
);
