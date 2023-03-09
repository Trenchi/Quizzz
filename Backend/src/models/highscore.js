const { pgClient } = require("../services/database");

async function getHighscoreDB() {
const highscore = await pgClient.query(`
SELECT 
ROW_NUMBER() OVER (ORDER BY points desc) AS position,id,username,points
FROM public.highscore
LIMIT 10
`);
// console.log(highscore.rows);
return highscore.rows;
}

async function postHighscoreDB(highscore) {
// console.log(highscore);
const res = await pgClient.query('INSERT INTO highscore (username, points) VALUES ($1, $2) Returning id', [highscore.username, highscore.points]);
const position = await pgClient.query(`SELECT position, username, points 
    FROM ( 
        SELECT
             ROW_NUMBER() OVER (ORDER BY points desc) AS position,id,username,
             points
        FROM public.highscore
    ) as sub
    WHERE sub.id = $1`, [res.rows[0].id])
return position.rows[0].position;
}

async function getQuoteDB(quoteType) {
    const res = await pgClient.query(`SELECT * FROM public.quotes WHERE type = '${quoteType}'  ORDER BY random() LIMIT 1`)
    return res.rows[0].quote
}


module.exports = { getHighscoreDB, postHighscoreDB, getQuoteDB };


