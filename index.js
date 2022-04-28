window.onload = () => {
  const game = new Game();

  //Start Game button
  document.getElementById("start-button").onclick = () => {
    startGame();
  };

  function startGame() {
    game.start();
  }

  //Mute/Restart music button
  var un_mute = document.getElementById("un-mute");

  un_mute.onclick = function () {
    if (!game.isGameStarted) {
      un_mute.checked = false;
    }

    if (game.starGameMusic.paused && game.isGameStarted) {
      game.starGameMusic.play();
    } else {
      game.starGameMusic.pause();
    }
  };
};
