/*
    let menuState = {
        create: function(){},
        ---------------------------- end of phaser functions
        func_loadGame: function(){},
        func_showTitle: function(){},
        func_clearTitle: function(){},
    }
*/

let menuState = {

    inputStartPosition: null,
    inputEndPosition: null,
    
    isCameraMoving: false,

    extraWidth: null,

    title: null,
    lbl_game: null,
    player_info: null,

    // creating game menu screen assets
    create: function() {
        
        if(loadAssets.levelSpriteList.length > 8){
            let aux = loadAssets.levelSpriteList.length-8;
            this.extraWidth = (aux%2==0) ? (aux/2)*235 : ((aux+1)/2)*235;
        }else{
            this.extraWidth = 0;
        }

        // CAMERA
        this.game.world.setBounds(0, 0, this.game.world.width + this.extraWidth, this.game.world.height);

        // Floor
        for(let i=0;i<this.game.world.width/100;i++){
            game.add.image(i*100, 501, 'floor');
        }
        // LABELS

        // Player name
        this.player_info = game.add.text(this.game.world.centerX - this.extraWidth/2, 40, lang.welcome + ", " + username + "!", { font: "20px Arial", fill: "#330000", align: "center" });        
        this.player_info.anchor.setTo(0.5,0.5);

        // Title : Select a game
        const style = { font: "32px Arial", fill: "#00804d", align: "center" };
        this.title = game.add.text(this.game.world.centerX - this.extraWidth/2, 80, lang.menu_title, style);
        this.title.anchor.setTo(0.5,0.5);

        // Subtitle : Game mode 
        const style_game = { font: "27px Arial", fill: "#003cb3", align: "center" };
        this.lbl_game = game.add.text(this.game.world.centerX - this.extraWidth/2, 110, "", style_game);
        this.lbl_game.anchor.setTo(0.5,0.5);

        // BUTTONS

        // Calls function that loads navigation icons
		iconSettings["func_addButtons"](false,true,
    	                             false,false,false,
                                     true,true,
                                     false,false);
        
        // Game buttons
		let x = -350;
		let y = -70;
        let menuObjList = [];
		for(let i=0; i<loadAssets.levelSpriteList.length; i++){
			menuObjList[i] = game.add.sprite(defaultWidth/2 + x, this.game.world.centerY + y, 'game'+i);
			menuObjList[i].anchor.setTo(0.5, 0.5);
	        menuObjList[i].inputEnabled = true;
	        menuObjList[i].input.useHandCursor = true;
            menuObjList[i].events.onInputDown.add(this.func_loadGame,{levelType: loadAssets.levelTypeList[i], beep: beepSound, shape: loadAssets.levelShapeList[i], label : true, game: this.game, extraWidth: this.extraWidth});
	        menuObjList[i].events.onInputOver.add(this.func_showTitle,{levelType: loadAssets.levelTypeList[i], beep: beepSound, shape : loadAssets.levelShapeList[i], label : true, menu: menuObjList[i], lbl_game: this.lbl_game});
	        menuObjList[i].events.onInputOut.add(this.func_clearTitle, {menu: menuObjList[i], lbl_game: this.lbl_game});
			if((i+1)%2==1){
				y=90;
			}else{
				y=-70; 
				x+=235;
			}
        }

        // TURNING MOUSE INPUT CAPTURE ON TO MANAGE PAGE SCROLL
        this.input.mouse.capture = true;

    },

    update: function(){
        

        if(this.input.activePointer.leftButton.isUp){
            this.inputUp();
        }

        if(this.input.activePointer.leftButton.isDown){
            this.inputDown();
        }

        if(this.isCameraMoving){
            this.camera.x += (this.inputStartPosition.x - this.input.activePointer.x)/50;
            this.title.x = (this.game.world.centerX - this.extraWidth/2) + this.camera.x;
            this.lbl_game.x = (this.game.world.centerX - this.extraWidth/2) + this.camera.x;
            this.player_info.x = (this.game.world.centerX - this.extraWidth/2) + this.camera.x;

            iconSettings["changeRightButtonX"]((defaultWidth) + this.camera.x);
        }

    },
    
    inputDown: function(){
        if(!this.isCameraMoving){
            this.inputStartPosition = new Phaser.Point(this.input.activePointer.x, this.input.activePointer.y);
        } 

        this.isCameraMoving = true;

    },

    inputUp: function(){
        this.isCameraMoving = false;
    },

    //calls the selected game menu screen
    func_loadGame: function(){

        if(debugMode) console.log("antes: "+this.game.world.width);
        this.game.world.setBounds(0, 0, defaultWidth, this.game.world.height);
        if(debugMode) console.log("depois: "+this.game.world.width);

        if(audioStatus){
            this.beep.play();
        }

        levelShape = this.shape;
        levelLabel = this.label;

        if     (this.levelType==1) levelType = "A";
        else if(this.levelType==2) levelType = "B";
        else if(this.levelType==3) levelType = "C";

        if(levelType=="C"){
            gameStateString = "game"+levelShape+"Two";
            if(debugMode) console.log(levelShape+" Two, "+levelType);
        }else{
            gameStateString = "game"+levelShape+"One";
            if(debugMode) console.log(levelShape+" One, "+levelType);
        }

        // Calls level difficulty screen
        game.state.start('difficulty');
    },

    func_showTitle: function(){
        
        let title = "";
        let type = "";
        
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
          //circ/quad       I/II/III
            title  += " " + type;
        }

        this.lbl_game.text = title;

        this.menu.scale.setTo(1.05);

    },

    func_clearTitle: function(){
        
        this.lbl_game.text = "";
        
        this.menu.scale.setTo(1);

    }
    
};
