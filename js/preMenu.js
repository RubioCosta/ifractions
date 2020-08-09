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
        func_addButtons: function(_,_,_,_,_,_,_,_,_){},
        loadState: function(){}
    };
*/

// Language screen: the player can choose a preferred language for the game text to be displayed
let langState = {

    create: function() {

        //
        if(this.game.world.width != defaultWidth) this.game.world.setBounds(0, 0, defaultWidth, this.game.world.height);

        const style = { font: '28px Arial', fill: '#00804d', align: 'center' };

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
            const titleList = game.add.text(this.game.world.centerX + langs.x_text[i], this.game.world.centerY + langs.y[i], langs.text[i], style);
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
    
    // Calls loading screen 
    func_setLang: function(){
        // Temporarily sets value of global 'lang' to chosen language
        lang = this.langs_lang;
        // Calls loading screen
        game.state.start('load');
    
    }

};

// Loading screen: shows loading bar while loads json dictionary
let loadState = {
    
    preload: function() {

        let progressBar = game.add.sprite(game.world.centerX, game.world.centerY, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(progressBar);

        // Loads jason dictionary, setting the game language chosen by the player
        game.load.json('dictionary', 'assets/languages/'+lang+'.json');
        
    },

    create: function() {  

        // Set value of global 'lang' to json's dictionary 
        lang = game.cache.getJSON('dictionary');
        
        // Set screens flow
        if(firstTime==true){ // first time opening ifractions goes from 'language' to 'name' screen then 'menu'
          firstTime = false;
          game.state.start('name'); 
        }else{               // changing language during the game skips 'name' screen
          game.state.start('menu');
        }
    
    }

};

// Name screen: Asks for player's name 
let nameState = {

    create: function() {
                    
        const style = { font: '30px Arial', fill: '#00804d', align: 'center' };
        
        // Set title and error text

        const title = game.add.text(this.game.world.centerX, this.game.world.centerY - 100, lang.insert_name, style);
        title.anchor.setTo(0.5);
        
        errorEmptyName = game.add.text(this.game.world.centerX, this.game.world.centerY - 70, "", {font: '18px Arial', fill: '#330000', align: 'center'});
        errorEmptyName.anchor.setTo(0.5);

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
        const ready = game.add.text(this.game.world.centerX + 1, this.game.world.centerY + 102, lang.ready, { font: '34px Arial', fill: '#f0f5f5', align: 'center' });
        ready.anchor.setTo(0.5);      

        // Makes text field visible
        document.getElementById("text-field-div").style.visibility = "visible";
        
        // Accepts "enter" as button click
        document.getElementById("name_id").addEventListener('keypress', function(e){
            let keycode = e.keycode ? e.keycode : e.which; 
            if(keycode == 13){
                nameState["func_checkEmptyName"]();
            }     
        });

    },
         
    func_checkEmptyName: function() {

        // If text field is NOT empty will call function that saves the player's name
        if(document.getElementById("name_id").value!=""){
            errorEmptyName.setText("");
            nameState["func_saveName"]();
        }else{
            errorEmptyName.setText(lang.empty_name); // Displays error message
        }

    },

    // Calls menu screen
    func_saveName: function() {
        
        // Saves player's input in global variable 'username'
        username = document.getElementById("name_id").value;
        if(debugMode) console.log("user is " + username);        

        // Hides and clears text field
        document.getElementById("text-field-div").style.visibility = "hidden";
        document.getElementById("name_id").value = "";

        if(audioStatus) beepSound.play();

        // Calls menu state
        game.state.start('menu');
        
    }

};

let iconSettings = {

    // Add navigation icons on the top of the page based the entered parameters
    func_addButtons: function(left_side, right_side, left_btn0, left_btn1, left_btn2, right_btn0, right_btn1, level, helpBtn){
        
        this.left_x = 10;
        this.right_x = defaultWidth - 50 - 10;

        // Labels for the navigation icons

        if(left_side){
            this.left_text = game.add.text(this.left_x, 53, "", 
                { font: "20px Arial", fill: "#330000", align: "center" });
        }

        if(right_side){
            this.right_text = game.add.text(this.right_x+50, 53, "", 
                { font: "20px Arial", fill: "#330000", align: "right" });
            this.right_text.anchor.setTo(1,0.02);
        }

        // Buttons on the left side of the page

        if(left_btn0){ // Return to select difficulty screen
            this.icon_back = game.add.sprite(this.left_x, 10, 'back'); 
            this.icon_back.inputEnabled = true;
            this.icon_back.input.useHandCursor = true;
            this.icon_back.events.onInputDown.add(this.loadState, {state: level, beep: beepSound});
            this.icon_back.events.onInputOver.add(function(){ this.left_text.text = lang.menu_back},{left_text: this.left_text});
            this.icon_back.events.onInputOut.add(function(){ this.left_text.text = ""},{left_text: this.left_text});
            
            this.left_x+=50;
        }

        if(left_btn1){ // Return to main menu screen
            this.icon_list = game.add.sprite(this.left_x, 10, 'list'); 
            this.icon_list.inputEnabled = true;
            this.icon_list.input.useHandCursor = true;
            this.icon_list.events.onInputDown.add(this.loadState, {state: "menu", beep: beepSound});
            this.icon_list.events.onInputOver.add(function(){ this.left_text.text = lang.menu_list},{left_text: this.left_text});
            this.icon_list.events.onInputOut.add(function(){ this.left_text.text = ""},{left_text: this.left_text});
            
            this.left_x+=50;
        }

        if(left_btn2){ // In some levels, shows solution to the game
            this.icon_help = game.add.sprite(this.left_x, 10, 'help');
            this.icon_help.inputEnabled = true;
            this.icon_help.input.useHandCursor = true;
            this.icon_help.events.onInputDown.add(helpBtn, {beep: beepSound});
            this.icon_help.events.onInputOver.add(function(){ this.left_text.text = lang.menu_help},{left_text: this.left_text});
            this.icon_help.events.onInputOut.add(function(){ this.left_text.text = ""},{left_text: this.left_text});
            
            this.left_x+=50;
        }

        // Buttons on the right side of the page

        if(right_btn0){ // Turns game audio on/off
            this.icon_audio = game.add.sprite(this.right_x, 10, 'audio');
            audioStatus ? this.icon_audio.frame = 0 : this.icon_audio.frame = 1;
            this.icon_audio.inputEnabled = true;
            this.icon_audio.input.useHandCursor = true;
            this.icon_audio.events.onInputDown.add(function(){ if(audioStatus){ audioStatus=false; this.icon_audio.frame = 1; }else{ audioStatus=true; this.icon_audio.frame = 0; }},{icon_audio: this.icon_audio});
            this.icon_audio.events.onInputOver.add(function(){ this.right_text.text = lang.audio },{right_text: this.right_text});
            this.icon_audio.events.onInputOut.add(function(){ this.right_text.text = "" },{right_text: this.right_text});

            this.right_x-=50;
        }

        if(right_btn1){ // Return to select language screen
            this.icon_world = game.add.sprite(this.right_x, 10, 'world'); 
            this.icon_world.inputEnabled = true;
            this.icon_world.input.useHandCursor = true;
            this.icon_world.events.onInputDown.add(this.loadState, {state: "language", beep: beepSound});
            this.icon_world.events.onInputOver.add(function(){ this.right_text.text = lang.menu_world },{right_text : this.right_text});
            this.icon_world.events.onInputOut.add(function(){ this.right_text.text = "" },{right_text: this.right_text});
                  
            this.right_x-=50;
        }

    },

    changeRightButtonX: function(newWidth){
        this.right_text.x = newWidth - 10;
        this.icon_audio.x = newWidth - 50 - 10;
        if(debugMode) console.log(this.icon_audio.x+" "+newWidth);
        this.icon_world.x = newWidth - 50 - 50 - 10;
    },


    loadState: function(){

        if(audioStatus){
            this.beep.play();
        }
        game.state.start(this.state);
    
    }

};