#!/usr/bin/env node

import assert from "node:assert/strict";
import { applyPublishedScoringOverrides, averageQBioPicks, mergeSubmittedPicks, sanitizePicks, scorePicks, scorePicksDetailed, scoreRows } from "./update_qbiowc_leaderboard.mjs";

const data = {
  matchResults: {
    73: { date: "2026-06-28T19:00Z", home: "A", away: "B", homeScore: 2, awayScore: 1, winnerSide: "home", homeScorers: ["p1", "p2"], awayScorers: ["q1"], homeScorerTimes: ["30'", "60'"], awayScorerTimes: ["45'"] },
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
updatedKnownMatchup.matchSubmittedAt = {
  73: Date.parse("2026-06-27T12:00Z"),
  75: Date.parse("2026-06-29T12:00Z"),
  90: Date.parse("2026-07-03T12:00Z")
};
assert.deepEqual(scorePicks(updatedKnownMatchup, data), { points: 14, exact: 2, result: 0, scorers: 4 });

const gracePick = { matchSubmittedAt: { 73: Date.parse("2026-06-28T19:00:47Z") }, matches: { 73: picks.matches[73] } };
assert.deepEqual(scorePicks(gracePick, data), { points: 6, exact: 1, result: 0, scorers: 3 });
const latePick = { matchSubmittedAt: { 73: Date.parse("2026-06-28T19:10:00Z") }, matches: { 73: picks.matches[73] } };
assert.deepEqual(scorePicks(latePick, data), { points: 0, exact: 0, result: 0, scorers: 0 });
assert.deepEqual(scorePicks({ ...latePick, kickoffExceptions: ["73"] }, data), { points: 6, exact: 1, result: 0, scorers: 3 });
const earlyGoalData = structuredClone(data);
earlyGoalData.matchResults[73].homeScorerTimes = ["3'"];
assert.deepEqual(scorePicks({ matchSubmittedAt: { 73: Date.parse("2026-06-28T19:03:00Z") }, matches: { 73: picks.matches[73] } }, earlyGoalData), { points: 0, exact: 0, result: 0, scorers: 0 });
assert.deepEqual(scorePicks({ matchSubmittedAt: { 73: Date.parse("2026-06-28T19:02:59Z") }, matches: { 73: picks.matches[73] } }, earlyGoalData), { points: 6, exact: 1, result: 0, scorers: 3 });

const nullScores = {
  boostCountry: "",
  matches: { 73: { home: null, away: null }, 75: { home: "", away: "" } }
};
assert.deepEqual(scorePicks(nullScores, data), { points: 0, exact: 0, result: 0, scorers: 0 });

const overlongScorers = { boostCountry: "", matches: { 74: { home: 0, away: 1, homeScorers: ["hidden"], awayScorers: ["q1", "extra"] } } };
const overlongData = { matchResults: { 74: { home: "A", away: "B", homeScore: 0, awayScore: 1, winnerSide: "away", homeScorers: ["hidden"], awayScorers: ["q1"] } } };
assert.deepEqual(sanitizePicks(overlongScorers).matches[74], { home: 0, away: 1, advance: "", homeScorers: [], awayScorers: ["q1"] });
assert.deepEqual(scorePicks(overlongScorers, overlongData), { points: 4, exact: 1, result: 0, scorers: 1 });

const average = averageQBioPicks([
  { picks: { boostCountry: "A", matches: { 73: { home: 3, away: 1, homeScorers: ["star", "star", "other"], awayScorers: ["away"] }, 74: { home: 1, away: 1, advance: "away" } } } },
  { picks: { boostCountry: "A", matches: { 73: { home: 3, away: 1, homeScorers: ["star", "second", "third"], awayScorers: ["away"] }, 74: { home: 1, away: 1, advance: "away" } } } },
  { picks: { boostCountry: "B", matches: { 73: { home: 2, away: 1, homeScorers: ["star", "second"], awayScorers: ["away"] }, 74: { home: 1, away: 1, advance: "home" } } } }
]);
assert.equal(average.boostCountry, "A");
assert.deepEqual(average.matches[73], { home: 3, away: 1, advance: "", homeScorers: ["star", "second", "other"], awayScorers: ["away"] });
assert.equal(average.matches[74].advance, "away");

const switchedBoost = structuredClone(picks);
switchedBoost.boostCountry = "A";
switchedBoost.matchBoostCountry = { 73: "A", 75: "D", 90: "A" };
assert.deepEqual(scorePicks(switchedBoost, data), { points: 28, exact: 3, result: 0, scorers: 5 });
assert.deepEqual(applyPublishedScoringOverrides("ComeOnEngland", { matchBoostCountry: { 89: "France" } }).matchBoostCountry, { 77: "France", 89: "France" });
assert.deepEqual(applyPublishedScoringOverrides("+ Swiss Neutrality On Top", {}).matchBoostCountry, { 84: "Spain", 87: "Spain", 93: "Spain" });

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
}).total, { points: 26, exact: 1, result: 0, scorers: 1 });

