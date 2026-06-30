#!/usr/bin/env node

import fs from "node:fs";

const dataPath = "data.js";
const prefix = "window.QBIOWC_DATA=";
const scoreboardUrl = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260611-20260720&limit=200";
const summaryUrl = (eventId) => `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/summary?event=${eventId}`;
const knockoutKickoffs = {
  "2026-06-28T19:00": 73, "2026-06-29T20:30": 74, "2026-06-30T01:00": 75, "2026-06-29T17:00": 76,
  "2026-06-30T21:00": 77, "2026-06-30T17:00": 78, "2026-07-01T01:00": 79, "2026-07-01T16:00": 80,
  "2026-07-02T00:00": 81, "2026-07-01T20:00": 82, "2026-07-02T23:00": 83, "2026-07-02T19:00": 84,
  "2026-07-03T03:00": 85, "2026-07-03T22:00": 86, "2026-07-04T01:30": 87, "2026-07-03T18:00": 88,
  "2026-07-04T21:00": 89, "2026-07-04T17:00": 90, "2026-07-05T20:00": 91, "2026-07-06T00:00": 92,
  "2026-07-06T19:00": 93, "2026-07-07T00:00": 94, "2026-07-07T16:00": 95, "2026-07-07T20:00": 96,
  "2026-07-09T20:00": 97, "2026-07-10T19:00": 98, "2026-07-11T21:00": 99, "2026-07-12T01:00": 100,
  "2026-07-14T19:00": 101, "2026-07-15T19:00": 102, "2026-07-18T21:00": 103, "2026-07-19T19:00": 104
};

function readData() {
  const text = fs.readFileSync(dataPath, "utf8").trim();
  if (!text.startsWith(prefix) || !text.endsWith(";")) throw new Error(`Unexpected ${dataPath} shape`);
  return JSON.parse(text.slice(prefix.length, -1));
}

function writeData(data) {
  fs.writeFileSync(dataPath, `${prefix}${JSON.stringify(data)};\n`);
}

function timestamp() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short"
  }).formatToParts(new Date()).map((part) => [part.type, part.value]));
  return `${parts.month} ${parts.day}, ${parts.year} · ${parts.hour}:${parts.minute} ${parts.dayPeriod} ET`;
}

function blankTeam(team) {
  return { n: team.n, a: team.a, l: team.l, gp: 0, w: 0, d: 0, loss: 0, gf: 0, ga: 0, gd: "0", pts: 0 };
}

function addResult(team, gf, ga) {
  team.gp += 1;
  team.gf += gf;
  team.ga += ga;
  if (gf > ga) {
    team.w += 1;
    team.pts += 3;
  } else if (gf < ga) {
    team.loss += 1;
  } else {
    team.d += 1;
    team.pts += 1;
  }
}

function stat(athlete, name) {
  return (athlete.statistics || athlete.stats)?.find((item) => item.name === name)?.value || 0;
}

function addPlayer(players, team, name, goals, games) {
  const key = `${team.n}:${name}`;
  const player = players.get(key) || { name, country: team.n, countryCode: team.a, goals: 0, games: 0 };
  player.goals += goals;
  player.games += games;
  players.set(key, player);
}

