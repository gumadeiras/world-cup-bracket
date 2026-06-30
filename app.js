const rounds = [
  {
    name: "round of 32",
    date: "jun 28 - jul 3",
    matches: [
      [73, "2A", "2B"], [74, "1E", "3A/B/C/D/F"], [75, "1F", "2C"], [76, "1C", "2F"],
      [77, "1I", "3C/D/F/G/H"], [78, "2E", "2I"], [79, "1A", "3C/E/F/H/I"], [80, "1L", "3E/H/I/J/K"],
      [81, "1D", "3B/E/F/I/J"], [82, "1G", "3A/E/H/I/J"], [83, "2K", "2L"], [84, "1H", "2J"],
      [85, "1B", "3E/F/G/I/J"], [86, "1J", "2H"], [87, "1K", "3D/E/I/J/L"], [88, "2D", "2G"]
    ]
  },
  { name: "round of 16", date: "jul 4 - 7", matches: [[89, "W74", "W77"], [90, "W73", "W75"], [91, "W76", "W78"], [92, "W79", "W80"], [93, "W83", "W84"], [94, "W81", "W82"], [95, "W86", "W88"], [96, "W85", "W87"]] },
  { name: "quarterfinals", date: "jul 9 - 11", matches: [[97, "W89", "W90"], [98, "W93", "W94"], [99, "W91", "W92"], [100, "W95", "W96"]] },
  { name: "semifinals", date: "jul 14 - 15", matches: [[101, "W97", "W98"], [102, "W99", "W100"]] },
  { name: "third place", date: "jul 18", matches: [[103, "L101", "L102"]] },
  { name: "final", date: "jul 19", matches: [[104, "W101", "W102"]] }
];

const kickoffs = {
  73: "Sun Jun 28 · 3:00 PM",
  74: "Mon Jun 29 · 4:30 PM",
  75: "Mon Jun 29 · 9:00 PM",
  76: "Mon Jun 29 · 1:00 PM",
  77: "Tue Jun 30 · 5:00 PM",
  78: "Tue Jun 30 · 1:00 PM",
  79: "Tue Jun 30 · 9:00 PM",
  80: "Wed Jul 1 · 12:00 PM",
  81: "Wed Jul 1 · 8:00 PM",
  82: "Wed Jul 1 · 4:00 PM",
  83: "Thu Jul 2 · 7:00 PM",
  84: "Thu Jul 2 · 3:00 PM",
  85: "Thu Jul 2 · 11:00 PM",
  86: "Fri Jul 3 · 6:00 PM",
  87: "Fri Jul 3 · 9:30 PM",
  88: "Fri Jul 3 · 2:00 PM",
  89: "Sat Jul 4 · 5:00 PM",
  90: "Sat Jul 4 · 1:00 PM",
  91: "Sun Jul 5 · 4:00 PM",
  92: "Sun Jul 5 · 8:00 PM",
  93: "Mon Jul 6 · 3:00 PM",
  94: "Mon Jul 6 · 8:00 PM",
  95: "Tue Jul 7 · 12:00 PM",
  96: "Tue Jul 7 · 4:00 PM",
  97: "Thu Jul 9 · 4:00 PM",
  98: "Fri Jul 10 · 3:00 PM",
  99: "Sat Jul 11 · 5:00 PM",
  100: "Sat Jul 11 · 9:00 PM",
  101: "Tue Jul 14 · 3:00 PM",
  102: "Wed Jul 15 · 3:00 PM",
  103: "Sat Jul 18 · 5:00 PM",
  104: "Sun Jul 19 · 3:00 PM"
};

const visualMatchOrder = {
  "round of 32": [74, 77, 73, 75, 83, 84, 81, 82, 76, 78, 79, 80, 86, 88, 85, 87],
  "round of 16": [89, 90, 93, 94, 91, 92, 95, 96],
  quarterfinals: [97, 98, 99, 100],
  semifinals: [101, 102]
};

const thirdPlaceSlotMatches = [79, 85, 81, 74, 82, 77, 87, 80];
const thirdPlaceOptions = "EJIFHGLK HGIDJFLK EJIDHGLK EJIDHFLK EGIDJFLK EGJDHFLK EGIDHFLK EGJDHFLI EGJDHFIK HGICJFLK EJICHGLK EJICHFLK EGICJFLK EGJCHFLK EGICHFLK EGJCHFLI EGJCHFIK HGICJDLK CJIDHFLK CGIDJFLK CGJDHFLK CGIDHFLK CGJDHFLI CGJDHFIK EJICHDLK EGICJDLK EGJCHDLK EGICHDLK EGJCHDLI EGJCHDIK CJEDIFLK CJEDHFLK CEIDHFLK CJEDHFLI CJEDHFIK CGEDJFLK CGEDIFLK CGEDJFLI CGEDJFIK CGEDHFLK CGJDHFLE CGJDHFEK CGEDHFLI CGEDHFIK CGJDHFEI HJBFIGLK EJIBHGLK EJBFIHLK EJBFIGLK EJBFHGLK EGBFIHLK EJBFHGLI EJBFHGIK HJBDIGLK HJBDIFLK IGBDJFLK HGBDJFLK HGBDIFLK HGBDJFLI HGBDJFIK EJBDIHLK EJBDIGLK EJBDHGLK EGBDIHLK EJBDHGLI EJBDHGIK EJBDIFLK EJBDHFLK EIBDHFLK EJBDHFLI EJBDHFIK EGBDJFLK EGBDIFLK EGBDJFLI EGBDJFIK EGBDHFLK HGBDJFLE HGBDJFEK EGBDHFLI EGBDHFIK HGBDJFEI HJBCIGLK HJBCIFLK IGBCJFLK HGBCJFLK HGBCIFLK HGBCJFLI HGBCJFIK EJBCIHLK EJBCIGLK EJBCHGLK EGBCIHLK EJBCHGLI EJBCHGIK EJBCIFLK EJBCHFLK EIBCHFLK EJBCHFLI EJBCHFIK EGBCJFLK EGBCIFLK EGBCJFLI EGBCJFIK EGBCHFLK HGBCJFLE HGBCJFEK EGBCHFLI EGBCHFIK HGBCJFEI HJBCIDLK IGBCJDLK HGBCJDLK HGBCIDLK HGBCJDLI HGBCJDIK CJBDIFLK CJBDHFLK CIBDHFLK CJBDHFLI CJBDHFIK CGBDJFLK CGBDIFLK CGBDJFLI CGBDJFIK CGBDHFLK CGBDHFLJ HGBCJFDK CGBDHFLI CGBDHFIK HGBCJFDI EJBCIDLK EJBCHDLK EIBCHDLK EJBCHDLI EJBCHDIK EGBCJDLK EGBCIDLK EGBCJDLI EGBCJDIK EGBCHDLK HGBCJDLE HGBCJDEK EGBCHDLI EGBCHDIK HGBCJDEI CJBDEFLK CEBDIFLK CJBDEFLI CJBDEFIK CEBDHFLK CJBDHFLE CJBDHFEK CEBDHFLI CEBDHFIK CJBDHFEI CGBDEFLK CGBDJFLE CGBDJFEK CGBDEFLI CGBDEFIK CGBDJFEI CGBDHFLE CGBDHFEK HGBCJFDE CGBDHFEI HJIFAGLK EJIAHGLK EJIFAHLK EJIFAGLK EGJFAHLK EGIFAHLK EGJFAHLI EGJFAHIK HJIDAGLK HJIDAFLK IGJDAFLK HGJDAFLK HGIDAFLK HGJDAFLI HGJDAFIK EJIDAHLK EJIDAGLK EGJDAHLK EGIDAHLK EGJDAHLI EGJDAHIK EJIDAFLK HJEDAFLK HEIDAFLK HJEDAFLI HJEDAFIK EGJDAFLK EGIDAFLK EGJDAFLI EGJDAFIK HGEDAFLK HGJDAFLE HGJDAFEK HGEDAFLI HGEDAFIK HGJDAFEI HJICAGLK HJICAFLK IGJCAFLK HGJCAFLK HGICAFLK HGJCAFLI HGJCAFIK EJICAHLK EJICAGLK EGJCAHLK EGICAHLK EGJCAHLI EGJCAHIK EJICAFLK HJECAFLK HEICAFLK HJECAFLI HJECAFIK EGJCAFLK EGICAFLK EGJCAFLI EGJCAFIK HGECAFLK HGJCAFLE HGJCAFEK HGECAFLI HGECAFIK HGJCAFEI HJICADLK IGJCADLK HGJCADLK HGICADLK HGJCADLI HGJCADIK CJIDAFLK HJFCADLK HFICADLK HJFCADLI HJFCADIK CGJDAFLK CGIDAFLK CGJDAFLI CGJDAFIK HGFCADLK CGJDAFLH HGJCAFDK HGFCADLI HGFCADIK HGJCAFDI EJICADLK HJECADLK HEICADLK HJECADLI HJECADIK EGJCADLK EGICADLK EGJCADLI EGJCADIK HGECADLK HGJCADLE HGJCADEK HGECADLI HGECADIK HGJCADEI CJEDAFLK CEIDAFLK CJEDAFLI CJEDAFIK HEFCADLK HJFCADLE HJECAFDK HEFCADLI HEFCADIK HJECAFDI CGEDAFLK CGJDAFLE CGJDAFEK CGEDAFLI CGEDAFIK CGJDAFEI HGFCADLE HGECAFDK HGJCAFDE HGECAFDI HJBAIGLK HJBAIFLK IJBFAGLK HJBFAGLK HGBAIFLK HJBFAGLI HJBFAGIK EJBAIHLK EJBAIGLK EJBAHGLK EGBAIHLK EJBAHGLI EJBAHGIK EJBAIFLK EJBFAHLK EIBFAHLK EJBFAHLI EJBFAHIK EJBFAGLK EGBAIFLK EJBFAGLI EJBFAGIK EGBFAHLK HJBFAGLE HJBFAGEK EGBFAHLI EGBFAHIK HJBFAGEI IJBDAHLK IJBDAGLK HJBDAGLK IGBDAHLK HJBDAGLI HJBDAGIK IJBDAFLK HJBDAFLK HIBDAFLK HJBDAFLI HJBDAFIK FJBDAGLK IGBDAFLK FJBDAGLI FJBDAGIK HGBDAFLK HGBDAFLJ HGBDAFJK HGBDAFLI HGBDAFIK HGBDAFIJ EJBAIDLK EJBDAHLK EIBDAHLK EJBDAHLI EJBDAHIK EJBDAGLK EGBAIDLK EJBDAGLI EJBDAGIK EGBDAHLK HJBDAGLE HJBDAGEK EGBDAHLI EGBDAHIK HJBDAGEI EJBDAFLK EIBDAFLK EJBDAFLI EJBDAFIK HEBDAFLK HJBDAFLE HJBDAFEK HEBDAFLI HEBDAFIK HJBDAFEI EGBDAFLK EGBDAFLJ EGBDAFJK EGBDAFLI EGBDAFIK EGBDAFIJ HGBDAFLE HGBDAFEK HGBDAFEJ HGBDAFEI IJBCAHLK IJBCAGLK HJBCAGLK IGBCAHLK HJBCAGLI HJBCAGIK IJBCAFLK HJBCAFLK HIBCAFLK HJBCAFLI HJBCAFIK CJBFAGLK IGBCAFLK CJBFAGLI CJBFAGIK HGBCAFLK HGBCAFLJ HGBCAFJK HGBCAFLI HGBCAFIK HGBCAFIJ EJBAICLK EJBCAHLK EIBCAHLK EJBCAHLI EJBCAHIK EJBCAGLK EGBAICLK EJBCAGLI EJBCAGIK EGBCAHLK HJBCAGLE HJBCAGEK EGBCAHLI EGBCAHIK HJBCAGEI EJBCAFLK EIBCAFLK EJBCAFLI EJBCAFIK HEBCAFLK HJBCAFLE HJBCAFEK HEBCAFLI HEBCAFIK HJBCAFEI EGBCAFLK EGBCAFLJ EGBCAFJK EGBCAFLI EGBCAFIK EGBCAFIJ HGBCAFLE HGBCAFEK HGBCAFEJ HGBCAFEI IJBCADLK HJBCADLK HIBCADLK HJBCADLI HJBCADIK CJBDAGLK IGBCADLK CJBDAGLI CJBDAGIK HGBCADLK HGBCADLJ HGBCADJK HGBCADLI HGBCADIK HGBCADIJ CJBDAFLK CIBDAFLK CJBDAFLI CJBDAFIK HFBCADLK CJBDAFLH HJBCAFDK HFBCADLI HFBCADIK HJBCAFDI CGBDAFLK CGBDAFLJ CGBDAFJK CGBDAFLI CGBDAFIK CGBDAFIJ CGBDAFLH HGBCAFDK HGBCAFDJ HGBCAFDI EJBCADLK EIBCADLK EJBCADLI EJBCADIK HEBCADLK HJBCADLE HJBCADEK HEBCADLI HEBCADIK HJBCADEI EGBCADLK EGBCADLJ EGBCADJK EGBCADLI EGBCADIK EGBCADIJ HGBCADLE HGBCADEK HGBCADEJ HGBCADEI CEBDAFLK CJBDAFLE CJBDAFEK CEBDAFLI CEBDAFIK CJBDAFEI HFBCADLE HEBCAFDK HJBCAFDE HEBCAFDI CGBDAFLE CGBDAFEK CGBDAFEJ CGBDAFEI HGBCAFDE".split(" ").reduce((options, row) => {
  const slots = [...row];
  options[[...slots].sort().join("")] = Object.fromEntries(thirdPlaceSlotMatches.map((matchId, index) => [matchId, "3" + slots[index]]));
  return options;
}, {});

