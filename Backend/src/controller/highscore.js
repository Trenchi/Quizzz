const { getHighscoreDB, postHighscoreDB, getQuoteDB } = require("../models/highscore.js");

async function getHighscore(request, response) {
    const highscore = await getHighscoreDB();
    // console.log(highscore);
    response.send(highscore);
}

async function postHighscore(request, response) {
    const position = await postHighscoreDB(request.body);
    const highscore = await getHighscoreDB();
    console.log(highscore)
    console.log("Hier ist die Variable position " + position)

    let quoteType = ""
    if (position < 2) {
        quoteType = "A";
    } else if
        (position > 2 && position <= 10) {
        quoteType = "B";
    } else if
        (position > 10) {
        quoteType = "C";
    }

console.log(quoteType)


    const quote = await getQuoteDB(quoteType);
    console.log(quote);


    response.send({
        highscore: highscore,
        position: position,
        quote: quote
    });
}

module.exports = { getHighscore, postHighscore };