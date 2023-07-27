const socket = io("/waiting_room");

/*socket.on("connect",()=>{
    
})*/

socket.on("ready",()=>{
    console.log(socket.id);
    window.location.replace("/game/game_room");
});

socket.on("canceled", () => {
    window.location.replace("/");
});

// Annule la partie
function cancel() {
    socket.emit("cancel");
}

//Copie du code

function copier(copy){
    navigator.clipboard.writeText(copy).then(
        () => {
          /* clipboard successfully set */
        },
        () => {
          /* clipboard write failed */
        }
      );
}