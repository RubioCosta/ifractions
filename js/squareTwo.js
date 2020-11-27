/*
    let gameSquareTwo = {
        create: function(){},
        update: function(){},
        ---------------------------- end of phaser functions
        func_overSquare: function(){},
        func_outSquare: function(){},
        func_clickSquare: function(){},

            //func_setPlace: function(){},
            //func_checkOverlap: function(){}
        func_getRndDivisor: function(){}        
            //func_viewHelp: function(){},
        
        func_updateCounter: function(){},
        func_postScore: function(){},
    };  

    GAME LEVELS - SQUARE III: fraction comparisson level
    
    Name of game state : 'squareTwo' 
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

let gameSquareTwo = {

    create: function () {

        // CONTROL VARIABLES

        self = this;

        this.numBlocksA = 0; // Subdivision of top figure (A)
        this.numBlocksB = 0; // Subdivision of bottom figure (B)
        this.selectedA = 0; // Number of selected blocks for A
        this.selectedB = 0; // Number of selected blocks for B
        this.hasClickedA = false; // Check if player clicked blocks from A
        this.hasClickedB = false; // Check if player clicked blocks from B
        this.animateA = false; // Animate blocks from A
        this.animateB = false; // Animate blocks from B
        this.result = false; // Check if selected blocks are correct
        this.ending = null;

        this.delay = 0; // Counter used in the animations 
        this.endDelay = 60; // Maximum value for the counter


        

        // BACKGROUND AND KID

        // Add background image
        game.add.image(0, 0, 'bgimage');
        // Add clouds
        game.add.image(300, 100, 'cloud');
        game.add.image(660, 80,  'cloud');
        game.add.image(110, 85,  'cloud').scale.setTo(0.8);

        // Add floor of grass
        for (let i = 0; i < 9; i++) { game.add.image(i * 100, 501, 'floor'); }

        // Calls function that loads navigation icons
        iconSettings.func_addIcons(true, true,
            true, true, false,
            true, false,
            'difficulty', false);

        //Add kid
        this.kid = game.add.sprite(100, 470, 'kid_lost');
        this.kid.scale.setTo(0.8);
        this.kid.anchor.setTo(0.5, 0.7);
        this.kid.animations.add('front', [3, 4, 5]);
        this.kid.animations.play('front', 6, false); // play kid animation once




        // Group of blocks on A and B
        this.blocksA = game.add.group();
        this.blocksB = game.add.group();

        // Group of shadow on bottom of A and B
        this.auxBlocksA = game.add.group();
        this.auxBlocksB = game.add.group();

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
        const randomIndex = game.rnd.integerInRange((levelDifficulty - 1) * 2 + 1, (levelDifficulty - 1) * 2 + 3);
        
        // number of subdivisions of A and B (blocks)
        this.numBlocksA = points[randomIndex];
        this.numBlocksB = this.func_getRndDivisor(this.numBlocksA);
        
        if (debugMode) {
            console.log("----------");
            console.log("Difficulty " + levelDifficulty + ", ini " + ((levelDifficulty - 1) * 2 + 1) + ", end " + ((levelDifficulty - 1) * 2 + 3));
            console.log("Rpoint " + randomIndex + ", val " + this.numBlocksA);
            console.log("total blocks A " + this.numBlocksA + ", total blocks B ");
        }




        // CREATING TOP FIGURE (A)
        
        let blockWidth = this.figureWidth / this.numBlocksA; // width of each block in A
        let lineColor = colors.darkGreen; 
        let fillColor = colors.lightGreen; 
        let fillColorAux = colors.lighterGreen;
        
        // Create blocks
        for (let i = 0; i < this.numBlocksA; i++) {
                        
            const x = xA + i * blockWidth;

            // Blocks
            let block = game.add.graphics(x, yA);
            block.anchor.setTo(0.5, 0.5);
            block.lineStyle(2, lineColor);
            block.beginFill(fillColor);
            block.drawRect(0, 0, blockWidth, figureHeight);
            block.alpha = 0.5;
            block.endFill();

            block.inputEnabled = true;
            block.input.useHandCursor = true;
            block.events.onInputDown.add(this.func_clickSquare, { figure: 'A', index: i, xA: xA, xB: xB });
            block.events.onInputOver.add(this.func_overSquare, { figure: 'A', index: i, xA: xA, xB: xB });
            block.events.onInputOut.add(this.func_outSquare, { figure: 'A', index: i });

            this.blocksA.add(block);

            // Auxiliar blocks
            const yAux = yA + figureHeight + 10; // on the bottom of A

            block = game.add.graphics(x, yAux);
            block.anchor.setTo(0.5, 0.5);
            block.lineStyle(1, lineColor);
            block.beginFill(fillColorAux);
            block.drawRect(0, 0, blockWidth, figureHeight);
            block.alpha = (sublevelType == 'A') ? 0.2 : 0; // Only visible in sublevel A, but used as parameter is all

            this.auxBlocksA.add(block);

        }

        // 'total blocks' label for A : on the side of A
        let xLabel = xA + this.figureWidth + 30;
        let yLabel = yA + figureHeight / 2;
        this.labelA = game.add.text(xLabel, yLabel, this.numBlocksA, textStyles.valueLabelBlue2);
        this.labelA.anchor.setTo(0.5, 0.41);

        // 'selected blocks/fraction' label for A : at the bottom of A
        yLabel = yA + figureHeight + 34;
        this.fractionA = game.add.text(xLabel, yLabel, "", textStyles.valueLabelBlue2);
        this.fractionA.anchor.setTo(0.5, 0.41);
        this.fractionA.alpha = 0;
        this.fractionLineA = game.add.sprite(xLabel, yLabel + 3, 'fractionLine');
        this.fractionLineA.anchor.setTo(0.5, 0.5);
        this.fractionLineA.alpha = 0;




        // CREATING BOTTOM FIGURE (B)

        blockWidth = this.figureWidth / this.numBlocksB; // width of each block in B
        lineColor = colors.darkRed_;
        fillColor = colors.lightRed;
        fillColorAux = colors.lighterRed;

        // Blocks and auxiliar blocks
        for (let i = 0; i < this.numBlocksB; i++) {

            const x = xB + i * blockWidth;

            // Blocks
            let block = game.add.graphics(x, yB);
            block.anchor.setTo(0.5, 0.5);
            block.lineStyle(2, lineColor);
            block.beginFill(fillColor);
            block.drawRect(0, 0, blockWidth, figureHeight);
            block.endFill();

            block.inputEnabled = true;
            block.input.useHandCursor = true;
            block.events.onInputDown.add(this.func_clickSquare, { figure: 'B', index: i, xA: xA, xB: xB  });
            block.events.onInputOver.add(this.func_overSquare, { figure: 'B', index: i, xA: xA, xB: xB  });
            block.events.onInputOut.add(this.func_outSquare, { figure: 'B', index: i });

            this.blocksB.add(block);
            
            // Auxiliar blocks
            let yAux = yB + figureHeight + 10; // on the bottom of B

            block = game.add.graphics(x, yAux);
            block.anchor.setTo(0.5, 0.5);
            block.lineStyle(1, lineColor);
            block.beginFill(fillColorAux);
            block.drawRect(0, 0, blockWidth, figureHeight);
            block.alpha = (sublevelType == 'A') ? 0.2 : 0; // Only visible in sublevel A, but used as parameter is all

            this.auxBlocksB.add(block);

        }

        // Label block B
        xLabel = xB + this.figureWidth + 30;
        yLabel = yB + figureHeight / 2;
        this.labelB = game.add.text(xLabel, yLabel, this.numBlocksB, textStyles.valueLabelBlue2);
        this.labelB.anchor.setTo(0.5, 0.41);

        // Label fraction
        yLabel = yB + figureHeight + 34;
        this.fractionB = game.add.text(xLabel, yLabel, "", textStyles.valueLabelBlue2);
        this.fractionB.anchor.setTo(0.5, 0.41);
        this.fractionB.alpha = 0;
        this.fractionLineB = game.add.sprite(xLabel, yLabel + 3, 'fractionLine');
        this.fractionLineB.anchor.setTo(0.5, 0.5);
        this.fractionLineB.alpha = 0;




        // OUTPUT ICONS AND TEXT
        
        // Ok image
        this.okImg = game.add.image(game.world.centerX, game.world.centerY, 'h_ok');
        this.okImg.anchor.setTo(0.5);
        this.okImg.visible = false;

        // Error image
        this.errorImg = game.add.image(game.world.centerX, game.world.centerY, 'h_error');
        this.errorImg.anchor.setTo(0.5);
        this.errorImg.visible = false;

        // Invalid selection text
        this.warningTextA = game.add.text(game.world.centerX, game.world.centerY - 225, "", textStyles.overtitle);
        this.warningTextA.anchor.setTo(0.5, 0.5);

        this.warningTextB = game.add.text(game.world.centerX, game.world.centerY - 45, "", textStyles.overtitle);
        this.warningTextB.anchor.setTo(0.5, 0.5);




        // TIMER

        // Set a timer for the current level
        this.totalTime = 0;
        this.timer = game.time.create(false);
        this.timer.loop(1000, this.func_updateCounter, this);
        this.timer.start();

    },

    update: function () {

        // If clicked A, animate A blocks
        if (this.animateA) {

            // Lower selected blocks
            for (let i = 0; i < this.selectedA; i++) {
                this.blocksA.children[i].y += 2;
            }
            
            // After fully lowering blocks, set fraction value
            if (this.blocksA.children[0].y >= this.auxBlocksA.children[0].y) {

                this.fractionA.alpha = 1;
                this.fractionA.setText(this.selectedA + "\n" + this.numBlocksA);
                this.fractionLineA.alpha = 1;

                this.animateA = false;
            }
        
        }

        // If clicked B, animate B blocks
        if (this.animateB) {
            
            // Lower selected blocks
            for (let i = 0; i < this.selectedB; i++) {
                this.blocksB.children[i].y += 2;
            }
            
            // Sets fraction value
            if (this.blocksB.children[0].y >= this.auxBlocksB.children[0].y) {
                this.fractionB.alpha = 1;
                this.fractionB.setText(this.selectedB + "\n" + this.numBlocksB);
                this.fractionLineB.alpha = 1;

                this.animateB = false;
            }
        
        }

        // if A and B are already clicked
        if (this.hasClickedA && this.hasClickedB && !this.ending) {

            this.timer.stop();

            // Wait a bit before showing result
            this.delay++;

            // After delay is over, check result
            if (this.delay > this.endDelay) {

                // fractions are equivalent : correct
                if ((this.selectedA / this.numBlocksA) == (this.selectedB / this.numBlocksB)) {

                    if (audioStatus) okSound.play();

                    this.okImg.visible = true;

                    this.result = true; // player answer is correct

                    mapCanMove = true; // allow character to move to next level in map state
                    completedLevels++;
                    if (debugMode) console.log("completedLevels = " + completedLevels);


                // fractions are not equivalent : incorrect
                } else {
                    
                    if (audioStatus) errorSound.play();
                    
                    this.errorImg.visible = true;

                    this.result = false; // player answer is incorrect

                    mapCanMove = false; // doesnt allow character to move to next level in map state

                }

                this.func_postScore();
                this.hasClickedA = false;
                this.hasClickedB = false;

                // reset delay values for next delay
                this.delay = 0;
                this.endDelay = 100;
                this.ending = true;

            }

        }

        // Wait a bit and go to map state
        if (this.ending) {

            this.delay++;
            
            if (this.delay >= this.endDelay) { 
                game.state.start('map'); 
            }

        }

    },

    func_overSquare: function () {

        if (!self.hasClickedA && this.figure == "A") {

            // If over fraction 'n/n' shows warning message not allowing it
            if (this.index == self.numBlocksA - 1) {

                self.warningTextA.setText(lang.error_msg);
                self.warningTextB.setText("");
            
            } else {
                
                self.warningTextA.setText("");
                self.warningTextB.setText("");
            
                // selected blocks become fully visible
                for (let i = 0; i < self.numBlocksA; i++) {
                    self.blocksA.children[i].alpha = (i <= this.index) ? 1 : 0.5;
                }
            
                self.fractionA.x = this.xA + ((this.index + 1) * (self.figureWidth / self.numBlocksA)) + 25;
                self.fractionA.alpha = 1;
                self.fractionA.setText(this.index + 1);

            }

        }

        if (!self.hasClickedB && this.figure == "B") {

            // If over fraction 'n/n' shows warning message not allowing it
            if (this.index == self.numBlocksB - 1) {

                self.warningTextA.setText("");
                self.warningTextB.setText(lang.error_msg);
            
            } else {
            
                self.warningTextA.setText("");
                self.warningTextB.setText("");
            
                // selected blocks become fully visible
                for (let i = 0; i < self.numBlocksB; i++) {
                    self.blocksB.children[i].alpha = (i <= this.index) ? 1 : 0.5;
                }

                self.fractionB.x = this.xB + ((this.index + 1) * (self.figureWidth / self.numBlocksB)) + 25;
                self.fractionB.alpha = 1;
                self.fractionB.setText(this.index + 1);
            
            }

        }

    },

    func_outSquare: function () {

        // On level type A
        if (!self.hasClickedA && this.figure == "A") {

            for (let i = 0; i <= this.index; i++) { 
                self.blocksA.children[i].alpha = 0.5; 
            }
            self.fractionA.alpha = 0;
        
        }
        
        // On level type B
        if (!self.hasClickedB && this.figure == "B") {
        
            for (let i = 0; i <= this.index; i++) { 
                self.blocksB.children[i].alpha = 0.5; 
            }
            self.fractionB.alpha = 0;
        
        }

    },

    func_clickSquare: function () {

        // On level type A 
        if (!self.hasClickedA && this.figure == "A" && this.index != self.numBlocksA - 1) {
            
            for (let i = 0; i < self.numBlocksA; i++) {
                // desable block input
                self.blocksA.children[i].inputEnabled = false;
                // turn auxiliar blocks invisible
                if (i > this.index) self.auxBlocksA.children[i].alpha = 0;
            }
            
            // turn value label invisible
            self.labelA.alpha = 0;
            
            if (audioStatus) beepSound.play();
            
            // Save number of selected blocks
            self.selectedA = this.index + 1;

            // set fraction x position
            self.fractionA.x = this.xA + (self.selectedA * (self.figureWidth / self.numBlocksA)) + 25;
            self.fractionLineA.x = self.fractionA.x

            self.hasClickedA = true;            
            self.animateA = true;
        
        }

        // On level type B
        if (!self.hasClickedB && this.figure == "B" && this.index != self.numBlocksB - 1) {

            for (let i = 0; i < self.numBlocksB; i++) {
                // desable block input
                self.blocksB.children[i].inputEnabled = false;
                // turn auxiliar blocks invisible
                if (i > this.index) self.auxBlocksB.children[i].alpha = 0;
            }

            // turn value label invisible
            self.labelB.alpha = 0;

            if (audioStatus) beepSound.play();
            
            // Save number of selected blocks
            self.selectedB = this.index + 1;
            
            // Set fraction x position
            self.fractionB.x = this.xB + (self.selectedB * (self.figureWidth / self.numBlocksB)) + 25;
            self.fractionLineB.x = self.fractionB.x

            self.hasClickedB = true;
            self.animateB = true;

        }

    },

    func_getRndDivisor: function (number) { //Get random divisor for a number

        let div = []; //Divisors found
        let p = 0;    //current dividor index

        for (let i = 2; i < number; i++) {
            if (number % i == 0) {
                div[p] = i;
                p++;
            }
        }
        let x = game.rnd.integerInRange(0, p - 1);
        return div[x];

    },

    func_getRndDivisor: function (number) { //Get random divisor for a number

        let validDivs = []; // Divisors found

        for (let div = 2; div < number; div++) {

            // if 'number' can be divided by 'div', add to list of 'validDivs'
            if (number % div == 0) validDivs.push(div);
        
        }

        const randIndex = game.rnd.integerInRange(0, validDivs.length - 1);
        
        return validDivs[randIndex];

    },

    // Game information

    func_updateCounter: function () {
        this.totalTime++;
    },

    func_postScore: function () {

        let abst = "numBlocksA: " + this.numBlocksA 
                + ", valueA: " + this.selectedA 
                + ", numBlocksB: " + this.numBlocksB 
                + ", valueB: " + this.selectedB;

        let hr = new XMLHttpRequest();
        
        // Create some variables we need to send to our PHP file
        let url = "php/save.php";
        let vars = "s_ip=" + hip 
                + "&s_name=" + playerName 
                + "&s_lang=" + langString 
                + "&s_game=" + levelShape 
                + "&s_mode=" + levelType;
        vars +=   "&s_oper=Equal"
                + "&s_leve=" + levelDifficulty 
                + "&s_posi=" + mapPosition 
                + "&s_resu=" + this.result 
                + "&s_time=" + this.totalTime 
                + "&s_deta=" + abst;

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