if (Object.keys(thirdPlaceOptions).length !== 495) throw new Error("Missing FIFA Annex C rows");

const stateKey = "qbiowc-picks-v1";
const randomizeLabelKey = "qbiowc-randomize-labels-v1";
const publicUrl = "https://qbiowc.gumadeiras.com/";
const state = JSON.parse(localStorage.getItem(stateKey) || '{"matches":{}}');
let activePicks = state;
const data = window.QBIOWC_DATA || { standings: [], players: {} };
const googleFormConfig = {
  action: "https://docs.google.com/forms/d/e/1FAIpQLSf9jfkZ6zktmFjB9bWFOQNOldxuLlhWd9emTUtTLZKgnCxYbw/formResponse",
  fields: {
    name: "entry.2145935792",
    bracketName: "entry.1805054406",
    email: "entry.1037084140",
    boostCountry: "entry.601888031",
    picks: "entry.1841195636"
  }
};
const randomizeLabels = [
  "i trust entropy",
  "random walk me",
  "monte carlo me",
  "boltzmann bracket",
  "thermal noise picks",
  "maximum entropy mode",
  "let diffusion decide",
  "brownian bracket",
  "noise > knowledge",
  "p = probably",
  "p-hack my bracket",
  "null model picks",
  "reviewer 2 mode",
  "control group me",
  "evolutionary drift",
  "chemotaxis chose this",
  "optomotor oracle",
  "looming stimulus picks",
  "phylogeny says penalty",
  "tree of life tiebreaker",
  "follow the gradient",
  "methylation state picks",
  "run tumble shootout",
  "critical point picks",
  "near critical bracket",
  "information limited picks",
  "minimax entropy mode",
  "surface attached strategy",
  "cell by cell comeback",
  "mutagenesis made me do it",
  "simple neuron picks",
  "cat fell asleep on keyboard",
  "hamiltonian hope",
  "free energy minimum",
  "simulate my shame"
];
const standings = data.standings || [];
const groupResults = data.groupResults || [];
const matchResults = data.matchResults || {};
const liveMatches = data.liveMatches || {};
const allPlayers = [...new Set(Object.values(data.players || {}).flat())].sort();
const standingsEl = document.querySelector("[data-standings]");
const overallStandingsEl = document.querySelector("[data-overall-standings]");
const scorerCardsEl = document.querySelector("[data-scorer-cards]");
const standingsUpdatedEl = document.querySelector("[data-standings-updated]");
const leaderboardEl = document.querySelector("[data-leaderboard]");
const leaderboardUpdatedEl = document.querySelector("[data-leaderboard-updated]");
const statCrimesEl = document.querySelector("[data-stat-crimes]");
const statCrimesUpdatedEl = document.querySelector("[data-stat-crimes-updated]");
const groupStatCrimesEl = document.querySelector("[data-group-stat-crimes]");
const groupStatCrimesUpdatedEl = document.querySelector("[data-group-stat-crimes-updated]");
const entryDetailEl = document.querySelector("[data-entry-detail]");
const todayMatchesEl = document.querySelector("[data-today-matches]");
const nextMatchesEl = document.querySelector("[data-next-matches]");
const tickerTrack = document.querySelector("[data-ticker-track]");
const board = document.querySelector("[data-board]");
const toast = document.querySelector("[data-toast]");

function thirdPlaceKey(team) {
  return [team.pts, Number(team.gd), team.gf, -team.ga, team.n].join(":");
}

function rankTeams(a, b) {
  return b.pts - a.pts || Number(b.gd) - Number(a.gd) || b.gf - a.gf || a.ga - b.ga || a.n.localeCompare(b.n);
}

function bestThirdTeams() {
  return standings
    .map((group) => ({ ...group.teams[2], group: group.g }))
    .filter((team) => team.n)
    .sort(rankTeams)
    .slice(0, 8);
}

function currentThirds() {
  return new Set(bestThirdTeams().map(thirdPlaceKey));
}

function renderStandings() {
  if (standingsUpdatedEl) standingsUpdatedEl.textContent = `updated ${displayTimestamp(data.updated)}`;
  const liveThirds = currentThirds();
  standingsEl.innerHTML = standings.map((group) => `
    <article class="group">
      <b><span></span><span>Group ${group.g}</span><span>form</span><span>pts</span><span>gd</span><span>gf</span></b>
      ${group.teams.map((team, index) => `
        <div class="group-row ${index === 2 && liveThirds.has(thirdPlaceKey(team)) ? "third-live" : ""}">
          <img class="flag" src="${team.l}" alt="">
          <span class="group-team"><span class="group-team-name">${team.n}</span>${index === 2 && liveThirds.has(thirdPlaceKey(team)) ? `<em class="third-badge">+3rd</em>` : ""}</span>${renderForm(team)}<span>${team.pts}</span><span>${team.gd}</span><span>${team.gf}</span>
        </div>`).join("")}
    </article>`).join("");
  overallStandingsEl.innerHTML = standings
    .flatMap((group) => group.teams.map((team, index) => ({ ...team, placement: `${index + 1}${group.g}` })))
    .sort(rankTeams)
    .map((team, index) => `
      <div class="overall-row">
        <span>${index + 1}</span><span class="overall-team"><img class="flag" src="${team.l}" alt="">${escapeHtml(team.n)}</span><span>${team.placement}</span>${renderForm(team)}<span>${team.pts}</span><span>${team.gd}</span><span>${team.gf}</span>
      </div>`).join("");
  renderScorerCards();
}

function renderScorerCards() {
  const scorers = data.scorers || { overall: [], teams: {} };
  const teams = knockoutTeams();
  const totalGoals = Object.values(scorers.teams || {}).flat().reduce((sum, player) => sum + player.goals, 0);
  scorerCardsEl.innerHTML = `
    <article class="scorer-card scorer-card--overall">
      <b><span>overall top 5</span> <em>${totalGoals} ${totalGoals === 1 ? "goal" : "goals"}</em></b>
      <div class="scorer-row scorer-head"><span>name</span><span>country</span><span>goals</span></div>
      ${(scorers.overall || []).map((player) => {
        const team = teamByCountry(player.country, player.countryCode);
        return `
        <div class="scorer-row"><span>${escapeHtml(player.name)}</span><span class="scorer-country">${team ? `<img class="flag" src="${team.l}" alt="">` : ""}${escapeHtml(player.countryCode || player.country)}</span><span>${player.goals}</span></div>`;
      }).join("") || `<div class="scorer-empty">waiting for ESPN scorer stats</div>`}
    </article>
    ${teams.map((team) => {
      const teamRows = scorers.teams?.[team.n] || [];
      const teamGoals = teamRows.reduce((sum, player) => sum + player.goals, 0);
      const playerRows = teamRows.filter((player) => player.name !== "own goal").slice(0, 5);
      const rows = playerRows.length === 5 ? playerRows : teamRows.slice(0, 5);
      return `<article class="scorer-card">
        <b><span><img class="flag" src="${team.l}" alt="">${escapeHtml(team.n)}</span> <em>${teamGoals} ${teamGoals === 1 ? "goal" : "goals"}</em></b>
        <div class="scorer-row scorer-head"><span>name</span><span>goals</span><span>games</span></div>
        ${rows.map((player) => `
          <div class="scorer-row"><span>${escapeHtml(player.name)}</span><span>${player.goals}</span><span>${player.games}</span></div>
        `).join("") || `<div class="scorer-empty">no goals yet</div>`}
      </article>`;
    }).join("")}`;
}

function allStandingTeams() {
  return standings.flatMap((group) => group.teams);
}

function teamByCountry(country, code) {
  return allStandingTeams().find((team) => team.a === code || team.n === country) || null;
}

function knockoutTeams() {
  const seen = new Set();
  return rounds[0].matches
    .flatMap(([id]) => teams(id))
    .map(currentTeam)
    .filter((team) => {
      if (!team || seen.has(team.n)) return false;
      seen.add(team.n);
      return true;
    })
    .sort((a, b) => a.n.localeCompare(b.n));
}

