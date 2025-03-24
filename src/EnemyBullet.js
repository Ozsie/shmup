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

  draw(ctx, player) {
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
    this.speed = -2;
    this.angle = 0;
    this.following = true;
  }

  update(player) {
    if (this.following) {
      // Calculate the direction vector from the bullet to the player
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Check if the bullet is close enough to the player
      if (distance < 75) { // Adjust the threshold as needed
        this.following = false;
      } else {
        // Normalize the direction vector
        const directionX = dx / distance;
        const directionY = dy / distance;

        // Update the bullet's position
        this.x -= directionX * this.speed;
        this.y -= directionY * this.speed;

        // Calculate the angle
        this.angle = Math.atan2(dy, dx);
      }
    } else {
      // Continue moving in the current direction
      this.x -= Math.cos(this.angle) * this.speed;
      this.y -= Math.sin(this.angle) * this.speed;
    }
  }

  draw(ctx) {
    if (config.hitboxes) {
      ctx.fillStyle = 'red';
      ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(this.sprite, -this.sprite.width / 2, -this.sprite.height / 2, this.sprite.width, this.sprite.height);
    ctx.restore();
  }
}



enemyBullets.CannonBall = class extends enemyBullets.EnemyBullet {
  constructor(x, y) {
    super(x, y);
    this.speed = -3;
    this.angle = 0;
    this.following = true;
  }

  update(player) {
    if (this.following) {
      // Calculate the direction vector from the bullet to the player
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const directionX = dx / distance;
      const directionY = dy / distance;

      // Update the bullet's position
      this.x -= directionX * this.speed;
      this.y -= directionY * this.speed;

      // Calculate the angle
      this.angle = Math.atan2(dy, dx);
      this.following = false;
    } else {
      // Continue moving in the current direction
      this.x -= Math.cos(this.angle) * this.speed;
      this.y -= Math.sin(this.angle) * this.speed;
    }
  }

  draw(ctx) {
    if (config.hitboxes) {
      ctx.fillStyle = 'red';
      ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(this.sprite, -this.sprite.width / 2, -this.sprite.height / 2, this.sprite.width, this.sprite.height);
    ctx.restore();
  }
}
