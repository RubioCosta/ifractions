/*
    let loadAssets = {
		preload: function(){},
		create: function()
        ---------------------------- end of phaser functions
	};
*/

	// Global variables that still need checking 
	
	//map
	let kid;

	//square 1 + circle 1
	let startX;
	let clicked, hideLabels, checkCollide, result, hasFigure;
	let detail;
	let endPosition;
	let fractionClicked, fractionIndex;
	let blocks, maxBlocks, numBlocks, curBlock, blockDirection, blockDistance, blockLabel, blockSeparator; //blocks control

	//square 1
	let blockWidth, blockIndex;
	let floorBlocks, floorIndex, floorCount, floorClicked, curFloor;
	let move, moveCounter, moveEnd;
	let arrow;
	let arrowPlace;

	//circle 1
	let blockSize, blockAngle, blockTraceColor;
	let fly, flyCounter, flyend; //flyvariables
	let trace; //circle trace
	let numPlus, endIndex;
	let kid_walk, balloon, basket;
	let balloonPlace;

	//square 2
	let sizeA, sizeB, valueA, valueB;
	let clickA, clickB, animateA, animateB, animate, cDelay, eDelay;
	let blocksA, blocksB, auxblqA, auxblqB;
	let labelA, fractionA, separatorA, labelB, fractionB, separatorB;
	let kidDirection, equals, counter, endCounter;
	let xA, yA, xB, yB, blockW, blockH;

// Game dimentions
const defaultWidth = 900;
const defaultHeight = 600;
// Initialize phaser
let game = new Phaser.Game(
	defaultWidth, 
	defaultHeight, 
	Phaser.CANVAS,
	'fractions-game'
);

// META

let username; 				// Player name
let lang, langString; 		// Language object and language name
let audioStatus = false; 	// Turns game audio ON/OFF
let debugMode = true; 		// Turns console messages for developers ON/OFF (to be changed only by code)

// GAME LEVELS

let currentGameState; 			// Name of the current 'game' state

let levelShape;		 	// Can be 'circle' or 'square'
/* LEVEL TYPE
 * in squareOne/circleOne can be: 'A' (click on the floor) or 'B' (click on the amount to go)
 * in squareTwo           can be: 'C' (comparing fractions) */
let levelType;

let levelLabel = true; 		// Turns fraction labels ON/OFF
/* SUBLEVEL TYPE
 * in squareOne/circleOne levels can be: 'Plus', 'Minus' or 'Mixed'
 * in squareTwo           level  can be: 'A', 'B' or 'C' */
let sublevelType;	
let levelDifficulty; 		// Level difficulty: a value from 1 to 5 (depends on the level)

let levelPosition;			// Position of the character in the map
let levelMove;				// When true allows character to move to next position in the map
let passedLevels;			// Number of finished levels in the map

// SOUNDS
let beepSound, okSound, errorSound;
	
// IMAGES
let okImg, errorImg;

// TIMER
let timer, totalTime;

// CONNECTION TO DATABASE
const hip = "143.107.45.11"; // Host ip
	
