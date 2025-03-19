export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.speed = 5;
    this.health = 100;
    this.score = 0;
  }

  update() {
    if (keys['ArrowUp']) this.y -= this.speed;
    if (keys['ArrowDown']) this.y += this.speed;
    if (keys['ArrowLeft']) this.x -= this.speed;
    if (keys['ArrowRight']) this.x += this.speed;
  }

  draw(ctx) {
    ctx.fillStyle = 'white';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      // Handle player death (e.g., end game, restart, etc.)
    }
  }

  addScore(points) {
    this.score += points;
  }
}

export const keys = {};