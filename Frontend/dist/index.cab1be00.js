function getData() {
    fetch("http://localhost:4000/question/random").then((response)=>response.json()).then((json)=>fill_text_area(json)).catch((error)=>console.log(error));
    function fill_text_area(quiz_data) {
        console.log(quiz_data);
        document.getElementById("question").innerHTML = quiz_data.question;
        document.getElementById("answer_1").innerHTML = quiz_data.answer_1;
        document.getElementById("answer_2").innerHTML = quiz_data.answer_2;
        document.getElementById("answer_3").innerHTML = quiz_data.answer_3;
        document.getElementById("answer_4").innerHTML = quiz_data.answer_4;
    }
}
getData();

//# sourceMappingURL=index.cab1be00.js.map
