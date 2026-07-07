#!/usr/bin/env node

import fs from "node:fs";
import { fakePicks } from "./fake_qbiowc_picks.mjs";

const dataPath = "data.js";
const prefix = "window.QBIOWC_DATA=";
const sheetCsv = process.env.QBIOWC_SHEET_CSV || "";
const ignoredEmails = new Set((process.env.QBIOWC_IGNORED_EMAILS || "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean));
const removedBracketNames = new Set(["Assay Madrid"]);
const firstRoundIds = new Set(Array.from({ length: 16 }, (_, index) => String(index + 73)));
const roundOf16Ids = ["89", "90", "91", "92", "93", "94", "95", "96"];
const quarterfinalIds = new Set(["97", "98", "99", "100"]);
const rescueCutoffId = 97;
const rounds = [
  [[73, "2A", "2B"], [74, "1E", "3A/B/C/D/F"], [75, "1F", "2C"], [76, "1C", "2F"], [77, "1I", "3C/D/F/G/H"], [78, "2E", "2I"], [79, "1A", "3C/E/F/H/I"], [80, "1L", "3E/H/I/J/K"], [81, "1D", "3B/E/F/I/J"], [82, "1G", "3A/E/H/I/J"], [83, "2K", "2L"], [84, "1H", "2J"], [85, "1B", "3E/F/G/I/J"], [86, "1J", "2H"], [87, "1K", "3D/E/I/J/L"], [88, "2D", "2G"]],
  [[89, "W74", "W77"], [90, "W73", "W75"], [91, "W76", "W78"], [92, "W79", "W80"], [93, "W83", "W84"], [94, "W81", "W82"], [95, "W86", "W88"], [96, "W85", "W87"]],
  [[97, "W89", "W90"], [98, "W93", "W94"], [99, "W91", "W92"], [100, "W95", "W96"]],
  [[101, "W97", "W98"], [102, "W99", "W100"]],
  [[103, "L101", "L102"]],
  [[104, "W101", "W102"]]
];
const matchesById = new Map(rounds.flat().map((match) => [String(match[0]), match]));

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

function readData() {
  const text = fs.readFileSync(dataPath, "utf8").trim();
  if (!text.startsWith(prefix) || !text.endsWith(";")) throw new Error(`Unexpected ${dataPath} shape`);
  return JSON.parse(text.slice(prefix.length, -1));
}

function writeData(data) {
  fs.writeFileSync(dataPath, `${prefix}${JSON.stringify(data)};\n`);
}

function rowObject(headers, row) {
  return Object.fromEntries(headers.map((header, index) => [header.trim().toLowerCase(), row[index] || ""]));
}

function timestamp() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York"
  }).formatToParts(new Date()).map((part) => [part.type, part.value]));
  return `${parts.month} ${parts.day}, ${parts.year} · ${parts.hour}:${parts.minute} ${parts.dayPeriod}`;
}

function blankScore() {
  return { points: 0, exact: 0, result: 0, scorers: 0 };
}

function matchWinnerSide(match) {
  if (!hasScore(match.home) || !hasScore(match.away)) return "";
  const home = Number(match.home);
  const away = Number(match.away);
  if (home > away) return "home";
  if (away > home) return "away";
  return match.advance || "";
}

function hasScore(value) {
  return value !== "" && value != null && Number.isFinite(Number(value));
}

function countScorers(predicted = [], actual = []) {
  const remaining = new Map();
  for (const name of actual.filter(Boolean)) {
    remaining.set(name, (remaining.get(name) || 0) + 1);
  }
  let hits = 0;
  for (const name of predicted.filter(Boolean)) {
    const count = remaining.get(name) || 0;
    if (!count) continue;
    remaining.set(name, count - 1);
    hits++;
  }
  return hits;
}

function parseSubmissionTime(value) {
  const match = /^(\d+)\/(\d+)\/(\d+) (\d+):(\d+):(\d+)$/.exec(value || "");
  if (match) {
    const [, month, day, year, hour, minute, second] = match.map(Number);
    return Date.UTC(year, month - 1, day, hour + 4, minute, second);
  }
  const fallback = Date.parse(value || "");
  return Number.isFinite(fallback) ? fallback : null;
}

function stampSubmittedMatches(picks, submittedAt) {
  if (!submittedAt) return picks;
  const matchSubmittedAt = { ...(picks.matchSubmittedAt || {}) };
  for (const [id, match] of Object.entries(picks.matches || {})) {
    if (hasCompleteScore(match)) matchSubmittedAt[id] = submittedAt;
  }
  return { ...picks, matchSubmittedAt };
}

export function scorePicks(picks, data) {
  return scorePicksDetailed(picks, data).total;
}

