# Example models

These are the models Dimensio's copy exercises show as reference pictures. Our own Blender scripts
render the pictures, and learners copy the model in Blender. Each one is a low-poly game asset by
Kenney, released under CC0 1.0, so the app can ship and modify them without asking.

Each pack's licence was checked on 2026-10-15 in two places: the licence row on its kenney.nl page,
and the `License.txt` inside the downloaded zip. Both say CC0 for all ten packs. None of the models
is AI-generated.

The entries the app reads are in `content/references/models.yaml`. The files are in
`desktop/public/reference/models/`, and each pack's `License.txt` is copied unchanged to
`desktop/public/reference/models/LICENSES/<pack>.txt`.

## How the files were prepared

Most of the newer Kenney kits keep their colours in one shared texture, `Textures/colormap.png`,
next to the GLB files, so a GLB copied on its own opens untextured. For those files a small script
embedded the pack's `colormap.png` (a 512 by 512 PNG of 7 to 12 KB) into the GLB's binary chunk as
a new bufferView, replaced the image `uri` with that bufferView and set `mimeType` to `image/png`.
Nothing else in the files was changed. The Furniture Kit and Nature Kit models colour their
materials directly and use no texture, so those two files are copied byte for byte.

A second script checked every shipped file: the GLB header has the glTF magic, version 2 and a
length equal to the file size, chunks are 4-byte aligned, every bufferView fits inside its buffer,
and every image is embedded. All 16 pass. The models also render correctly from those files alone.

## Models

Item is the file's path inside the pack's zip. Size is the shipped file. The download URL is the
zip the pack page linked on 2026-10-15; Kenney changes the hash in that URL when a pack is updated,
and the pack page always links the current zip.

