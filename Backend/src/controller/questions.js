const { postRandomQuestionDB, questionsTotal, getAllQuestionsDb } = require("../models/question");

async function postRandomQuestion(request, response) {
  const questions = await postRandomQuestionDB(request.body.dont_ask);
  const question = questions[0];
  await question.getAnswers()
  const countTotal = await questionsTotal();
  question.countTotal = countTotal;
  response.send(question.asJsonForQuestion());
}

async function getAllQuestions(request, response) {
  const questions = await getAllQuestionsDb();
  console.log(questions)
  response.send(questions)
}

module.exports = {  postRandomQuestion, getAllQuestions };