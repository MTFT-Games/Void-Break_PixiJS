// TODO: Change to sprite when one is made.
class Player extends PIXI.Graphics {
	constructor() {
		super();
		// Draw shape.
		this.lineStyle(1, 0xFFFFFF, 1);
		this.beginFill(0xFFFFFF);
		this.moveTo(0, -2);
		this.lineTo(1.5, 2);
		this.lineTo(0, 1);
		this.lineTo(-1.5, 2);
		this.lineTo(0, -2);
		this.endFill();
		this.scale.set(5);

		gameScene.addChild(this);

		// Percent of speed lost per second.
		this.friction = 0.9;
		this.vel = { x: 0.0, y: 0.0 };
		this.thrust = 10.0;
		this.turnSpeed = 3.0;
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

		// Friction
		this.vel.x *= 1 - (this.friction * dt);
		this.vel.y *= 1 - (this.friction * dt);
		if (this.vel.x * this.vel.x + this.vel.y * this.vel.y < 0.01) {
			this.vel.x = 0;
			this.vel.y = 0;
		}

		// Thrust
		if (this.thrusting) {
			this.vel.x += this.thrust * dt * Math.sin(this.angle * (Math.PI/180));
			this.vel.y += this.thrust * dt * Math.cos(this.angle * (Math.PI/180));
		}

		// Movement
		this.x += this.vel.x;
		this.y -= this.vel.y;

		// Screen wrap
		if (this.x > game.view.width) {
			this.x -= game.view.width;
		} else if (this.x < 0) {
			this.x += game.view.width;
		}
		if (this.y > game.view.height) {
			this.y -= game.view.height;
		} else if (this.y < 0) {
			this.y += game.view.height;
		}

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