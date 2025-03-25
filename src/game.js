import { Player, keys } from './Player.js';
import { Bullet } from './Bullet.js';
import { Level } from './Level.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let lastTime = 0;

export var game = {
  initialize() {
    const player = new Player(100, canvas.height / 2);
    const level = new Level();

    fetch('levels/level1.json')
      .then(response => response.json())
      .then(data => {
        level.loadFromJSON(data, canvas);
      });
    return {player, level};
  },
  bullets: [],
  update() {
    this.player.update(canvas);
    this.bullets.forEach((bullet, bulletIndex) => {
      bullet.update();
      for (let y = 0; y < this.level.enemyGrid.length; y++) {
        for (let x = 0; x < this.level.enemyGrid[y].length; x++) {
          const enemy = this.level.enemyGrid[y][x];
          if (enemy && bullet.collidesWith(enemy)) {
            // Remove enemy and bullet on collision
            enemy.takeHit(this.level, this.player, x, y);
            this.bullets.splice(bulletIndex, 1);
            break;
          }
        }
      }
      if (bullet.x > canvas.width) {
        this.bullets.splice(bulletIndex, 1);
      }
    });

    this.level.update(canvas, this.player);
  },
  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.level.draw(ctx);
    this.player.draw(ctx);
    game.bullets.forEach(bullet => bullet.draw(ctx));

    // Draw health counter
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Health: ' + this.player.health, 10, 30);
    const playerX = Math.floor(this.player.x / this.level.cellSize) + Math.floor(this.level.offsetX / this.level.cellSize)
    let fraction = (playerX / this.level.width()) * 100;
    const percent = Math.floor(fraction);
    ctx.fillText('X: ' + playerX + "(" + percent + "%)", 150, 30);
    ctx.fillText('INV: ' + this.player.invulnarable, 250, 30);

    // Draw score counter
    ctx.fillText('Score: ' + this.player.score, canvas.width - 100, 30);
  }
}

window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});
window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

window.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    game.bullets.push(new Bullet(game.player.x + game.player.width / 2, game.player.y));
  }
});

const {player, level} = game.initialize();
game.player = player;
game.level = level;

function gameLoop(timestamp) {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  game.update(deltaTime);
  game.draw();

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);