
/*
    let loadAssets = {
		preload: function(){},
		create: function()
        ---------------------------- end of phaser functions
	};
*/

// OUTRAS VARIAVEIS GLOBAIS

				let passedLevels;

				//premenu
				let errorEmptyName;

				//map
				let kid, tractor;

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

	// INFO
	let username; //player name
	let lang; //language

	// IMAGES
	let beepSound, okSound, errorSound; //sounds
	let okImg, errorImg;
    let timer, totalTime;

    // variaveis globais
    let audioStatus = false; // turns game audio on/off
    let firstTime = true; //if player has just oppened the game
    let debugMode = true; //turns console messages for developers on/off (changeable only by code)

	// game dimentions
	const defaultWidth = 900;
	const defaultHeight = 600;

	// Initialize the game
	let game = new Phaser.Game(
		defaultWidth, 
		defaultHeight, 
		Phaser.CANVAS,
		'fractions-game'
	);
	
    const hip = "143.107.45.11"; //Host ip
	
    // Game One : kid and truck

    let levelPosition = 0; //Map position
    let levelMove = false; //Move to next position
    let levelDifficulty = 0; //From one to five 

    let levelOperator = ""; //Plus; Minus; Mixed 

    let levelLabel= false; //Show block label
    let levelShape = ""; //Circle; square
    let levelType = ""; // A - Place distance; B - Select blocks
    let levelMenu = true;

    //adding game states (scenes)
    
    game.state.add('language', langState); // preMenu.js
    game.state.add('load', loadState); // preMenu.js
    game.state.add('name', nameState); // preMenu.js

    game.state.add('menu', menuState); // menu.js

    game.state.add('map', mapState); // map.js

    game.state.add('menuCircleOne', menuCircleOne); // circleOne.js
    game.state.add('gameCircleOne', gameCircleOne); // circleOne.js
    game.state.add('endCircleOne', endCircleOne); // circleOne.js

    game.state.add('menuSquareOne', menuSquareOne); // squareOne.js
    game.state.add('gameSquareOne', gameSquareOne); // squareOne.js
    game.state.add('endSquareOne', endSquareOne); // squareOne.js

    game.state.add('menuSquareTwo', menuSquareTwo); // squareTwo.js
    game.state.add('gameSquareTwo', gameSquareTwo); // squareTwo.js
    game.state.add('endSquareTwo', endSquareTwo); // squareTwo.js

    let loadAssets = {

    	preload: function(){

    		//auxiliar directory
	        const imgsrc = 'assets/img/';

	        //Progress bar image
	        game.load.image('progressBar', imgsrc+'pgbar.png');

	        //flags
	        game.load.image('flag_BR', 	imgsrc+'flag/BRAZ.jpg');
	        game.load.image('flag_PE', 	imgsrc+'flag/PERU.jpg');
	        game.load.image('flag_US', 	imgsrc+'flag/UNST.jpg');
	        game.load.image('flag_FR', 	imgsrc+'flag/FRAN.jpg');
	        game.load.image('flag_IT', 	imgsrc+'flag/ITAL.png');

	        //scenario
	        game.load.image('bgimage', 	imgsrc+'bg.jpg');
	        game.load.image('bgmap', 	imgsrc+'bg_map.png');
	        game.load.image('cloud', 	imgsrc+'cloud.png');
	        game.load.image('floor',	imgsrc+'floor.png');
	        game.load.image('road', 	imgsrc+'road.png');

	        //game phases buttons list
	        this.levelSpriteList = [];

	        
	        let levelSpriteSource = [
	        	'1-left-subs.png', 	//square I
	        	'2-left-subs.png', 	//square II
	        	'3-left-subs.png',	//circle I
	        	'4-left-subs.png',	//circle II
	        	'5.png'				//square III
	        ];
			
			
	        if(debugMode){
	        	levelSpriteSource.push(
		        	'5.png',
		        	'5.png',
		        	'5.png',
		        	'5.png',

		        	'5.png',
		        	'5.png',
		        	'5.png',
		        	'5.png'
				);
	    	}
			

	        for(let i=0; i<levelSpriteSource.length; i++){
	        	this.levelSpriteList[i] = 'game'+i;
	        	game.load.image(this.levelSpriteList[i], 	imgsrc+'game/'+levelSpriteSource[i]);
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
        		1, 
        		2, 
        		1, 
        		2, 
        		3
        	];
        	
	       	
	       	if(debugMode){
	       		this.levelTypeList.push(
	        		3, 
	        		3, 
	        		3, 
	        		3,

	        		3, 
	        		3, 
	        		3, 
	        		3
				);
	        }
	       	

	        //header menu buttons
	        game.load.image('back', 	imgsrc+'menu/back.png');
	        game.load.image('home', 	imgsrc+'menu/home.png');
	        game.load.image('info', 	imgsrc+'menu/info.png');
	        game.load.image('world', 	imgsrc+'menu/language.png');
	        game.load.image('list', 	imgsrc+'menu/menu.png');
	        game.load.image('help', 	imgsrc+'menu/help.png');
	        game.load.image('pgbar', 	imgsrc+'menu/progressBar.png');
	        game.load.image('block', 	imgsrc+'menu/block.png');
			game.load.spritesheet('audio',	imgsrc+'menu/audio_48x48.png',48,48,2);

	        //operators
	        game.load.image('add',		imgsrc+'operator/add.png');
	        game.load.image('subtract', imgsrc+'operator/subtract.png');
	        game.load.image('separator',imgsrc+'operator/separator.png');
	        game.load.image('equal', 	imgsrc+'operator/equal.png');
	        
	        //feedback
	        game.load.image('h_arrow', 	imgsrc+'help/arrow.png');
	        game.load.image('h_double', imgsrc+'help/double.png');
	        game.load.image('h_error', 	imgsrc+'help/error.png');
	        game.load.image('h_ok', 	imgsrc+'help/ok.png');
	        game.load.image('down', 	imgsrc+'help/down.png');        
	        game.load.image('pointer', 	imgsrc+'help/pointer.png');
	        
	        // Loading assets based on language        
	        game.load.spritesheet('kid_run',	imgsrc+'kid/run.png', 82, 178, 12);
	        game.load.spritesheet('kid_walk', 	imgsrc+'kid/walk.png', 78, 175, 26);
	        game.load.spritesheet('kid_lost', 	imgsrc+'kid/lost.png', 72, 170, 6);
	        game.load.spritesheet('tractor', 	imgsrc+'tractor/frame.png', 201, 144, 10);
	        
	        game.load.image('tractor_green',	imgsrc+'tractor/frame-0.png');
	        game.load.image('tractor_red', 		imgsrc+'tractor/frame-5.png');
	        
	        game.load.image('balloon', 			imgsrc+'airballoon_upper.png');
	        game.load.image('balloon_basket', 	imgsrc+'airballoon_base.png');
	        game.load.image('birch', 			imgsrc+'birch.png');
	        game.load.image('flag', 	imgsrc+'flag.png');
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
	        
	        // Loadind Sound Effects
	        game.load.audio('sound_ok', ['assets/fx/ok.ogg', 'assets/fx/ok.mp3']);
	        game.load.audio('sound_error', ['assets/fx/error.ogg', 'assets/fx/error.mp3']);
	        game.load.audio('sound_beep', ['assets/fx/beep.ogg', 'assets/fx/beep.mp3']);

    	},

    	create: function(){

    		game.physics.startSystem(Phaser.Physics.ARCADE);
		    game.state.start('language');
    	
    	}
    	
    };

    game.state.add('loadAssets', loadAssets); // boot.js

	// We finished loading everything and the first state is called
	game.state.start('loadAssets');