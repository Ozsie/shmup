import {config} from './config.js';
import {game} from './game.js';
import {upgrades} from './Upgrades.js';

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 58;
    this.height = 24;
    this.forwardSpeed = 8;
    this.backSpeed = 2;
    this.speed = 5;
    this.health = 100;
    this.score = 0;
    this.sprite = new Image();
    this.sprite.src = 'assets/player.png';
    this.invulnarable = false;

    this.upgrades = [
      new upgrades.Shield(),
      new upgrades.AutoCannon()
    ];
  }

  update(canvas) {
    const hitBoxX = this.x - this.width / 2;
    const hitBoxY = this.y - this.height / 2;

    if (keys['ArrowUp']) this.y -= this.speed;
    if (keys['ArrowDown']) this.y += this.speed;
    if (keys['ArrowLeft']) this.x -= this.backSpeed;
    if (keys['ArrowRight']) this.x += this.forwardSpeed;

    if (hitBoxX < 0) {
      this.x = this.width / 2;
    } else if (hitBoxX + this.width > canvas.width) {
      this.x = canvas.width - this.width / 2;
    }

    if (hitBoxY < 0) {
      this.y = this.height / 2;
    } else if (hitBoxY + this.height > canvas.height) {
      this.y = canvas.height - this.height / 2;
    }

    this.upgrades.forEach((upgrade) => upgrade.update(canvas));
  }

  draw(ctx) {
    if (config.hitboxes) {
      ctx.fillStyle = 'white';
      ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }

    if (keys['ArrowUp']) {
      ctx.drawImage(this.sprite, 64, 0, 64, 64, this.x - (this.width / 2), this.y - this.height - 8, 64, 64);
    } else if (keys['ArrowDown']) {
      ctx.drawImage(this.sprite, 192, 0, 64, 64, this.x - (this.width / 2), this.y - this.height - 8, 64, 64);
    } else {
      ctx.drawImage(this.sprite, 0, 0, 64, 64, this.x - (this.width / 2), this.y - this.height - 8 , 64, 64);
    }

    this.upgrades.forEach((upgrade) => upgrade.draw(ctx, this));
  }

  takeDamage(amount) {
    if (!this.invulnarable) {
      let shield = this.upgrades.find((upgrade) => upgrade instanceof upgrades.Shield);
      if (shield) {
        shield.reducePower();
        if (shield.power === 0) {
          this.upgrades.splice(this.upgrades.indexOf(shield), 1);
        }
        return;
      }
      this.health -= amount;
      this.invulnarable = true;
      setTimeout(() => this.invulnarable = false, 800);
      if (this.health <= 0 && config.death) {
        const {player, level} = game.initialize();
        game.player = player;
        game.level = level;
      }
    }
  }

  addScore(points) {
    this.score += points;
  }

  hitbox() {
    const hitBoxX = this.x - this.width / 2;
    const hitBoxY = this.y - this.height / 2;
    return { x: hitBoxX, y: hitBoxY}
  }
}

export const keys = {};