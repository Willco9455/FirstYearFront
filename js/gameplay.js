const socket =  io('https://first-year-project-personal.herokuapp.com');

var quiz = undefined
var uname = localStorage.getItem('uname')
var gamePin = localStorage.getItem('pin')

//Create canvas
var canvas = document.getElementById("myCanvas");
var ctx=canvas.getContext("2d");
ctx.font="30px Comic Sans MS";
ctx.fillStyle = "red";
ctx.textAlign = "center";

//list of questions

//value of the correcons for c and d to match the answers option rectangles


var option_chosen;

async function optionGenerator() {
  // gets full quiz object from the database
  quiz = await getQuiz()
  // sets questions variable
  var questions = quiz.questions 
  var option1 = quiz.option1
  var option2 = quiz.option2
  var option3 = quiz.option3
  var option4 = quiz.option4
  var correct = quiz.correct

  //i is used in place of the question number
  // i becomes current question of quiz
  i = quiz.qnum

  // player stored on localstorage is retrived from the players array in quiz object
  player = await quiz.players.filter(obj => {
    return obj.uname === uname
  })[0]
  console.log(player)

  // error will throw if user is host
  try {
    var score = player.score
    document.getElementById("score").innerHTML = "Score: " + score;
  } catch(err) {
    var score = 'host'
  }

  // adds score to page
  var circleStart = 1.5 * Math.PI;
  var circleEnd = circleStart;
  var timeLimit = 15000;
  var previousDistance = timeLimit;

  // displays the question and answer options
  document.getElementById("option1").innerHTML = option1[i];
  document.getElementById("option2").innerHTML = option2[i];
  document.getElementById("option3").innerHTML = option3[i];
  document.getElementById("option4").innerHTML = option4[i];
  document.getElementById("question").innerHTML = questions[i];

// timer code below

  // Update the count down every 1 second
  var countDownDate = new Date().getTime() + timeLimit;
  var now = new Date().getTime();
  var distance = countDownDate - now; 
  
  // timer while loop loops until timer has run out redrawing the timer
  while (distance > 0) {
    var now = new Date().getTime();
    var distance = countDownDate - now; 
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clears the canvas
    ctx.fillText(seconds + "s ", canvas.width/2, canvas.height/2);  // Displays remaing time in seconds on the canvas
    //Displays two circles around the timer

    //Displays a red circle
    ctx.beginPath();
    ctx.lineWidth = 13;
    ctx.strokeStyle = "Red";
    ctx.arc(canvas.width/2 -5, canvas.height/2 - 10, 75, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();

    //Displays a green circle
    ctx.strokeStyle = "#02de0d";
    ctx.arc(canvas.width/2 -5, canvas.height/2 - 10, 75, circleStart, circleEnd);
    circleEnd = circleEnd - (((previousDistance - distance)/timeLimit)*2*Math.PI);
    previousDistance = distance;
    ctx.stroke();
    await sleep(50)
  }

  // clears timer and replaces 
  ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clears the canvas
  ctx.fillText("Times Up", canvas.width/2, canvas.height/2);
  

  // if the user is the host then wait 3 seconds and redirect to leaderboard
  if ( localStorage.getItem('host') == 'true' ){
    // waits for 3 seconds 
    await sleep(3000);
    document.location.href = "./leaderboard.html";
    return
  }

  //checks the correct answer against the chosen answer
  if (correct[i] == option_chosen) {
    socket.emit('cAddPlayerScore', {'uname': uname, 'pin': gamePin})
    score++;
    document.getElementById("score").innerHTML = "Score:" + score;
    questionEnd(true)
  }else { 
    questionEnd(false)
  }

  await sleep(3000)
  document.location.href = "./leaderboard.html";

};



// These functions are called when an answer button is pressed. It
// stores the value of the option (1, 2, 3, 4), as a global variable,
// which is then checked against the correct answers value (1, 2, 3, 4)
function answer1() {option_chosen = 1;}
function answer2() {option_chosen = 2;}
function answer3() {option_chosen = 3;}
function answer4() {option_chosen = 4;}

// wills server functions 


// will get the current question number returns as a resolved promise so it can be used asynchronously
function getQuiz() {
  return new Promise(resolve => socket.emit('cGetQuiz', gamePin, data => {
    resolve(data)
  }))
}

// Screen that shows when question is over
function questionEnd(correct) {
  if (correct) {
    document.body.innerHTML = "<h1 class='answer'>Correct</h1>"
    document.body.style.backgroundColor = 'green'
  } else {
    document.body.innerHTML = "<h1 class='answer'>incorrect</h1>"
    document.body.style.backgroundColor = 'red'
  }
}

// sleep function used for in async fucnion to pause for certain amount of time
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

optionGenerator()


