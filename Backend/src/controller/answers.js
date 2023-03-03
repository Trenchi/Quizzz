const { getAnswersForQuestion } = require("../models/answer");

async function checkAnswer(request, response) {
const answers = await getAnswersForQuestion(request.body.id);
response.send(answers);
}

module.exports = { checkAnswer };