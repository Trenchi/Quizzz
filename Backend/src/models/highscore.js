const { pgClient } = require("../services/database");

async function getHighscoreDB() {
const highscore = await pgClient.query("SELECT * FROM highscore ORDER BY points DESC LIMIT 10");
// console.log(highscore.rows);
return highscore.rows;
}

async function postHighscoreDB(highscore) {
console.log(highscore);
const res = await pgClient.query('INSERT INTO highscore (username, points) VALUES ($1, $2)', [highscore.username, highscore.points]);
}

module.exports = { getHighscoreDB, postHighscoreDB };