export class EnemyBullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 5;
    this.speed = -5;
    this.sprite = new Image();
    this.sprite.src = 'assets/enemy-bullet.png';
  }

  update() {
    this.x += this.speed;
  }

  draw(ctx) {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.PI);
    ctx.drawImage(this.sprite, -this.sprite.width / 2, -this.sprite.height / 2, this.sprite.width, this.sprite.height);
    ctx.restore();
  }
}