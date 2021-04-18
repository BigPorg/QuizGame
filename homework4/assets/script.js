let highscoreDiv = document.querySelector("#highscore");
let gameTimerEl = document.querySelector("#gameTimer");
let questionTimerEl = document.querySelector("#questionTimer");
let mainEl = document.querySelector("#details");
let timerTab = document.querySelector("#timers");

var test = false;
var score = 0;
var quiz = {};
var gameDuration = 0;
var gameSecElapsed = 0;
var gameInterval;
var questionDuration = 15;
var questionSecElapsed = 0;
var questionInterval;
var quizQuestions = [];

init();

//display instructions
function init() {
  clearDetails();
  reset();
  //heading
  let heading = document.createElement("p");
  heading.setAttribute("id", "main-heading");
  heading.textContent = "Take a timed quiz";

  let instructions = document.createElement("p");
  instructions.setAttribute("id", "instructions");
  instructions.textContent = "When the timer starts answer questions. Incorrect answers will deduct time. The quiz is over when you've answered all the questions or the timer reaches zero."
  
  //button to start game
  let startQuiz = document.createElement("button");
  startQuiz.setAttribute("id", "startQuiz");
  startQuiz.setAttribute("class", "btn btn-secondary");
  startQuiz.textContent= "Start Quiz";

  mainEl.appendChild(heading);
  mainEl.appendChild(instructions);
  mainEl.appendChild(startQuiz);

  startQuiz.addEventListener("click", function () {
    playQuiz(quizQuestions);
  });
}

//clear details element of all children
function clearDetails() {
  mainEl.innerHTML = "";
}

function reset() {
  score = 0;
  gameDuration = 0;
  gameSecElapsed = 0;
  gameInterval;
  questionDuration = 15;
  questionSecElapsed = 0;
  questionInterval;
}

//start game
function playQuiz(questionSet) {
  if (test) { console.log("quiz playing"); }
  // select quiz randomize questions
  
  quiz = setUpQuestions(questionSet);

  //timers start
  gameDuration = quiz.length * 15;
  if (test) { console.log("duration g,q:",gameDuration,questionDuration); }

  startGameTimer();
  renderTime();
  presentQuestion();
}

//get random question out of array
function setUpQuestions(arr) {
  if (test) {console.log("questions loaded");}

  let ranQuest = [];

  for (let i=0; i<arr.length; i++) {
    ranQuest.push(arr[i]);
  }
  return ranQuest;
}

// function to redraw screen with  question 
function presentQuestion() {
  if (test) {console.log("questions loaded 2");}

  //reset time allows to answer question
  questionSecElapsed = 0;

  //checks for no more questions and exits
  if ( quiz.length === 0 ) {
    endOfGame();
    return;
  }

  //sets current object (cur - question) by pulling out of reducedQuiz array leaving the remaining quetions in the array
  curQuestion = quiz.pop();

  //clears html to draw questions
  clearDetails();
   
  // add question to screen
  let question = document.createElement("h1");
  question.setAttribute("question", curQuestion.title);
  question.textContent = curQuestion.title;
  mainEl.appendChild(question)

  // create list as container to listen for answers
  let choiceBox = document.createElement("ul");
  choiceBox.setAttribute("id","choiceBox");
  mainEl.appendChild(choiceBox);

  //adds answers to screen
  for( let i=0; i<curQuestion.choices.length; i++ ) {
    //creates variable for each choice item
    let listChoice = document.createElement("li");
    //adds data value
    listChoice.setAttribute("choice-value", curQuestion.choices[i]);
    listChoice.setAttribute("id","questionNum-"+i);
    listChoice.textContent = curQuestion.choices[i];
    //add choice to page
    choiceBox.appendChild(listChoice)
  }

  if (test) { console.log("cur", curQuestion);}

  //get answer from user
  choiceBox.addEventListener("click", function (){
    scoreAnswer(curQuestion);
  });
  //calls for the next questions
}

function scoreAnswer(cur) {
  if (test) { console.log("--- scoreAnswer ---");}
 //ensure that the event on the li
  var e = event.target;
  if ( e.matches("li")) {
    let selectedItem = e.textContent;
    if (test) { console.log("selectedItem quiz " + selectedItem); }
    if ( selectedItem === cur.answer ) {
      score += questionDuration - questionSecElapsed;
    } else {
      if (test) { console.log("wrong answer");}
      gameDuration -= 10;
    }
  if (test) { console.log("sselected ",selectedItem);}
    showAnswers(cur);
  }
}

