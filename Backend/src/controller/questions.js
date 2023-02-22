const { Question, getQuestionDB, countQuestions } = require("../models/questions");

async function getRandomQuestion(request, response) {

  const question = await getQuestionDB();
  response.send(question[0]);
}

module.exports = { getRandomQuestion };