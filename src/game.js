import { Player, keys } from './Player.js';
import { Bullet } from './Bullet.js';
import { Enemy } from './Enemy.js';
import { Asteroid } from './Asteroid.js';
import { Level } from './Level.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let lastTime = 0;

const player = new Player(100, canvas.height / 2);
const level = new Level();

// Initialize level with a width of 1000 cells
level.initialize(1000, canvas);

// Set some objects in the level grid
for (let i = 0; i < 20; i++) {
  level.setAsteroidCell(10, i, new Asteroid(10 * 32, i * 32));
  level.setEnemyCell(20, i, new Enemy(20 * 32, i * 32));
  level.setEnemyCell(30, i, new Enemy(30 * 32, i * 32));
  level.setEnemyCell(50, i, new Enemy(50 * 32, i * 32));
}


window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});
window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

window.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    bullets.push(new Bullet(player.x + player.width, player.y + player.height / 2));
  }
});

setInterval(() => {
  const y = Math.random() * (canvas.height - 50);
  enemies.push(new Enemy(canvas.width, y));
}, 2000);

// Spawn asteroids at intervals
setInterval(() => {
  const x = canvas.width;
  const y = Math.random() * canvas.height;
  asteroids.push(new Asteroid(x, y));
}, 2000);

const enemies = [];
const bullets = [];
const asteroids = [];

function update(deltaTime) {
  player.update(canvas);
  bullets.forEach((bullet, bulletIndex) => {
    bullet.update();
    if (bullet.x > canvas.width) {
      bullets.splice(bulletIndex, 1);
    }
  });

  asteroids.forEach((asteroid, index) => {
    asteroid.update();
    asteroid.applyGravity(player);
    if (asteroid.checkCollision(player)) {
      player.takeDamage(30);
      asteroids.splice(index, 1); // Remove asteroid on collision
    }
  });

  enemies.forEach((enemy, enemyIndex) => {
    enemy.update();
    if (enemy.x + enemy.width < 0) {
      enemies.splice(enemyIndex, 1);
    }

    bullets.forEach((bullet, bulletIndex) => {
      if (bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y) {
        player.addScore(100); // Customize points per enemy
        enemies.splice(enemyIndex, 1);
        bullets.splice(bulletIndex, 1);
      }
    });

    enemy.bullets.forEach((bullet, bulletIndex) => {
      if (bullet.x < player.x + player.width &&
        bullet.x + bullet.width > player.x &&
        bullet.y < player.y + player.height &&
        bullet.y + bullet.height > player.y) {
        player.takeDamage(10);
        enemy.bullets.splice(bulletIndex, 1);
      }
    });
  });
  level.update(canvas);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  level.draw(ctx);
  player.draw(ctx);
  bullets.forEach(bullet => bullet.draw(ctx));
  //enemies.forEach(enemy => enemy.draw(ctx));
  //asteroids.forEach(asteroid => asteroid.draw(ctx));

  // Draw health counter
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText('Health: ' + player.health, 10, 30);

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