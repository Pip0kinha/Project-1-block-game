
   window.onload = () => {
    document.getElementById('start-button').onclick = () => {
      startGame();
      /* let starGameMusic = new Audio("/docs/assets/sounds/background-music.wav");
      starGameMusic.play(); */
    };
  
    function startGame() {
      const game = new Game();
      game.start();
    
    } 
  };