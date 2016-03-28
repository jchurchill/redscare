export const roles = Object.freeze({
  GOOD_NORMAL:  Object.freeze({ name: "good_normal",  good: true  }),
  EVIL_NORMAL:  Object.freeze({ name: "evil_normal",  good: false }),
  SEER:         Object.freeze({ name: "seer",         good: true  }),
  SEER_KNOWER:  Object.freeze({ name: "seer_knower",  good: true  }),
  FALSE_SEER:   Object.freeze({ name: "false_seer",   good: false }),
  ROGUE_EVIL:   Object.freeze({ name: "rogue_evil",   good: false }),
  EVIL_MASTER:  Object.freeze({ name: "evil_master",  good: false }),
  ASSASSIN:     Object.freeze({ name: "assassin",     good: false }),
});

// Lookup info about a role by its value
const roleLookup =
  Object.keys(roles).reduce((lookup, key) => {
    const r = roles[key];
    lookup[r.name] = r;
    return lookup;
  }, {});

export function isRoleGood(role) {
  if (!roleLookup.hasOwnProperty(role)) { return; }
  return roleLookup[role].good;
}

export function isRoleEvil(role) {
  if (!roleLookup.hasOwnProperty(role)) { return; }
  return !roleLookup[role].good;
}

const evilRoleCounts = { 5: 2, 6: 2, 7: 3, 8: 3, 9: 3, 10: 4 };
export function getEvilRoleCount(playerCount) {
  return evilRoleCounts[playerCount];
}


const roundMissionProperties = {
  // playerCount => [(operativeCount),(requiredFailCount)] for each round, in order
  5:  [[2,1],[3,1],[2,1],[3,1],[3,1]],
  6:  [[2,1],[3,1],[4,1],[3,1],[4,1]],
  7:  [[2,1],[3,1],[3,1],[4,2],[4,1]],
  8:  [[3,1],[4,1],[4,1],[5,2],[5,1]],
  9:  [[3,1],[4,1],[4,1],[5,2],[5,1]],
  10: [[3,1],[4,1],[4,1],[5,2],[5,1]],
}
export function getRoundMissionInfo(roundNumber, gamePlayerCount) {
  const props = roundMissionProperties[gamePlayerCount][roundNumber-1];
  return { operativeCount: props[0], requiredFailCount: props[1] };
};