import { EnemyBullet } from './EnemyBullet.js'

export class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.speed = 2;
    this.bullets = [];
    this.shootInterval = setInterval(() => this.shoot(), 1000); // Customize shooting interval
  }

  update() {
    this.x -= this.speed;
    this.bullets.forEach((bullet, index) => {
      bullet.update();
      if (bullet.x + bullet.width < 0) {
        this.bullets.splice(index, 1);
      }
    });
  }

  draw(ctx) {
    ctx.fillStyle = 'green';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  shoot() {
    this.bullets.push(new EnemyBullet(this.x, this.y + this.height / 2));
  }
}