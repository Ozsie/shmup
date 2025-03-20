export class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 5;
    this.speed = 10;
  }

  update() {
    this.x += this.speed;
  }

  draw(ctx) {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  collidesWith(enemy) {
    return this.x < enemy.x + enemy.width &&
      this.x + this.width > enemy.x &&
      this.y < enemy.y + enemy.height &&
      this.y + this.height > enemy.y;
  }
}