function renderForm(team) {
  const results = groupResults
    .filter((result) => result.home === team.n || result.away === team.n)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((result) => {
      const isHome = result.home === team.n;
      const goalsFor = isHome ? result.homeScore : result.awayScore;
      const goalsAgainst = isHome ? result.awayScore : result.homeScore;
      if (goalsFor > goalsAgainst) return "win";
      if (goalsFor < goalsAgainst) return "loss";
      return "draw";
    })
    .slice(-3);
  if (!results.length) results.push(...aggregateForm(team));
  while (results.length < 3) results.push("empty");
  return `<span class="form-dots" aria-label="form">${results.map((result) => `<i class="${result}"></i>`).join("")}</span>`;
}

function aggregateForm(team) {
  return [
    ...Array(team.w || 0).fill("win"),
    ...Array(team.d || 0).fill("draw"),
    ...Array(team.loss || 0).fill("loss")
  ].slice(0, 3);
}

function scorerLimit(match, side) {
  const score = match?.[side];
  return score === "" || score == null ? 0 : Math.max(0, Math.min(8, Number(score) || 0));
}

function trimScorers(match, side) {
  const key = `${side}Scorers`;
  match[key] = (Array.isArray(match[key]) ? match[key] : []).filter(Boolean).slice(0, scorerLimit(match, side));
}

function sanitizePicks(picks) {
  picks.matches ||= {};
  Object.values(picks.matches).forEach((match) => {
    trimScorers(match, "home");
    trimScorers(match, "away");
  });
  return picks;
}

function save() {
  state.name = document.querySelector("[data-player-name]").value.trim();
  state.bracketName = document.querySelector("[data-bracket-name]").value.trim();
  state.email = document.querySelector("[data-player-email]").value.trim();
  state.boostCountry = document.querySelector("[data-boost-country]").value;
  delete state.country;
  sanitizePicks(state);
  localStorage.setItem(stateKey, JSON.stringify(state));
}

function label(raw) {
  const match = /^([WL])(\d+)$/.exec(raw);
  if (!match) return raw;
  const picked = match[1] === "W" ? winner(match[2]) : loser(match[2]);
  return picked || raw;
}

function pick(id) {
  return activePicks.matches?.[id] || {};
}

function confirmedMatch(id, home = "", away = "") {
  return alignMatch(matchResults[id], home, away);
}

function liveMatch(id, home = "", away = "") {
  return alignMatch(liveMatches[id], home, away);
}

function alignMatch(actual, home = "", away = "") {
  if (!actual) return null;
  if (home && away && actual.home === away && actual.away === home) {
    return {
      ...actual,
      home: actual.away,
      away: actual.home,
      homeScore: actual.awayScore,
      awayScore: actual.homeScore,
      homeScorers: actual.awayScorers,
      awayScorers: actual.homeScorers,
      homeShootoutScore: actual.awayShootoutScore,
      awayShootoutScore: actual.homeShootoutScore,
      homeShootout: actual.awayShootout,
      awayShootout: actual.homeShootout,
      winnerSide: actual.winnerSide === "home" ? "away" : actual.winnerSide === "away" ? "home" : ""
    };
  }
  return actual;
}

function thirdPlaceSlots() {
  const key = bestThirdTeams().map((team) => team.group).sort().join("");
  return thirdPlaceOptions[key] || {};
}

function resolveThirdSlot(value, id) {
  return /^3[A-L](\/[A-L])+$/.test(value) ? thirdPlaceSlots()[id] || value : value;
}

function teams(id) {
  const meta = matchMeta(id);
  return meta ? [label(resolveThirdSlot(meta.match[1], meta.match[0])), label(resolveThirdSlot(meta.match[2], meta.match[0]))] : ["", ""];
}

function matchMeta(id) {
  for (const round of rounds) {
    const index = round.matches.findIndex((candidate) => String(candidate[0]) === String(id));
    if (index >= 0) return { round, match: round.matches[index], index };
  }
  return null;
}

function affectedMatchIds(id) {
  const affected = new Set([String(id)]);
  let changed = true;
  while (changed) {
    changed = false;
    rounds.flatMap((round) => round.matches).forEach((match) => {
      if (affected.has(String(match[0]))) return;
      if (match.slice(1).some((slot) => affected.has(slot.slice(1)))) {
        affected.add(String(match[0]));
        changed = true;
      }
    });
  }
  return rounds.flatMap((round) => round.matches.map((match) => String(match[0]))).filter((matchId) => affected.has(matchId));
}

function winner(id) {
  const actual = confirmedMatch(id);
  if (actual?.winnerSide) return actual.winnerSide === "home" ? actual.home : actual.away;
  const data = pick(id);
  const [home, away] = teams(id);
  if (data.home === "" || data.away === "" || data.home == null || data.away == null) return "";
  if (+data.home > +data.away) return home;
  if (+data.away > +data.home) return away;
  return data.advance === "home" ? home : data.advance === "away" ? away : "";
}

function loser(id) {
  const actual = confirmedMatch(id);
  if (actual?.winnerSide) return actual.winnerSide === "home" ? actual.away : actual.home;
  const data = pick(id);
  const [home, away] = teams(id);
  const win = winner(id);
  if (!win) return "";
  return win === home ? away : home;
}

function updateScore(id, side, value) {
  state.matches[id] ||= {};
  state.matches[id][side] = value === "" ? "" : Math.max(0, Math.min(99, Number(value)));
  trimScorers(state.matches[id], side);
  if (state.matches[id].home !== "" && state.matches[id].away !== "" && state.matches[id].home != null && state.matches[id].away != null && Number(state.matches[id].home) !== Number(state.matches[id].away)) {
    delete state.matches[id].advance;
  }
  save();
}

function setScore(id, side, value) {
  updateScore(id, side, value);
  renderAffected(id);
}

function setAdvance(id, side) {
  state.matches[id] ||= {};
  state.matches[id].advance = side;
  save();
  renderAffected(id);
}

function setScorer(id, side, index, value) {
  state.matches[id] ||= {};
  const scorers = Array.isArray(state.matches[id][side + "Scorers"]) ? state.matches[id][side + "Scorers"] : [];
  scorers[index] = value;
  state.matches[id][side + "Scorers"] = scorers;
  save();
}

