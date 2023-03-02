// #################### Variables #######################################################

let current_id = 1;
let current_answers_total = 0;
const dont_ask = [0]; //
let user_answer = "";

// ###################### new Question / POST ########################################################

function getNextQuestion() {
  console.log(dont_ask);

  const fetchConfig = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dont_ask: dont_ask,
    }),
  };

  fetch("http://localhost:4000/question/random", fetchConfig)
    .then((res) => res.json())
    .then((json) => create(json))
    .catch((error) => console.log(error));

  function create(quiz_data) {
    console.log(dont_ask);
    if (document.getElementById("answer_1")) {
    resetAnswers();
    deleteTimer();
  };
    create_buttons(quiz_data);
    countdown();
  }
}

// #################### new Question / GET #############################################

// function getData() {
//   fetch("http://localhost:4000/question/random")
//     .then((response) => response.json())
//     .then((json) => create(json))
//     .catch((error) => console.log(error));

//   function create(quiz_data) {
//     create_buttons(quiz_data);
//   }
// }

// ################################## create Buttons #############################

function create_buttons(quiz_data) {
  current_answers_total = 0;
  current_id = quiz_data.id;

  document.getElementById("question").innerHTML = quiz_data.question;

  const container = document.getElementById("answer_buttons");
  quiz_data.answers.forEach((answer, i) => {
    const button = document.createElement("button");
    button.id = "answer_" + (i + 1);
    button.addEventListener("click", function (event) {
      // console.log(event.target);

      user_answer = event.target.innerHTML;
    });
    button.addEventListener("click", function logQuestion(id) {
      check_answer_backend(id);
    });
    button.textContent = answer.text;
    container.appendChild(button);
    current_answers_total++;

    const lineBreak = document.createElement("br"); // Add BR
    container.appendChild(lineBreak);               // Add BR

    // Scale button font-size
    // const buttonWidth = button.offsetWidth;
    // const textWidth = button.scrollWidth;
    // const scale = Math.min(1, buttonWidth / textWidth);
    // const fontSize = parseInt(window.getComputedStyle(button).getPropertyValue('font-size'));
    // button.style.fontSize = (fontSize * scale) + "px";
  });

  const containerNextButton = document.getElementById("next_button");
  const nextButton = document.createElement("button");
  nextButton.id = "next";
  nextButton.addEventListener("click", function next() {
    getNextQuestion();
  });
  nextButton.textContent = "Next Question";
  containerNextButton.appendChild(nextButton);
}

// ############### Next Question + Reset Button Color ##################

function resetAnswers() {
  for (let i = 1; i < current_answers_total + 1; i++) {
    document.getElementById("answer_" + i).remove();
    const br = document.querySelector('#br br');
    br.remove();
  }
  document.getElementById("next").remove();
}

// #################### check Answer / POST #############################################

function check_answer_backend() {
  // id = current_id;
  const fetchConfig = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: current_id,
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

        if (
          String(answer.text) === document.getElementById(index_id).innerHTML
        ) {
          if (answer.isCorrect === true) {
            document.getElementById(index_id).style.backgroundColor = "green";
            // console.log(user_answer);
            // console.log(answer);

            if (user_answer == answer.text) {
              console.log("correct");
              // console.log(answer.questionId);
              dont_ask.push(answer.questionId);
              console.log(dont_ask);

            } else {
              console.log("wrong");
            }

          } else {
            document.getElementById(index_id).style.backgroundColor = "red";
          }
        }
      }
    });
  }
}

// ############### Progress Timer Bar ##################

/*
 *  Creates a progressbar.
 *  @param id the id of the div we want to transform in a progressbar
 *  @param duration the duration of the timer example: '10s'
 *  @param callback, optional function which is called when the progressbar reaches 0.
 */
function createProgressbar(id, duration, callback) {
  // We select the div that we want to turn into a progressbar
  const progressbar = document.getElementById(id);
  progressbar.className = 'progressbar';

  // We create the div that changes width to show progress
  const progressbarinner = document.createElement('div');
  progressbarinner.className = 'inner';

  // Now we set the animation parameters
  progressbarinner.style.animationDuration = duration;

  // Eventually couple a callback
  if (typeof (callback) === 'function') {
    progressbarinner.addEventListener('animationend', callback);
  }

  // Append the progressbar to the main progressbardiv
  progressbar.appendChild(progressbarinner);

  // When everything is set up we start the animation
  progressbarinner.style.animationPlayState = 'running';
}

function countdown() {
  createProgressbar('progressbar1', '5s', function () {
    getNextQuestion();
    console.log("Hier Next Question Button anbinden!")
    // alert('20s progressbar is finished!');
  });
};


function deleteTimer() {
  let element = document.getElementById('progressbar1');
  element.querySelectorAll('*').forEach(n => n.remove());
  // countdown();
}


// #######################################################
// ############## MAIN ###################################
// #######################################################

getNextQuestion();
// getData();
// countdown();