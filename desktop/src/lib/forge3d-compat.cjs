"use strict";

// What Dimensio keeps from Forge3D, its earlier name. Everything that reads a Forge3D name lives here or says so
// where it does, so the old names can be found and, one day, dropped.
//
// Environment: every variable is DIMENSIO_<NAME>, and Forge3D's FORGE3D_<NAME> is read when the new one is unset.

const PREFIX = "DIMENSIO_";
const LEGACY_PREFIX = "FORGE3D_";

// DIMENSIO_<name>, else FORGE3D_<name>; undefined when neither is set or both are empty.
function envSetting(name, env = process.env) {
  return env[PREFIX + name] || env[LEGACY_PREFIX + name] || undefined;
}

module.exports = { LEGACY_PREFIX, PREFIX, envSetting };
