// The glTF export window's options for this exercise: glTF Binary, Selected Objects on, +Y Up on
// and Apply Modifiers on.
import { checkbox } from './parts.mjs';

export default (kit) => kit.svg({ width: 400, height: 230 },
  `<rect x="20" y="16" width="360" height="200" rx="6" class="d-ui" stroke-width="1"/>`,
  kit.text(36, 42, 'Format: glTF Binary (.glb)', { size: 12 }),
  kit.text(36, 72, 'Include', { size: 12, cls: 'd-key-text' }),
  checkbox(kit, 52, 96, 'Selected Objects', { on: true, mark: true }),
  kit.text(36, 126, 'Transform', { size: 12, cls: 'd-key-text' }),
  checkbox(kit, 52, 150, '+Y Up', { on: true }),
  kit.text(36, 180, 'Data > Mesh', { size: 12, cls: 'd-key-text' }),
  checkbox(kit, 52, 204, 'Apply Modifiers', { on: true, mark: true }),
);
