#!/usr/bin/env node

import assert from "node:assert/strict";
import { scorePicks } from "./update_qbiowc_leaderboard.mjs";

const data = {
  matchResults: {
    73: { home: "A", away: "B", homeScore: 2, awayScore: 1, winnerSide: "home", homeScorers: ["p1", "p2"], awayScorers: ["q1"] },
    75: { home: "C", away: "D", homeScore: 0, awayScore: 1, winnerSide: "away", homeScorers: [], awayScorers: ["d1"] },
    90: { home: "A", away: "D", homeScore: 1, awayScore: 0, winnerSide: "home", homeScorers: ["p1"], awayScorers: [] }
  }
};

const picks = {
  boostCountry: "D",
  matches: {
    73: { home: 2, away: 1, homeScorers: ["p1", "p2"], awayScorers: ["q1"] },
    75: { home: 0, away: 1, awayScorers: ["d1"] },
    90: { home: 1, away: 0, homeScorers: ["p1"] }
  }
};

assert.deepEqual(scorePicks(picks, data), { points: 22, exact: 3, result: 0, scorers: 5 });

const wrongPath = structuredClone(picks);
wrongPath.matches[75] = { home: 1, away: 0 };
assert.deepEqual(scorePicks(wrongPath, data), { points: 6, exact: 1, result: 0, scorers: 3 });

const nullScores = {
  boostCountry: "",
  matches: { 73: { home: null, away: null }, 75: { home: "", away: "" } }
};
assert.deepEqual(scorePicks(nullScores, data), { points: 0, exact: 0, result: 0, scorers: 0 });

console.log("scoring check passed");
