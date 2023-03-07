// #################### Variables ####################################################### 

let current_id = 1;
let current_answers_total = 0;
let dont_ask = [];
let user_answer = "";
let questionsTotalDB = 0;

// ###################### POST Next Question + Check Answers ################

// triggers when the user clicks the next button and calls the create() function
function getNextQuestion() {

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
}

// triggers when the user clicks any answer button and calls the checkAnswers() function
function check_answer_backend() {

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
    .then((json) => checkAnswers(json))
    .catch((error) => console.log(error));
}
// ################################## functions #############################

// *Important function that triggers when user clicks "Next Question" or when the timmer ends
function create(quiz_data) {

  resetPriorQuestion()

  questionsTotalDB = quiz_data.countTotal;
  current_id = quiz_data.id;

  createQuestionLine(quiz_data);
  createButtonAnswer(quiz_data);
  createButtonNext(quiz_data);
  createCountdown();
}

// ----------------------------------------------------------------

function resetPriorQuestion() {
  if (document.getElementById("answer_1")) {
    resetAnswers(); // if so reset the answers 
    deleteTimer(); // and reset timer
  };
}

function resetAnswers() {
  for (let i = 1; i < current_answers_total + 1; i++) {
    document.getElementById("answer_" + i).remove();
    const br = document.querySelector('#br br');
    br.remove();
  }
  document.getElementById("next").remove();
}

function createQuestionLine(quiz_data) {
  document.getElementById("question").innerHTML = quiz_data.question;
}

function createButtonAnswer(quiz_data) {
  current_answers_total = 0;
  const container = document.getElementById("answer_buttons");
  quiz_data.answers.forEach((answer, i) => {
    const button = document.createElement("button");
    button.id = "answer_" + (i + 1);
    button.addEventListener("click", function (event) {
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
  });
}

function createButtonNext() {
  const containerNextButton = document.getElementById("next_button");
  const nextButton = document.createElement("button");
  nextButton.id = "next";
  nextButton.addEventListener("click", function next() {
    getNextQuestion();
    playSound();
  });
  nextButton.textContent = "Next Question";
  containerNextButton.appendChild(nextButton);
}

function checkAnswers(res) {
  res.forEach((answer) => {
    for (let i = 1; i < res.length + 1; i++) {
      const index_id = "answer_" + i;
      if (
        String(answer.text) === document.getElementById(index_id).innerHTML
      ) {
        if (answer.isCorrect === true) {
          document.getElementById(index_id).style.backgroundColor = "green";
          if (user_answer == answer.text) {
            dont_ask.push(answer.questionId);
            if (questionsTotalDB == dont_ask.length) {
              dont_ask = [0];
            }
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

// ############### Progress Timer Bar ##################

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

function createCountdown() {
  createProgressbar('progressbar1', '5s', function () {
    getNextQuestion();
    playSound();
    // console.log("Hier Next Question Button anbinden!")
    // alert('20s progressbar is finished!');
  });
};

function deleteTimer() {
  let element = document.getElementById('progressbar1');
  element.querySelectorAll('*').forEach(n => n.remove());
  // countdown();
}

// ################### Play Sound ########################

function playSound() {
  // ACHTUNG: SOUNDDATEI MUSS IM "DIST" Ordner LIEGEN!!!
  // Die Ordnerstruktur muss nicht sein, nur die Datei.
  let sound = document.getElementById("notification-sound");
  sound.currentTime = 0;
  sound.volume = 0.35; // A double values must fall between 0 and 1, where 0 is effectively muted and 1 is the loudest possible value.
  sound.play();
}

// #######################################################
// ############## MAIN ###################################
// #######################################################

getNextQuestion();
// getData();
// countdown();