#!/usr/bin/env node

import fs from "node:fs";

const dataPath = "data.js";
const prefix = "window.QBIOWC_DATA=";
const scoreboardUrl = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260611-20260628&limit=200";
const summaryUrl = (eventId) => `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/summary?event=${eventId}`;

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

async function scorerStats(teamMeta, results) {
  const players = new Map();
  const teamGoals = new Map();
  for (const result of results) {
    teamGoals.set(result.home, (teamGoals.get(result.home) || 0) + result.homeScore);
    teamGoals.set(result.away, (teamGoals.get(result.away) || 0) + result.awayScore);
  }
  const summaries = await Promise.all(results.map(async (result) => {
    const response = await fetch(summaryUrl(result.id));
    if (!response.ok) throw new Error(`ESPN summary failed for ${result.id}: ${response.status}`);
    return response.json();
  }));

  for (const summary of summaries) {
    for (const roster of summary.rosters || []) {
      const team = teamMeta.get(roster.team?.displayName);
      if (!team) continue;
      for (const entry of roster.roster || []) {
        const name = entry.athlete?.displayName;
        const goals = stat(entry, "totalGoals");
        const games = stat(entry, "appearances");
        if (!name || (!goals && !games)) continue;
        addPlayer(players, team, name, goals, games);
      }
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
    ]))
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
    if (competition?.status?.type?.description !== "Full Time") continue;
    const competitors = competition.competitors || [];
    if (competitors.length !== 2) continue;
    const [first, second] = competitors;
    const home = first.homeAway === "home" ? first : second;
    const away = first.homeAway === "away" ? first : second;
    const homeName = home.team.displayName;
    const awayName = away.team.displayName;
    if (!teamMeta.has(homeName) || !teamMeta.has(awayName)) continue;
    results.push({ id: event.id, date: event.date, home: homeName, away: awayName, homeScore: Number(home.score), awayScore: Number(away.score) });
  }

  const groups = Object.fromEntries(data.standings.map((group) => [group.g, new Map(group.teams.map((team) => [team.n, blankTeam(team)]))]));
  for (const result of results) {
    const group = teamGroup.get(result.home);
    if (!group || group !== teamGroup.get(result.away)) continue;
    addResult(groups[group].get(result.home), result.homeScore, result.awayScore);
    addResult(groups[group].get(result.away), result.awayScore, result.homeScore);
  }

  for (const group of data.standings) {
    group.teams = [...groups[group.g].values()].map((team) => {
      const gd = team.gf - team.ga;
      return { ...team, gd: gd > 0 ? `+${gd}` : String(gd) };
    }).sort((a, b) => b.pts - a.pts || Number(b.gd) - Number(a.gd) || b.gf - a.gf || a.ga - b.ga || a.n.localeCompare(b.n));
  }

  data.groupResults = results;
  data.scorers = await scorerStats(teamMeta, results);
  data.updated = timestamp();
  writeData(data);
  console.log(`Updated ${results.length} completed World Cup matches.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