export function scorePicksDetailed(picks, data, options = {}) {
  picks = sanitizePicks(picks || {});
  const actualRaw = data.matchResults || {};
  const actualCache = new Map();
  const predictedCache = new Map();

  function actualTeamFromSlot(slot) {
    const [, kind, id] = /^([WL])(\d+)$/.exec(slot) || [];
    if (!kind) return null;
    const match = actualMatch(id);
    if (!match?.winnerSide) return null;
    const winner = match.winnerSide === "home" ? match.home : match.away;
    const loser = match.winnerSide === "home" ? match.away : match.home;
    return kind === "W" ? winner : loser;
  }

  function actualMatch(id) {
    id = String(id);
    if (actualCache.has(id)) return actualCache.get(id);
    const raw = actualRaw[id];
    if (!raw) return null;
    if (firstRoundIds.has(id)) {
      actualCache.set(id, raw);
      return raw;
    }
    const match = matchesById.get(id);
    const expectedHome = actualTeamFromSlot(match?.[1] || "");
    const expectedAway = actualTeamFromSlot(match?.[2] || "");
    if (raw.home === expectedAway && raw.away === expectedHome) {
      const swapped = {
        ...raw,
        home: raw.away,
        away: raw.home,
        homeScore: raw.awayScore,
        awayScore: raw.homeScore,
        homeScorers: raw.awayScorers,
        awayScorers: raw.homeScorers,
        winnerSide: raw.winnerSide === "home" ? "away" : raw.winnerSide === "away" ? "home" : ""
      };
      actualCache.set(id, swapped);
      return swapped;
    }
    actualCache.set(id, raw);
    return raw;
  }

  function actualKnownBefore(upstreamId, targetId) {
    const submittedAt = Number(picks.matchSubmittedAt?.[targetId]);
    const kickoffAt = Date.parse(actualRaw[upstreamId]?.date || "");
    return Number.isFinite(submittedAt) && Number.isFinite(kickoffAt) && submittedAt >= kickoffAt + 3 * 60 * 60 * 1000;
  }

  function predictedTeamFromSlot(slot, targetId) {
    const [, kind, id] = /^([WL])(\d+)$/.exec(slot) || [];
    if (!kind) return null;
    if (actualKnownBefore(id, targetId)) return actualTeamFromSlot(slot);
    const teams = predictedTeams(id, targetId);
    const pick = picks.matches?.[id];
    const side = pick ? matchWinnerSide(pick) : "";
    if (!teams || !side) return null;
    const winner = side === "home" ? teams.home : teams.away;
    const loser = side === "home" ? teams.away : teams.home;
    return kind === "W" ? winner : loser;
  }

  function predictedTeams(id, targetId = id) {
    id = String(id);
    targetId = String(targetId);
    const cacheKey = `${targetId}:${id}`;
    if (predictedCache.has(cacheKey)) return predictedCache.get(cacheKey);
    if (firstRoundIds.has(id)) {
      const actual = actualMatch(id);
      const teams = actual ? { home: actual.home, away: actual.away } : null;
      predictedCache.set(cacheKey, teams);
      return teams;
    }
    const match = matchesById.get(id);
    const teams = match ? { home: predictedTeamFromSlot(match[1], targetId), away: predictedTeamFromSlot(match[2], targetId) } : null;
    predictedCache.set(cacheKey, teams?.home && teams?.away ? teams : null);
    return predictedCache.get(cacheKey);
  }

  const total = blankScore();
  const matches = [];
  for (const id of Object.keys(actualRaw)) {
    const actual = actualMatch(id);
    const predicted = predictedTeams(id);
    const pick = picks.matches?.[id];
    if (!actual || !predicted || !pick || predicted.home !== actual.home || predicted.away !== actual.away) continue;
    if (!hasScore(pick.home) || !hasScore(pick.away)) continue;

    const exact = Number(pick.home) === actual.homeScore && Number(pick.away) === actual.awayScore;
    const result = !exact && matchWinnerSide(pick) === actual.winnerSide;
    const scorers = Math.min(3,
      countScorers(pick.homeScorers, actual.homeScorers) +
      countScorers(pick.awayScorers, actual.awayScorers)
    );
    const multiplier = [actual.home, actual.away].includes(picks.boostCountry) ? 2 : 1;
    const basePoints = ((exact ? 3 : result ? 1 : 0) + scorers) * multiplier;
    const rescue = picks.emergencyFunding || {};
    const winnerName = actual.winnerSide === "home" ? actual.home : actual.winnerSide === "away" ? actual.away : "";
    const rescueActive = options.emergencyEligible && rescue.matchId === id && quarterfinalIds.has(id);
    const rescueTeamWon = rescueActive && rescue.team && rescue.team === winnerName;
    const rescueBonus = rescueActive
      ? (exact ? 2 : 0) +
        (rescueTeamWon && Number.isFinite(actual.homeShootoutScore) && Number.isFinite(actual.awayShootoutScore) ? 2 : 0) +
        (rescueTeamWon && options.emergencyUnderdogs?.[id] === rescue.team ? 3 : 0)
      : 0;
    const points = (rescueActive ? basePoints * 3 : basePoints) + rescueBonus;

    total.exact += exact ? 1 : 0;
    total.result += result ? 1 : 0;
    total.scorers += scorers;
    total.points += points;
    matches.push({
      id,
      points,
      exact: exact ? 1 : 0,
      result: result ? 1 : 0,
      scorers,
      multiplier,
      ...(rescueActive ? { emergencyFunding: 1, emergencyBonus: rescueBonus } : {})
    });
  }
  return { total, matches };
}

