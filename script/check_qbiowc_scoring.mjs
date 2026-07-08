#!/usr/bin/env node

import assert from "node:assert/strict";
import { mergeCompletedPicks, sanitizePicks, scorePicks, scorePicksDetailed, scoreRows } from "./update_qbiowc_leaderboard.mjs";

const data = {
  matchResults: {
    73: { date: "2026-06-28T19:00Z", home: "A", away: "B", homeScore: 2, awayScore: 1, winnerSide: "home", homeScorers: ["p1", "p2"], awayScorers: ["q1"] },
    75: { date: "2026-06-30T01:00Z", home: "C", away: "D", homeScore: 0, awayScore: 1, winnerSide: "away", homeScorers: [], awayScorers: ["d1"] },
    90: { date: "2026-07-04T17:00Z", home: "A", away: "D", homeScore: 1, awayScore: 0, winnerSide: "home", homeScorers: ["p1"], awayScorers: [] }
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

const updatedKnownMatchup = structuredClone(wrongPath);
updatedKnownMatchup.matchSubmittedAt = { 90: Date.parse("2026-07-03T12:00Z") };
assert.deepEqual(scorePicks(updatedKnownMatchup, data), { points: 14, exact: 2, result: 0, scorers: 4 });

const nullScores = {
  boostCountry: "",
  matches: { 73: { home: null, away: null }, 75: { home: "", away: "" } }
};
assert.deepEqual(scorePicks(nullScores, data), { points: 0, exact: 0, result: 0, scorers: 0 });

const overlongScorers = { boostCountry: "", matches: { 74: { home: 0, away: 1, homeScorers: ["hidden"], awayScorers: ["q1", "extra"] } } };
const overlongData = { matchResults: { 74: { home: "A", away: "B", homeScore: 0, awayScore: 1, winnerSide: "away", homeScorers: ["hidden"], awayScorers: ["q1"] } } };
assert.deepEqual(sanitizePicks(overlongScorers).matches[74], { home: 0, away: 1, advance: "", homeScorers: [], awayScorers: ["q1"] });
assert.deepEqual(scorePicks(overlongScorers, overlongData), { points: 4, exact: 1, result: 0, scorers: 1 });

const fundingData = {
  matchResults: {
    89: { date: "2026-07-04T21:00Z", home: "A", away: "B", homeScore: 1, awayScore: 0, winnerSide: "home", homeScorers: ["p1"], awayScorers: [] },
    90: { date: "2026-07-04T17:00Z", home: "C", away: "D", homeScore: 0, awayScore: 1, winnerSide: "away", homeScorers: [], awayScorers: ["d1"] },
    91: { date: "2026-07-05T20:00Z", home: "E", away: "F", homeScore: 1, awayScore: 0, winnerSide: "home", homeScorers: [], awayScorers: [] },
    92: { date: "2026-07-06T00:00Z", home: "G", away: "H", homeScore: 1, awayScore: 0, winnerSide: "home", homeScorers: [], awayScorers: [] },
    93: { date: "2026-07-06T19:00Z", home: "I", away: "J", homeScore: 1, awayScore: 0, winnerSide: "home", homeScorers: [], awayScorers: [] },
    94: { date: "2026-07-07T00:00Z", home: "K", away: "L", homeScore: 1, awayScore: 0, winnerSide: "home", homeScorers: [], awayScorers: [] },
    95: { date: "2026-07-07T16:00Z", home: "M", away: "N", homeScore: 1, awayScore: 0, winnerSide: "home", homeScorers: [], awayScorers: [] },
    96: { date: "2026-07-07T20:00Z", home: "O", away: "P", homeScore: 1, awayScore: 0, winnerSide: "home", homeScorers: [], awayScorers: [] },
    97: { date: "2026-07-09T20:00Z", home: "A", away: "D", homeScore: 1, awayScore: 0, winnerSide: "home", homeScorers: ["p1"], awayScorers: [] }
  }
};
const fundingPicks = {
  boostCountry: "",
  emergencyFunding: { matchId: "97", team: "A" },
  matchSubmittedAt: { 97: Date.parse("2026-07-05T04:30Z") },
  matches: {
    97: { home: 1, away: 0, homeScorers: ["p1"], awayScorers: [] }
  }
};
const fundingScore = scorePicksDetailed(fundingPicks, fundingData, {
  emergencyEligible: true,
  emergencyUnderdogs: { 97: "A" }
});
assert.deepEqual(fundingScore.total, { points: 13, exact: 1, result: 0, scorers: 1 });
assert.deepEqual(fundingScore.matches[0].emergencyFunding, 1);
assert.deepEqual(fundingScore.matches[0].emergencyBonus, 5);

assert.deepEqual(scorePicksDetailed({ ...fundingPicks, boostCountry: "A" }, fundingData, {
  emergencyEligible: true,
  emergencyBoostStacks: false,
  emergencyUnderdogs: { 97: "A" }
}).total, { points: 13, exact: 1, result: 0, scorers: 1 });
assert.deepEqual(scorePicksDetailed({ ...fundingPicks, boostCountry: "A" }, fundingData, {
  emergencyEligible: true,
  emergencyBoostStacks: true,
  emergencyUnderdogs: { 97: "A" }
}).total, { points: 21, exact: 1, result: 0, scorers: 1 });

const rowsForFunding = [
  { key: "a", base: { bracketName: "a leader" }, picks: { matches: {} } },
  { key: "b", base: { bracketName: "b leader" }, picks: { matches: {} } },
  { key: "z", base: { bracketName: "z funding" }, picks: fundingPicks }
];
const gatedFundingData = structuredClone(fundingData);
delete gatedFundingData.matchResults[96];
assert.equal(scoreRows(rowsForFunding, gatedFundingData).find((row) => row.bracketName === "z funding").points, 4);
assert.equal(scoreRows(rowsForFunding, fundingData).find((row) => row.bracketName === "z funding").points, 10);

const tierData = structuredClone(fundingData);
const priorIds = Array.from({ length: 9 }, (_, index) => String(73 + index));
for (const id of priorIds) {
  tierData.matchResults[id] = {
    date: "2026-06-28T19:00Z",
    home: `H${id}`,
    away: `A${id}`,
    homeScore: 1,
    awayScore: 0,
    winnerSide: "home",
    homeScorers: [`s${id}`],
    awayScorers: []
  };
}

function fundedTierRow(key, bracketName, priorCount) {
  return {
    key,
    base: { bracketName },
    picks: {
      ...fundingPicks,
      boostCountry: "A",
      matches: {
        ...Object.fromEntries(priorIds.slice(0, priorCount).map((id) => [id, {
          home: 1,
          away: 0,
          homeScorers: [`s${id}`],
          awayScorers: []
        }])),
        ...fundingPicks.matches
      }
    }
  };
}

const edgeRow = fundedTierRow("edge", "edge bracket", 8);
edgeRow.picks.matches[81] = { home: 2, away: 0, homeScorers: [], awayScorers: [] };

const tierScores = scoreRows([
  fundedTierRow("top", "top bracket", 9),
  edgeRow,
  fundedTierRow("middle", "middle bracket", 7),
  fundedTierRow("bottom", "bottom bracket", 5)
], tierData);
const top = tierScores.find((row) => row.bracketName === "top bracket");
const edge = tierScores.find((row) => row.bracketName === "edge bracket");
const middle = tierScores.find((row) => row.bracketName === "middle bracket");
const bottom = tierScores.find((row) => row.bracketName === "bottom bracket");
const match97 = (row) => row.matchBreakdown.find((match) => match.id === "97");

assert.equal(top.points, 44);
assert.equal(match97(top).points, 8);
assert.equal(match97(top).emergencyFunding, undefined);
assert.equal(edge.points, 43);
assert.equal(match97(edge).points, 10);
assert.equal(match97(edge).multiplier, 1);
assert.equal(match97(edge).emergencyFunding, 1);
assert.equal(middle.points, 38);
assert.equal(match97(middle).points, 10);
assert.equal(match97(middle).multiplier, 1);
assert.equal(match97(middle).emergencyFunding, 1);
assert.equal(bottom.points, 38);
assert.equal(match97(bottom).points, 18);
assert.equal(match97(bottom).multiplier, 2);
assert.equal(match97(bottom).emergencyFunding, 1);

assert.deepEqual(
  mergeCompletedPicks(
    { matches: { 73: { home: 2, away: 1 }, 74: { home: 1, away: 0 } } },
    { matches: { 73: { home: null, away: null }, 74: { home: 2, away: 0 } } },
    new Set(["73"])
  ).matches,
  { 73: { home: 2, away: 1 }, 74: { home: 2, away: 0 } }
);

console.log("scoring check passed");