function escapeAttribute(value) {
  return String(value ?? "").replace(/[&"]/g, (char) => char === "&" ? "&amp;" : "&quot;");
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
}

function displayTimestamp(value) {
  return String(value || "TBD").replace(/(\b(?:AM|PM))\s+[A-Z]{2,4}$/, "$1");
}

function renderLeaderboard() {
  if (leaderboardUpdatedEl) {
    leaderboardUpdatedEl.textContent = `updated ${displayTimestamp(data.leaderboardUpdated || data.updated)}`;
  }
  const rows = sortedLeaderboard();
  const movement = leaderboardMovement(rows);
  leaderboardEl.innerHTML = rows.length ? rows.map((row, index) => `
    <div class="leader-row">
      <span>${index + 1}</span><span class="leader-name">${renderRankChange(row, index, movement)}<a class="leader-link" href="?entry=${escapeAttribute(entryId(row, index))}">${escapeHtml(row.bracketName)}</a></span><span class="leader-boost">${renderBoostCountry(row.boostCountry)}</span><span>${row.points}</span><span>${row.exact}</span><span>${row.result}</span><span>${row.scorers}</span>
    </div>`).join("") : `
    <div class="leader-row">
      <span>-</span><span>TBD</span><span>-</span><span>0</span><span>0</span><span>0</span><span>0</span>
    </div>`;
}

function sortedLeaderboard() {
  return [...(data.leaderboard || [])].sort(compareLeaderboardRows);
}

function compareLeaderboardRows(a, b) {
  return b.points - a.points || b.exact - a.exact || b.scorers - a.scorers || a.bracketName.localeCompare(b.bracketName);
}

function latestGameDayMatchIds() {
  const dated = Object.entries(matchResults)
    .filter(([, result]) => result?.date)
    .map(([id, result]) => [id, etSoccerDateKey(new Date(result.date).getTime())]);
  const days = dated.map(([, day]) => day).sort();
  const latest = days[days.length - 1];
  return new Set(dated.filter(([, day]) => day === latest).map(([id]) => String(id)));
}

function leaderboardScoreBefore(row, excludedIds) {
  const scores = { points: 0, exact: 0, result: 0, scorers: 0 };
  for (const match of row.matchBreakdown || []) {
    if (excludedIds.has(String(match.id))) continue;
    scores.points += match.points || 0;
    scores.exact += match.exact || 0;
    scores.result += match.result || 0;
    scores.scorers += match.scorers || 0;
  }
  return { ...row, ...scores };
}

function leaderboardMovement(rows) {
  const latestIds = latestGameDayMatchIds();
  if (!latestIds.size) return new Map();
  const beforeRanks = new Map(rows
    .map((row) => leaderboardScoreBefore(row, latestIds))
    .sort(compareLeaderboardRows)
    .map((row, index) => [leaderboardRowKey(row), index + 1]));
  return new Map(rows.map((row, index) => {
    const id = leaderboardRowKey(row);
    return [id, (beforeRanks.get(id) || index + 1) - (index + 1)];
  }));
}

function renderRankChange(row, index, movement) {
  const delta = movement.get(leaderboardRowKey(row)) || 0;
  const direction = delta > 0 ? "up" : delta < 0 ? "down" : "same";
  const icon = delta > 0 ? "▲" : delta < 0 ? "▼" : "■";
  const label = delta > 0 ? `up ${delta}` : delta < 0 ? `down ${Math.abs(delta)}` : "no rank change";
  return `<span class="rank-change ${direction}" title="${escapeAttribute(label)}" aria-label="${escapeAttribute(label)}"><i>${icon}</i><span>${Math.abs(delta)}</span></span>`;
}

function leaderboardRowKey(row) {
  return row.id || slug(row.bracketName || "");
}

function slug(value) {
  return String(value || "entry").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function entryId(row, index = 0) {
  return row.id || slug(row.bracketName || `entry-${index + 1}`);
}

function withPicks(picks, callback) {
  const previous = activePicks;
  activePicks = picks || { matches: {} };
  try {
    return callback();
  } finally {
    activePicks = previous;
  }
}

function scoreLine(row, id) {
  const score = (row.matchBreakdown || []).find((match) => String(match.id) === String(id));
  const actual = matchResults[id];
  if (!score && actual) return `<span class="entry-points closed">closed</span><small>final ${actual.homeScore}-${actual.awayScore} · no points</small>`;
  if (!score) return `<span class="entry-points pending">pending</span><small>not scored yet</small>`;
  const chips = [
    score.exact ? ["exact", "exact"] : score.result ? ["result", "winner"] : ["miss", "score miss"],
    score.scorers ? ["scorers", `${score.scorers} scorer${score.scorers === 1 ? "" : "s"}`] : null,
    score.multiplier === 2 ? ["boost", "2x"] : null
  ].filter(Boolean);
  return `<span class="entry-points">+${score.points}</span><small class="entry-score-chips">${chips.map(([kind, text]) => `<em class="${kind}">${escapeHtml(text)}</em>`).join("")}</small>`;
}

function renderEntryTeam(info, score, scorers, winnerName) {
  return `<div class="entry-team ${winnerName === info.main ? "winner" : ""}">
    <span>${info.team ? `<img class="flag" src="${info.team.l}" alt="">` : ""}<b>${escapeHtml(info.main || "-")}</b></span>
    <strong>${score ?? "-"}</strong>
    <small>${escapeHtml((scorers || []).filter(Boolean).join(", ") || "no scorers picked")}</small>
  </div>`;
}

function renderEntryMatch(row, match) {
  const [id, homeRaw, awayRaw] = match;
  const pickData = pick(id);
  const score = (row.matchBreakdown || []).find((item) => String(item.id) === String(id));
  const closed = matchResults[id] && !score;
  const home = label(resolveThirdSlot(homeRaw, id));
  const away = label(resolveThirdSlot(awayRaw, id));
  const win = winner(id);
  const boosted = row.boostCountry && [slotInfo(home).team?.n, slotInfo(away).team?.n].includes(row.boostCountry);
  const missed = score && !score.exact && !score.result;
  return `<article class="entry-match ${boosted ? "boosted" : ""} ${closed ? "closed" : ""} ${missed ? "missed" : ""} ${score?.exact ? "exact" : score?.result ? "result" : ""} ${score?.scorers ? "scorer-hit" : ""}">
    <div class="entry-match-head"><time>${kickoffs[id]}</time><span>${scoreLine(row, id)}</span></div>
    ${renderEntryTeam(slotInfo(home), pickData.home, pickData.homeScorers, win)}
    ${renderEntryTeam(slotInfo(away), pickData.away, pickData.awayScorers, win)}
  </article>`;
}

function kickoffStamp(id) {
  const match = /^(\w+) (\w+) (\d+) · (.+)$/.exec(kickoffs[id] || "");
  return match ? kickoffTime(id) : Number(id);
}

function kickoffTime(id) {
  const match = /^(\w+) (\w+) (\d+) · (.+)$/.exec(kickoffs[id] || "");
  return match ? Date.parse(`${match[2]} ${match[3]}, 2026 ${match[4]} GMT-0400`) : Number(id);
}

function etSoccerDateKey(time) {
  time -= 6 * 60 * 60 * 1000;
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "America/New_York",
    year: "numeric"
  }).formatToParts(new Date(time)).map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function dateOrderedMatches(round) {
  return [...round.matches].sort((a, b) => kickoffStamp(a[0]) - kickoffStamp(b[0]) || a[0] - b[0]);
}

async function copyEntryBracket(row) {
  const picks = sanitizePicks(JSON.parse(JSON.stringify(row.picks || { matches: {} })));
  const payload = {
    name: "",
    bracketName: row.bracketName || "",
    email: "",
    boostCountry: picks.boostCountry || row.boostCountry || "",
    matches: picks.matches || {}
  };
  await copyText(JSON.stringify(payload, null, 2), "copy bracket");
  show("bracket copied; paste into restore");
}

function renderEntryDetail() {
  const wanted = new URLSearchParams(location.search).get("entry");
  if (!wanted) return false;
  const row = (data.leaderboard || []).find((entry, index) => entryId(entry, index) === wanted);
  document.querySelectorAll("main > :not(.topbar):not([data-entry-detail]):not(dialog):not(.toast)").forEach((node) => node.hidden = true);
  entryDetailEl.hidden = false;

  if (!row) {
    entryDetailEl.innerHTML = `<a class="back-link" href="./">back to leaderboard</a><h2>bracket not found</h2>`;
    return true;
  }

  const picks = row.picks || { boostCountry: row.boostCountry, matches: {} };
  entryDetailEl.innerHTML = withPicks(picks, () => `
    <a class="back-link" href="./">back to leaderboard</a>
    <header class="entry-header">
      <div><p>bracket detail</p><h2>${escapeHtml(row.bracketName)}</h2></div>
      <div class="entry-total"><b>${row.points || 0}</b><span>pts</span></div>
    </header>
    <div class="entry-actions">
      <button class="secondary" type="button" data-entry-copy>copy bracket</button>
      <span>paste into restore to update your bracket. submit with the same email so it replaces your first one.</span>
    </div>
    <div class="entry-stats">
      <span>boost <em class="entry-boost">${renderBoostCountry(row.boostCountry)}</em></span>
      <span>${row.exact || 0} exact</span>
      <span>${row.result || 0} result</span>
      <span>${row.scorers || 0} scorers</span>
    </div>
    ${row.picks ? rounds.map((round) => `
      <section class="entry-round">
        <h3>${round.name}<span>${round.date}</span></h3>
        ${round.name === "final" ? `
          <div class="entry-final-row">
            <div class="entry-matches">${dateOrderedMatches(round).map((match) => renderEntryMatch(row, match)).join("")}</div>
            ${renderChampion()}
          </div>
        ` : `<div class="entry-matches">${dateOrderedMatches(round).map((match) => renderEntryMatch(row, match)).join("")}</div>`}
      </section>
    `).join("") : `<p class="entry-empty">No submitted picks saved for this seeded row.</p>`}
  `);
  entryDetailEl.querySelector("[data-entry-copy]")?.addEventListener("click", () => copyEntryBracket(row));
  return true;
}

function renderBoostCountry(country) {
  const team = currentTeam(country);
  return `${team ? `<img class="flag" src="${team.l}" alt="">` : ""}<span title="${escapeAttribute(country || "")}">${escapeHtml(team?.a || country || "-")}</span>`;
}

function currentTeam(value) {
  const match = /^([123])([A-L])$/.exec(value);
  if (!match) return standings.flatMap((group) => group.teams).find((team) => team.n === value) || null;
  return standings.find((group) => group.g === match[2])?.teams[Number(match[1]) - 1] || null;
}

function groupComplete(group) {
  return group?.teams.every((team) => Number(team.gp) >= 3);
}

function slotStatus(value) {
  const match = /^([123])([A-L])$/.exec(value);
  if (match) return groupComplete(standings.find((group) => group.g === match[2])) ? "locked" : "projected";
  if (/^3/.test(value)) return "pending";
  if (/^[WL]\d+/.test(value)) return "pending";
  return currentTeam(value) ? "projected" : "pending";
}

function slotInfo(value) {
  const team = currentTeam(value);
  const status = slotStatus(value);
  if (team) return { main: team.n, sub: value, team, status };
  if (/^3/.test(value)) return { main: value, sub: "best third-place pool", status };
  if (/^W\d+/.test(value)) return { main: "TBD", sub: "winner", status };
  if (/^L\d+/.test(value)) return { main: "TBD", sub: "semifinal loser", status };
  return { main: value, sub: "predicted", status };
}

function renderSlot(info, showSub = true, showStatus = false) {
  return `<span class="slot ${showStatus ? info.status || "pending" : ""}">${info.team ? `<img class="flag" src="${info.team.l}" alt="">` : ""}<strong>${escapeHtml(info.main)}</strong>${showSub ? `<small>${escapeHtml(info.sub)}${showStatus ? ` <em>${escapeHtml(info.status || "pending")}</em>` : ""}</small>` : ""}</span>`;
}

function renderChampion() {
  const champ = winner(104);
  const info = slotInfo(champ || "...");
  return `<div class="champion"><span class="champion-kicker"><img class="champion-trophy" src="./assets/trophy-color.svg" alt="" aria-hidden="true">champion</span><b>${info.team ? `<img class="flag" src="${info.team.l}" alt="">` : ""}${escapeHtml(info.main)}</b></div>`;
}

function renderScorers(matchData, id, side, info, locked = false) {
  const count = Math.max(0, Math.min(8, Number(matchData[side]) || 0));
  const saved = Array.isArray(matchData[side + "Scorers"]) ? matchData[side + "Scorers"] : [];
  const players = data.players?.[info.team?.n] || allPlayers;
  if (!count) return `<div class="scorers"></div>`;
  if (locked) return `<div class="scorers confirmed">${saved.slice(0, count).map((scorer, index) => `<span>${escapeHtml(scorer || `goal ${index + 1}`)}</span>`).join("")}</div>`;
  return `<div class="scorers">${Array.from({ length: count }, (_, index) => `
    <select class="scorer" data-scorer="${id}:${side}:${index}" aria-label="match ${id} ${info.main} goal ${index + 1} scorer">
      <option value="">goal ${index + 1}</option>
      <option value="own goal" ${saved[index] === "own goal" ? "selected" : ""}>own goal</option>
      ${players.map((player) => `<option value="${escapeAttribute(player)}" ${saved[index] === player ? "selected" : ""}>${escapeHtml(player)}</option>`).join("")}
    </select>`).join("")}</div>`;
}

function hasShootout(actual) {
  return Number.isFinite(actual?.homeShootoutScore) && Number.isFinite(actual?.awayShootoutScore);
}

function shootoutSummary(actual) {
  if (!hasShootout(actual)) return "";
  const winnerName = actual.winnerSide === "home" ? actual.home : actual.away;
  const winnerPens = actual.winnerSide === "home" ? actual.homeShootoutScore : actual.awayShootoutScore;
  const loserPens = actual.winnerSide === "home" ? actual.awayShootoutScore : actual.homeShootoutScore;
  return `${winnerName} wins ${winnerPens}-${loserPens}`;
}

function shootoutMarks(shots = []) {
  return shots.map((shot) => {
    const made = typeof shot === "object" ? shot.made : shot;
    const player = typeof shot === "object" ? shot.player : "";
    return `<span title="${escapeAttribute(player || (made ? "scored" : "missed"))}">${made ? "⚽" : "❌"}</span>`;
  }).join("");
}

function shootoutRow(info, actual, side) {
  const shots = actual?.[`${side}Shootout`] || [];
  const score = actual?.[`${side}ShootoutScore`];
  const marks = shots.length ? shootoutMarks(shots) : `${score}`;
  return `<div class="shootout-row">
    <span>${info.team ? `<img class="flag" src="${info.team.l}" alt="${escapeAttribute(info.main)}">` : ""}</span>
    <b>${marks}</b>
  </div>`;
}

function renderShootout(actual, homeInfo, awayInfo) {
  if (!hasShootout(actual)) return "";
  return `<div class="shootout-panel">
    <strong>${escapeHtml(shootoutSummary(actual))}</strong>
    ${shootoutRow(homeInfo, actual, "home")}
    ${shootoutRow(awayInfo, actual, "away")}
  </div>`;
}

function pickWinnerSide(match) {
  if (match?.home == null || match?.away == null || match.home === "" || match.away === "") return "";
  if (+match.home > +match.away) return "home";
  if (+match.away > +match.home) return "away";
  return match.advance === "home" || match.advance === "away" ? match.advance : "";
}

function formatCount(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function renderTicker() {
  if (!tickerTrack) return;
  const text = tickerTrack.dataset.text || tickerTrack.textContent.trim();
  if (!text) return;
  const probe = document.createElement("span");
  probe.className = "ticker__item";
  probe.textContent = text;
  tickerTrack.replaceChildren(probe);
  const itemWidth = probe.getBoundingClientRect().width || 1;
  const visibleWidth = tickerTrack.parentElement?.clientWidth || itemWidth;
  const copiesPerLoop = Math.max(2, Math.ceil(visibleWidth / itemWidth) + 1);
  const fragment = document.createDocumentFragment();
  for (let index = 0; index < copiesPerLoop * 2; index++) {
    const item = document.createElement("span");
    item.className = "ticker__item";
    item.textContent = text;
    fragment.append(item);
  }
  tickerTrack.replaceChildren(fragment);
  const distance = Math.ceil(itemWidth * copiesPerLoop);
  tickerTrack.style.setProperty("--ticker-distance", `-${distance}px`);
  tickerTrack.style.setProperty("--ticker-duration", `${Math.max(24, distance / 54)}s`);
}

function scoreText(match) {
  return match?.home == null || match?.away == null || match.home === "" || match.away === "" ? "" : `${Number(match.home)}-${Number(match.away)}`;
}

function statWinnerName(result) {
  return result.winnerSide === "home" ? result.home : result.winnerSide === "away" ? result.away : "";
}

function statLoserName(result) {
  return result.winnerSide === "home" ? result.away : result.winnerSide === "away" ? result.home : "";
}

function statLine(result) {
  return `${result.home} ${result.homeScore}-${result.awayScore} ${result.away}`;
}

function resultOutcome(result) {
  const winner = statWinnerName(result);
  if (!winner) return statLine(result);
  return result.homeScore === result.awayScore ? `${winner} advanced after ${result.homeScore}-${result.awayScore}` : `${winner} won ${result.homeScore}-${result.awayScore}`;
}

function teamStat(entry, team, stat) {
  return Number(entry.stats?.[team]?.[stat] || 0);
}

function hasMatchStats(entry) {
  return Boolean(entry.stats?.[entry.result.home] && entry.stats?.[entry.result.away]);
}

function statCrimeCard(title, value, detail = "", tone = "", rule = "") {
  if (!value) return "";
  return `<article class="stat-card ${tone}">
    ${rule ? `<details class="stat-card-info"><summary title="${escapeAttribute(rule)}"><i>i</i></summary><p>${escapeHtml(rule)}</p></details>` : ""}
    <div class="stat-card-title"><b>${escapeHtml(title)}</b></div>
    <strong>${escapeHtml(value)}</strong>
    ${detail ? `<span>${escapeHtml(detail)}</span>` : ""}
  </article>`;
}

function statPickWinner(row, id) {
  let picked = "";
  withPicks(row.picks || { matches: {} }, () => {
    const side = pickWinnerSide(pick(id));
    const matchTeams = teams(id);
    picked = slotInfo(side === "home" ? matchTeams[0] : side === "away" ? matchTeams[1] : "").team?.n || "";
  });
  return picked;
}

function completedStatMatches(results = matchResults, stats = data.matchStats || {}) {
  const entries = Array.isArray(results) ? results.map((result) => [result.id, result]) : Object.entries(results);
  return entries.map(([id, result]) => ({ ...(stats[id] || {}), id: String(id), result }));
}

function scorelineCounts(matchIds) {
  const counts = new Map();
  const ids = new Set(matchIds.map(String));
  for (const row of data.leaderboard || []) {
    for (const [id, match] of Object.entries(row.picks?.matches || {})) {
      if (!ids.has(String(id))) continue;
      const text = scoreText(match);
      if (text) counts.set(text, (counts.get(text) || 0) + 1);
    }
  }
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function boostPointRows(completed) {
  const rows = data.leaderboard || [];
  const tested = new Set(completed.flatMap((entry) => [entry.result.home, entry.result.away]));
  const countries = new Map();
  for (const row of rows) {
    const country = row.boostCountry || "none";
    if (!tested.has(country)) continue;
    const entry = countries.get(country) || { country, believers: 0, points: 0 };
    entry.believers++;
    entry.points += (row.matchBreakdown || []).reduce((sum, match) => sum + (match.multiplier === 2 ? match.points / 2 : 0), 0);
    countries.set(country, entry);
  }
  return [...countries.values()].sort((a, b) => b.believers - a.believers || a.points - b.points || a.country.localeCompare(b.country));
}

const statRules = {
  cooked: "Completed round-of-32 game where QBio's most-picked winner was wrong.",
  possession: "Completed games where the losing team had more possession. Biggest possession gap wins.",
  shots: "Completed games where the losing team had more total shots. Biggest shot gap wins.",
  model: "Completed round-of-32 game where QBio's most-picked winner differs from the ESPN odds favorite.",
  character: "Team with the highest card score. Red cards count triple, then yellow cards, then fouls break ties.",
  crosses: "Team with the most crosses. Teams that lost get priority because that is funnier.",
  scoreline: "Most common scoreline picked by QBio brackets for this round.",
  coward: "Counts low-score picks in this round: 1-0, 0-1, and 1-1.",
  sicko: "Counts tied-score predictions in this round.",
  boost: "Only boost countries that already played completed round-of-32 games are eligible.",
  pichichi: "Counts scorer picks in completed round-of-32 games, then compares them to scorer hits.",
  deterministic: "Most exact scores from completed round-of-32 games.",
  bus: "Points earned from completed 1-0, 0-1, and 1-1 round-of-32 picks.",
  perfect: "Group-stage teams with three wins. Goal difference breaks ties.",
  draw: "Group-stage team with the most draws.",
  goals: "Group-stage team with the most goals scored.",
  leak: "Group-stage team with the most goals allowed.",
  wall: "Group-stage team with the fewest goals allowed."
};

function topGroupTeams(sorter, filter = () => true) {
  return standings
    .flatMap((group) => group.teams.map((team, index) => ({ ...team, place: `${index + 1}${group.g}` })))
    .filter(filter)
    .sort(sorter);
}

function tiedNames(teams, key, limit = 3) {
  if (!teams.length) return "";
  const best = key(teams[0]);
  const names = teams.filter((team) => key(team) === best).map((team) => team.n);
  return names.slice(0, limit).join(", ") + (names.length > limit ? ` +${names.length - limit}` : "");
}

function groupStageCrimeCards() {
  const byWins = topGroupTeams((a, b) => b.w - a.w || Number(b.gd) - Number(a.gd) || b.gf - a.gf || a.n.localeCompare(b.n), (team) => team.w === 3);
  const byDraws = topGroupTeams((a, b) => b.d - a.d || b.pts - a.pts || a.n.localeCompare(b.n));
  const byGoals = topGroupTeams((a, b) => b.gf - a.gf || Number(b.gd) - Number(a.gd) || a.n.localeCompare(b.n));
  const byLeaks = topGroupTeams((a, b) => b.ga - a.ga || a.pts - b.pts || a.n.localeCompare(b.n));
  const byWall = topGroupTeams((a, b) => a.ga - b.ga || b.pts - a.pts || a.n.localeCompare(b.n));
  return [
    byWins.length ? statCrimeCard("perfect record police", tiedNames(byWins, (team) => team.w), "3 wins. zero democracy.", "gold", statRules.perfect) : "",
    byDraws[0]?.d ? statCrimeCard("draw merchant guild", tiedNames(byDraws, (team) => team.d), `${formatCount(byDraws[0].d, "draw")}. plot avoided.`, "gold", statRules.draw) : "",
    byGoals[0] ? statCrimeCard("upregulated offense", tiedNames(byGoals, (team) => team.gf), `${formatCount(byGoals[0].gf, "goal")} in group play. promoter stuck on.`, "", statRules.goals) : "",
    byLeaks[0] ? statCrimeCard("open science defense", tiedNames(byLeaks, (team) => team.ga), `${formatCount(byLeaks[0].ga, "goal")} allowed. peer review pending.`, "danger", statRules.leak) : "",
    byWall[0] ? statCrimeCard("clean sheet cartel", tiedNames(byWall, (team) => team.ga), `${formatCount(byWall[0].ga, "goal")} allowed. rude to attackers.`, "gold", statRules.wall) : ""
  ].filter(Boolean);
}

function renderStatCrimes() {
  const r32Ids = rounds[0].matches.map(([id]) => String(id));
  const r32Completed = completedStatMatches(matchResults, data.matchStats || {}).filter((entry) => r32Ids.includes(entry.id));
  renderStatCrimesPanel(statCrimesEl, statCrimesUpdatedEl, {
    completed: r32Completed,
    includeBracket: true,
    matchIds: r32Ids,
    title: "round of 32"
  });
  renderStatCrimesPanel(groupStatCrimesEl, groupStatCrimesUpdatedEl, {
    completed: completedStatMatches(groupResults, data.groupMatchStats || {}),
    includeBracket: false,
    matchIds: [],
    title: "group stage"
  });
}

function renderStatCrimesPanel(target, updatedEl, { completed, includeBracket, matchIds }) {
  if (!target) return;
  if (updatedEl) updatedEl.textContent = `updated ${displayTimestamp(data.updated)}`;
  const rows = data.leaderboard || [];
  const completedIds = new Set(completed.map((entry) => String(entry.id)));
  const statCompleted = completed.filter(hasMatchStats);

  const cooked = completed.map((entry) => {
    const actual = statWinnerName(entry.result);
    const counts = new Map();
    for (const row of rows) {
      const picked = statPickWinner(row, entry.id);
      if (picked) counts.set(picked, (counts.get(picked) || 0) + 1);
    }
    const [pickName, picks = 0] = [...counts].sort((a, b) => b[1] - a[1])[0] || [];
    return { ...entry, actual, pickName, picks, wrong: pickName && pickName !== actual ? picks : 0 };
  }).sort((a, b) => b.wrong - a.wrong)[0];

  const lowScores = new Set(["1-0", "0-1", "1-1"]);
  const panelIds = new Set((matchIds || []).map(String));
  const rowMatches = (row) => Object.entries(row.picks?.matches || {}).filter(([id]) => !panelIds.size || panelIds.has(String(id)));
  const coward = [...rows].map((row) => ({
    row,
    count: rowMatches(row).filter(([, match]) => lowScores.has(scoreText(match))).length
  })).sort((a, b) => b.count - a.count || a.row.bracketName.localeCompare(b.row.bracketName))[0];

  const sicko = [...rows].map((row) => ({
    row,
    count: rowMatches(row).filter(([, match]) => {
      const text = scoreText(match);
      return text && text.split("-")[0] === text.split("-")[1];
    }).length
  })).sort((a, b) => b.count - a.count || a.row.bracketName.localeCompare(b.row.bracketName))[0];

  const boostRows = boostPointRows(completed);
  const boost = boostRows.find((entry) => entry.points === 0) || boostRows.slice().sort((a, b) => a.points - b.points || b.believers - a.believers)[0];

  const possessionFraud = statCompleted.map((entry) => {
    const loser = statLoserName(entry.result);
    const winner = statWinnerName(entry.result);
    return { ...entry, loser, winner, possession: teamStat(entry, loser, "possession") - teamStat(entry, winner, "possession") };
  }).filter((entry) => entry.loser && entry.possession > 0).sort((a, b) => b.possession - a.possession)[0];

  const shotFraud = statCompleted.map((entry) => {
    const loser = statLoserName(entry.result);
    const winner = statWinnerName(entry.result);
    return { ...entry, loser, winner, shots: teamStat(entry, loser, "shots") - teamStat(entry, winner, "shots") };
  }).filter((entry) => entry.loser && entry.shots > 0).sort((a, b) => b.shots - a.shots)[0];

  const modelMismatch = completed.map((entry) => {
    const odds = entry.favoriteSide === "home" ? entry.result.home : entry.favoriteSide === "away" ? entry.result.away : "";
    const counts = new Map();
    for (const row of rows) {
      const picked = statPickWinner(row, entry.id);
      if (picked) counts.set(picked, (counts.get(picked) || 0) + 1);
    }
    const [qbio = "", qbioVotes = 0] = [...counts].sort((a, b) => b[1] - a[1])[0] || [];
    return { ...entry, odds, qbio, qbioVotes, mismatch: odds && qbio && odds !== qbio };
  }).filter((entry) => entry.mismatch).sort((a, b) => b.qbioVotes - a.qbioVotes || a.id.localeCompare(b.id))[0];

  const mainCharacter = statCompleted.flatMap((entry) => [entry.result.home, entry.result.away].map((team) => ({
    entry,
    team,
    yellow: teamStat(entry, team, "yellowCards"),
    red: teamStat(entry, team, "redCards"),
    fouls: teamStat(entry, team, "fouls"),
    score: teamStat(entry, team, "yellowCards") + teamStat(entry, team, "redCards") * 3
  }))).sort((a, b) => b.score - a.score || b.yellow - a.yellow || b.fouls - a.fouls || a.team.localeCompare(b.team))[0];

  const crossMerchant = statCompleted.flatMap((entry) => [entry.result.home, entry.result.away].map((team) => ({
    entry,
    team,
    crosses: teamStat(entry, team, "crosses"),
    won: statWinnerName(entry.result) === team
  }))).sort((a, b) => Number(a.won) - Number(b.won) || b.crosses - a.crosses || a.team.localeCompare(b.team))[0];

  const favoriteScore = includeBracket ? scorelineCounts(matchIds)[0] : null;
  const scorerFraud = [...rows].map((row) => {
    const attempts = Object.entries(row.picks?.matches || {}).reduce((sum, [id, match]) => {
      if (!completedIds.has(String(id))) return sum;
      return sum + (match.homeScorers || []).filter(Boolean).length + (match.awayScorers || []).filter(Boolean).length;
    }, 0);
    const hits = (row.matchBreakdown || []).filter((match) => completedIds.has(String(match.id))).reduce((sum, match) => sum + (match.scorers || 0), 0);
    return { row, attempts, hits };
  }).filter((entry) => entry.attempts && (entry.row.points || 0) >= 3).sort((a, b) => b.attempts - a.attempts || a.hits - b.hits || a.row.bracketName.localeCompare(b.row.bracketName))[0];

  const deterministic = [...rows].map((row) => ({
    row,
    exact: (row.matchBreakdown || []).filter((match) => completedIds.has(String(match.id))).reduce((sum, match) => sum + (match.exact || 0), 0),
    points: (row.matchBreakdown || []).filter((match) => completedIds.has(String(match.id))).reduce((sum, match) => sum + (match.points || 0), 0)
  })).sort((a, b) => b.exact - a.exact || b.points - a.points || a.row.bracketName.localeCompare(b.row.bracketName))[0];

  const parked = [...rows].map((row) => ({
    row,
    points: (row.matchBreakdown || []).reduce((sum, score) => {
      if (!completedIds.has(String(score.id))) return sum;
      const match = row.picks?.matches?.[score.id];
      return sum + (score.points > 0 && lowScores.has(scoreText(match)) ? score.points : 0);
    }, 0)
  })).sort((a, b) => b.points - a.points || a.row.bracketName.localeCompare(b.row.bracketName))[0];

  const characterDetail = mainCharacter?.red
    ? `${formatCount(mainCharacter.red, "red card")}. ${formatCount(mainCharacter.yellow, "yellow card")}. ${mainCharacter.fouls} fouls. not exactly background noise.`
    : `${mainCharacter?.yellow || 0} cards. ${mainCharacter?.fouls || 0} fouls. not exactly background noise.`;
  const teamCards = [
    includeBracket && cooked?.wrong ? statCrimeCard("QBio got cooked", `${cooked.picks} picked ${cooked.pickName}`, `${resultOutcome(cooked.result)}. receipts archived.`, "danger", statRules.cooked) : "",
    possessionFraud ? statCrimeCard("possession is a social construct", possessionFraud.loser, `+${Math.round(possessionFraud.possession)}% possession and still out.`, "danger", statRules.possession) : "",
    shotFraud ? statCrimeCard("shots are just vibes", shotFraud.loser, `+${shotFraud.shots} shots and nothing to show for it.`, "danger", statRules.shots) : "",
    includeBracket && (modelMismatch
      ? statCrimeCard("model mismatch", `${modelMismatch.qbio} vs ${modelMismatch.odds}`, `QBio had ${modelMismatch.qbioVotes} votes. ESPN odds disagreed.`, "danger", statRules.model)
      : statCrimeCard("model mismatch", "no split yet", "QBio and ESPN odds copied each other's homework.", "gold", statRules.model)),
    mainCharacter ? statCrimeCard("main character energy", mainCharacter.team, characterDetail, "gold", statRules.character) : "",
    crossMerchant ? statCrimeCard("cross merchant award", crossMerchant.team, `${formatCount(crossMerchant.crosses, "cross", "crosses")} ${crossMerchant.won ? "and survived." : "and still lost."}`, "gold", statRules.crosses) : "",
    !includeBracket ? groupStageCrimeCards().join("") : ""
  ].filter(Boolean);
  const bracketCards = [
    favoriteScore ? statCrimeCard("lab favorite scoreline", favoriteScore[0], `${formatCount(favoriteScore[1], "bracket")} chose the house special.`, "", statRules.scoreline) : "",
    includeBracket && coward?.count ? statCrimeCard("fear of variance", coward.row.bracketName, `${formatCount(coward.count, "low-score pick")}. defensive biology.`, "gold", statRules.coward) : "",
    includeBracket && sicko?.count ? statCrimeCard("nash equilibrium", sicko.row.bracketName, `${formatCount(sicko.count, "draw")} predicted. seek help or tenure.`, "gold", statRules.sicko) : "",
    includeBracket && boost ? statCrimeCard("boost unemployment office", boost.country, `${formatCount(boost.believers, "believer")}. ${boost.points} boost pts`, boost.points ? "" : "danger", statRules.boost) : "",
    includeBracket && scorerFraud ? statCrimeCard("pichichi fraud detector", scorerFraud.row.bracketName, `${scorerFraud.attempts} scorer picks. ${scorerFraud.hits} hits. ambition is not accuracy.`, "danger", statRules.pichichi) : "",
    includeBracket && deterministic ? statCrimeCard("deterministic biology award", deterministic.row.bracketName, `${deterministic.exact || 0} exact scores. ${deterministic.points || 0} pts.`, "", statRules.deterministic) : "",
    includeBracket && parked?.points ? statCrimeCard("park the bus trophy", parked.row.bracketName, `${formatCount(parked.points, "ugly point")}. methods ugly, results significant.`, "gold", statRules.bus) : ""
  ].filter(Boolean);

  target.innerHTML = [...teamCards, ...bracketCards].join("");
}

function crowdPicks(id) {
  const rows = data.leaderboard || [];
  const scores = new Map();
  const teamCounts = new Map();
  let teamTotal = 0;
  let scoreTotal = 0;
  for (const row of rows) {
    if (!row.picks?.matches) continue;
    withPicks(row.picks, () => {
      const match = pick(id);
      if (match.home == null || match.away == null || match.home === "" || match.away === "") return;
      const win = pickWinnerSide(match);
      const matchTeams = teams(id);
      const winnerInfo = slotInfo(win === "home" ? matchTeams[0] : win === "away" ? matchTeams[1] : "");
      const winnerName = winnerInfo.team?.n || "";
      if (winnerName) {
        teamCounts.set(winnerName, (teamCounts.get(winnerName) || 0) + 1);
        teamTotal++;
      }
      const score = `${match.home}-${match.away}`;
      scores.set(score, (scores.get(score) || 0) + 1);
      scoreTotal++;
    });
  }
  if (!teamTotal && !scoreTotal) return null;
  const topScore = [...scores].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] || "";
  const topTeams = [...teamCounts]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 2)
    .map(([team, count]) => ({ team, pct: Math.round(count * 100 / teamTotal) }));
  return { topTeams, teamTotal, scoreTotal, topScore };
}

function renderCrowdPicks(id) {
  const crowd = crowdPicks(id);
  if (!crowd) return "";
  return `<div class="crowd-picks">
    <span>QBio picks <small>(${crowd.scoreTotal} bracket${crowd.scoreTotal === 1 ? "" : "s"})</small></span>
    ${crowd.topTeams.map(({ team, pct }) => `<b>${pct}% ${escapeHtml(team)}</b>`).join("")}
    ${crowd.topScore ? `<em>top score ${escapeHtml(crowd.topScore)}</em>` : ""}
  </div>`;
}

function allMatchEntries() {
  return rounds.flatMap((round) => round.matches.map((match, index) => ({
    id: String(match[0]),
    index,
    match,
    round,
    time: kickoffTime(match[0])
  }))).sort((a, b) => a.time - b.time || Number(a.id) - Number(b.id));
}

function renderMatchStrip(entries, emptyText) {
  return entries.length
    ? entries.map((entry, index) => renderMatch(entry.match, index, entry.round.name)).join("")
    : `<p class="match-strip__empty">${escapeHtml(emptyText)}</p>`;
}

function renderMatchFeed() {
  const todayKey = etSoccerDateKey(Date.now());
  const entries = allMatchEntries();
  const today = entries.filter((entry) => etSoccerDateKey(entry.time) === todayKey);
  const todayIds = new Set(today.map((entry) => entry.id));
  const next = entries
    .filter((entry) => entry.time >= Date.now() && !todayIds.has(entry.id))
    .slice(0, 4);

  todayMatchesEl.innerHTML = renderMatchStrip(today, "no games today");
  nextMatchesEl.innerHTML = renderMatchStrip(next, "no upcoming games");
  bindMatchControls(todayMatchesEl);
  bindMatchControls(nextMatchesEl);
}

function renderScoreBox(id, side, team, score, actual) {
  return `<input class="score" data-score="${id}:${side}" type="number" min="0" max="99" inputmode="numeric" value="${score ?? ""}" aria-label="match ${id} ${team} score" ${actual ? "disabled" : ""}>`;
}

function isBoosted(homeInfo, awayInfo) {
  return state.boostCountry && [homeInfo.team?.n, awayInfo.team?.n].includes(state.boostCountry);
}

function renderMatch(match, index, stage) {
  const [id, homeRaw, awayRaw] = match;
  const home = label(resolveThirdSlot(homeRaw, id));
  const away = label(resolveThirdSlot(awayRaw, id));
  const actual = confirmedMatch(id, home, away);
  const live = liveMatch(id, home, away);
  const locked = Boolean(actual || live);
  const result = actual || live;
  const data = result ? {
    home: result.homeScore,
    away: result.awayScore,
    homeScorers: actual?.homeScorers || [],
    awayScorers: actual?.awayScorers || []
  } : pick(id);
  const win = actual ? winner(id) : live ? "" : winner(id);
  const tied = data.home !== "" && data.away !== "" && data.home != null && data.away != null && Number(data.home) === Number(data.away);
  const homeInfo = slotInfo(home);
  const awayInfo = slotInfo(away);
  const boosted = isBoosted(homeInfo, awayInfo);
  const showSub = stage === "round of 32";
  return `
        <article class="match ${stage === "final" ? "final" : ""} ${tied ? "tied" : ""} ${boosted ? "boosted" : ""} ${actual ? "locked-result" : ""} ${live ? "live-result" : ""}" data-match-id="${id}" style="animation-delay:${index * 24}ms">
          <span class="match-id">M${id}</span>${actual ? `<span class="boost-badge">final score</span>` : live ? `<span class="boost-badge live-badge">live ${escapeHtml(live.status || "")}</span>` : boosted ? `<span class="boost-badge">2x points</span>` : ""}
          <time class="kickoff">${kickoffs[id]}</time>
          <div class="team ${win === homeInfo.main ? "winner" : ""}">
        ${renderSlot(homeInfo, showSub, showSub)}
        ${renderScoreBox(id, "home", homeInfo.main, data.home, locked)}
        ${live ? "" : renderScorers(data, id, "home", homeInfo, Boolean(actual))}
      </div>
      <div class="team ${win === awayInfo.main ? "winner" : ""}">
        ${renderSlot(awayInfo, showSub, showSub)}
        ${renderScoreBox(id, "away", awayInfo.main, data.away, locked)}
        ${live ? "" : renderScorers(data, id, "away", awayInfo, Boolean(actual))}
      </div>
      ${renderShootout(actual, homeInfo, awayInfo)}
      ${renderCrowdPicks(id)}
      ${locked ? "" : `<div class="advance" aria-label="match ${id} penalty winner">
        <button type="button" data-advance="${id}:home" aria-pressed="${data.advance === "home"}">${escapeHtml(homeInfo.main)}</button>
        <button type="button" data-advance="${id}:away" aria-pressed="${data.advance === "away"}">${escapeHtml(awayInfo.main)}</button>
      </div>`}
    </article>`;
}

function bindMatchControls(root) {
  root.querySelectorAll("[data-score]").forEach((input) => {
    input.addEventListener("input", (event) => {
      const [id, side] = event.target.dataset.score.split(":");
      updateScore(id, side, event.target.value);
    });
    input.addEventListener("change", (event) => {
      const [id, side] = event.target.dataset.score.split(":");
      setScore(id, side, event.target.value);
    });
  });

  root.querySelectorAll("[data-advance]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const [id, side] = event.currentTarget.dataset.advance.split(":");
      setAdvance(id, side);
    });
  });

  root.querySelectorAll("[data-scorer]").forEach((input) => {
    input.addEventListener("change", (event) => {
      const [id, side, index] = event.target.dataset.scorer.split(":");
      setScorer(id, side, Number(index), event.target.value);
    });
  });
}

