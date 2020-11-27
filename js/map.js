/*
    let mapState = {
        create: function(){},
        update: function(){},
        ---------------------------- end of phaser functions
        func_loadGame: function(){},
    }

    let endState = {
        create: function(){},
        update: function(){},
        ---------------------------- end of phaser functions
    };
*/

// MAP SCREEN: game map where character advances as he passes a level
let mapState = {

    create: function () {

        // Background
        game.add.image(0, 40, 'bgmap');

        // Calls function that loads navigation icons
        iconSettings.func_addIcons(true, false,
            true, true, false,
            false, false,
            'difficulty', false);

        // Progress bar
        let percentText = completedLevels * 25;
        let percentBlocks = completedLevels;

        for (let p = 0; p < percentBlocks; p++) {
            let block = game.add.image(660 + p * 37.5, 10, 'block');
            block.scale.setTo(2.6, 1);
        }

        game.add.text(820, 10, percentText + '%', textStyles.subtitle2);
        game.add.text(650, 10, lang.difficulty + ' ' + levelDifficulty, textStyles.subtitle2).anchor.setTo(1, 0);
        game.add.image(660, 10, 'pgbar');

        // Road
        this.points = {
            'x': [90, 204, 318, 432, 546, 660],
            'y': [486, 422, 358, 294, 230, 166]
        };

        if (currentGameState == "gameSquareOne") {
            //Garage
            let garage = game.add.image(this.points.x[0], this.points.y[0], 'garage');
            garage.scale.setTo(0.4);
            garage.anchor.setTo(0.5, 1);
            //Farm
            let farm = game.add.image(this.points.x[5], this.points.y[5], 'farm');
            farm.scale.setTo(0.6);
            farm.anchor.setTo(0.1, 0.7);
        } else {
            //House
            let house = game.add.image(this.points.x[0], this.points.y[0], 'house');
            house.scale.setTo(0.7);
            house.anchor.setTo(0.7, 0.8);
            //School
            let school = game.add.image(this.points.x[5], this.points.y[5], 'school');
            school.scale.setTo(0.35);
            school.anchor.setTo(0.2, 0.7);
        }

        //Trees and Rocks

        const rocks = {
            'x': [156, 275, 276, 441, 452, 590, 712],
            'y': [309, 543, 259, 156, 419, 136, 316]
        }

        const r_types = [1, 1, 2, 1, 2, 2, 2];

        for (let i = 0; i < r_types.length; i++) {
            if (r_types[i] == 1) {
                let sprite = game.add.image(rocks.x[i], rocks.y[i], 'rock');
                sprite.scale.setTo(0.32);
                sprite.anchor.setTo(0.5, 0.95);
            } else if (r_types[i] == 2) {
                let sprite = game.add.image(rocks.x[i], rocks.y[i], 'birch');
                sprite.scale.setTo(0.4);
                sprite.anchor.setTo(0.5, 0.95);
            }
        }

        const trees = {
            'x': [105, 214, 354, 364, 570, 600, 740, 779],
            'y': [341, 219, 180, 520, 550, 392, 488, 286]
        }

        const t_types = [2, 4, 3, 4, 1, 2, 4, 4];

        for (let i = 0; i < t_types.length; i++) {
            const sprite = game.add.image(trees.x[i], trees.y[i], 'tree' + t_types[i]);
            sprite.scale.setTo(0.6);
            sprite.anchor.setTo(0.5, 0.95);
        }

        // Map positions
        for (let p = 1; p < this.points.x.length - 1; p++) {

            const aux = (p < mapPosition || (mapCanMove && p == mapPosition)) ? 'place_b' : 'place_a';
            const place = game.add.image(this.points.x[p], this.points.y[p], aux);
            place.anchor.setTo(0.5, 0.5);
            place.scale.setTo(0.3);

            const sign = game.add.image(this.points.x[p] - 20, this.points.y[p] - 60, 'sign');
            sign.anchor.setTo(0.5, 1);
            sign.scale.setTo(0.4);

            if (p > 0 && p < this.points.x.length - 1) {
                const text = game.add.text(this.points.x[p] - 23, this.points.y[p] - 84, p, textStyles.difficultyLabel);
                text.anchor.setTo(0.35, 0.5);
            }
        }

        if (currentGameState == "gameSquareOne") {
            this.character = game.add.sprite(this.points.x[mapPosition], this.points.y[mapPosition], 'tractor');

            if (sublevelType == 'Plus') {
                this.character.animations.add('walk', [0, 1, 2, 3, 4]);
                this.character.scale.setTo(0.5);
            } else {
                this.character.animations.add('walk', [5, 6, 7, 8, 9]);
                this.character.scale.setTo(-0.5, 0.5);
            }

            this.character.animations.play('walk', 5, true);

        } else {
            this.character = game.add.sprite(this.points.x[mapPosition], this.points.y[mapPosition], 'kid_run');
            this.character.animations.add('run');
            this.character.animations.play('run', 6, true);
            this.character.scale.setTo(0.5);
        }

        this.character.anchor.setTo(0.5, 1);
        this.character.angle -= 25;

        game.physics.arcade.enable(this.character);

        // Delay to next level
        this.count = 0;
        this.wait = 60;

    },

    update: function () {

        // Wait 2 seconds before moving or staring a game
        this.count++;
        if (this.count <= this.wait) return;

        if (!mapCanMove) {
            this.func_loadGame();
        }

        // If momevent is enabled, move to next point from actual
        if (mapCanMove) {
            game.physics.arcade.moveToXY(
                this.character,
                this.points.x[mapPosition + 1],
                this.points.y[mapPosition + 1],
                100
            );

            // I kid/tractor reached the end, stop movement
            if (Math.ceil(this.character.x) == this.points.x[mapPosition + 1] || Math.ceil(this.character.y) == this.points.y[mapPosition + 1]) {
                mapCanMove = false;
                mapPosition += 1; //Update position
            }
        }
    },

    //MapLoading function
    func_loadGame: function () {

        if (audioStatus) beepSound.play();

        if (mapPosition <= 4) game.state.start(currentGameState);
        else game.state.start('end');

    }

};

