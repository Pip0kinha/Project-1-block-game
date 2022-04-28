//Start Game button

window.onload = () => {
  document.getElementById("start-button").onclick = () => {
    startGame();
  };

  function startGame() {
    const game = new Game();
    game.start();
  }
};

//Mute/Restart music button

var un_mute = document.getElementById('un-mute');

un_mute.onclick = function() {
   alert(game.starGameMusic.play());
};