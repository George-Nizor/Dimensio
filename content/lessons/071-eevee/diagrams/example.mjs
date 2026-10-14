// The finished EEVEE render of the stage in Blender's render window, with a soft glow round the
// lantern from the Glare node.
import { smallWindow } from './stage.mjs';
import { renderedStage } from './glow.mjs';

export default (kit) => kit.svg({ width: 480, height: 300 },
  smallWindow(kit, 20, 10, 440, 280, 'Blender Render', ['View', 'Image']),
  renderedStage(kit, 32, 52, 416, { clip: 'eevee-example' }),
);
