import {BasicBullet, SlowGun} from './EnemyWeapon.js';

export class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.points = 50;
    this.hull = {
      hits: 1,
    }
    this.engine = {
      speed: 2,
    }
    this.weapon = new BasicBullet(this);
  }

  update(canvas, player) {
    this.x -= this.engine.speed;

    // Check if the enemy is within the canvas bounds
    if (this.onScreen(canvas) && this.weapon) {
      this.weapon.fire();
    }

    if (this.weapon) {
      this.weapon.update(player);
    }
  }

  onScreen(canvas) {
    return this.x >= 0 && this.x + this.width <= canvas.width &&
    this.y >= 0 && this.y + this.height <= canvas.height;
  }

  draw(ctx) {
    ctx.fillStyle = 'green';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    if (this.weapon) {
      this.weapon.draw(ctx);
    }
  }

  takeHit(level, player, x, y) {
    this.hull.hits--;
    if (this.hull.hits <= 0) {
      level.removeEnemy(x, y);
      player.addScore(this.points)
    }
  }
}

export var enemies = {};

enemies.Flyer = class extends Enemy {
  constructor(x, y) {
    super(x, y);
  }

  update(canvas, player) {
    super.update(canvas, player);
  }

  draw(ctx) {
    super.draw(ctx);
  }
}

enemies.Bomber = class extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.width = 32;
    this.height = 16;
    this.hull = {
      "hits": 5
    };
    this.engine = {
      "speed": 0.8
    }
  }

  update(canvas, player) {
    super.update(canvas, player);
  }

  draw(ctx) {
    super.draw(ctx);
  }
}

enemies.Zoomer = class extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.width = 48;
    this.height = 16;
    this.hull = {
      "hits": 1
    };
    this.engine = {
      "speed": 0.8,
      "frameCount": 0
    };
    this.weapon = undefined;
  }

  update(canvas, player) {
    if (this.onScreen(canvas)) {
      this.engine.frameCount++;
      switch (this.engine.frameCount) {
        case 40: {
          this.engine.speed = 3;
          break;
        }
        case 45: {
          this.engine.speed = 4;
          break;
        }
        case 50: {
          this.engine.speed = 6;
          break;
        }
      }
    }
    super.update(canvas, player);
  }

  draw(ctx) {
    super.draw(ctx);
  }
}

enemies.Twister = class extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.baseY = this.y;
    this.engine = {
      "speed": 2,
      "angle": 0,
      "amplitude": 50
    };
    this.weapon = new SlowGun(this);
  }

  update(canvas, player) {
    super.update(canvas, player);
    this.engine.angle += 0.1;
    this.y = this.baseY + this.engine.amplitude * Math.sin(this.engine.angle);
  }

  draw(ctx) {
    super.draw(ctx);
  }
}
