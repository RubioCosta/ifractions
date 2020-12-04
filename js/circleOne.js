/*
    let gameCircleOne = {
        create: function(){},
        update: function(){},
        ---------------------------- end of phaser functions
        func_overCircle: function(){},
        func_outCircle: function(){},
        func_clickCircle: function(){},
        
        func_setPlace: function(){},
        func_checkOverlap: function(_,_){}
            //func_getRndDivisor: function(){}
        func_viewHelp: function(){},

        func_postScore: function(){},
        func_updateCounter: function(){},
    };

    GAME LEVELS - CIRCLE I & II: balloon level
    
    Name of game state : 'circleOne' 
    Shape : circle
    Character : kid/balloon
    Theme : flying a balloon
    Concept : 'How much the kid has to walk to get to the balloon?'
    Represent fractions as : circles

    # of different difficulties for each level : 5

    Levels can be : 'A' or 'B' (in variable 'levelType')

        A : Player can place balloon position
            Place balloon in position (so the kid can get to it)
        B : Player can select # of circles
            Selects number of circles (that represent distance kid needs to walk to get to the balloon)

    Sublevels can be : 'Plus', 'Minus' or 'Mixed' (in variable 'sublevelType')
    
        Plus : addition of fractions
            Represented by : kid going to the right (floor positions 0..5)
        Minus : subtraction of fractions
            Represented by: kid going to the left (floor positions 5..0)
        Mixed : Mix addition and subtraction of fractions in same 
            Represented by: kid going to the left (floor positions 0..5)
*/

