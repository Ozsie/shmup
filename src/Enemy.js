import {BasicBullet, BasicMissile, SlowGun, Cannon} from './EnemyWeapon.js';
import {config} from './config.js';

export class Enemy {
  constructor(x, y, asset, id) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.width = 43;
    this.height = 34;
    this.points = 50;
    this.hull = {
      hits: 1,
    }
    this.engine = {
      speed: 2,
    }
    this.weapon = new BasicBullet(this);
    this.sprite = new Image();
    if (asset) {
      this.sprite.src = asset;
    }
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
    if (config.hitboxes) {
      ctx.fillStyle = 'green';
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    if (this.sprite.src) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(Math.PI);
      ctx.drawImage(this.sprite, -this.sprite.width, -this.sprite.height, this.sprite.width, this.sprite.height);
      ctx.restore();
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
  constructor(x, y, id) {
    super(x, y, 'assets/flyer.png', id);
    this.width = 43;
    this.height = 34;
  }

  update(canvas, player, level) {
    super.update(canvas, player, level);
  }

  draw(ctx, player) {
    super.draw(ctx, player);
  }
}

enemies.Bomber = class extends Enemy {
  constructor(x, y, id) {
    super(x, y, 'assets/bomber.png', id);
    this.width = 23;
    this.height = 28;
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
  constructor(x, y, id) {
    super(x, y, 'assets/zoomer.png', id);
    this.width = 91;
    this.height = 40;
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

enemies.SineTwister = class extends Enemy {
  constructor(x, y, id) {
    super(x, y, 'assets/twister.png', id);
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

enemies.CosineTwister = class extends Enemy {
  constructor(x, y, id) {
    super(x, y, 'assets/twister.png', id);
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
    this.y = this.baseY + this.engine.amplitude * Math.cos(this.engine.angle);
  }

  draw(ctx, player) {
    super.draw(ctx, player);
  }
}

enemies.Turret = class extends Enemy {
  constructor(x, y, id, level) {
    super(x, y, null, id);
    this.width = 16;
    this.height = 16;
    this.hull = {
      "hits": 2
    };
    this.engine = {
      "speed": level.speed
    }
    this.weapon = new Cannon(this);
    this.sprite = new Image();
    this.sprite.src = 'assets/turret.png';
    this.cannon = new Image();
    this.cannon.src = 'assets/cannon.png';
  }

  update(canvas, player, level) {
    super.update(canvas, player, level);
    const dx = player.x - this.x;
    const dy = player.y - this.y;

    this.angle = Math.atan2(dy, dx);
  }

  draw(ctx, player) {
    if (config.hitboxes) {
      ctx.fillStyle = 'green';
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);

    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.angle + (Math.PI / 2));
    ctx.drawImage(this.cannon, -this.width/2, -this.height, this.width, this.height);
    ctx.restore();
  }
}
