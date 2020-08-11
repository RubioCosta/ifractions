/*
    let langState = {
        create: function(){},
        --------------------------------------- end of phaser functions
        func_setLang: function(){} //calls loadState
    };
    
    let loadState = {
        preload: function(){},
        create: function(){} //calls nameState
        -------------------------------------- end of phaser functions
    };
        
    let nameState = {
        create: function(){},
        ------------------------------------------------ end of phaser functions
        func_checkEmptyName: function(){}
        func_saveName: function(){} //calls menu.js -> menuState
    };

    let iconSettings = {
        func_addIcons: function(_,_,_,_,_,_,_,_,_){},
        func_callState: function(){}
    };
*/

// LANGUAGE SCREEN: the player can choose a preferred language for the game text to be displayed
let langState = {

    create: function() {

        // Sets stage width back to default if we are back from 'menu' state where it can be extended 
        if(this.game.world.width != defaultWidth) this.game.world.setBounds(0, 0, defaultWidth, this.game.world.height);

        game.stage.backgroundColor = '#cce5ff';
        
        // Preparing and setting language screen elements

        const langs = {
            list: [],
            text: ['FRAÇÕES  ', 'FRAZIONI  ',   'FRACTIONS  ',  'FRACCIONES  ', 'FRACTIONS  '],
            flag: ['flag_BR',   'flag_IT',      'flag_US',      'flag_PE',      'flag_FR'    ],
            lang: ['pt_BR',     'it_IT',        'en_US',        'es_PE',        'fr_FR'      ],
            x_text: [-220, -220, -220,  200, 200],
            x_flag: [-120, -120, -120,  300, 300],
            y:      [-180,    0,  180, -100, 100]
        }

        for(let i=0; i<langs.lang.length; i++){
            // Add text for language names
            const titleList = game.add.text(this.game.world.centerX + langs.x_text[i], this.game.world.centerY + langs.y[i], langs.text[i], textStyles.title2);
            titleList.anchor.setTo(1, 0.5);
            // Add images for flags
            langs.list[i] = game.add.sprite(this.game.world.centerX + langs.x_flag[i], this.game.world.centerY + langs.y[i], langs.flag[i]);       
            langs.list[i].anchor.setTo(0.5, 0.5);
            // Set event listener for the flags
            langs.list[i].inputEnabled = true;
            langs.list[i].input.useHandCursor = true;
            langs.list[i].events.onInputDown.add(this.func_setLang,{ langs_lang: langs.lang[i] });
            langs.list[i].events.onInputOver.add(function(){ this.langs_list.scale.setTo(1.05) },{ langs_list: langs.list[i] });
            langs.list[i].events.onInputOut.add( function(){ this.langs_list.scale.setTo(1)    },{ langs_list: langs.list[i] });
        }

    },
    
    // Calls loading screen while loads language
    func_setLang: function(){
        // Sets value of global 'langString' to chosen language name e.g 'pt_BR'
        langString = this.langs_lang;
        // Calls loading screen
        game.state.start('load');
    
    }

};

