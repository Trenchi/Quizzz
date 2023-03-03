const { pgClient } = require("../services/database");
const { getAnswersForQuestion } = require("./answer")
class Question {
  id;
  question;
  answers;
  countTotal;

  constructor(data) {
    this.id = data.id;
    this.question = data.question;
  }

  async getAnswers() {
    this.answers = await getAnswersForQuestion(this.id)
    this.answers = this.answers.sort((a, b) => 0.5 - Math.random());
  }

  asJsonForQuestion() {
    return {
      id: this.id,
      question: this.question,
      answers: this.answers.map(a => a.asJsonForQuestion()),
      countTotal: this.countTotal
    }
  }
}

async function questionsTotal() {
  const res = await pgClient.query("SELECT COUNT(*) FROM questions;");
  return res.rows[0].count;
}

async function postRandomQuestionDB(array_id) {
  let where_id = ""

  if (array_id.length !== 0) {
  where_id = "WHERE"
  array_id.forEach((id, i) => {
    where_id += " id <> ";
    where_id += id;
    if (i!= array_id.length - 1) {
      where_id += " AND "
    }
  })}

  let query = "SELECT * FROM questions " + where_id + " ORDER BY random() LIMIT 1;"

  const res = await pgClient.query(query);
  return res.rows.map(g => new Question(g))
}

module.exports = { postRandomQuestionDB, questionsTotal };

