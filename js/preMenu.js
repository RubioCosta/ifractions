
/*
    var langState = {
        create: function(){},
        --------------------------------------- end of phaser functions
        func_setLang: function(){} //calls loadState
    };
    
    var loadState = {
        preload: function(){},
        create: function(){} //calls nameState
        -------------------------------------- end of phaser functions
    };
        
    var nameState = {
        create: function(){},
        ------------------------------------------------ end of phaser functions
        func_checkEmptyName: function(){}
        func_savename: function(){} //calls menu.js -> menuState
    };

    var buttonSettings = {
        func_addButtons: function(_,_,_,_,_,_,_,_,_){},
        loadState: function(){}
    };
*/

// "choose language" screen

var langState = {

    create: function() {

    	// AUX

        var style = { font: '28px Arial', fill: '#00804d', align: 'center' };

		//AUDIO

        beepSound = game.add.audio('sound_beep');	// game sound
        okSound = game.add.audio('sound_ok'); 		// correct answer sound
        errorSound = game.add.audio('sound_error'); // wrong answer sound

    	//BACKGROUND

        game.stage.backgroundColor = '#cce5ff';
        
        // LANGUAGES

        //pt_BR
        var titlePT = game.add.text(this.game.world.centerX - 220, this.game.world.centerY - 180, 'FRAÇÕES  ', style);
        titlePT.anchor.setTo(1, 0.5);

        var flagPT = game.add.sprite(this.game.world.centerX - 120, this.game.world.centerY - 180, 'flag_BR');       
        flagPT.anchor.setTo(0.5, 0.5);
        flagPT.inputEnabled = true;
        flagPT.input.useHandCursor = true;
        flagPT.events.onInputDown.add(this.func_setLang,{lang:'pt_BR'});
        flagPT.events.onInputOver.add(function(){ flagPT.scale.setTo(1.05) });
        flagPT.events.onInputOut.add(function(){ flagPT.scale.setTo(1) });

        //it IT
		var titleIT = game.add.text(this.game.world.centerX - 220, this.game.world.centerY, 'FRAZIONI  ', style);
        titleIT.anchor.setTo(1, 0.5);
        
        var flagIT = game.add.sprite(this.game.world.centerX - 120, this.game.world.centerY, 'flag_IT');       
        flagIT.anchor.setTo(0.5, 0.5);
        flagIT.inputEnabled = true;
        flagIT.input.useHandCursor = true;
        flagIT.events.onInputDown.add(this.func_setLang,{lang:'it_IT'});
        flagIT.events.onInputOver.add(function(){ flagIT.scale.setTo(1.05) });
        flagIT.events.onInputOut.add(function(){ flagIT.scale.setTo(1) });

        //en_US
        var titleEN = game.add.text(this.game.world.centerX - 220, this.game.world.centerY + 180, 'FRACTIONS  ', style);
        titleEN.anchor.setTo(1, 0.5);
        
        var flagEN = game.add.sprite(this.game.world.centerX - 120, this.game.world.centerY + 180, 'flag_US');       
        flagEN.anchor.setTo(0.5, 0.5);
        flagEN.inputEnabled = true;
        flagEN.input.useHandCursor = true;
        flagEN.events.onInputDown.add(this.func_setLang,{lang:'en_US'});
        flagEN.events.onInputOver.add(function(){ flagEN.scale.setTo(1.05) });
        flagEN.events.onInputOut.add(function(){ flagEN.scale.setTo(1) });

		//es_PE
        var titleES = game.add.text(this.game.world.centerX + 200, this.game.world.centerY - 100, 'FRACCIONES  ', style);
        titleES.anchor.setTo(1, 0.5);
        
        var flagES = game.add.sprite(this.game.world.centerX + 300, this.game.world.centerY - 100, 'flag_PE');       
        flagES.anchor.setTo(0.5, 0.5);
        flagES.inputEnabled = true;
        flagES.input.useHandCursor = true;
        flagES.events.onInputDown.add(this.func_setLang,{lang:'es_PE'});
        flagES.events.onInputOver.add(function(){ flagES.scale.setTo(1.05) });
        flagES.events.onInputOut.add(function(){ flagES.scale.setTo(1) });

        //fr_FR
        var titleFR = game.add.text(this.game.world.centerX + 200, this.game.world.centerY + 100, 'FRACTIONS  ', style);
        titleFR.anchor.setTo(1, 0.5);
        
        var flagFR = game.add.sprite(this.game.world.centerX + 300, this.game.world.centerY + 100, 'flag_FR');       
        flagFR.anchor.setTo(0.5, 0.5);
        flagFR.inputEnabled = true;
        flagFR.input.useHandCursor = true;
        flagFR.events.onInputDown.add(this.func_setLang,{lang:'fr_FR'});
        flagFR.events.onInputOver.add(function(){ flagFR.scale.setTo(1.05) });
        flagFR.events.onInputOut.add(function(){ flagFR.scale.setTo(1) });

        
        
    },
    
    func_setLang: function(){

        //set language
        lang = this.lang;
        //start resource loading
        game.state.start('load');
    
    }

};

