// MAP SCREEN: game map where character advances as he passes a level
const mapScreen = {

    preload: function () {

        document.body.style.cursor = "auto";
        game.loop.stop();
        game.event.clear();
        game.animation.clear();

        self = this;

        // NOTHING TO LOAD HERE 
        mapScreen.create();

    },

    create: function () {

        game.render.clear();

        // Background color
        game.add.graphic.rect(0, 0, 900, 600, undefined, 0, colors.blueBckg, 1);

        // map
        game.add.image(0, 40, 'bgmap');

        // Calls function that loads navigation icons
        navigationIcons.func_addIcons(true, true, false, // left icons
            false, false, // right icons
            menuScreenCustom, false);

        // Progress bar
        const percentText = 4 * 25;

        if (completedLevels == 4) game.add.graphic.rect(660, 10, completedLevels * 37.5, 35, undefined, 0, colors.intenseGreen, 0.5);
        else game.add.graphic.rect(660, 10, completedLevels * 37.5, 35, undefined, 0, colors.yellow, 0.9);
        
        game.add.graphic.rect(661, 11, 149, 34, colors.blue, 3, undefined, 1);
        game.add.text(820, 38, percentText + '%', textStyles.h2_blue, 'left');
        game.add.text(650, 38, game.lang.difficulty + ' ' + gameDifficulty, textStyles.h2_blue, 'right');

        // Map positions
        this.points = {
            x: [90, 204, 318, 432, 546, 660],
            y: [486, 422, 358, 294, 230, 166]
        };

        if (gameTypeString == "squareOne") {
            //Garage
            game.add.image(this.points.x[0], this.points.y[0], 'garage', 0.4).anchor(0.5, 1);
            //Farm
            game.add.image(this.points.x[5], this.points.y[5], 'farm', 0.6).anchor(0.1, 0.7);
        } else {
            //House
            game.add.image(this.points.x[0], this.points.y[0], 'house', 0.7).anchor(0.7, 0.8);
            //School
            game.add.image(this.points.x[5], this.points.y[5], 'school', 0.35).anchor(0.2, 0.7);
        }

        // Rocks and bushes
        const rocks = {
            x: [156, 275, 276, 441, 452, 590, 712],
            y: [309, 543, 259, 156, 419, 136, 316],
            type: [1, 1, 2, 1, 2, 2, 2]
        };

        for (let i in rocks.type) {
            if (rocks.type[i] == 1) {
                game.add.image(rocks.x[i], rocks.y[i], 'rock', 0.32).anchor(0.5, 0.95);
            } else {
                game.add.image(rocks.x[i], rocks.y[i], 'bush', 0.4).anchor(0.5, 0.95);
            }
        }

        // Trees
        const trees = {
            x: [105, 214, 354, 364, 570, 600, 740, 779],
            y: [341, 219, 180, 520, 550, 392, 488, 286],
            type: [2, 4, 3, 4, 1, 2, 4, 4]
        };

        for (let i in trees.type) {
            game.add.image(trees.x[i], trees.y[i], 'tree' + trees.type[i], 0.6).anchor(0.5, 0.95);
        }

        // Map positions
        for (let i = 1; i < this.points.x.length - 1; i++) {

            const aux = (i < mapPosition || (mapMove && i == mapPosition)) ? 'place_on' : 'place_off';

            // Map road positions
            game.add.image(this.points.x[i], this.points.y[i], aux, 0.3).anchor(0.5, 0.5);

            // Level signs
            game.add.image(this.points.x[i] - 20, this.points.y[i] - 60, 'sign', 0.4).anchor(0.5, 1);
            game.add.text(this.points.x[i] - 20, this.points.y[i] - 79, i, textStyles.h2_white);

        }

        // Game Character 
        if (gameTypeString == "squareOne") {

            if (sublevelType == 'Plus') {
                this.character = game.add.sprite(this.points.x[mapPosition], this.points.y[mapPosition], 'tractor', 0, 0.5);
                this.character.animation = ["green_tractor", [0, 1, 2, 3, 4], 3];
            } else {
                this.character = game.add.sprite(this.points.x[mapPosition], this.points.y[mapPosition], 'tractor', 10, 0.5);
                this.character.animation = ["red_tractor", [10, 11, 12, 13, 14], 3];
            }

            this.character.rotate = -30; // 25 anticlock

        } else {

            this.character = game.add.sprite(this.points.x[mapPosition], this.points.y[mapPosition], 'kid_run', 0, 0.4);
            this.character.animation = ["kid", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3];

        }

        this.character.anchor(0.5, 1);
        game.animation.play(this.character.animation[0]);


        this.count = 0;

        const speed = 60;
        const xA = this.points.x[mapPosition];
        const yA = this.points.y[mapPosition];
        const xB = this.points.x[mapPosition + 1];
        const yB = this.points.y[mapPosition + 1];
        self.speedX = (xB - xA) / speed;
        self.speedY = (yA - yB) / speed;

        game.event.add("click", mapScreen.func_onInputDown);
        game.event.add("mousemove", mapScreen.func_onInputOver);

        game.render.all();

        game.loop.start(this);

    },

    update: function () {

        let endUpdate = false;

        self.count++;

        if (self.count > 60) { // Wait 1 second before moving or staring a game

            if (mapMove) { // move character on screen for 1 second
                self.character.x += self.speedX;
                self.character.y -= self.speedY;
                if (Math.ceil(self.character.x) >= self.points.x[mapPosition + 1]) { // reached next map position
                    mapMove = false;
                    mapPosition++; //set new next position
                }
            }

            if (!mapMove) {
                endUpdate = true;
            }


        }

        game.render.all();

        if (endUpdate) {
            game.animation.stop(self.character.animation[0]);
            self.func_loadGame();
        }

    },



    /* EVENT HANDLER */

    func_onInputDown: function (mouseEvent) {

        navigationIcons.func_onInputDown(mouseEvent.offsetX, mouseEvent.offsetY);

    },

    func_onInputOver: function (mouseEvent) {

        navigationIcons.func_onInputOver(mouseEvent.offsetX, mouseEvent.offsetY);

    },



    /* GAME FUNCTIONS */

    func_loadGame: function () {

        if (audioStatus) game.audio.beepSound.play();

        if (mapPosition <= 4) gameType.preload();
        else endScreen.preload();

    },

};