function enhanceDetails() {
  document.querySelectorAll(".smooth-details").forEach((details) => {
    const summary = details.querySelector("summary");
    const body = details.querySelector(".details-body");
    if (!summary || !body || details.dataset.smooth) return;
    details.dataset.smooth = "true";
    details.classList.add("is-smooth");
    body.style.height = details.open ? "auto" : "0px";
    summary.addEventListener("click", (event) => {
      event.preventDefault();
      if (details.open) {
        body.style.height = `${body.scrollHeight}px`;
        body.offsetHeight;
        body.style.height = "0px";
        body.addEventListener("transitionend", () => details.removeAttribute("open"), { once: true });
      } else {
        details.setAttribute("open", "");
        body.style.height = "0px";
        body.offsetHeight;
        body.style.height = `${body.scrollHeight}px`;
        body.addEventListener("transitionend", () => body.style.height = "auto", { once: true });
      }
    });
  });
}

function renderAffected(id) {
  affectedMatchIds(id).forEach((matchId) => {
    const meta = matchMeta(matchId);
    if (!meta) return;
    document.querySelectorAll(`[data-match-id="${matchId}"]`).forEach((card) => {
      card.outerHTML = renderMatch(meta.match, meta.index, meta.round.name);
    });
    document.querySelectorAll(`[data-match-id="${matchId}"]`).forEach(bindMatchControls);
  });
  board.querySelector(".champion")?.replaceWith(htmlToElement(renderChampion()));
  layoutBracketCards();
  drawBracketLines();
}

