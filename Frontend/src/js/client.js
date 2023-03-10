// #################### Variables #######################################################

let current_id = 1;
let current_answers_total = 0;
let dont_ask = [];
let user_answer = "";
let questionsTotalDB = 0;
let highscore = 0;
let answerGiven = true;
let timer = null;
let timePerQuestion = 20;
let pointConversion = 1;
let countQuestions = 0;
let questionsPerGame = 10;
let addScore = 0;
let streak = 0;
let bonusScore = 0;
let gameMode = "";


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

  if (answerGiven === false) {
    addScore = -500;
    highscore += addScore;
    document.getElementById("score").innerHTML = "Score: " + highscore;
    document.getElementById("scoreAdd").innerHTML = " " + addScore;

    checkPoints(false);
    // console.log("no answer - 500");
  }
  answerGiven = false;

  // console.log("current highscore " + highscore);

  resetPriorQuestion()

  if (gameMode === "arcade") {
  if (countQuestions < questionsPerGame) {
    // console.log(countQuestions)
    countQuestions++;
    questionsTotalDB = quiz_data.countTotal;
    current_id = quiz_data.id;

    createQuestionLine(quiz_data);
    createButtonAnswer(quiz_data);
    createCountdown();
    createButtonNext(quiz_data);
    createButtonEnd();
  } else {
    endGame();
  }
} else if (gameMode === "sandbox"){
      // console.log(dont_ask.length);
      // console.log(questionsTotalDB)
    if (dont_ask.length < questionsTotalDB){
      current_id = quiz_data.id;
  
      createQuestionLine(quiz_data);
      createButtonAnswer(quiz_data);
      createCountdown();
      createButtonNext(quiz_data);
      createButtonEnd();
    } else {
      sandBoxEndscreen();
    }
  }
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
    //NOTE REMOVE BR BETWEEN ANSWER BUTTONS- const br = document.querySelector('#br br');
    //NOTE REMOVE BR BETWEEN ANSWER BUTTONS- br.remove();
  }
  document.getElementById("next").remove();
  document.getElementById("end").remove();
}

function createQuestionLine(quiz_data) {
  document.getElementById("question").innerHTML = quiz_data.question;
}

function createButtonAnswer(quiz_data) {
  current_answers_total = 0;
  const container = document.getElementById("answer_buttons");
  quiz_data.answers.forEach((answer, i) => {
    const button = document.createElement("button");
    button.classList.add("styled-button");
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
    // NOTE - ADD "BR" BETWEEN ANSWER BUTTONS const lineBreak = document.createElement("br"); // Add BR
    // NOTE - ADD "BR" BETWEEN ANSWER BUTTONS container.appendChild(lineBreak);               // Add BR
  });
}

function createButtonNext() {
  const containerNextButton = document.getElementById("next_button");
  const nextButton = document.createElement("button");
  nextButton.id = "next";
  nextButton.addEventListener("click", function next() {
    // console.log(streak);
    if (gameMode == "sandbox" && dont_ask.length == questionsTotalDB ) {
      resetPriorQuestion()
      resetQuestionId();
      sandBoxEndscreen();
    } else {
    getNextQuestion();
  }
    // playSound("BonusPoint");
  });
  nextButton.textContent = "Next Question";
  containerNextButton.appendChild(nextButton);
}

function createButtonEnd() {
  const containerEndButton = document.getElementById("endGame");
  const endButton = document.createElement("button");
  endButton.classList.add("micro-buttons");
  endButton.id = "end";
  endButton.addEventListener("click", function end() {
    playSound("game-over");
    clearHighscore();
    resetPriorQuestion();
    if (gameMode === "sandbox" ) {
      sandBoxEndscreen()
      } else {
        endGame();
    };
  });
  endButton.textContent = "End Game";
  containerEndButton.appendChild(endButton);
}

//NOTE - Clear Top Highscore by clicking on "End Game" Button
function clearHighscore() {
  document.getElementById("scoreAdd").innerHTML = "";
  document.getElementById("scoreBonus").innerHTML = "";
  document.getElementById("score").innerHTML = "";
}

function checkAnswers(res) {
  res.forEach((answer) => {
    for (let i = 1; i < res.length + 1; i++) {
      const index_id = "answer_" + i;
      if (
        String(answer.text) === document.getElementById(index_id).innerHTML
      ) {
        if (answer.isCorrect === true) {
          document.getElementById(index_id).style.backgroundColor = "#02A611";
          if (user_answer == answer.text) {
            answerGiven = true;
            // console.log("correct");
            playSound("bonus-points");
            checkPoints(true);
            // console.log("+ " + 1000 * pointConversion);
            // console.log("current highscore " + highscore);
            dont_ask.push(answer.questionId);
            if (questionsTotalDB == dont_ask.length && gameMode === "arcade") {
              dont_ask = [0];
            }
            // console.log(res.length);
            blockButtons();
          } else {
            answerGiven = true;
            console.log("wrong");
            playSound("wrong");
            console.log("- 500")
            console.log("current highscore " + highscore);
            checkPoints(false)
            console.log(highscore);
            blockButtons();
          }
        } else {
          document.getElementById(index_id).style.backgroundColor = "#A60297";
        }
      }
    }
  });
}

