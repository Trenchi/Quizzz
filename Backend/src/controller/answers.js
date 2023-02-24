const { Answer, getSolutionForQuestion } = require("../models/answer");

async function checkAnswer(request, response) {

// console.log(request.body.id);
const answers = await getSolutionForQuestion(request.body.id);

// console.log(answers);
response.send(answers);
}

module.exports = { checkAnswer };