let loadAssets = {

	preload: function(){

		// Auxiliar string that holds the base directory
		const imgsrc = 'assets/img/';

		// Progress bar
		game.load.image('progressBar', imgsrc+'pgbar.png');
	
		// Flags
		game.load.image('flag_BR', 	imgsrc+'flag/BRAZ.jpg');
		game.load.image('flag_PE', 	imgsrc+'flag/PERU.jpg');
		game.load.image('flag_US', 	imgsrc+'flag/UNST.jpg');
		game.load.image('flag_FR', 	imgsrc+'flag/FRAN.jpg');
		game.load.image('flag_IT', 	imgsrc+'flag/ITAL.png');
		
		// Scenario
		game.load.image('bgimage', 	imgsrc+'bg.jpg');
		game.load.image('bgmap', 	imgsrc+'bg_map.png');
		game.load.image('cloud', 	imgsrc+'cloud.png');
		game.load.image('floor',	imgsrc+'floor.png');
		game.load.image('road', 	imgsrc+'road.png');
		game.load.image('birch', 	imgsrc+'birch.png');
		game.load.image('house', 	imgsrc+'house.png');
		game.load.image('place_a', 	imgsrc+'place_a.png');
		game.load.image('place_b', 	imgsrc+'place_b.png');
		game.load.image('garage', 	imgsrc+'garage.png');
		game.load.image('farm', 	imgsrc+'farm.png');
		game.load.image('rock', 	imgsrc+'rock.png');
		game.load.image('school', 	imgsrc+'school.png');
		game.load.image('sign',		imgsrc+'sign.png');
		game.load.image('tree1', 	imgsrc+'tree.png');
		game.load.image('tree2', 	imgsrc+'tree2.png');
		game.load.image('tree3', 	imgsrc+'tree3.png');
		game.load.image('tree4', 	imgsrc+'tree4.png');

		// Menu icons on the top of the page
		game.load.image('back', 	imgsrc+'menu/back.png');
		game.load.image('home', 	imgsrc+'menu/home.png');
		game.load.image('info', 	imgsrc+'menu/info.png');
		game.load.image('world', 	imgsrc+'menu/language.png');
		game.load.image('list', 	imgsrc+'menu/menu.png');
		game.load.image('help', 	imgsrc+'menu/help.png');
		game.load.image('pgbar', 	imgsrc+'menu/progressBar.png');
		game.load.image('block', 	imgsrc+'menu/block.png');
		game.load.spritesheet('audio',	imgsrc+'menu/audio_48x48.png',48,48,2);

		// Mathematical operators
		game.load.image('add',		imgsrc+'operator/add.png');
		game.load.image('subtract', imgsrc+'operator/subtract.png');
		game.load.image('separator',imgsrc+'operator/separator.png');
		game.load.image('equal', 	imgsrc+'operator/equal.png');
		
		// Feedback icons
		game.load.image('h_arrow', 		imgsrc+'help/arrow.png');
		game.load.image('h_double', 	imgsrc+'help/double.png');
		game.load.image('h_error', 		imgsrc+'help/error.png');
		game.load.image('h_ok', 		imgsrc+'help/ok.png');
		game.load.image('down', 		imgsrc+'help/down.png');        
		game.load.image('pointer', 		imgsrc+'help/pointer.png');
		game.load.spritesheet('select',	imgsrc+'help/selection_box.png', 310, 310, 2); 
		
		// Game sprites        
		game.load.spritesheet('kid_run',	imgsrc+'kid/run.png', 82, 178, 12);
		game.load.spritesheet('kid_walk', 	imgsrc+'kid/walk.png', 78, 175, 26);
		game.load.spritesheet('kid_lost', 	imgsrc+'kid/lost.png', 72, 170, 6);
		game.load.spritesheet('tractor', 	imgsrc+'tractor/frame.png', 201, 144, 10);
		game.load.image('tractor_green',	imgsrc+'tractor/frame-0.png');
		game.load.image('tractor_red', 		imgsrc+'tractor/frame-5.png');
		game.load.image('balloon', 			imgsrc+'airballoon_upper.png');
		game.load.image('balloon_basket', 	imgsrc+'airballoon_base.png');
		
		// Sound effects
		game.load.audio('sound_ok', ['assets/fx/ok.ogg', 'assets/fx/ok.mp3']);
		game.load.audio('sound_error', ['assets/fx/error.ogg', 'assets/fx/error.mp3']);
		game.load.audio('sound_beep', ['assets/fx/beep.ogg', 'assets/fx/beep.mp3']);

		const levelSpriteSource = [
			'squareOne_1.png', 	//square I
			'squareOne_2.png', 	//square II
			'circleOne_1.png',	//circle I
			'circleOne_2.png',	//circle II
			'squareTwo_3.png'	//square III
		];
		if(debugMode){
			levelSpriteSource.push(
				'squareTwo_3.png',
				'squareTwo_3.png',
				'squareTwo_3.png',
				'squareTwo_3.png',

				'squareTwo_3.png',
				'squareTwo_3.png',
				'squareTwo_3.png',
				'squareTwo_3.png'
			);
		}
					
		//game phases buttons list
		for(let i=0; i<levelSpriteSource.length; i++){
			game.load.image('game'+i,	imgsrc+'game/'+levelSpriteSource[i]);
		}
		
		this.levelShapeList = [
			'Square', 
			'Square', 
			'Circle', 
			'Circle', 
			'Square',
		];	
		if(debugMode){
			this.levelShapeList.push(
				'Square', 
				'Square', 
				'Square', 
				'Square',

				'Square', 
				'Square', 
				'Square', 
				'Square'
			);
		}
		
		this.levelTypeList  = [
			'A', 
			'B', 
			'A', 
			'B', 
			'C'
		];	       	
		if(debugMode){
			this.levelTypeList.push(
				'C', 
				'C', 
				'C', 
				'C',

				'C', 
				'C', 
				'C', 
				'C'
			);
		}
		
	},

	create: function(){

		// Centers phaser canvas in its containing div
		game.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		
		// Enable phaser Arcade Physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);

		//loading game sounds
		beepSound = game.add.audio('sound_beep');   // game sound
		okSound = game.add.audio('sound_ok');       // correct answer sound
		errorSound = game.add.audio('sound_error'); // wrong answer sound

		// Calls first screen seen by the player
		game.state.start('language');
	
	}
	
};

// Adding game states

game.state.add('language', langState); // preMenu.js
game.state.add('load', loadState); // preMenu.js
game.state.add('name', nameState); // preMenu.js

game.state.add('menu', menuState); // menu.js

game.state.add('map', mapState); // map.js

game.state.add('difficulty', difficultyState); // difficulty.js

game.state.add('gameCircleOne', gameCircleOne); // circleOne.js
game.state.add('gameSquareOne', gameSquareOne); // squareOne.js
game.state.add('gameSquareTwo', gameSquareTwo); // squareTwo.js

game.state.add('end', endState); // end.js

game.state.add('loadAssets', loadAssets); // boot.js

// Calls the first game state in charge of loading all the assets needed for the game

game.state.start('loadAssets');