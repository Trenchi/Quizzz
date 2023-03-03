const { postRandomQuestionDB, questionsTotal } = require("../models/question");

async function postRandomQuestion(request, response) {
  const questions = await postRandomQuestionDB(request.body.dont_ask);
  const question = questions[0];
  await question.getAnswers()
  const countTotal = await questionsTotal();
  question.countTotal = countTotal;
  response.send(question.asJsonForQuestion());
}

module.exports = {  postRandomQuestion };