let gameCircleOne = {

    create: function () {

        // CONTROL VARIABLES

        self = this; // saves a reference to gameSquareOne : to be used in functions called by phaser events

        this.checkAnswer = false; //Check kid inside ballon's basket
        this.animate = false; //Start move animation
        this.animateEnding = false; //Start ballon fly animation
        this.animateCounter = 0; //Fly counter

        this.hasClicked = false; //Air ballon positioned
        this.result = false; //Game is correct
        let hasBaseDifficulty = false; //If has level figure
        this.divisorsList = "";

        this.DIREC_LEVEL = (sublevelType == 'Minus') ? -1 : 1;    // Will be multiplied to values to easily change kid direction when needed

        // GAME VARIABLES

        this.circleSize = 60;     // Base circle width and height
        const startX = (sublevelType == 'Minus') ? 66 + 5 * 156 : 66;  // Initial 'x' coordinate for the kid and the baloon



        // BACKGROUND AND KID

        // Add background image
        game.add.image(0, 0, 'bgimage');
        // Add clouds
        game.add.image(300, 100, 'cloud');
        game.add.image(660, 80, 'cloud');
        game.add.image(110, 85, 'cloud').scale.setTo(0.8);

        // Add floor of grass
        for (let i = 0; i < 9; i++) { game.add.image(i * 100, 501, 'floor'); }
        // Road
        const road = game.add.image(47, 515, 'road');
        road.scale.setTo(1.01, 0.94);
        if (levelType == 'A') {
            road.inputEnabled = true;
            road.events.onInputDown.add(this.func_setPlace); //enabling input for tablets
        }
        // Road points
        const placeDistance = 156; //Distance between places
        for (let p = 0; p <= 5; p++) {// Places
            const place = game.add.image(66 + p * placeDistance, 526, 'place_a');
            place.anchor.setTo(0.5);
            place.scale.setTo(0.3);
            game.add.text(66 + p * placeDistance, 560, p, textStyles.valueLabelBlue1).anchor.setTo(0.5);
        }

        // Calls function that loads navigation icons
        iconSettings.func_addIcons(true, true,
            true, true, true,
            true, false,
            'difficulty', this.func_viewHelp);




        //trace
        this.trace = this.add.bitmapData(this.game.width, this.game.height);
        this.trace.addToWorld();
        this.trace.clear();




        // CIRCLES AND FRACTIONS

        this.circles = game.add.group(); //Fraction arrays
        this.curCircle = 0; //Actual index circle
        this.circleDirection = []; //Directions right(plus), left (minus)
        this.circleDistance = []; //Displacement distance of the circles
        this.circleAngle = []; //Angles of circles
        this.circleTraceColor = []; //Trace colors
        this.endPosition = startX; //Ending position, accumulative

        this.circleLabel = game.add.group(); //Labels of the circles
        this.fractionLines = game.add.group(); // line in the center of fraction




        //Maximum circles according to difficulty
        const maxCircles = (levelType == 'B' || sublevelType == 'Mixed') ? 6 : mapPosition + 1;
        this.numCircles = game.rnd.integerInRange(mapPosition, maxCircles); //Number of circles

        //Game B exclusive variables
        this.balloonPlace = this.game.world.centerX; //Fixed place for ballon (game B)
        this.fractionIndex = -1; //Index of clicked fraction (game B)
        this.numPlus = game.rnd.integerInRange(1, this.numCircles - 1);




        // CREATING CIRCLES

        for (let i = 0; i < this.numCircles; i++) {

            // Set divisor of fraction for the current circle (depends on difficulty)
            const divisor = game.rnd.integerInRange(1, levelDifficulty);
            // will validate that level isnt too easy (has at least one '1/difficulty' fraction)         
            if (divisor == levelDifficulty) hasBaseDifficulty = true;
            // Add this divisor to the list of divisors (for func_postScore)
            this.divisorsList += divisor + ",";

            let direction = '';
            let lineColor = '';

            if (sublevelType == 'Mixed') {
                if (i <= this.numPlus) {
                    direction = 'Right';
                    lineColor = colors.darkBlue;
                } else {
                    direction = 'Left';
                    lineColor = colors.red;
                }
            } else if (sublevelType == 'Plus') {
                direction = 'Right';
                lineColor = colors.darkBlue;
            } else if (sublevelType == 'Minus') {
                direction = 'Left';
                lineColor = colors.red;
            }

            this.circleTraceColor[i] = lineColor;

            const circle = game.add.graphics(startX, 490 - i * this.circleSize);
            circle.anchor.setTo(0.5, 0.5);
            circle.lineStyle(2, lineColor);
            circle.beginFill(colors.lightBlue);
            if (direction == 'Right') circle.scale.y *= -1;

            this.circleDirection[i] = direction;

            if (divisor == 1) {

                circle.drawCircle(0, 0, this.circleSize);

                this.circleDistance.push(placeDistance);
                this.circleAngle.push(360);

                if (levelLabel) {

                    const x = startX + 65 * this.DIREC_LEVEL;

                    const label = game.add.text(x, 490 - i * this.circleSize, divisor, textStyles.valueLabelBlue1);
                    label.anchor.setTo(0.5, 0.5);
                    this.circleLabel.add(label);

                }

            } else {

                const distance = 360 / divisor + 5;

                circle.arc(0, 0, this.circleSize / 2, game.math.degToRad(distance), 0, true);

                this.circleDistance.push(Math.floor(placeDistance / divisor));
                this.circleAngle.push(distance);

                if (levelLabel) {

                    const x = startX + 65 * this.DIREC_LEVEL;

                    const label = game.add.text(x, 488 - i * this.circleSize, '1\n' + divisor, textStyles.valueLabelBlue1);
                    label.anchor.setTo(0.5, 0.5);
                    this.circleLabel.add(label);
                    // Sprite that serves as line in the middle of a fraction
                    const fractionLine = game.add.sprite(x, 485 - i * this.circleSize, 'fractionLine');
                    fractionLine.anchor.setTo(0.5, 0.5);
                    this.fractionLines.add(fractionLine);

                }

            }

            if (direction == 'Right') this.endPosition += Math.floor(placeDistance / divisor);
            else if (direction == 'Left') this.endPosition -= Math.floor(placeDistance / divisor);

            circle.endFill();
            circle.angle += 90;

            //If game is type B, (select fractions, adding event)
            if (levelType == 'B') {
                circle.alpha = 0.5;
                circle.inputEnabled = true;
                circle.input.useHandCursor = true;
                circle.events.onInputDown.add(this.func_clickCircle, { index: i });
                circle.events.onInputOver.add(this.func_overCircle, { index: i });
                circle.events.onInputOut.add(this.func_outCircle, { index: i });
            }

            this.circles.add(circle);
        }

        //Calculate next circle
        if (this.circleDirection[this.curCircle] == 'Right') this.nextEnd = startX + this.circleDistance[this.curCircle];
        else this.nextEnd = startX - this.circleDistance[this.curCircle];


        //If game is type B, selectiong a random balloon place
        if (levelType == 'B') {

            this.balloonPlace = startX;
            this.endIndex = game.rnd.integerInRange(this.numPlus, this.numCircles);

            for (let j = 0; j < this.endIndex; j++) {
                if (this.circleDirection[j] == 'Right') this.balloonPlace += this.circleDistance[j];
                else if (this.circleDirection[j] == 'Left') this.balloonPlace -= this.circleDistance[j];
            }

            if (this.balloonPlace < 66 || this.balloonPlace > 66 + 5 * placeDistance || !hasBaseDifficulty) {
                game.state.start('gameCircleOne');
            }
        }

        //If end position is out of bounds, restart
        if (this.endPosition < 66 || this.endPosition > 66 + 3 * 260 || !hasBaseDifficulty) {
            game.state.start('gameCircleOne');
        }



        //kid
        this.kid_walk = game.add.sprite(startX, 495 - this.numCircles * this.circleSize, 'kid_walk');
        this.kid_walk.anchor.setTo(0.5, 0.8);
        this.kid_walk.scale.setTo(0.8);

        this.kid_walk.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
        this.kid_walk.animations.add('left', [23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12]);

        if (sublevelType == 'Minus') {
            this.kid_walk.animations.play('left', 6, true);
            this.kid_walk.animations.stop();
        }




        // BALLOON

        this.balloon = game.add.sprite(this.balloonPlace, 350, 'balloon');
        this.balloon.anchor.setTo(0.5, 0.5);
        this.balloon.alpha = 0.5;

        this.basket = game.add.sprite(this.balloonPlace, 472, 'balloon_basket');
        this.basket.anchor.setTo(0.5, 0.5);




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

        // Set a timer for the current level
        this.totalTime = 0;
        this.timer = game.time.create(false);
        this.timer.loop(1000, this.func_updateCounter, this);
        this.timer.start();

    },

    update: function () {

        // if player clicked
        if (game.input.activePointer.isDown && !this.animateEnding && !this.hasClicked) {

            // Game wont consider click if clicking on navigation icons
            if (levelType == 'A' && game.input.mousePointer.y > 60) {

                this.balloon.x = game.input.mousePointer.x;
                this.basket.x = game.input.mousePointer.x;

                // Balloon is completely visible
                this.balloon.alpha = 1;

                if (audioStatus) sound.beepSound.play();

                // Turn on kid animation
                if (this.circleDirection[this.curCircle] == 'Right') {
                    this.kid_walk.animations.play('right', 6, true);
                } else {
                    this.kid_walk.animations.play('left', 6, true);
                }

                //Hiding labels
                if (levelLabel) {
                    this.circleLabel.visible = false;
                    this.fractionLines.visible = false;
                }

                this.hasClicked = true;
                this.animate = true;

            }

        }

        // while player not clicked : track mouse to move baloon according to its position
        if (levelType == "A" && !this.hasClicked && !this.animateEnding) {

            if (game.physics.arcade.distanceToPointer(this.balloon, game.input.activePointer) > 8) {
                this.balloon.x = game.input.mousePointer.x;
                this.basket.x = game.input.mousePointer.x;
            }

        }

        //Start animation
        if (this.animate) {

            // create line on the ground and move kid
            let color;
            if (this.circleDirection[this.curCircle] == 'Right') {
                this.kid_walk.x += 2;
                color = 'rgba(0, 51, 153, 1)';
            } else if (this.circleDirection[this.curCircle] == 'Left') {
                this.kid_walk.x -= 2;
                color = 'rgba(179, 0, 0, 1)';
            }
            this.trace.rect(this.kid_walk.x, 526, 2, 2, color);

            //Moving every circle
            for (let i = 0; i < this.numCircles; i++) {
                if (this.circleDirection[this.curCircle] == 'Right') this.circles.children[i].x += 2;
                else this.circles.children[i].x -= 2;
            }

            this.circleAngle[this.curCircle] -= 4.6;
            this.circles.children[this.curCircle].clear();
            this.circles.children[this.curCircle].lineStyle(2, this.circleTraceColor[this.curCircle]);
            this.circles.children[this.curCircle].beginFill(colors.lightBlue);
            this.circles.children[this.curCircle].arc(0, 0, this.circleSize / 2, game.math.degToRad(this.circleAngle[this.curCircle]), 0, true);
            this.circles.children[this.curCircle].endFill();

            if ((this.circleDirection[this.curCircle] == 'Right' && this.circles.children[this.curCircle].x >= this.nextEnd) ||
                (this.circleDirection[this.curCircle] == 'Left' && this.circles.children[this.curCircle].x <= this.nextEnd)
            ) {

                this.circles.children[this.curCircle].visible = false;
                this.circles.y += this.circleSize;
                this.kid_walk.y += this.circleSize;
                this.curCircle += 1;

                if (this.circleDirection[this.curCircle] == 'Right') {
                    this.nextEnd += this.circleDistance[this.curCircle];
                    this.kid_walk.animations.play('right', 6, true);
                } else if (this.circleDirection[this.curCircle] == 'Left') {
                    this.nextEnd -= this.circleDistance[this.curCircle];
                    this.kid_walk.animations.play('left', 6, true);
                }
            }

            if (this.curCircle == this.numCircles) { //Final position
                this.animate = false;
                this.checkAnswer = true;
            }

        }

        //Check if kid is inside the basket
        if (this.checkAnswer) {

            this.kid_walk.animations.stop();

            this.timer.stop();

            if (this.func_checkOverlap(this.basket, this.kid_walk)) {

                this.kid_walk.frame = (this.kid_walk.frame < 12) ? 24 : 25;

                this.result = true;

                if (audioStatus) sound.okSound.play();

                this.okImg.visible = true;

                completedLevels++;
                if (debugMode) console.log("completedLevels = " + completedLevels);

            } else {

                this.result = false;

                if (audioStatus) sound.errorSound.play();

                this.errorImg.visible = true;

            }

            this.func_postScore();

            this.animateEnding = true;
            this.checkAnswer = false;

        }

        // balloon flying animation
        if (this.animateEnding) {

            this.animateCounter++;

            this.balloon.y -= 2;
            this.basket.y -= 2;
            if (this.result) this.kid_walk.y -= 2;

            if (this.animateCounter >= 140) {

                if (this.result) mapCanMove = true;
                else mapCanMove = false;

                game.state.start('map');

            }
        }

    },

    // in levelType 'B'
    func_overCircle: function () {

        if (!self.hasClicked) {
            for (let i = 0; i < self.numCircles; i++) {
                self.circles.children[i].alpha = (i <= this.index) ? 1 : 0.5;
            }
        }

    },

    // in levelType 'B'
    func_outCircle: function () {

        if (!self.hasClicked) {
            for (let i = 0; i <= this.index; i++) {
                self.circles.children[i].alpha = 0.5;
            }
        }

    },

    // in levelType 'B'
    func_clickCircle: function () {

        if (!self.hasClicked) {

            let minusCircles = 0;

            for (let i = 0; i < self.numCircles; i++) {

                if (i <= this.index) {
                    self.fractionIndex = this.index;
                    self.circles.children[i].alpha = 1;
                } else {
                    self.circles.children[i].visible = false;   //Delete unselected circle
                    minusCircles += 1;  //number of circles to reduce
                    self.kid_walk.y += self.circleSize;  // Lower kid to selected circle
                }

            }

            self.numCircles -= minusCircles; //Final reduced circles

            self.balloon.alpha = 1;

            if (audioStatus) sound.beepSound.play();

            if (self.circleDirection[self.curCircle] == 'Right') {
                self.kid_walk.animations.play('right', 6, true);
            } else {
                self.kid_walk.animations.play('left', 6, true);
            }

            if (levelLabel) { //Hiding labels
                self.circleLabel.visible = false;
                self.fractionLines.visible = false;
            }

            self.hasClicked = true;
            self.animate = true;

        }

    },

    func_setPlace: function () {

        if (!self.hasClicked) {

            self.balloon.x = game.input.x;
            self.basket.x = game.input.x;

            self.balloon.alpha = 1;

            if (audioStatus) sound.beepSound.play();

            if (self.circleDirection[self.curCircle] == 'Right') {
                self.kid_walk.animations.play('right', 6, true);
            } else {
                self.kid_walk.animations.play('left', 6, true);
            }

            if (levelLabel) { //Hiding labels
                self.circleLabel.visible = false;
                self.fractionLines.visible = false;
            }

            self.hasClicked = true;
            self.animate = true;

        }

    },

    func_checkOverlap: function (spriteA, spriteB) {

        const xA = spriteA.x;
        const xB = spriteB.x;

        if (Math.abs(xA - xB) > 14) return false;
        else return true;

    },

    func_viewHelp: function () {

        if (!self.hasClicked) {

            let pointer;

            if (levelType == 'A') {
                pointer = game.add.image(self.endPosition, 490, 'pointer');
            } else {
                pointer = game.add.image(self.circles.children[self.endIndex - 1].x, self.circles.children[self.endIndex - 1].y - self.circleSize / 2, 'pointer');
            }

            pointer.anchor.setTo(0.5, 0);
            pointer.alpha = 0.7;
        }

    },

    // Game information

    func_updateCounter: function () {
        this.totalTime++;
    },

    func_postScore: function () {

        const abst = "numCircles:" + this.numCircles
            + ", valCircles: " + this.divisorsList
            + " balloonX: " + this.basket.x
            + ", selIndex: " + this.fractionIndex;

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