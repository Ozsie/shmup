import {enemyBullets} from './EnemyBullet.js';

export class EnemyWeapon {
  constructor(enemy) {
    this.canFire = true;
    this.damage = 10;
    this.rateOfFire = 1.2;
    this.enemy = enemy;
    this.bulletType = "EnemyBullet";
  }

  fire(level) {
    if (this.canFire) {
      // Logic to fire a bullet
      level.bullets.push(new enemyBullets[this.bulletType](this.enemy.x, this.enemy.y + this.enemy.height / 2));
      this.canFire = false; // Prevent continuous firing
      setTimeout(() => this.canFire = true, this.rateOfFire * 1000);
    }
  }

  update(level, player) {
    level.bullets.forEach((bullet, index) => {
      if (bullet.collidesWith(player)) {
        player.takeDamage(this.damage);
        level.bullets.splice(index, 1);
      }
    });
  }
}

export class BasicBullet extends EnemyWeapon {
  constructor(enemy) {
    super(enemy);
  }
}

export class SlowGun extends EnemyWeapon {
  constructor(enemy) {
    super(enemy);
    this.rateOfFire = 1.7;
    this.damage = 20;
  }
}

export class BasicMissile extends EnemyWeapon {
  constructor(enemy) {
    super(enemy);
    this.rateOfFire = 2;
    this.damage = 20;
    this.bulletType = "TargetingEnemyBullet";
  }
}

export class Cannon extends EnemyWeapon {
  constructor(enemy) {
    super(enemy);
    this.rateOfFire = 3;
    this.damage = 20;
    this.bulletType = "CannonBall";
  }
}
