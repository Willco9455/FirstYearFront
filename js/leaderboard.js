var gamePin = localStorage.getItem('pin')
const socket =  io('https://first-year-project-personal.herokuapp.com');

// scoket connections below 
socket.on("connect", () => {
    console.log(socket.id + 'connected on lobby'); 
    socket.emit('cJoinRoom', gamePin)
})

var players = []
var leaderboard = []
var hostId = undefined
var quiz = undefined 


async function pageLoad() {
    // waits to recive playesrs array from server and hostId from server
    quiz = await getQuiz()  
    players = quiz.players
    hostId = quiz.hostId

    // sorts the array of players from hightest score to lowest score
    leaderboard = players.sort((a, b) => b.score - a.score)

    // adds the top 5 players to the list 
    for (let i = 0; i < 5; i++) {
        try {
            var user = leaderboard[i]
            const element = document.createElement("div")
            element.className = "boxes"
            element.appendChild(document.createTextNode(`${i + 1}. ${user.uname} - ${user.score}`));
            document.getElementById('board').appendChild(element);
        } catch(err) {
            console.log(err)
            continue
        }
    }
    // checks if the user currently viewing page is the host and displays the next question option if they are
    // will not display next question button if th quiz has ended
    if ((localStorage.getItem('host') == 'true') && (quiz.qnum < quiz.questions.length - 1)) {
        document.getElementById('button').style.display = 'block'
        document.getElementById('endButton').style.display = 'block'
    } 

    // if questions have not finished
    if (quiz.qnum < quiz.questions.length - 1) {
        // shows question number
        document.getElementById('question').innerHTML = `After Question ${quiz.qnum + 1}`
    } else { // if questions have finished 
        document.getElementById('endButton').style.display = 'block'
        document.getElementById('question').innerHTML = `FINAL STANDINGS`
        // if questions have finished and you are the host of the game
        if ((localStorage.getItem('host') == 'true') && (quiz.qnum < quiz.questions.length - 1)) {
            document.getElementById('button').style.display = 'block'
            document.getElementById('endButton').style.display = 'block'
        } 
    }
}


// gets quiz object from server
function getQuiz() {
    return new Promise(resolve => socket.emit('cGetQuiz', gamePin, data => {
      resolve(data)
    }))
}

// tells the server the next question button has been pressed
function nextQButton() {
    socket.emit('cNextQ', gamePin)
}

// when the end quiz button is pressed
function endQuiz() {
    socket.emit('cEndQuiz', gamePin)
    localStorage.clear()
}

// listener for server sending nextQuestion update,, will reload the questions
socket.on('sNextQ', function() { 
    document.location.href = "./gameplay.html";
})

socket.on('sEndQuiz', function() {
    localStorage.clear()
    document.location.href = "./index.html";
})

//loads leaderboard page
pageLoad()