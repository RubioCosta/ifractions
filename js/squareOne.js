/*
    let gameSquareOne = {
        create: function(){},
        update: function(){},
        ---------------------------- end of phaser functions
        func_overSquare: function(){},
        func_outSquare: function(){},
        func_clickSquare: function(){},

            //func_setPlace: function(){},
            //func_checkOverlap: function(){}
            //func_getRndDivisor: function(){}    
        func_viewHelp: function(){},
        
        func_updateCounter: function(){},
        func_postScore: function(){},
    };

    GAME LEVELS - SQUARE I & II: tractor level
    
    Name of game state : 'squareOne' 
    Shape : square
    Character : tractor
    Theme : farm
    Concept : Player associates 'blocks carried by the tractor' and 'floor spaces to be filled by them'
    Represent fractions as : blocks

    # of different difficulties for each level : 3

    Levels can be : 'A' or 'B' (in variable 'levelType')

        A : Player can select # of 'floor blocks' (hole in the ground)
            Selects size of hole to be made in the ground (to fill with the blocks in front of the truck)
        B : Player can select # of 'stacked blocks' (in front of the truck)
            Selects number of blocks in front of the truck (to fill the hole on the ground)
    
    Sublevels can be : 'Plus' or 'Minus' (in variable 'sublevelType')
    
        Plus : addition of fractions
            Represented by : tractor going to the right (floor positions 0..8)
        Minus : subtraction of fractions
            Represented by: tractor going to the left (floor positions 8..0)
*/