function playerNameKey(name) {
  return name.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function addTeamPlayer(teamPlayerNames, team, name) {
  if (!name) return;
  teamPlayerNames.get(team)?.set(playerNameKey(name), name);
}

function kickoffKey(date) {
  return new Date(date).toISOString().slice(0, 16);
}

async function scorerStats(teamMeta, results, existingPlayers = {}) {
  const players = new Map();
  const matchScorers = new Map(results.map((result) => [result.id, { home: [], away: [] }]));
  const shootouts = new Map();
  const teamPlayerNames = new Map([...teamMeta.keys()].map((team) => [
    team,
    new Map((existingPlayers[team] || []).map((name) => [playerNameKey(name), name]))
  ]));
  const teamGoals = new Map();
  for (const result of results) {
    teamGoals.set(result.home, (teamGoals.get(result.home) || 0) + result.homeScore);
    teamGoals.set(result.away, (teamGoals.get(result.away) || 0) + result.awayScore);
  }
  const summaries = await Promise.all(results.map(async (result) => {
    const response = await fetch(summaryUrl(result.id));
    if (!response.ok) throw new Error(`ESPN summary failed for ${result.id}: ${response.status}`);
    return { result, summary: await response.json() };
  }));

  for (const { result, summary } of summaries) {
    const matchGoals = { home: 0, away: 0 };
    const shootout = { homeShootout: [], awayShootout: [] };
    for (const entry of summary.shootout || []) {
      const side = entry.team === result.home ? "home" : entry.team === result.away ? "away" : null;
      if (side) shootout[`${side}Shootout`] = (entry.shots || []).map((shot) => ({ made: Boolean(shot.didScore), player: shot.player || "" }));
    }
    if (shootout.homeShootout.length || shootout.awayShootout.length) shootouts.set(result.id, shootout);
    for (const roster of summary.rosters || []) {
      const team = teamMeta.get(roster.team?.displayName);
      if (!team) continue;
      const side = team.n === result.home ? "home" : team.n === result.away ? "away" : null;
      for (const entry of roster.roster || []) {
        const name = entry.athlete?.displayName;
        addTeamPlayer(teamPlayerNames, team.n, name);
        const goals = stat(entry, "totalGoals");
        const games = stat(entry, "appearances");
        if (side && name && goals) {
          matchGoals[side] += goals;
          matchScorers.get(result.id)[side].push(...Array(goals).fill(name));
        }
        if (!name || (!goals && !games)) continue;
        addPlayer(players, team, name, goals, games);
      }
    }
    for (const side of ["home", "away"]) {
      const score = result[`${side}Score`];
      const ownGoals = score - matchGoals[side];
      if (ownGoals > 0) matchScorers.get(result.id)[side].push(...Array(ownGoals).fill("own goal"));
    }
  }

  for (const [teamName, total] of teamGoals) {
    const team = teamMeta.get(teamName);
    const playerGoals = [...players.values()]
      .filter((player) => player.country === teamName)
      .reduce((sum, player) => sum + player.goals, 0);
    const diff = total - playerGoals;
    if (team && diff > 0) addPlayer(players, team, "own goal", diff, diff);
  }

  const leaders = [...players.values()]
    .filter((player) => player.goals)
    .sort((a, b) => b.goals - a.goals || a.games - b.games || a.name.localeCompare(b.name));
  return {
    overall: leaders.slice(0, 5),
    teams: Object.fromEntries([...teamMeta.keys()].map((team) => [
      team,
      leaders.filter((player) => player.country === team)
    ])),
    players: Object.fromEntries([...teamPlayerNames].map(([team, names]) => [
      team,
      [...names.values()].sort((a, b) => a.localeCompare(b))
    ])),
    shootouts,
    matchScorers
  };
}

async function main() {
  const data = readData();
  const teamMeta = new Map();
  const teamGroup = new Map();
  for (const group of data.standings) {
    for (const team of group.teams) {
      teamMeta.set(team.n, team);
      teamGroup.set(team.n, group.g);
    }
  }

  const response = await fetch(scoreboardUrl);
  if (!response.ok) throw new Error(`ESPN scoreboard failed: ${response.status}`);
  const scoreboard = await response.json();
  const results = [];

  for (const event of (scoreboard.events || []).sort((a, b) => new Date(a.date) - new Date(b.date))) {
    const competition = event.competitions?.[0];
    if (!competition?.status?.type?.completed) continue;
    const competitors = competition.competitors || [];
    if (competitors.length !== 2) continue;
    const [first, second] = competitors;
    const home = first.homeAway === "home" ? first : second;
    const away = first.homeAway === "away" ? first : second;
    const homeName = home.team.displayName;
    const awayName = away.team.displayName;
    if (!teamMeta.has(homeName) || !teamMeta.has(awayName)) continue;
    const homeScore = Number(home.score);
    const awayScore = Number(away.score);
    const winnerSide = home.winner ? "home" : away.winner ? "away" : homeScore > awayScore ? "home" : awayScore > homeScore ? "away" : "";
    const hasShootout = /PEN/.test(competition.status.type.name || "") && Number.isFinite(Number(home.shootoutScore)) && Number.isFinite(Number(away.shootoutScore));
    results.push({
      id: event.id,
      date: event.date,
      home: homeName,
      away: awayName,
      homeScore,
      awayScore,
      winnerSide,
      ...(hasShootout ? { homeShootoutScore: Number(home.shootoutScore), awayShootoutScore: Number(away.shootoutScore) } : {})
    });
  }

  const groups = Object.fromEntries(data.standings.map((group) => [group.g, new Map(group.teams.map((team) => [team.n, blankTeam(team)]))]));
  const groupResults = [];
  for (const result of results) {
    const group = teamGroup.get(result.home);
    if (!group || group !== teamGroup.get(result.away)) continue;
    groupResults.push(result);
    addResult(groups[group].get(result.home), result.homeScore, result.awayScore);
    addResult(groups[group].get(result.away), result.awayScore, result.homeScore);
  }

  for (const group of data.standings) {
    group.teams = [...groups[group.g].values()].map((team) => {
      const gd = team.gf - team.ga;
      return { ...team, gd: gd > 0 ? `+${gd}` : String(gd) };
    }).sort((a, b) => b.pts - a.pts || Number(b.gd) - Number(a.gd) || b.gf - a.gf || a.ga - b.ga || a.n.localeCompare(b.n));
  }

  data.groupResults = groupResults;
  const stats = await scorerStats(teamMeta, results, data.players || {});
  data.scorers = { overall: stats.overall, teams: stats.teams };
  data.players = stats.players;
  data.matchResults = Object.fromEntries(results.flatMap((result) => {
    const matchId = knockoutKickoffs[kickoffKey(result.date)];
    const scorers = stats.matchScorers.get(result.id) || { home: [], away: [] };
    const shootout = stats.shootouts.get(result.id) || {};
    return matchId ? [[matchId, { ...result, homeScorers: scorers.home, awayScorers: scorers.away, ...shootout }]] : [];
  }));
  data.updated = timestamp();
  writeData(data);
  console.log(`Updated ${results.length} completed World Cup matches.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
