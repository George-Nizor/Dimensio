// Render Properties with Render Engine set to Cycles and Device set to GPU Compute.
import { propRow } from './stage.mjs';

export default (kit) => kit.svg({ width: 420, height: 120 },
  `<rect x="20" y="14" width="380" height="94" rx="6" class="d-paper" stroke-width="1.2"/>`,
  propRow(kit, 30, 32, 'Render Engine', 'Cycles', { width: 350, split: 0.42 }),
  propRow(kit, 30, 66, 'Device', 'GPU Compute', { width: 350, split: 0.42, mark: true }),
);