function parsePicks(row) {
  try {
    const picks = JSON.parse(row.picks || "{}");
    return picks && typeof picks === "object" && !Array.isArray(picks) ? picks : {};
  } catch {
    return {};
  }
}

function hasCompleteScore(match) {
  return match && hasScore(match.home) && hasScore(match.away);
}

function scorerLimit(match, side) {
  return hasScore(match?.[side]) ? Math.max(0, Math.min(8, Number(match[side]))) : 0;
}

function cleanScorers(match, side) {
  return (Array.isArray(match?.[`${side}Scorers`]) ? match[`${side}Scorers`] : [])
    .filter(Boolean)
    .slice(0, scorerLimit(match, side));
}

export function mergeCompletedPicks(previous, latest, completedIds) {
  const merged = {
    ...latest,
    matches: { ...(latest.matches || {}) },
    matchSubmittedAt: { ...(latest.matchSubmittedAt || {}) }
  };
  for (const id of completedIds) {
    if (hasCompleteScore(previous.matches?.[id]) && !hasCompleteScore(latest.matches?.[id])) {
      merged.matches[id] = previous.matches[id];
      if (previous.matchSubmittedAt?.[id]) merged.matchSubmittedAt[id] = previous.matchSubmittedAt[id];
    }
  }
  return merged;
}

export function sanitizePicks(picks) {
  const matchSubmittedAt = Object.fromEntries(Object.entries(picks.matchSubmittedAt || {})
    .filter(([id, value]) => matchesById.has(String(id)) && Number.isFinite(Number(value))));
  const emergencyFunding = picks.emergencyFunding?.matchId && quarterfinalIds.has(String(picks.emergencyFunding.matchId))
    ? { matchId: String(picks.emergencyFunding.matchId), team: picks.emergencyFunding.team || "" }
    : null;
  return {
    boostCountry: picks.boostCountry || "",
    ...(emergencyFunding ? { emergencyFunding } : {}),
    ...(Object.keys(matchSubmittedAt).length ? { matchSubmittedAt } : {}),
    matches: Object.fromEntries(Object.entries(picks.matches || {})
      .filter(([id]) => matchesById.has(String(id)))
      .map(([id, match]) => [id, {
        home: match.home ?? null,
        away: match.away ?? null,
        advance: match.advance || "",
        homeScorers: cleanScorers(match, "home"),
        awayScorers: cleanScorers(match, "away")
      }]))
  };
}

function preQuarterfinalScore(row) {
  const score = scorePicksDetailed(row.picks, { matchResults: Object.fromEntries(Object.entries(row.data.matchResults || {}).filter(([id]) => Number(id) < rescueCutoffId)) });
  return { ...row, ...score.total, bracketName: row.base.bracketName || "" };
}

function emergencyEligibleKeys(rows) {
  const ranked = rows.map(preQuarterfinalScore).sort((a, b) =>
    b.points - a.points || b.exact - a.exact || b.scorers - a.scorers || a.bracketName.localeCompare(b.bracketName)
  );
  return new Set(ranked.slice(Math.ceil(ranked.length / 2)).map((row) => row.key));
}

function winnerSide(pick) {
  const side = matchWinnerSide(pick);
  return side === "home" || side === "away" ? side : "";
}

function actualTeamFromSlotForData(data, slot) {
  const [, kind, id] = /^([WL])(\d+)$/.exec(slot) || [];
  if (!kind) return null;
  const result = data.matchResults?.[id];
  if (!result?.winnerSide) return null;
  const winner = result.winnerSide === "home" ? result.home : result.away;
  const loser = result.winnerSide === "home" ? result.away : result.home;
  return kind === "W" ? winner : loser;
}

