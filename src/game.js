import { Player, keys } from './Player.js';
import { Bullet } from './Bullet.js';
import { Level } from './Level.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let lastTime = 0;

const player = new Player(100, canvas.height / 2);
const level = new Level();

fetch('levels/level1.json')
  .then(response => response.json())
  .then(data => {
    level.loadFromJSON(data, canvas);
  });

window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});
window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

window.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    bullets.push(new Bullet(player.x + player.width / 2, player.y));
  }
});

const bullets = [];

function update() {
  player.update(canvas);
  bullets.forEach((bullet, bulletIndex) => {
    bullet.update();
    for (let y = 0; y < level.enemyGrid.length; y++) {
      for (let x = 0; x < level.enemyGrid[y].length; x++) {
        const enemy = level.enemyGrid[y][x];
        if (enemy && bullet.collidesWith(enemy)) {
          // Remove enemy and bullet on collision
          enemy.takeHit(level, player, x, y);
          bullets.splice(bulletIndex, 1);
          break;
        }
      }
    }
    if (bullet.x > canvas.width) {
      bullets.splice(bulletIndex, 1);
    }
  });

  level.update(canvas, player);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  level.draw(ctx);
  player.draw(ctx);
  bullets.forEach(bullet => bullet.draw(ctx));

  // Draw health counter
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText('Health: ' + player.health, 10, 30);
  const playerX = Math.floor(player.x / level.cellSize) + Math.floor(level.offsetX / level.cellSize)
  let fraction = (playerX / level.width()) * 100;
  const percent = Math.floor(fraction);
  ctx.fillText('X: ' + playerX + "(" + percent + "%)", 150, 30);

  // Draw score counter
  ctx.fillText('Score: ' + player.score, canvas.width - 100, 30);
}

function gameLoop(timestamp) {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  update(deltaTime);
  draw();

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);