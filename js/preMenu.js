// Only called once
const boot = {

    preload: function () {

        info.start();

        document.body.style.cursor = "auto";
        game.loop.stop();
        game.event.clear();
        game.animation.clear();

        self = this;

        // LOADING MEDIA
        game.load.audio(url.boot.audio);
        game.load.image(url.boot.image);
        game.load.sprite(url.boot.sprite);

    },

    create: function () {
        // Calls first screen seen by the player
        langScreen.preload();
    }

};



// LANGUAGE SCREEN: the player can choose a preferred language for the game text to be displayed
const langScreen = {

    preload: function () {

        document.body.style.cursor = "auto";
        game.loop.stop();
        game.event.clear();
        game.animation.clear();

        self = this;

        // NOTHING TO LOAD HERE
        langScreen.create();

    },

    create: function () {

        game.render.clear();

        // Background color
        game.add.graphic.rect(0, 0, 900, 600, colors.white, 0, colors.blueBckg, 1);

        // Parameters for the elements on the screen
        langScreen.listOfFlags = [];

        langScreen.langs = {
            text: ['FRAÇÕES  ', 'FRAZIONI  ', 'FRACTIONS  ', 'FRACCIONES  ', 'FRACTIONS  '], // Language names
            flag: ['flag_BR', 'flag_IT', 'flag_US', 'flag_PE', 'flag_FR'], // Icon names
            lang: ['pt_BR', 'it_IT', 'en_US', 'es_PE', 'fr_FR'], // Parameters sent for language object
            x: [-220, -220, -220, 200, 200],
            y: [-180, 0, 180, -100, 100]
        };

        // Create elements on screen  
        for (let i in this.langs.flag) {

            // Add text for language names
            game.add.text(defaultWidth / 2 + this.langs.x[i], defaultHeight / 2 + this.langs.y[i], this.langs.text[i], textStyles.h2_green, 'right');

            // Add icons for flags
            const flag = game.add.image(defaultWidth / 2 + this.langs.x[i] + 100, defaultHeight / 2 + this.langs.y[i], this.langs.flag[i]);
            flag.anchor(0.5, 0.5);

            this.listOfFlags.push(flag);
        }

        game.event.add("click", this.func_onInputDown);
        game.event.add("mousemove", this.func_onInputOver);

        game.render.all();

    },



    /* EVENT HANDLER*/

    func_onInputDown: function (mouseEvent) {

        const x = mouseEvent.offsetX;
        const y = mouseEvent.offsetY;

        langScreen.listOfFlags.forEach(cur => {

            const valid = y >= cur.yWithAnchor && y <= (cur.yWithAnchor + cur.height * cur.scale) &&
                (x >= cur.xWithAnchor && x <= (cur.xWithAnchor + cur.width * cur.scale));

            if (valid) {
                for (let i in langScreen.langs.flag) {
                    if (langScreen.langs.flag[i] == cur.name) {
                        langScreen.func_setLang(self.langs.lang[i]);
                    }
                }
            }
        });
    },

    func_onInputOver: function (mouseEvent) {

        const x = mouseEvent.offsetX;
        const y = mouseEvent.offsetY;
        let flag = false;

        langScreen.listOfFlags.forEach(cur => {

            const valid = y >= cur.yWithAnchor && y <= (cur.yWithAnchor + cur.height * cur.scale) &&
                (x >= cur.xWithAnchor && x <= (cur.xWithAnchor + cur.width * cur.scale));

            if (valid) {
                flag = true;
                cur.scale = cur.scale = 1.05;
            } else {
                cur.scale = cur.scale = 1;
            }
        });

        if (flag) document.body.style.cursor = "pointer";
        else document.body.style.cursor = "auto";

        game.render.all();

    },



    /* GAME FUNCTIONS */

    // Calls loading screen while loads language
    func_setLang: function (selectedLang) {
        // Saves language name e.g 'pt_BR'
        langString = selectedLang;
        // Calls loading screen
        loadLang.preload();
    }

};



