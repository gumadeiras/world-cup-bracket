const baseMatches = {
  73: [1, 0], 74: [1, 2], 75: [2, 0], 76: [2, 1],
  77: [3, 1], 78: [1, 0], 79: [2, 0], 80: [0, 1],
  81: [2, 1], 82: [1, 2], 83: [0, 1], 84: [2, 0],
  85: [2, 1], 86: [1, 0], 87: [1, 2], 88: [2, 0],
  89: [1, 2], 90: [2, 1], 91: [1, 0], 92: [2, 0],
  93: [0, 2], 94: [2, 1], 95: [2, 0], 96: [1, 2],
  97: [1, 3], 98: [2, 1], 99: [1, 2], 100: [2, 0],
  101: [1, 2], 102: [2, 1], 103: [1, 0], 104: [2, 1]
};

const fakeConfigs = {
  "GAL4 Madrid": {
    boostCountry: "Spain",
    overrides: { 84: [3, 1], 93: [1, 2], 98: [2, 0], 101: [0, 1], 104: [2, 0] }
  },
  "VAR in shambles": {
    boostCountry: "Spain",
    overrides: { 84: [1, 0], 93: [2, 3], 98: [1, 0], 101: [1, 2], 104: [3, 2] }
  },
  "Knockout coli": {
    boostCountry: "Mexico",
    overrides: { 92: [1, 0], 93: [0, 2], 99: [0, 2], 104: [1, 2] }
  },
  "NFL > soccer": {
    boostCountry: "United States",
    overrides: { 94: [1, 0], 98: [1, 2], 101: [1, 3], 104: [2, 0] }
  }
};

function buildFakePick(bracketName, config) {
  const matches = Object.fromEntries(Object.entries(baseMatches).map(([id, score]) => [
    id,
    { home: score[0], away: score[1] }
  ]));
  for (const [id, score] of Object.entries(config.overrides)) {
    matches[id] = { home: score[0], away: score[1] };
  }
  return { name: "fake seed", bracketName, email: "", boostCountry: config.boostCountry, matches };
}

export const fakePicks = Object.fromEntries(Object.entries(fakeConfigs).map(([name, config]) => [
  name,
  buildFakePick(name, config)
]));
