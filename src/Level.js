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
    this.pauses = [];

    this.bullets = [];
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
        this.setEnemyCell(x, y, new enemies[obj.configuration](obj.x, obj.y, obj.id, this));
      }
    });
    this.backgroundGrid = json.backgroundGrid;
    this.foregroundGrid = json.foregroundGrid;
    this.background.src = json.background;
    this.foreground.src = json.foreground;
    this.pauses = json.pauses;

    this.initialized = true;
  }

  width() {
    if (this.initialized) {
      return this.staticGrid[0].length;
    } else {
      return 100;
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

  asteroids() {
    return this.asteroidGrid.flatMap((it) => it)
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

    if (!this.currentTarget) {
      this.pauses.forEach((pause, index) => {
        let currentX = this.offsetX / this.cellSize;
        if (currentX === pause.x) {
          this.currentTarget = pause.target;
          this.resumeOn = pause.resumeOn;
          this.currentPauseIndex = index;
          if (pause.resumeOn === "resumeOnDestroy") {
            let targetEnemy = this.findEnemyById(pause.target.id);
            if (targetEnemy) {
              targetEnemy.engine.speed = -this.speed;
            } else {
              this.resume();
            }
          }
        }
      });
      if (this.offsetX < this.levelWidth - canvas.width) {
        this.offsetX += this.speed;

        this.starsLayer1.forEach(star => star.update(canvas));
        this.starsLayer2.forEach(star => star.update(canvas));
      }
      for (let y = 0; y < this.gridHeight; y++) {
        let row = this.staticGrid[y];
        for (let x = 0; x < row.length; x++) {
          const staticObject = row[x];
          if (staticObject) {
            staticObject.update();
          }
          this.updateEnemies(y, x, canvas, player);
          this.updateAsteroids(y, x, canvas, player);
        }
      }
    } else {
      console.log("Hit pause " + JSON.stringify(this.currentTarget));
      for (let y = 0; y < this.gridHeight; y++) {
        let row = this.staticGrid[y];
        for (let x = 0; x < row.length; x++) {
          this.updateEnemies(y, x, canvas, player);
          this.updateAsteroids(y, x, canvas, player);
        }
      }
      if (this[this.resumeOn](this.currentTarget)) {
        this.resume();
      }
    }

    this.updateEnemyBullets(player);
    this.updateGrid(this.foregroundGrid, player, canvas);
  }

  resume() {
    console.log('resuming after pause');
    this.pauses.splice(this.currentPauseIndex, 1);
    this.currentTarget = undefined;
    this.resumeOn = undefined;
    this.currentPauseIndex = undefined;
  }

  updateEnemyBullets(player) {
    this.bullets.forEach((bullet, index) => {
      bullet.update(player);

      if (bullet.x + bullet.width < 0) {
        this.bullets.splice(index, 1);
      }
    });
  }

  updateAsteroids(y, x, canvas, player) {
    const asteroidObject = this.asteroidGrid[y][x];
    if (asteroidObject) {
      if (asteroidObject.x + asteroidObject.width < 0) {
        this.asteroidGrid[y][x] = undefined;
      }
      if (!this.currentTarget || (this.currentTarget && asteroidObject.onScreen(canvas))) {
        asteroidObject.update();
        asteroidObject.applyGravity(player);
        if (asteroidObject.checkCollision(player)) {
          player.takeDamage(30);
          this.removeAsteroid(x, y);
        }
      }
    }
  }

  updateEnemies(y, x, canvas, player) {
    const enemyObject = this.enemyGrid[y][x];
    if (enemyObject) {
      if (enemyObject.x + enemyObject.width < 0) {
        this.enemyGrid[y][x] = undefined;
      }
      if (!this.currentTarget || (this.currentTarget && enemyObject.onScreen(canvas))) {
        enemyObject.update(canvas, player, this);
      }
    }
  }

  findEnemyById(id) {
    for (let y = 0; y < this.gridHeight; y++) {
      let row = this.enemyGrid[y];
      for (let x = 0; x < row.length; x++) {
        if (row[x] && row[x].id === id) {
          return row[x];
        }
      }
    }
    return undefined;
  }

  resumeOnDestroy(target) {
    let targetEnemy = this.findEnemyById(target.id);
    return targetEnemy === undefined;
  }

  // Draw the level
  draw(ctx, player, canvas) {
    if (!this.ready()) return;
    this.starsLayer1.forEach(star => star.draw(ctx));
    this.starsLayer2.forEach(star => star.draw(ctx));

    this.drawGrid(ctx, this.backgroundGrid, this.background, canvas);

    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.staticGrid[y].length; x++) {
        const object = this.staticGrid[y][x];
        if (object) {
          object.draw(ctx, x * this.cellSize - this.offsetX, y * this.cellSize);
        }

        const asteroid = this.asteroidGrid[y][x];
        if (asteroid && asteroid.onScreen(canvas)) {
          asteroid.draw(ctx);
        }

        const enemy = this.enemyGrid[y][x];
        if (enemy && enemy.onScreen(canvas)) {
          enemy.draw(ctx, player);
        }
        if (config.grid) {
          this.drawDebugGrid(ctx, x, y);}
      }
    }
    this.bullets.forEach(bullet => bullet.draw(ctx, player));

    this.drawGrid(ctx, this.foregroundGrid, this.foreground, canvas);
  }

  drawDebugGrid(ctx, x, y) {
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 2;
    ctx.strokeRect(x * this.cellSize - this.offsetX, y * this.cellSize, this.cellSize, this.cellSize);
  }

  onScreen(tile, canvas) {
    return tile.x + this.cellSize > 0 && tile.x < canvas.width &&
      tile.y + this.cellSize > 0 && tile.y < canvas.height;
  }

  updateGrid(grid, player, canvas) {
    grid.forEach(tile => {
      if (this.onScreen(tile, canvas) && this.collidesWith(tile, player)) {
        console.log("hit wall");
      }
    });
  }

  collidesWith(tile, player) {
    const hitBoxX = tile.x - this.cellSize;
    const hitBoxY = tile.y - this.cellSize;
    const playerHB = player.hitbox()
    return hitBoxX < playerHB.x + player.width &&
      hitBoxX + this.cellSize> playerHB.x &&
      hitBoxY < playerHB.y + player.height &&
      hitBoxY + this.cellSize > playerHB.y;
  }

  drawGrid(ctx, grid, image, canvas) {
    grid.forEach(tile => {
      if (this.onScreen(tile, canvas)) {
        // Assuming you have a method to draw a tile based on its coordinates and tile ID
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'grey';
        if (grid === this.backgroundGrid) {
          ctx.fillStyle = 'blue';
        } else {
          ctx.fillStyle = 'red';
        }
        ctx.fillRect(tile.x * this.cellSize - this.offsetX, tile.y * this.cellSize, this.cellSize, this.cellSize);
        ctx.strokeRect(tile.x * this.cellSize - this.offsetX, tile.y * this.cellSize, this.cellSize, this.cellSize);
        this.drawTile(ctx, tile.x, tile.y, tile.tile, image);
      }
    });
  }

  drawTile(ctx, x, y, tile, image) {
    ctx.drawImage(image, tile * this.cellSize, 0, this.cellSize, this.cellSize, x * this.cellSize - this.offsetX, y * this.cellSize, this.cellSize, this.cellSize);
  }
}
