
/*
    var menuCircleOne = {
        create: function(){},
        ---------------------------- end of phaser functions
        func_loadMap: function(){}
    };

    var gameCircleOne = {
        create: function(){},
        update: function(){},
        ---------------------------- end of phaser functions
        func_updateCounter: function(){},
        func_overCircle: function(){},
        func_outCircle: function(){},
        func_clickCircle: function(){},
        func_setPlace: function(){},
        func_postScore: function(){},
        func_viewHelp: function(){},
        func_checkOverlap: function(_,_){}
            //func_getRndDivisor: function(){}
    };

    var endCircleOne = {
        create: function(){},
        update: function(){},
        ---------------------------- end of phaser functions
        func_verPrincipal: function(){},
    };
*/

// Kid and Circle states, games 1 and 2

/****************************** MENU ****************************/

var menuCircleOne = {
    
    create: function() {
                
        // Navigation buttons
        buttonSettings["func_addButtons"](1,1,
                                    0,1,0,
                                    1,0,
                                    0,0);        
        
        // Title
        var style = { font: '28px Arial', fill: '#00804d'};
        var title = game.add.text(game.world.centerX, 40, lang.game_menu_title, style);
        title.anchor.setTo(0.5, 0.5);
                
        //SETTING DIFFICULTY LEVELS

        var maxHeight = 120; //Max height of a stair
        var stairHeight = 29; //height growth of a stair
        var stairWidth = 85; //Width of a stair
        var startStair = 240;
        var startSymbol = 150;
        var startCircle = (startSymbol/2)+startStair+stairWidth*5;
        
         //First stairs, plus, 5 levels, blue circle

        var blueCircle = game.add.graphics(startCircle, 195);
            blueCircle.anchor.setTo(0.5,0.5);
            blueCircle.lineStyle(2, 0x31314e);
            blueCircle.beginFill(0xefeff5);
            blueCircle.drawCircle(0, 0, 60);
            blueCircle.endFill();

        var plusArrowIcon = game.add.sprite(startSymbol+40, 195, 'h_arrow'); 
            plusArrowIcon.scale.setTo(0.35);
            plusArrowIcon.alpha = 0.8;
            plusArrowIcon.anchor.setTo(0.5,0.5);

        var plusKidIcon = game.add.sprite(startSymbol, 195, 'kid_walk'); 
            plusKidIcon.scale.setTo(0.6);
            plusKidIcon.alpha = 0.8;
            plusKidIcon.anchor.setTo(0.5,0.5);
        
        var stairsPlus = [];

        for(var i=1;i<=5;i++){
            //stair
            var x1 = startStair+(stairWidth*(i-1));
            var y1 = 135+maxHeight-i*stairHeight;
            var x2 = stairWidth;//x1 + 40;
            var y2 = stairHeight*i;//y1 + 24;
            
            stairsPlus[i] = game.add.graphics(0, 0);
            stairsPlus[i].lineStyle(1, 0xFFFFFF, 1);
            stairsPlus[i].beginFill(0x99b3ff);
            stairsPlus[i].drawRect(x1, y1, x2, y2);
            stairsPlus[i].endFill();
            
            //event
            stairsPlus[i].inputEnabled = true;
            stairsPlus[i].input.useHandCursor = true;
            stairsPlus[i].events.onInputDown.add(this.func_loadMap, {beep: beepSound, difficulty: i, operator: 'Plus' });
            stairsPlus[i].events.onInputOver.add(function (item) { item.alpha=0.5; }, this);
            stairsPlus[i].events.onInputOut.add(function (item) { item.alpha=1; }, this);
            
            //label
            var xl = x1+stairWidth/2; //x label
            var yl = y1+(stairHeight*i)/2; //y label
            var label = game.add.text(xl, yl, i, { font: '25px Arial', fill: '#ffffff', align: 'center' });
                label.anchor.setTo(0.5, 0.4);
        }
        
        //Second stairs, minus, 5 levels, red circle

        var redCircle = game.add.graphics(startCircle, 350);
            redCircle.anchor.setTo(0.5,0.5);
            redCircle.lineStyle(2, 0xb30000);
            redCircle.beginFill(0xefeff5);
            redCircle.drawCircle(0, 0, 60);
            redCircle.endFill();

        var minusArrowIcon = game.add.sprite(startSymbol, 350, 'h_arrow');
            minusArrowIcon.scale.setTo(-0.35, 0.35);
            minusArrowIcon.alpha = 0.8;
            minusArrowIcon.anchor.setTo(0.5,0.5);

        var minusKidIcon = game.add.sprite(startSymbol+40, 350, 'kid_walk');
            minusKidIcon.scale.setTo(-0.6, 0.6);
            minusKidIcon.alpha = 0.8;
            minusKidIcon.anchor.setTo(0.5,0.5);

        var stairsMinus = [];

        for(var i=1;i<=5;i++){
            //stair
            var x1 = startStair+(stairWidth*(i-1));
            var y1 = 285+maxHeight-i*stairHeight;
            var x2 = stairWidth;//x1 + 40;
            var y2 = stairHeight*i;//y1 + 24;
            
            stairsMinus[i] = game.add.graphics(0, 0);
            stairsMinus[i].lineStyle(1, 0xFFFFFF, 1);
            stairsMinus[i].beginFill(0xff6666);
            stairsMinus[i].drawRect(x1, y1, x2, y2);
            stairsMinus[i].endFill();
            
            //event
            stairsMinus[i].inputEnabled = true;
            stairsMinus[i].input.useHandCursor = true;
            stairsMinus[i].events.onInputDown.add(this.func_loadMap, {beep: beepSound, difficulty: i, operator: 'Minus' });
            stairsMinus[i].events.onInputOver.add(function (item) { item.alpha=0.5; }, this);
            stairsMinus[i].events.onInputOut.add(function (item) { item.alpha=1; }, this);
            //label
            var xl = x1+stairWidth/2; //x label
            var yl = y1+(stairHeight*i)/2; //y label
            var label = game.add.text(xl, yl, i, { font: '25px Arial', fill: '#ffffff', align: 'center' });
                label.anchor.setTo(0.5, 0.4);
        } 
        
        //Thrid stairs, mixed, 5 levels, two circles

        var blueCircle2 = game.add.graphics(startCircle-30, 500);
            blueCircle2.anchor.setTo(0.5,0.5);
            blueCircle2.lineStyle(2, 0x31314e);
            blueCircle2.beginFill(0xefeff5);
            blueCircle2.drawCircle(0, 0, 60);
            blueCircle2.endFill();
        
        var redCircle2 = game.add.graphics(startCircle+40, 500);
            redCircle2.anchor.setTo(0.5,0.5);
            redCircle2.lineStyle(2, 0xb30000);
            redCircle2.beginFill(0xefeff5);
            redCircle2.drawCircle(0, 0, 60);
            redCircle2.endFill();
        
        var doubleArrowIcon = game.add.sprite(startSymbol, 500, 'h_double'); 
            doubleArrowIcon.scale.setTo(0.5);
            doubleArrowIcon.anchor.setTo(0.5,0.5);
            doubleArrowIcon.alpha = 0.8;
        
        var stairsMixed = [];

        for(var i=1;i<=5;i++){
            //stair
            var x1 = startStair+(stairWidth*(i-1));
            var y1 = 435+maxHeight-i*stairHeight;
            var x2 = stairWidth;//x1 + 40;
            var y2 = stairHeight*i;//y1 + 24;
            
            stairsMixed[i] = game.add.graphics(0, 0);
            stairsMixed[i].lineStyle(1, 0xFFFFFF, 1);
            stairsMixed[i].beginFill(0xb366ff);
            stairsMixed[i].drawRect(x1, y1, x2, y2);
            stairsMixed[i].endFill();
            
            //event
            stairsMixed[i].inputEnabled = true;
            stairsMixed[i].input.useHandCursor = true;
            stairsMixed[i].events.onInputDown.add(this.func_loadMap, {beep: beepSound, difficulty: i, operator: 'Mixed' });
            stairsMixed[i].events.onInputOver.add(function (item) { item.alpha=0.5; }, this);
            stairsMixed[i].events.onInputOut.add(function (item) { item.alpha=1; }, this);
            
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
        levelOperator = this.operator; //Operator of game
        passedLevels = 0; //reset the game progress when entering a new level

        game.state.start('map');

    }
    
};

/****************************** GAME ****************************/

var gameCircleOne = {

    create: function() {
        
        //timer
        totalTime = 0;
        timer = game.time.create(false);
        timer.loop(1000, this.func_updateCounter, this);
        timer.start();
        detail="";

        // Background
        game.add.image(0, 0, 'bgimage');

        // Navigation buttons
        buttonSettings["func_addButtons"](1,1,
                                    1,1,1,
                                    1,0,
                                    "menuCircleOne", this.func_viewHelp);
        
        //Clouds
        game.add.image(300, 100, 'cloud');
        game.add.image(660, 80, 'cloud');
        game.add.image(110, 85, 'cloud').scale.setTo(0.8);
        
        // Styles for labels
        var stylePlace = { font: '26px Arial', fill: '#400080', align: 'center'};
        var styleLabel = { font: '26px Arial', fill: '#000080', align: 'center'};
        var styleMenu = { font: '30px Arial', fill: '#000000', align: 'center'};
        
        //Floor and road
        startX = 66; //Initial kid and place position
        if(levelOperator=='Minus') startX = 66+5*156;
        
        placeDistance = 156; //Distance between places
        blockSize = 60;
        for(var i=0;i<9;i++){
            game.add.image(i*100, 501, 'floor');
        }
        var road = game.add.image(47, 515, 'road');
        road.scale.setTo(1.01,0.94);
        if(levelType=='A'){
            road.inputEnabled = true;
            road.events.onInputDown.add(this.func_setPlace, {beep: beepSound}); //enabling input for tablets
        }
        
        for(var p=0;p<=5;p++){// Places
            var place = game.add.image(66+p*placeDistance, 526, 'place_a');
            place.anchor.setTo(0.5);
            place.scale.setTo(0.3);
            game.add.text(66+p*placeDistance, 560, p , stylePlace).anchor.setTo(0.5); 
        }
        
        //Control variables
        clicked = false; //Air ballon positioned
        hideLabels = false; //Labels animations
        animate = false; //Start move animation
        checkCollide = false; //Check kid inside ballon's basket
        result = false; //Game is correct
        fly = false; //Start ballon fly animation
        flyCounter = 0; //Fly counter
        flyEnd = 140; //Fly end counter
        hasFigure = false; //If has level figure
        //trace
        trace = this.add.bitmapData(this.game.width, this.game.height);
        trace.addToWorld();
        trace.clear();
                
        //generator
        //Circles and fractions
        var maxBlocks = levelPosition+1; //Maximum blocks according to difficulty
        if(levelType=='B' || levelOperator=='Mixed') maxBlocks = 6;
        blocks = game.add.group(); //Fraction arrays
        numBlocks = game.rnd.integerInRange(levelPosition, maxBlocks); //Number of blocks
        curBlock = 0; //Actual index block
        blockDirection = []; //Directions right(plus), left (minus)
        blockDistance = []; //Displacement distance of the blocks
        blockLabel = game.add.group(); //Labels of the blocks
        blockSeparator = game.add.group(); //Separator of the labels
        blockAngle = []; //Angles of blocks
        blockTraceColor = []; //Trace colors
        endPosition = startX; //Ending position, accumulative
        
        //Game B exclusive variables
        balloonPlace = this.game.world.centerX; //Fixed place for ballon (game B)
        fractionClicked = false; //If clicked a fraction (game B)
        fractionIndex = -1; //Index of clicked fraction (game B)
        numPlus = game.rnd.integerInRange(1, numBlocks-1);
        
        for(var p=0;p<numBlocks;p++){

            var portion = game.rnd.integerInRange(1, levelDifficulty); //Portion of the circle, according to difficulty
            detail += portion+",";
            
            if(portion==levelDifficulty){
                hasFigure = true;
            }
            
            var direction = '';
            var lineColor = '';
            if(levelOperator=='Mixed'){
                if(p<=numPlus){
                    direction = 'Right';
                    lineColor = 0x31314e;
                }else{
                    direction = 'Left';
                    lineColor = 0xb30000;
                }
                /*var directions = ['Right','Left'];
                var rndIndex = game.rnd.integerInRange(0, 1);
                direction = directions[rndIndex];
                if(rndIndex==0) lineColor = 0x31314e;
                else lineColor = 0xb30000;*/
            }else if(levelOperator=='Plus'){
                direction = 'Right';    
                lineColor = 0x31314e;
            }else if(levelOperator=='Minus'){
                direction = 'Left';
                lineColor = 0xb30000;
            }
            
            blockTraceColor[p] = lineColor;
            var block = game.add.graphics(startX, 490-p*blockSize);
                block.anchor.setTo(0.5,0.5);

                block.lineStyle(2, lineColor);
                block.beginFill(0xefeff5);
            
            if (direction == 'Right')  block.scale.y *= -1;

            blockDirection[p] = direction;
                        
            if(portion==1){
                block.drawCircle(0, 0, blockSize);

                blockDistance.push(placeDistance);
                blockAngle.push(360);

                if(levelLabel){
                    var labelX = startX;
                    if(levelOperator=='Minus') labelX -= 65;
                    else labelX += 65;
                    var label = game.add.text(labelX, 490-p*blockSize, portion , styleLabel);
                    label.anchor.setTo(0.5, 0.5);
                    blockLabel.add(label);
                }
            }else{
                var distance = 360/portion+5;
                block.arc(0, 0, blockSize/2, game.math.degToRad(distance), 0, true);

                blockDistance.push(Math.floor(placeDistance/portion));
                blockAngle.push(distance);

                if(levelLabel){
                    var labelX = startX;
                    if(levelOperator=='Minus') labelX -= 65;
                    else labelX += 65;
                    var separator = game.add.sprite(labelX, 485-p*blockSize, 'separator');
                    separator.anchor.setTo(0.5, 0.5);
                    blockSeparator.add(separator);
                    var label = game.add.text(labelX, 488-p*blockSize, '1\n'+portion , styleLabel);
                    label.anchor.setTo(0.5, 0.5);
                    blockLabel.add(label);
                }
            }

            if(direction=='Right'){
                endPosition += Math.floor(placeDistance/portion);
            }else if(direction=='Left'){
                endPosition -= Math.floor(placeDistance/portion);
            }

            block.endFill();
            block.angle +=90;
            
            //If game is type B, (select fractions, adding event)
            if(levelType=='B'){
                block.alpha = 0.5;
                block.inputEnabled = true;
                block.input.useHandCursor = true;
                block.events.onInputDown.add(this.func_clickCircle, {indice: p});
                block.events.onInputOver.add(this.func_overCircle, {indice: p});
                block.events.onInputOut.add(this.func_outCircle, {indice: p});
            }
            
            blocks.add(block);
        }
        
        //Calculate next block
        if(blockDirection[curBlock]=='Right'){
            nextEnd = startX+blockDistance[curBlock];
        }else{
            nextEnd = startX-blockDistance[curBlock];
        }
        
        //If game is type B, selectiong a random balloon place
        
        if(levelType=='B'){
            balloonPlace = startX;
            endIndex = game.rnd.integerInRange(numPlus, numBlocks);
            for(var i=0;i<endIndex;i++){
                if(blockDirection[i]=='Right')
                    balloonPlace += blockDistance[i];
                else if(blockDirection[i]=='Left')
                    balloonPlace -= blockDistance[i];
            }
            if(balloonPlace<66 || balloonPlace>66+5*placeDistance || !hasFigure){
                game.state.start('gameCircleOne');
            }
        }
        
        //If end position is out of bounds, restart
        if (endPosition<66 || endPosition>66+3*260 || !hasFigure){
            game.state.start('gameCircleOne');
        }
        //kid
        kid_walk = game.add.sprite(startX, 495-numBlocks*blockSize, 'kid_walk');
        kid_walk.anchor.setTo(0.5, 0.8);
        kid_walk.scale.setTo(0.8);
        kid_walk.animations.add('right',[0,1,2,3,4,5,6,7,8,9,10,11]);
        kid_walk.animations.add('left',[23,22,21,20,19,18,17,16,15,14,13,12]);
        if(levelOperator=='Minus'){
            kid_walk.animations.play('left', 6, true);
            kid_walk.animations.stop();
        }
        //globo
        balloon = game.add.sprite(balloonPlace, 350, 'balloon');
        balloon.anchor.setTo(0.5, 0.5);
        balloon.alpha = 0.5;
        basket = game.add.sprite(balloonPlace, 472, 'balloon_basket');
        basket.anchor.setTo(0.5, 0.5);
        
        //ok and error images
        okImg = game.add.image(game.world.centerX, game.world.centerY, 'h_ok');
        okImg.anchor.setTo(0.5);
        okImg.alpha = 0;
        errorImg = game.add.image(game.world.centerX, game.world.centerY, 'h_error');
        errorImg.anchor.setTo(0.5);
        errorImg.alpha = 0;

    },
    
    update: function() {
       
        if (game.input.activePointer.isDown && !fly && !clicked){
            //Positionate balloon - Game A
            if(levelType=='A'){
                if(game.input.mousePointer.y>60){ //Dead zone for click
                    balloon.x = game.input.mousePointer.x;
                    balloon.alpha = 1;
                    clicked = true;
                    animate = true;
                    if(audioStatus){
                        beepSound.play();
                    }
                    if(blockDirection[curBlock]=='Right'){
                        kid_walk.animations.play('right', 6, true);
                    }else{
                        kid_walk.animations.play('left', 6, true);
                    }

                    if(levelLabel){ //Hiding labels
                        blockLabel.visible = false;
                        blockSeparator.visible = false;
                    }
                }
            }
        }
        
        if(!clicked){
            if(!fly){
                if(levelType=="A"){
                    //Follow mouse
                    if (game.physics.arcade.distanceToPointer(balloon, game.input.activePointer) > 8){
                        balloon.x = game.input.mousePointer.x;
                        basket.x = game.input.mousePointer.x;
                    }
                }
            }
        }
        
        
        //Start animation
        if(animate){
            
            var color = '';
            if(blockDirection[curBlock]=='Right'){
                kid_walk.x+=2;
                color = 'rgba(0, 51, 153, 1)';
            }else if(blockDirection[curBlock]=='Left'){
                kid_walk.x-=2;
                color = 'rgba(179, 0, 0, 1)';
            }
            
            trace.rect(kid_walk.x, 526, 2, 2, color);
            
            for(var i=0;i<numBlocks;i++){ //Moving every block
                if(blockDirection[curBlock]=='Right'){
                    blocks.children[i].x +=2;
                }else{
                    blocks.children[i].x -=2;
                }
            }
            
            blockAngle[curBlock] -= 4.6;
            blocks.children[curBlock].clear();
            blocks.children[curBlock].lineStyle(2, blockTraceColor[curBlock]);
            blocks.children[curBlock].beginFill(0xefeff5);
            blocks.children[curBlock].arc(0, 0, blockSize/2, game.math.degToRad(blockAngle[curBlock]), 0, true);
            blocks.children[curBlock].endFill();
            
            if(blockDirection[curBlock]=='Right'){
                if(blocks.children[curBlock].x>=nextEnd){
                    blocks.children[curBlock].visible = false;
                    blocks.y += blockSize;
                    kid_walk.y += blockSize;
                    curBlock+=1;
                    if(blockDirection[curBlock]=='Right'){
                        nextEnd += blockDistance[curBlock];
                        kid_walk.animations.play('right', 6, true);
                    }else if(blockDirection[curBlock]=='Left'){
                        nextEnd -= blockDistance[curBlock];
                        kid_walk.animations.play('left', 6, true);
                    }
                }
            }else{
                if(blocks.children[curBlock].x<=nextEnd){
                    blocks.children[curBlock].visible = false;
                    blocks.y += blockSize;
                    kid_walk.y += blockSize;
                    curBlock+=1;
                    if(blockDirection[curBlock]=='Right'){
                        nextEnd += blockDistance[curBlock];
                        kid_walk.animations.play('right', 6, true);
                    }else if(blockDirection[curBlock]=='Left'){
                        nextEnd -= blockDistance[curBlock];
                        kid_walk.animations.play('left', 6, true);
                    }
                }
            }
            
            if(curBlock==numBlocks ){ //Final position
                animate= false;
                checkCollide = true;
            }       
        }
        
        //Check if kid is inside the basket
        if(checkCollide){
            kid_walk.animations.stop();            
            timer.stop();
            if(this.func_checkOverlap(basket,kid_walk)){
            	if(kid_walk.frame < 12)
            		kid_walk.frame = 24;	            
            	else
            		kid_walk.frame = 25;	            
                result = true;
            }else{
                result = false;
            }
            this.func_postScore();
            fly = true;
            checkCollide = false;
        }
        
        //Fly animation
        if(fly){
            
            if(flyCounter==0){
                if(result){
                    if(audioStatus){
                        okSound.play();
                    }
                    passedLevels++;        
                    if(debugMode) console.log("passedLevels = "+passedLevels);
                    okImg.alpha = 1;
                }else{
                    if(audioStatus){
                        errorSound.play();
                    }
                    errorImg.alpha = 1;
                }
            }
            
            flyCounter += 1;
            balloon.y -= 2;
            basket.y -= 2;
            
            if(result){
                kid_walk.y -=2;
            }
            
            if(flyCounter>=flyEnd){
                if(result){
                    levelMove = true;
                }else{
                    levelMove = false;
                }
                game.state.start('map');
            }
        }

    },

    func_updateCounter: function() {
        totalTime++;
    },
        
    func_overCircle: function(){
        
        if(!clicked){
            for(var i=0;i<numBlocks;i++){
                if(i<=this.indice){
                    blocks.children[i].alpha = 1;
                }else{
                    blocks.children[i].alpha = 0.5;
                }
            }
        }

    },

    func_outCircle: function(){
        if(!clicked){
            for(var i=0;i<=this.indice;i++){
                blocks.children[i].alpha = 0.5;
            }
        }

    },
    
    func_clickCircle: function(){

        if(!clicked){
            var minusBlocks = 0;
            
            for(var i=0;i<numBlocks;i++){
                if(i<=this.indice){
                    fractionIndex = this.indice;
                    blocks.children[i].alpha = 1;
                }else{
                    blocks.children[i].visible = false; //Delete unselected block
                    minusBlocks +=1; //number of blocks to reduce
                    kid_walk.y += blockSize; //Lowering kid
                }
            }
            
            numBlocks -= minusBlocks; //Final reduced blocks

            balloon.alpha = 1;
            clicked = true;
            animate = true;
            if(audioStatus){
                beepSound.play();
            }
            if(blockDirection[curBlock]=='Right'){
                kid_walk.animations.play('right', 6, true);
            }else{
                kid_walk.animations.play('left', 6, true);
            }

            if(levelLabel){ //Hiding labels
                blockLabel.visible = false;
                blockSeparator.visible = false;
            }
        }

    },

    func_setPlace: function(){

        if(!clicked){
            
            balloon.x = game.input.x;
            basket.x = game.input.x;

            balloon.alpha = 1;
            clicked = true;
            animate = true;
            if(audioStatus){
                beepSound.play();
            }
            if(blockDirection[curBlock]=='Right'){
                kid_walk.animations.play('right', 6, true);
            }else{
                kid_walk.animations.play('left', 6, true);
            }

            if(levelLabel){ //Hiding labels
                blockLabel.visible = false;
                blockSeparator.visible = false;
            }
        }

    },

    func_postScore: function (){
    
        var abst = "numCircles:" + numBlocks + ", valCircles: " + detail + " balloonX: " + basket.x + ", selIndex: " + fractionIndex;

        var lang_str = "pt_BR"; //TODO NAO esta pegando a lingua definida pelo usuario!

        var hr = new XMLHttpRequest();
        // Create some variables we need to send to our PHP file
        var url = "assets/cn/save.php";
        var vars = "s_ip=" + hip + "&s_name=" + username + "&s_lang=" + lang + "&s_game=" + levelShape + "&s_mode=" + levelType;

        vars += "&s_oper=" + levelOperator + "&s_leve=" + levelDifficulty + "&s_posi=" + levelPosition + "&s_resu=" + result + "&s_time=" + totalTime + "&s_deta=" + abst;
        
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
            
    func_viewHelp: function(){

        if(!clicked){
            var pointer;
            if(levelType=='A'){
                var pointer = game.add.image(endPosition, 490, 'pointer');
            }else{
                var pointer = game.add.image(blocks.children[endIndex-1].x, blocks.children[endIndex-1].y-blockSize/2, 'pointer');
            }
            pointer.anchor.setTo(0.5, 0);
            pointer.alpha = 0.7;
        }

    },
    
    func_checkOverlap: function (spriteA, spriteB) {

        var xA = spriteA.x;
        var xB = spriteB.x;
                
        if(Math.abs(xA-xB)>14){
            return false;
        }else{
            return true;
        }

    }
    
};

/****************************** END ****************************/

var endCircleOne = {
    
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
        this.kid = game.add.sprite(0, -152 , 'kid_run');
        this.kid.anchor.setTo(0.5,0.5);
        this.kid.scale.setTo(0.7);
        var walk = this.kid.animations.add('walk', [0,1,2,3,4,5,6,7,8,9,10,11]);
        
        //globo
        this.balloon = game.add.sprite(0, -260, 'balloon');
        this.balloon.anchor.setTo(0.5,0.5);
        this.basket = game.add.sprite(0, -150, 'balloon_basket');
        this.basket.anchor.setTo(0.5,0.5);
    
    },

    update: function() {   

        if(this.kid.y>=460){
            this.kid.animations.play('walk', 6, true);
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
        }else{
            this.balloon.y += 2;
            this.basket.y += 2;
            this.kid.y +=2;
            this.balloon.x += 1;
            this.basket.x += 1;
            this.kid.x +=1;
        }

    },
    
    func_verPrincipal: function(){
        game.state.start('welcome');
    },
   
};
