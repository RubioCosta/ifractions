var username, errorEmptyName, words;

/*
    var bootState = {
        preload: function(){},
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
        preload: function(){},
        create: function(){},
        ------------------------------------------------ end of phaser functions
        ready: function(){} //calls menu.js -> menuState
    };
*/

// choose language screen
var bootState = {

    //Loading all assets   
    preload: function() {
        
        var imgsrc = 'assets/img/';

        //Progress bar image
        game.load.image('progressBar', imgsrc+'pgbar.png');

        //flags
        game.load.image('flag_BR', imgsrc+'flag/BRAZ.jpg');
        game.load.image('flag_PE', imgsrc+'flag/PERU.jpg');
        game.load.image('flag_US', imgsrc+'flag/UNST.jpg');
        game.load.image('flag_FR', imgsrc+'flag/FRAN.jpg');

        //scenario
        game.load.image('bgimage', imgsrc+'bg.jpg');
        game.load.image('bgmap', imgsrc+'bg_map.png');
        game.load.image('cloud', imgsrc+'cloud.png');
        game.load.image('floor', imgsrc+'floor.png');
        game.load.image('road', imgsrc+'road.png');
        
        //game phases buttons list
        game.load.image('game1c', imgsrc+'game/one-c.png');
        game.load.image('game2c', imgsrc+'game/two-c.png');
        game.load.image('game3c', imgsrc+'game/three-c.png');
        game.load.image('game4c', imgsrc+'game/four-c.png');
        game.load.image('game1s', imgsrc+'game/one-s.png');
        game.load.image('game2s', imgsrc+'game/two-s.png');
        game.load.image('game3s', imgsrc+'game/three-s.png');
        game.load.image('game4s', imgsrc+'game/four-s.png');
        game.load.image('game5s', imgsrc+'game/five-s.png');
        
        //header menu buttons
        game.load.image('back', imgsrc+'menu/back.png');
        game.load.image('home', imgsrc+'menu/home.png');
        game.load.image('info', imgsrc+'menu/info.png');
        game.load.image('world', imgsrc+'menu/language.png');
        game.load.image('list', imgsrc+'menu/menu.png');
        game.load.image('help', imgsrc+'menu/help.png');
        game.load.image('pgbar', imgsrc+'menu/progressBar.png');
        game.load.image('block', imgsrc+'menu/block.png');
        game.load.image('eraser', imgsrc+'menu/eraser.png');
        
        //operators
        game.load.image('add', imgsrc+'operator/add.png');
        game.load.image('subtract', imgsrc+'operator/subtract.png');
        game.load.image('separator', imgsrc+'operator/separator.png');
        game.load.image('equal', imgsrc+'operator/equal.png');
        
        //feedback
        game.load.image('h_arrow', imgsrc+'help/arrow.png');
        game.load.image('h_double', imgsrc+'help/double.png');
        game.load.image('h_error', imgsrc+'help/error.png');
        game.load.image('h_ok', imgsrc+'help/ok.png');
        game.load.image('down', imgsrc+'help/down.png');        
        game.load.image('pointer', imgsrc+'help/pointer.png');
        
        // Loading assets based on language        
        game.load.spritesheet('kid_run', imgsrc+'kid/run.png', 82, 178, 12);
        game.load.spritesheet('kid_walk', imgsrc+'kid/walk.png', 78, 175, 24);
        game.load.spritesheet('kid_lost', imgsrc+'kid/lost.png', 72, 170, 6);
        game.load.spritesheet('tractor', imgsrc+'tractor/frame.png', 201, 144, 10);
        game.load.image('balloon', imgsrc+'airballoon_upper.png');
        game.load.image('balloon_basket', imgsrc+'airballoon_base.png');
        game.load.image('birch', imgsrc+'birch.png');
        game.load.image('flag', imgsrc+'flag.png');
        game.load.image('house', imgsrc+'house.png');
        game.load.image('place_a', imgsrc+'place_a.png');
        game.load.image('place_b', imgsrc+'place_b.png');
        game.load.image('garage', imgsrc+'garage.png');
        game.load.image('farm', imgsrc+'farm.png');
        game.load.image('rock', imgsrc+'rock.png');
        game.load.image('school', imgsrc+'school.png');
        game.load.image('sign', imgsrc+'sign.png');
        game.load.image('tree1', imgsrc+'tree.png');
        game.load.image('tree2', imgsrc+'tree2.png');
        game.load.image('tree3', imgsrc+'tree3.png');
        game.load.image('tree4', imgsrc+'tree4.png');
        
        // Loadind Sound Effects
        game.load.audio('sound_ok', ['assets/fx/ok.ogg', 'assets/fx/ok.mp3']);
        game.load.audio('sound_error', ['assets/fx/error.ogg', 'assets/fx/error.mp3']);
        game.load.audio('sound_beep', ['assets/fx/beep.ogg', 'assets/fx/beep.mp3']);
    },

    create: function() {

        //game settings
        game.stage.backgroundColor = '#cce5ff';
        game.physics.startSystem(Phaser.Physics.ARCADE);
        var style = { font: '28px Arial', fill: '#00804d', align: 'center' };

        //generating language selection

        //pt_BR
        var title1 = game.add.text(this.game.world.centerX - 220, this.game.world.centerY - 100, 'FRAÇÕES  ', style);
        title1.anchor.setTo(1, 0.5);
        var flag1 = game.add.sprite(this.game.world.centerX - 220, this.game.world.centerY - 100, 'flag_BR');       
        flag1.anchor.setTo(0, 0.5);
        flag1.inputEnabled = true;
        flag1.input.useHandCursor = true;
        flag1.events.onInputDown.add(this.setLang,{lang:'pt_BR'});

        //es_PE
        var title2 = game.add.text(this.game.world.centerX + 200, this.game.world.centerY - 100, 'FRACCIONES  ', style);
        title2.anchor.setTo(1, 0.5);
        var flag2 = game.add.sprite(this.game.world.centerX + 200, this.game.world.centerY - 100, 'flag_PE');       
        flag2.anchor.setTo(0, 0.5);
        flag2.inputEnabled = true;
        flag2.input.useHandCursor = true;
        flag2.events.onInputDown.add(this.setLang,{lang:'es_PE'});

        //en_US
        var title3 = game.add.text(this.game.world.centerX - 220, this.game.world.centerY + 100, 'FRACTIONS  ', style);
        title3.anchor.setTo(1, 0.5);
        var flag3 = game.add.sprite(this.game.world.centerX - 220, this.game.world.centerY + 100, 'flag_US');       
        flag3.anchor.setTo(0, 0.5);
        flag3.inputEnabled = true;
        flag3.input.useHandCursor = true;
        flag3.events.onInputDown.add(this.setLang,{lang:'en_US'});

        //fr_FR
        var title4 = game.add.text(this.game.world.centerX + 200, this.game.world.centerY + 100, 'FRACTIONS  ', style);
        title4.anchor.setTo(1, 0.5);
        var flag4 = game.add.sprite(this.game.world.centerX + 200, this.game.world.centerY + 100, 'flag_FR');       
        flag4.anchor.setTo(0, 0.5);
        flag4.inputEnabled = true;
        flag4.input.useHandCursor = true;
        flag4.events.onInputDown.add(this.setLang,{lang:'fr_FR'});
        
    },
    
    setLang: function(){
        //set language
        lang = this.lang;
        //start resource loading
        game.state.start('load');
    }

};

