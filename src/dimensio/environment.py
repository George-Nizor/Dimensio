"""Settings Dimensio reads from the environment, and the names Forge3D used.

Every variable is DIMENSIO_<NAME>. Forge3D, the app's earlier name, read FORGE3D_<NAME>, and that
name is still read when the new one is unset, so a machine set up for Forge3D keeps working.

The same goes for two places Forge3D left on disk inside WSL: the local models live in
~/.local/share/dimensio/models, unless that folder is absent and Forge3D's
~/.local/share/forge3d/models is there, and a finished install is marked by
.dimensio-install-complete or Forge3D's .forge3d-install-complete. Nothing is moved or renamed.
"""

from __future__ import annotations

import os
from typing import Mapping

PREFIX = "DIMENSIO_"
LEGACY_PREFIX = "FORGE3D_"

MODELS_SUBDIR = ".local/share/dimensio/models"
LEGACY_MODELS_SUBDIR = ".local/share/forge3d/models"
INSTALL_MARKER = ".dimensio-install-complete"
LEGACY_INSTALL_MARKER = ".forge3d-install-complete"

# For a POSIX shell in WSL: sets $root to the models folder, Forge3D's when only that one exists.
MODELS_ROOT_SHELL = (
    f'root="$HOME/{MODELS_SUBDIR}"; '
    f'[ -d "$root" ] || [ ! -d "$HOME/{LEGACY_MODELS_SUBDIR}" ] || root="$HOME/{LEGACY_MODELS_SUBDIR}"'
)


def setting(name: str, environ: Mapping[str, str] | None = None) -> str | None:
    """DIMENSIO_<name>, else FORGE3D_<name>; None when neither is set or both are empty."""
    environ = os.environ if environ is None else environ
    return environ.get(PREFIX + name) or environ.get(LEGACY_PREFIX + name) or None
