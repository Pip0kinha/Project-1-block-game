class Game {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.x = 0;
    this.y = 0;
    this.width = 900;
    this.height = 600;
    this.intervalId = null;
    this.player = null;
    this.controls = null;
    this.obstaclesArray = [];
    this.frames = 0;
  }

  start() {
    this.player = new Player(this, 390, 240, 120, 120);
    this.player.draw();
    this.controls = new Controls(this);
    this.controls.keyboardEvents();
    this.intervalId = setInterval(() => {
      this.update();
    }, 1000 / 60);
  }

  update() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.frames++;
    this.drawScores();
    this.player.draw();
    if (this.frames % 300 === 0) {
      this.createRandomObstacle();
    }
    this.obstaclesArray.forEach((obstacle) => {
      obstacle.x += obstacle.speedX;
      obstacle.y += obstacle.speedY;
      if (
        obstacle.y + obstacle.speedY > 600 ||
        obstacle.y + obstacle.speedY < 0
      ) {
        obstacle.speedY *= -1;
      }
      if (
        obstacle.x + obstacle.speedX > 900 ||
        obstacle.x + obstacle.speedX < 0
      ) {
        obstacle.speedX *= -1;
      }
      obstacle.drawObstacle();
    });
    this.obstaclesArray.forEach((obstacle) => {
      obstacle.drawObstacle()
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
    let randomY = Math.floor(Math.random() * 600);
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
    const player1 = this.player
    const crashed = this.obstaclesArray.some (function (obstacle) {
      return player1.crashWith(obstacle);
    });

    if (crashed) {
      this.stop();
    }
  }

  stop() {
    clearInterval(this.intervalId);
  }

  drawScores() {
    let score = Math.floor(this.frames / 60);
    this.ctx.font = "32px serif";
    this.ctx.fillStyle = "black";
    this.ctx.fillText(`Score: ${score}`, 390, 33);
  }
}
