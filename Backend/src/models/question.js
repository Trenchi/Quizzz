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
    // console.log(this.answers)
    this.answers = this.answers.sort((a, b) => 0.5 - Math.random());
    // console.log(this.answers)
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
  // console.log(res.rows[0]);
  return res.rows[0].count;
}


// async function getQuestionDB() {
//   const res = await pgClient.query("SELECT * FROM questions ORDER BY random() LIMIT 1;");
//   // console.log(res.rows[0]);
//   return res.rows.map(g => new Question(g))
// }

async function postRandomQuestionDB(array_id) {
  let where_id = ""
  // console.log(array_id)
  array_id.forEach((id, i) => {
    // console.log(id);
    // console.log(i);
    where_id += " id <> ";
    where_id += id;
    // console.log(where_id);
    if (i!= array_id.length - 1) {
      where_id += " AND "
    }
    // console.log(where_id)
  })
  let query = "SELECT * FROM questions WHERE" + where_id + " ORDER BY random() LIMIT 1;"


  const res = await pgClient.query(query);
  // console.log(res.rows[0]);
  return res.rows.map(g => new Question(g))
}



module.exports = { postRandomQuestionDB, questionsTotal }; // getQuestionDB,

