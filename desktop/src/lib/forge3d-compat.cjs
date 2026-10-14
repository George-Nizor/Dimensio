"use strict";

// What Dimensio keeps from Forge3D, its earlier name. Everything that reads a Forge3D name lives here or says so
// where it does (project-store.cjs for .forge3d projects, runtime.cjs for the models Forge3D installed in WSL), so
// the old names can be found and, one day, dropped.
//
// Environment: every variable is DIMENSIO_<NAME>, and Forge3D's FORGE3D_<NAME> is read when the new one is unset.
//
// Folders:
//   %LOCALAPPDATA%\Instrumenta\Dimensio   local state: config\, the Godot review project, untitled projects
//                                         (Forge3D's was %LOCALAPPDATA%\Instrumenta\Forge3D)
//   %APPDATA%\Dimensio                    Electron's user data, named after the app: course.json, page storage
//                                         (Forge3D's was %APPDATA%\Forge3D)
//   Documents\Dimensio\Projects           where new projects are saved (Forge3D's Documents\Forge3D\Projects stay
//                                         where they are and open from the recent list)
//   Documents\Forge3D\runs                Forge3D's run library from before projects, adopted as "Earlier runs"
//
// On the first start, the settings Forge3D kept are copied across (carryForge3DSettings). Nothing of Forge3D's is
// ever moved, renamed or deleted, so Forge3D's folders stay as they were.

const nodeFs = require("node:fs");
const path = require("node:path");

const PREFIX = "DIMENSIO_";
const LEGACY_PREFIX = "FORGE3D_";
const LEGACY_NAME = "Forge3D";

// DIMENSIO_<name>, else FORGE3D_<name>; undefined when neither is set or both are empty.
function envSetting(name, env = process.env) {
  return env[PREFIX + name] || env[LEGACY_PREFIX + name] || undefined;
}

// Forge3D's folders, beside Dimensio's.
function legacyFolders({ localAppData, appData, documents }) {
  return {
    stateRoot: path.join(localAppData, "Instrumenta", LEGACY_NAME),
    userData: path.join(appData, LEGACY_NAME),
    library: path.join(documents, LEGACY_NAME),
  };
}

// The files Forge3D kept that Dimensio reads, by where they live.
const CARRIED_FILES = Object.freeze([
  // The agent the Workshop drives.
  Object.freeze({ root: "stateRoot", file: ["config", "settings.json"] }),
  // Recent projects, "Reopen the last project", and whether Documents\Forge3D was already adopted.
  Object.freeze({ root: "stateRoot", file: ["config", "recent-projects.json"] }),
  // The Blender path and course folder chosen in the course app.
  Object.freeze({ root: "userData", file: ["course.json"] }),
]);

// Copies each file above from Forge3D's folders into Dimensio's when Dimensio has none of its own, which is the case
// on its first start. Returns the files it copied. A file it cannot read or copy is left for Dimensio to start
// without; the originals are never changed.
function carryForge3DSettings({ from, to, fs = nodeFs }) {
  const carried = [];
  for (const { root, file } of CARRIED_FILES) {
    if (!from?.[root] || !to?.[root] || path.resolve(from[root]) === path.resolve(to[root])) continue;
    const source = path.join(from[root], ...file);
    const target = path.join(to[root], ...file);
    try {
      if (fs.existsSync(target) || !fs.existsSync(source) || !fs.statSync(source).isFile()) continue;
      JSON.parse(fs.readFileSync(source, "utf8")); // a damaged file is not carried
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL);
      carried.push(target);
    } catch {
      /* Dimensio starts without it */
    }
  }
  return carried;
}

module.exports = { CARRIED_FILES, LEGACY_NAME, LEGACY_PREFIX, PREFIX, carryForge3DSettings, envSetting, legacyFolders };
