const { getHighscoreDB, postHighscoreDB } = require("../models/highscore.js");

async function getHighscore(request, response) {
const highscore = await getHighscoreDB();
// console.log(highscore);
response.send(highscore);
}

async function postHighscore(request, response) {
await postHighscoreDB(request.body)
response.send(console.log("Placeholder"));
}

module.exports = { getHighscore, postHighscore };