// ENDING SCREEN: animation after a full level is completed
let endState = {

    create: function () {

        // Background
        game.add.image(0, 0, 'bgimage');

        //Clouds
        game.add.image(300, 100, 'cloud');
        game.add.image(660, 80, 'cloud');
        game.add.image(110, 85, 'cloud').scale.setTo(0.8);

        //Floor
        for (let i = 0; i < 9; i++) {
            game.add.image(i * 100, 501, 'floor');
        }

        // Progress bar
        for (let p = 0; p < 5; p++) {
            let block = game.add.image(660 + p * 30, 10, 'block');
            block.scale.setTo(2, 1); //Scaling to double width
        }
        game.add.text(820, 10, '100%', textStyles.subtitle2);
        game.add.text(650, 10, lang.difficulty + ' ' + levelDifficulty, textStyles.subtitle2).anchor.setTo(1, 0);
        game.add.image(660, 10, 'pgbar');

        game.add.sprite(30, 280, 'tree4');
        game.add.sprite(360, 250, 'tree2');

        if (currentGameState == 'gameCircleOne') {

            //School and trees
            game.add.sprite(600, 222, 'school').scale.setTo(0.7);
            //kid
            this.kid = game.add.sprite(0, -152, 'kid_run');
            this.kid.anchor.setTo(0.5, 0.5);
            this.kid.scale.setTo(0.7);
            this.kid.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
            //globo
            this.balloon = game.add.sprite(0, -260, 'balloon');
            this.balloon.anchor.setTo(0.5, 0.5);
            this.basket = game.add.sprite(0, -150, 'balloon_basket');
            this.basket.anchor.setTo(0.5, 0.5);

        } else if (currentGameState == 'gameSquareTwo') {

            //School and trees
            game.add.sprite(600, 222, 'school').scale.setTo(0.7);
            //kid
            this.kid = game.add.sprite(0, 460, 'kid_run');
            this.kid.anchor.setTo(0.5, 0.5);
            this.kid.scale.setTo(0.7);
            this.kid.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);

            this.kid.animations.play('walk', 6, true);

        } else if (currentGameState == 'gameSquareOne') {

            //Farm and trees
            game.add.sprite(650, 260, 'farm').scale.setTo(1.1);
            //tractor
            this.tractor = game.add.sprite(0, 490, 'tractor');
            this.tractor.anchor.setTo(0.5, 0.5);
            this.tractor.scale.setTo(0.8);
            if (sublevelType == 'Plus') this.tractor.animations.add('tractor_run', [0, 1, 2, 3, 4]);
            else {
                this.tractor.animations.add('tractor_run', [5, 6, 7, 8, 9]);
                this.tractor.scale.x *= -1;
            }
            this.tractor.animations.play('tractor_run', 5, true);

        } else {
            if (debugMode) console.log("Error! Name of the game state is not valid!");
        }

    },

    update: function () {

        if (currentGameState == 'gameCircleOne') {

            if (this.kid.y >= 460) {
                this.kid.animations.play('walk', 6, true);
                if (this.kid.x <= 700) {
                    this.kid.x += 2;
                } else {
                    completedLevels = 0;
                    game.state.start('menu');
                }
            } else {
                this.balloon.y += 2;
                this.basket.y += 2;
                this.kid.y += 2;

                this.balloon.x += 1;
                this.basket.x += 1;
                this.kid.x += 1;
            }

        } else if (currentGameState == 'gameSquareTwo') {

            if (this.kid.x <= 700) {
                this.kid.x += 2;
            } else {
                completedLevels = 0;
                game.state.start('menu');
            }

        } else if (currentGameState == 'gameSquareOne') {

            if (this.tractor.x <= 700) {
                this.tractor.x += 2;
            } else {
                completedLevels = 0;
                game.state.start('menu');
            }

        } else {
            if (debugMode) console.log("Error! Name of the game state is not valid!");
        }

    },

}