function htmlToElement(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

function orderedMatches(round) {
  const order = visualMatchOrder[round.name];
  return order ? order.map((id) => round.matches.find((match) => match[0] === id)).filter(Boolean) : round.matches;
}

function sourceIds(match) {
  return match.slice(1).flatMap((slot) => /^[WL](\d+)$/.exec(slot)?.[1] || []);
}

function teamCenter(card, index) {
  const team = card.querySelectorAll(".team")[index];
  return team ? card.offsetTop + team.offsetTop + team.offsetHeight / 2 : card.offsetTop + card.offsetHeight / 2;
}

function layoutBracketCards() {
  board.querySelectorAll(".match").forEach((card) => card.style.marginTop = "");
  board.querySelectorAll(".champion").forEach((card) => card.style.marginTop = "");
  const roundEls = [...board.querySelectorAll(".round")];
  const centers = {};
  const firstRoundIds = new Set(rounds[0].matches.map((match) => String(match[0])));

  orderedMatches(rounds[0]).forEach((match) => {
    const card = board.querySelector(`[data-match-id="${match[0]}"]`);
    if (card) centers[match[0]] = card.offsetTop + card.offsetHeight / 2;
  });

  rounds.slice(1).forEach((round) => {
    orderedMatches(round).forEach((match) => {
      const sources = sourceIds(match).map((sourceId, sourceIndex) => {
        const card = board.querySelector(`[data-match-id="${sourceId}"]`);
        return card && firstRoundIds.has(String(sourceId)) ? teamCenter(card, sourceIndex) : centers[sourceId];
      }).filter((value) => value != null);
      if (sources.length) {
        centers[match[0]] = sources.reduce((sum, value) => sum + value, 0) / sources.length;
      }
    });
  });

  rounds.slice(1).forEach((round, roundIndex) => {
    const roundEl = roundEls[roundIndex + 1];
    if (!roundEl) return;

    orderedMatches(round).forEach((match) => {
      const card = board.querySelector(`[data-match-id="${match[0]}"]`);
      if (!card || centers[match[0]] == null) return;

      const desiredTop = centers[match[0]] - card.offsetHeight / 2;
      if (match[0] === 104) {
        const champion = roundEl.querySelector(".champion");
        const gap = 12;
        if (champion) {
          champion.style.marginTop = `${Math.max(0, desiredTop - champion.offsetTop - champion.offsetHeight - gap)}px`;
          card.style.marginTop = "0px";
          return;
        }
      }
      card.style.marginTop = `${Math.max(0, desiredTop - card.offsetTop)}px`;
    });
  });
}

function drawBracketLines() {
  board.querySelector(".bracket-lines")?.remove();
  const boardBox = board.getBoundingClientRect();
  const firstRoundIds = new Set(rounds[0].matches.map((match) => String(match[0])));
  const paths = rounds.flatMap((round) => round.matches).flatMap(([targetId, ...slots]) => {
    if (targetId === 104) return [];
    if (!slots.some((slot) => /^[WL]\d+$/.test(slot))) return [];
    const target = board.querySelector(`[data-match-id="${targetId}"]`);
    if (!target) return [];
    const targetBox = target.getBoundingClientRect();
    const stemX = targetBox.left - boardBox.left + board.scrollLeft + Math.min(targetBox.width * 0.38, 72);
    const sourceYs = slots.map((slot, slotIndex) => {
      const match = /^[WL](\d+)$/.exec(slot);
      const source = match ? board.querySelector(`[data-match-id="${match[1]}"]`) : null;
      if (!source) return null;
      return firstRoundIds.has(match[1]) ? teamCenter(source, slotIndex) : source.offsetTop + source.offsetHeight / 2;
    }).filter((value) => value != null);
    const stem = sourceYs.length === 2 ? [`<path d="M${stemX} ${sourceYs[0]} V${sourceYs[1]}"/>`] : [];

    return stem.concat(slots.flatMap((slot, slotIndex) => {
      const match = /^[WL](\d+)$/.exec(slot);
      if (!match) return [];
      const source = board.querySelector(`[data-match-id="${match[1]}"]`);
      if (!source) return [];
      const sourceBox = source.getBoundingClientRect();
      const x1 = sourceBox.right - boardBox.left + board.scrollLeft;
      const y = sourceYs[slotIndex];
      return y == null ? [] : `<path d="M${x1} ${y} H${stemX}"/>`;
    }));
  }).join("");
  const thirdPlace = board.querySelector('[data-match-id="103"]');
  const final = board.querySelector('[data-match-id="104"]');
  const bridge = thirdPlace && final ? (() => {
    const thirdBox = thirdPlace.getBoundingClientRect();
    const finalBox = final.getBoundingClientRect();
    const x1 = thirdBox.right - boardBox.left + board.scrollLeft;
    const x2 = finalBox.left - boardBox.left + board.scrollLeft + Math.min(finalBox.width * 0.55, 112);
    const y = thirdBox.top - boardBox.top + board.scrollTop + thirdBox.height / 2;
    return `<path d="M${x1} ${y} H${x2}"/>`;
  })() : "";

  board.insertAdjacentHTML("afterbegin", `<svg class="bracket-lines" width="${board.scrollWidth}" height="${board.scrollHeight}" viewBox="0 0 ${board.scrollWidth} ${board.scrollHeight}" aria-hidden="true">${paths}${bridge}</svg>`);
}

function updateScrollHint() {
  document.querySelector(".scroll-hint")?.classList.toggle("show", board.scrollWidth > board.clientWidth + 1);
}

function render() {
  renderMatchFeed();
  board.innerHTML = rounds.map((round) => `
    <section class="round">
      <h2>${round.name}<span class="date">${round.date}</span></h2>
      ${round.name === "final" ? renderChampion() : ""}
      ${orderedMatches(round).map((match, index) => renderMatch(match, index, round.name)).join("")}
    </section>
  `).join("");

  bindMatchControls(board);
  layoutBracketCards();
  drawBracketLines();
  updateScrollHint();
}

function show(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(show.timer);
  show.timer = window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function submissionPayload() {
  save();
  const submitted = sanitizePicks(JSON.parse(JSON.stringify(state)));
  submitted.matches ||= {};
  new Set([...Object.keys(matchResults), ...Object.keys(liveMatches)]).forEach((id) => {
    submitted.matches[id] = { home: null, away: null, advance: "", homeScorers: [], awayScorers: [] };
  });
  return {
    name: state.name || "",
    bracketName: state.bracketName || "",
    email: state.email || "",
    boostCountry: state.boostCountry || "",
    picks: JSON.stringify(submitted)
  };
}

function googleFormReady() {
  return googleFormConfig.action && Object.values(googleFormConfig.fields).every(Boolean);
}

async function copyPicks() {
  save();
  await copyText(JSON.stringify(sanitizePicks(JSON.parse(JSON.stringify(state))), null, 2), "copy picks");
}

async function copyText(text, label) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    window.prompt(label, text);
  }
}

