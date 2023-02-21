const { pgClient } = require("../services/database");

class Question {
  constructor(data) {
    this.id = data.id;
    this.question = data.question;
    this.answer_1 = data.answer_1;
    this.answer_2 = data.answer_2;
    this.answer_3 = data.answer_3;
    this.answer_4 = data.answer_4;
  }
}

async function getQuestionDB(questionsTotal) {
  const res = await pgClient.query("SELECT * FROM quizzz WHERE id = $1", [questionsTotal]);
  console.log(res.rows[0]);
  return res.rows.map(g => new Question(g))
}

async function countQuestions() {
  const res = await pgClient.query("SELECT COUNT(id) FROM quizzz;");
  return parseInt(res.rows[0].count);
}

module.exports = { getQuestionDB, countQuestions };
