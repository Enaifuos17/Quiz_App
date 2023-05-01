// * Elements
let countSpan = document.querySelector(".quiz-app .quiz-info .count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".quiz-app .bullets .spans");
let quizArea = document.querySelector(".quiz-app .quiz-area");
let answersArea = document.querySelector(".quiz-app .answrs-area");
let submitButton = document.querySelector(".quiz-app button.submit-button");
let resultsContainer = document.querySelector(".quiz-app .results");
let countdownElement = document.querySelector(".quiz-app .bullets .countdown");
console.log(submitButton);

// set options
let currentIndex = 0;
let totalRightAnswers = 0;
let coundDownInterval;

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      // console.log(this.responseText); // as text
      let questionsObj = JSON.parse(this.responseText);
      console.log(questionsObj);
      let questionsCount = questionsObj.length;
      console.log(questionsCount);

      // create bullets + set questions count
      createBullets(questionsCount);

      // add questions data
      addQuestionsData(questionsObj[currentIndex], questionsCount);

      // start countdown
      countDown(20, questionsCount);

      // click on submit
      submitButton.onclick = () => {
        // get the right answer
        let theRightAnswer = questionsObj[currentIndex].right_answr;

        // increase index to move to the next question
        currentIndex++;

        // check the answer
        checkAnswer(theRightAnswer, questionsCount);

        // remove previous questions
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        // add questions data
        addQuestionsData(questionsObj[currentIndex], questionsCount);

        // handle bullets class
        handleBullets();

        // countdown
        clearInterval(coundDownInterval);
        countDown(20, questionsCount);

        // show results
        showResults(questionsCount);
      };
    }
  };

  myRequest.open("GET", "questions.json", true);
  myRequest.send();
}

getQuestions();

// * Function that creates bullets on how many questions we have
function createBullets(numQ) {
  countSpan.innerHTML = numQ;

  // create spans
  for (let i = 0; i < numQ; i++) {
    // create bullet
    let theBullet = document.createElement("span");

    // check if its first bullet (span)
    if (i === 0) {
      theBullet.className = "on";
    }

    // append the bullet to the main bullet container
    bulletsSpanContainer.appendChild(theBullet);
  }
}

function addQuestionsData(obj, count) {
  // * continue while there still questions
  // count is the length of obj
  if (currentIndex < count) {
    // create h2 question title
    let questionTitle = document.createElement("h2");
    // create question text
    let questionText = document.createTextNode(obj["title"]);
    // append text to h2
    questionTitle.appendChild(questionText);
    // append h2 with it text to quiz-area
    quizArea.appendChild(questionTitle);

    // create answers
    let numberOfAnswers = 4;
    for (let i = 1; i <= numberOfAnswers; i++) {
      // create main answer div
      let mainDiv = document.createElement("div");
      // add class to mainDiv
      mainDiv.className = "answr";

      // create radio inputs
      let radioInput = document.createElement("input");
      // add type + name + id + data-attribute to the input
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answr_${i}`;
      radioInput.dataset.answer = obj[`answr_${i}`];

      // make first option checked
      if (i === 1) {
        radioInput.checked = true;
      }

      // create label
      let theLabel = document.createElement("label");

      // add for attribute
      theLabel.htmlFor = `answr_${i}`; // SAME AS THE ID

      // create label text
      let theLabelText = document.createTextNode(obj[`answr_${i}`]);

      // add the text to label
      theLabel.appendChild(theLabelText);

      // add the input and the label to the MAIN DIV
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      // add the mainDiv to the answersArea
      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rightAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked === true) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rightAnswer === theChoosenAnswer) {
    totalRightAnswers++;
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans); // create array from them
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults;
  // currentIndex === count ---> means that the questions are finished
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();

    if (totalRightAnswers > count / 2 && totalRightAnswers < count) {
      theResults = `<span class="good">Good</span>, ${totalRightAnswers} From ${count} Is Good`;
    } else if (totalRightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span>, ${totalRightAnswers} From ${count} All Answers Are Good`;
    } else {
      theResults = `<span class="bad">Bad</span>, ${totalRightAnswers} From ${count}`;
    }

    resultsContainer.innerHTML = theResults;
    // some styles
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "#fff";
    resultsContainer.style.marginTop = "10px";
    resultsContainer.style.borderRadius = "6px";
  }
}

function countDown(duration, count) {
  // if there still questions
  if (currentIndex < count) {
    let minutes, seconds;
    coundDownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60); // rest

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(coundDownInterval);
        console.log("END");
        submitButton.click();
      }
    }, 1000);
  }
}
