import {keys} from './Player.js';

export class Star {
  constructor(x, y, speed, color) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.color = color;
  }

  update(canvas) {
    let xMod = 1;
    if (keys['ArrowUp']) this.y -= (this.speed * 0.5);
    if (keys['ArrowDown']) this.y += (this.speed * 0.5);
    if (keys['ArrowLeft']) xMod = 0.7;
    if (keys['ArrowRight']) xMod = 2;
    this.x -= (this.speed * xMod);
    if (this.x < 0) {
      this.x = canvas.width;
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, 2, 2);
  }
}