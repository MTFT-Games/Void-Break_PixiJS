//#region Setup
//#region PIXI init
"use strict";
/* TODO: Dynamically size the window and scale the game toy the size of the 
browser window. */
const game = new PIXI.Application({
	width: 600,
	height: 600
});
//#endregion

window.onload = () => {
	document.body.appendChild(game.view);

	//#region Image loading
	// TODO: Load and use textures in place of primitive shapes.
	game.loader.
		add([

		]);
	game.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
	game.loader.onComplete.add(Setup);
	game.loader.load();
	//#endregion
};

//#region Variables
let playerBullets = [];
let enemyBullets = [];
let enemies = [];
let player;
let UI = {
	score: { current: null, final: null },
	health: { max: null, current: null },
	shield: { max: null, current: null}
};

let mainMenuScene, gameScene, gameOverScene;
let score = 0;
let paused = true;
let dt;
//#endregion

/**
 * Sets up the initial state of the game.
 * 
 * To be called once after loading textures.
 */
function Setup() {
	//#region Initialize scenes
	mainMenuScene = new PIXI.Container();
	game.stage.addChild(mainMenuScene);

	gameScene = new PIXI.Container();
	gameScene.visible = false;
	game.stage.addChild(gameScene);

	gameOverScene = new PIXI.Container();
	gameOverScene.visible = false;
	game.stage.addChild(gameOverScene);
	//#endregion

	//#region Create UI
	let buttonStyle = new PIXI.TextStyle({
		fill: 0xFF0000,
		fontSize: 48,
		fontFamily: "Futura"
	});
	let textStyle = new PIXI.TextStyle({
		fill: 0xFFFFFF,
		fontSize: 18,
		fontFamily: "Futura",
	});

	//#region Main menu UI
	// Logo text.
	// TODO: Make the logo a stylized sprite instead of plain text.
	let logo = new PIXI.Text("Void Break", {
		fill: 0xFFFFFF,
		fontSize: 96,
		fontFamily: "Futura",
		stroke: 0xFF0000,
		strokeThickness: 6
	});
	logo.anchor.set(0.5, 0.5);
	logo.x = game.view.width / 2;
	logo.y = 100;
	mainMenuScene.addChild(logo);

	// Start button
	let startButton = new PIXI.Text("Start", buttonStyle);
	startButton.anchor.set(0.5, 0.5);
	startButton.x = game.view.width / 2;
	startButton.y = game.view.height - 100;
	startButton.interactive = true;
	startButton.buttonMode = true;
	startButton.on("pointerup", StartGame);
	startButton.on('pointerover', e => e.target.alpha = 0.7);
	startButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
	mainMenuScene.addChild(startButton);
	//#endregion

	//#region Game UI
	//#region Test button
	// Test button to end the game and test the scene loop.
	let testEndButton = new PIXI.Text("TESTING END GAME", buttonStyle);
	testEndButton.x = 80;
	testEndButton.y = game.view.height - 100;
	testEndButton.interactive = true;
	testEndButton.buttonMode = true;
	testEndButton.on("pointerup", EndGame);
	testEndButton.on('pointerover', e => e.target.alpha = 0.7);
	testEndButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
	gameScene.addChild(testEndButton);
	//#endregion Test

	//#region Health bar
	// Health bar background
	UI.health.max = new PIXI.Graphics();
	UI.health.max.lineStyle(5, 0x3F3F3F, 1); // Width, color, alpha
	UI.health.max.moveTo(-1.5, 0);
	UI.health.max.lineTo(1.5, 0);
	UI.health.max.x = game.view.width / 2;
	UI.health.max.y = game.view.height - 20;
	gameScene.addChild(UI.health.max);

	// Health bar
	UI.health.current = new PIXI.Graphics();
	UI.health.current.lineStyle(5, 0xCF0000, 1); // Width, color, alpha
	UI.health.current.moveTo(-1.5, 0);
	UI.health.current.lineTo(1.5, 0);
	UI.health.current.x = game.view.width / 2;
	UI.health.current.y = game.view.height - 20;
	gameScene.addChild(UI.health.current);
	//#endregion

	//#region Shield bar
	// TODO: Refresh bar maybe?
	// Shield bar background
	UI.shield.max = new PIXI.Graphics();
	UI.shield.max.lineStyle(5, 0x3F3F3F, 1); // Width, color, alpha
	UI.shield.max.moveTo(-1.5, 0);
	UI.shield.max.lineTo(1.5, 0);
	UI.shield.max.x = game.view.width / 2;
	UI.shield.max.y = game.view.height - 14;
	gameScene.addChild(UI.shield.max);

	// Shield bar
	UI.shield.current = new PIXI.Graphics();
	UI.shield.current.lineStyle(5, 0x0000CF, 1); // Width, color, alpha
	UI.shield.current.moveTo(-1.5, 0);
	UI.shield.current.lineTo(1.5, 0);
	UI.shield.current.x = game.view.width / 2;
	UI.shield.current.y = game.view.height - 14;
	gameScene.addChild(UI.shield.current);
	//#endregion

	//#region Score
	// Score label
	let scoreLabel = new PIXI.Text("Score: ", textStyle);
	gameScene.addChild(scoreLabel);

	// Score counter
	// The text of this should be changed to keep up with the current score.
	UI.score.current = new PIXI.Text("0", textStyle);
	UI.score.current.x = scoreLabel.x + scoreLabel.width;
	UI.score.current.y = scoreLabel.y;
	gameScene.addChild(UI.score.current);
	//#endregion Score
	//#endregion Game UI

	//#region Game over UI
	// Big game over label
	let gameOverLabel = new PIXI.Text("Game Over", {
		fill: 0xFFFFFF,
		fontSize: 96,
		fontFamily: "Futura",
		stroke: 0x0F0F0F,
		strokeThickness: 4
	});
	gameOverLabel.anchor.set(0.5, 0.5);
	gameOverLabel.x = game.view.width / 2;
	gameOverLabel.y = 100;
	gameOverScene.addChild(gameOverLabel);

	// Final score counter
	// Text should be updated when transitioning to game over scene.
	UI.score.final = new PIXI.Text("Score: UNSET", textStyle);
	UI.score.final.anchor.set(0.5, 0.5);
	UI.score.final.x = game.view.width / 2;
	UI.score.final.y = 200;
	gameOverScene.addChild(UI.score.final);

	// Replay button
	let restartButton = new PIXI.Text("Play again?", buttonStyle);
	restartButton.anchor.set(0.5, 0.5);
	restartButton.x = game.view.width / 2;
	restartButton.y = game.view.height - 100;
	restartButton.interactive = true;
	restartButton.buttonMode = true;
	restartButton.on("pointerup", StartGame);
	restartButton.on('pointerover', e => e.target.alpha = 0.7);
	restartButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
	gameOverScene.addChild(restartButton);
	//#endregion Game over
	//#endregion UI

	player = new Player();
}
//#endregion Setup

function StartGame() {
	// TODO
	gameOverScene.visible = false;
	mainMenuScene.visible = false;
	gameScene.visible = true;
}

function EndGame() {
	// TODO
	gameOverScene.visible = true;
	mainMenuScene.visible = false;
	gameScene.visible = false;
}
// TODO: Better label region endings