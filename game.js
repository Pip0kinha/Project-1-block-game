class Game {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.x = 0;
    this.y = 0;
    this.width = 1200;
    this.height = 600;
    this.intervalId = null;
    this.player = null;
    this.controls = null;
    this.obstaclesArray = [];
    this.frames = 0;
    this.score = 0;
    const img = new Image();
    img.addEventListener("load", () => {
      this.img = img;
    });
    img.src = "./docs/assets/imgs/game_over.jpg";
    this.newObsSound = new Audio("/docs/assets/sounds/new_obstacle.wav");
  }

  start() {
    this.drawLine();
    this.player = new Player(this, 390, 240, 120, 120);
    this.player.draw();
    this.controls = new Controls(this);
    this.controls.keyboardEvents();
    this.createRandomObstacle()
    this.intervalId = setInterval(() => {
      this.update();
    }, 1000 / 60);
  }

  update() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.frames++;
    this.score = Math.floor(this.frames / 60)
    this.drawBackground();
    this.drawLine();
    this.drawScores();
    this.player.draw();
    if (this.frames % 300 === 0) {
      this.createRandomObstacle();
      this.newObsSound.play();
    }
    this.obstaclesArray.forEach((obstacle) => {
      obstacle.x += obstacle.speedX;
      obstacle.y += obstacle.speedY;
      if (
        obstacle.y + obstacle.speedY > 540 ||
        obstacle.y + obstacle.speedY < 0
      ) {
        obstacle.speedY *= -1;
      }
      if (
        obstacle.x + obstacle.speedX > 840 ||
        obstacle.x + obstacle.speedX < 0
      ) {
        obstacle.speedX *= -1;
      }
      obstacle.drawObstacle();
    });
    this.obstaclesArray.forEach((obstacle) => {
      obstacle.drawObstacle();
    });
    this.checkGameOver();
  }
  createObstacleTop = () => {
    let randomX = Math.floor(Math.random() * 900);
    this.obstaclesArray.push(new Obstacles(this, randomX, 0, 30, 30, 3, 3));
  };

  createObstacleBottom = () => {
    let randomX = Math.floor(Math.random() * 840);
    this.obstaclesArray.push(new Obstacles(this, randomX, 540, 60, 60, 3, 3));
  };

  createObstacleLeft = () => {
    let randomY = Math.floor(Math.random() * 600);
    this.obstaclesArray.push(new Obstacles(this, 0, randomY, 20, 20, 3, 3));
  };

  createObstacleRight = () => {
    let randomY = Math.floor(Math.random() * 600);
    this.obstaclesArray.push(new Obstacles(this, 840, randomY, 80, 80, 3, 3));
  };

  createRandomObstacle() {
    let functionArray = [
      this.createObstacleTop,
      this.createObstacleBottom,
      this.createObstacleLeft,
      this.createObstacleRight,
    ];
    let randomFunction =
      functionArray[Math.floor(Math.random() * functionArray.length)];
    randomFunction();
  }

  checkGameOver() {
    let gameOverSound = new Audio("/docs/assets/sounds/game-over.wav");
    const player1 = this.player;
    const crashed = this.obstaclesArray.some(function (obstacle) {
      return player1.crashWith(obstacle);
    });

    if (crashed) {
      this.stop();
      this.drawGameOver();
      gameOverSound.play();
     this.checkHighScore(); 
    }
  }

  stop() {
    clearInterval(this.intervalId);
  }

  drawScores() {
   
    this.ctx.font = "20px  pixel";
    this.ctx.fillStyle = "grey";
    this.ctx.fillText(`Score:${this.score}`, 980, 53);
  }

  drawLine() {
    this.ctx.beginPath();
    this.ctx.moveTo(908, 0);
    this.ctx.lineTo(908, 600);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "grey";
    this.ctx.stroke();
    this.ctx.closePath();
  }
  drawBackground() {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, 1200, 600);
  }
  drawGameOver() {
    /*  this.ctx.font = "25x  pixel";
    this.ctx.fillStyle = "grey";
    this.ctx.fillText(`Game Over`, 970, 113); */

    /* this.ctx.fillStyle = 'light grey';
    this.ctx.fillRect(200, 150, 500, 300);
    this.ctx.font = "250x  pixel";
    this.ctx.fillStyle = "white";
    this.ctx.fillText(`Game Over`, 350, 300); */
    //this.ctx.src = "./docs/assets/imgs/game_over.jpg";
   /*  const image = new Image();
    image.src = "./docs/assets/imgs/game_over.jpg"; */
    this.ctx.drawImage(this.img, 100, 150, 1000, 300);
  }
  checkHighScore(){
    console.log("test")
    const NO_OF_HIGH_SCORES = 10;
    const HIGH_SCORES = 'highScores';
    const highScoreString = localStorage.getItem(HIGH_SCORES);
    let lowestScore = 0
    let highScores = [];
console.log(highScoreString)
    if(highScoreString){
      highScores = JSON.parse(highScoreString);
      console.log(highScores)
      lowestScore = highScores[highScores.length - 1].score;
    }
  console.log(lowestScore)
  console.log(this.score)
    if (this.score > lowestScore) {
      this.saveHighScore(this.score, highScores); 
      this.showHighScores();
      console.log("hello")
    }
  }
  saveHighScore(score, highScores){
    const NO_OF_HIGH_SCORES = 10;
    const HIGH_SCORES = 'highScores';
    const name = prompt(`You got a highscore! Enter name:`);
    const newScore = {score, name };
    
    // 1. Add to list
    highScores.push(newScore);
  
    // 2. Sort the list
    highScores.sort((a, b) => b.score - a.score);
    
    // 3. Select new list
    highScores.splice(NO_OF_HIGH_SCORES);
    
    // 4. Save to local storage
    localStorage.setItem(HIGH_SCORES, JSON.stringify(highScores));
  }
  showHighScores(){
    const NO_OF_HIGH_SCORES = 10;
    const HIGH_SCORES = 'highScores';
    const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES));
    const highScoreList = document.getElementById("highScores");
  
    highScoreList.innerHTML = highScores
    .map((score) => `<li>${score.score} - ${score.name}`)
    .join('');
  }
}
