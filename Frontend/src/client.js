// #################### Variable #######################################################
let current_answers_total = 0;

// #################### new Question / GET #############################################


function getData() {
  fetch("http://localhost:4000/question/random")
    .then((response) => response.json())
    .then((json) => create_buttons(json))
    .catch((error) => console.log(error));

    current_answers_total = 0;

    function create_buttons(quiz_data){
      
      current_id = quiz_data.id;

      document.getElementById("question").innerHTML = quiz_data.question;

      const container = document.getElementById("answer_buttons");
      quiz_data.answers.forEach((answer, i) => 
      {
        const button = document.createElement('button');
        button.id = "answer_" + (i + 1);
        button.addEventListener("click", function logQuestion(id) {check_answer_backend(id)})
        button.textContent = answer.text;
        container.appendChild(button);
        current_answers_total++;
      })
    const containerNextButton = document.getElementById("next_button");
    const nextButton = document.createElement('button');
    nextButton.id ="next";
    nextButton.addEventListener("click", function next() {load_new_question_and_reset_colors()})
    nextButton.textContent = "Next Question";
    containerNextButton.appendChild(nextButton);
    }
}
getData();


// #################### check Answer / POST #############################################

function check_answer_backend(id) {
  id = current_id
  const fetchConfig = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
    }),
  };

  fetch("http://localhost:4000/question/check_answer", fetchConfig)
    .then((res) => res.json())
    .then((json) => check_answers(json))
    .catch((error) => console.log(error));


  function check_answers(res) {
    res.forEach((answer) => {
      for (let i = 1; i < res.length + 1; i++) {
      const index_id = "answer_" + i;
      if (String(answer.text) === document.getElementById(index_id).innerHTML) {
        if (answer.isCorrect === true) {
          document.getElementById(index_id).style.backgroundColor = "green";
        } else {
          document.getElementById(index_id).style.backgroundColor = "red";
        }
      }
    }
    })
  }
}

// ############### Next Question + Reset Button Color ##################

function load_new_question_and_reset_colors() {
  resetAnswers();
  getData();
}


function resetAnswers() { // bitte iterieren
  for (let i = 1; i < current_answers_total + 1; i++) {
  document.getElementById("answer_" + i).remove();
  }
  document.getElementById("next").remove();
}
