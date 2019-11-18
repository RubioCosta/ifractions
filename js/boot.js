// OUTRAS VARIAVEIS GLOBAIS

				var passedLevels;

				//map
				var kid, tractor;

				//square 1 + circle 1
				var startX;
				var clicked, hideLabels, animate, checkCollide, result, hasFigure;
				var detail;
				var endPosition;
				var fractionClicked, fractionIndex;
				var blocks, maxBlocks, numBlocks, curBlock, blockDirection, blockDistance, blockLabel, blockSeparator; //blocks control

				//square 1
				var blockWidth, blockIndex;
				var floorBlocks, floorIndex, floorCount, floorClicked, curFloor;
				var move, moveCounter, moveEnd;
				var arrow;
				var arrowPlace;

				//circle 1
				var blockSize, blockAngle, blockTraceColor;
				var fly, flyCounter, flyend; //flyvariables
				var trace; //circle trace
				var numPlus, endIndex;
				var kid_walk, balloon, basket;
				var balloonPlace;

				//square 2
				var sizeA, sizeB, valueA, valueB;
				var clickA, clickB, animateA, animateB, result, animate, cDelay, eDelay;
				var blocksA, blocksB, auxblqA, auxblqB;
				var labelA, fractionA, separatorA, labelB, fractionB, separatorB;
				var kidDirection, equals, counter, endCounter;
				var xA, yA, xB, yB, blockW, blockH;

	// INFO
	var username; //player name
	var lang; //language

	// IMAGES
	var beepSound, okSound, errorSound; //sounds
	var okImg, errorImg;
    var timer, totalTime;

    // variaveis globais
    var audioStatus = true; // turns game audio on/off
    var firstTime = true; //if player has just oppened the game
    var debugMode = true; //turns console messages for developers on/off (changeable only by code)


    // Initialize the game
    var game = new Phaser.Game(
        900, 
        600, 
        Phaser.CANVAS,
        'fractions-game'
    );

    hip = "143.107.45.11"; //Host ip
    name = ""; //player name
    lang = ""; //language

    // Game One : kid and truck

    levelPosition = 0; //Map position
    levelMove = false; //Move to next position
    levelDifficulty = 0; //From one to five 

    levelOperator= ""; //Plus; Minus; Mixed 

    levelLabel= false; //Show block label
    levelShape = ""; //Circle; square
    levelType = ""; // A - Place distance; B - Select blocks
    levelMenu = true;

    //adding game states (scenes)
    
    game.state.add('language', langState); // boot.js
    game.state.add('load', loadState); // boot.js
    game.state.add('name', nameState); // boot.js

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

    var loadAssets = {

    	preload: function(){
    
    		//directory auxiliar
	        var imgsrc = 'assets/img/';

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
	        game.load.image('game1s', 	imgsrc+'game/1-left-subs.png');
	        game.load.image('game2s', 	imgsrc+'game/1-right-nosubs.png');
	        game.load.image('game3s', 	imgsrc+'game/2-left-subs.png');
	        game.load.image('game4s', 	imgsrc+'game/2-right-nosubs.png');
	        game.load.image('game1c', 	imgsrc+'game/3-left-subs.png');
	        game.load.image('game2c', 	imgsrc+'game/3-right-nosubs.png');
	        game.load.image('game3c', 	imgsrc+'game/4-left-subs.png');
	        game.load.image('game4c', 	imgsrc+'game/4-right-nosubs.png');
	        game.load.image('game5s', 	imgsrc+'game/5.png');
	        
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

    //starting to boot game
    game.state.add('loadAssets', loadAssets); // squareTwo.js
   	game.state.start('loadAssets');