function checkPoints(correct) {
  let actionText = "";
  if (correct === true) {
    streak++;
    if (streak === 1) {
      bonusScore = 0;
      actionText = "Alright, keep going!";
    } else if (streak === 2) {
      bonusScore = 200
      actionText = "Double Trouble!";
    } else if (streak === 3) {
      bonusScore = 300
      actionText = "C-C-C-ombo!";
    } else if (streak === 4) {
      bonusScore = 400
      actionText = "4 the win!";
    } else if (streak > 4) {
      bonusScore = 500
      actionText = "GODLIKE!";
    }

    addScore = 1000 * pointConversion;
    highscore += addScore;
    highscore += bonusScore;

    document.getElementById("scoreAdd").innerHTML = "+" + addScore;
    document.getElementById("scoreBonus").innerHTML = actionText + "+" + bonusScore;
    document.getElementById("score").innerHTML = "Score: " + highscore;

  } else if (correct === false) {
    if (answerGiven === true) {
      streak = 0;
      addScore = -750;
      actionText = "Ouch!"
      highscore += addScore;
      document.getElementById("score").innerHTML = "Score: " + highscore;
      document.getElementById("scoreAdd").innerHTML = " " + addScore;
      document.getElementById("scoreBonus").innerHTML = actionText;
    } else {
      streak = 0;
      addScore = -500;
      actionText = "Ouch!"
      highscore += addScore;
      document.getElementById("score").innerHTML = "Score: " + highscore;
      document.getElementById("scoreAdd").innerHTML = " " + addScore;
      document.getElementById("scoreBonus").innerHTML = actionText;
    }
  }
}

function blockButtons() {
  for (let i = 1; i < current_answers_total + 1; i++) {
    document.getElementById("answer_" + i).disabled = true;
  }
}

function endGame() {

  document.getElementById("question").innerHTML = `
  <div style="padding: 125px;">
  <h2>You're Score</h2>
  <p>${highscore}</p>
  <input style="text-align:center; font-family: OrbitronCustom;" id="userName" placeholder="Enter Name" value="" /> <br>
  <button class="micro-buttons" id="submitScoreButton">Submit Score</button>
  </div>
  `;
  const submitScoreButton = document.getElementById("submitScoreButton");
  submitScoreButton.addEventListener("click", function submitScore() {
    userName = document.getElementById("userName").value;
    countQuestions = 0;
    dont_ask = [];
    resetQuestionId();
    postHighscore(userName);
    playSound("yeah");
  });


};

function resetQuestionId() {
  document.getElementById("question").innerHTML = "";
};

function postHighscore(userName) {

  const fetchConfig = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: userName,
      points: highscore,
    }),
  };

  fetch("http://localhost:4000/highscore", fetchConfig)
    .then((res) => res.json())
    .then((json) => highscoreScreen(json))
    .catch((error) => console.log(error));

};

