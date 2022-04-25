const socket =  io('https://first-year-project-personal.herokuapp.com');
var unameElm = document.getElementById('name');
localStorage.clear()


socket.on("connect", () => {
  console.log(socket.id); 
  console.log('connected')
});

// function will run when 
socket.on('sJoinSuccess', arg => {
  if (arg != false) {
    localStorage.setItem('uname', unameElm.value)
    window.location.href = `./lobby.html`;
  }else {
    window.alert('Not a valid pin :(')
  }
})


function hostPress() {
  window.location.href = "./hostSetup.html";
}

async function joinPress() {
  // waits to see of join was successful 
  joined = await joinAttempt()
  if (joined) {
    localStorage.setItem('uname', unameElm.value)
    localStorage.setItem('pin', document.getElementById('pin').value)
    window.location.href = `./lobby.html`;
  } else {
    window.alert('Not a valid pin :(')
  }
};

// uses data in fields to attempt to join a quiz on the server and resolves with false or true depending on if the join was successful
function joinAttempt() {
  var uname = unameElm.value
  var pin = document.getElementById('pin').value
  return new Promise(resolve => socket.emit("cUsrJoinAttempt", {
      "pin": pin,
      "uname": uname,
    }, joined => {
      resolve(joined)
    }
  ));
}

// will get the current question number returns as a resolved promise so it can be used asynchronously
function getQuiz() {
  return new Promise(resolve => socket.emit('cGetQuiz', false, data => {
    resolve(data)
  }))
}
