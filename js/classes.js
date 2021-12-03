// TODO: Change to sprite when one is made.
class Player extends PIXI.Graphics {
	constructor() {
		// Draw shape.
		this.lineStyle(1, 0xFFFFFF, 1);
		this.beginFill(0xFFFFFF);
		this.moveTo(0, 2);
		this.lineTo(1.5, -2);
		this.lineTo(0, -1);
		this.lineTo(-1.5, -2);
		this.lineTo(0,2);
		this.endFill();

		gameScene.addChild(this);

		// Percent of speed lost per second.
		this.friction = 0.5;
		this.vel = { x: 0, y: 0 };
		this.thrust = 200;
		this.turnSpeed = 1;
		this.turning = "";
		this.thrusting = false;

		this.health = { max: 100, current: 100 };
		this.shield = { max: 50, current: 50 };
		this.damageCooldown = { max: 10, current: 0 };

		this.projectiles = { count: 1, burst: 1, rate: 6, spread: 0, cooldown: 0 };
		this.bullet = { type: "bullet", damage: 5, size: 1, speed: 400, enemy: false };
		this.firing = false;
	}

	/**
	 * Update the state of this player.
	 * 
	 * Updates and applies rotation, thrust, friction, velocity, cooldowns, regen, 
	 * and shooting.
	 */
	Update() {
		// Turn
		if (this.turning == "cw") {
			this.angle += this.turnSpeed;
		} else if (this.turning == "ccw") {
			this.angle -= this.turnSpeed;
		}

		// Thrust
		if (this.thrusting) {
			this.vel.x += this.thrust * Math.sin(this.angle * (Math.PI/180));
			this.vel.y += this.thrust * Math.cos(this.angle * (Math.PI/180));
		}

		// Friction
		vel.x *= 1 - (this.friction * dt);
		vel.y *= 1 - (this.friction * dt);
		if (this.vel.x * this.vel.x + this.vel.y * this.vel.y < 20) {
			vel.x = 0;
			vel.y = 0;
		}

		// Movement
		this.x += this.vel.x;
		this.y -= this.vel.y;

		// Cooldowns
		this.damageCooldown.current -= dt;
		this.projectiles.cooldown -= dt;

		// TODO: shoot if off cooldown and firing
		// TODO: regen if off cooldown
	}

	Shoot() {
		// TODO
	}

	Damage() {
		// TODO
	}
}