export class EnemyBullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 5;
    this.speed = -5;
  }

  update() {
    this.x += this.speed;
  }

  draw(ctx) {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}