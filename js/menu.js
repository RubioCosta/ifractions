/*
    let menuState = {
        preload: function(){},
        create: function(){},
        ---------------------------- end of phaser functions
        func_loadGame: function(){},
        func_showTitle: function(){},
        func_clearTitle: function(){},
    }
*/

// MENU SCREEN: main menu of the game where the user can select the level he wants to play
let menuState = {

    preload: function () {
        for (let i = 0, menuIcons = media.menu('image'); i < menuIcons.length; i++) {
            game.load.image('game' + i, menuIcons[i][1]);
        }
    },

    create: function () {

        // SCREEN SETTINGS

        // The menu screen can hold up to 8 levels without needing a side scroller
        // If there are more than 8 levels, sets 'extraWidth'
        if (media.menu('image').length > 8) {
            const aux = media.menu('image').length - 8;
            this.extraWidth = (aux % 2 == 0) ? (aux / 2) * 235 : ((aux + 1) / 2) * 235; // Each extra column holds 2 levels 
        } else {
            this.extraWidth = 0;
        }

        // Refreshes stage size to have the 'extraWidth' if necessary (visible part of the screen remains the default)
        this.game.world.setBounds(0, 0, this.game.world.width + this.extraWidth, this.game.world.height);

        // LABELS

        // Adds Overtitle: Welcome, <player name>!
        this.player_info = game.add.text(this.game.world.centerX - this.extraWidth / 2, 40, lang.welcome + ", " + playerName + "!", textStyles.overtitle);
        this.player_info.anchor.setTo(0.5, 0.5);

        // Adds Title : Select a game
        this.title = game.add.text(this.game.world.centerX - this.extraWidth / 2, 80, lang.menu_title, textStyles.title1);
        this.title.anchor.setTo(0.5, 0.5);

        // Adds Subtitle : <game mode> 
        this.lbl_game = game.add.text(this.game.world.centerX - this.extraWidth / 2, 110, "", textStyles.subtitle1);
        this.lbl_game.anchor.setTo(0.5, 0.5);

        // ICONS

        // Calls function that loads navigation icons
        iconSettings.func_addIcons(false, true,
            false, false, false,
            true, true,
            false, false);

        // BACKGROUND

        // Adds floor
        for (let i = 0, width = this.game.world.width; i < width / 100; i++) {
            game.add.image(i * 100, 501, 'floor');
        }

        // GAME LEVELS BUTTONS

        // Base coordinates for level buttons
        let x = -350; // First column
        let y = -70; // Top line
        const menuObjList = [];

        for (let i = 0, length = media.menu('image').length; i < length; i++) {
            // Adds level buttons
            menuObjList[i] = game.add.sprite(defaultWidth / 2 + x, this.game.world.centerY + y, 'game' + i);
            menuObjList[i].anchor.setTo(0.5, 0.5);
            // Events
            menuObjList[i].inputEnabled = true;
            menuObjList[i].input.useHandCursor = true;
            menuObjList[i].events.onInputDown.add(this.func_loadGame, { levelType: media.menu('image')[i][3], shape: media.menu('image')[i][2], game: this.game, extraWidth: this.extraWidth });
            menuObjList[i].events.onInputOver.add(this.func_showTitle, { levelType: media.menu('image')[i][3], shape: media.menu('image')[i][2], menu: menuObjList[i], lbl_game: this.lbl_game });
            menuObjList[i].events.onInputOut.add(this.func_clearTitle, { menu: menuObjList[i], lbl_game: this.lbl_game });
            // Refreshes coordinates for next button
            if (i % 2 == 0) {
                y = 90; // The next will be at the bottom line
            } else {
                y = -70; // The next will be at the top line
                x += 235; // The next will be at the next column
            }
        }

        // TURNING 'MOUSE INPUT CAPTURE' ON TO MANAGE PAGE SCROLL
        this.input.mouse.capture = true;

    },

    // MANAGES SIDE SCROLLING
    update: function () {

        // On mouse release calls function
        if (this.input.activePointer.leftButton.isUp) {
            this.inputUp();
        }

        // On mouse click calls function
        if (this.input.activePointer.leftButton.isDown) {
            this.inputDown();
        }

        // If true side scrolls
        if (this.isCameraMoving) {
            // 'this.camera' is a shorthand for 'World.camera'
            this.camera.x += (this.inputStartPosition.x - this.input.activePointer.x) / 10;

            const move = (this.game.world.centerX - this.extraWidth / 2) + this.camera.x;;
            // Elements that appear fixed in the screen
            this.title.x = move;
            this.lbl_game.x = move;
            this.player_info.x = move;
            iconSettings.func_refreshRightIcons_x((defaultWidth) + this.camera.x);
        }

    },

    // ON RELEASE
    inputUp: function () {
        this.isCameraMoving = false;
    },

    // ON CLICK
    inputDown: function () {
        if (!this.isCameraMoving) {
            this.inputStartPosition = new Phaser.Point(this.input.activePointer.x, this.input.activePointer.y);
        }
        // Allows side scrolling to be checked as true
        this.isCameraMoving = true;
    },

    //calls the selected game menu screen
    func_loadGame: function () {

        // Sets stage width back to default
        this.game.world.setBounds(0, 0, defaultWidth, this.game.world.height);

        if (audioStatus) sound.beepSound.play();

        levelShape = this.shape;
        levelType = this.levelType;

        if (levelType == "C") currentGameState = "game" + levelShape + "Two";
        else currentGameState = "game" + levelShape + "One";

        if (debugMode) console.log("Game State: " + currentGameState + ", " + levelType);

        // Calls level difficulty screen
        game.state.start('difficulty');

    },

    func_showTitle: function () {

        let title = "", type = "";

        if (this.levelType == 'A') type = "I";
        else if (this.levelType == 'B') type = "II";
        else if (this.levelType == 'C') type = "III";

        if (this.shape == "Circle") title += lang.circle_name;
        else if (this.shape == "Square") title += lang.square_name;

        if (type != "") title += " " + type;

        // Shows level title on the label
        this.lbl_game.text = title;
        // Increases size of button when mouse is on top of it
        this.menu.scale.setTo(1.05);

    },

    func_clearTitle: function () {

        // Removes text from label
        this.lbl_game.text = "";
        // changes button size back to default
        this.menu.scale.setTo(1);

    }

};