// "loading" screen and load json dictionary
var loadState = {
    
    preload: function() {
        
        // Displaying the progress bar
        var progressBar = game.add.sprite(game.world.centerX, game.world.centerY, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(progressBar);
        
        // Loading dictionary
        game.load.json('dictionary', 'assets/languages/'+lang+'.json');
        
    },

    create: function() {  

        // gets selected language from json
        lang = game.cache.getJSON('dictionary');
        
        if(firstTime==true){ // select language screen - first time opening ifractions
          firstTime = false;
          game.state.start('name'); // go to select name screen, then menu
        }else{			     // changing language during the game
          game.state.start('menu'); // go to menu
        }
    
    }

};

// "username" screen
var nameState = {

    create: function() {
                    
        // AUX

        var style = { font: '30px Arial', fill: '#00804d', align: 'center' };
        var styleName = { font: '44px Arial', fill: '#000000', align: 'center' };
        
        // title
        var title = game.add.text(this.game.world.centerX, this.game.world.centerY - 100, lang.insert_name, style);
        title.anchor.setTo(0.5);
        
		var errorEmptyName = game.add.text(this.game.world.centerX, this.game.world.centerY - 70, "", {font: '18px Arial', fill: '#330000', align: 'center'});
        errorEmptyName.anchor.setTo(0.5);

        // "READY" button
        var btn = game.add.graphics(this.game.world.centerX - 84, this.game.world.centerY + 70);
        btn.lineStyle(1, 0x293d3d);
        btn.beginFill(0x3d5c5c);
        btn.drawRect(0, 0, 168, 60);
        btn.alpha = 0.5;
        btn.endFill();

        btn.inputEnabled = true;
        btn.input.useHandCursor = true;
		btn.events.onInputDown.add(this.func_checkEmptyName,{errorEmptyName: errorEmptyName});
        btn.events.onInputOver.add(function(){ btn.alpha=0.4 });
        btn.events.onInputOut.add(function(){ btn.alpha=0.5 });
        
        var ready = game.add.text(this.game.world.centerX + 1, this.game.world.centerY + 102, lang.ready, { font: '34px Arial', fill: '#f0f5f5', align: 'center' });
        ready.anchor.setTo(0.5);      

        document.getElementById("text-field-div").style.visibility = "visible";
        document.getElementById("name_id").addEventListener('keypress', function(e){
            var keycode = e.keycode ? e.keycode : e.which; 
            //se apertar enter vai para ready, assim como o botão
            if(keycode == 13){
                nameState["func_checkEmptyName"]();
            }     
        });

    },
         
    func_checkEmptyName: function() {

        if(document.getElementById("name_id").value!=""){
          	nameState["func_savename"]();
			this.errorEmptyName.setText("");
        }else{
			this.errorEmptyName.setText(lang.empty_name);
        }

    },
              
    func_savename: function() {
        
        // saves the typed name on username variable
        username = document.getElementById("name_id").value;
        if(debugMode) console.log("user is" + username);        

        document.getElementById("text-field-div").style.visibility = "hidden";

        //clears the text field again
        document.getElementById("name_id").value = "";

		if(audioStatus){
	        beepSound.play();
    	}

        game.state.start('menu');
        
    }

};

var buttonSettings = {

    func_addButtons: function(left, right, b0Esq, b1Esq, b2Esq, b0Dir, b1Dir, phase, helpBtn){
        
        var m_info_right, m_info_left;
        var m_world, m_menu, m_back, m_help, m_audio;
        var xEsq = 10;
        var xDir = (game.world.width - 50 - 10);
        
        if(left == 1){
            m_info_left = game.add.text(xEsq, 53, "", { font: "20px Arial", fill: "#330000", align: "center" });
        }

        if(right == 1){
            m_info_right = game.add.text(xDir+50, 53, "", { font: "20px Arial", fill: "#330000", align: "right" });
            m_info_right.anchor.setTo(1,0.02);
        }

        //left buttons
        if(b0Esq == 1){
            // Return to diffculty
            m_back = game.add.sprite(xEsq, 10, 'back'); 
            m_back.inputEnabled = true;
            m_back.input.useHandCursor = true;
            m_back.events.onInputDown.add(this.loadState, {state: phase, beep: beepSound});
            m_back.events.onInputOver.add(function(){ m_info_left.text = lang.menu_back});
            m_back.events.onInputOut.add(function(){ m_info_left.text = ""});
            
            xEsq+=50;
        }

        if(b1Esq == 1){
            // Return to menu button
            m_list = game.add.sprite(xEsq, 10, 'list'); 
            m_list.inputEnabled = true;
            m_list.input.useHandCursor = true;
            m_list.events.onInputDown.add(this.loadState, {state: "menu", beep: beepSound});
            m_list.events.onInputOver.add(function(){ m_info_left.text = lang.menu_list});
            m_list.events.onInputOut.add(function(){ m_info_left.text = ""});
            
            xEsq+=50;
        }

        if(b2Esq == 1){
            // Help button
            m_help = game.add.sprite(xEsq, 10, 'help');
            m_help.inputEnabled = true;
            m_help.input.useHandCursor = true;
            m_help.events.onInputDown.add(helpBtn, {beep: beepSound});
            m_help.events.onInputOver.add(function(){ m_info_left.text = lang.menu_help});
            m_help.events.onInputOut.add(function(){ m_info_left.text = ""});
            
            xEsq+=50;
        }

        //rightButtons
        if(b0Dir == 1){
            m_audio = game.add.sprite(xDir, 10, 'audio');
            audioStatus ? m_audio.frame = 0 : m_audio.frame = 1;
            m_audio.inputEnabled = true;
            m_audio.input.useHandCursor = true;
            m_audio.events.onInputDown.add(function(){ if(audioStatus){ audioStatus=false; m_audio.frame = 1; }else{ audioStatus=true; m_audio.frame = 0; }});
            m_audio.events.onInputOver.add(function(){ m_info_right.text = lang.audio });
            m_audio.events.onInputOut.add(function(){ m_info_right.text = "" });

            xDir-=50;
        }

        if(b1Dir == 1){
            // Return to language button
            m_world = game.add.sprite(xDir, 10, 'world'); 
            m_world.inputEnabled = true;
            m_world.input.useHandCursor = true;
            m_world.events.onInputDown.add(this.loadState, {state: "language", beep: beepSound});
            m_world.events.onInputOver.add(function(){ m_info_right.text = lang.menu_world });
            m_world.events.onInputOut.add(function(){ m_info_right.text = "" });
                  
            xDir-=50;
        }

    },

    loadState: function(){

        if(audioStatus){
            this.beep.play();
        }
        game.state.start(this.state);
    
    }

};