// LOADING SCREEN: shows loading bar while loads and sets json dictionary
let loadState = {
    
    preload: function() {

        let progressBar = game.add.sprite(game.world.centerX, game.world.centerY, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(progressBar);

        // Loads jason dictionary, setting the game language chosen by the player
        game.load.json('dictionary', 'assets/languages/'+langString+'.json');
        
    },

    create: function() {  

        // Set value of global 'lang' to json's dictionary 
        lang = game.cache.getJSON('dictionary');
        if(debugMode) console.log("language: " + langString); 
        
        if(this.firstTime == undefined){ // first time opening ifractions goes from 'language' to 'name' then 'menu' screens 
            this.firstTime = false;
            game.state.start('name');
        }else game.state.start('menu'); // if changing language during the game skips 'name' screen          
    
    }

};

// NAME SCREEN: asks for player's name 
let nameState = {

    create: function() {
          
        // Set title and error text

        const title = game.add.text(this.game.world.centerX, this.game.world.centerY - 100, lang.insert_name, textStyles.title);
        title.anchor.setTo(0.5);
        
        this.errorEmptyName = game.add.text(this.game.world.centerX, this.game.world.centerY - 70, "", textStyles.overtitle);
        this.errorEmptyName.anchor.setTo(0.5);

        // Set button that gets player's information
        
        let btn = game.add.graphics(this.game.world.centerX - 84, this.game.world.centerY + 70);
        btn.lineStyle(1, 0x293d3d);
        btn.beginFill(0x3d5c5c);
        btn.drawRect(0, 0, 168, 60);
        btn.alpha = 0.5;
        btn.endFill();

        btn.inputEnabled = true;
        btn.input.useHandCursor = true;
        btn.events.onInputDown.add(this.func_checkEmptyName);
        btn.events.onInputOver.add(function(){ btn.alpha=0.4 });
        btn.events.onInputOut.add(function(){ btn.alpha=0.5 });

        // Set button Text
        const ready = game.add.text(this.game.world.centerX + 1, this.game.world.centerY + 102, lang.ready, textStyles.buttonLabel);
        ready.anchor.setTo(0.5);      

        // Makes text field visible
        document.getElementById("text-field-div").style.visibility = "visible";
        
        // Does the same as the button click when the player presses "enter"
        document.getElementById("name_id").addEventListener('keypress', function(e){
            let keycode = e.keycode ? e.keycode : e.which; 
            if(keycode == 13) nameState.func_checkEmptyName();
        });

    },
         
    func_checkEmptyName: function() {

        // If text field is empty displays error message
        if(document.getElementById("name_id").value==""){ 
            nameState.errorEmptyName.setText(lang.empty_name);
        }else{ // If text field is NOT empty calls function that saves the player's name
            nameState.func_saveName();
        }

    },

    func_saveName: function() {
        
        // Saves player's input in global variable 'username'
        username = document.getElementById("name_id").value;
        if(debugMode) console.log("username: " + username);        

        // Hides and clears text field
        document.getElementById("text-field-div").style.visibility = "hidden";
        document.getElementById("name_id").value = "";

        if(audioStatus) beepSound.play();

        // Calls 'menu' state
        game.state.start('menu');
        
    }

};

// Control navigation icons on the top of the screens
let iconSettings = {

    // Add navigation icons on the top of the screen based the entered parameters
    func_addIcons: function(left_side, right_side, left_btn0, left_btn1, left_btn2, right_btn0, right_btn1, level, helpBtn){
        
        this.left_x = 10;
        this.right_x = defaultWidth - 50 - 10;

        // Labels for the navigation icons

        if(left_side){
            this.left_text = game.add.text(this.left_x, 53, "", textStyles.overtitle);
        }

        if(right_side){
            this.right_text = game.add.text(this.right_x+50, 53, "", textStyles.overtitle);
            this.right_text.anchor.setTo(1,0.02);
        }

        // Buttons on the LEFT side of the page

        if(left_btn0){ // Return to select difficulty screen
            this.icon_back = game.add.sprite(this.left_x, 10, 'back');
            // Events
            this.icon_back.inputEnabled = true;
            this.icon_back.input.useHandCursor = true;
            this.icon_back.events.onInputDown.add(this.func_callState, {state: level, beep: beepSound});
            this.icon_back.events.onInputOver.add(function(){ this.left_text.text = lang.menu_back},{left_text: this.left_text});
            this.icon_back.events.onInputOut.add(function(){ this.left_text.text = ""},{left_text: this.left_text});
            // Offsets value of x for next icon
            this.left_x += 50;
        }

        if(left_btn1){ // Return to main menu screen
            this.icon_list = game.add.sprite(this.left_x, 10, 'list');
            // Events
            this.icon_list.inputEnabled = true;
            this.icon_list.input.useHandCursor = true;
            this.icon_list.events.onInputDown.add(this.func_callState, {state: "menu", beep: beepSound});
            this.icon_list.events.onInputOver.add(function(){ this.left_text.text = lang.menu_list},{left_text: this.left_text});
            this.icon_list.events.onInputOut.add(function(){ this.left_text.text = ""},{left_text: this.left_text});
            // Offsets value of x for next icon
            this.left_x += 50;
        }

        if(left_btn2){ // In some levels, shows solution to the game
            this.icon_help = game.add.sprite(this.left_x, 10, 'help');
            // Events
            this.icon_help.inputEnabled = true;
            this.icon_help.input.useHandCursor = true;
            this.icon_help.events.onInputDown.add(helpBtn, {beep: beepSound});
            this.icon_help.events.onInputOver.add(function(){ this.left_text.text = lang.menu_help},{left_text: this.left_text});
            this.icon_help.events.onInputOut.add(function(){ this.left_text.text = ""},{left_text: this.left_text});
            // Offsets value of x for next icon
            this.left_x += 50;
        }

        // Buttons on the RIGHT side of the page

        if(right_btn0){ // Turns game audio on/off
            this.icon_audio = game.add.sprite(this.right_x, 10, 'audio');
            audioStatus ? this.icon_audio.frame = 0 : this.icon_audio.frame = 1;
            // Events
            this.icon_audio.inputEnabled = true;
            this.icon_audio.input.useHandCursor = true;
            this.icon_audio.events.onInputDown.add(function(){ if(audioStatus){ audioStatus=false; this.icon_audio.frame = 1; }else{ audioStatus=true; this.icon_audio.frame = 0; }},{icon_audio: this.icon_audio});
            this.icon_audio.events.onInputOver.add(function(){ this.right_text.text = lang.audio },{right_text: this.right_text});
            this.icon_audio.events.onInputOut.add(function(){ this.right_text.text = "" },{right_text: this.right_text});
            // Offsets value of x for next icon
            this.right_x -= 50;
        }

        if(right_btn1){ // Return to select language screen
            this.icon_world = game.add.sprite(this.right_x, 10, 'world'); 
            this.icon_world.inputEnabled = true;
            this.icon_world.input.useHandCursor = true;
            this.icon_world.events.onInputDown.add(this.func_callState, {state: "language", beep: beepSound});
            this.icon_world.events.onInputOver.add(function(){ this.right_text.text = lang.menu_world },{right_text : this.right_text});
            this.icon_world.events.onInputOut.add(function(){ this.right_text.text = "" },{right_text: this.right_text});
            // Offsets value of x for next icon
            this.right_x -= 50;
        }

    },

    // refresh values of x for icons when menu screen move sideways
    func_refreshRightIcons_x: function(newWidth){
        this.right_text.x = newWidth - 10;
        this.icon_audio.x = newWidth - 50 - 10;
        this.icon_world.x = newWidth - 50 - 50 - 10;
    },

    func_callState: function(){

        if(audioStatus) this.beep.play();
        
        game.state.start(this.state);
    
    }

};

let textStyles = {

    title:     { font: "32px Arial", fill: "#00804d", align: "center" }, // large green
    title2:    { font: "27px Arial", fill: "#00804d", align: "center" }, // medium green

    subtitle:  { font: "27px Arial", fill: "#003cb3", align: "center" }, // medium blue
    subtitle2: { font: "27px Arial", fill: "#000000", align: "center" }, // medium black
    subtitle3: { font: "30px Arial", fill: "#000000", align: "center" }, // black
    
    overtitle: { font: "20px Arial", fill: "#330000", align: "center" }, // small red-ish brown

    buttonLabel:     { font: '34px Arial', fill: '#f0f5f5', align: 'center' }, // almost white
    difficultyLabel: { font: '25px Arial', fill: '#ffffff', align: 'center' }, // white

    valueLabelBlue:     { font: '26px Arial', fill: '#000080', align: 'center' }, // blue
    valueLabelBlue3:    { font: '20px Arial', fill: '#000080', align: 'center' }, // blue
    valueLabelBlue2:    { font: '15px Arial', fill: '#000080', align: 'center' }, // blue

}

