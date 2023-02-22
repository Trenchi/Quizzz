const quizId = 1; // Hier die Quiz-ID einfügen
function getData() {
    fetch("http://localhost:4000/question/random").then((response)=>response.json()).then((data)=>{
        const dataContainer = document.getElementById("quiz-container");
        dataContainer.innerHTML = "";
        data.forEach((item)=>{
            const listQuestion = document.createElement("p");
            listQuestion.innerHTML = item.question;
            dataContainer.appendChild(listQuestion);
            const listAnswer1 = document.createElement("p");
            listAnswer1.innerHTML = item.answer_1;
            dataContainer.appendChild(listAnswer1);
            const listAnswer2 = document.createElement("p");
            listAnswer2.innerHTML = item.answer_2;
            dataContainer.appendChild(listAnswer2);
            const listAnswer3 = document.createElement("p");
            listAnswer3.innerHTML = item.answer_3;
            dataContainer.appendChild(listAnswer3);
            const listAnswer4 = document.createElement("p");
            listAnswer4.innerHTML = item.answer_4;
            dataContainer.appendChild(listAnswer4);
        });
    }).catch((error)=>console.error(error));
}

//# sourceMappingURL=index.cab1be00.js.map
