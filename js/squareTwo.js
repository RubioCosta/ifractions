/*

    let gameSquareTwo = {
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
        
*/

// Fractions Comparison Square states

let gameSquareTwo = {

    create: function() {  
        
        //timer
        totalTime = 0;
        timer = game.time.create(false);
        timer.loop(1000, this.func_updateCounter, this);
        timer.start();        
        
        points = [2,4,6,8,9,10,12,14,15,16,18,20];

        // Background
        game.add.image(0, 0, 'bgimage');
        
        // Calls function that loads navigation icons
        iconSettings.func_addIcons(true,true,
                                    true,true,false,
                                    true,false,
                                    'difficulty', false);

        //Clouds
        game.add.image(300, 100, 'cloud');
        game.add.image(660, 80, 'cloud');
        game.add.image(110, 85, 'cloud').scale.setTo(0.8);

        //Floor
        for(let i=0;i<9;i++){
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
        
        let rPoint = game.rnd.integerInRange((levelDifficulty-1)*2+1,(levelDifficulty-1)*2+3);
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
        if(sublevelType!="C"){
            xA=230, yA=90;
            xB=xA, yB=yA+3*blockH+30;
        }else{
            xB=230, yB=90;
            xA=xB, yA=yB+3*blockH+30;
        }
             
        //Blocks A
        let widthA = blockW/sizeA;
        let lineColor = 0x1e2f2f;
        let fillColor = 0x83afaf;
        let fillColorS = 0xe0ebeb;
        
        for(let i=0; i<sizeA; i++){
            //if(debugMode) console.log("Block A"+i+": x:"+(xA+i*widthA)+", y:"+yA);
                        
            let block = game.add.graphics(xA+i*widthA, yA);
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
            let xAux = xA+i*widthA, yAux = yA+blockH+10;
            if(sublevelType == 'C') yAux = yA;
                block = game.add.graphics(xAux, yAux );
                block.anchor.setTo(0.5, 0.5);
                block.lineStyle(1, lineColor);
                block.beginFill(fillColorS);
                block.drawRect(0, 0, widthA, blockH);
                
                if(sublevelType!='A') block.alpha = 0;
                else block.alpha = 0.2;
                    
            auxblqA.add(block);
            
        }
        
        //label block A
        let labelX = xA+blockW+30;
        let labelY = yA+blockH/2;
        labelA = game.add.text(labelX, labelY, sizeA , textStyles.valueLabelBlue3);
        labelA.anchor.setTo(0.5, 0.41);
        
        //label fraction
        labelX = xA+(blockA*widthA)+40;
        labelY = yA+blockH+34;
        fractionA = game.add.text(labelX, labelY, "0\n"+sizeA , textStyles.valueLabelBlue3);
        fractionA.anchor.setTo(0.5, 0.41);
        separatorA = game.add.sprite(labelX, labelY, 'separator');
        separatorA.anchor.setTo(0.5, 0.5);
        
        fractionA.alpha = 0;
        separatorA.alpha = 0;
        
        //Blocks B
        let widthB = blockW/sizeB;
        lineColor = 0x260d0d;
        fillColor = 0xd27979;
        fillColorS = 0xf2d9d9;
               
        for(let i=0; i<sizeB; i++){
                        
            let block = game.add.graphics(xB+i*widthB, yB);
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
            let xAux = xB+i*widthB, yAux = yB+blockH+10;
            if(sublevelType == 'C') yAux = yB;
                block = game.add.graphics(xAux, yAux);
                block.anchor.setTo(0.5, 0.5);
                block.lineStyle(1, lineColor);
                block.beginFill(fillColorS);
                block.drawRect(0, 0, widthB, blockH);
                
                if(sublevelType!='A') block.alpha = 0;
                else block.alpha = 0.2;
            auxblqB.add(block);
            
        }
        
        //label block B
        labelX = xA+blockW+30;
        labelY = yB+blockH/2;
        labelB = game.add.text(labelX, labelY, sizeB , textStyles.valueLabelBlue3);
        labelB.anchor.setTo(0.5, 0.41);    
                
        //label fraction
        labelX = xA+(blockB*widthB)+40;
        labelY = yB+blockH+34;
        fractionB = game.add.text(labelX, labelY, "0\n"+sizeB , textStyles.valueLabelBlue3);
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
    		    		
        	let xPos = game.input.mousePointer.x;
        	
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
            for(let i=0;i<valueA;i++){
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
            for(let i=0;i<valueB;i++){
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
                    if(audioStatus) okSound.play();
                    kid.animations.stop();

                    passedLevels++;        
                    if(debugMode) console.log("passedLevels = " + passedLevels); 
                    okImg.alpha = 1;
                //fractions are not equivalent
                }else{
                    result = false;
                    levelMove = false;
                    if(audioStatus) errorSound.play();
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
                for(let i=0;i<sizeA;i++){
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
                for(let i=0;i<sizeB;i++){
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
            for(let i=0;i<=this.indice;i++){
                blocksA.children[i].alpha = 0.5;
            }
            fractionA.alpha = 0;
        }
        if(!clickB && this.who=="B"){
            for(let i=0;i<=this.indice;i++){
                blocksB.children[i].alpha = 0.5;
            }
            fractionB.alpha = 0;
        }

    },
    
    func_clickSquare: function(){

        if(!clickA && this.who=="A" && this.indice!=sizeA-1){
            for(let i=0;i<sizeA;i++){
                blocksA.children[i].inputEnabled = false;
                if(i<=this.indice){
                    blocksA.children[i].alpha = 1;
                }else{
                    blocksA.children[i].alpha = 0.5;
                    auxblqA.children[i].alpha = 0;
                }
            }
            labelA.alpha = 0;
            if(audioStatus) beepSound.play();
            clickA = true;
            valueA = this.indice+1;
            fractionA.x = xA+(valueA*(blockW/sizeA))+40;
            separatorA.x = fractionA.x
            animateA = true;
        }

        if(!clickB && this.who=="B" && this.indice!=sizeB-1){
            for(let i=0;i<sizeB;i++){
                blocksB.children[i].inputEnabled = false;
                if(i<=this.indice){
                    blocksB.children[i].alpha = 1;
                }else{
                    blocksB.children[i].alpha = 0.5;
                    auxblqB.children[i].alpha = 0;
                }
            }
            labelB.alpha = 0;
            if(audioStatus) beepSound.play();
            clickB = true;
            valueB = this.indice+1;
            fractionB.x = xB+(valueB*(blockW/sizeB))+40;
            separatorB.x = fractionB.x
            animateB = true;
        }

    },
    
    func_postScore: function (){
    
        let abst = "numBlocksA:" + sizeA + ", valueA: " + valueA +", numBlocksB: " + sizeB + ", valueB: " + valueB;
        
        let hr = new XMLHttpRequest();
        // Create some variables we need to send to our PHP file
        let url = "php/save.php";
        let vars = "s_ip="+hip+"&s_name=" + username + "&s_lang=" + langString + "&s_game=" + levelShape + "&s_mode=" + levelType;
        vars += "&s_oper=Equal&s_leve=" + levelDifficulty + "&s_posi=" + levelPosition + "&s_resu=" + result + "&s_time=" + totalTime + "&s_deta=" + abst;
        
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

    //Calculation help functions
    func_getRndDivisor: function(number){ //Get random divisor for a number

        let div = []; //Divisors found
        let p = 0; //current dividor index
        for(let i=2; i<number;i++){
            if(number%i==0){
                div[p] = i;
                p++;
            }
        }
        let x = game.rnd.integerInRange(0,p-1);
        return div[x];

    },
    
};