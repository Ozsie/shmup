import {Bullet} from './Bullet.js';
import {game} from './game.js';

export var upgrades = {};

export class Upgrade {}

upgrades.Shield = class extends Upgrade {
  constructor() {
    super();
    this.power = 50;
    this.maxPower = 50;
  }

  update() {

  }

  draw(ctx, player) {
    const opacity = (this.power / this.maxPower) * 100;
    ctx.strokeStyle = `rgb(0 0 255 / ${opacity}%)`;
    ctx.beginPath();
    ctx.ellipse(player.x, player.y, player.width, player.height, 0, 0, 2 * Math.PI);
    ctx.stroke();
  }

  reducePower() {
    if (this.power > 0) this.power--;
    console.log(this.power);
  }
}

upgrades.AutoCannon = class extends Upgrade {
  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.width = 10;
    this.height = 6;
    this.canFire = true;
    this.rateOfFire = 0.7;
  }

  update() {
    if (this.canFire) {
      // Logic to fire a bullet
      game.bullets.push(new Bullet(this.x + this.width / 2, this.y));
      this.canFire = false; // Prevent continuous firing
      setTimeout(() => this.canFire = true, this.rateOfFire * 1000);
    }
  }

  draw(ctx, player) {
    this.x = player.x;
    this.y = player.y - 24;
    ctx.strokeStyle = 'green';
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.ellipse(player.x, player.y - 24, this.width, this.height, 0, 0, 2 * Math.PI);
    ctx.stroke();
  }
}
