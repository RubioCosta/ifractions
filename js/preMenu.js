
var errorEmptyName;

/*
    var langState = {
        create: function(){},
        --------------------------------------- end of phaser functions
        setLang: function(){} //calls loadState
    };
    
    var loadState = {
        preload: function(){},
        create: function(){} //calls nameState
        -------------------------------------- end of phaser functions
    };
        
    var nameState = {
        create: function(){},
        ------------------------------------------------ end of phaser functions
        nameIsEmpty: function(){}
        ready: function(){} //calls menu.js -> menuState
    };

    var buttonSettings = {
        addButtons: function(_,_,_,_,_,_,_,_,_){},
        loadState: function(){}
    };
*/

// "choose language" screen
var langState = {

    create: function() {

        game.stage.backgroundColor = '#cce5ff';
        
        var style = { font: '28px Arial', fill: '#00804d', align: 'center' };

        //pt_BR
        var title1 = game.add.text(this.game.world.centerX - 220, this.game.world.centerY - 100, 'FRAÇÕES  ', style);
        title1.anchor.setTo(1, 0.5);
        var flag1 = game.add.sprite(this.game.world.centerX - 120, this.game.world.centerY - 100, 'flag_BR');       
        flag1.anchor.setTo(0.5, 0.5);
        flag1.inputEnabled = true;
        flag1.input.useHandCursor = true;
        flag1.events.onInputDown.add(this.setLang,{lang:'pt_BR'});
        flag1.events.onInputOver.add(function(){ flag1.scale.setTo(1.05) });
        flag1.events.onInputOut.add(function(){ flag1.scale.setTo(1) });

        //es_PE
        var title2 = game.add.text(this.game.world.centerX + 200, this.game.world.centerY - 100, 'FRACCIONES  ', style);
        title2.anchor.setTo(1, 0.5);
        var flag2 = game.add.sprite(this.game.world.centerX + 300, this.game.world.centerY - 100, 'flag_PE');       
        flag2.anchor.setTo(0.5, 0.5);
        flag2.inputEnabled = true;
        flag2.input.useHandCursor = true;
        flag2.events.onInputDown.add(this.setLang,{lang:'es_PE'});
        flag2.events.onInputOver.add(function(){ flag2.scale.setTo(1.05) });
        flag2.events.onInputOut.add(function(){ flag2.scale.setTo(1) });

        //en_US
        var title3 = game.add.text(this.game.world.centerX - 220, this.game.world.centerY + 100, 'FRACTIONS  ', style);
        title3.anchor.setTo(1, 0.5);
        var flag3 = game.add.sprite(this.game.world.centerX - 120, this.game.world.centerY + 100, 'flag_US');       
        flag3.anchor.setTo(0.5, 0.5);
        flag3.inputEnabled = true;
        flag3.input.useHandCursor = true;
        flag3.events.onInputDown.add(this.setLang,{lang:'en_US'});
        flag3.events.onInputOver.add(function(){ flag3.scale.setTo(1.05) });
        flag3.events.onInputOut.add(function(){ flag3.scale.setTo(1) });

        //fr_FR
        var title4 = game.add.text(this.game.world.centerX + 200, this.game.world.centerY + 100, 'FRACTIONS  ', style);
        title4.anchor.setTo(1, 0.5);
        var flag4 = game.add.sprite(this.game.world.centerX + 300, this.game.world.centerY + 100, 'flag_FR');       
        flag4.anchor.setTo(0.5, 0.5);
        flag4.inputEnabled = true;
        flag4.input.useHandCursor = true;
        flag4.events.onInputDown.add(this.setLang,{lang:'fr_FR'});
        flag4.events.onInputOver.add(function(){ flag4.scale.setTo(1.05) });
        flag4.events.onInputOut.add(function(){ flag4.scale.setTo(1) });
        
    },
    
    setLang: function(){

        //set language
        lang = this.lang;
        //start resource loading
        game.state.start('load');

    }

};

// "loading" screen
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
        audio_lang_aux = lang.audio_on;
        if(!nameStatus){
        	nameStatus = true;
        	game.state.start('name');
        }else{
        	game.state.start('menu');
        }
    
    }

};

// "username" screen
var nameState = {

    create: function() {
                        
        var style = { font: '30px Arial', fill: '#00804d', align: 'center' };
        var styleName = { font: '44px Arial', fill: '#000000', align: 'center' };
        
        // title
        var title = game.add.text(this.game.world.centerX, this.game.world.centerY - 100, lang.insert_name, style);
        title.anchor.setTo(0.5);
        
        // "READY" button
        var btn = game.add.graphics(this.game.world.centerX - 84, this.game.world.centerY + 70);
        btn.lineStyle(1, 0x293d3d);
        btn.beginFill(0x3d5c5c);
        btn.drawRect(0, 0, 168, 60);
        btn.alpha = 0.5;
        btn.endFill();
        
        btn.inputEnabled = true;
        btn.input.useHandCursor = true;
        btn.events.onInputDown.add(this.nameIsEmpty, null);
        btn.events.onInputOver.add(function(){ btn.alpha=0.4 });
        btn.events.onInputOut.add(function(){ btn.alpha=0.5 });
        
        var ready = game.add.text(this.game.world.centerX + 1, this.game.world.centerY + 102, lang.ready, { font: '34px Arial', fill: '#f0f5f5', align: 'center' });
        ready.anchor.setTo(0.5);

        errorEmptyName = game.add.text(this.game.world.centerX, this.game.world.centerY - 70, "", {font: '18px Arial', fill: '#330000', align: 'center'});
        errorEmptyName.anchor.setTo(0.5);

        document.getElementById("text-field-div").style.visibility = "visible";
        document.getElementById("name_id").addEventListener('keypress', function(e){
            var keycode = e.keycode ? e.keycode : e.which; 
            //se apertar enter vai para ready, assim como o botão
            if(keycode == 13){
                nameState["nameIsEmpty"]();
            }     
        });

    },
         
    nameIsEmpty: function() {

        if(document.getElementById("name_id").value!=""){
            nameState["ready"]();
            errorEmptyName.setText("");
        }else{
            errorEmptyName.setText(lang.empty_name);
        }

    },
              
    ready: function() {
        
        // saves the typed name on username variable
        username = document.getElementById("name_id").value;
        console.log("user is" + username);        

        document.getElementById("text-field-div").style.visibility = "hidden";

        //clears the text field again
        document.getElementById("name_id").value = "";

        if(oneMenu){ //If menu, normal game
            // Go to the menu state
            game.state.start('menu');
        }else{ //parameters game
            if(oneShape=="Circle"){
                game.state.start("mapCOne");
            }else if(oneShape=="Square"){
                if(oneOperator=='Mixed'){
                    twoPosition = 0;
                    twoMove = true;
                    twoDifficulty = oneDifficulty; 
                    twoOperator= "";
                    twoLabel= false;
                    twoShape = oneShape;
                    twoType = oneType;
                    twoMenu = false;
                    
                    game.state.start("mapSTwo");
                }else{
                    game.state.start("mapSOne");
                }
            }
            
        }
        
    }

};

var m_info_right, m_info_left;
var m_world, m_menu, m_back, m_help, m_audio;

var buttonSettings = {

    addButtons: function(left, right, b0Esq, b1Esq, b2Esq, b0Dir, b1Dir, phase, helpBtn){

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