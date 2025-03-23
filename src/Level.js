// Level.js
import {Star} from './Star.js';
import {Asteroid} from './Asteroid.js';
import {enemies, Enemy} from './Enemy.js';
import {config} from './config.js';

export class Level {
  constructor() {
    this.cellSize = 32;
    this.gridHeight = 20;
    this.staticGrid = [];
    this.enemyGrid = [];
    this.asteroidGrid = [];
    this.backgroundGrid = [];
    this.foregroundGrid = [];
    this.speed = 0.5; // Speed at which the level moves to the left
    this.offsetX = 0; // Horizontal offset for the level

    this.starsLayer1 = [];
    this.starsLayer2 = [];

    this.initialized = false;
    this.levelWidth = 0;
    this.background = new Image();
    this.foreground = new Image();
  }

  loadFromJSON(json, canvas) {
    this.speed = json.speed;
    this.levelWidth = json.width * this.cellSize;
    this.staticGrid = Array.from({ length: this.gridHeight }, () => Array(json.width).fill(null));
    this.enemyGrid = Array.from({ length: this.gridHeight }, () => Array(json.width).fill(null));
    this.asteroidGrid = Array.from({ length: this.gridHeight }, () => Array(json.width).fill(null));

    for (let i = 0; i < 100; i++) {
      this.starsLayer1.push(new Star(Math.random() * canvas.width, Math.random() * canvas.height, 0.5, 'white'));
      this.starsLayer2.push(new Star(Math.random() * canvas.width, Math.random() * canvas.height, 1, 'blue'));
    }
    json.objects.forEach(obj => {
      if (obj.type === 'Asteroid') {
        this.setAsteroidCell(obj.x, obj.y, new Asteroid(obj.x * this.cellSize, obj.y * this.cellSize));
      } else if (obj.type === 'Enemy') {
        let x = obj.x;
        let y = obj.y;
        obj.x = obj.x * this.cellSize;
        obj.y = obj.y * this.cellSize;
        this.setEnemyCell(x, y, new enemies[obj.configuration](obj.x, obj.y));
      }
    });
    this.backgroundGrid = json.backgroundGrid;
    this.foregroundGrid = json.foregroundGrid;
    this.background.src = json.background;
    this.foreground.src = json.foreground;

    this.initialized = true;
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
  setEnemyCell(x, y, enemy) {
    if (y >= 0 && y < this.gridHeight) {
      if (!this.enemyGrid[y]) {
        this.enemyGrid[y] = [];
      }
      this.enemyGrid[y][x] = enemy;
    }
  }

  // Remove an enemy from a specific cell
  removeEnemy(x, y) {
    if (y >= 0 && y < this.gridHeight) {
      if (this.enemyGrid[y]) {
        this.enemyGrid[y][x] = null;
      }
    }
  }

  removeAsteroid(x, y) {
    if (y >= 0 && y < this.gridHeight) {
      if (this.asteroidGrid[y]) {
        this.asteroidGrid[y][x] = null;
      }
    }
  }

  enemies() {
    return this.enemyGrid.flatMap((enemies) => enemies)
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

  ready() {
    return this.initialized && this.background && this.foreground
  }

  // Update the level position
  update(canvas, player) {
    if (!this.ready()) return;

    this.starsLayer1.forEach(star => star.update(canvas));
    this.starsLayer2.forEach(star => star.update(canvas));

    if (this.offsetX < this.levelWidth - canvas.width) {
      this.offsetX += this.speed;
    }
    for (let y = 0; y < this.gridHeight; y++) {
      let row = this.staticGrid[y];
      for (let x = 0; x < row.length; x++) {
        const staticObject = row[x];
        if (staticObject) {
          staticObject.update();
        }
        const enemyObject = this.enemyGrid[y][x];
        if (enemyObject) {
          enemyObject.update(canvas, player);
        }
        const asteroidObject = this.asteroidGrid[y][x];
        if (asteroidObject) {
          asteroidObject.update();
          asteroidObject.applyGravity(player);
          if (asteroidObject.checkCollision(player)) {
            player.takeDamage(30);
            this.removeAsteroid(x,y);
          }
        }
      }
    }
  }

  // Draw the level
  draw(ctx) {
    if (!this.ready()) return;
    this.starsLayer1.forEach(star => star.draw(ctx));
    this.starsLayer2.forEach(star => star.draw(ctx));

    this.drawGrid(ctx, this.backgroundGrid, this.background);

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
        if (config.grid) {
          this.drawDebugGrid(ctx, x, y);}
      }
    }

    this.drawGrid(ctx, this.foregroundGrid, this.foreground);
  }

  drawDebugGrid(ctx, x, y) {
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 2;
    ctx.strokeRect(x * this.cellSize - this.offsetX, y * this.cellSize, this.cellSize, this.cellSize);
  }

  drawGrid(ctx, grid, image) {
    grid.forEach(tile => {
      // Assuming you have a method to draw a tile based on its coordinates and tile ID
      this.drawTile(ctx, tile.x, tile.y, tile.tile, image);
    });
  }

  drawTile(ctx, x, y, tile, image) {
    ctx.drawImage(image, tile * this.cellSize, 0, this.cellSize, this.cellSize, x * this.cellSize - this.offsetX, y * this.cellSize, this.cellSize, this.cellSize);
  }
}
