class Obstacles {
    constructor(game, x, y, width, height) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speedX = 1;
        this.speedY = 1;
        this.img = new Image();
    }

    drawObstacle() {
        this.img.src = "docs/assets/imgs/obstacle.png";
        this.game.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      }

    left() {
        return this.x;
      }
    right() {
        return this.x + this.width;
      }
    
    top() {
        return this.y;
      }
    
    bottom() {
        return this.y + this.height;
      } 

}