function showAnswers(cur) {
  if (test) { console.log("show answer"); }
  if (test) { console.log("sselected ",selectedItem);}


  for (let i=0; i<cur.choices.length; i++) {
    if (test) { console.log("show answer in for ",i);}

    let questid = "#questionNum-" + i;
    let questrow = document.querySelector(questid);

    if (test) { console.log("Selected" + selectedItem + "<");}
    if (test) { console.log("Color test >" +  cur.choices[i] +"<");}

    if ( cur.choices[i] !== cur.answer ) {
      if (test) { console.log("Color test false");}
      questrow.setAttribute("style","background-color: red");
    } else {
      if (test) { console.log("color test true");}
      questrow.setAttribute("style","background-color: green");
    }
  }
  setTimeout(presentQuestion,500);
}

function setGameTime() {
  if (test) { console.log("game time"); }
  if (test) { console.log("gameDuration " + gameDuration); }
  clearInterval(gameInterval);
  gameSeconds = gameDuration;
}

function renderTime() {

  if ( (questionDuration - questionSecElapsed) < 1 ) {
    gameDuration -= 10;
    if (test) { console.log("time out"); }
    presentQuestion();
  } 

  if ( (gameDuration - gameSecElapsed) < 1 ) {
   endOfGame();
  }
}

function startGameTimer () {
  if (test) { console.log("timer go"); }
  setGameTime();

  gameInterval = setInterval(function() {
    gameSecElapsed++; 
    questionSecElapsed++; 
    renderTime();
  }, 1000);
}

function stopTime() {
  if (test) { console.log("timer stop");}
  gameSeconds = 0;
  questionSeconds = 0;
  clearInterval(gameInterval);
}

// function of end of game
function endOfGame() {
  if (test) { console.log("game over"); }
  stopTime();
  clearDetails();

  let heading = document.createElement("p");
  heading.setAttribute("id", "main-heading");
  heading.textContent = "Game Over";

  // creates elements with the instructions for the game
  let instructions = document.createElement("p");
  instructions.setAttribute("id", "instructions");
  instructions.textContent = " Your score is " + score; 

  // creates button to start the game
  let playAgain = document.createElement("button");
  playAgain.setAttribute("id", "playAgain");
  playAgain.setAttribute("class", "btn btn-secondary");
  playAgain.textContent = "Play again?";

  // creates input for user to add initials
  let par = document.createElement("p");

  let initialsLabel = document.createElement("label");
  initialsLabel.setAttribute("for","userInitials");
  initialsLabel.textContent = "Enter Initials: ";

  let initialsInput = document.createElement("input");
  initialsInput.setAttribute("id","userInitials");
  initialsInput.setAttribute("name","userInitials");
  initialsInput.setAttribute("minlength","3");
  initialsInput.setAttribute("maxlength","3");
  initialsInput.setAttribute("size","3");


  mainEl.appendChild(heading);
  mainEl.appendChild(instructions);
  mainEl.appendChild(initialsLabel);
  mainEl.appendChild(initialsInput);
  mainEl.appendChild(par);
  mainEl.appendChild(playAgain);

  playAgain.addEventListener("click", init);

  initialsInput.addEventListener("input", function() {
    initialsInput.value = initialsInput.value.toUpperCase();
    if ( initialsInput.value.length === 3 ) { 

      //create object for this score
      let thisScore = [ {name: initialsInput.value, score: score } ]; 

      //get highscores from memory
      let storedScores = JSON.parse(localStorage.getItem("highScores")); 
      if (test) { console.log("storedScore",storedScores); }

      if (storedScores !== null) { 
        storedScores.push(thisScore[0]); 
      } else {
        storedScores = thisScore;
      }

      localStorage.setItem("highScores", JSON.stringify(storedScores));
      highScores();
    }
  });
}

function highScores() {
  stopTime();
  clearDetails();

  timerTab.setAttribute("style", "visibility: hidden;");

  //get scores from storage
  let storedScores = JSON.parse(localStorage.getItem("highScores")); 

  // draw heading
  let heading = document.createElement("h2");
  heading.setAttribute("id", "main-heading");
  heading.textContent = "Top 5 High Score Hall of Fame";

  mainEl.appendChild(heading);

  if ( storedScores !== null ) {
    storedScores.sort((a,b) => (a.score < b.score) ? 1: -1);

    let numScores2Display = 5;
    if ( storedScores.length < 5 ) { 
      numScores2Display = storedScores.length; 
    }

    for (var i = 0; i < numScores2Display; i++) {
      var s = storedScores[i];

      var p = document.createElement("p");
      p.textContent = s.name + " " + s.score + " ( " + s.type + " )";
      mainEl.appendChild(p);
    }
  } else {
    var p = document.createElement("p");
    p.textContent =  "Your Initials Here!"
    mainEl.appendChild(p);
  }


  //button to start the game
  let playAgain = document.createElement("button");
  playAgain.setAttribute("id", "playAgain");
  playAgain.setAttribute("class", "btn btn-secondary");
  playAgain.textContent = "Play";

  mainEl.appendChild(playAgain);

  playAgain.addEventListener("click", init);
}

highscoreDiv.addEventListener("click", highScores);