function hasAnyScore() {
  return Object.entries(state.matches || {}).some(([id, match]) =>
    !matchResults[id] && !liveMatches[id] && (
      match.home !== "" && match.home != null || match.away !== "" && match.away != null
    )
  );
}

function showSubmitSuccess() {
  document.querySelector("[data-submit-dialog]").showModal();
}

async function submitPicks() {
  const required = document.querySelectorAll("[required]");
  if ([...required].some((input) => !input.reportValidity())) return;
  save();
  if (!hasAnyScore()) {
    document.querySelector("[data-empty-dialog]").showModal();
    return;
  }
  const payload = submissionPayload();
  if (!googleFormReady()) {
    await copyPicks();
    show("google form not configured; picks copied");
    return;
  }
  const body = new FormData();
  Object.entries(googleFormConfig.fields).forEach(([key, entry]) => body.append(entry, payload[key]));
  await fetch(googleFormConfig.action, { method: "POST", mode: "no-cors", body });
  showSubmitSuccess();
}

function restorePicks() {
  const raw = document.querySelector("[data-restore-json]").value.trim();
  const errorEl = document.querySelector("[data-restore-error]");
  if (errorEl) errorEl.hidden = true;
  try {
    const restored = parseRestoreInput(raw);
    validateRestoreInput(restored);
    localStorage.setItem(stateKey, JSON.stringify(sanitizePicks(restored)));
    location.reload();
  } catch (error) {
    const message = restoreErrorMessage(error);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.hidden = false;
    }
    show("restore failed; copy error below");
  }
}

