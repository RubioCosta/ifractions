// DIFFICULTY SCREEN: player can select (I) sublevel type, (II) game difficulty and (III) turn on/off fractions labels
const difficultyScreen = {

    preload: function () {

        document.body.style.cursor = "auto";
        game.loop.stop();
        game.event.clear();
        game.animation.clear();

        self = this;

        // LOADING MEDIA
        game.load.sprite(game.url[gameTypeString].sprite);
        game.load.image(game.url[gameTypeString].image);

    },

    create: function () {

        game.render.clear();

        // Background color
        game.add.graphic.rect(0, 0, 900, 600, colors.white, 0, colors.blueBckg, 1);

        // Calls function that loads navigation icons
        navigationIcons.func_addIcons(false, true, false,
            true, false,
            false, false);

        // Title
        game.add.text(defaultWidth / 2, 40, game.lang.game_menu_title, textStyles.title2);

        // Icon that turns fraction labels ON/OFF
        if (gameTypeString != 'squareTwo') {

            const frame = (fractionLabel) ? 1 : 0;

            // Text : 'with/without' labeling the fractions
            this.labelText = game.add.text(defaultWidth / 2 - 100, 105, "", textStyles.subtitle2l);
            this.labelText.name = fractionLabel ? game.lang.with_name + " " + game.lang.label_name : game.lang.without_name + " " + game.lang.label_name;
            // Selection box
            this.selectionBox = game.add.sprite(defaultWidth / 2 - 110 - 30, 75, 'select', frame, 0.12);
        }

        // SETTING DIFFICULTY LEVELS (STAIR)

        this.stairs = [];

        const maxStairHeight = 120;  // Maximum height of the stairs        

        let stairHeight;    // Height growth of a stair
        let stairWidth;     // Width of the stairs

        let maxSublevel;    // number of sublevels
        let maxDifficulty;  // Number of difficulty stairs (in each sublevel)

        let xTheme;     // Start 'x' position of the illustrations on the left (theme: character/arrow/equalSign)
        let xStair;     // Start 'x' position of the stairs
        let xShape;     // Start 'x' position of the illustrations on the right (shapes)

        switch (gameTypeString) {
            case "squareOne":
                stairHeight = 40;
                stairWidth = 100;
                maxSublevel = 2;
                maxDifficulty = 3;
                xTheme = 180;
                xStair = 320;
                xShape = (xTheme / 2) + xStair + stairWidth * maxDifficulty;
                break;
            case "squareTwo":
            case "circleOne":
                stairHeight = 29;
                stairWidth = 85;
                maxSublevel = 3;
                maxDifficulty = 5;
                xTheme = 150;
                xStair = 240;
                xShape = (xTheme / 2) + xStair + stairWidth * maxDifficulty;
                break;
        }

        // Placing icons
        switch (gameTypeString) {

            case "squareOne":

                // Blue square
                game.add.graphic.rect(xShape, 175, 80, 40, colors.darkBlue, 2, colors.lightBlue, 1);
                // Red square
                game.add.graphic.rect(xShape, 330, 80, 40, colors.red, 2, colors.lightBlue, 1);

                // Green tractor
                game.add.sprite(xTheme + 30 - 50, 215 - 40, 'tractor', 1, 0.5);
                // Red tractor
                game.add.sprite(xTheme + 70 - 50, 370 - 41, 'tractor', 5, 0.5);

                // Plus Arrow
                game.add.image(xTheme + 100 - 20, 215 - 20, 'arrow_right', 0.3);
                // Minus Arrow
                game.add.image(xTheme - 20, 370 - 20, 'arrow_left', 0.3);

                break;

            case "circleOne":

                // Blue Circle
                game.add.graphic.circle(xShape, 175, 60, colors.darkBlue, 2, colors.lightBlue, 1);
                // Red Circle
                game.add.graphic.circle(xShape, 330, 60, colors.red, 2, colors.lightBlue, 1);
                // Blue and red circle
                game.add.graphic.circle(xShape - 30, 485, 60, colors.darkBlue, 2, colors.lightBlue, 1);
                game.add.graphic.circle(xShape + 40, 485, 60, colors.red, 2, colors.lightBlue, 1);

                // Kid plus
                game.add.sprite(xTheme, 195, 'kid_walk', 0, 0.6).anchor(0.5, 0.5);
                // Kid minus
                game.add.sprite(xTheme + 40, 350, 'kid_walk', 12, 0.6).anchor(0.5, 0.5);

                // Plus arrow
                game.add.image(xTheme + 40 - 20, 195, 'arrow_right', 0.35);
                // Minus arrow
                game.add.image(xTheme - 20, 350 - 20, 'arrow_left', 0.35);
                // Both plus and minus arrows
                game.add.image(xTheme + 20 - 30, 500 - 40, 'arrow_double', 0.5);

                break;

            case "squareTwo":

                // Equal sign
                game.add.image(xTheme - 40, 370 - 40, 'equal', 0.7);

                break;

        }

        const aux = {
            color: [colors.diffBlue, colors.diffRed, colors.diffPurple],
            y: [135, 285, 435],

            _sublevel: [['Plus', 'Minus', 'Mixed'], ['A', 'B', 'C']],
            get sublevel() { return (gameTypeString == 'squareTwo') ? this._sublevel[1] : this._sublevel[0]; },
        };

        // Placing difficulty 'stairs'
        for (let i_subl = 0; i_subl < maxSublevel; i_subl++) { // sublevel (vertical)

            for (let j_dif = 1; j_dif <= maxDifficulty; j_dif++) { // difficulty (horizontal)

                // Parameters
                const x = xStair + (stairWidth * (j_dif - 1));
                const y = aux.y[i_subl] + maxStairHeight - j_dif * stairHeight;
                const width = stairWidth;
                const height = stairHeight * j_dif;

                // Difficulty stairs
                const stair = game.add.graphic.rect(x, y, width, height, colors.blueBckg, 1, aux.color[i_subl], 1);
                stair.difficulty = j_dif;
                stair.sublevelType = aux.sublevel[i_subl];

                this.stairs.push(stair);

                // Labels
                const xLabel = x + stairWidth / 2;
                const yLabel = y + (stairHeight * j_dif) / 2 + 10;
                game.add.text(xLabel, yLabel, j_dif, textStyles.difficultyLabel);

            }
        }

        game.event.add('click', difficultyScreen.func_onInputDown);
        game.event.add('mousemove', difficultyScreen.func_onInputOver);

        game.render.all();

    },



    /* EVENT HANDLER */

    func_onInputDown: function (mouseEvent) {

        const x = mouseEvent.offsetX;
        const y = mouseEvent.offsetY;

        // check if turned labels ON/OFF
        if (gameTypeString != 'squareTwo') {

            const cur = difficultyScreen.selectionBox;

            const valid = y >= cur.yWithAnchor && y <= (cur.yWithAnchor + cur.height * cur.scaleHeight) &&
                (x >= cur.xWithAnchor && x <= (cur.xWithAnchor + cur.width * cur.scaleWidth));

            if (valid) difficultyScreen.func_setLabel(cur, difficultyScreen.labelText);

        }

        // check difficulty stairs
        difficultyScreen.stairs.forEach((cur) => {

            const valid = y >= cur.yWithAnchor && y <= (cur.yWithAnchor + cur.height * cur.scaleHeight) &&
                (x >= cur.xWithAnchor && x <= (cur.xWithAnchor + cur.width * cur.scaleWidth));

            if (valid) {
                game.event.clear(self);
                difficultyScreen.func_loadMap(cur.difficulty, cur.sublevelType);
            }
        });

        navigationIcons.func_onInputDown(x, y);

    },

    func_onInputOver: function (mouseEvent) {

        const x = mouseEvent.offsetX;
        const y = mouseEvent.offsetY;
        const flag = [false, false];

        // check difficulty stairs
        difficultyScreen.stairs.forEach((cur) => {

            const valid = y >= cur.yWithAnchor && y <= (cur.yWithAnchor + cur.height * cur.scaleHeight) &&
                (x >= cur.xWithAnchor && x <= (cur.xWithAnchor + cur.width * cur.scaleWidth));

            if (valid) {
                flag[0] = true;
                cur.alpha = 0.5;
            } else {
                cur.alpha = 1;
            }
        });

        if (gameTypeString != 'squareTwo') {

            const cur = difficultyScreen.selectionBox;

            const valid = y >= cur.yWithAnchor && y <= (cur.yWithAnchor + cur.height * cur.scaleHeight) &&
                (x >= cur.xWithAnchor && x <= (cur.xWithAnchor + cur.width * cur.scaleWidth));

            if (valid) {
                flag[1] = true;
            }
        }

        if (flag[0] || flag[1]) document.body.style.cursor = "pointer";
        else document.body.style.cursor = "auto";

        navigationIcons.func_onInputOver(x, y);

        game.render.all();

    },


    /* GAME FUNCTIONS */

    // Calls map state
    func_loadMap: function (stairDifficulty, stairSublevelType) {

        if (audioStatus) game.audio.beepSound.play();

        mapPosition = 0;   //Map position
        mapMove = true;       //Move no next point
        gameDifficulty = stairDifficulty;  // difficulty for selected level (1..3 or 1..5)
        sublevelType = stairSublevelType;   //Type of game
        completedLevels = 0;       //reset the game progress when entering a new level

        mapScreen.preload();

    },

    func_setLabel: function (selectionBox, selectionLabel) {

        if (fractionLabel) {

            fractionLabel = false;
            selectionBox.curFrame = 0;
            selectionLabel.name = game.lang.without_name + " " + game.lang.label_name;

        } else {

            fractionLabel = true;
            selectionBox.curFrame = 1;
            selectionLabel.name = game.lang.with_name + " " + game.lang.label_name;

        }

        if (audioStatus) game.audio.beepSound.play();

        game.render.all();
    }

};