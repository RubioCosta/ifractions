/*
    GAME LEVELS - SQUARE III: fraction comparisson level
    
    Name of game state : 'SquareTwo' 
    Shape : square
    Character : kid
    Theme : (not themed)
    Concept : player select equivalent dividends for fractions with different divisors
    Represent fractions as : subdivided blocks

    # of different difficulties for each level : 5

    Level : 'C' (in variable 'levelType')

        C : Player selects equivalent fractions of both blocks 
    
    Sublevels can be : 'A', 'B' or 'C' (in variable 'sublevelType')
    
        A : equivalence of fractions (with low opacity blocks under the selectable blocks)
            top has more subdivisions
        B : equivalence of fractions 
            top has more subdivisions
        C : equivalence of fractions
            bottom has more subdivisions
*/

const squareTwo = {

    preload: function () {

        document.body.style.cursor = "auto";
        game.loop.stop();
        game.event.clear();
        game.animation.clear();

        self = this;

        // NOTHING TO LOAD HERE
        squareTwo.create();

    },

    create: function () {

        game.render.clear();

        // CONTROL VARIABLES

        this.result = false;    // Check if selected blocks are correct
        this.delay = 0;         // Counter for game dalays
        this.endLevel = false;

        self.A = {
            blocks: [],     // List of selection blocks
            auxBlocks: [],  // List of shadow under selection blocks
            fractions: [],  // fraction numbers

            selected: 0,    // Number of selected blocks for A
            hasClicked: false,  // Check if player clicked blocks from A
            animate: false,     // Animate blocks from A
            warningText: undefined,
            label: undefined,
        };

        self.B = {
            blocks: [],
            auxBlocks: [],
            fractions: [],

            selected: 0,
            hasClicked: false,
            animate: false,
            warningText: undefined,
            label: undefined,
        };



        // BACKGROUND AND KID

        // Add background image
        game.add.image(0, 0, 'bgimage');
        // Add clouds
        game.add.image(300, 100, 'cloud');
        game.add.image(660, 80, 'cloud');
        game.add.image(110, 85, 'cloud', 0.8);

        // Add floor of grass
        for (let i = 0; i < 9; i++) { game.add.image(i * 100, 501, 'floor'); }

        // Calls function that loads navigation icons
        navigationIcons.func_addIcons(true, true, false,
            true, false,
            difficultyScreen, false);

        //Add kid
        this.kidAnimation = game.add.sprite(100, 470, 'kid_standing', 5, 0.8);
        this.kidAnimation.anchor(0.5, 0.7);

        // Width and Height of A and B
        this.figureWidth = 400;
        const figureHeight = 50;

        // Coordinates for A and B
        let xA, xB, yA, yB;
        if (sublevelType != 'C') {  // More subdivisions on B
            xA = 230;
            yA = 90;
            xB = xA;
            yB = yA + 3 * figureHeight + 30;
        } else {                    // More subdivisions on A
            xB = 230;
            yB = 90;
            xA = xB;
            yA = yB + 3 * figureHeight + 30;
        }

        // Possible points for A
        const points = [2, 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20];

        // Random index for 'points'
        const randomIndex = game.math.randomInRange((gameDifficulty - 1) * 2 + 1, (gameDifficulty - 1) * 2 + 3);



        // number of subdivisions of A and B (blocks)
        const totalBlocksA = points[randomIndex];
        const totalBlocksB = game.math.randomDivisor(totalBlocksA);

        if (debugMode) {
            console.log("----------");
            console.log("Difficulty " + gameDifficulty + ", ini " + ((gameDifficulty - 1) * 2 + 1) + ", end " + ((gameDifficulty - 1) * 2 + 3));
            console.log("Rpoint " + randomIndex + ", val " + totalBlocksA);
            console.log("total blocks A " + totalBlocksA + ", total blocks B ");
        }



        // CREATING TOP FIGURE (A)

        let blockWidth = this.figureWidth / totalBlocksA; // width of each block in A
        let lineColor = colors.darkGreen;
        let fillColor = colors.lightGreen;
        let fillColorAux = colors.lighterGreen;

        // Create blocks
        for (let i = 0; i < totalBlocksA; i++) {

            const x = xA + i * blockWidth;

            // Blocks
            const block = game.add.graphic.rect(x, yA, blockWidth, figureHeight, lineColor, 2, fillColor, 0.5);
            block.figure = 'A';
            block.index = i;
            block.finalX = xA;
            self.A.blocks.push(block);

            // Auxiliar blocks
            const alpha = (sublevelType == 'A') ? 0.2 : 0;
            const yAux = yA + figureHeight + 10; // on the bottom of A
            const auxBlock = game.add.graphic.rect(x, yAux, blockWidth, figureHeight, lineColor, 1, fillColorAux, alpha);
            self.A.auxBlocks.push(auxBlock);

        }

        // 'total blocks' label for A : on the side of A
        let xLabel = xA + this.figureWidth + 30;
        let yLabel = yA + figureHeight / 2;

        this.A.label = game.add.text(xLabel, yLabel, this.A.blocks.length, textStyles.valueLabelBlue2);

        // 'selected blocks/fraction' label for A : at the bottom of A
        yLabel = yA + figureHeight + 34;

        self.A.fractions[0] = game.add.text(xLabel, yLabel, "", textStyles.valueLabelBlue2);
        self.A.fractions[1] = game.add.text(xLabel, yLabel + 21, "", textStyles.valueLabelBlue2);
        self.A.fractions[2] = game.add.text(xLabel, yLabel, "___", textStyles.valueLabelBlue2);
        self.A.fractions[0].alpha = 0;
        self.A.fractions[1].alpha = 0;
        self.A.fractions[2].alpha = 0;



        // CREATING BOTTOM FIGURE (B)

        blockWidth = this.figureWidth / totalBlocksB; // width of each block in B
        lineColor = colors.darkRed;
        fillColor = colors.lightRed;
        fillColorAux = colors.lighterRed;

        // Blocks and auxiliar blocks
        for (let i = 0; i < totalBlocksB; i++) {

            const x = xB + i * blockWidth;

            // Blocks

            const block = game.add.graphic.rect(x, yB, blockWidth, figureHeight, lineColor, 2, fillColor, 0.5);
            block.figure = 'B';
            block.index = i;
            block.finalX = xB;
            self.B.blocks.push(block);

            // Auxiliar blocks
            const alpha = (sublevelType == 'A') ? 0.2 : 0;
            const yAux = yB + figureHeight + 10; // on the bottom of B
            const auxBlock = game.add.graphic.rect(x, yAux, blockWidth, figureHeight, lineColor, 1, fillColorAux, alpha);
            self.B.auxBlocks.push(auxBlock);

        }

        // Label block B
        xLabel = xB + this.figureWidth + 30;
        yLabel = yB + figureHeight / 2;

        this.B.label = game.add.text(xLabel, yLabel, this.B.blocks.length, textStyles.valueLabelBlue2);

        // Label fraction
        yLabel = yB + figureHeight + 34;

        self.B.fractions[0] = game.add.text(xLabel, yLabel, "", textStyles.valueLabelBlue2);
        self.B.fractions[1] = game.add.text(xLabel, yLabel + 21, "", textStyles.valueLabelBlue2);
        self.B.fractions[2] = game.add.text(xLabel, yLabel, "___", textStyles.valueLabelBlue2);
        self.B.fractions[0].alpha = 0;
        self.B.fractions[1].alpha = 0;
        self.B.fractions[2].alpha = 0;

        // Invalid selection text
        self.A.warningText = game.add.text(defaultWidth / 2, defaultHeight / 2 - 225, "", textStyles.overtitle);

        self.B.warningText = game.add.text(defaultWidth / 2, defaultHeight / 2 - 45, "", textStyles.overtitle);



        game.render.all();

        game.timer.start(); // Set a timer for the current level (used in func_postScore)

        game.event.add("click", squareTwo.func_onInputDown);
        game.event.add("mousemove", squareTwo.func_onInputOver);

        game.loop.start(this);

    },

    update: function () {

        // Animate blocks
        if (self.A.animate || self.B.animate) {

            ['A', 'B'].forEach(cur => {

                if (self[cur].animate) {

                    // Lower selected blocks
                    for (let i = 0; i < self[cur].selected; i++) {
                        self[cur].blocks[i].y += 2;
                    }

                    // After fully lowering blocks, set fraction value
                    if (self[cur].blocks[0].y >= self[cur].auxBlocks[0].y) {
                        self[cur].fractions[0].name = self[cur].selected;
                        self[cur].animate = false;
                    }

                }

            });

        }

        // if A and B are already clicked
        if (self.A.hasClicked && self.B.hasClicked && !self.endLevel) {

            game.timer.stop();

            self.delay++;

            // After delay is over, check result
            if (self.delay > 50) {

                self.result = (self.A.selected / self.A.blocks.length) == (self.B.selected / self.B.blocks.length);

                // fractions are equivalent : CORRECT
                if (self.result) {

                    if (audioStatus) game.audio.okSound.play();

                    game.add.image(defaultWidth / 2, defaultHeight / 2, 'ok').anchor(0.5, 0.5);

                    mapMove = true; // allow character to move to next level in map state

                    completedLevels++;

                    if (debugMode) console.log("completedLevels = " + completedLevels);

                    // fractions are not equivalent : INCORRECT
                } else {

                    if (audioStatus) game.audio.errorSound.play();

                    game.add.image(defaultWidth / 2, defaultHeight / 2, 'error').anchor(0.5, 0.5);

                    mapMove = false; // doesnt allow character to move to next level in map state

                }

                self.func_postScore();

                self.endLevel = true;

                // reset delay values for next delay
                self.delay = 0;

            }

        }

        // Wait a bit and go to map state
        if (self.endLevel) {

            self.delay++;

            if (self.delay >= 80) {
                mapScreen.preload();
            }

        }

        game.render.all();

    },



    /* EVENT HANDLER */

    func_onInputDown: function (mouseEvent) {

        const x = mouseEvent.offsetX;
        const y = mouseEvent.offsetY;

        // click block in A
        self.A.blocks.forEach(cur => {

            const valid = y >= cur.yWithAnchor && y <= (cur.yWithAnchor + cur.height * cur.scaleHeight) && (x >= cur.xWithAnchor && x <= (cur.xWithAnchor + cur.width * cur.scaleWidth));
            if (valid) self.func_clickSquare(cur);
        });

        // click block in B
        self.B.blocks.forEach(cur => {

            const valid = y >= cur.yWithAnchor && y <= (cur.yWithAnchor + cur.height * cur.scaleHeight) && (x >= cur.xWithAnchor && x <= (cur.xWithAnchor + cur.width * cur.scaleWidth));
            if (valid) self.func_clickSquare(cur);
        });

        // click navigation icons
        navigationIcons.func_onInputDown(x, y);

        game.render.all();

    },

    func_onInputOver: function (mouseEvent) {

        const x = mouseEvent.offsetX;
        const y = mouseEvent.offsetY;
        let flagA = false;
        let flagB = false;

        // mouse over A : show fraction
        self.A.blocks.forEach(cur => {

            const valid = y >= cur.yWithAnchor && y <= (cur.yWithAnchor + cur.height * cur.scaleHeight) &&
                (x >= cur.xWithAnchor && x <= (cur.xWithAnchor + cur.width * cur.scaleWidth));

            if (valid) {
                flagA = true;
                self.func_overSquare(cur);
            }
        });
        if (!flagA) self.func_outSquare('A');

        // mouse over B : show fraction
        self.B.blocks.forEach(cur => {

            const valid = y >= cur.yWithAnchor && y <= (cur.yWithAnchor + cur.height * cur.scaleHeight) &&
                (x >= cur.xWithAnchor && x <= (cur.xWithAnchor + cur.width * cur.scaleWidth));

            if (valid) {
                flagB = true;
                self.func_overSquare(cur);
            }
        });
        if (!flagB) self.func_outSquare('B');

        if (!flagA && !flagB) document.body.style.cursor = "auto";



        // mouse over navigation icons : show name
        navigationIcons.func_onInputOver(x, y);

        game.render.all();

    },



    /* CALLED BY EVENT HANDLER */

    func_overSquare: function (curBlock) { // curBlock : self.A.blocks[i] || self.B.blocks[i]

        const curSet = curBlock.figure; // "A" || "B"

        if (!self[curSet].hasClicked) { // self.A.hasClicked || self.B.hasClicked 

            // If over fraction 'n/n' shows warning message not allowing it
            if (curBlock.index == self[curSet].blocks.length - 1) {

                const otherSet = (curSet == "A") ? "B" : "A";

                self[curSet].warningText.name = game.lang.error_msg;
                self[otherSet].warningText.name = "";

                self.func_outSquare(curSet);

            } else {

                document.body.style.cursor = "pointer";

                self.A.warningText.name = "";
                self.B.warningText.name = "";

                // selected blocks become fully visible
                for (let i in self[curSet].blocks) {
                    self[curSet].blocks[i].alpha = (i <= curBlock.index) ? 1 : 0.5;
                }

                self[curSet].fractions[0].name = curBlock.index + 1; // nominator : selected blocks
                self[curSet].fractions[1].name = self[curSet].blocks.length; // denominator : total blocks

                const newX = curBlock.finalX + ((curBlock.index + 1) * (self.figureWidth / self[curSet].blocks.length)) + 25;;
                self[curSet].fractions[0].x = newX;
                self[curSet].fractions[1].x = newX;
                self[curSet].fractions[2].x = newX;

                self[curSet].fractions[0].alpha = 1;

            }

        }

    },

    func_outSquare: function (curSet) { // curSet : self.A || self.B

        if (!self[curSet].hasClicked) {

            self[curSet].fractions[0].alpha = 0;
            self[curSet].fractions[1].alpha = 0;
            self[curSet].fractions[2].alpha = 0;

            self[curSet].blocks.forEach(cur => {
                cur.alpha = 0.5;
            });

        }

    },

    func_clickSquare: function (curBlock) { // curBlock : self.A.blocks[i] || self.B.blocks[i]

        const curSet = curBlock.figure; // "A" || "B"

        if (!self[curSet].hasClicked && curBlock.index != self[curSet].blocks.length - 1) {

            document.body.style.cursor = "auto";

            // turn auxiliar blocks invisible
            for (let i in self[curSet].blocks) {
                if (i > curBlock.index) self[curSet].auxBlocks[i].alpha = 0;
            }

            // turn value label invisible
            self[curSet].label.alpha = 0;

            if (audioStatus) game.audio.beepSound.play();

            // Save number of selected blocks
            self[curSet].selected = curBlock.index + 1;

            // set fraction x position
            const newX = curBlock.finalX + (self[curSet].selected * (self.figureWidth / self[curSet].blocks.length)) + 25;
            self[curSet].fractions[0].x = newX;
            self[curSet].fractions[1].x = newX;
            self[curSet].fractions[2].x = newX;

            self[curSet].fractions[1].alpha = 1;
            self[curSet].fractions[2].alpha = 1;

            self[curSet].hasClicked = true; // inform player have clicked in current block set
            self[curSet].animate = true; // let it initiate animation

        }

        game.render.all();

    },



    /* METADATA FOR GAME */

    func_postScore: function () {

        // Create some variables we need to send to our PHP file
        const data = "&s_game=" + gameShape
            + "&s_mode=" + levelType
            + "&s_oper=Equal"
            + "&s_leve=" + gameDifficulty
            + "&s_posi=" + mapPosition
            + "&s_resu=" + self.result
            + "&s_time=" + game.timer.elapsed
            + "&s_deta="
            + "numBlocksA: " + self.A.blocks.length
            + ", valueA: " + self.A.selected
            + ", numBlocksB: " + self.B.blocks.length
            + ", valueB: " + self.B.selected;;

        postScore(data);

    }

};