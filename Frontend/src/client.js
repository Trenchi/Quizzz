// #################### new Question / GET #############################################

let random_array = ["a","b","c","d"];

function getData() {
  fetch("http://localhost:4000/question/random")
    .then((response) => response.json())
    .then((json) => create_buttons(json))
    .catch((error) => console.log(error));



    function create_buttons(quiz_data){
      console.log(quiz_data);
      
      current_id = quiz_data.id;

      document.getElementById("question").innerHTML = quiz_data.question;

      const container = document.getElementById("buttons");
      quiz_data.answers.forEach((answer, i) => 
      {
        const button = document.createElement('button');
        button.id = "answer_" + (i + 1);
        button.addEventListener("click", function bla(id) {check_answer_backend(id)})
        console.log(answer.text)
        button.textContent = answer.text;
        container.appendChild(button);
      })}

      // array.forEach((answer, i) => 
      // {
      //   const button = document.createElement('button');
      //   button.textContent = answer;
      //   container.appendChild(button);
      // })}   

  // function fill_text_area(quiz_data) {

  //   current_id = quiz_data.id;

  //   document.getElementById("question").innerHTML = quiz_data.question;
  //   // document.getElementById("answer_1").innerHTML = quiz_data.answers[0].text;
  //   // document.getElementById("answer_2").innerHTML = quiz_data.answers[1].text;
  //   // document.getElementById("answer_3").innerHTML = quiz_data.answers[2].text;
  //   // document.getElementById("answer_4").innerHTML = quiz_data.answers[3].text;
  // }
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
      console.log(answer.tex)
      console.log(document.getElementById(index_id).innerHTML)
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
  document.getElementById("answer_1").remove();
  document.getElementById("answer_2").remove();
  document.getElementById("answer_3").remove();
  document.getElementById("answer_4").remove();
}
