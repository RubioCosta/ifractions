/*

    var menuSquareTwo = {
        create: function(){},
        ---------------------------- end of phaser functions
        func_loadMap: function(){}
    };

    var gameSquareTwo = {
        create: function(){},
        update: function(){},
        ---------------------------- end of phaser functions
        func_updateCounter: function(){},
        func_overSquare: function(){},
        func_outSquare: function(){},
        func_clickSquare: function(){},
            //func_setPlace: function(){},
        func_postScore: function(){},
            //func_viewHelp: function(){},
            //func_checkOverlap: function(){}
        func_getRndDivisor: function(){}
            
    };

    var endSquareTwo = {
        create: function(){},
        update: function(){},
        ---------------------------- end of phaser functions
        func_verPrincipal: function(){},
    };
        
*/

// Fractions Comparison Square states

/****************************** MENU ****************************/

var menuSquareTwo = {

    create: function() {
          
        // Navigation buttons
        buttonSettings["func_addButtons"](1,1,
                                    0,1,0,
                                    1,0,
                                    0,0);
        
        // Setting title
        var style = { font: '28px Arial', fill: '#00804d'};
        var title = game.add.text(game.world.centerX, 40, lang.game_menu_title, style);
        title.anchor.setTo(0.5, 0.5);
        
        //SETTING DIFFICULTY LEVELS

        var maxHeight = 120;  //Max height of a stair
        var stairHeight = 29; //height growth of a stair
        var stairWidth = 80;  //Width of a stair
        var startStair = 240;
        var startSymbol = 150;
        var startSquare = (startSymbol/2)+startStair+stairWidth*5;
        
        var equalsIcon = game.add.sprite(startSymbol, 300, 'equal');
            equalsIcon.frame = 0;
            equalsIcon.scale.setTo(0.7);
            equalsIcon.anchor.setTo(0.5,0.5);
            
        //First stairs, More divisions to less divisions 1, 5 levels

        var stairsMoreToLess1 = [];

        for(var i=1;i<=5;i++){
            //stair
            var x1 = startStair+(stairWidth*(i-1));
            var y1 = 100+maxHeight-i*stairHeight;
            var x2 = stairWidth;//x1 + 40;
            var y2 = stairHeight*i;//y1 + 24;
            
            stairsMoreToLess1[i] = game.add.graphics(0, 0);
            stairsMoreToLess1[i].lineStyle(1, 0xFFFFFF, 1);
            stairsMoreToLess1[i].beginFill(0x99b3ff);
            stairsMoreToLess1[i].drawRect(x1, y1, x2, y2);
            stairsMoreToLess1[i].endFill();
            
            //event
            stairsMoreToLess1[i].inputEnabled = true;
            stairsMoreToLess1[i].input.useHandCursor = true;
            stairsMoreToLess1[i].events.onInputDown.add(this.func_loadMap, {beep: beepSound, difficulty: i, operator: 'A' });
            stairsMoreToLess1[i].events.onInputOver.add(function (item) { item.alpha=0.5; }, this);
            stairsMoreToLess1[i].events.onInputOut.add(function (item) { item.alpha=1; }, this);
            
            //label
            var xl = x1+stairWidth/2; //x label
            var yl = y1+(stairHeight*i)/2; //y label
            var label = game.add.text(xl, yl, i, { font: '25px Arial', fill: '#ffffff', align: 'center' });
                label.anchor.setTo(0.5, 0.4);
        }

        //Second stairs, More divisions to less divisions 2, 5 levels

        var stairsMoreToLess2 = [];

        for(var i=1;i<=5;i++){
            //stair
            var x1 = startStair+(stairWidth*(i-1));
            var y1 = 270+maxHeight-i*stairHeight;
            var x2 = stairWidth;//x1 + 40;
            var y2 = stairHeight*i;//y1 + 24;
            
            stairsMoreToLess2[i] = game.add.graphics(0, 0);
            stairsMoreToLess2[i].lineStyle(1, 0xFFFFFF, 1);
            stairsMoreToLess2[i].beginFill(0xff6666);
            stairsMoreToLess2[i].drawRect(x1, y1, x2, y2);
            stairsMoreToLess2[i].endFill();
            
            //event
            stairsMoreToLess2[i].inputEnabled = true;
            stairsMoreToLess2[i].input.useHandCursor = true;
            stairsMoreToLess2[i].events.onInputDown.add(this.func_loadMap, {beep: beepSound, difficulty: i, operator: 'B' });
            stairsMoreToLess2[i].events.onInputOver.add(function (item) { item.alpha=0.5; }, this);
            stairsMoreToLess2[i].events.onInputOut.add(function (item) { item.alpha=1; }, this);
            
            //label
            var xl = x1+stairWidth/2; //x label
            var yl = y1+(stairHeight*i)/2; //y label
            var label = game.add.text(xl, yl, i, { font: '25px Arial', fill: '#ffffff', align: 'center' });
                label.anchor.setTo(0.5, 0.4);
        } 
        
        //Third stairs, Less divisions to more divisions, 5 levels

        var stairsLessToMore = [];

        for(var i=1;i<=5;i++){
            //stair
            var x1 = startStair+(stairWidth*(i-1));
            var y1 = 440+maxHeight-i*stairHeight;
            var x2 = stairWidth;//x1 + 40;
            var y2 = stairHeight*i;//y1 + 24;
            
            stairsLessToMore[i] = game.add.graphics(0, 0);
            stairsLessToMore[i].lineStyle(1, 0xFFFFFF, 1);
            stairsLessToMore[i].beginFill(0xb366ff);
            stairsLessToMore[i].drawRect(x1, y1, x2, y2);
            stairsLessToMore[i].endFill();
            
            //event
            stairsLessToMore[i].inputEnabled = true;
            stairsLessToMore[i].input.useHandCursor = true;
            stairsLessToMore[i].events.onInputDown.add(this.func_loadMap, {beep: beepSound, difficulty: i, operator: 'C' });
            stairsLessToMore[i].events.onInputOver.add(function (item) { item.alpha=0.5; }, this);
            stairsLessToMore[i].events.onInputOut.add(function (item) { item.alpha=1; }, this);
            
            //label
            var xl = x1+stairWidth/2; //x label
            var yl = y1+(stairHeight*i)/2; //y label
            var label = game.add.text(xl, yl, i, { font: '25px Arial', fill: '#ffffff', align: 'center' });
                label.anchor.setTo(0.5, 0.4);
        } 

    },
        
    //MapLoading function
    func_loadMap: function(){

        if(audioStatus){
            this.beep.play();
        }

        levelPosition = 0; //Map position
        levelMove = true; //Move no next point
        levelDifficulty  = this.difficulty; //Number of difficulty (1 to 5)
        leveloperator = this.operator; //Type of game
        passedLevels = 0; //reset the game progress when entering a new level

        game.state.start('map');

    },
    
};

