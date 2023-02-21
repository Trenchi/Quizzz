const quizId = 1; // Hier die Quiz-ID einfügen
fetch(`http://localhost:4000/quiz/${quizId}`).then((response)=>response.json()).then((data)=>{
    // Hier den Code einfügen, um die Daten auf der Frontend-Seite anzuzeigen
    const quizData = JSON.stringify(data); // Daten als JSON-String konvertieren
    const container = document.getElementById("quiz-container");
    container.textContent = quizData; // Daten in einem HTML-Element als Text anzeigen
}).catch((error)=>{
    console.error("Error:", error);
});
function getData() {
    fetch("http://localhost:4000/quiz/1").then((response)=>response.json()).then((data)=>{
        const dataContainer = document.getElementById("dataContainer");
        dataContainer.innerHTML = "";
        data.forEach((item)=>{
            const listItem = document.createElement("p");
            listItem.innerHTML = item.question;
            dataContainer.appendChild(listItem);
        });
    }).catch((error)=>console.error(error));
}

//# sourceMappingURL=index.cab1be00.js.map
