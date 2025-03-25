// Asteroid.js
export class Asteroid {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.speed = 1;
    this.rotation = 0;
    this.rotationSpeed = this.getRandomArbitrary(-0.04, 0.04);
    this.gravityRadius = 300;
    this.gravityStrength = 0.6;
  }

  getRandomArbitrary(min, max) {
    let random = Math.random() * (max - min) + min;
    let limit = Math.abs(0 - Math.abs(random));
    if (limit < 0.005) {
      return this.getRandomArbitrary(min, max);
    } else {
      return random;
    }
  }

  update() {
    this.x -= this.speed;
    this.rotation += this.rotationSpeed;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.rotation);
    ctx.fillStyle = 'gray';
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
  }

  checkCollision(player) {
    return (
      this.x < player.x + player.width &&
      this.x + this.width > player.x &&
      this.y < player.y + player.height &&
      this.y + this.height > player.y
    );
  }

  applyGravity(player) {
    const dx = this.x + this.width / 2 - (player.x + player.width / 2);
    const dy = this.y + this.height / 2 - (player.y + player.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.gravityRadius) {
      const force = this.gravityStrength / distance;
      player.x += dx * force;
      player.y += dy * force;
    }
  }

  onScreen(canvas) {
    return this.x + this.width > 0 && this.x < canvas.width &&
      this.y + this.height > 0 && this.y < canvas.height;
  }
}