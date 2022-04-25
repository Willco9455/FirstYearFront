const socket =  io('http://first-year-project-personal.herokuapp.com');


socket.on("connect", () => {
  console.log(socket.id); 
  console.log('connected')
});



// will get the current question number returns as a resolved promise so it can be used asynchronously
function createGame(quizName) {
    return new Promise(resolve => socket.emit('cCreateGame', quizName, data => {
        resolve(data)
    }))
  }

async function main(quizName) {
    pin = await createGame(quizName)
    console.log(pin)
    await localStorage.setItem('host', 'true')
    await localStorage.setItem('pin', pin)
    window.location.href = "./lobby.html";
}