function parseRestoreInput(raw) {
  if (!raw) throw new Error("nothing was pasted");
  try {
    return JSON.parse(raw);
  } catch {}
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) return JSON.parse(fenced[1]);
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("no restore data object found");
  return JSON.parse(raw.slice(start, end + 1));
}

function validateRestoreInput(restored) {
  if (!restored || typeof restored !== "object" || Array.isArray(restored)) throw new Error("restore data must be an object");
  if (!restored.matches || typeof restored.matches !== "object" || Array.isArray(restored.matches)) throw new Error("missing matches object");
}

function restoreErrorMessage(error) {
  return `Restore failed: ${error.message}. Paste this to your agent: output one valid restore response for ${publicUrl}. It must include name, bracketName, email, boostCountry, and a matches object keyed by match numbers 73-104.`;
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function nextRandomizeLabel() {
  let remaining;
  try {
    remaining = JSON.parse(localStorage.getItem(randomizeLabelKey) || "[]").filter((label) => randomizeLabels.includes(label));
  } catch {
    remaining = [];
  }
  if (!remaining.length) remaining = [...randomizeLabels];
  const index = Math.floor(Math.random() * remaining.length);
  const [label] = remaining.splice(index, 1);
  localStorage.setItem(randomizeLabelKey, JSON.stringify(remaining));
  return label;
}

function randomScore() {
  return Math.floor(Math.random() * 5);
}

function randomScorers(count, team) {
  const players = data.players?.[team?.n] || allPlayers;
  const pool = players.length ? players : ["own goal"];
  return Array.from({ length: Math.min(8, count) }, () => randomItem(pool));
}

function randomizePicks() {
  state.matches = {};
  const boostOptions = [...document.querySelectorAll("[data-boost-country] option")].map((option) => option.value).filter(Boolean);
  rounds.flatMap((round) => orderedMatches(round)).forEach(([id]) => {
    if (confirmedMatch(id)) {
      state.matches[id] = { home: null, away: null, advance: "", homeScorers: [], awayScorers: [] };
      return;
    }
    const [home, away] = teams(id);
    const homeInfo = slotInfo(home);
    const awayInfo = slotInfo(away);
    const homeScore = randomScore();
    const awayScore = randomScore();
    state.matches[id] = {
      home: homeScore,
      away: awayScore,
      homeScorers: randomScorers(homeScore, homeInfo.team),
      awayScorers: randomScorers(awayScore, awayInfo.team)
    };
    if (homeScore === awayScore) state.matches[id].advance = Math.random() < 0.5 ? "home" : "away";
  });
  state.boostCountry = randomItem(boostOptions);
  document.querySelector("[data-boost-country]").value = state.boostCountry || "";
  document.querySelector("[data-randomize]").textContent = nextRandomizeLabel();
  save();
  render();
  show("chaos bracket generated");
}

function agentSlotLabel(raw, id) {
  const resolved = resolveThirdSlot(raw, id);
  const team = currentTeam(resolved);
  if (team) return team.n;
  return raw.replace(/^W(\d+)$/, "winner of M$1").replace(/^L(\d+)$/, "loser of M$1");
}

function restoreTemplate() {
  return {
    name: "",
    bracketName: "",
    email: "",
    boostCountry: "",
    matches: Object.fromEntries(rounds.flatMap((round) => round.matches).map(([id]) => [
      String(id),
      { home: null, away: null, advance: "", homeScorers: [], awayScorers: [] }
    ]))
  };
}

function buildAgentPrompt() {
  const matchList = rounds.flatMap((round) => orderedMatches(round).map(([id, home, away]) =>
    `M${id}: ${agentSlotLabel(home, id)} vs ${agentSlotLabel(away, id)}`
  )).join("\n");

  return `Help me fill this World Cup 2026 prediction bracket for fun.

Use this page as context: ${publicUrl}

First ask me which theme to use:
1. pick by best food
2. pick by cities i want to visit
3. pick by flag aesthetics
4. pick by strongest science vibes
5. pick by best biodiversity
6. pick by music scenes

For every other theme, walk through the matches one at a time. For each match, ask exactly one binary question tailored to that theme and the two teams, use my answer to pick the winner, then assign a plausible score. Make the questions fun, specific, and a little sassy without being mean.

Rules:
- Keep each interview message short: one sentence max, two options only.
- Fill every match in the JSON template.
- Use numbers for home and away scores.
- If a match is tied, set advance to "home" or "away"; otherwise set advance to "".
- homeScorers and awayScorers can be empty arrays, or exact player names if you are confident.
- Pick one boostCountry from a team in the knockout bracket.
- Keep the interview playful. Lightly roast the choices and the user, but keep it friendly.
- Before the final restore data, tell me: "copy this response, open restore on the page (${publicUrl}), paste it, and click restore."
- Then output the restore data as valid JSON. No markdown. No explanation.

Match list:
${matchList}

Restore JSON template to fill:
${JSON.stringify(restoreTemplate(), null, 2)}`;
}

async function copyAgentPrompt() {
  const promptText = buildAgentPrompt();
  await copyText(promptText, "copy agent prompt");
  show("agent prompt copied");
}

function renderBoostCountries() {
  const boost = document.querySelector("[data-boost-country]");
  const knockoutNames = new Set(knockoutTeams().map((team) => team.n));
  boost.innerHTML = `<option value="">pick one</option>${standings
    .flatMap((group) => group.teams.map((team) => team.n))
    .filter((team) => knockoutNames.has(team))
    .sort()
    .map((country) => `<option value="${escapeAttribute(country)}">${escapeHtml(country)}</option>`)
    .join("")}`;
}

renderBoostCountries();
document.querySelector("[data-player-name]").value = state.name || "";
document.querySelector("[data-bracket-name]").value = state.bracketName || "";
document.querySelector("[data-player-email]").value = state.email || "";
document.querySelector("[data-boost-country]").value = state.boostCountry || state.country || "";
document.querySelectorAll("[data-player-name], [data-bracket-name], [data-player-email], [data-boost-country]").forEach((input) => {
  input.addEventListener("input", save);
  input.addEventListener("change", save);
});
document.querySelector("[data-boost-country]").addEventListener("change", render);
document.querySelector("[data-copy]").addEventListener("click", async () => {
  save();
  await copyPicks();
  show("picks copied");
});
document.querySelector("[data-submit]").addEventListener("click", submitPicks);
document.querySelector("[data-restore-open]").addEventListener("click", () => document.querySelector("[data-restore-dialog]").showModal());
document.querySelector("[data-restore-cancel]").addEventListener("click", () => document.querySelector("[data-restore-dialog]").close());
document.querySelector("[data-restore-apply]").addEventListener("click", restorePicks);
document.querySelector("[data-empty-close]").addEventListener("click", () => document.querySelector("[data-empty-dialog]").close());
document.querySelector("[data-submit-copy]").addEventListener("click", async () => {
  save();
  await copyPicks();
  show("responses copied");
});
document.querySelector("[data-submit-close]").addEventListener("click", () => document.querySelector("[data-submit-dialog]").close());
document.querySelector("[data-randomize]").textContent = nextRandomizeLabel();
document.querySelector("[data-randomize]").addEventListener("click", randomizePicks);
document.querySelector("[data-agent-prompt]").addEventListener("click", copyAgentPrompt);
document.querySelector("[data-reset]").addEventListener("click", () => {
  localStorage.removeItem(stateKey);
  location.reload();
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  document.querySelectorAll(".stat-card-info[open]").forEach((details) => {
    details.open = false;
  });
});

if (!renderEntryDetail()) {
  renderTicker();
  renderStandings();
  renderLeaderboard();
  renderStatCrimes();
  render();
  enhanceDetails();
  window.addEventListener("resize", () => {
    renderTicker();
    layoutBracketCards();
    drawBracketLines();
    updateScrollHint();
  });
}
