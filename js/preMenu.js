/*
    let langState = {
        create: function(){},
        -------------------------------------- end of phaser functions
        func_setLang: function(){} //calls loadState
    };
    
    let loadState = {
        preload: function(){},
        create: function(){} //calls nameState
        -------------------------------------- end of phaser functions
    };
        
    let nameState = {
        create: function(){},
        -------------------------------------- end of phaser functions
        func_checkEmptyName: function(){}
        func_saveName: function(){}
    };
*/

// LANGUAGE SCREEN: the player can choose a preferred language for the game text to be displayed
let langState = {

    create: function () {

        // Sets stage width back to default (if we are back from 'menu' state where it can be changed) 
        if (this.game.world.width != defaultWidth) this.game.world.setBounds(0, 0, defaultWidth, this.game.world.height);
        
        // Parameters for the elements on the screen
        const langs = {
            text: ['FRAÇÕES  ', 'FRAZIONI  ', 'FRACTIONS  ', 'FRACCIONES  ', 'FRACTIONS  '], // Language names
            flag: ['flag_BR'  , 'flag_IT'   , 'flag_US'    , 'flag_PE'     , 'flag_FR'    ], // Icon names
            lang: ['pt_BR'    , 'it_IT'     , 'en_US'      , 'es_PE'       , 'fr_FR'      ], // Parameters sent for language object
            x: [-220, -220, -220,  200, 200],
            y: [-180,    0,  180, -100, 100]
        }

        // Create elements on screen  
        for (let i = 0, length = langs.lang.length; i < length; i++) {

            // Add text for language names
            const language = game.add.text(this.game.world.centerX + langs.x[i], this.game.world.centerY + langs.y[i], langs.text[i], textStyles.title2);
            language.anchor.setTo(1, 0.5);

            // Add icons for flags
            const flag = game.add.sprite(this.game.world.centerX + langs.x[i] + 100, this.game.world.centerY + langs.y[i], langs.flag[i]);
            flag.anchor.setTo(0.5, 0.5);
            flag.inputEnabled = true;
            flag.input.useHandCursor = true;
            flag.events.onInputDown.add(this.func_setLang, { langs_lang: langs.lang[i] });
            flag.events.onInputOver.add(function () { this.flag.scale.setTo(1.05) }, { flag: flag });
            flag.events.onInputOut.add(function () { this.flag.scale.setTo(1) }, { flag: flag });
        
        }

    },

    // Calls loading screen while loads language
    func_setLang: function () {
        // Saves language name e.g 'pt_BR'
        langString = this.langs_lang;
        // Calls loading screen
        game.state.start('load');
    }

};




// Loads selected language to be able to translate the game text
let loadState = {

    preload: function () {

        // Progress bar
		const progressBar = game.add.sprite(game.world.centerX, game.world.centerY, 'progressBar');
		progressBar.anchor.setTo(0.5, 0.5);
		game.load.setPreloadSprite(progressBar);

        // Loads json with language chosen by the player
        game.load.json('dictionary', 'assets/lang/' + langString + '.json');

    },

    create: function () {
 
        // object used to translate text
        lang = game.cache.getJSON('dictionary'); 
        
        if (debugMode) console.log("Language: " + langString);

        // Make sure to only ask for player name on the first time oppening the game
        if (this.firstTime == undefined) { 
            this.firstTime = false;
            game.state.start('name'); // first time opening ifractions ('language' >> 'name' >> 'menu')
        } else {
            game.state.start('menu'); // if changing language during the game ('language' >>>> 'menu')         
        }

    }

};




// NAME SCREEN: asks for player's name 
let nameState = {

    create: function () {

        // Set title and warning text

        const title = game.add.text(this.game.world.centerX, this.game.world.centerY - 100, lang.insert_name, textStyles.title1);
        title.anchor.setTo(0.5);

        this.warningEmptyName = game.add.text(this.game.world.centerX, this.game.world.centerY - 70, "", textStyles.overtitle);
        this.warningEmptyName.anchor.setTo(0.5);

        // Set 'ok' button that gets player's information
        
        const btn = game.add.graphics(this.game.world.centerX - 84, this.game.world.centerY + 70);
        btn.beginFill(colors.teal);
        btn.drawRect(0, 0, 168, 60);
        btn.alpha = 0.5;
        btn.endFill();
        btn.inputEnabled = true;
        btn.input.useHandCursor = true;
        btn.events.onInputDown.add(this.func_checkEmptyName);
        btn.events.onInputOver.add(function () { btn.alpha = 0.4 });
        btn.events.onInputOut.add(function () { btn.alpha = 0.5 });

        // Set button Text
        const ready = game.add.text(this.game.world.centerX + 1, this.game.world.centerY + 102, lang.ready, textStyles.buttonLabel);
        ready.anchor.setTo(0.5);

        // Makes text field visible
        document.getElementById("text-field").style.visibility = "visible";

        // Does the same as the button click when the player presses "enter"
        document.getElementById("name_id").addEventListener('keypress', function (e) {
            let keycode = e.keycode ? e.keycode : e.which;
            if (keycode == 13) nameState.func_checkEmptyName();
        });

    },

    func_checkEmptyName: function () {

        // If text field is empty displays error message
        if (document.getElementById("name_id").value == "") {
            nameState.warningEmptyName.setText(lang.empty_name);
        } else { // If text field is NOT empty calls function that saves the player's name
            nameState.func_saveName();
        }

    },

    func_saveName: function () {

        // Saves player's input in global variable 'playerName'
        playerName = document.getElementById("name_id").value;

        // Hides and clears text field
        document.getElementById("text-field").style.visibility = "hidden";
        document.getElementById("name_id").value = "";

        if (audioStatus) beepSound.play();

        if (debugMode) console.log("Username: " + playerName);

        // Calls 'menu' state
        game.state.start('menu');

    }

};