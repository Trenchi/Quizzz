const { Question, getQuestionDB } = require("../models/question");

async function getRandomQuestion(request, response) {

  const questions = await getQuestionDB();
  const question = questions[0];
  await question.getAnswers()
  // console.log(question);
  

  response.send(question.asJsonForQuestion());
}

module.exports = { getRandomQuestion };