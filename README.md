# QBio World Cup Bracket

Static prediction bracket for the QBio World Cup pool.

Final-day bonus picks award 2 points for the first scorer and 1 point for correctly predicting whether the champion is decided in regulation, extra time, or penalties.

Live page: <https://qbiowc.gumadeiras.com/>

![QBio World Cup bracket screenshot](assets/screenshot-2026-06-30.png)

## Local update

```bash
node .local/update-qbiowc.js
```

That refreshes game results from ESPN and imports the private Google Sheet leaderboard.