function highscoreScreen(highscoreData) {
  const highscoreScreen = document.getElementById("question");
  const highscoreList = document.createElement("highscoreList");
  highscoreList.classList.add("highscoreList"); // MAIK
  highscoreList.innerHTML = `
    <table class="tableCenter" id="highscoreTable">
      <tr>
        <th>Rank</th>
        <th>Name</th>
        <th>Score</th>
      </tr>
    </table>
    `;
  highscoreScreen.appendChild(highscoreList);

  const table = document.getElementById("highscoreTable");
  highscoreData.highscore.forEach((rowData, i) => {
    const highscoreRow = document.createElement("tr");
    const highscoreEntryRank = document.createElement("td");
    highscoreEntryRank.textContent = rowData.position;
    const highscoreEntryName = document.createElement("td");
    highscoreEntryName.textContent = rowData.username;
    const highscoreEntryScore = document.createElement("td");
    highscoreEntryScore.textContent = rowData.points;
    highscoreRow.appendChild(highscoreEntryRank);
    highscoreRow.appendChild(highscoreEntryName);
    highscoreRow.appendChild(highscoreEntryScore);
    table.appendChild(highscoreRow);
  })

  const userScore = document.createElement("userRank")
  userScore.innerHTML = `
    <br>
    <p style="font-size:30px;">YOUR RANK:</p>
    <p style="font-size:35px;">${highscoreData.position}</p>
    <p style="font-size:30px;"><i>${highscoreData.quote}</i></p>
    <button class="micro-buttons" id="restartGame">Try Again</button>
    <br>
    `
  highscoreList.appendChild(userScore)

  document.getElementById("restartGame").addEventListener("click", function restartGame() {
    highscoreList.remove();
    clearHighscore();
    dont_ask = [];
    highscore = 0;
    countQuestions = 0;
    getNextQuestion();
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
};

function createCountdown() {
  createProgressbar('progressbar1', timePerQuestion + 's', function () {
    getNextQuestion();
    playSound("wrong");
  });
  clearInterval(timer);
  let secondsLeft = timePerQuestion;
  timer = setInterval(function () {
    secondsLeft -= 1;
    pointConversion = secondsLeft / timePerQuestion
  }, 1000);
};

function deleteTimer() {
  let element = document.getElementById('progressbar1');
  element.querySelectorAll('*').forEach(n => n.remove());
  // countdown();
};


// ################### Play Sound ########################

// function playSoundCoin() {
//   // ACHTUNG: SOUNDDATEI MUSS IM "DIST" Ordner LIEGEN!!!
//   // Die Ordnerstruktur muss nicht sein, nur die Datei.
//   let soundCoin = document.getElementById("notification-coin");
//   soundCoin.currentTime = 0;
//   soundCoin.volume = 0.35; // A double values must fall between 0 and 1, where 0 is effectively muted and 1 is the loudest possible value.
//   soundCoin.play();
// };

/* Play Sound File Beta Test */

function playSound(soundId) {
  let sound = document.getElementById(soundId);
  if (sound) {
    sound.currentTime = 0;
    sound.volume = 0.35;
    sound.play();
  } else {
    console.log(`Could not find audio element with id ${soundId}`);
  }
}

/* Play Sound File Beta Test */

// #######################################################
// ############## MAIN ###################################
// #######################################################

menu();

function menu() {

  document.getElementById("question").innerHTML = `
  <div style="padding: 45px;">
  <h2>Choose Play Mode</h2>
  <button class="micro-buttons" id="startArcadeButton">Arcade</button>
  <button class="micro-buttons" id="startSandboxButton">Sandbox</button>
  </div>
  `;
  const startArcadeButton = document.getElementById("startArcadeButton");
  startArcadeButton.addEventListener("click", function startArcade() {
    gameMode = "arcade";
    questionsPerGame = 10;
    resetQuestionId();
    getNextQuestion()
  });

  const startSandboxButton = document.getElementById("startSandboxButton");
  startSandboxButton.addEventListener("click", function startSandbox() {
    gameMode = "sandbox";
    resetQuestionId();
    sandboxPage();
  });

};

function sandboxPage() {
  document.getElementById("question").innerHTML = `
  <div id="firstStartButtonSandbox">
  <h2 style="margin: 0;">Choose which questions:</h2>
  </div>
  <button class="micro-buttons" id="selectAllTrue" onclick="selectAllTrue()" >Select All</button>
  <button class="micro-buttons" id="SelectAllFalse" onclick="selectAllFalse()">Deselect All</button>
  <p></p>
  <div id="listAllQuestions">
  `;

  createStartButtonSandbox(firstStartButtonSandbox);

  fetch("http://localhost:4000/question/all")
    .then((res) => res.json())
    .then((json) => getQuestionsTotalDB(json))
    .catch((error) => console.log(error))

  function getQuestionsTotalDB(json) {
    const listAllQuestions = document.getElementById("listAllQuestions")
    // const question = document.createElement(question)
    json.forEach((question) => {

      const questions = document.createElement("item");
      questions.id = "question_" + question.id;
      questions.innerHTML = `
      <input type="checkbox" name="box" class="uk-checkbox" value=${question.id} id="${question.id}" checked="true"> No. ${question.id}: ${question.question}<br>
      <br>
      `
      listAllQuestions.appendChild(questions);
    })
    createStartButtonSandbox(question);
  }


  function createStartButtonSandbox(position) {
    const button = document.createElement("button");
    button.id = "submitQuestionButton";
    button.classList.add("styled-button");
    button.innerHTML = "Start Game";
    button.addEventListener("click", function submitQuestion() {

      var checkboxes = document.getElementsByName('box');

      // looping through all checkboxes
      for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked === false) {
          dont_ask.push(checkboxes[i].value);
        }
      }
      // console.log(checkboxes.length)
      questionsPerGame = checkboxes.length - dont_ask.length;
      questionsTotalDB = checkboxes.length;
      resetQuestionId();
      getNextQuestion();
    });
    position.appendChild(button);

    // const p_tag = document.createElement("p");
    // p_tag.innerHTML = "<p>";
    // p_tag.classList.add("p-tag");
    // position.appendChild(p_tag);
  }
}

function selectAllTrue() {
  var checkboxes = document.getElementsByName('box');

      // looping through all checkboxes
      for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = true;
      }
}

function selectAllFalse(){
  var checkboxes = document.getElementsByName('box');

      // looping through all checkboxes
      for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
      }
}

function sandBoxEndscreen() {

  document.getElementById("question").innerHTML = `
  <div style="padding: 125px;">
  <h2>Good job, all questions answered correct once!</h2>
  <div>${highscore}</div>
  <br>
  <button class="micro-buttons" id="goBackButton">Go back to Menu</button>
  </div>
  `;
  const goBackButton = document.getElementById("goBackButton");
  goBackButton.addEventListener("click", function goToMenu() {
    dont_ask = [];
    countQuestions = 0;
    resetQuestionId();
    menu()
  });
  
}