// ENDING SCREEN: animation after a full level is completed
const endScreen = {

    preload: function () {

        document.body.style.cursor = "auto";
        game.loop.stop();
        game.event.clear();
        game.animation.clear();

        self = this;

        // NOTHING TO LOAD HERE
        endScreen.create();

    },

    create: function () {

        game.render.clear();
        self.preAnimate = false;
        self.animate = true;

        // Background color
        game.add.graphic.rect(0, 0, 900, 600, undefined, 0, colors.blueBckg, 1);

        // Background
        game.add.image(0, 0, 'bgimage');

        //Clouds
        game.add.image(300, 100, 'cloud');
        game.add.image(660, 80, 'cloud');
        game.add.image(110, 85, 'cloud', 0.8);

        //Floor
        for (let i = 0; i < 9; i++) { game.add.image(i * 100, 501, 'floor'); }

        // Progress bar
        game.add.graphic.rect(660, 10, 4 * 37.5, 35, undefined, 0, colors.intenseGreen, 0.5); // progress
        game.add.graphic.rect(661, 11, 149, 34, colors.blue, 3, undefined, 1); // box
        game.add.text(820, 38, '100%', textStyles.h2_blue, 'left');
        game.add.text(650, 38, game.lang.difficulty + ' ' + gameDifficulty, textStyles.h2_blue, 'right');

        game.add.image(360, 545, 'tree4', 0.7).anchor(0, 1);

        // Level character
        switch (gameTypeString) {

            case 'circleOne':

                this.preAnimate = true;
                this.animate = false;

                //School
                game.add.image(600, 222, 'school', 0.7);

                //kid
                this.character = game.add.sprite(0, -152, 'kid_run', 0, 0.7);
                this.character.anchor(0.5, 0.5);
                this.character.animation = ['move', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 3];

                // balloon
                this.balloon = game.add.image(0, -260, 'balloon');
                this.balloon.anchor(0.5, 0.5);

                this.basket = game.add.image(0, -150, 'balloon_basket');
                this.basket.anchor(0.5, 0.5);

                break;

            case 'squareTwo':

                //School
                game.add.image(600, 222, 'school', 0.7);

                //kid
                this.character = game.add.sprite(0, 460, 'kid_run', 6, 0.7);
                this.character.anchor(0.5, 0.5);
                this.character.animation = ['move', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 3];

                break;

            case 'squareOne':

                //Farm
                game.add.image(650, 260, 'farm', 1.1);

                //tractor
                this.character = game.add.sprite(0, 490, 'tractor', 0, 0.7);
                this.character.anchor(0.5, 0.5);
                if (sublevelType == 'Plus') {
                    this.character.animation = ['move', [0, 1, 2, 3, 4], 4];
                } else {
                    this.character.curFrame = 10;
                    this.character.animation = ['move', [10, 11, 12, 13, 14], 4];
                }

                break;

        }

        if (this.animate) game.animation.play(this.character.animation[0]);

        game.add.image(30, 585, 'tree4', 0.85).anchor(0, 1);

        game.render.all();

        game.loop.start(this);

    },

    update: function () {

        // Balloon falling
        if (self.preAnimate) {

            if (self.character.y < 460) {

                self.balloon.y += 2;
                self.basket.y += 2;
                self.character.y += 2;

                self.balloon.x++;
                self.basket.x++;
                self.character.x++;

            } else {

                self.preAnimate = false;
                self.animate = true;
                game.animation.play(self.character.animation[0]);

            }

        }

        // character running
        if (self.animate) {

            if (self.character.x <= 700) {

                self.character.x += 2;

            } else {

                animate = false;
                completedLevels = 0;
                game.animation.stop(self.character.animation[0]);
                menuScreen.preload();

            }

        }

        game.render.all();

    },

};