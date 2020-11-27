/*
    let difficultyState = {
        preload: function(){},
		create: function(){},
        ---------------------------- end of phaser functions
        func_loadMap: function()
        func_setLabel: function()
	};
*/

// DIFFICULTY SCREEN: player can select (I) sublevel type, (II) game difficulty and (III) turn on/off fractions labels
let difficultyState = {

    preload: function() {
        
        let curMedia;

        switch(currentGameState){
            case 'gameSquareOne': curMedia = media.gameSquareOne; break;
            case 'gameSquareTwo': curMedia = media.gameSquareTwo; break;
            case 'gameCircleOne': curMedia = media.gameCircleOne; break;
        }

        for (let i = 0, image = curMedia('image'); i < image.length; i++){
            game.load.image(image[i][0], image[i][1]);
		}
		for (let i = 0, sprite = curMedia('spritesheet'); i < sprite.length; i++){
            game.load.spritesheet(sprite[i][0], sprite[i][1], sprite[i][2], sprite[i][3], sprite[i][4]);
		}	
		for (let i = 0, audio = curMedia('audio'); i < audio.length; i++){
            game.load.audio(audio[i][0], audio[i][1][0], audio[i][1][1]);
        }
        
    },

    create: function () {

        // Calls function that loads navigation icons
        iconSettings.func_addIcons(true, true,
            false, true, false,
            true, false,
            false, false);

        // TITLE

        const title = game.add.text(game.world.centerX, 40, lang.game_menu_title, textStyles.title2);
        title.anchor.setTo(0.5, 0.5);

        // TURN LABEL ON/OFF ICON

        if ( currentGameState != 'gameSquareTwo') {
            // Text : 'with/without' labeling the fractions
            let labelText = game.add.text(game.world.centerX - 110, 80, "", textStyles.subtitle2);
            labelText.text = levelLabel ? lang.with_name + " " + lang.label_name : lang.without_name + " " + lang.label_name;
            labelText.anchor.setTo(0, 0.5);
            // Selection box
            let selectionBox = game.add.sprite(game.world.centerX - 110 - 30, 75, 'select');
            selectionBox.frame = levelLabel ? 1 : 0;
            selectionBox.anchor.setTo(0.5, 0.5);
            selectionBox.scale.setTo(0.12);
            selectionBox.inputEnabled = true;
            selectionBox.input.useHandCursor = true;
            selectionBox.events.onInputDown.add(this.func_setLabel, { selectionBox: selectionBox, labelText: labelText });
        }

        // SETTING DIFFICULTY LEVELS (STAIR)

        const maxStairHeight = 120;  // Maximum height of the stairs        
        let stairHeight;    // Height growth of a stair
        let stairWidth;     // Width of the stairs
        let startStair;     // Start 'x' position of the stairs
        let startTheme;     // Start 'x' position of the illustrations on the left (character/arrow/equal sign)
        let startShape;     // STart 'x' position of the illustrations on the right (shapes)
        let maxSublevel;
        let maxDifficulty;

        switch(currentGameState) {
            case "gameSquareOne":
                stairHeight = 40;
                stairWidth = 100;
                startStair = 320;
                startTheme = 180;
                startShape = (startTheme / 2) + startStair + stairWidth * 3;
                maxSublevel = 2;
                maxDifficulty = 3;
            break;
            case "gameSquareTwo":
            case "gameCircleOne":
                stairHeight = 29;
                stairWidth = 85;
                startStair = 240;
                startTheme = 150;
                startShape = (startTheme / 2) + startStair + stairWidth * 5;
                maxSublevel = 3;
                maxDifficulty = 5;
            break;
            default: if (debugMode) console.log("Error! Name of the game state is not valid!");
        }

        let themeIcons = [];
        let arrowIcons = [];
        let shapeIcons = [];

        let stairs = [];

        const aux = {
            maxSublevel:    null,
            maxDifficulty:  null,
            color:      [colors.diffBlue, colors.diffRed, colors.diffPurple],
            base_y1:    [135, 285, 435],
            sublevel_1: ['Plus', 'Minus', 'Mixed'],
            sublevel_2: ['A', 'B', 'C'],
            get sublevel() {
                return (currentGameState == 'gameSquareTwo') ? this.sublevel_2 : this.sublevel_1;
            },
        }

        // Placing icons
        switch (currentGameState) {

            case "gameSquareOne":

                // Blue square
                shapeIcons[0] = game.add.graphics(startShape, 175);
                shapeIcons[0].anchor.setTo(0.5, 0.5);
                shapeIcons[0].lineStyle(2, colors.darkBlue);
                shapeIcons[0].beginFill(colors.lightBlue);
                shapeIcons[0].drawRect(0, 0, 80, 40);
                shapeIcons[0].endFill();
                // Red square
                shapeIcons[1] = game.add.graphics(startShape, 330);
                shapeIcons[1].anchor.setTo(0.5, 0.5);
                shapeIcons[1].lineStyle(2, colors.red);
                shapeIcons[1].beginFill(colors.lightBlue);
                shapeIcons[1].drawRect(0, 0, 80, 40);
                shapeIcons[1].endFill();

                // Green tractor
                themeIcons[0] = game.add.sprite(startTheme + 30, 215, 'tractor');
                themeIcons[0].frame = 1;
                themeIcons[0].scale.setTo(0.5);
                themeIcons[0].alpha = 0.9;
                themeIcons[0].anchor.setTo(0.5, 0.5);
                // Red tractor
                themeIcons[1] = game.add.sprite(startTheme + 70, 370, 'tractor');
                themeIcons[1].frame = 5;
                themeIcons[1].scale.setTo(0.5);
                themeIcons[1].alpha = 0.9;
                themeIcons[1].anchor.setTo(0.5, 0.5);

                // Plus Arrow
                arrowIcons[0] = game.add.sprite(startTheme + 100, 215, 'h_arrow');
                arrowIcons[0].scale.setTo(0.3);
                arrowIcons[0].alpha = 0.9;
                arrowIcons[0].anchor.setTo(0.5, 0.5);
                // Minus Arrow
                arrowIcons[1] = game.add.sprite(startTheme, 370, 'h_arrow');
                arrowIcons[1].scale.setTo(0.3);
                arrowIcons[1].alpha = 0.9;
                arrowIcons[1].anchor.setTo(0.5, 0.5);
                arrowIcons[1].scale.x *= -1;

            break;
            case "gameCircleOne":

                // Blue Circle
                shapeIcons[0] = game.add.graphics(startShape, 175);
                shapeIcons[0].anchor.setTo(0.5, 0.5);
                shapeIcons[0].lineStyle(2, colors.darkBlue);
                shapeIcons[0].beginFill(colors.lightBlue);
                shapeIcons[0].drawCircle(0, 0, 60);
                shapeIcons[0].endFill();
                // Red Circle
                shapeIcons[1] = game.add.graphics(startShape, 330);
                shapeIcons[1].anchor.setTo(0.5, 0.5);
                shapeIcons[1].lineStyle(2, colors.red);
                shapeIcons[1].beginFill(colors.lightBlue);
                shapeIcons[1].drawCircle(0, 0, 60);
                shapeIcons[1].endFill();
                // Both blue and red circles
                shapeIcons[2] = game.add.graphics(startShape - 30, 485);
                shapeIcons[2].anchor.setTo(0.5, 0.5);
                shapeIcons[2].lineStyle(2, colors.darkBlue);
                shapeIcons[2].beginFill(colors.lightBlue);
                shapeIcons[2].drawCircle(0, 0, 60);
                shapeIcons[2].endFill();
                shapeIcons[3] = game.add.graphics(startShape + 40, 485);
                shapeIcons[3].anchor.setTo(0.5, 0.5);
                shapeIcons[3].lineStyle(2, colors.red);
                shapeIcons[3].beginFill(colors.lightBlue);
                shapeIcons[3].drawCircle(0, 0, 60);
                shapeIcons[3].endFill();

                // Kid plus
                themeIcons[0] = game.add.sprite(startTheme, 195, 'kid_walk');
                themeIcons[0].scale.setTo(0.6);
                themeIcons[0].alpha = 0.8;
                themeIcons[0].anchor.setTo(0.5, 0.5);
                // Kid minus
                themeIcons[1] = game.add.sprite(startTheme + 40, 350, 'kid_walk');
                themeIcons[1].scale.setTo(-0.6, 0.6);
                themeIcons[1].alpha = 0.8;
                themeIcons[1].anchor.setTo(0.5, 0.5);

                // Plus arrow
                arrowIcons[0] = game.add.sprite(startTheme + 40, 195, 'h_arrow');
                arrowIcons[0].scale.setTo(0.35);
                arrowIcons[0].alpha = 0.8;
                arrowIcons[0].anchor.setTo(0.5, 0.5);
                // Minus arrow
                arrowIcons[1] = game.add.sprite(startTheme, 350, 'h_arrow');
                arrowIcons[1].scale.setTo(-0.35, 0.35);
                arrowIcons[1].alpha = 0.8;
                arrowIcons[1].anchor.setTo(0.5, 0.5);
                // Both plus and minus arrows
                arrowIcons[2] = game.add.sprite(startTheme + 20, 500, 'h_double');
                arrowIcons[2].scale.setTo(0.5);
                arrowIcons[2].alpha = 0.8;
                arrowIcons[2].anchor.setTo(0.5, 0.5);

            break;
            case "gameSquareTwo":

                themeIcons[0] = game.add.sprite(startTheme, 370, 'equal');
                themeIcons[0].scale.setTo(0.7);
                themeIcons[0].anchor.setTo(0.5, 0.5);

            break;
            default: if (debugMode) console.log("Error: couldn't finish loading difficulty screen assets");

        }

        // Placing difficulty 'stairs'
        for (let sublevel = 0; sublevel < maxSublevel; sublevel++) {
            for (let difficulty = 1; difficulty <= maxDifficulty; difficulty++) {
                // Position
                const x1 = startStair + (stairWidth * (difficulty - 1));
                const y1 = aux.base_y1[sublevel] + maxStairHeight - difficulty * stairHeight;
                const x2 = stairWidth;//x1 + 40;
                const y2 = stairHeight * difficulty;//y1 + 24;
                // Graphics
                stairs[difficulty] = game.add.graphics(0, 0);
                stairs[difficulty].lineStyle(1, colors.blueBckg);
                stairs[difficulty].beginFill(aux.color[sublevel]);
                stairs[difficulty].drawRect(x1, y1, x2, y2);
                stairs[difficulty].endFill();

                stairs[difficulty].inputEnabled = true;
                stairs[difficulty].input.useHandCursor = true;
                stairs[difficulty].events.onInputDown.add(this.func_loadMap, { difficulty: difficulty, sublevelType: aux.sublevel[sublevel] });
                stairs[difficulty].events.onInputOver.add(function (item) { item.alpha = 0.5; }, this);
                stairs[difficulty].events.onInputOut.add(function (item) { item.alpha = 1; }, this);
                // Labels
                const xl = x1 + stairWidth / 2; //x label
                const yl = y1 + (stairHeight * difficulty) / 2; //y label
                const label = game.add.text(xl, yl, difficulty, textStyles.difficultyLabel);
                label.anchor.setTo(0.5, 0.4);
            }
        }

    },

    // Calls map state
    func_loadMap: function () {

        if (audioStatus) beepSound.play();

        mapPosition = 0;   //Map position
        mapCanMove = true;       //Move no next point
        levelDifficulty = this.difficulty;  // difficulty for selected level (1..3 or 1..5)
        sublevelType = this.sublevelType;   //Type of game
        completedLevels = 0;       //reset the game progress when entering a new level

        game.state.start('map');

    },

    func_setLabel: function () {

        if (levelLabel) {
        
            levelLabel = false;
            this.selectionBox.frame = 0;
            this.labelText.text = lang.without_name + " " + lang.label_name;
        
        } else {
        
            levelLabel = true;
            this.selectionBox.frame = 1;
            this.labelText.text = lang.with_name + " " + lang.label_name;
        
        }
        
        if (audioStatus) beepSound.play();
    
    }
};