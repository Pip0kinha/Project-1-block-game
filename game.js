class Game {
  constructor() {
    this.isGameStarted = false;
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
    img.src = "docs/assets/imgs/game_over.jpg";
    this.starGameMusic = new Audio("docs/assets/sounds/background-music.wav");
    this.starGameMusic.loop = true;
    this.newObsSound = new Audio("docs/assets/sounds/new_obstacle.wav");
  }

  start() {
    if (this.isGameStarted) return false;

    this.isGameStarted = true;
    this.drawLine();
    this.player = new Player(this, 390, 240, 120, 120);
    this.player.draw();
    this.starGameMusic.play();
    this.drawLeaderBoard();
    this.controls = new Controls(this);
    this.controls.keyboardEvents();
    this.createRandomObstacle();
    this.intervalId = setInterval(() => {
      this.update();
    }, 1000 / 60);
  }

  update() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.frames++;
    this.score = Math.floor(this.frames / 60);
    this.drawBackground();
    this.drawLine();
    this.drawScores();
    this.drawLeaderBoard();
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
    this.obstaclesArray.push(new Obstacles(this, randomX, 0, 60, 60, 3, 3));
  };

  createObstacleBottom = () => {
    let randomX = Math.floor(Math.random() * 840);
    this.obstaclesArray.push(new Obstacles(this, randomX, 540, 60, 60, 3, 3));
  };

  createObstacleLeft = () => {
    let randomY = Math.floor(Math.random() * 600);
    this.obstaclesArray.push(new Obstacles(this, 0, randomY, 60, 60, 3, 3));
  };

  createObstacleRight = () => {
    let randomY = Math.floor(Math.random() * 640);
    this.obstaclesArray.push(new Obstacles(this, 840, randomY, 60, 60, 3, 3));
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
    let gameOverSound = new Audio("docs/assets/sounds/game-over.wav");
    const player1 = this.player;
    const crashed = this.obstaclesArray.some(function (obstacle) {
      return player1.crashWith(obstacle);
    });

    if (crashed) {
      this.stop();
      this.drawGameOver();
      this.starGameMusic.pause();
      /* if (!this.starGameMusic.paused) */ gameOverSound.play();
      this.checkHighScore();
      this.isGameStarted = false;
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
    this.ctx.moveTo(900, 0);
    this.ctx.lineTo(900, 600);
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
    this.ctx.drawImage(this.img, 0, 150, 900, 300);
  }
  checkHighScore() {
    const HIGH_SCORES = "highScores";
    const highScoreString = localStorage.getItem(HIGH_SCORES);
    let lowestScore = 0;
    let highScores = [];
    if (highScoreString) {
      highScores = JSON.parse(highScoreString);

      lowestScore = highScores[highScores.length - 1].score;
    }

    if (this.score > lowestScore) {
      setTimeout(() => {
        this.saveHighScore(this.score, highScores);

        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawBackground();
        this.drawLine();
        this.drawScores();
        this.drawLeaderBoard();
        this.player.draw();
        this.obstaclesArray.forEach((obstacle) => {
          obstacle.drawObstacle();
        });
        this.drawGameOver();
        
      }, 100);
    }
  }
  saveHighScore(score, highScores) {
    const NO_OF_HIGH_SCORES = 10;
    const HIGH_SCORES = "highScores";
    const name = prompt(`You got a highscore! Enter name:`);
    const newScore = { score, name };

    // 1. Add to list
    highScores.push(newScore);

    // 2. Sort the list
    highScores.sort((a, b) => b.score - a.score);

    // 3. Select new list
    highScores.splice(NO_OF_HIGH_SCORES);

    // 4. Save to local storage
    localStorage.setItem(HIGH_SCORES, JSON.stringify(highScores));
  }

  drawLeaderBoard() {
    const NO_OF_HIGH_SCORES = 10;
    const HIGH_SCORES = "highScores";
    const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES));
    const highScoreList = document.getElementById("highScores");
    let highScoreString = "";
    this.ctx.font = "20px  pixel";
    this.ctx.fillStyle = "grey";
    this.ctx.fillText(`*LEADERBOARD*`, 925, 93);
    if (highScores) {
      highScores.forEach((element, i) => {
        highScoreString += `${element.name}:${element.score} \n `;
        this.ctx.fillText(
          `${element.name || "Anonymous"}:${element.score}`,
          925,
          133 + i * 25
        );
      });
    }
  }
}
