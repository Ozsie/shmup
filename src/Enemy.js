import { EnemyBullet } from './EnemyBullet.js'

export class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.speed = 2;
    this.bullets = [];
    this.canFire = true;
    this.points = 50;
    this.hits = 1;
  }

  update(canvas) {
    this.x -= this.speed;

    // Check if the enemy is within the canvas bounds
    if (this.x >= 0 && this.x + this.width <= canvas.width &&
      this.y >= 0 && this.y + this.height <= canvas.height) {
      this.fire();
    }
    this.bullets.forEach((bullet, index) => {
      bullet.update();
      if (bullet.x + bullet.width < 0) {
        this.bullets.splice(index, 1);
      }
    });
  }

  fire() {
    if (this.canFire) {
      // Logic to fire a bullet
      this.shoot();
      this.canFire = false; // Prevent continuous firing
      setTimeout(() => this.canFire = true, 1000); // Allow firing again after 1 second
    }
  }

  draw(ctx) {
    ctx.fillStyle = 'green';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    this.bullets.forEach(bullet => bullet.draw(ctx));
  }

  shoot() {
    this.bullets.push(new EnemyBullet(this.x, this.y + this.height / 2));
  }

  takeHit(level, player, x, y) {
    this.hits--;
    if (this.hits <= 0) {
      level.removeEnemy(x, y);
      player.addScore(this.points)
    }
  }
}