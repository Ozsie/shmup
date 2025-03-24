import {enemyBullets} from './EnemyBullet.js';

export class EnemyWeapon {
  constructor(enemy) {
    this.canFire = true;
    this.bullets = [];
    this.damage = 10;
    this.rateOfFire = 1.2;
    this.enemy = enemy;
    this.bulletType = "EnemyBullet";
  }

  fire() {
    if (this.canFire) {
      // Logic to fire a bullet
      this.bullets.push(new enemyBullets[this.bulletType](this.enemy.x, this.enemy.y + this.enemy.height / 2));
      this.canFire = false; // Prevent continuous firing
      setTimeout(() => this.canFire = true, this.rateOfFire * 1000);
    }
  }

  update(player) {
    this.bullets.forEach((bullet, index) => {
      bullet.update(player);

      if (bullet.collidesWith(player)) {
        player.takeDamage(this.damage);
        this.bullets.splice(index, 1);
        return;
      }

      if (bullet.x + bullet.width < 0) {
        this.bullets.splice(index, 1);
      }
    });
  }

  draw(ctx, player) {
    this.bullets.forEach(bullet => bullet.draw(ctx, player));
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
