
var menu1, menu2, menu3, menu4;
var lbl_game;

/*
    var menuState = {
        create: function(){},
        loadGame: function(){},
        ---------------------------- end of phaser functions
        showTitle: function(){},
        clearTitle: function(){},
    }
*/

var menuState = {

    // game menu screen
    create: function() {
        
        // Creating sound variable
        beepSound = game.add.audio('sound_beep');
        
        // Reading dictionary
        lang = game.cache.getJSON('dictionary');
        
        // Title
        var style = { font: "32px Arial", fill: "#00804d", align: "center" };
        var title = game.add.text(this.game.world.centerX, 80, lang.menu_title, style);
        title.anchor.setTo(0.5,0.5);
        
        // Subtitle : game mode 
        var style_game = { font: "27px Arial", fill: "#003cb3", align: "center" };
        lbl_game = game.add.text(this.game.world.centerX, 110, "", style_game);
        lbl_game.anchor.setTo(0.5,0.5);
        
        var player_info = game.add.text(this.game.world.centerX, 40, lang.welcome + ", " + username + "!", { font: "20px Arial", fill: "#330000", align: "center" });        
        player_info.anchor.setTo(0.5,0.5);

        buttonSettings["addButtons"](0,1,
                                    0,0,0,
                                    1,1,
                                    0,0);
        //game buttons 

        // loading button sprites
        menu1 = game.add.sprite(this.game.world.centerX + 10, this.game.world.centerY - 70, 'game1c');
        menu2 = game.add.sprite(this.game.world.centerX + 160, this.game.world.centerY - 70, 'game2c');
        menu3 = game.add.sprite(this.game.world.centerX + 10, this.game.world.centerY + 90, 'game3c');
        menu4 = game.add.sprite(this.game.world.centerX + 160, this.game.world.centerY + 90, 'game4c');
        
        menu5 = game.add.sprite(this.game.world.centerX - 350, this.game.world.centerY - 70, 'game1s');
        menu6 = game.add.sprite(this.game.world.centerX - 200, this.game.world.centerY - 70, 'game2s');
        menu7 = game.add.sprite(this.game.world.centerX - 350, this.game.world.centerY + 90, 'game3s');
        menu8 = game.add.sprite(this.game.world.centerX - 200, this.game.world.centerY + 90, 'game4s');
        
        menu9 = game.add.sprite(this.game.world.centerX + 350, this.game.world.centerY -70, 'game5s');
        
        // button actions
        menu1.anchor.setTo(0.5, 0.5);
        menu1.inputEnabled = true;
        menu1.input.useHandCursor = true;
        menu1.events.onInputDown.add(this.loadGame,{num:1, beep: beepSound, shape : "Circle", label : true});
        menu1.events.onInputOver.add(this.showTitle,{num:1, beep: beepSound, shape : "Circle", label : true, menu: menu1});
        menu1.events.onInputOut.add(this.clearTitle, {menu: menu1});
        
        menu2.anchor.setTo(0.5, 0.5);
        menu2.inputEnabled = true;
        menu2.input.useHandCursor = true;
        menu2.events.onInputDown.add(this.loadGame,{num:2, beep: beepSound, shape : "Circle", label : false});
        menu2.events.onInputOver.add(this.showTitle,{num:2, beep: beepSound, shape : "Circle", label : false, menu: menu2});
        menu2.events.onInputOut.add(this.clearTitle, {menu: menu2});
        
        menu3.anchor.setTo(0.5, 0.5);
        menu3.inputEnabled = true;
        menu3.input.useHandCursor = true;
        menu3.events.onInputDown.add(this.loadGame,{num:3, beep: beepSound, shape : "Circle", label : true});
        menu3.events.onInputOver.add(this.showTitle,{num:3, beep: beepSound, shape : "Circle", label : true, menu: menu3});
        menu3.events.onInputOut.add(this.clearTitle, {menu: menu3});
        
        menu4.anchor.setTo(0.5, 0.5);
        menu4.inputEnabled = true;
        menu4.input.useHandCursor = true;
        menu4.events.onInputDown.add(this.loadGame,{num:4, beep: beepSound, shape : "Circle", label : false});
        menu4.events.onInputOver.add(this.showTitle,{num:4, beep: beepSound, shape : "Circle", label : false, menu: menu4});
        menu4.events.onInputOut.add(this.clearTitle, {menu: menu4});
        
        menu5.anchor.setTo(0.5, 0.5);
        menu5.inputEnabled = true;
        menu5.input.useHandCursor = true;
        menu5.events.onInputDown.add(this.loadGame,{num:1, beep: beepSound, shape : "Square", label : true});
        menu5.events.onInputOver.add(this.showTitle,{num:1, beep: beepSound, shape : "Square", label : true, menu: menu5});
        menu5.events.onInputOut.add(this.clearTitle, {menu: menu5});
        
        menu6.anchor.setTo(0.5, 0.5);
        menu6.inputEnabled = true;
        menu6.input.useHandCursor = true;
        menu6.events.onInputDown.add(this.loadGame,{num:2, beep: beepSound, shape : "Square", label : false});
        menu6.events.onInputOver.add(this.showTitle,{num:2, beep: beepSound, shape : "Square", label : false, menu: menu6});
        menu6.events.onInputOut.add(this.clearTitle, {menu: menu6});
        
        menu7.anchor.setTo(0.5, 0.5);
        menu7.inputEnabled = true;
        menu7.input.useHandCursor = true;
        menu7.events.onInputDown.add(this.loadGame,{num:3, beep: beepSound, shape : "Square", label : true});
        menu7.events.onInputOver.add(this.showTitle,{num:3, beep: beepSound, shape : "Square", label : true, menu: menu7});
        menu7.events.onInputOut.add(this.clearTitle, {menu: menu7});
        
        menu8.anchor.setTo(0.5, 0.5);
        menu8.inputEnabled = true;
        menu8.input.useHandCursor = true;
        menu8.events.onInputDown.add(this.loadGame,{num:4, beep: beepSound, shape : "Square", label : false});
        menu8.events.onInputOver.add(this.showTitle,{num:4, beep: beepSound, shape : "Square", label : false, menu: menu8});
        menu8.events.onInputOut.add(this.clearTitle, {menu: menu8});
        
        menu9.anchor.setTo(0.5, 0.5);
        menu9.inputEnabled = true;
        menu9.input.useHandCursor = true;
        menu9.events.onInputDown.add(this.loadGame,{num:5, beep: beepSound, shape : "Square", label : false});
        menu9.events.onInputOver.add(this.showTitle,{num:5, beep: beepSound, shape : "Square", label : false, menu: menu9});
        menu9.events.onInputOut.add(this.clearTitle, {menu: menu9});

        // Floor
        for(var i=0;i<9;i++){
            game.add.image(i*100, 501, 'floor');
        }
        
    },
    
    //calls the selected game menu screen
    loadGame: function(){

        if(audioStatus){
            this.beep.play();
        }

        if( (this.num==1 || this.num==2) && this.shape=="Circle"){
            oneShape = this.shape;
            oneLabel = this.label;
            oneType = "A";
            game.state.start('menuCOne');
        }
        if( (this.num==3 || this.num==4) && this.shape=="Circle"){
            oneShape = this.shape;
            oneLabel = this.label;
            oneType = "B";
            game.state.start('menuCOne');
        }
        if( (this.num==1 || this.num==2) && this.shape=="Square"){
            oneShape = this.shape;
            oneLabel = this.label;
            oneType = "A";
            game.state.start('menuSOne');
        }
        if( (this.num==3 || this.num==4) && this.shape=="Square"){
            oneShape = this.shape;
            oneLabel = this.label;
            oneType = "B";
            game.state.start('menuSOne');
        }
        if( this.num==5 && this.shape=="Square"){
            twoShape = this.shape;
            twoLabel = this.label;
            twoType = "";
            game.state.start('menuSTwo');
        }

    },

    showTitle: function(){
        
        var title = "";
        var type = "";
        
        if( (this.num==1 || this.num==2) ){
            type = "I";
        }
        if( (this.num==3 || this.num==4) ){
            type = "II";
        }
        if( this.num==5 && this.shape=="Square"){
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
        
        lbl_game.text = title;

        this.menu.scale.setTo(1.05);

    },

    clearTitle: function(){
        
        lbl_game.text = "";
        
        this.menu.scale.setTo(1.0);

    }
    
};
