// MENU SCREEN: main menu of the game where the user can select the level he wants to play
const menuScreen = {

    preload: function () {

        document.body.style.cursor = "auto";
        game.loop.stop();
        game.event.clear();
        game.animation.clear();

        self = this;

        // LOADING MEDIA
        game.load.image(game.url.menu.image);

    },

    create: function () {
        game.render.clear();

        // Background color
        game.add.graphic.rect(0, 0, 900, 600, undefined, 0, colors.blueBckg, 1);

        // Adds floor
        for (let i = 0; i < defaultWidth / 100; i++) {
            game.add.image(i * 100, 501, 'floor');
        }

        // LABELS

        // Adds Overtitle: Welcome, <player name>!
        game.add.text(defaultWidth / 2, 40, game.lang.welcome + ", " + playerName + "!", textStyles.overtitle);

        // Adds Title : Select a game
        game.add.text(defaultWidth / 2, 80, game.lang.menu_title, textStyles.title1);

        // Adds Subtitle : <game mode> 
        this.lbl_game = game.add.text(defaultWidth / 2, 110, "", textStyles.subtitle1);

        // ICONS

        // Calls function that loads navigation icons
        navigationIcons.func_addIcons(false, false, false,
            true, true,
            false, false);

        // GAME LEVELS BUTTONS

        // Base coordinates for level buttons
        let x = -350; // First column
        let y = -70; // Top line

        menuScreen.menuObjList = [];

        for (let i in game.url.menu.image) {

            // Adds level buttons
            //try {
            this.menuObjList[i] = game.add.image(defaultWidth / 2 + x, defaultHeight / 2 + y, 'game' + i);
            this.menuObjList[i].anchor(0.5, 0.5);
            this.menuObjList[i].levelType = game.url.menu.image[i][3];
            this.menuObjList[i].gameShape = game.url.menu.image[i][2];
            //}catch (e) { console.log("Erro:",e)}
            // Refreshes coordinates for next button
            if (i % 2 == 0) y = 90; // The next will be at the bottom line
            else {
                y = -70; // The next will be at the top line
                x += 235; // The next will be at the next column
            }

        }

        game.event.add("click", menuScreen.func_onInputDown);
        game.event.add("mousemove", menuScreen.func_onInputOver);

        game.render.all();

    },



    /* EVENT HANDLER*/

    func_onInputDown: function (mouseEvent) {

        const x = mouseEvent.offsetX;
        const y = mouseEvent.offsetY;

        for (let i in menuScreen.menuObjList) {

            const cur = menuScreen.menuObjList[i];

            const valid = y >= cur.yWithAnchor && y <= (cur.yWithAnchor + cur.height * cur.scaleHeight) &&
                (x >= cur.xWithAnchor && x <= (cur.xWithAnchor + cur.width * cur.scaleWidth));

            if (valid) {
                menuScreen.func_loadGame(game.url.menu.image[i][3], game.url.menu.image[i][2]);
                break;
            }
        }

        navigationIcons.func_onInputDown(x, y);

    },

    func_onInputOver: function (mouseEvent) {

        const x = mouseEvent.offsetX;
        const y = mouseEvent.offsetY;
        let flag = false;

        menuScreen.menuObjList.forEach(cur => {

            const valid = y >= cur.yWithAnchor && y <= (cur.yWithAnchor + cur.height * cur.scaleHeight) &&
                (x >= cur.xWithAnchor && x <= (cur.xWithAnchor + cur.width * cur.scaleWidth));

            if (valid) {
                flag = true;
                cur.scaleWidth = cur.scaleHeight = 1.05;
                menuScreen.func_showTitle(cur.levelType, cur.gameShape);
            } else {
                cur.scaleWidth = cur.scaleHeight = 1;
            }

        });

        if (!flag) {
            menuScreen.func_clearTitle();
        }

        navigationIcons.func_onInputOver(x, y);

        game.render.all();

    },



    /* GAME FUNCTIONS */

    //calls the selected game menu screen
    func_loadGame: function (level, shape) {

        if (audioStatus) game.audio.beepSound.play();

        gameShape = shape;
        levelType = level;

        if (levelType == "C") gameTypeString = gameShape.toLowerCase() + "Two";
        else gameTypeString = gameShape.toLowerCase() + "One";

        switch (gameTypeString) {
            case 'squareOne': gameType = squareOne; break;
            case 'squareTwo': gameType = squareTwo; break;
            case 'circleOne': gameType = circleOne; break;
            default: console.error("Game error: the name of the game is not valid");
        }

        if (debugMode) console.log("Game State: " + gameTypeString + ", " + levelType);

        // Calls level difficulty screen
        difficultyScreen.preload();

    },

    func_showTitle: function (levelType, gameShape) {

        let title = "", type = "";

        if (levelType == 'A') type = "I";
        else if (levelType == 'B') type = "II";
        else if (levelType == 'C') type = "III";

        if (gameShape == "Circle") title += game.lang.circle_name;
        else if (gameShape == "Square") title += game.lang.square_name;

        if (type != "") title += " " + type;

        // Shows level title on the label
        menuScreen.lbl_game.name = title;

        document.body.style.cursor = "pointer";

    },

    func_clearTitle: function () {

        // Removes text from label
        menuScreen.lbl_game.name = "";

        document.body.style.cursor = "auto";
    }

};