const stackedShootoutData = structuredClone(fundingData);
stackedShootoutData.matchResults[97].homeScore = 1;
stackedShootoutData.matchResults[97].awayScore = 1;
stackedShootoutData.matchResults[97].homeShootoutScore = 4;
stackedShootoutData.matchResults[97].awayShootoutScore = 3;
const stackedShootoutPicks = structuredClone(fundingPicks);
stackedShootoutPicks.boostCountry = "A";
stackedShootoutPicks.matches[97] = { home: 1, away: 1, advance: "home", homeScorers: ["p1"], awayScorers: [] };
assert.equal(scorePicksDetailed(stackedShootoutPicks, stackedShootoutData, {
  emergencyEligible: true,
  emergencyBoostStacks: true,
  emergencyUnderdogs: { 97: "A" }
}).total.points, 30);

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
      matchSubmittedAt: {
        ...fundingPicks.matchSubmittedAt,
        ...Object.fromEntries(priorIds.slice(0, priorCount).map((id) => [id, Date.parse("2026-06-28T18:00Z")]))
      },
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
edgeRow.picks.matchSubmittedAt[81] = Date.parse("2026-06-28T18:00Z");

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
assert.equal(edge.points, 41);
assert.equal(match97(edge).points, 8);
assert.equal(match97(edge).multiplier, 2);
assert.equal(match97(edge).emergencyFunding, undefined);
assert.equal(middle.points, 38);
assert.equal(match97(middle).points, 10);
assert.equal(match97(middle).multiplier, 1);
assert.equal(match97(middle).emergencyFunding, 1);
assert.equal(bottom.points, 40);
assert.equal(match97(bottom).points, 20);
assert.equal(match97(bottom).multiplier, 2);
assert.equal(match97(bottom).emergencyFunding, 1);

assert.deepEqual(
  mergeSubmittedPicks(
    { boostCountry: "A", matches: { 73: { home: 2, away: 1 }, 74: { home: 1, away: 0 } }, matchSubmittedAt: { 73: 1, 74: 1 }, matchBoostCountry: { 73: "A", 74: "A" } },
    { boostCountry: "B", matches: { 73: { home: null, away: null }, 74: { home: 2, away: 0 } }, matchSubmittedAt: { 74: 20 }, matchBoostCountry: { 74: "B" } },
    new Map([["73", 10], ["74", 30]]),
    20
  ).matches,
  { 73: { home: 2, away: 1 }, 74: { home: 2, away: 0 } }
);

const mergedSubmission = mergeSubmittedPicks(
  { boostCountry: "A", matches: { 73: { home: 2, away: 1 } }, matchSubmittedAt: { 73: 1 }, matchBoostCountry: { 73: "A" } },
  { boostCountry: "B", matches: { 73: { home: 9, away: 0 }, 74: { home: 1, away: 0 } }, matchSubmittedAt: { 73: 20, 74: 20 }, matchBoostCountry: { 73: "B", 74: "B" } },
  new Map([["73", 10], ["74", 30]]),
  20
);
assert.equal(mergedSubmission.boostCountry, "B");
assert.deepEqual(mergedSubmission.matches[73], { home: 2, away: 1 });
assert.deepEqual(mergedSubmission.matches[74], { home: 1, away: 0 });
assert.equal(mergedSubmission.matchBoostCountry[73], "A");
assert.equal(mergedSubmission.matchBoostCountry[74], "B");
assert.equal(mergeSubmittedPicks({}, { boostCountry: "A", matches: { 73: { home: 9, away: 0 } }, matchSubmittedAt: { 73: 161000 } }, new Map([["73", 100000]]), 161000).matches[73], undefined);
assert.deepEqual(
  mergeSubmittedPicks(
    {},
    { boostCountry: "A", matches: { 73: { home: 1, away: 0 } }, matchSubmittedAt: { 73: 147000 }, matchBoostCountry: { 73: "A" } },
    new Map([["73", 160000]]),
    147000
  ).matches[73],
  { home: 1, away: 0 }
);
assert.deepEqual(
  mergeSubmittedPicks(
    {},
    { matches: { 73: { home: 1, away: 0 } }, matchSubmittedAt: { 73: 200000 } },
    new Map([["73", 160000]]),
    200000,
    new Set(["73"])
  ).matches[73],
  { home: 1, away: 0 }
);
assert.deepEqual(
  mergeSubmittedPicks(
    { matches: { 73: { home: 1, away: 0 } }, matchSubmittedAt: { 73: 90000 }, matchBoostCountry: { 73: "A" } },
    { matches: { 73: { home: 9, away: 0 } }, matchSubmittedAt: { 73: 130000 }, matchBoostCountry: { 73: "B" } },
    new Map([["73", 160000]]),
    130000
  ).matches[73],
  { home: 9, away: 0 }
);
assert.deepEqual(
  mergeSubmittedPicks(
    { matches: { 74: { home: 1, away: 0 } }, matchSubmittedAt: { 74: 1 }, matchBoostCountry: { 74: "A" } },
    { matches: { 74: { home: null, away: null } } },
    new Map([["74", 30]]),
    20
  ).matches[74],
  { home: 1, away: 0 }
);

console.log("scoring check passed");
