const { Question, getQuestionDB, postRandomQuestionDB } = require("../models/question");

async function getRandomQuestion(request, response) {
  const questions = await getQuestionDB();
  const question = questions[0];
  console.log(question);
  await question.getAnswers()
  response.send(question.asJsonForQuestion());
}

async function postRandomQuestion(request, response) {
  console.log(request.body);
  const questions = await postRandomQuestionDB(request.body.dont_ask);
  const question = questions[0];
  await question.getAnswers()
  response.send(question.asJsonForQuestion());
}


module.exports = { getRandomQuestion, postRandomQuestion };