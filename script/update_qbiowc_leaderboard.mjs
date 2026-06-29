#!/usr/bin/env node

import fs from "node:fs";
import { fakePicks } from "./fake_qbiowc_picks.mjs";

const dataPath = "data.js";
const prefix = "window.QBIOWC_DATA=";
const sheetCsv = process.env.QBIOWC_SHEET_CSV || "";
const ignoredEmails = new Set((process.env.QBIOWC_IGNORED_EMAILS || "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean));
const removedBracketNames = new Set(["Assay Madrid"]);
const firstRoundIds = new Set(Array.from({ length: 16 }, (_, index) => String(index + 73)));
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
    timeZone: "America/New_York",
    timeZoneName: "short"
  }).formatToParts(new Date()).map((part) => [part.type, part.value]));
  return `${parts.month} ${parts.day}, ${parts.year} · ${parts.hour}:${parts.minute} ${parts.dayPeriod} ET`;
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

export function scorePicks(picks, data) {
  return scorePicksDetailed(picks, data).total;
}

export function scorePicksDetailed(picks, data) {
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

  function predictedTeamFromSlot(slot) {
    const [, kind, id] = /^([WL])(\d+)$/.exec(slot) || [];
    if (!kind) return null;
    const teams = predictedTeams(id);
    const pick = picks.matches?.[id];
    const side = pick ? matchWinnerSide(pick) : "";
    if (!teams || !side) return null;
    const winner = side === "home" ? teams.home : teams.away;
    const loser = side === "home" ? teams.away : teams.home;
    return kind === "W" ? winner : loser;
  }

  function predictedTeams(id) {
    id = String(id);
    if (predictedCache.has(id)) return predictedCache.get(id);
    if (firstRoundIds.has(id)) {
      const actual = actualMatch(id);
      const teams = actual ? { home: actual.home, away: actual.away } : null;
      predictedCache.set(id, teams);
      return teams;
    }
    const match = matchesById.get(id);
    const teams = match ? { home: predictedTeamFromSlot(match[1]), away: predictedTeamFromSlot(match[2]) } : null;
    predictedCache.set(id, teams?.home && teams?.away ? teams : null);
    return predictedCache.get(id);
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
    const points = ((exact ? 3 : result ? 1 : 0) + scorers) * multiplier;

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
      multiplier
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

export function mergeCompletedPicks(previous, latest, completedIds) {
  const merged = {
    ...latest,
    matches: { ...(latest.matches || {}) }
  };
  for (const id of completedIds) {
    if (hasCompleteScore(previous.matches?.[id]) && !hasCompleteScore(latest.matches?.[id])) {
      merged.matches[id] = previous.matches[id];
    }
  }
  return merged;
}

function sanitizePicks(picks) {
  return {
    boostCountry: picks.boostCountry || "",
    matches: Object.fromEntries(Object.entries(picks.matches || {})
      .filter(([id]) => matchesById.has(String(id)))
      .map(([id, match]) => [id, {
        home: match.home ?? null,
        away: match.away ?? null,
        advance: match.advance || "",
        homeScorers: Array.isArray(match.homeScorers) ? match.homeScorers.filter(Boolean) : [],
        awayScorers: Array.isArray(match.awayScorers) ? match.awayScorers.filter(Boolean) : []
      }]))
  };
}

async function main() {
  if (!sheetCsv) {
    console.log("Skipped leaderboard import; QBIOWC_SHEET_CSV is not set.");
    return;
  }
  const response = await fetch(sheetCsv);
  if (!response.ok) throw new Error(`Sheet fetch failed: ${response.status}`);

  const [headers, ...rows] = parseCsv(await response.text());
  const allRows = rows.map((entry) => rowObject(headers, entry));
  const formBracketNames = new Set(allRows.map((row) => row["bracket name"]).filter(Boolean));
  const data = readData();
  const completedIds = new Set(Object.keys(data.matchResults || {}));
  const latestByEmail = new Map();

  for (const row of allRows.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))) {
    const email = row.email.trim().toLowerCase();
    if (!email || ignoredEmails.has(email)) continue;
    if (removedBracketNames.has(row["bracket name"])) continue;

    const previous = latestByEmail.get(email);
    const picks = parsePicks(row);
    const merged = previous ? mergeCompletedPicks(parsePicks(previous), picks, completedIds) : picks;
    latestByEmail.set(email, { ...row, picks: JSON.stringify(merged) });
  }

  const existingSeeded = (data.leaderboard || [])
    .filter((row) => !removedBracketNames.has(row.bracketName))
    .filter((row) => !formBracketNames.has(row.bracketName))
    .filter((row) => !fakePicks[row.bracketName]);
  const fakeSeeded = Object.values(fakePicks)
    .filter((picks) => !formBracketNames.has(picks.bracketName))
    .map((picks) => {
      const score = scorePicksDetailed(picks, data);
      return {
        id: picks.bracketName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        bracketName: picks.bracketName,
        boostCountry: picks.boostCountry,
        ...score.total,
        picks: sanitizePicks(picks),
        matchBreakdown: score.matches
      };
    });

  data.leaderboard = [
    ...existingSeeded,
    ...fakeSeeded,
    ...[...latestByEmail.values()].map((row) => {
      const picks = parsePicks(row);
      picks.boostCountry ||= row["boost country"] || "";
      const score = scorePicksDetailed(picks, data);
      return {
        id: (row["bracket name"] || row.name || "Unnamed bracket").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        bracketName: row["bracket name"] || row.name || "Unnamed bracket",
        boostCountry: picks.boostCountry,
        ...score.total,
        picks: sanitizePicks(picks),
        matchBreakdown: score.matches
      };
    })
  ].sort((a, b) => a.bracketName.localeCompare(b.bracketName));
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
