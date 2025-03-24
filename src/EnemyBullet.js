import { config } from './config.js';

export var enemyBullets = {}

enemyBullets.EnemyBullet = class {
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
    const playerHB = player.hitbox()
    return hitBoxX < playerHB.x + player.width &&
      hitBoxX + this.width > playerHB.x &&
      hitBoxY < playerHB.y + player.height &&
      hitBoxY + this.height > playerHB.y;
  }
}

enemyBullets.TargetingEnemyBullet = class extends enemyBullets.EnemyBullet {
  constructor(x, y) {
    super(x, y);
    this.speed = -3;
  }

  update(player) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Normalize the direction vector
    const directionX = dx / distance;
    const directionY = dy / distance;

    // Update the bullet's position
    this.x -= directionX * this.speed;
    this.y -= directionY * this.speed;
  }
}