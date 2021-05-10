/*
    GAME LEVELS - SQUARE I & II: tractor level
    
    Name of game state : squareOne 
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

const squareOne = {

    preload: function () {

        document.body.style.cursor = "auto";
        game.loop.stop();
        game.event.clear();
        game.animation.clear();

        self = this;

        // NOTHING TO LOAD HERE
        squareOne.create();

    },

    create: function () {

        game.render.clear();

        // CONTROL VARIABLES

        this.checkAnswer = false;   // When true allows game to run 'check answer' code in update
        this.animate = false;       // When true allows game to run 'tractor animation' code in update (turns animation of the moving tractor ON/OFF)
        this.animateEnding = false; // When true allows game to run 'tractor ending animation' code in update (turns 'ending' animation of the moving tractor ON/OFF)
        this.hasClicked = false;    // Checks if player 'clicked' on a block
        this.result = false;        // Checks player 'answer' 
        this.count = 0;             // An 'x' position counter used in the tractor animation        

        this.divisorsList = "";     // Hold the divisors for each fraction on stacked blocks (created for func_postScore)

        this.DIREC_LEVEL = (sublevelType == 'Minus') ? -1 : 1;    // Will be multiplied to values to easily change tractor direction when needed
        this.animationSpeed = 2 * this.DIREC_LEVEL;   // x distance in which the tractor moves in each iteration of the animation

        // GAME VARIABLES

        this.defaultBlockWidth = 80;   // Base block width
        this.defaultBlockHeight = 40;  // Base block height

        this.startX = (sublevelType == 'Minus') ? 730 : 170; // Initial 'x' coordinate for the tractor and stacked blocks



        // BACKGROUND

        // Add background image
        game.add.image(0, 0, 'bgimage');

        // Add clouds
        game.add.image(300, 100, 'cloud');
        game.add.image(660, 80, 'cloud');
        game.add.image(110, 85, 'cloud', 0.8);

        // Add floor of grass
        for (let i = 0; i < 9; i++) { game.add.image(i * 100, 501, 'floor'); }

        // Calls function that loads navigation icons
        navigationIcons.func_addIcons(
            true, true, true,   // left icons
            true, false,        // right icons
            menuScreenCustom, this.func_viewHelp
        );

        // TRACTOR 

        this.tractor = game.add.sprite(this.startX, 445, 'tractor', 0, 0.8);

        if (sublevelType == 'Plus') {
            this.tractor.anchor(1, 0.5);
            this.tractor.animation = ["move", [0, 1, 2, 3, 4], 4];
        } else {
            this.tractor.anchor(0, 0.5);
            this.tractor.animation = ["move", [5, 6, 7, 8, 9], 4];
            this.tractor.curFrame = 5;
        }

        // STACKED BLOCKS variables

        this.stck = {

            blocks: [], // Group of 'stacked' block objects
            labels: [], // Group of fraction labels on the side of 'stacked' blocks

            index: undefined, // (levelType 'B') index of 'stacked' block selected by player

            // control variables for animation
            curIndex: 0, // (needs to be 0)
            curBlockEnd: undefined,

            // Correct values
            correctIndex: undefined, // (levelType 'B') index of the CORRECT 'stacked' block

        };

        // FLOOR BLOCKS variables

        this.floor = {

            blocks: [], // Group of 'floor' block objects

            index: undefined, // (levelType 'A') index of 'floor' block selected by player

            // control variables for animation
            curIndex: -1, // (needs to be -1)

            // Correct values
            correctIndex: undefined, // (levelType 'A') index of the CORRECT 'floor' block

            correctX: undefined,  // 'x' coordinate of CORRECT 'floor' block
            correctXA: undefined, // temporary variable 
            correctXB: undefined, // temporary variable

        };

        // CREATING STACKED BLOCKS

        const restart = this.func_createStckBlocks();

        // CREATING FLOOR BLOCKS

        this.func_createFloorBlocks();


        // SELECTION ARROW

        if (levelType == "A") {
            this.arrow = game.add.image(this.startX + this.defaultBlockWidth * this.DIREC_LEVEL, 480, 'arrow_down');
            this.arrow.anchor(0.5, 0.5);
            this.arrow.alpha = 0.5;
        }

        // help pointer
        this.help = game.add.image(0, 0, 'help_pointer', 0.5);
        this.help.anchor(0.5, 0);
        this.help.alpha = 0;



        if (restart) {
            squareOne.preload();
        } else {
            game.render.all();

            game.timer.start(); // Set a timer for the current level (used in func_postScore)

            game.event.add("click", squareOne.func_onInputDown);
            game.event.add("mousemove", squareOne.func_onInputOver);

            game.loop.start(this);
        }

    },

    update: function () {

        // AFTER PLAYER SELECTION

        // Starts tractor moving animation
        if (self.animate) {

            const stck = self.stck;
            const floor = self.floor;

            // MANAGE HORIZONTAL MOVEMENT

            // Move 'tractor'
            self.tractor.x += self.animationSpeed;

            // Move 'stacked blocks'
            for (let i in stck.blocks) {
                stck.blocks[i].x += self.animationSpeed;
            }


            // MANAGE BLOCKS AND FLOOR GAPS

            // if block is 1/n (not 1/1) there's an extra block space to go through before the start of next block
            const restOfCurBlock = (self.defaultBlockWidth - stck.blocks[stck.curIndex].width) * self.DIREC_LEVEL;

            // check if block falls
            if ((sublevelType == 'Plus' && stck.blocks[0].x >= (stck.curBlockEnd + restOfCurBlock)) ||
                (sublevelType == 'Minus' && stck.blocks[0].x <= (stck.curBlockEnd + restOfCurBlock))) {

                let lowerBlock = true;

                const curEnd = stck.blocks[0].x + stck.blocks[stck.curIndex].width * self.DIREC_LEVEL;

                // if current index is (A) last stacked index (correct index - fixed)
                // if current index is (B) selected stacked index
                if (stck.curIndex == stck.index) {

                    // floor.index : (A) selected floor index
                    // floor.index : (B) last floor index (correct index - fixed)
                    const selectedEnd = floor.blocks[floor.index].x + floor.blocks[0].width * self.DIREC_LEVEL;

                    // (A) last stacked block (fixed) doesnt fit selected gap AKA NOT ENOUGH FLOOR BLOCKS (DOESNT CHECK TOO MANY)
                    // (B) selected stacked index doesnt fit last floor gap (fixed) AKA TOO MANY STACKED BLOCKS (DOESNT CHECK NOT ENOUGH)
                    if ((sublevelType == 'Plus' && curEnd > selectedEnd) || (sublevelType == 'Minus' && curEnd < selectedEnd)) {
                        lowerBlock = false;
                    }

                } else {

                    // update to next block end
                    stck.curBlockEnd += stck.blocks[stck.curIndex + 1].width * self.DIREC_LEVEL;

                }

                // fill floor gap
                if (lowerBlock) {

                    // until (A) selected floor index
                    // until (B) last floor index (correct index - fixed)
                    // updates floor index to be equivalent to stacked index (and change alpha so floor appears to be filled)
                    for (let i = 0; i <= floor.index; i++) {

                        if ((sublevelType == 'Plus' && floor.blocks[i].x < curEnd) || (sublevelType == 'Minus' && floor.blocks[i].x > curEnd)) {
                            floor.blocks[i].alpha = 0.2;
                            floor.curIndex = i;
                        }

                    }

                    // lower
                    stck.blocks[stck.curIndex].alpha = 0;
                    stck.blocks.forEach(cur => { cur.y += self.defaultBlockHeight - 2; }); // Lower stacked blocks

                }

                stck.curIndex++;

            }



            // WHEN REACHED END POSITION

            if (stck.curIndex > stck.index || floor.curIndex == floor.index) {
                self.animate = false;
                self.checkAnswer = true;
            }

        }

        // When animation ends check answer
        if (self.checkAnswer) {

            game.timer.stop();

            game.animation.stop(self.tractor.animation[0]);

            if (levelType == 'A') {
                self.result = self.floor.index == self.floor.correctIndex;
            } else {
                self.result = self.stck.index == self.stck.correctIndex;
            }

            // Give feedback to player and turns on sprite animation
            if (self.result) { // Correct answer

                game.animation.play(self.tractor.animation[0]);

                // Displays feedback image and sound 
                game.add.image(defaultWidth / 2, defaultHeight / 2, 'ok').anchor(0.5, 0.5);
                if (audioStatus) game.audio.okSound.play();

                completedLevels++; // increases number os passed levels
                if (debugMode) console.log("completedLevels = " + completedLevels);

            } else { // Incorrect answer

                // Displays feedback image and sound
                game.add.image(defaultWidth / 2, defaultHeight / 2, 'error').anchor(0.5, 0.5);
                if (audioStatus) game.audio.errorSound.play();

            }

            self.func_postScore();



            // AFTER CHECK ANSWER

            self.checkAnswer = false;
            self.animateEnding = true;

        }

        // Starts 'ending' tractor moving animation
        if (self.animateEnding) {

            // ANIMATE ENDING

            self.count++;

            // If CORRECT ANSWER runs final tractor animation (else tractor desn't move, just wait)
            if (self.result) self.tractor.x += self.animationSpeed;



            // WHEN REACHED END POSITION calls map state

            if (self.count >= 140) {

                // If CORRECT ANSWER, player goes to next level in map
                if (self.result) mapMove = true;
                else mapMove = false;

                mapScreen.preload();
            }

        }

        game.render.all();

    },



    /* EVENT HANDLER */

    func_onInputDown: function (mouseEvent) {

        const x = mouseEvent.offsetX;
        const y = mouseEvent.offsetY;

        if (levelType == 'A') {
            self.floor.blocks.forEach(cur => {

                const valid = y >= cur.yWithAnchor && y <= (cur.yWithAnchor + cur.height * cur.scale) &&
                    (x >= cur.xWithAnchor && x <= (cur.xWithAnchor + cur.width * cur.scale));

                if (valid) self.func_clickSquare(cur);
            });
        } else {
            self.stck.blocks.forEach(cur => {

                const valid = y >= cur.yWithAnchor && y <= (cur.yWithAnchor + cur.height * cur.scale) &&
                    (x >= cur.xWithAnchor && x <= (cur.xWithAnchor + cur.width * cur.scale));

                if (valid) self.func_clickSquare(cur);
            });
        }

        navigationIcons.func_onInputDown(x, y);

        game.render.all();

    },

    func_onInputOver: function (mouseEvent) {

        const x = mouseEvent.offsetX;
        const y = mouseEvent.offsetY;
        let flagA = false;
        let flagB = false;

        if (levelType == 'A') {

            // Make arrow follow mouse
            if (!self.hasClicked && !self.animateEnding) {
                if (game.math.distanceToPointer(self.arrow.x, x, self.arrow.y, y) > 8) {
                    self.arrow.x = (x < 250) ? 250 : x; // Limits the arrow left position to 250
                }
            }

            self.floor.blocks.forEach(cur => {

                const valid = y >= cur.yWithAnchor && y <= (cur.yWithAnchor + cur.height * cur.scale) &&
                    (x >= cur.xWithAnchor && x <= (cur.xWithAnchor + cur.width * cur.scale));

                if (valid) {
                    flagA = true;
                    self.func_overSquare(cur);
                }
            });

            if (!flagA) self.func_outSquare('A');

        }

        if (levelType == 'B') {

            self.stck.blocks.forEach(cur => {

                const valid = y >= cur.yWithAnchor && y <= (cur.yWithAnchor + cur.height * cur.scale) &&
                    (x >= cur.xWithAnchor && x <= (cur.xWithAnchor + cur.width * cur.scale));

                if (valid) {
                    flagB = true;
                    self.func_overSquare(cur);
                }
            });

            if (!flagB) self.func_outSquare('B');

        }



        navigationIcons.func_onInputOver(x, y);

        game.render.all();

    },



    /* CALLED BY EVENT HANDLER */

    func_overSquare: function (cur) {

        if (!self.hasClicked) {

            document.body.style.cursor = "pointer";

            // On leveltype A
            if (levelType == "A") {

                for (let i in self.floor.blocks) {
                    self.floor.blocks[i].alpha = (i <= cur.index) ? 1 : 0.5;
                }

                // Saves the index of the selected 'floor' block
                self.floor.index = cur.index;

                // On leveltype B
            } else {

                for (let i in self.stck.blocks) {
                    self.stck.blocks[i].alpha = (i <= cur.index) ? 0.5 : 0.2;
                }

                // Saves the index of the selected 'stack' block
                self.stck.index = cur.index;

            }

        }

    },

    func_outSquare: function () {

        if (!self.hasClicked) {

            document.body.style.cursor = "auto";

            //on level type A
            if (levelType == "A") {

                for (let i in self.floor.blocks) {
                    self.floor.blocks[i].alpha = 0.5; // back to normal
                }

                self.floor.index = -1;

                //on level type B
            } else {

                for (let i in self.stck.blocks) {
                    self.stck.blocks[i].alpha = 0.5; // back to normal
                }

                self.stck.index = -1;

            }

        }

    },

    func_clickSquare: function () {

        if (!self.hasClicked && !self.animateEnding) {

            document.body.style.cursor = "auto";

            // On leveltype A
            if (levelType == 'A') {

                // Turns selection arrow completely visible
                self.arrow.alpha = 1;

                // Make the unselected blocks invisible (look like there's only the ground)
                for (let i in self.floor.blocks) {
                    // (SELECTION : self.FLOOR.index)
                    if (i > self.floor.index) self.floor.blocks[i].alpha = 0; // Make unselected 'floor' blocks invisible
                }

                // (FIXED : self.STCK.index) save the 'stacked' blocks index
                self.stck.index = self.stck.blocks.length - 1;

                // On leveltype B
            } else {

                for (let i in self.stck.blocks) {
                    // (FIXED : self.STCK.index)
                    if (i > self.stck.index) self.stck.blocks[i].alpha = 0; // Make unselected 'stacked' blocks invisible
                }

                // (SELECTION : self.FLOOR.index) save the 'floor' blocks index to compare to the stacked index in update
                self.floor.index = self.floor.blocks.length - 1;

                // save the updated total stacked blocks to compare in update
                self.stck.blocks.length = self.stck.index + 1;

            }



            // Play beep sound
            if (audioStatus) game.audio.beepSound.play();

            // Hide labels
            if (fractionLabel) {
                self.stck.labels.forEach(cur => {
                    cur.forEach(cur => {
                        cur.alpha = 0;
                    });
                });
            }
            // Hide solution pointer
            if (self.help != undefined) self.help.alpha = 0;

            // Turn tractir animation on
            game.animation.play(self.tractor.animation[0]);

            self.hasClicked = true;
            self.animate = true;

        }

    },



    /* GAME FUNCTIONS */

    func_createStckBlocks: function () {

        let hasBaseDifficulty = false; // will be true after next for loop if level has at least one '1/difficulty' fraction (if false, restart)
        const max = (levelType == 'B') ? 10 : mapPosition + 4; // Maximum number of stacked blocks for the level

        const total = game.math.randomInRange(mapPosition + 2, max); // Current number of stacked blocks for the level

        self.floor.correctXA = self.startX + self.defaultBlockWidth * self.DIREC_LEVEL;

        for (let i = 0; i < total; i++) { // for each stacked block

            let divisor = game.math.randomInRange(1, gameDifficulty); // Set divisor for fraction
            if (divisor == gameDifficulty) hasBaseDifficulty = true;
            if (divisor == 3) divisor = 4; // Make sure valid divisors are 1, 2 and 4 (not 3)
            self.divisorsList += divisor + ","; // List of divisors (for func_postScore())

            const curBlockWidth = self.defaultBlockWidth / divisor; // current width is a fraction of the default

            self.floor.correctXA += curBlockWidth * self.DIREC_LEVEL;

            // Create stacked block (close to tractor)
            const lineColor = (sublevelType == 'Minus') ? colors.red : colors.darkBlue;
            const lineSize = 2;
            const block = game.add.graphic.rect(
                self.startX,
                462 - i * (self.defaultBlockHeight - lineSize),
                curBlockWidth - lineSize,
                self.defaultBlockHeight - lineSize,
                lineColor,
                lineSize,
                colors.white,
                1);
            const anchor = (sublevelType == 'Minus') ? 1 : 0;
            block.anchor(anchor, 0);

            // If game is type B, adding events to stacked blocks
            if (levelType == 'B') {
                block.alpha = 0.5;
                block.index = i;
            }

            self.stck.blocks.push(block);

            // If 'show fractions' is turned on, create labels that display the fractions on the side of each block
            if (fractionLabel) {

                const x = self.startX + (curBlockWidth + 15) * self.DIREC_LEVEL;
                const y = self.defaultBlockHeight - lineSize;

                const label = [];

                if (divisor == 1) {
                    label[0] = game.add.text(x, 488 - i * y, divisor, textStyles.h2_blue);
                } else {
                    label[0] = game.add.text(x, 479 - i * y + 16, divisor, textStyles.p_blue);
                    label[1] = game.add.text(x, 479 - i * y, '1', textStyles.p_blue);
                    label[2] = game.add.text(x, 479 - i * y, '_', textStyles.p_blue);
                }

                // Add current label to group of labels
                self.stck.labels.push(label);
            }

        }



        // will be used as a counter in update, adding in the width of each stacked block to check if the end matches the floor selected position
        self.stck.curBlockEnd = self.startX + self.stck.blocks[0].width * self.DIREC_LEVEL;



        let restart = false;

        // check for errors (level too easy for its difficulty or end position out of bounds)
        if (!hasBaseDifficulty ||
            (sublevelType == 'Plus' && (self.floor.correctXA < (self.startX + self.defaultBlockWidth) ||
                self.floor.correctXA > (self.startX + 8 * self.defaultBlockWidth))) ||
            (sublevelType == 'Minus' && (self.floor.correctXA < (self.startX - (8 * self.defaultBlockWidth)) ||
                self.floor.correctXA > (self.startX - self.defaultBlockWidth)))
        ) {
            restart = true; // If any error is found restart the level
        }

        if (debugMode) console.log("Stacked blocks: " + total + " (min: " + (mapPosition + 2) + ", max: " + max + ")");

        return restart;

    },

    func_createFloorBlocks: function () { // for each floor block

        const divisor = (gameDifficulty == 3) ? 4 : gameDifficulty; // Make sure valid divisors are 1, 2 and 4 (not 3)

        let total = 8 * divisor; // Number of floor blocks

        const blockWidth = self.defaultBlockWidth / divisor; // Width of each floor block

        // If game is type B, selectiong a random floor x position
        if (levelType == 'B') {

            self.stck.correctIndex = game.math.randomInRange(0, (self.stck.blocks.length - 1)); // correct stacked index

            self.floor.correctXB = self.startX + self.defaultBlockWidth * self.DIREC_LEVEL;

            for (let i = 0; i <= self.stck.correctIndex; i++) {
                self.floor.correctXB += self.stck.blocks[i].width * self.DIREC_LEVEL; // equivalent x position on the floor
            }

        }



        let flag = true;

        for (let i = 0; i < total; i++) { // for each floor block

            // 'x' coordinate for floor block
            const x = self.startX + (self.defaultBlockWidth + i * blockWidth) * self.DIREC_LEVEL;

            if (flag && levelType == 'A') {
                if (
                    (sublevelType == 'Plus' && x >= self.floor.correctXA) ||
                    (sublevelType == 'Minus' && x <= self.floor.correctXA)
                ) {
                    self.floor.correctIndex = i - 1; // Set index of correct floor block
                    flag = false;
                }
            }

            if (levelType == 'B') {
                if (
                    (sublevelType == 'Plus' && x >= self.floor.correctXB) ||
                    (sublevelType == 'Minus' && x <= self.floor.correctXB)
                ) {
                    total = i;
                    break;
                }
            }

            // Create floor block
            const lineSize = 0.9;
            const block = game.add.graphic.rect(
                x,
                462 + self.defaultBlockHeight - lineSize,
                blockWidth - lineSize,
                self.defaultBlockHeight - lineSize,
                colors.blueBckg,
                lineSize,
                colors.blueBckgInsideLevel,
                1);
            const anchor = (sublevelType == 'Minus') ? 1 : 0;
            block.anchor(anchor, 0);

            // If game is type A, adding events to floor blocks
            if (levelType == "A") {
                block.alpha = 0.5;
                block.index = i;
            }

            // Add current label to group of labels
            self.floor.blocks.push(block);

        }

        if (levelType == 'A') self.floor.correctX = self.floor.correctXA;
        else if (levelType == 'B') self.floor.correctX = self.floor.correctXB;

        // Creates labels on the floor to display the numbers
        for (let i = 1; i < 10; i++) {

            const x = self.startX + (i * self.defaultBlockWidth * self.DIREC_LEVEL);

            game.add.text(x, 462 + self.defaultBlockHeight + 58, i - 1, textStyles.h2_blue);

        }

    },

    func_viewHelp: function () {

        if (!self.hasClicked) {

            // On levelType A
            if (levelType == 'A') {
                const aux = self.floor.blocks[0];
                self.help.x = self.floor.correctX - aux.width / 2 * self.DIREC_LEVEL;
                self.help.y = 501;
                // On levelType B
            } else {
                const aux = self.stck.blocks[self.stck.correctIndex];
                self.help.x = aux.x + aux.width / 2 * self.DIREC_LEVEL;
                self.help.y = aux.y;
            }

            self.help.alpha = 0.7;

        }

    },



    /* METADATA FOR GAME */

    func_postScore: function () {

        // Create some variables we need to send to our PHP file
        const data = "&s_game=" + gameShape
            + "&s_mode=" + levelType
            + "&s_oper=" + sublevelType
            + "&s_leve=" + gameDifficulty
            + "&s_posi=" + mapPosition
            + "&s_resu=" + self.result
            + "&s_time=" + game.timer.elapsed
            + "&s_deta="
            + "numBlocks:" + self.stck.blocks.length
            + ", valBlocks: " + self.divisorsList // ends in ','
            + " blockIndex: " + self.stck.index
            + ", floorIndex: " + self.floor.index;

        postScore(data);

    },

};