| Need | Id | Item | Pack | Author | Licence | File | Size | Triangles | Download URL | Licence URL |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Crate | kenney-platformer-crate | `Models/GLB format/crate.glb` | Platformer Kit 4.1 | Kenney | CC0 1.0 | kenney-platformer-crate.glb | 24.9 KB | 156 | https://kenney.nl/media/pages/assets/platformer-kit/1585cf62b4-1775122253/kenney_platformer-kit.zip | https://creativecommons.org/publicdomain/zero/1.0/ |
| Crate (second option, open) | kenney-pirate-crate | `Models/GLB format/crate.glb` | Pirate Kit 2.1 | Kenney | CC0 1.0 | kenney-pirate-crate.glb | 18.9 KB | 76 | https://kenney.nl/media/pages/assets/pirate-kit/e6d4bb1525-1771333093/kenney_pirate-kit.zip | https://creativecommons.org/publicdomain/zero/1.0/ |
| Barrel | kenney-pirate-barrel | `Models/GLB format/barrel.glb` | Pirate Kit 2.1 | Kenney | CC0 1.0 | kenney-pirate-barrel.glb | 23.6 KB | 148 | https://kenney.nl/media/pages/assets/pirate-kit/e6d4bb1525-1771333093/kenney_pirate-kit.zip | https://creativecommons.org/publicdomain/zero/1.0/ |
| Sword | kenney-dungeon-sword | `Models/GLB format/weapon-sword.glb` | Mini Dungeon 2.0 | Kenney | CC0 1.0 | kenney-dungeon-sword.glb | 19.7 KB | 80 | https://kenney.nl/media/pages/assets/mini-dungeon/6cd72dc849-1785314274/kenney_mini-dungeon.zip | https://creativecommons.org/publicdomain/zero/1.0/ |
| Treasure chest | kenney-pirate-chest | `Models/GLB format/chest.glb` | Pirate Kit 2.1 | Kenney | CC0 1.0 | kenney-pirate-chest.glb | 34.5 KB | 232 | https://kenney.nl/media/pages/assets/pirate-kit/e6d4bb1525-1771333093/kenney_pirate-kit.zip | https://creativecommons.org/publicdomain/zero/1.0/ |
| Chair | kenney-furniture-chair | `Models/GLTF format/chair.glb` | Furniture Kit 2.0 | Kenney | CC0 1.0 | kenney-furniture-chair.glb | 10.5 KB | 170 | https://kenney.nl/media/pages/assets/furniture-kit/440e0608a4-1677580847/kenney_furniture-kit.zip | https://creativecommons.org/publicdomain/zero/1.0/ |
| Table | kenney-furniture-table | `Models/GLTF format/table.glb` | Furniture Kit 2.0 | Kenney | CC0 1.0 | kenney-furniture-table.glb | 8.0 KB | 120 | https://kenney.nl/media/pages/assets/furniture-kit/440e0608a4-1677580847/kenney_furniture-kit.zip | https://creativecommons.org/publicdomain/zero/1.0/ |
| Potion bottle | kenney-dungeon-potion | `Models/GLB format/potion.glb` | Mini Dungeon 2.0 | Kenney | CC0 1.0 | kenney-dungeon-potion.glb | 23.2 KB | 120 | https://kenney.nl/media/pages/assets/mini-dungeon/6cd72dc849-1785314274/kenney_mini-dungeon.zip | https://creativecommons.org/publicdomain/zero/1.0/ |
| Rock | kenney-survival-rock | `Models/GLB format/rock-a.glb` | Survival Kit 2.0 | Kenney | CC0 1.0 | kenney-survival-rock.glb | 17.9 KB | 104 | https://kenney.nl/media/pages/assets/survival-kit/4065a8185b-1712149243/kenney_survival-kit.zip | https://creativecommons.org/publicdomain/zero/1.0/ |
| Tree | kenney-nature-tree | `Models/GLTF format/tree_default.glb` | Nature Kit 2.1 | Kenney | CC0 1.0 | kenney-nature-tree.glb | 9.2 KB | 114 | https://kenney.nl/media/pages/assets/nature-kit/37ac38a37b-1677698939/kenney_nature-kit.zip | https://creativecommons.org/publicdomain/zero/1.0/ |
| Tree (second option, pine) | kenney-survival-pine | `Models/GLB format/tree.glb` | Survival Kit 2.0 | Kenney | CC0 1.0 | kenney-survival-pine.glb | 29.0 KB | 226 | https://kenney.nl/media/pages/assets/survival-kit/4065a8185b-1712149243/kenney_survival-kit.zip | https://creativecommons.org/publicdomain/zero/1.0/ |
| Small house | kenney-suburban-house | `Models/GLB format/building-type-h.glb` | City Kit (Suburban) 2.0 | Kenney | CC0 1.0 | kenney-suburban-house.glb | 75.4 KB | 770 | https://kenney.nl/media/pages/assets/city-kit-suburban/2c871b7af2-1745479373/kenney_city-kit-suburban_20.zip | https://creativecommons.org/publicdomain/zero/1.0/ |
| Modular wall piece | kenney-town-wall | `Models/GLB format/wall-wood-detail-cross.glb` | Fantasy Town Kit 2.0 | Kenney | CC0 1.0 | kenney-town-wall.glb | 19.2 KB | 80 | https://kenney.nl/media/pages/assets/fantasy-town-kit/efe948d309-1754222374/kenney_fantasy-town-kit_2.0.zip | https://creativecommons.org/publicdomain/zero/1.0/ |
| Modular floor piece (second option) | kenney-survival-floor | `Models/GLB format/floor.glb` | Survival Kit 2.0 | Kenney | CC0 1.0 | kenney-survival-floor.glb | 17.1 KB | 84 | https://kenney.nl/media/pages/assets/survival-kit/4065a8185b-1712149243/kenney_survival-kit.zip | https://creativecommons.org/publicdomain/zero/1.0/ |
| Character | kenney-mini-character | `Models/GLB format/character-male-d.glb` | Mini Characters 1.0 | Kenney | CC0 1.0 | kenney-mini-character.glb | 247.5 KB | 711 | https://kenney.nl/media/pages/assets/mini-characters/bfc7e272b4-1774770718/kenney_mini-characters.zip | https://creativecommons.org/publicdomain/zero/1.0/ |
| Vehicle | kenney-car-sedan | `Models/GLB format/sedan.glb` | Car Kit 3.1 | Kenney | CC0 1.0 | kenney-car-sedan.glb | 180.3 KB | 2032 | https://kenney.nl/media/pages/assets/car-kit/1a312ec241-1775131960/kenney_car-kit.zip | https://creativecommons.org/publicdomain/zero/1.0/ |

The 16 model files come to 759 KB in all.

Some details that matter for exercises:

- The character is rigged. It has a seven-bone skeleton (root, two legs, torso, two arms, head)
  skinning a body mesh and a head mesh, and 32 animations including idle, walk, sprint, jump, sit
  and die. It stands with its arms out to the sides.
