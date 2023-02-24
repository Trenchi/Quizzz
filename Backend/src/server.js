const express = require('express');
const cors = require('cors');
const { getRandomQuestion } = require("./controller/questions");
const { checkAnswer } = require("./controller/answers");
const { connectToDatabase, connectAndQuery } = require('./services/database');

const app = express();
const port = 4000;
app.use(cors());
app.use(express.json());



app.get("/question/random", getRandomQuestion);
app.post('/question/check_answer', checkAnswer);

// async (req, res) => {
//   const id = req.params.id;
//   const query = 'SELECT * FROM quizzz WHERE id = $1';
//   const params = [id];
  
//   const result = await connectAndQuery(query, params);

//   res.send(result);
// };





// app.get('/quiz/:id', async (req, res) => {
//   const id = req.params.id;
//   const query = 'SELECT * FROM quizzz WHERE id = $1';
//   const params = [id];
  
//   const result = await connectAndQuery(query, params);

//   res.send(result);
// });

connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
});
