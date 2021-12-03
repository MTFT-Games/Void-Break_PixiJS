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
	
};

let mainMenuScene, gameScene, gameOverScene;
let score = 0;
let paused = true;
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
	startButton.x = 80;
	startButton.y = game.view.height - 100;
	startButton.interactive = true;
	startButton.buttonMode = true;
	startButton.on("pointerup", StartGame);
	startButton.on('pointerover', e => e.target.alpha = 0.7);
	startButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
	mainMenuScene.addChild(startButton);
	//#endregion

	//#region Game UI

	//#endregion

	//#region Game over UI

	//#endregion
	//#endregion
}
//#endregion

function StartGame() {
	// TODO
	mainMenuScene.visible = false;
	gameScene.visible = true;
}