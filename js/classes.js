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
		this.scale.set(4);

		gameScene.addChild(this);

		this.scrollLimit = 0;
		this.scrollBoundaries = { 
			posX: game.view.width/2 + this.scrollLimit, 
			negX: game.view.width/2 - this.scrollLimit, 
			posY: game.view.height/2 + this.scrollLimit, 
			negY: game.view.height/2 - this.scrollLimit 
		};

		this.Reset();
	}

	/**
	 * Resets player to initial state ready for a new game.
	 */
	Reset() {
		this.friction = 0.9;
		this.vel = { x: game.view.width/100, y: game.view.height/100 };
		this.thrust = 10.0;
		this.turnSpeed = 3.0;
		this.turning = "";
		this.thrusting = false;
		this.x = 0;
		this.y = game.view.height;
		this.angle = 45;

		this.health = { max: 100, current: 100 };
		this.shield = { max: 50, current: 50 };
		this.damageCooldown = { max: 10, current: 0 };
		UI.health.max.scale.set(this.health.max, 1);
		UI.health.current.scale.set(this.health.current, 1);
		UI.shield.max.scale.set(this.shield.max, 1);
		UI.shield.current.scale.set(this.shield.current, 1);

		this.projectiles = { count: 1, burst: 1, rate: 5.0, spread: 0, cooldown: 0 };
		this.bullet = { type: "bullet", damage: 5, size: 1, speed: 400, enemy: false, lifetime: 2 };
		this.firing = false;
		this.startFiring = false;
	}

	/**
	 * Update the state of this player.
	 * 
	 * Updates and applies rotation, thrust, friction, velocity, cooldowns, regen, 
	 * and shooting.
	 */
	Update() {
		// Turn
		// TODO: Maybe add a tiny hint of momentum to turning.
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
		if (this.x > this.scrollBoundaries.posX) { // Too far right
			if (this.vel.x > 0) { // And moving right
				showWorld.x -= this.vel.x;
			}else {
				this.x += this.vel.x;
			}
		}else if (this.x < this.scrollBoundaries.negX) { // Too far left
			if (this.vel.x < 0) { // And moving left
				showWorld.x -= this.vel.x;
			}else {
				this.x += this.vel.x;
			}
		}else { // In bounds
			this.x += this.vel.x;
		}
		if (this.y > this.scrollBoundaries.posY) { // Too low
			if (this.vel.y < 0) { // And moving down
				showWorld.y += this.vel.y;
			}else {
				this.y -= this.vel.y;
			}
		}else if (this.y < this.scrollBoundaries.negY) { // Too high
			if (this.vel.y > 0) { // And moving up
				showWorld.y += this.vel.y;
			}else {
				this.y -= this.vel.y;
			}
		}else { // In bounds
			this.y -= this.vel.y;
		}

		// Screen wrap
		if (this.x - showWorld.x > worldSize*2) {
			showWorld.x += worldSize;
		} else if (this.x - showWorld.x < worldSize) {
			showWorld.x -= worldSize;
		}
		if (this.y - showWorld.y > worldSize*2) {
			showWorld.y += worldSize;
		} else if (this.y - showWorld.y < worldSize) {
			showWorld.y -= worldSize;
		}

		// Cooldowns
		this.damageCooldown.current -= dt;
		this.projectiles.cooldown -= dt;

		if (this.startFiring) {
			this.startFiring = false;
			this.firing = true;
			this.projectiles.cooldown = 0;
		}
		while (this.firing && this.projectiles.cooldown <= 0) {
			this.Shoot();
		}
		// TODO: regen if off cooldown


	}

	Shoot() {
		if (playerBullets.length < 150) {
			playerBullets.push(new Bullet(this));
		}
		this.projectiles.cooldown += (1/this.projectiles.rate);
	}

	/**
	 * Apply damage to the player.
	 * 
	 * Applies damage to the players shields before health and resets damage 
	 * cooldown. Ends game if damage is fatal.
	 * 
	 * @param {*} amt The amount of damage to apply.
	 */
	Damage(amt) {
		// Reset damage cooldown.
		this.damageCooldown.current = this.damageCooldown.max;

		// Apply damage to shield.
		this.shield.current -= amt;
		
		// Apply any damage the shield can't absorb to health.
		if (this.shield.current < 0) {
			this.health.current += this.shield.current;
			this.shield.current = 0;
			
			// Check for death.
			if (this.health.current <= 0) {
				EndGame();
			}
		}
		UI.shield.current.scale.set(this.shield.current, 1);
		UI.health.current.scale.set(this.health.current, 1);
	}
}

class Bullet extends PIXI.Graphics {
	//stats, playerVel, playerAngle, startingPos, timeSinceShot
	constructor(parent) {
		super();
		// Draw shape.
		if (parent.bullet.enemy) {
			this.lineStyle(1, 0xFF0000, 1);
		}else {
			this.lineStyle(1, 0xFFFFFF, 1);
		}
		this.beginFill(0xFFFFFF);
		this.moveTo(0, -2);
		this.lineTo(1.5, 2);
		this.lineTo(0, 1);
		this.lineTo(-1.5, 2);
		this.lineTo(0, -2);
		this.endFill();
		this.scale.set(parent.bullet.size);

		world.addChild(this);

		this.x = parent.x - showWorld.x - worldSize + parent.vel.x * parent.projectiles.cooldown;
		this.y = parent.y - showWorld.y - worldSize - parent.vel.y * parent.projectiles.cooldown;
		this.angle = parent.angle;
		this.damage = parent.bullet.damage;
		this.vel = { 
			x: parent.vel.x + parent.bullet.speed * Math.sin(this.angle * (Math.PI/180)), 
			y: parent.vel.y + parent.bullet.speed * Math.cos(this.angle * (Math.PI/180))
		}
		this.lifetime = parent.bullet.lifetime;
		this.Update(-parent.projectiles.cooldown);
	}

	Update(_dt) {
		this.lifetime -= _dt;
		if (this.lifetime < 0) {
			world.removeChild(this);
		}

		this.x += this.vel.x * _dt;
		this.y -= this.vel.y * _dt;
		
		// Screen wrap
		if (this.x > worldSize) {
			this.x -= worldSize;
		} else if (this.x < 0) {
			this.x += worldSize;
		}
		if (this.y > worldSize) {
			this.y -= worldSize;
		} else if (this.y < 0) {
			this.y += worldSize;
		}
	}
}