/****************************** GAME ****************************/

var gameSquareTwo = {

    create: function() {  
        
        //timer
        totalTime = 0;
        timer = game.time.create(false);
        timer.loop(1000, this.func_updateCounter, this);
        timer.start();        
        
        points = [2,4,6,8,9,10,12,14,15,16,18,20];

        // Background
        game.add.image(0, 0, 'bgimage');
        
        // Navigation buttons
        buttonSettings["func_addButtons"](1,1,
                                    1,1,0,
                                    1,0,
                                    "menuSquareTwo", 0);

        //Clouds
        game.add.image(300, 100, 'cloud');
        game.add.image(660, 80, 'cloud');
        game.add.image(110, 85, 'cloud').scale.setTo(0.8);
        
        // Styles for labels
        var stylePlace = { font: '26px Arial', fill: '#400080', align: 'center'};
        var styleLabel = { font: '26px Arial', fill: '#000080', align: 'center'};
        var styleFraction = { font: '20px Arial', fill: '#000080', align: 'center'};
        var styleMenu = { font: '30px Arial', fill: '#000000', align: 'center'};
        
        //Floor
        for(var i=0;i<9;i++){
            game.add.image(i*100, 501, 'floor');
        }
             
        //kid
        kid = game.add.sprite(100, 470, 'kid_lost');
        kid.anchor.setTo(0.5, 0.7);
        kid.scale.setTo(0.8);
        //kid.animations.add('right',[0,1,2,3,4,5,6,7,8,9,10,11]);
        //kid.animations.add('left',[23,22,21,20,19,18,17,16,15,14,13,12]);
        kid.animations.add('front', [3,4,5])
        kidDirection = 'front';
        kidLeftLimit  = 100;
        kidRightLimit = 800;
        kid.animations.play('front', 6, true);
                
        //Control variables
        sizeA = 0; //Size of first block
        sizeB = 0; //Size of second block
        valueA = 0; //Number of clicked blocks for a
        valueB = 0; //Number of clicked blocks for b
                
        clickA = false; //If block A is clicked
        clickB = false; //If block B is clicked
        animateA = false; //Animate A selected blocks to position
        animateB = false; //Animate B selected blocks to position
        result = false; //Game is correct
        animate = null; //Final animation sequence
        
        //generator
        if(debugMode) console.log("----------");
        if(debugMode) console.log("Diff " + levelDifficulty + ", ini " + ((levelDifficulty-1)*2+1) + ", end " + ((levelDifficulty-1)*2+3));
        
        var rPoint = game.rnd.integerInRange((levelDifficulty-1)*2+1,(levelDifficulty-1)*2+3);
        sizeA = points[rPoint];
        
        if(debugMode) console.log("Rpoint " + rPoint + ", val " + sizeA);
        
        sizeB =  this.func_getRndDivisor(sizeA);
        blockB = game.rnd.integerInRange(1, sizeB);
        blockA = (sizeA/sizeB) * blockB;
        
        if(debugMode) console.log("SA " + sizeA + ", SB " + sizeB + ", BA " + blockA + ", BB " + blockB );
        
        //Blocks and fractions group
        blocksA = game.add.group(); //Main blocks A
        blocksB = game.add.group(); //Main blocks B
        auxblqA = game.add.group(); //Auxiliar blocks A
        auxblqB = game.add.group(); //Auxiliar blocks B
        
         //Creating blocks
        blockW = 400;
        blockH = 50;
        if(levelOperator!="C"){
            xA=230, yA=90;
            xB=xA, yB=yA+3*blockH+30;
        }else{
            xB=230, yB=90;
            xA=xB, yA=yB+3*blockH+30;
        }
             
        //Blocks A
        var widthA = blockW/sizeA;
        var lineColor = 0x1e2f2f;
        var fillColor = 0x83afaf;
        var fillColorS = 0xe0ebeb;
        
        for(var i=0; i<sizeA; i++){
            //if(debugMode) console.log("Block A"+i+": x:"+(xA+i*widthA)+", y:"+yA);
                        
            var block = game.add.graphics(xA+i*widthA, yA);
                block.anchor.setTo(0.5, 0.5);
                block.lineStyle(2, lineColor);
                block.beginFill(fillColor);
                block.drawRect(0, 0, widthA, blockH);
                block.alpha = 0.5;
                block.endFill();

                block.inputEnabled = true;
                block.input.useHandCursor = true;
                block.events.onInputDown.add(this.func_clickSquare, {who: 'A',indice: i});
                block.events.onInputOver.add(this.func_overSquare, {who: 'A',indice: i});
                block.events.onInputOut.add(this.func_outSquare, {who: 'A',indice: i});
            
            blocksA.add(block);
            
            //aux blocks
            var xAux = xA+i*widthA, yAux = yA+blockH+10;
            if(levelOperator == 'C') yAux = yA;
            var block = game.add.graphics(xAux, yAux );
                block.anchor.setTo(0.5, 0.5);
                block.lineStyle(1, lineColor);
                block.beginFill(fillColorS);
                block.drawRect(0, 0, widthA, blockH);
                
                if(levelOperator!='A') block.alpha = 0;
                else block.alpha = 0.2;
                    
            auxblqA.add(block);
            
        }
        
        //label block A
        var labelX = xA+blockW+30;
        var labelY = yA+blockH/2;
        labelA = game.add.text(labelX, labelY, sizeA , styleFraction);
        labelA.anchor.setTo(0.5, 0.41);
        
        //label fraction
        labelX = xA+(blockA*widthA)+40;
        labelY = yA+blockH+34;
        fractionA = game.add.text(labelX, labelY, "0\n"+sizeA , styleFraction);
        fractionA.anchor.setTo(0.5, 0.41);
        separatorA = game.add.sprite(labelX, labelY, 'separator');
        separatorA.anchor.setTo(0.5, 0.5);
        
        fractionA.alpha = 0;
        separatorA.alpha = 0;
        
        //Blocks B
        var widthB = blockW/sizeB;
        lineColor = 0x260d0d;
        fillColor = 0xd27979;
        fillColorS = 0xf2d9d9;
               
        for(var i=0; i<sizeB; i++){
                        
            var block = game.add.graphics(xB+i*widthB, yB);
                block.anchor.setTo(0.5, 0.5);
                block.lineStyle(2, lineColor);
                block.beginFill(fillColor);
                block.drawRect(0, 0, widthB, blockH);
                block.endFill();
            
                block.inputEnabled = true;
                block.input.useHandCursor = true;
                block.events.onInputDown.add(this.func_clickSquare, {who: 'B',indice: i});
                block.events.onInputOver.add(this.func_overSquare, {who: 'B',indice: i});
                block.events.onInputOut.add(this.func_outSquare, {who: 'B',indice: i});

            blocksB.add(block);
            //aux blocks
            var xAux = xB+i*widthB, yAux = yB+blockH+10;
            if(levelOperator == 'C') yAux = yB;
            var block = game.add.graphics(xAux, yAux);
                block.anchor.setTo(0.5, 0.5);
                block.lineStyle(1, lineColor);
                block.beginFill(fillColorS);
                block.drawRect(0, 0, widthB, blockH);
                
                if(levelOperator!='A') block.alpha = 0;
                else block.alpha = 0.2;
            auxblqB.add(block);
            
        }
        
        //label block B
        labelX = xA+blockW+30;
        labelY = yB+blockH/2;
        labelB = game.add.text(labelX, labelY, sizeB , styleFraction);
        labelB.anchor.setTo(0.5, 0.41);    
                
        //label fraction
        labelX = xA+(blockB*widthB)+40;
        labelY = yB+blockH+34;
        fractionB = game.add.text(labelX, labelY, "0\n"+sizeB , styleFraction);
        fractionB.anchor.setTo(0.5, 0.41);
        separatorB = game.add.sprite(labelX, labelY, 'separator');
        separatorB.anchor.setTo(0.5, 0.5);
        
        fractionB.alpha = 0;
        separatorB.alpha = 0;
        
        //ok and error images
        okImg = game.add.image(game.world.centerX, game.world.centerY, 'h_ok');
        okImg.anchor.setTo(0.5);
        okImg.alpha = 0;
        errorImg = game.add.image(game.world.centerX, game.world.centerY, 'h_error');
        errorImg.anchor.setTo(0.5);
        errorImg.alpha = 0;
        
        //error text
        errorTextA = game.add.text(game.world.centerX, game.world.centerY-225, "", {font: "20px Arial", fill: "#330000", align: "center" });
        errorTextA.anchor.setTo(0.5, 0.5);
        errorTextB = game.add.text(game.world.centerX, game.world.centerY-45, "", {font: "20px Arial", fill: "#330000", align: "center" });
        errorTextB.anchor.setTo(0.5, 0.5);

        counter = 0;
        endCounter = 100;
        cDelay = 0;
        eDelay = 60;

    },
    
    update: function() {
    	if (game.physics.arcade.distanceToPointer(kid, game.input.activePointer) > 20 ){	
    		    		
        	var xPos = game.input.mousePointer.x;
        	
        	/*if (xPos < kid.x + 10){
        		kidDirection='right';
        		kid.animations.play('right', 8, true);
        	}else if (xPos > kid.x){
        		kidDirection='right';
        		kid.animations.play('right', 8, true);
        	}*/
        			
        	//set limit to the arrow  
        	if  (xPos < kidLeftLimit){
        		xPos = kidLeftLimit;
        	}
        	if  (xPos > kidRightLimit){
        		xPos = kidRightLimit;
        	}
            
        	kid.x = xPos;
        }
    	
        //If clicked A only, animate
        if(animateA){
            for(var i=0;i<valueA;i++){
                blocksA.children[i].y +=2;
            }
            if(blocksA.children[0].y>=auxblqA.children[0].y){
                animateA = false;
                fractionA.alpha = 1;
                fractionA.setText(valueA+"\n"+sizeA);
                separatorA.alpha = 1;
            }
        }

        //If clicked B only, animate
        if(animateB){ 
            for(var i=0;i<valueB;i++){
                blocksB.children[i].y +=2;
            }
            if(blocksB.children[0].y>=auxblqB.children[0].y){
                animateB = false;
                fractionB.alpha = 1;
                fractionB.setText(valueB+"\n"+sizeB);
                separatorB.alpha = 1;
            }
        }
        
        //if clicked A and B
        if(clickA && clickB && !this.animate){
            //Check result
            timer.stop();
            cDelay++;
            if(cDelay>=eDelay){
                //fractions are equivalent : correct
                if((valueA/sizeA) == (valueB/sizeB)){
                    result = true;
                    levelMove = true;
                    if(audioStatus){
                        okSound.play();
                    }
                    kid.animations.stop();

                    passedLevels++;        
                    if(debugMode) console.log("passedLevels = " + passedLevels); 
                    okImg.alpha = 1;
                //fractions are not equivalent
                }else{
                    result = false;
                    levelMove = false;
                    if(audioStatus){
                        errorSound.play();
                    }
                    kid.animations.stop();
                    errorImg.alpha = 1;
                }
                this.func_postScore();
                clickA = false;
                clickB = false;
                animate = true;
            }
        }
        
        if(animate){
            counter++;
            if(result){
				// kid.x += 2;
				// kidDirection='right';
				// kid.animations.play('right', 8, true);
            }
            if(counter>endCounter){
                game.state.start('map');
            }
        }

    },

    func_updateCounter: function() {
        totalTime++;
    },
    
    func_overSquare: function(){

        if(!clickA && this.who=="A"){
            if(this.indice == sizeA-1){
                if(yA==90){
                    errorTextA.setText(lang.error_msg);
                    errorTextB.setText("");
                }else{
                    errorTextA.setText("");
                    errorTextB.setText(lang.error_msg);
                }
            }else{    
                errorTextA.setText("");
                errorTextB.setText("");
                for(var i=0;i<sizeA;i++){
                    if(i<=this.indice){
                        blocksA.children[i].alpha = 1;
                    }else{
                        blocksA.children[i].alpha = 0.5;
                    }
                }
                fractionA.x = xA+((this.indice +1)*(blockW/sizeA))+40;
                fractionA.alpha = 1;
                fractionA.setText(this.indice +1);
            }
        }

        if(!clickB && this.who=="B"){
            if(this.indice == sizeB-1){
                if(yA==90){
                    errorTextA.setText("");
                    errorTextB.setText(lang.error_msg);
                }else{
                    errorTextA.setText(lang.error_msg);
                    errorTextB.setText("");
                }
            }else{
                errorTextA.setText("");
                errorTextB.setText("");
                for(var i=0;i<sizeB;i++){
                    if(i<=this.indice){
                        blocksB.children[i].alpha = 1;
                    }else{
                        blocksB.children[i].alpha = 0.5;
                    }
                }
                fractionB.x = xB+((this.indice +1)*(blockW/sizeB))+40;
                fractionB.alpha = 1;
                fractionB.setText(this.indice +1);
            }
        }

    },

    func_outSquare: function(){

        if(!clickA && this.who=="A"){
            for(var i=0;i<=this.indice;i++){
                blocksA.children[i].alpha = 0.5;
            }
            fractionA.alpha = 0;
        }
        if(!clickB && this.who=="B"){
            for(var i=0;i<=this.indice;i++){
                blocksB.children[i].alpha = 0.5;
            }
            fractionB.alpha = 0;
        }

    },
    
    func_clickSquare: function(){

        if(!clickA && this.who=="A" && this.indice!=sizeA-1){
            for(var i=0;i<sizeA;i++){
                blocksA.children[i].inputEnabled = false;
                if(i<=this.indice){
                    blocksA.children[i].alpha = 1;
                }else{
                    blocksA.children[i].alpha = 0.5;
                    auxblqA.children[i].alpha = 0;
                }
            }
            labelA.alpha = 0;
            if(audioStatus){
                beepSound.play();
            }
            clickA = true;
            valueA = this.indice+1;
            fractionA.x = xA+(valueA*(blockW/sizeA))+40;
            separatorA.x = fractionA.x
            animateA = true;
        }

        if(!clickB && this.who=="B" && this.indice!=sizeB-1){
            for(var i=0;i<sizeB;i++){
                blocksB.children[i].inputEnabled = false;
                if(i<=this.indice){
                    blocksB.children[i].alpha = 1;
                }else{
                    blocksB.children[i].alpha = 0.5;
                    auxblqB.children[i].alpha = 0;
                }
            }
            labelB.alpha = 0;
            if(audioStatus){
                beepSound.play();
            }
            clickB = true;
            valueB = this.indice+1;
            fractionB.x = xB+(valueB*(blockW/sizeB))+40;
            separatorB.x = fractionB.x
            animateB = true;
        }

    },
    
    func_postScore: function (){
    
        var abst = "numBlocksA:" + sizeA + ", valueA: " + valueA +", numBlocksB: " + sizeB + ", valueB: " + valueB;
        
        var hr = new XMLHttpRequest();
        // Create some variables we need to send to our PHP file
        var url = "assets/cn/save.php";
        var vars = "s_ip="+hip+"&s_name=" + username + "&s_lang=" + lang + "&s_game=" + levelShape + "&s_mode=" + levelType;

        vars += "&s_oper=Equal&s_leve=" + levelDifficulty + "&s_posi=" + levelPosition + "&s_resu=" + result + "&s_time=" + totalTime + "&s_deta=" + abst;
        
        hr.open("POST", url, true);
        hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        hr.onreadystatechange = function() {
            if(debugMode) console.log(hr);

            if(hr.readyState == 4 && hr.status == 200) {
                var return_data = hr.responseText;
                if(debugMode) console.log(return_data);
            }
        }
        // Send the data to PHP now... and wait for response to update the status div
        hr.send(vars); // Actually execute the request
        if(debugMode) console.log("processing...");
    
    },

    //Calculation help functions
    func_getRndDivisor: function(number){ //Get random divisor for a number

        var div = []; //Divisors found
        var p = 0; //current dividor index
        for(var i=2; i<number;i++){
            if(number%i==0){
                div[p] = i;
                p++;
            }
        }
        var x = game.rnd.integerInRange(0,p-1);
        return div[x];

    },
    
};

