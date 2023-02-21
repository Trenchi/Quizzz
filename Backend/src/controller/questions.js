const { Question, getQuestionDB, countQuestions } = require("../models/questions");

async function getRandomQuestion(request, response) {

  const questionsTotal = await countQuestions();

  const randomQuestion = Math.floor(Math.random() * (questionsTotal) + 1);

  const question = await getQuestionDB(randomQuestion);
  response.send(question);
}

module.exports = { getRandomQuestion };