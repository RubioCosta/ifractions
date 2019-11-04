/*

    var menuState = {
        create: function(){},
        func_loadGame: function(){},
        ---------------------------- end of phaser functions
        func_showTitle: function(){},
        func_clearTitle: function(){},
    }

*/

var menuState = {

    // creating game menu screen assets
    create: function() {
        
     	// BACKGROUND
     	  
        // Floor
        for(var i=0;i<9;i++){
            game.add.image(i*100, 501, 'floor');
        }

        // LABELS

        // Player name
        var player_info = game.add.text(this.game.world.centerX, 40, lang.welcome + ", " + username + "!", { font: "20px Arial", fill: "#330000", align: "center" });        
        player_info.anchor.setTo(0.5,0.5);

        // Title : Select a game
        var style = { font: "32px Arial", fill: "#00804d", align: "center" };
        var title = game.add.text(this.game.world.centerX, 80, lang.menu_title, style);
        title.anchor.setTo(0.5,0.5);

        // Subtitle : Game mode 
        var style_game = { font: "27px Arial", fill: "#003cb3", align: "center" };
        var lbl_game = game.add.text(this.game.world.centerX, 110, "", style_game);
        lbl_game.anchor.setTo(0.5,0.5);

        // BUTTONS

        // Navigation buttons
		buttonSettings["func_addButtons"](0,1,
    	                             0,0,0,
                                     1,1,
                                     0,0);
        
        // Game buttons
        
        menu1 = game.add.sprite(this.game.world.centerX - 350, this.game.world.centerY - 70, 'game1s');
        menu2 = game.add.sprite(this.game.world.centerX - 200, this.game.world.centerY - 70, 'game2s');
        menu3 = game.add.sprite(this.game.world.centerX - 350, this.game.world.centerY + 90, 'game3s');
        menu4 = game.add.sprite(this.game.world.centerX - 200, this.game.world.centerY + 90, 'game4s');
        
        menu5 = game.add.sprite(this.game.world.centerX + 10,  this.game.world.centerY - 70, 'game1c');
        menu6 = game.add.sprite(this.game.world.centerX + 160, this.game.world.centerY - 70, 'game2c');
        menu7 = game.add.sprite(this.game.world.centerX + 10,  this.game.world.centerY + 90, 'game3c');
        menu8 = game.add.sprite(this.game.world.centerX + 160, this.game.world.centerY + 90, 'game4c');

        menu9 = game.add.sprite(this.game.world.centerX + 350, this.game.world.centerY - 70, 'game5s');

        // ACTIONS

        // Game Button actions
        
        menu1.anchor.setTo(0.5, 0.5);
        menu1.inputEnabled = true;
        menu1.input.useHandCursor = true;
        menu1.events.onInputDown.add(this.func_loadGame,{levelType:1, beep: beepSound, shape : "Square", label : true});
        menu1.events.onInputOver.add(this.func_showTitle,{levelType:1, beep: beepSound, shape : "Square", label : true, menu: menu1, lbl_game: lbl_game});
        menu1.events.onInputOut.add(this.func_clearTitle, {menu: menu1, lbl_game: lbl_game});
        
        menu2.anchor.setTo(0.5, 0.5);
        menu2.inputEnabled = true;
        menu2.input.useHandCursor = true;
        menu2.events.onInputDown.add(this.func_loadGame,{levelType:1, beep: beepSound, shape : "Square", label : false});
        menu2.events.onInputOver.add(this.func_showTitle,{levelType:1, beep: beepSound, shape : "Square", label : false, menu: menu2, lbl_game: lbl_game});
        menu2.events.onInputOut.add(this.func_clearTitle, {menu: menu2, lbl_game: lbl_game});
        
        menu3.anchor.setTo(0.5, 0.5);
        menu3.inputEnabled = true;
        menu3.input.useHandCursor = true;
        menu3.events.onInputDown.add(this.func_loadGame,{levelType:2, beep: beepSound, shape : "Square", label : true});
        menu3.events.onInputOver.add(this.func_showTitle,{levelType:2, beep: beepSound, shape : "Square", label : true, menu: menu3, lbl_game: lbl_game});
        menu3.events.onInputOut.add(this.func_clearTitle, {menu: menu3, lbl_game: lbl_game});
        
        menu4.anchor.setTo(0.5, 0.5);
        menu4.inputEnabled = true;
        menu4.input.useHandCursor = true;
        menu4.events.onInputDown.add(this.func_loadGame,{levelType:2, beep: beepSound, shape : "Square", label : false});
        menu4.events.onInputOver.add(this.func_showTitle,{levelType:2, beep: beepSound, shape : "Square", label : false, menu: menu4, lbl_game: lbl_game});
        menu4.events.onInputOut.add(this.func_clearTitle, {menu: menu4, lbl_game: lbl_game});
        
        menu5.anchor.setTo(0.5, 0.5);
        menu5.inputEnabled = true;
        menu5.input.useHandCursor = true;
        menu5.events.onInputDown.add(this.func_loadGame,{levelType:1, beep: beepSound, shape : "Circle", label : true});
        menu5.events.onInputOver.add(this.func_showTitle,{levelType:1, beep: beepSound, shape : "Circle", label : true, menu: menu5, lbl_game: lbl_game});
        menu5.events.onInputOut.add(this.func_clearTitle, {menu: menu5, lbl_game: lbl_game});
        
        menu6.anchor.setTo(0.5, 0.5);
        menu6.inputEnabled = true;
        menu6.input.useHandCursor = true;
        menu6.events.onInputDown.add(this.func_loadGame,{levelType:1, beep: beepSound, shape : "Circle", label : false});
        menu6.events.onInputOver.add(this.func_showTitle,{levelType:1, beep: beepSound, shape : "Circle", label : false, menu: menu6, lbl_game: lbl_game});
        menu6.events.onInputOut.add(this.func_clearTitle, {menu: menu6, lbl_game: lbl_game});
        
        menu7.anchor.setTo(0.5, 0.5);
        menu7.inputEnabled = true;
        menu7.input.useHandCursor = true;
        menu7.events.onInputDown.add(this.func_loadGame,{levelType:2, beep: beepSound, shape : "Circle", label : true});
        menu7.events.onInputOver.add(this.func_showTitle,{levelType:2, beep: beepSound, shape : "Circle", label : true, menu: menu7, lbl_game: lbl_game});
        menu7.events.onInputOut.add(this.func_clearTitle, {menu: menu7, lbl_game: lbl_game});
        
        menu8.anchor.setTo(0.5, 0.5);
        menu8.inputEnabled = true;
        menu8.input.useHandCursor = true;
        menu8.events.onInputDown.add(this.func_loadGame,{levelType:2, beep: beepSound, shape : "Circle", label : false});
        menu8.events.onInputOver.add(this.func_showTitle,{levelType:2, beep: beepSound, shape : "Circle", label : false, menu: menu8, lbl_game: lbl_game});
        menu8.events.onInputOut.add(this.func_clearTitle, {menu: menu8, lbl_game: lbl_game});

        menu9.anchor.setTo(0.5, 0.5);
        menu9.inputEnabled = true;
        menu9.input.useHandCursor = true;
        menu9.events.onInputDown.add(this.func_loadGame,{levelType:3, beep: beepSound, shape : "Square", label : true});
        menu9.events.onInputOver.add(this.func_showTitle,{levelType:3, beep: beepSound, shape : "Square", label : true, menu: menu9, lbl_game: lbl_game});
        menu9.events.onInputOut.add(this.func_clearTitle, {menu: menu9, lbl_game: lbl_game});

    },
    
    //calls the selected game menu screen
    func_loadGame: function(){

        if(audioStatus){
            this.beep.play();
        }

        levelShape = this.shape;
        levelLabel = this.label;

        if(this.shape=="Square"){
            
            if(this.levelType==1 || this.levelType==2){
                
                if(this.levelType==1){
                    levelType = "A";
                }else if(this.levelType==2){
                    levelType = "B";
                }

                if(debugMode) console.log("Square One");
                game.state.start('menuSquareOne');                
            
            }else if(this.levelType==3){
                
                levelType = "C";
                
                if(debugMode) console.log("Square Two, "+levelType);
                game.state.start('menuSquareTwo')
            
            }

        }else if(this.shape=="Circle"){
        
            if (this.levelType==1){
                levelType = "A";
            }else if (this.levelType==2){
                levelType = "B";
            }
            
            if(debugMode) console.log("Circle One");
            game.state.start('menuCircleOne');
        
        }

    },

    func_showTitle: function(){
        
        var title = "";
        var type = "";
        
        if(this.levelType==1){
            type = "I";
        }
        if(this.levelType==2){
            type = "II";
        }
        if(this.levelType==3){
            type = "III";
        }
        
        if(this.shape=="Circle"){
            title += lang.circle_name;
        }else if(this.shape=="Square"){
            title += lang.square_name;
        }
        
        if(type!=""){
          //circ/quad       A/B/C
            title  += " " + type;
        }
        
        if(this.label){
          //-    sem/com                  legendas
            title += " - " + lang.with_name + " " + lang.label_name;
        }else{
            title += " - " + lang.without_name + " " + lang.label_name;
        }
        
        this.lbl_game.text = title;

        this.menu.scale.setTo(1.05);

    },

    func_clearTitle: function(){
        
        this.lbl_game.text = "";
        
        this.menu.scale.setTo(1);

    }
    
};