/****************************** END ****************************/

var endSquareTwo = {

    create: function() {  

        // Background
        game.add.image(0, 0, 'bgimage');
                
        //Clouds
        game.add.image(300, 100, 'cloud');
        game.add.image(660, 80, 'cloud');
        game.add.image(110, 85, 'cloud').scale.setTo(0.8);
        
        // Styles for labels
        var stylePlace = { font: '26px Arial', fill: '#400080', align: 'center'};
        var styleLabel = { font: '26px Arial', fill: '#000080', align: 'center'};
        var styleMenu = { font: '30px Arial', fill: '#000000', align: 'center'};
        
        //Floor
        for(var i=0;i<9;i++){
            game.add.image(i*100, 501, 'floor');
        }
        
        // Progress bar
        for(var p=1;p<=5;p++){
            var block = game.add.image(660+(p-1)*30, 10, 'block');
            block.scale.setTo(2, 1); //Scaling to double width
        }
        game.add.text(820, 10, '100%', styleMenu);
        game.add.text(650, 10, lang.difficulty + ' ' + levelDifficulty, styleMenu).anchor.setTo(1,0);
        game.add.image(660, 10, 'pgbar');
        
        //School and trees
        game.add.sprite(600, 222 , 'school').scale.setTo(0.7);
        game.add.sprite(30, 280 , 'tree4');
        game.add.sprite(360, 250 , 'tree2');
        
        //kid
        this.kid = game.add.sprite(0, 460 , 'kid_run');
        this.kid.anchor.setTo(0.5,0.5);
        this.kid.scale.setTo(0.7);
        this.kid.animations.add('walk', [0,1,2,3,4,5,6,7,8,9,10,11]);
        this.kid.animations.play('walk', 6, true);

    },

    update: function() {

        if(this.kid.x<=700){
            this.kid.x += 2;
        }else{
            if(levelMenu){            	
            	passedLevels = 0;
                game.state.start('menu');
            }else{
                this.kid.animations.stop();
            }
        }

    },
    
    func_verPrincipal: function(){
        game.state.start('welcome');
    },
          
};