let gameSquareOne = {

    create: function () {

        // CONTROL VARIABLES

        self = this;                // saves a reference to gameSquareOne : to be used in functions called by phaser events

        this.checkAnswer = false;   // When true allows game to run 'check answer' code in update
        this.animate = false;       // When true allows game to run 'tractor animation' code in update (turns animation of the moving tractor ON/OFF)
        this.animateEnding = false; // When true allows game to run 'tractor ending animation' code in update (turns 'ending' animation of the moving tractor ON/OFF)
        this.animateCount = 0;      // A 'x' position counter used in the final tractor animation        

        this.hasClicked = false;    // Checks if player 'clicked' on a block
        this.result = false;        // Checks player 'answer' 
        let hasBaseDifficulty = false;  // Checks if level is too easy for its difficulty
        this.divisorsList = "";     // Hold the divisors for each fraction on stacked blocks (created for func_postScore)

        this.DIREC_LEVEL = (sublevelType == 'Minus') ? -1 : 1;    // Will be multiplied to values to easily change tractor direction when needed
        this.animationSṕeed = 2 * this.DIREC_LEVEL;   // Distance in which the tractor moves in each iteration of the animation

        // GAME VARIABLES

        const defaultBlockWidth = 80;   // Base block width
        const defaultBlockHeight = 40;  // Base block height
        const startX = (sublevelType == 'Minus') ? 730 : 170; // Initial 'x' coordinate for the tractor and the blocks




        // BACKGROUND AND TRACTOR

        // Add background image
        game.add.image(0, 0, 'bgimage');
        // Add clouds
        game.add.image(300, 100, 'cloud');
        game.add.image(660, 80, 'cloud');
        game.add.image(110, 85, 'cloud').scale.setTo(0.8);

        // Add floor of grass
        for (let i = 0; i < 9; i++) { game.add.image(i * 100, 501, 'floor'); }

        // Calls function that loads navigation icons
        iconSettings.func_addIcons(true, true,
            true, true, true,
            true, false,
            'difficulty', this.func_viewHelp);

        // Add tractor    

        this.tractor = game.add.sprite(startX, 445, 'tractor');
        this.tractor.scale.setTo(0.8);
        if (sublevelType == 'Plus') {
            this.tractor.anchor.setTo(1, 0.5);
            this.tractor.animations.add('run', [0, 1, 2, 3, 4]);
        } else {
            this.tractor.anchor.setTo(0, 0.5);
            this.tractor.animations.add('run', [5, 6, 7, 8, 9]);
            this.tractor.frame = 5;
        }





        // FLOOR BLOCKS variables

        this.floor_blocks = game.add.group();   // Group of 'floor' blocks
        this.floor_numBlocks;                 // Total of 'floor' blocks of the level
        this.floor_correctIndex;    // In levelType 'A' will save the index of the correct 'floor' block
        this.floor_index = -1;      // In levelType 'A' will save the index of the selected 'floor' block
        this.floor_curIndex = 0;

        this.floor_correctPositionX = startX + defaultBlockWidth * this.DIREC_LEVEL; // x coodinate of correct block (accumulative)

        // STACKED BLOCKS variables

        this.stck_blocks = game.add.group();    // Group of 'stacked' blocks
        this.stck_numBlocks;                  // Total of 'stacked' blocks of the level
        this.stck_correctIndex;     // In levelType 'B' will save the index of the correct 'stacked' block
        this.stck_index = -1;       // In levelType 'B' will save the index of the selected 'stacked' block
        this.stck_curIndex = 0;

        this.stck_fractionLines = game.add.group(); // Group of sprites that serves as line in the middle of a fraction
        this.stck_blockLabels = game.add.group();   // Group of labels that display fraction on side of stacked blocks



        this.nextStartX;




        // CREATING STACKED BLOCKS

        // Maximum number of stacked blocks for the level
        const max = (levelType == 'B') ? 10 : mapPosition + 4;
        // Set total number of stacked blocks for the level
        this.stck_numBlocks = game.rnd.integerInRange(mapPosition + 2, max);
        if (debugMode) console.log("Stacked blocks: " + this.stck_numBlocks + " (min: " + (mapPosition + 2) + ", max: " + max + ")");

        let stck_finalPosition = startX + defaultBlockWidth * this.DIREC_LEVEL;

        for (let i = 0; i < this.stck_numBlocks; i++) {

            // Set divisor of fraction for the current block (depends on difficulty)
            let divisor = game.rnd.integerInRange(1, levelDifficulty);
            // will validate that level isnt too easy (has at least one '1/difficulty' fraction)         
            if (divisor == levelDifficulty) hasBaseDifficulty = true;
            // Make sure valid divisors are 1, 2 and 4 (not 3)
            if (divisor == 3) divisor = 4;
            // Add this divisor to the list of divisors (for func_postScore)
            this.divisorsList += divisor + ",";

            // Set the width of the current block to a fraction of the default size
            const blockWidth = defaultBlockWidth / divisor;
            // Updates width of all stacked blocks lined horizontally
            stck_finalPosition += blockWidth * this.DIREC_LEVEL;

            // Create stacked block (close to tractor)
            const lineSize = 2;
            const lineColor = (sublevelType == 'Minus') ? colors.red : colors.darkBlue;
            const block = game.add.graphics(startX, 462 - i * (defaultBlockHeight - lineSize));
            block.anchor.setTo(0.5, 0.5);
            block.lineStyle(lineSize, lineColor);
            block.beginFill(colors.lightBlue);
            block.drawRect(0, 0, blockWidth - lineSize, defaultBlockHeight - lineSize);
            block.endFill();
            block.scale.x *= this.DIREC_LEVEL; // Important: this will also change the width of the block to a negative value if this.DIREC_LEVEL == -1

            // If game is type B, adding events to stacked blocks
            if (levelType == 'B') {
                block.alpha = 0.5;
                block.inputEnabled = true;
                block.input.useHandCursor = true;
                block.events.onInputDown.add(this.func_clickSquare);
                block.events.onInputOver.add(this.func_overSquare, { index: i });
                block.events.onInputOut.add(this.func_outSquare);
            }

            // Add current block to the group of stacked blocks
            this.stck_blocks.add(block);

            // If 'show labels' is turned on, create labels that display the fractions on the side of each block
            if (levelLabel) {

                const x = startX + (blockWidth + 15) * this.DIREC_LEVEL;
                let label;

                if (divisor == 1) {
                    label = game.add.text(x, 483 - i * (defaultBlockHeight - lineSize), divisor, textStyles.valueLabelBlue1);
                } else {
                    label = game.add.text(x, 484 - i * (defaultBlockHeight - lineSize), '1\n' + divisor, textStyles.valueLabelBlue3);
                    // Sprite that serves as line in the middle of a fraction
                    const fractionLine = game.add.sprite(x, 481 - i * (defaultBlockHeight - lineSize), 'fractionLine');
                    fractionLine.scale.setTo(0.6);
                    fractionLine.anchor.setTo(0.5, 0.5);
                    this.stck_fractionLines.add(fractionLine);
                }

                label.anchor.setTo(0.5, 0.5);

                // Add current label to group of labels
                this.stck_blockLabels.add(label);
            }

        }

        // check for errors (level too easy for its difficulty or end position out of bounds)
        if ((!hasBaseDifficulty) ||
            (sublevelType == 'Plus' && (stck_finalPosition < (startX + defaultBlockWidth) || stck_finalPosition > (startX + 8 * defaultBlockWidth))) ||
            (sublevelType == 'Minus' && (stck_finalPosition < (startX - (8 * defaultBlockWidth)) || stck_finalPosition > (startX - defaultBlockWidth)))
        ) {
            // If any error is found restart the level
            game.state.start('gameSquareOne');
        }

        // will be used as a counter in update, adding in the width of each stacked block to check if the end matches the floor selected position
        this.nextStartX = startX + this.stck_blocks.children[0].width;




        // CREATING FLOOR BLOCKS

        // Make sure valid divisors are 1, 2 and 4 (not 3)
        const divisor = (levelDifficulty == 3) ? 4 : levelDifficulty;
        // Define the total number of floor blocks
        this.floor_numBlocks = 8 * divisor;
        // Define the with of each floor block
        const floor_blockWidth = defaultBlockWidth / divisor;


        // If game is type B, selectiong a random 'x' coordinate for the floor
        if (levelType == 'B') {

            this.stck_correctIndex = game.rnd.integerInRange(0, (this.stck_numBlocks - 1));

            for (let i = 0; i <= this.stck_correctIndex; i++) {
                this.floor_correctPositionX += this.stck_blocks.children[i].width;
            }

        }

        let flag = true;

        for (let i = 0; i < this.floor_numBlocks; i++) {

            // 'x' coordinate for floor block
            const x = startX + (defaultBlockWidth + i * floor_blockWidth) * this.DIREC_LEVEL;

            if ((flag) &&
                (levelType == 'A') &&
                ((sublevelType == 'Plus' && x >= stck_finalPosition) || (sublevelType == 'Minus' && x <= stck_finalPosition))
            ) {
                this.floor_correctIndex = i - 1; // Set index of correct floor block
                flag = false;
            }

            if ((levelType == 'B') &&
                ((sublevelType == 'Plus' && x >= this.floor_correctPositionX) || (sublevelType == 'Minus' && x <= this.floor_correctPositionX))
            ) {
                this.floor_numBlocks = i;
                break; // Leaves for loop    
            }

            // Create floor block
            const lineSize = 0.9;
            const block = game.add.graphics(x, 462 + defaultBlockHeight - lineSize);
            block.anchor.setTo(0.5, 0);
            block.lineStyle(lineSize, colors.blueBckg);
            block.beginFill(colors.blueBckgLevel);
            block.drawRect(0, 0, floor_blockWidth - lineSize, defaultBlockHeight - lineSize);
            block.endFill();
            block.scale.x *= this.DIREC_LEVEL; // Important: this will also change the width of the block to a negative value if this.DIREC_LEVEL == -1

            // If game is type A, adding events to floor blocks
            if (levelType == "A") {
                block.alpha = 0.5;
                block.inputEnabled = true;
                block.input.useHandCursor = true;
                block.events.onInputDown.add(this.func_clickSquare);
                block.events.onInputOver.add(this.func_overSquare, { index: i });
                block.events.onInputOut.add(this.func_outSquare);
            }

            // Add current label to group of labels
            this.floor_blocks.add(block);

        }

        if (levelType == "A") this.floor_correctPositionX = stck_finalPosition;

        // Creates labels on the floor to display the numbers
        for (let i = 0; i <= 8; i++) {
            const x = (sublevelType == 'Minus') ? startX - ((9 - i) * defaultBlockWidth) : startX + ((1 + i) * defaultBlockWidth);
            game.add.text(x, 462 + defaultBlockHeight + 58, i, textStyles.valueLabelBlue1).anchor.setTo(0.5, 0.5);
        }

        /*
        // temporarily used for debug
        if (debugMode){  
            if (levelType == 'A') {
                console.log("Type A",  
                    "\nStacked index:", // todos
                    this.stck_numBlocks - 1, "[fixo]", 
                    "\nFloor index:", // correto / todos
                    this.floor_correctIndex, "[CORRETO]", "/", this.floor_numBlocks - 1,
                    "\nFloor 'x' position:", this.floor_correctPositionX,
                );
            } else {
                console.log("Type B",
                    "\nStacked index:", // corretor / todos
                    this.stck_correctIndex, "[CORRETO]", "/", this.stck_numBlocks - 1,
                    "\nFloor index:", // todos
                    this.floor_numBlocks - 1, "[fixo]",
                    "\nFloor 'x' position:", this.floor_correctPositionX,
                );
            }
        }
        */




        // SELECTION ARROW

        this.arrow = game.add.sprite(startX + defaultBlockWidth * this.DIREC_LEVEL, 480, 'down');
        this.arrow.anchor.setTo(0.5, 0.5);
        this.arrow.alpha = 0.5;
        if (levelType == "B") this.arrow.visible = false;




        // OUTPUT ICONS

        // Ok image
        this.okImg = game.add.image(game.world.centerX, game.world.centerY, 'h_ok');
        this.okImg.anchor.setTo(0.5);
        this.okImg.visible = false;

        // Error image
        this.errorImg = game.add.image(game.world.centerX, game.world.centerY, 'h_error');
        this.errorImg.anchor.setTo(0.5);
        this.errorImg.visible = false;




        // TIMER

        // Set a timer for the current level (used in func_postScore)
        this.totalTime = 0;
        this.timer = game.time.create(false);
        this.timer.loop(1000, this.func_updateCounter, this);
        this.timer.start();

    },

    update: function () {

        // WAITING PLAYER SELECTION

        // Make the arrow on the floor follow the cursor 'x' position
        if (!this.hasClicked && !this.animateEnding && levelType == 'A') {
            // Checks distance between the cursor and the arrow
            if (game.physics.arcade.distanceToPointer(this.arrow, game.input.activePointer) > 8) {
                const x = game.input.mousePointer.x;
                this.arrow.x = (x < 250) ? 250 : x; // Limits the arrow left position to 250
            }
        }




        // AFTER PLAYER SELECTION

        // Starts tractor moving animation
        if (this.animate) {

            // Move 'tractor' to the side
            this.tractor.x += this.animationSṕeed;

            // Move 'stacked blocks' to the side
            for (let i = 0; i < this.stck_numBlocks; i++) { this.stck_blocks.children[i].x += this.animationSṕeed; }

            // extra distance (if needed) before getting to next floor block
            const extra = (80 - this.stck_blocks.children[this.stck_curIndex].width * this.DIREC_LEVEL) * this.DIREC_LEVEL;
            let updateBlocks = true;

            // Make current block fall to the ground if it fits

            if (sublevelType == 'Plus') {
                if (this.stck_blocks.children[0].x >= (this.nextStartX + extra)) {

                    let stck_curEnd = this.stck_blocks.children[0].x + this.stck_blocks.children[this.stck_curIndex].width;

                    if (this.stck_curIndex == this.stck_index) {
                        const floor_curEnd = this.floor_blocks.children[this.floor_index].x + this.floor_blocks.children[this.floor_index].width;
                        if (stck_curEnd > floor_curEnd) updateBlocks = false;
                    }

                    if (updateBlocks) {
                        // Blocks on the floor
                        for (let i = 0; i <= this.floor_index; i++) {
                            if (this.floor_blocks.children[i].x < stck_curEnd) {
                                this.floor_blocks.children[i].alpha = 0.2; // Make the floor look like it's filled
                                this.floor_curIndex = i;
                            }
                        }
                        // Blocks on the stack
                        this.stck_blocks.children[this.stck_curIndex].alpha = 0; // Make block invisible
                        this.stck_blocks.y += this.stck_blocks.children[this.stck_curIndex].height - 2; // Lower stacked blocks
                    }

                    if (this.stck_curIndex != this.stck_index) {
                        this.nextStartX += this.stck_blocks.children[this.stck_curIndex + 1].width;
                    }
                    this.stck_curIndex++;

                }
            }

            if (sublevelType == 'Minus') {
                if (this.stck_blocks.children[0].x <= (this.nextStartX + extra)) {

                    let stck_curEnd = this.stck_blocks.children[0].x + this.stck_blocks.children[this.stck_curIndex].width;

                    if (this.stck_curIndex == this.stck_index) {
                        const floor_curEnd = this.floor_blocks.children[this.floor_index].x + this.floor_blocks.children[this.floor_index].width;
                        if (stck_curEnd < floor_curEnd) updateBlocks = false;
                    }

                    if (updateBlocks) {
                        // Blocks on the floor
                        for (let i = 0; i <= this.floor_index; i++) {
                            if (this.floor_blocks.children[i].x > stck_curEnd) {
                                this.floor_curIndex = i;
                                this.floor_blocks.children[i].alpha = 0.2; // Make the floor look like it's filled
                            }
                        }
                        // Blocks on the stack
                        this.stck_blocks.children[this.stck_curIndex].alpha = 0; // Make block invisible
                        this.stck_blocks.y += this.stck_blocks.children[this.stck_curIndex].height - 2; // Lower stacked blocks
                    }

                    if (this.stck_curIndex != this.stck_index) {
                        this.nextStartX += this.stck_blocks.children[this.stck_curIndex + 1].width;
                    }
                    this.stck_curIndex++;

                }
            }

            // Checks if it reached the clicked position 
            if (this.stck_curIndex > this.stck_index || this.floor_curIndex >= this.floor_index) {
                this.animate = false;
                this.checkAnswer = true;
            }

        }

        // When animation ends check if there are any blocks left
        if (this.checkAnswer) {

            this.timer.stop();

            this.tractor.animations.stop();

            if (levelType == 'A') {
                this.result = (this.floor_index == this.floor_correctIndex);
            } else {
                this.result = (this.stck_index == this.stck_correctIndex);
            }

            // Give feedback to player and turns on sprite animation
            if (this.result) { // Correct answer

                this.tractor.animations.play('run', 6, true);

                // Displays feedback image and sound 
                this.okImg.visible = true;

                if (audioStatus) sound.okSound.play();

                completedLevels++; // increases number os passed levels
                if (debugMode) console.log("completedLevels = " + completedLevels);

            } else { // Incorrect answer

                // Displays feedback image and sound
                this.errorImg.visible = true;

                if (audioStatus) sound.errorSound.play();

            }

            this.func_postScore();

            this.animateCount = 0;

            this.checkAnswer = false;
            this.animateEnding = true;

        }

        // Starts 'ending' tractor moving animation
        if (this.animateEnding) {

            this.animateCount++;

            // If correct answer executes final tractor animation (else tractor desn't move)
            if (this.result) this.tractor.x += this.animationSṕeed;

            // If tractor animation reaches final point calls map state
            if (this.animateCount >= 140) {
                // If correct, let player go to next level in map
                if (this.result) mapCanMove = true;
                else mapCanMove = false;

                game.state.start('map');
            }

        }

    },

    func_overSquare: function () {

        if (!self.hasClicked) {

            // On leveltype A
            if (levelType == "A") {

                for (let i = 0; i < self.floor_numBlocks; i++) {
                    self.floor_blocks.children[i].alpha = (i <= this.index) ? 1 : 0.5;
                }

                // Saves the index of the selected 'floor' block
                self.floor_index = this.index;

                // On leveltype B
            } else {

                for (let i = 0; i < self.stck_numBlocks; i++) {
                    self.stck_blocks.children[i].alpha = (i <= this.index) ? 0.5 : 0.2;
                }

                // Saves the index of the selected 'stack' block
                self.stck_index = this.index;

            }

        }

    },

    func_outSquare: function () {

        if (!self.hasClicked) {

            //on level type A
            if (levelType == "A") {

                for (let i = 0; i < self.floor_numBlocks; i++) {
                    self.floor_blocks.children[i].alpha = 0.5; // back to normal
                }

                self.floor_index = -1;

                //on level type B
            } else {

                for (let i = 0; i < self.stck_numBlocks; i++) {
                    self.stck_blocks.children[i].alpha = 0.5; // back to normal
                }

                self.stck_index = -1;

            }

        }

    },

    func_clickSquare: function () {

        if (!self.hasClicked && !self.animateEnding) {

            // On leveltype A
            if (levelType == 'A') {

                // Turns selection arrow completely visible
                self.arrow.alpha = 1;

                // Make the unselected blocks invisible (look like there's only the ground)
                for (let i = 0; i < self.floor_numBlocks; i++) {
                    if (i > self.floor_index) {
                        self.floor_blocks.children[i].visible = false; // Make unselected 'floor' blocks invisible
                    }
                }

                // save the 'stacked' blocks index to compare to the floor index in update
                self.stck_index = self.stck_numBlocks - 1;

                // On leveltype B
            } else {

                for (let i = 0; i < self.stck_numBlocks; i++) {
                    if (i > self.stck_index) {
                        self.stck_blocks.children[i].visible = false; // Make unselected 'stacked' blocks invisible
                    }
                }

                // save the updated total stacked blocks to compare in update
                self.stck_numBlocks = self.stck_index + 1;
                // save the 'floor' blocks index to compare to the stacked index in update
                self.floor_index = self.floor_numBlocks - 1;

            }

            // Play beep sound
            if (audioStatus) sound.beepSound.play();

            // Hide labels
            if (levelLabel) {
                self.stck_blockLabels.visible = false;
                self.stck_fractionLines.visible = false;
            }
            // Hide solution pointer
            if (self.pointer != undefined) self.pointer.visible = false;

            // Turn tractir animation on
            self.tractor.animations.play('run', 5, true);

            self.hasClicked = true;
            self.animate = true;

        }

    },

    func_viewHelp: function () {

        if (!self.hasClicked) {

            let aux;

            // On leveltype A
            if (levelType == 'A') {
                aux = self.floor_blocks.children[0];
                self.pointer = game.add.image(self.floor_correctPositionX - aux.width / 2, 501, 'pointer');
                // On leveltype B
            } else {
                aux = self.stck_blocks.children[self.stck_correctIndex];
                self.pointer = game.add.image(aux.x + aux.width / 2, aux.y, 'pointer');
            }

            self.pointer.scale.setTo(0.5);
            self.pointer.anchor.setTo(0.5, 0);
            self.pointer.alpha = 0.7;

        }

    },

    // Game information

    func_updateCounter: function () {
        this.totalTime++;
    },

    func_postScore: function () {

        // Get correct information about player name and default language
        // Variables 'playerName' and 'lang' are defined on: js/preMenu.js
        // Variable 'lang' has all the JSON content of 'assets/lang/pt_BR.json', 'lang.lang' defined in 'js/preMenu.js' (func_setLang())

        const abst = "numBlocks:" + this.stck_numBlocks
            + ", valBlocks: " + this.divisorsList
            + " blockIndex: " + this.stck_index
            + ", floorIndex: " + this.floor_index;

        let hr = new XMLHttpRequest();

        // Create some variables we need to send to our PHP file
        const url = "php/save.php";
        let vars = "s_ip=" + hip
            + "&s_name=" + playerName
            + "&s_lang=" + langString
            + "&s_game=" + levelShape
            + "&s_mode=" + levelType;
        vars += "&s_oper=" + sublevelType
            + "&s_leve=" + levelDifficulty
            + "&s_posi=" + mapPosition
            + "&s_resu=" + this.result
            + "&s_time=" + this.totalTime
            + "&s_deta=" + abst;

        // Sobre nome do usuario:
        // * js/squareOne.js: name
        // * js/pt_BR.json:   welcome="Ola'", insert_name="DIGITE SEU NOME"
        // * php/save.php : $play = $_REQUEST["stacked.stck_name"];
        // * js/preMenu.js : insert_name, game.add.text(...), playerName = document.getElementById("name_id").value;

        // Pegar valor de PHP para JS: echo("<script language='javascript'>location.href='download.php?arquivo=$nome_arquivo&dir=$dir&id_exer=$id_exer'</script>");

        hr.open("POST", url, true);
        hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        hr.onreadystatechange = function () {
            if (debugMode) console.log(hr);

            if (hr.readyState == 4 && hr.status == 200) {
                let return_data = hr.responseText;
                if (debugMode) console.log(return_data);
            }
        }
        // Send the data to PHP now... and wait for response to update the status div
        hr.send(vars); // Actually execute the request
        if (debugMode) console.log("processing...");
        if (debugMode) console.log(vars);

    }

};