// Loads selected language to be able to translate the game text
const loadLang = {

    preload: function () {

        game.loop.stop();
        game.event.clear();
        game.animation.clear();

        self = this;

        // LOADING MEDIA : selected language
        game.load.lang('assets/lang/' + langString);

    },

    create: function () {

        if (debugMode) console.log("Language: " + langString);

        // Make sure to only ask for player name on the first time oppening the game
        if (this.firstTime == undefined) {
            this.firstTime = false;
            nameScreen.preload(); // first time opening ifractions ('language' >> 'name' >> 'menu')
        } else {
            menuScreen.preload(); // if changing language during the game ('language' >>>> 'menu')         
        }

    }

};



// NAME SCREEN: asks for player's name 
const nameScreen = {

    preload: function () {

        document.body.style.cursor = "auto";
        game.loop.stop();
        game.event.clear();
        game.animation.clear();

        self = this;

        // NOTHING TO LOAD HERE
        nameScreen.create();

    },

    create: function () {

        game.render.clear();

        // Background color
        game.add.graphic.rect(0, 0, 900, 600, colors.white, 0, colors.blueBckg, 1);

        // Set title and warning text

        game.add.text(defaultWidth / 2, defaultHeight / 2 - 100, game.lang.insert_name, textStyles.h1_green);

        this.warningEmptyName = game.add.text(defaultWidth / 2, defaultHeight / 2 - 70, "", textStyles.h4_brown);

        // Set 'ok' button that gets player's information
        this.okBtn = game.add.graphic.rect(defaultWidth / 2 - 84, defaultHeight / 2 + 70, 168, 60, undefined, 0, colors.gray, 0.6);

        // Set button Text
        game.add.text(defaultWidth / 2 + 1, defaultHeight / 2 + 112, game.lang.ready, textStyles.h1_white);

        // Makes text field visible
        document.getElementById("textbox").style.visibility = "visible";

        // Does the same as the button click when the player presses "enter"
        document.getElementById("textbox-content").addEventListener('keypress', function (e) {
            const keycode = e.key || e.code;
            if (keycode == 'Enter') {

                if (self.func_checkEmptyName()) self.func_saveName();

                game.render.all(); // can show empty name
            }
        });

        game.event.add("click", this.func_onInputDown);
        game.event.add("mousemove", this.func_onInputOver);

        game.render.all();

    },



    /* EVENT HANDLER*/

    func_onInputDown: function (mouseEvent) {

        const x = mouseEvent.offsetX;
        const y = mouseEvent.offsetY;

        const cur = self.okBtn;

        const valid = y >= cur.yWithAnchor && y <= (cur.yWithAnchor + cur.height * cur.scale) &&
            (x >= cur.xWithAnchor && x <= (cur.xWithAnchor + cur.width * cur.scale));

        if (valid) {

            if (self.func_checkEmptyName()) {

                self.func_saveName();

            }

        }

        game.render.all();
    },

    func_onInputOver: function (mouseEvent) {

        const x = mouseEvent.offsetX;
        const y = mouseEvent.offsetY;

        const cur = self.okBtn;

        const valid = y >= cur.yWithAnchor && y <= (cur.yWithAnchor + cur.height * cur.scale) &&
            (x >= cur.xWithAnchor && x <= (cur.xWithAnchor + cur.width * cur.scale));

        if (valid) {
            document.body.style.cursor = "pointer";
            cur.alpha = 0.4;
        } else {
            document.body.style.cursor = "auto";
            cur.alpha = 0.6;
        }

        game.render.all();

    },



    /* GAME FUNCTIONS */

    func_checkEmptyName: function () {

        // If text field is empty displays error message
        if (document.getElementById("textbox-content").value == "") {
            self.warningEmptyName.name = game.lang.empty_name;
            return false;
        }
        return true;

    },

    func_saveName: function () {

        // Saves player's input in global variable 'playerName'
        playerName = document.getElementById("textbox-content").value;

        // Hides and clears text field
        document.getElementById("textbox").style.visibility = "hidden";
        document.getElementById("textbox-content").value = "";

        if (audioStatus) game.audio.beepSound.play();

        if (debugMode) console.log("Username: " + playerName);

        // Calls 'menu' state
        menuScreen.preload();

    }

};