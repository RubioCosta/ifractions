/*
    let difficultyState = {
		create: function(){},
		func_loadMap: function()
        ---------------------------- end of phaser functions
	};
*/

let difficultyState = {

    create: function() {

        // Calls function that loads navigation icons
        iconSettings["func_addButtons"](true,true,
                                    false,true,false,
                                    true,false,
                                    false,false);
    
        // Title
        const style = { font: '28px Arial', fill: '#00804d'};
        const title = game.add.text(game.world.centerX, 40, lang.game_menu_title, style);
        title.anchor.setTo(0.5, 0.5);

        //SETTING DIFFICULTY LEVELS

        const maxHeight = 120; //Max height of a stair        
        let stairHeight; //height growth of a stair
        let stairWidth; //Width of a stair
        let startStair;
        let startSymbol;
        let startGeometricFigure; // @@ transformar em so uma variavel
        
        switch(gameStateString){
            case "gameSquareOne":
                stairHeight = 40;
                stairWidth = 100;
                startStair = 320;
                startSymbol = 180;
                startGeometricFigure = (startSymbol/2)+startStair+stairWidth*3;
            break;
            case "gameSquareTwo":
                stairHeight = 29;
                startStair = 240; 
                startSymbol = 150;

                stairWidth = 80;
                startGeometricFigure = (startSymbol/2)+startStair+stairWidth*5;
            break;
            case "gameCircleOne":
                stairHeight = 29;
                startStair = 240; 
                startSymbol = 150;

                stairWidth = 85;
                startGeometricFigure = (startSymbol/2)+startStair+stairWidth*5;
            break;
            default:
                console.log("Error! game state name not found!");
        }

        //@@ usar phaser groups ou objetos??
        let geometricFigure = [];
        let levelThemeIcons = [];
        let arrowIcons = [];
        
        let stairs = [];

        const aux = {
            maxSublevel: null,
            maxDifficulty: null,
            color: ['0x99b3ff', '0xff6666', '0xb366ff'], // blue, red, purple

            operator_1: ['Plus', 'Minus', 'Mixed'],
            operator_2: ['A', 'B', 'C'],
            base_y1_1: [135, 285, 435],
            base_y1_2: [100, 270, 440],
            get operator() {
                if (gameStateString == 'gameSquareTwo') return this.operator_2;
                else return this.operator_1;
            },
            get base_y1() {
                if (gameStateString == 'gameSquareTwo') return this.base_y1_2;
                else return this.base_y1_1;
            }  
        }

        switch(gameStateString){
            
            case "gameSquareOne":

                aux.maxSublevel = 2;
                aux.maxDifficulty = 3;

                // Blue square
                geometricFigure[0] = game.add.graphics(startGeometricFigure, 175);
                geometricFigure[0].anchor.setTo(0.5,0.5);
                geometricFigure[0].lineStyle(2, 0x31314e);
                geometricFigure[0].beginFill(0xefeff5);
                geometricFigure[0].drawRect(0, 0, 80, 40);
                geometricFigure[0].endFill();
                // Red square
                geometricFigure[1] = game.add.graphics(startGeometricFigure, 330);
                geometricFigure[1].anchor.setTo(0.5,0.5);
                geometricFigure[1].lineStyle(2, 0xb30000);
                geometricFigure[1].beginFill(0xefeff5);
                geometricFigure[1].drawRect(0, 0, 80, 40);
                geometricFigure[1].endFill();

                // Green tractor
                levelThemeIcons[0] = game.add.sprite(startSymbol+30, 215, 'tractor_green');
                levelThemeIcons[0].scale.setTo(0.5);
                levelThemeIcons[0].alpha = 0.9;
                levelThemeIcons[0].anchor.setTo(0.5,0.5);
                // Red tractor
                levelThemeIcons[1] = game.add.sprite(startSymbol+70, 370, 'tractor_red');
                levelThemeIcons[1].scale.setTo(0.5);
                levelThemeIcons[1].alpha = 0.9;
                levelThemeIcons[1].anchor.setTo(0.5,0.5);
                
                // Plus Arrow
                arrowIcons[0] = game.add.sprite(startSymbol+100, 215, 'h_arrow');
                arrowIcons[0].scale.setTo(0.3);
                arrowIcons[0].alpha = 0.9;
                arrowIcons[0].anchor.setTo(0.5,0.5);
                // Minus Arrow
                arrowIcons[1] = game.add.sprite(startSymbol, 370, 'h_arrow');
                arrowIcons[1].scale.setTo(0.3);
                arrowIcons[1].alpha = 0.9;
                arrowIcons[1].scale.x *= -1;
                arrowIcons[1].anchor.setTo(0.5,0.5);

            break;

            case "gameCircleOne":

                aux.maxSublevel = 3;
                aux.maxDifficulty = 5;

                // Blue Circle
                geometricFigure[0] = game.add.graphics(startGeometricFigure, 195);
                geometricFigure[0].anchor.setTo(0.5,0.5);
                geometricFigure[0].lineStyle(2, 0x31314e);
                geometricFigure[0].beginFill(0xefeff5);
                geometricFigure[0].drawCircle(0, 0, 60);
                geometricFigure[0].endFill();
                // Red Circle
                geometricFigure[1] = game.add.graphics(startGeometricFigure, 350);
                geometricFigure[1].anchor.setTo(0.5,0.5);
                geometricFigure[1].lineStyle(2, 0xb30000);
                geometricFigure[1].beginFill(0xefeff5);
                geometricFigure[1].drawCircle(0, 0, 60);
                geometricFigure[1].endFill();
                // Both blue and red circles
                geometricFigure[2] = game.add.graphics(startGeometricFigure-30, 500);
                geometricFigure[2].anchor.setTo(0.5,0.5);
                geometricFigure[2].lineStyle(2, 0x31314e);
                geometricFigure[2].beginFill(0xefeff5);
                geometricFigure[2].drawCircle(0, 0, 60);
                geometricFigure[2].endFill();
                geometricFigure[3] = game.add.graphics(startGeometricFigure+40, 500);
                geometricFigure[3].anchor.setTo(0.5,0.5);
                geometricFigure[3].lineStyle(2, 0xb30000);
                geometricFigure[3].beginFill(0xefeff5);
                geometricFigure[3].drawCircle(0, 0, 60);
                geometricFigure[3].endFill();

                // Kid plus
                levelThemeIcons[0] = game.add.sprite(startSymbol, 195, 'kid_walk'); 
                levelThemeIcons[0].scale.setTo(0.6);
                levelThemeIcons[0].alpha = 0.8;
                levelThemeIcons[0].anchor.setTo(0.5,0.5);
                // Kid minus
                levelThemeIcons[1] = game.add.sprite(startSymbol+40, 350, 'kid_walk');
                levelThemeIcons[1].scale.setTo(-0.6, 0.6);
                levelThemeIcons[1].alpha = 0.8;
                levelThemeIcons[1].anchor.setTo(0.5,0.5);

                // Plus arrow
                arrowIcons[0] = game.add.sprite(startSymbol+40, 195, 'h_arrow'); 
                arrowIcons[0].scale.setTo(0.35);
                arrowIcons[0].alpha = 0.8;
                arrowIcons[0].anchor.setTo(0.5,0.5);
                // Minus arrow
                arrowIcons[1] = game.add.sprite(startSymbol, 350, 'h_arrow');
                arrowIcons[1].scale.setTo(-0.35, 0.35);
                arrowIcons[1].alpha = 0.8;
                arrowIcons[1].anchor.setTo(0.5,0.5);
                // Both plus and minus arrows
                arrowIcons[2] = game.add.sprite(startSymbol, 500, 'h_double'); 
                arrowIcons[2].scale.setTo(0.5);
                arrowIcons[2].anchor.setTo(0.5,0.5);
                arrowIcons[2].alpha = 0.8;

            break;

            case "gameSquareTwo":

                aux.maxSublevel = 3;
                aux.maxDifficulty = 5;

                levelThemeIcons[0] = game.add.sprite(startSymbol, 300, 'equal');
                //levelThemeIcons[0].frame = 0;
                levelThemeIcons[0].scale.setTo(0.7);
                levelThemeIcons[0].anchor.setTo(0.5,0.5);

            break;

            default:
                console.log("Error: couldn't finish loading difficulty screen");
        }

        // Pacing difficulty 'stairs'
        for(let sublevel=0; sublevel<aux.maxSublevel; sublevel++){
            for(let difficulty=1; difficulty<=aux.maxDifficulty; difficulty++){
                // Position
                let x1 = startStair+(stairWidth*(difficulty-1));
                let y1 = aux.base_y1[sublevel]+maxHeight-difficulty*stairHeight;
                let x2 = stairWidth;//x1 + 40;
                let y2 = stairHeight*difficulty;//y1 + 24;
                // Graphics
                stairs[difficulty] = game.add.graphics(0, 0);
                stairs[difficulty].lineStyle(1, 0xFFFFFF, 1);
                stairs[difficulty].beginFill(aux.color[sublevel]);
                stairs[difficulty].drawRect(x1, y1, x2, y2);
                stairs[difficulty].endFill();
                // Events
                stairs[difficulty].inputEnabled = true;
                stairs[difficulty].input.useHandCursor = true;
                stairs[difficulty].events.onInputDown.add(this.func_loadMap, {beep: beepSound, difficulty: difficulty, operator: aux.operator[sublevel]});
                stairs[difficulty].events.onInputOver.add(function (item) { item.alpha=0.5; }, this);
                stairs[difficulty].events.onInputOut.add(function (item) { item.alpha=1; }, this);
                // Labels
                let xl = x1+stairWidth/2; //x label
                let yl = y1+(stairHeight*difficulty)/2; //y label
                let label = game.add.text(xl, yl, difficulty, { font: '25px Arial', fill: '#ffffff', align: 'center' });
                    label.anchor.setTo(0.5, 0.4);
            }
        }

    },

    // Calls map state
    func_loadMap: function(){

        if(audioStatus){
            this.beep.play();
        }

        levelPosition = 0; //Map position
        levelMove = true; //Move no next point
        levelDifficulty  = this.difficulty; //Number of difficulty (1 to 5)
        levelOperator = this.operator; //Type of game
        passedLevels = 0; //reset the game progress when entering a new level

        game.state.start('map');

    },
};