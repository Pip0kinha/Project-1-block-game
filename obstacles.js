class Obstacles {
    constructor(game, x, y, width, height) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = new Image();
    }

    drawObstacle() {
        this.img.src = "./docs/imgs/obstacle.png";
        this.game.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      }
    moveObstacle(){
        this.x = this.moveRandom();
        this.y = this.moveRandom();
        
      }
    moveRandom() {
        Math.floor(Math.random()*8)*30 + 15
       }
}
