import { config } from './config.js';

export class EnemyBullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 28;
    this.speed = -5;
    this.sprite = new Image();
    this.sprite.src = 'assets/enemy-bullet.png';
  }

  update() {
    this.x += this.speed;
  }

  draw(ctx) {
    if (config.hitboxes) {
      ctx.fillStyle = 'red';
      ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.PI);
    ctx.drawImage(this.sprite, -this.sprite.width / 2, -this.sprite.height / 2, this.sprite.width, this.sprite.height);
    ctx.restore();
  }

  collidesWith(player) {
    const hitBoxX = this.x - this.width / 2;
    const hitBoxY = this.y - this.height / 2;
    return hitBoxX < player.x + player.width &&
      hitBoxX + this.width > player.x &&
      hitBoxY < player.y + player.height &&
      hitBoxY + this.height > player.y;
  }
}