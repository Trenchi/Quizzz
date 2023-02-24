const { pgClient } = require("../services/database");
const { getAnswersForQuestion} = require("./answer")

class Question {
  id; 
  question;
  answers;

  constructor(data) {
    this.id = data.id;
    this.question = data.question;
  }

  async getAnswers() {
    this.answers = await getAnswersForQuestion(this.id)
  }

  asJsonForQuestion() {
    return {
      id: this.id,
      question: this.question,
      answers: this.answers.map(a => a.asJsonForQuestion())
    }
  }
}

async function getQuestionDB() {
  const res = await pgClient.query("SELECT * FROM questions ORDER BY random() LIMIT 1;");
  // console.log(res.rows[0]);
  return res.rows.map(g => new Question(g))
}

module.exports = { getQuestionDB };
