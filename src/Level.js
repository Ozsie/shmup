// Level.js
import {Star} from './Star.js';

export class Level {
  constructor() {
    this.cellSize = 32;
    this.gridHeight = 20;
    this.staticGrid = [];
    this.enemyGrid = [];
    this.asteroidGrid = [];
    this.speed = 0.5; // Speed at which the level moves to the left
    this.offsetX = 0; // Horizontal offset for the level

    this.starsLayer1 = [];
    this.starsLayer2 = [];
  }

  // Initialize the grid with empty cells
  initialize(width, canvas) {
    this.staticGrid = Array.from({ length: this.gridHeight }, () => Array(width).fill(null));
    this.enemyGrid = Array.from({ length: this.gridHeight }, () => Array(width).fill(null));
    this.asteroidGrid = Array.from({ length: this.gridHeight }, () => Array(width).fill(null));

    for (let i = 0; i < 100; i++) {
      this.starsLayer1.push(new Star(Math.random() * canvas.width, Math.random() * canvas.height, 0.5, 'white'));
      this.starsLayer2.push(new Star(Math.random() * canvas.width, Math.random() * canvas.height, 1, 'blue'));
    }
  }

  // Set an object at a specific cell
  setStaticCell(x, y, object) {
    if (y >= 0 && y < this.gridHeight) {
      if (!this.staticGrid[y]) {
        this.staticGrid[y] = [];
      }
      this.staticGrid[y][x] = object;
    }
  }

  // Set an object at a specific cell
  setEnemyCell(x, y, object) {
    if (y >= 0 && y < this.gridHeight) {
      if (!this.enemyGrid[y]) {
        this.enemyGrid[y] = [];
      }
      this.enemyGrid[y][x] = object;
    }
  }

  // Set an object at a specific cell
  setAsteroidCell(x, y, object) {
    if (y >= 0 && y < this.gridHeight) {
      if (!this.asteroidGrid[y]) {
        this.asteroidGrid[y] = [];
      }
      this.asteroidGrid[y][x] = object;
    }
  }

  // Update the level position
  update(canvas) {
    if (canvas) {
      this.starsLayer1.forEach(star => star.update(canvas));
      this.starsLayer2.forEach(star => star.update(canvas));
    }

    this.offsetX += this.speed;
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.staticGrid[y].length; x++) {
        const staticObject = this.staticGrid[y][x];
        if (staticObject) {
          staticObject.update();
        }
        const enemyObject = this.enemyGrid[y][x];
        if (enemyObject) {
          enemyObject.update();
        }
        const asteroidObject = this.asteroidGrid[y][x];
        if (asteroidObject) {
          asteroidObject.update();
        }
      }
    }
  }

  // Draw the level
  draw(ctx) {
    this.starsLayer1.forEach(star => star.draw(ctx));
    this.starsLayer2.forEach(star => star.draw(ctx));

    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.staticGrid[y].length; x++) {
        const object = this.staticGrid[y][x];
        if (object) {
          object.draw(ctx, x * this.cellSize - this.offsetX, y * this.cellSize);
        }

        const asteroid = this.asteroidGrid[y][x];
        if (asteroid) {
          asteroid.draw(ctx);
        }

        const enemy = this.enemyGrid[y][x];
        if (enemy) {
          enemy.draw(ctx);
        }
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 2;
        ctx.strokeRect(x * this.cellSize - this.offsetX, y * this.cellSize, this.cellSize, this.cellSize);
      }
    }
  }
}