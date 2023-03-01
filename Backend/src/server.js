const express = require('express');
const cors = require('cors');
const { getRandomQuestion, postRandomQuestion } = require("./controller/questions");
const { checkAnswer } = require("./controller/answers");
const { connectToDatabase, connectAndQuery } = require('./services/database');


const app = express();
const port = 4000;
app.use(cors());
app.use(express.json());


app.get("/question/random", getRandomQuestion);
app.post("/question/random", postRandomQuestion)
app.post('/question/check_answer', checkAnswer);


connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
});
