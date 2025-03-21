export class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 28;
    this.speed = 10;
    this.sprite = new Image();
    this.sprite.src = 'assets/bullet.png';
  }

  update() {
    this.x += this.speed;
  }

  draw(ctx) {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
    ctx.drawImage(this.sprite, 0, 0, this.sprite.width, this.sprite.height, this.x - (this.sprite.width / 2), this.y - (this.sprite.height / 2), this.sprite.width, this.sprite.height);
  }

  collidesWith(enemy) {
    const hitBoxX = this.x - this.width / 2;
    const hitBoxY = this.y - this.height / 2;
    return hitBoxX < enemy.x + enemy.width &&
      hitBoxX + this.width > enemy.x &&
      hitBoxY < enemy.y + enemy.height &&
      hitBoxY + this.height > enemy.y;
  }
}