let current_id = 1


function getData() {
  fetch("http://localhost:4000/question/random")
    .then((response) => response.json())
    .then((json) => fill_text_area(json))
    .catch((error) => console.log(error));



  function fill_text_area(quiz_data) {

    current_id = quiz_data.id;

    document.getElementById("question").innerHTML = quiz_data.question;
    document.getElementById("answer_1").innerHTML = quiz_data.answers[0].text;
    document.getElementById("answer_2").innerHTML = quiz_data.answers[1].text;
    document.getElementById("answer_3").innerHTML = quiz_data.answers[2].text;
    document.getElementById("answer_4").innerHTML = quiz_data.answers[3].text;
  }
}
getData();


// #################### POST #############################################

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
    console.log(res);
    if (res[0].isCorrect === true) {
      document.getElementById("answer_1").style.color = "green";
      // console.log("answer1 is correct");
    } else {
      // console.log("answer1 is wrong");
      document.getElementById("answer_1").style.color = "red";
    }
    if (res[1].isCorrect === true) {
      document.getElementById("answer_2").style.color = "green";
      // console.log("answer1 is correct");
    } else {
      // console.log("answer1 is wrong");
      document.getElementById("answer_2").style.color = "red";
    }
    if (res[2].isCorrect === true) {
      document.getElementById("answer_3").style.color = "green";
      // console.log("answer1 is correct");
    } else {
      // console.log("answer1 is wrong");
      document.getElementById("answer_3").style.color = "red";
    }
    if (res[3].isCorrect === true) {
      document.getElementById("answer_4").style.color = "green";
      // console.log("answer1 is correct");
    } else {
      // console.log("answer1 is wrong");
      document.getElementById("answer_4").style.color = "red";
    }
  }


  
}