// loading screen (+loading assets)
var loadState = {
    
    preload: function() {
        
        // Displaying the progress bar
        var progressBar = game.add.sprite(game.world.centerX, game.world.centerY, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(progressBar);
        
        if(!oneMenu){
            game.stage.backgroundColor = '#cce5ff';
            game.physics.startSystem(Phaser.Physics.ARCADE);
        }
        
        // Loading dictionary
        game.load.json('dictionary', 'assets/languages/'+lang+'.json');
        
    },

    create: function() {  
        game.state.start('name');
    }
};

// type name screen
var nameState = {

    preload: function () {
        
    },

    create: function() {
        game.stage.backgroundColor = '#cce5ff';
        
        // gets selected language from json
        words = game.cache.getJSON('dictionary');
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        var style = { font: '30px Arial', fill: '#00804d', align: 'center' };
        var styleName = { font: '44px Arial', fill: '#000000', align: 'center' };
        
        // title
        var title = game.add.text(this.game.world.centerX, this.game.world.centerY - 100, words.insert_name, style);
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
        
        var ready = game.add.text(this.game.world.centerX + 1, this.game.world.centerY + 102, words.ready, { font: '34px Arial', fill: '#f0f5f5', align: 'center' });
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
            errorEmptyName.setText(words.empty_name);
        }

    },

    //var ready = function readyFunction() {...},
    //var ready = function() {...},                
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