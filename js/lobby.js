var uname = localStorage.getItem("uname")
var gamePin = localStorage.getItem("pin")
if (uname == null && localStorage.getItem('host') !== 'true') { 
  window.alert("you need to enter a username first!")
  window.location.href = "./";
}

const socket =  io('http://first-year-project-personal.herokuapp.com');
var quiz = undefined
var players = []

// scoket connections below 
socket.on("connect", () => {
    console.log(socket.id + 'connected on lobby'); 
    socket.emit('cJoinRoom', gamePin)
})
  
// on response to a user joing the game the sever has sent the new users name as the argument
socket.on('sUserJoined', (arg) => {
  console.log(`new user joined ${arg}`)
  loadPage()
})


socket.on('sLobbyCleared', arg => {
  console.log('got clearance')
  loadPage()
})

socket.on('sGameStarted', arg => {
  window.location.href = './gameplay.html';
})

function addUser(uname) {
  var div = document.getElementById('usernames')
  var newPara = document.createElement('div');
  newPara.innerHTML = uname
  div.appendChild(newPara)
}


function startGame() {
  socket.emit('cHostStartGame', gamePin)
  console.log('host started game')
}

// will get the current question number returns as a resolved promise so it can be used asynchronously
function getQuiz() {
  return new Promise(resolve => socket.emit('cGetQuiz', gamePin, data => {
    resolve(data)
  }))
}


// page loading stuff
async function loadPage() {

  // gets quiz details from server
  quiz = await getQuiz()
  console.log(quiz)

  // get array of players usernames from the quiz object
  players = quiz.players.map(obj => {
    return obj.uname
  })

  // adds usernames to html
  document.getElementById('usernames').innerHTML = '';
  for (i of players) {
    addUser(i)
  }

  // displays game pin
  document.getElementById('pin').innerHTML = `Pin - ${localStorage.getItem('pin')}`

  // stuff for if the user is the host of the game
  if (localStorage.getItem('host') == 'true') {
    document.getElementById('startButton').style.display = 'block';
  }


}
loadPage()