function emergencyUnderdogs(rows, data) {
  return Object.fromEntries([...quarterfinalIds].map((id) => {
    const match = matchesById.get(id);
    const home = actualTeamFromSlotForData(data, match?.[1] || "");
    const away = actualTeamFromSlotForData(data, match?.[2] || "");
    if (!home || !away) return [id, ""];
    const counts = { [home]: 0, [away]: 0 };
    for (const row of rows) {
      const side = winnerSide(row.picks.matches?.[id] || {});
      const team = side === "home" ? home : side === "away" ? away : "";
      if (team) counts[team]++;
    }
    if (counts[home] === counts[away]) return [id, ""];
    return [id, counts[home] < counts[away] ? home : away];
  }));
}

function emergencyFundingLive(data) {
  return roundOf16Ids.every((id) => data.matchResults?.[id]?.winnerSide);
}

export function scoreRows(rows, data) {
  const fundingLive = emergencyFundingLive(data);
  const eligible = fundingLive ? emergencyEligibleKeys(rows.map((row) => ({ ...row, data }))) : new Set();
  const underdogs = fundingLive ? emergencyUnderdogs(rows, data) : {};
  return rows.map((row) => {
    const score = scorePicksDetailed(row.picks, data, {
      emergencyEligible: eligible.has(row.key),
      emergencyUnderdogs: underdogs
    });
    return { ...row.base, ...score.total, picks: sanitizePicks(row.picks), matchBreakdown: score.matches };
  });
}

async function main() {
  const data = readData();

  if (!sheetCsv) {
    const rows = (data.leaderboard || []).filter((row) => row.picks).map((row) => ({
      key: row.id || row.bracketName,
      base: row,
      picks: sanitizePicks(row.picks)
    }));
    const scored = scoreRows(rows, data);
    let scoredIndex = 0;
    data.leaderboard = (data.leaderboard || []).map((row) => row.picks ? scored[scoredIndex++] : row);
    data.leaderboardUpdated = timestamp();
    writeData(data);
    console.log("Recalculated existing leaderboard rows; QBIOWC_SHEET_CSV is not set.");
    return;
  }
  const response = await fetch(sheetCsv);
  if (!response.ok) throw new Error(`Sheet fetch failed: ${response.status}`);

  const [headers, ...rows] = parseCsv(await response.text());
  const allRows = rows.map((entry) => rowObject(headers, entry));
  const formBracketNames = new Set(allRows.map((row) => row["bracket name"]).filter(Boolean));
  const completedIds = new Set(Object.keys(data.matchResults || {}));
  const latestByEmail = new Map();

  for (const row of allRows.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))) {
    const email = row.email.trim().toLowerCase();
    if (!email || ignoredEmails.has(email)) continue;
    if (removedBracketNames.has(row["bracket name"])) continue;

    const previous = latestByEmail.get(email);
    const picks = stampSubmittedMatches(sanitizePicks(parsePicks(row)), parseSubmissionTime(row.timestamp));
    const merged = sanitizePicks(previous ? mergeCompletedPicks(parsePicks(previous), picks, completedIds) : picks);
    latestByEmail.set(email, { ...row, picks: JSON.stringify(merged) });
  }

  const existingSeeded = (data.leaderboard || [])
    .filter((row) => !removedBracketNames.has(row.bracketName))
    .filter((row) => !formBracketNames.has(row.bracketName))
    .filter((row) => !fakePicks[row.bracketName]);
  const rowsToScore = [
    ...existingSeeded.map((row) => ({
      key: row.id || row.bracketName,
      base: row,
      picks: sanitizePicks(row.picks || {})
    })),
    ...Object.values(fakePicks)
    .filter((picks) => !formBracketNames.has(picks.bracketName))
    .map((picks) => ({
      key: picks.bracketName,
      base: {
        id: picks.bracketName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        bracketName: picks.bracketName,
        boostCountry: picks.boostCountry
      },
      picks: sanitizePicks(picks)
    })),
    ...[...latestByEmail.values()].map((row) => {
      const picks = parsePicks(row);
      picks.boostCountry ||= row["boost country"] || "";
      return {
        key: row.email,
        base: {
          id: (row["bracket name"] || row.name || "Unnamed bracket").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
          bracketName: row["bracket name"] || row.name || "Unnamed bracket",
          boostCountry: picks.boostCountry
        },
        picks: sanitizePicks(picks)
      };
    })
  ];

  data.leaderboard = scoreRows(rowsToScore, data).sort((a, b) => a.bracketName.localeCompare(b.bracketName));
  data.leaderboardUpdated = timestamp();

  writeData(data);
  console.log(`Imported ${latestByEmail.size} form entries; leaderboard now has ${data.leaderboard.length} rows.`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