- The treasure chest is two objects, `chest` and `lid`, with `open`, `close` and `open-close`
  animations on the lid.
- The car is five objects: `body` and four separate wheels.
- The tree and the Furniture Kit pieces have no texture. Their colours are material base colours,
  and the tree's canopy comes out teal, as it does in Kenney's own previews.

## Packs

Every pack page shows a details table with a License row. On all ten it reads "Creative Commons
CC0", linked to https://creativecommons.org/publicdomain/zero/1.0/. Each page's description says
"Download this package (N assets) for free, CC0 licensed!", with the count given below. The
`License.txt` in each zip names the pack and version and says "License: (Creative Commons Zero,
CC0)" with the same deed URL.

| Pack | Page | Page wording | Licence file |
| --- | --- | --- | --- |
| Platformer Kit 4.1 | https://kenney.nl/assets/platformer-kit | License: Creative Commons CC0. "Download this package (150 assets) for free, CC0 licensed!" | `LICENSES/kenney-platformer-kit.txt` |
| Pirate Kit 2.1 | https://kenney.nl/assets/pirate-kit | License: Creative Commons CC0. "Download this package (70 assets) for free, CC0 licensed!" | `LICENSES/kenney-pirate-kit.txt` |
| Mini Dungeon 2.0 | https://kenney.nl/assets/mini-dungeon | License: Creative Commons CC0. "Download this package (30 assets) for free, CC0 licensed!" | `LICENSES/kenney-mini-dungeon.txt` |
| Furniture Kit 2.0 | https://kenney.nl/assets/furniture-kit | License: Creative Commons CC0. "Download this package (140 assets) for free, CC0 licensed!" | `LICENSES/kenney-furniture-kit.txt` |
| Survival Kit 2.0 | https://kenney.nl/assets/survival-kit | License: Creative Commons CC0. "Download this package (80 assets) for free, CC0 licensed!" | `LICENSES/kenney-survival-kit.txt` |
| Nature Kit 2.1 | https://kenney.nl/assets/nature-kit | License: Creative Commons CC0. "Download this package (330 assets) for free, CC0 licensed!" | `LICENSES/kenney-nature-kit.txt` |
| City Kit (Suburban) 2.0 | https://kenney.nl/assets/city-kit-suburban | License: Creative Commons CC0. "Download this package (40 assets) for free, CC0 licensed!" | `LICENSES/kenney-city-kit-suburban.txt` |
| Fantasy Town Kit 2.0 | https://kenney.nl/assets/fantasy-town-kit | License: Creative Commons CC0. "Download this package (160 assets) for free, CC0 licensed!" | `LICENSES/kenney-fantasy-town-kit.txt` |
| Mini Characters 1.0 | https://kenney.nl/assets/mini-characters | License: Creative Commons CC0. "Download this package (25 assets) for free, CC0 licensed!" | `LICENSES/kenney-mini-characters.txt` |
| Car Kit 3.1 | https://kenney.nl/assets/car-kit | License: Creative Commons CC0. "Download this package (45 assets) for free, CC0 licensed!" | `LICENSES/kenney-car-kit.txt` |

The newer packs' `License.txt` adds "You can use this content for personal, educational, and
commercial purposes." and "Support by crediting 'Kenney' or 'www.kenney.nl' (this is not a
requirement)". The two older ones (Furniture Kit and Nature Kit) say "This content is free to use in
personal, educational and commercial projects." and "Support us by crediting Kenney or
www.kenney.nl (this is not mandatory)". Credit is not required, but the app gives it anyway.

## Sources looked at and not used

Kenney had a CC0 model for every need, so nothing else was taken.

- Quaternius (quaternius.com). Its pack pages, such as Modular Weapons Pack and RPG Essentials Pack,
  still show "License CC0", but the site's licence page now shows the "Quaternius Asset License
  (QAL) v1.0", last updated 8/28/2026. It says "You just can't resell or redistribute the assets
  themselves as assets" and keeps ownership with Quaternius, and its section 7 says that changes
  apply to future releases only. The two pages disagree, so Quaternius models should not be listed
  as CC0 without checking each pack first.
- Poly Haven (polyhaven.com). Its models are CC0, but they are photoscanned and textured, which
  does not suit a course built on low-poly game assets.
- Poly Pizza (poly.pizza). It hosts many Kenney and Quaternius models with direct GLB downloads and
  shows each item's licence. It wasn't needed here because every pack came straight from Kenney.
