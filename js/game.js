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

let mainMenuScene, gameScene, gameOverScene;
let score = 0;
let paused = true;
//#endregion

// TODO
function Setup(){

}
//#endregion