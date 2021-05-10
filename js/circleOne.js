/*

    GAME LEVELS - CIRCLE I & II: balloon level
    
    Name of game state : 'CircleOne' 
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

const circleOne = {

    preload: function () {

        document.body.style.cursor = "auto";
        game.loop.stop();
        game.event.clear();
        game.animation.clear();

        self = this;

        // NOTHING TO LOAD HERE
        circleOne.create();

    },

    create: function () {

        game.render.clear();

        // CONTROL VARIABLES

        this.availableAnimations = [];
        this.changeAnimationFrames = undefined;
        this.checkAnswer = false; //Check kid inside ballon's basket
        this.animate = false; //Start move animation
        this.animateEnding = false; //Start ballon fly animation
        this.hasClicked = false; //Air ballon positioned
        this.result = false; //Game is correct
        this.count = 0;

        this.divisorsList = ""; // used in func_postScore

        let hasBaseDifficulty = false; // Will validate that level isnt too easy (has at least one '1/difficulty' fraction)         

        const startX = (sublevelType == 'Minus') ? 66 + 5 * 156 : 66;  // Initial 'x' coordinate for the kid and the baloon
        this.correctX = startX; //Ending position, accumulative

        // BACKGROUND

        // Add background image
        game.add.image(0, 0, 'bgimage');
        // Add clouds
        game.add.image(300, 100, 'cloud');
        game.add.image(660, 80, 'cloud');
        game.add.image(110, 85, 'cloud', 0.8);

        // Add floor of grass
        for (let i = 0; i < 9; i++) { game.add.image(i * 100, 501, 'floor'); }

        // Road
        this.road = game.add.image(47, 515, 'road', 1.01, 0.94);

        // Road points 
        const distanceBetweenPoints = 156; // Distance between road points

        for (let i = 0; i <= 5; i++) {
            game.add.image(66 + i * distanceBetweenPoints, 526, 'place_off', 0.3).anchor(0.5, 0.5);
            game.add.text(66 + i * distanceBetweenPoints, 560, i, textStyles.h2_blue);
        }

        this.trace = game.add.graphic.rect(startX - 1, 526, 1, 1, undefined, 1);
        this.trace.alpha = 0;

        // Calls function that loads navigation icons
        navigationIcons.func_addIcons(
            true, true, true, // left buttons
            true, false,      // right buttons
            menuScreenCustom, this.func_viewHelp
        );



        // CIRCLES AND FRACTIONS

        this.circles = {

            all: [],       // Circles objects of current level
            label: [],     // Fractions labels

            diameter: 60,  // (Fixed) diameter for circles
            cur: 0,        // Current circle index
            direction: [], // Circle direction : 'Right' (plus), 'Left' (minus)
            distance: [],  // Fraction of distance between circles (used in walking animation)
            angle: [],     // Angle in degrees : 90 / 180 / 270 / 360
            lineColor: [], // Circle line colors (also used for tracing on floor)

            direc: [],     // Can be : 1 or -1 : will be multiplied to values to easily change object direction when needed
        };

        this.balloonPlace = defaultWidth / 2; // Balloon place

        // Number of circles
        const max = (sublevelType == 'Mixed' || levelType == 'B') ? 6 : mapPosition + 1;
        const min = (sublevelType == 'Mixed' && mapPosition < 2) ? 2 : mapPosition; // Mixed level has at least 2 fractions
        const total = game.math.randomInRange(min, max); // Total number of circles

        // levelType 'B' exclusive variables
        this.fractionIndex = -1; // Index of clicked circle (game B)
        this.numberOfPlusFractions = game.math.randomInRange(1, total - 1);



        // CIRCLES

        const levelDirection = (sublevelType == 'Minus') ? -1 : 1;
        const x = startX + 65 * levelDirection;

        for (let i = 0; i < total; i++) {

            const divisor = game.math.randomInRange(1, gameDifficulty); // Set fraction 'divisor' (depends on difficulty)

            if (divisor == gameDifficulty) hasBaseDifficulty = true; // true if after for ends has at least 1 '1/difficulty' fraction

            this.divisorsList += divisor + ","; // Add this divisor to the list of divisors (for func_postScore)

            // Set each circle direction
            let direction;

            switch (sublevelType) {
                case 'Plus': direction = 'Right'; break;
                case 'Minus': direction = 'Left'; break;
                case 'Mixed':
                    if (i < this.numberOfPlusFractions) direction = 'Right';
                    else direction = 'Left';
                    break;
            }
            this.circles.direction[i] = direction;

            // set each circle color
            let lineColor, anticlockwise;

            if (direction == 'Right') {
                lineColor = colors.darkBlue;
                this.circles.direc[i] = 1;
                anticlockwise = true;
            } else {
                lineColor = colors.red;
                this.circles.direc[i] = -1;
                anticlockwise = false;
            }
            this.circles.lineColor[i] = lineColor;

            // Draw circles 
            let circle, label = [];

            if (divisor == 1) {

                circle = game.add.graphic.circle(startX, 490 - i * this.circles.diameter, this.circles.diameter,
                    lineColor, 2, colors.white, 1);

                circle.anticlockwise = anticlockwise;

                this.circles.angle.push(360);

                if (fractionLabel) {
                    label[0] = game.add.text(x, 490 - i * this.circles.diameter, divisor, textStyles.h2_blue);
                    this.circles.label.push(label);
                }

            } else {

                let degree = 360 / divisor;

                if (direction == 'Right') degree = 360 - degree; // anticlockwise equivalent

                circle = game.add.graphic.arc(startX, 490 - i * this.circles.diameter, this.circles.diameter,
                    0, game.math.degreeToRad(degree), anticlockwise,
                    lineColor, 2, colors.white, 1);

                this.circles.angle.push(degree);

                if (fractionLabel) {
                    label[0] = game.add.text(x, 480 - i * this.circles.diameter + 32, divisor, textStyles.h4_blue);
                    label[1] = game.add.text(x, 488 - i * this.circles.diameter, '1', textStyles.h4_blue);
                    label[2] = game.add.text(x, 488 - i * this.circles.diameter, '___', textStyles.h4_blue);
                    this.circles.label.push(label);
                }

            }

            circle.rotate = 90;

            //If game is type B (select fractions)
            if (levelType == 'B') {
                circle.alpha = 0.5;
                circle.index = i;
            }

            this.circles.distance.push(Math.floor(distanceBetweenPoints / divisor));
            this.circles.all.push(circle);

            this.correctX += Math.floor(distanceBetweenPoints / divisor) * this.circles.direc[i];

        }

        //Calculate next circle
        this.nextX = startX + this.circles.distance[0] * this.circles.direc[0];



        // check if need to restart
        let restart = false;

        //If top circle position is out of bounds (when on the ground) or game doesnt have base difficulty, restart
        if (this.correctX < 66 || this.correctX > 66 + 3 * 260 || !hasBaseDifficulty) {
            restart = true;
        }

        //If game is type B, selectiong a random balloon place
        if (levelType == 'B') {

            this.balloonPlace = startX;
            this.endIndex = game.math.randomInRange(this.numberOfPlusFractions, this.circles.all.length);

            for (let i = 0; i < this.endIndex; i++) {
                this.balloonPlace += this.circles.distance[i] * this.circles.direc[i];
            }

            //If balloon position is out of bounds, restart
            if (this.balloonPlace < 66 || this.balloonPlace > 66 + 5 * distanceBetweenPoints) {
                restart = true;
            }

        }



        // KID 

        this.availableAnimations['Right'] = ['Right', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 4];
        this.availableAnimations['Left'] = ['Left', [23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12], 4];

        this.kid = game.add.sprite(startX, 495 - this.circles.all.length * this.circles.diameter, 'kid_walk', 0, 0.8);
        this.kid.anchor(0.5, 0.8);
        if (sublevelType == 'Minus') {
            this.kid.animation = this.availableAnimations['Left'];
            this.kid.curFrame = 23;
        } else {
            this.kid.animation = this.availableAnimations['Right'];
        }



        // BALLOON

        this.balloon = game.add.image(this.balloonPlace, 350, 'balloon', 1, 0.5);
        this.balloon.alpha = 0.5;
        this.balloon.anchor(0.5, 0.5);

        this.basket = game.add.image(this.balloonPlace, 472, 'balloon_basket');
        this.basket.anchor(0.5, 0.5);

        // help pointer
        this.help = game.add.image(0, 0, 'help_pointer', 0.5);
        this.help.anchor(0.5, 0);
        this.help.alpha = 0;



        if (restart) {
            circleOne.preload();
        } else {
            game.render.all();

            game.timer.start(); // Set a timer for the current level (used in func_postScore)

            game.event.add('click', circleOne.func_onInputDown);
            game.event.add('mousemove', circleOne.func_onInputOver);

            game.loop.start(this);
        }

    },

    update: function () {

        self.count++;

        //Start animation
        if (self.animate) {

            let cur = self.circles.cur;
            let DIREC = self.circles.direc[cur];

            if (self.count % 2 == 0) { // lowers animation

                // Move kid
                self.kid.x += 2 * DIREC;

                // Move circles
                for (let i in self.circles.all) {
                    self.circles.all[i].x += 2 * DIREC;
                }

                // Manage line on the floor
                self.trace.width += 2 * DIREC;
                self.trace.lineColor = self.circles.all[cur].lineColor;

                // Change angle of current arc
                self.circles.angle[cur] += 4.6 * DIREC;
                self.circles.all[cur].angleEnd = game.math.degreeToRad(self.circles.angle[cur]);

                // When finish current circle 
                let lowerCircles;
                if (self.circles.direction[cur] == 'Right') {

                    lowerCircles = self.circles.all[cur].x >= self.nextX;

                } else if (self.circles.direction[cur] == 'Left') {

                    lowerCircles = self.circles.all[cur].x <= self.nextX;

                    // if just changed from 'right' to 'left' inform to change direction of kid animation
                    if (self.changeAnimationFrames == undefined && cur > 0 && self.circles.direction[cur - 1] == 'Right') {
                        self.changeAnimationFrames = true;
                    }

                }

                // Change direction of kid animation
                if (self.changeAnimationFrames) {

                    self.changeAnimationFrames = false;

                    game.animation.stop(self.kid.animation[0]);

                    self.kid.animation = self.availableAnimations['Left'];
                    self.kid.curFrame = 23;

                    game.animation.play(self.kid.animation[0]);

                }

                if (lowerCircles) {
                    self.circles.all[cur].alpha = 0; // Cicle disappear
                    self.circles.all.forEach(cur => {
                        cur.y += self.circles.diameter; // Lower circles             
                    });
                    self.kid.y += self.circles.diameter; // Lower kid


                    self.circles.cur++; // update current circle

                    cur = self.circles.cur;
                    DIREC = self.circles.direc[cur];

                    self.nextX += self.circles.distance[cur] * DIREC; // Update next position
                }

                // When finish all circles (final position)
                if (cur == self.circles.all.length || self.circles.all[cur].alpha == 0) {
                    self.animate = false;
                    self.checkAnswer = true;
                }

            }

        }

        //Check if kid is inside the basket
        if (self.checkAnswer) {

            game.timer.stop();

            game.animation.stop(self.kid.animation[0]);

            if (self.func_checkOverlap(self.basket, self.kid)) {
                self.result = true; // answer is correct
                self.kid.curFrame = (self.kid.curFrame < 12) ? 24 : 25;
                if (audioStatus) game.audio.okSound.play();
                game.add.image(defaultWidth / 2, defaultHeight / 2, 'ok').anchor(0.5, 0.5);
                completedLevels++;
                if (debugMode) console.log("completedLevels = " + completedLevels);
            } else {
                self.result = false; // answer is incorrect
                if (audioStatus) game.audio.errorSound.play();
                game.add.image(defaultWidth / 2, defaultHeight / 2, 'error').anchor(0.5, 0.5);
            }

            self.func_postScore();

            self.animateEnding = true;
            self.checkAnswer = false;

            self.count = 0;

        }

        // balloon flying animation
        if (self.animateEnding) {

            self.balloon.y -= 2;
            self.basket.y -= 2;

            if (self.result) self.kid.y -= 2;

            if (self.count >= 140) {

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

        // LEVEL A : click road
        if (levelType == 'A') {

            const cur = self.road;

            const valid = y > 60 && (x >= cur.xWithAnchor && x <= (cur.xWithAnchor + cur.width * cur.scale));
            if (valid) self.func_clicked(x);
        }

        // LEVEL B : click circle
        if (levelType == 'B') {
            self.circles.all.forEach(cur => {
                const distance = game.math.distanceToPointer(x, cur.xWithAnchor, y, cur.yWithAnchor);
                const valid = distance <= (cur.diameter / 2) * cur.scale;
                if (valid) self.func_clicked(cur);
            });
        }

        navigationIcons.func_onInputDown(x, y);

        game.render.all();

    },

    func_onInputOver: function (mouseEvent) {

        const x = mouseEvent.offsetX;
        const y = mouseEvent.offsetY;
        let flag = false;

        // LEVEL A : balloon follow mouse
        if (levelType == 'A' && !self.hasClicked) {

            if (game.math.distanceToPointer(x, self.balloon.x, y, self.balloon.y) > 8) {
                self.balloon.x = x;
                self.basket.x = x;
            }

        }

        // LEVEL B : hover circle
        if (levelType == 'B' && !self.hasClicked) {

            self.circles.all.forEach(cur => {
                const distance = game.math.distanceToPointer(x, cur.xWithAnchor, y, cur.yWithAnchor);
                const valid = distance <= (cur.diameter / 2) * cur.scale;
                if (valid) {
                    self.func_overCircle(cur);
                    flag = true;
                }
            });
            if (!flag) self.func_outCircle();

        }

        game.render.all();

    },



    /* CALLED BY EVENT HANDLER */

    // in levelType 'B'
    func_overCircle: function (cur) {

        if (!self.hasClicked) {
            document.body.style.cursor = "pointer";
            for (let i in self.circles.all) {
                self.circles.all[i].alpha = (i <= cur.index) ? 1 : 0.5;
            }
        }

    },

    // in levelType 'B'
    func_outCircle: function () {

        if (!self.hasClicked) {
            document.body.style.cursor = "auto";
            self.circles.all.forEach(cur => {
                cur.alpha = 0.5;
            });
        }

    },

    // in levelType 'B'
    func_clicked: function (cur) {

        if (!self.hasClicked) {

            // On levelType A
            if (levelType == 'A') {
                self.balloon.x = cur;
                self.basket.x = cur;
                // On levelType B
            } else if (levelType == 'B') {

                document.body.style.cursor = "auto";

                for (let i in self.circles.all) {
                    if (i <= cur.index) {
                        self.circles.all[i].alpha = 1; // Keep selected circle
                        self.fractionIndex = cur.index;
                    } else {
                        self.circles.all[i].alpha = 0;   // Hide unselected circle
                        self.kid.y += self.circles.diameter;  // Lower kid to selected circle
                    }
                }
            }

            if (audioStatus) game.audio.beepSound.play();

            // hide fractions
            if (fractionLabel) {
                self.circles.label.forEach(cur => {
                    cur.forEach(cur => {
                        cur.alpha = 0;
                    });
                });
            }

            // Hide solution pointer
            if (self.help != undefined) self.help.alpha = 0;

            self.balloon.alpha = 1;

            self.trace.alpha = 1;

            self.hasClicked = true;
            self.animate = true;

            game.animation.play(this.kid.animation[0]);

        }

    },



    /* GAME FUNCTIONS */

    func_checkOverlap: function (spriteA, spriteB) {

        const xA = spriteA.x;
        const xB = spriteB.x;

        // consider it comming from both sides
        if (Math.abs(xA - xB) > 14) return false;
        else return true;

    },

    func_viewHelp: function () {

        if (!self.hasClicked) {

            // On levelType A
            if (levelType == 'A') {
                self.help.x = self.correctX;
                self.help.y = 490;
                // On levelType B
            } else {
                self.help.x = self.circles.all[self.endIndex - 1].x;
                self.help.y = self.circles.all[self.endIndex - 1].y - self.circles.diameter / 2;
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
            + "numCircles:" + self.circles.all.length
            + ", valCircles: " + self.divisorsList
            + " balloonX: " + self.basket.x
            + ", selIndex: " + self.fractionIndex;

        postScore(data);

    }

};