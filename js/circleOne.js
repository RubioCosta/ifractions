/*

    let gameCircleOne = {
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

*/

// Kid and Circle states, games 1 and 2

let gameCircleOne = {

    create: function() {
        
        //timer
        totalTime = 0;
        timer = game.time.create(false);
        timer.loop(1000, this.func_updateCounter, this);
        timer.start();
        detail="";

        // Sets background image
        game.add.image(0, 0, 'bgimage');

        // Calls function that loads navigation icons
        iconSettings["func_addButtons"](true,true,
                                    true,true,true,
                                    true,false,
                                    'difficulty', this.func_viewHelp);
        
        //Clouds
        game.add.image(300, 100, 'cloud');
        game.add.image(660, 80, 'cloud');
        game.add.image(110, 85, 'cloud').scale.setTo(0.8);
        
        // Styles for labels
        let stylePlace = { font: '26px Arial', fill: '#400080', align: 'center'};
        let styleLabel = { font: '26px Arial', fill: '#000080', align: 'center'};
        let styleMenu = { font: '30px Arial', fill: '#000000', align: 'center'};
        
        //Floor and road
        startX = 66; //Initial kid and place position
        if(levelOperator=='Minus') startX = 66+5*156;
        
        placeDistance = 156; //Distance between places
        blockSize = 60;
        for(let i=0;i<9;i++){
            game.add.image(i*100, 501, 'floor');
        }
        let road = game.add.image(47, 515, 'road');
        road.scale.setTo(1.01,0.94);
        if(levelType=='A'){
            road.inputEnabled = true;
            road.events.onInputDown.add(this.func_setPlace, {beep: beepSound}); //enabling input for tablets
        }
        
        for(let p=0;p<=5;p++){// Places
            let place = game.add.image(66+p*placeDistance, 526, 'place_a');
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
        let maxBlocks = levelPosition+1; //Maximum blocks according to difficulty
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
        
        for(let p=0;p<numBlocks;p++){

            let portion = game.rnd.integerInRange(1, levelDifficulty); //Portion of the circle, according to difficulty
            detail += portion+",";
            
            if(portion==levelDifficulty){
                hasFigure = true;
            }
            
            let direction = '';
            let lineColor = '';
            if(levelOperator=='Mixed'){
                if(p<=numPlus){
                    direction = 'Right';
                    lineColor = 0x31314e;
                }else{
                    direction = 'Left';
                    lineColor = 0xb30000;
                }
                /*let directions = ['Right','Left'];
                let rndIndex = game.rnd.integerInRange(0, 1);
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
            let block = game.add.graphics(startX, 490-p*blockSize);
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
                    let labelX = startX;
                    if(levelOperator=='Minus') labelX -= 65;
                    else labelX += 65;
                    let label = game.add.text(labelX, 490-p*blockSize, portion , styleLabel);
                    label.anchor.setTo(0.5, 0.5);
                    blockLabel.add(label);
                }
            }else{
                let distance = 360/portion+5;
                block.arc(0, 0, blockSize/2, game.math.degToRad(distance), 0, true);

                blockDistance.push(Math.floor(placeDistance/portion));
                blockAngle.push(distance);

                if(levelLabel){
                    let labelX = startX;
                    if(levelOperator=='Minus') labelX -= 65;
                    else labelX += 65;
                    let separator = game.add.sprite(labelX, 485-p*blockSize, 'separator');
                    separator.anchor.setTo(0.5, 0.5);
                    blockSeparator.add(separator);
                    let label = game.add.text(labelX, 488-p*blockSize, '1\n'+portion , styleLabel);
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
            for(let i=0;i<endIndex;i++){
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
            
            let color = '';
            if(blockDirection[curBlock]=='Right'){
                kid_walk.x+=2;
                color = 'rgba(0, 51, 153, 1)';
            }else if(blockDirection[curBlock]=='Left'){
                kid_walk.x-=2;
                color = 'rgba(179, 0, 0, 1)';
            }
            
            trace.rect(kid_walk.x, 526, 2, 2, color);
            
            for(let i=0;i<numBlocks;i++){ //Moving every block
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
            for(let i=0;i<numBlocks;i++){
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
            for(let i=0;i<=this.indice;i++){
                blocks.children[i].alpha = 0.5;
            }
        }

    },
    
    func_clickCircle: function(){

        if(!clicked){
            let minusBlocks = 0;
            
            for(let i=0;i<numBlocks;i++){
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
    
        let abst = "numCircles:" + numBlocks + ", valCircles: " + detail + " balloonX: " + basket.x + ", selIndex: " + fractionIndex;

        let lang_str = "pt_BR"; //TODO NAO esta pegando a lingua definida pelo usuario!

        let hr = new XMLHttpRequest();
        // Create some variables we need to send to our PHP file
        let url = "php/save.php";
        let vars = "s_ip=" + hip + "&s_name=" + username + "&s_lang=" + lang + "&s_game=" + levelShape + "&s_mode=" + levelType;

        vars += "&s_oper=" + levelOperator + "&s_leve=" + levelDifficulty + "&s_posi=" + levelPosition + "&s_resu=" + result + "&s_time=" + totalTime + "&s_deta=" + abst;
        
        hr.open("POST", url, true);
        hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        hr.onreadystatechange = function() {
            if(debugMode) console.log(hr);

            if(hr.readyState == 4 && hr.status == 200) {
                let return_data = hr.responseText;
                if(debugMode) console.log(return_data);
            }
        }
        // Send the data to PHP now... and wait for response to update the status div
        hr.send(vars); // Actually execute the request
        if(debugMode) console.log("processing...");

    },
            
    func_viewHelp: function(){

        if(!clicked){
            let pointer;
            if(levelType=='A'){
                pointer = game.add.image(endPosition, 490, 'pointer');
            }else{
                pointer = game.add.image(blocks.children[endIndex-1].x, blocks.children[endIndex-1].y-blockSize/2, 'pointer');
            }
            pointer.anchor.setTo(0.5, 0);
            pointer.alpha = 0.7;
        }

    },
    
    func_checkOverlap: function (spriteA, spriteB) {

        let xA = spriteA.x;
        let xB = spriteB.x;
                
        if(Math.abs(xA-xB)>14){
            return false;
        }else{
            return true;
        }

    }
    
};