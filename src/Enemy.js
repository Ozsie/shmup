import {BasicBullet, BasicMissile, SlowGun, Cannon} from './EnemyWeapon.js';

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

  update(canvas, player, level) {
    this.x -= this.engine.speed;

    // Check if the enemy is within the canvas bounds
    if (this.onScreen(canvas) && this.weapon && this.hull.hits > 0) {
      this.weapon.fire(level);
    }

    if (this.weapon) {
      this.weapon.update(level, player);
    }

    if (this.collidesWith(player)) {
      player.takeDamage(5);
    }
  }

  onScreen(canvas) {
    return this.x + this.width > 0 && this.x < canvas.width &&
      this.y + this.height > 0 && this.y < canvas.height;
  }

  draw(ctx, player) {
    if (this.hull.hits > 0) {
      ctx.fillStyle = 'green';
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  takeHit(level, player, x, y) {
    console.log("hit");
    this.hull.hits--;
    if (this.hull.hits <= 0) {
      level.removeEnemy(x, y);
      console.log("destroyed");
      player.addScore(this.points)
    }
  }

  collidesWith(player) {
    const hitBoxX = this.x - this.width / 2;
    const hitBoxY = this.y - this.height / 2;
    const playerHB = player.hitbox()
    return hitBoxX < playerHB.x + player.width &&
      hitBoxX + this.width > playerHB.x &&
      hitBoxY < playerHB.y + player.height &&
      hitBoxY + this.height > playerHB.y;
  }
}

export var enemies = {};

enemies.Flyer = class extends Enemy {
  constructor(x, y) {
    super(x, y);
  }

  update(canvas, player, level) {
    super.update(canvas, player, level);
  }

  draw(ctx, player) {
    super.draw(ctx, player);
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
    this.weapon = new BasicMissile(this);
  }

  update(canvas, player, level) {
    super.update(canvas, player, level);
  }

  draw(ctx, player) {
    super.draw(ctx, player);
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

  update(canvas, player, level) {
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
    super.update(canvas, player, level);
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

  update(canvas, player, level) {
    super.update(canvas, player, level);
    this.engine.angle += 0.1;
    this.y = this.baseY + this.engine.amplitude * Math.sin(this.engine.angle);
  }

  draw(ctx, player) {
    super.draw(ctx, player);
  }
}

enemies.Turret = class extends Enemy {
  constructor(x, y, level) {
    super(x, y);
    this.width = 16;
    this.height = 16;
    this.hull = {
      "hits": 2
    };
    this.engine = {
      "speed": level.speed
    }
    this.weapon = new Cannon(this);
  }

  update(canvas, player, level) {
    super.update(canvas, player, level);
  }

  draw(ctx, player) {
    super.draw(ctx, player);
  }
}
