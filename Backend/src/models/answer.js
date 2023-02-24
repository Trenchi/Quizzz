const { pgClient } = require("../services/database");

class Answer {
    id;
    text;
    isCorrect;
    questionId;

    constructor(data) {
        this.id = data.id;
        this.text = data.text;
        this.isCorrect = data.is_correct;
        this.questionId = data.question_id;
    }

    asJsonForQuestion() {
        return {
            id: this.id,
            text: this.text
        }
    }
    asJsonForAnswer() {
        return {
            id: this.id,
            isCorrect: this.isCorrect
        }
    }
}

async function getAnswersForQuestion(questionId) {
    const res = await pgClient.query("SELECT * FROM answers WHERE question_id = $1;", [questionId]);
    console.log(res.rows[0]);
    return res.rows.map(g => new Answer(g))
}

async function getSolutionForQuestion(questionId) {
    const res = await pgClient.query("SELECT * FROM answers WHERE question_id = $1;", [questionId]);

    return res.rows.map(g => new Answer(g))
}

module.exports = { Answer, getAnswersForQuestion, getSolutionForQuestion };