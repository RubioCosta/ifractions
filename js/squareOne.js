/*

    let gameSquareOne = {
        create: function(){},
        update: function(){},
        ---------------------------- end of phaser functions
        func_updateCounter: function(){},
        func_overSquare: function(){},
        func_outSquare: function(){},
        func_clickSquare: function(){},
            //func_setPlace: function(){},
        func_postScore: function(){},
        func_viewHelp: function(){},
            //func_checkOverlap: function(){}
            //func_getRndDivisor: function(){}
    };

*/

// Tractor and Square states

let gameSquareOne = {

    create: function() {  
        
        //timer
        totalTime = 0;
        timer = game.time.create(false);
        timer.loop(1000, this.func_updateCounter, this);
        timer.start();
        detail="";

        // Background
        game.add.image(0, 0, 'bgimage');
        
        // Calls function that loads navigation icons
        iconSettings.func_addIcons(true,true,
                                    true,true,true,
                                    true,false,
                                    'difficulty', this.func_viewHelp);

        // Clouds
        game.add.image(300, 100, 'cloud');
        game.add.image(660, 80,  'cloud');
        game.add.image(110, 85,  'cloud').scale.setTo(0.8);
                        
        //Initial tractor and place position
        let startX = 170;
        if(sublevelType=='Minus') startX = 730;
        startX = startX;    //Workaround for initial position inside update
        
        // Width and height of blocks and 'floor gaps'
        const blockWidth = 80; 
        const blockHeight = 40;
        // Floor gaps
        for(let i=0;i<9;i++){
            game.add.image(i*100, 501, 'floor');
        }
                
        //Control variables
        clicked = false;    //Floor blocks or apilled blocks clicked
        hideLabels = false; //Labels of blocks
        animate = false;    //Start move animation
        checkCollide = false;   //Check if tractor fon't any block left or floor hole
        result = false;     //Game is correct
        move = false;       //Continue tractor animation
        moveCounter = 0;    //Move counter
        moveEnd = 140;      //Move end counter
                
        //tractor
        let tractorAlign = -80;
        if(sublevelType=='Minus'){
            tractorAlign *= -1;
        } 
        this.tractor = game.add.sprite(startX+tractorAlign, 445, 'tractor');
        this.tractor.anchor.setTo(0.5, 0.5);
        this.tractor.scale.setTo(0.8);
        this.tractor.animations.add('right',[0,1,2,3,4]);
        if(sublevelType=='Minus'){
            this.tractor.scale.x *= -1;
        }

        //generator

        //Blocks and fractions
        if(debugMode) console.log("pos " +levelPosition); // position in the game map
        
        maxBlocks = levelPosition+4; //Maximum blocks
        if(levelType=='B' || sublevelType=='Mixed') maxBlocks = 10;
        blocks = game.add.group(); //Fraction arrays (apilled)
        numBlocks = game.rnd.integerInRange(levelPosition+2, maxBlocks); //Number of blocks
        
        if(debugMode) console.log("num " + numBlocks+", min " + (levelPosition+2) + ", max " + maxBlocks);
        
        curBlock = 0; //Actual index block
        blockDirection = []; //Directions right(plus), left (minus)
        blockDistance = []; //Displacement distance of the blocks
        blockLabel = game.add.group(); //Labels of the blocks
        blockSeparator = game.add.group(); //Separator of the labels
        //blockAngle = []; //Angles of blocks
        //blockTraceColor = []; //Trace colors
        endPosition = startX; //Ending position, accumulative
        if(sublevelType=='Minus') endPosition -= blockWidth;
        else endPosition += blockWidth;
        
        //Game A exclusive variables 
        floorBlocks = game.add.group(); //Selectable floor blocks
        floorIndex = -1; //Selected floor block
        floorCount = 8; //Number of floor blocks
        floorClicked = false; //If clicked portion of floor
        curFloor = -1;
        
        //Game B exclusive variables
        arrowPlace = startX; //Fixed place for help arrow
        if(sublevelType=='Minus') arrowPlace  -= blockWidth;
        else arrowPlace += blockWidth;
        fractionClicked = false; //If clicked a fraction (game B)
        fractionIndex = -1; //Index of clicked fraction (game B)
        
        hasFigure = false;

        for(let p=0;p<numBlocks;p++){

            let portion = game.rnd.integerInRange(1, levelDifficulty); //Portion of the square, according to difficulty
            if(portion==3) detail+= "4,";
            else detail += portion+",";
            
            if(portion==levelDifficulty) hasFigure = true;
            let direction = '';
            let lineColor = '';
            
            if(sublevelType=='Plus'){
                direction = 'Right';    
                lineColor = 0x31314e; //plus block: "black'
            }else if(sublevelType=='Minus'){
                direction = 'Left';
                lineColor = 0xb30000;//minus block : "red"
            }
            
            //blocks close to tractor
            let block = game.add.graphics(startX, 460-p*blockHeight);
                block.anchor.setTo(0.5, 0.5);
                block.lineStyle(2, lineColor);
                block.beginFill(0xefeff5);

            blockDirection[p] = direction;
            
            if(portion==1){
                block.drawRect(0, 0, blockWidth, blockHeight);
                
                blockDistance.push(blockWidth);
                //blockAngle.push(360);

                if(levelLabel){
                    let labelX = startX;
                    if(sublevelType=='Minus') labelX -= (15+blockWidth);
                    else labelX += blockWidth+15;
                    let label = game.add.text(labelX, 480-p*blockHeight, portion , textStyles.valueLabelBlue);
                    label.anchor.setTo(0.5, 0.5);
                    blockLabel.add(label);
                }
            }else{
                if(portion==3) portion = 4;
                
                let distance = blockWidth/portion;
                
                block.drawRect(0, 0, distance, blockHeight);
                
                blockDistance.push(distance);

                if(levelLabel){
                    let labelX = startX;
                    if(sublevelType=='Minus') labelX -= (15+distance);
                    else labelX += 15+distance;
                    let separator = game.add.sprite(labelX, 480-p*blockHeight, 'separator');
                    separator.scale.setTo(0.6);
                    separator.anchor.setTo(0.5, 0.5);
                    blockSeparator.add(separator);
                    let label = game.add.text(labelX, 483-p*blockHeight, '1\n'+portion , textStyles.valueLabelBlue2);
                    label.anchor.setTo(0.5, 0.5);
                    blockLabel.add(label);
                }
            }

            if(direction=='Right'){
                endPosition += Math.floor(blockWidth/portion);
            }else if(direction=='Left'){
                endPosition -= Math.floor(blockWidth/portion);
                block.scale.x *= -1;
            }

            block.endFill();
            
            //If game is type B, (select fractions, adding event)
            if(levelType=='B'){
                block.alpha = 0.5;
                block.inputEnabled = true;
                block.input.useHandCursor = true;
                block.events.onInputDown.add(this.func_clickSquare, {indice: p, tractor: this.tractor});
                block.events.onInputOver.add(this.func_overSquare, {indice: p});
                block.events.onInputOut.add(this.func_outSquare, {indice: p});
            }
            
            blocks.add(block);
        }
        
        //Calculate next block
        if(blockDirection[curBlock]=='Right'){
            nextEnd = startX+blockDistance[curBlock];
        }else{
            nextEnd = startX-blockDistance[curBlock];
        }
        
        //If end position is out of bounds, restart
        if(!hasFigure) game.state.start('gameSquareOne');
        
        if (sublevelType=='Plus' && (endPosition<(startX+blockWidth) || endPosition>(startX+8*blockWidth))){
            game.state.start('gameSquareOne');
        }else if (sublevelType=='Minus' && (endPosition>(startX) || endPosition<(startX-(8*blockWidth)))){
            game.state.start('gameSquareOne');
        }
        
        //If game is type B, selectiong a random block floor place
        if(levelType=='B'){
            let end = game.rnd.integerInRange(1, numBlocks);
            for(let i=0;i<end;i++){
                if(blockDirection[i]=='Right')
                    arrowPlace += blockDistance[i];
                else if(blockDirection[i]=='Left')
                    arrowPlace -= blockDistance[i];
            }
        }
        
        //Selectable floor
        floorCount = 8*levelDifficulty;
        
        let widFloor = blockWidth/levelDifficulty;

        if(levelDifficulty==3){
            floorCount = 8*4;
            widFloor = blockWidth/4;
        }
        
        for(let i = 0; i < floorCount; i++){
            let posX = startX;
            
            if(sublevelType=='Minus') posX -= (blockWidth + i*widFloor);
            else posX += (blockWidth + i*widFloor);
            
            if(levelType=='B'){
                if(sublevelType=='Minus'){
                    if(posX<=arrowPlace){
                        floorCount = i+1;
                        floorIndex = i-1;
                        break;
                    }
                }else{
                    if(posX>=arrowPlace){
                        floorCount = i+1;
                        floorIndex = i-1;
                        break;
                    }
                }
            }

            // blocks on the floor
            let block = game.add.graphics(posX, 500);
                block.anchor.setTo(0.5, 0);
                block.lineStyle(0.9, 0xffffff);
                block.beginFill(0xa8c0e6);
                block.drawRect(0, 0, widFloor, blockHeight);
                block.endFill();
            if(sublevelType=='Minus') block.scale.x *= -1;
            
            if(levelType=="A"){
                block.alpha = 0.5;
                block.inputEnabled = true;
                block.input.useHandCursor = true;
                block.events.onInputDown.add(this.func_clickSquare, {indice: i, tractor: this.tractor});
                block.events.onInputOver.add(this.func_overSquare, {indice: i});
                block.events.onInputOut.add(this.func_outSquare, {indice: i});
            }
            
            floorBlocks.add(block);     
        }
        
        for(let i=0;i<=8;i++){
            let posX = startX;
            if(sublevelType=='Minus')posX -= ((9-i)*blockWidth);
            else posX+=((i+1)*blockWidth);
            
            game.add.text(posX, 560, i, textStyles.valueLabelBlue).anchor.setTo(0.5, 0.5); 
        }
        
        //ok and error images
        okImg = game.add.image(game.world.centerX, game.world.centerY, 'h_ok');
        okImg.anchor.setTo(0.5);
        okImg.alpha = 0;
        errorImg = game.add.image(game.world.centerX, game.world.centerY, 'h_error');
        errorImg.anchor.setTo(0.5);
        errorImg.alpha = 0;
        
         //Help arrow
        arrow = game.add.sprite(this.arrowPlace, 480, 'down');
        arrow.anchor.setTo(0.5, 0.5);
        if(levelType=="B")
            arrow.alpha = 0;
        else if(levelType=="A")
            arrow.alpha = 0.5;

    },
    
    update: function() {
                
        if(!clicked){
            if(!move){
                if(levelType=='A'){
                    //Follow mouse
                    if (game.physics.arcade.distanceToPointer(arrow, game.input.activePointer) > 8 )
				    {	
                    	let xPos = game.input.mousePointer.x;
			            //set left limit to the arrow  
                    	if  (xPos < 250){
                    		xPos = 250;
                    	}
                        arrow.x = xPos;
                    }                    
                }
            }
        }
        
        //Start animation
        if(animate){

            if(blockDirection[curBlock]=='Right'){
                this.tractor.x+=2;
            }else if(blockDirection[curBlock]=='Left'){
                this.tractor.x-=2;
            }
                        
            for(let i=0;i<numBlocks;i++){ //Moving every block
                if(blockDirection[curBlock]=='Right'){
                    blocks.children[i].x +=2;
                }else{
                    blocks.children[i].x -=2;
                }
            }
            
            let extra = 80-blockDistance[curBlock];
            
            if(blockDirection[curBlock]=='Right'){
                if(blocks.children[curBlock].x>=nextEnd+extra){
                    blocks.children[curBlock].alpha = 0;
                    blocks.y += 40;
                    curBlock +=1;
                    nextEnd += blockDistance[curBlock];
                    for(let i=0; i<=floorIndex; i++ ){
                        if(floorBlocks.children[i].x<(blocks.children[curBlock-1].x+blockDistance[curBlock-1])){
                            floorBlocks.children[i].alpha = 0.2;
                            curFloor = i;
                        }
                    }
                }
            }else if(blockDirection[curBlock]=='Left'){
                if(blocks.children[curBlock].x<=(nextEnd-extra)){
                    blocks.children[curBlock].alpha = 0;
                    blocks.y += 40;
                    curBlock+=1;
                    nextEnd -= blockDistance[curBlock];
                    for(let i=0; i<=floorIndex; i++ ){
                        if(floorBlocks.children[i].x>(blocks.children[curBlock-1].x-blockDistance[curBlock-1])){
                            floorBlocks.children[i].alpha = 0.2;
                            curFloor = i;
                        }
                    }
                }
            }
            
            if( curBlock>blockIndex || curFloor>=floorIndex){ //Final position
                animate= false;
                checkCollide = true;
            }       
        }
        
        //Check if tractor has blocks left or floor holes
        if(checkCollide){
            this.tractor.animations.stop();
            timer.stop();
            //Check left blocks
            let resultBlock = true;
            for(let i=0; i<=blockIndex; i++){
                if(blocks.children[i].alpha==1) resultBlock = false;
            }
            
            //check floor Holes
            let resultFloor = true;
            for(let i=0; i<=floorIndex; i++){
                if(floorBlocks.children[i].alpha==1) resultFloor = false;
            }
                        
            if(resultBlock && resultFloor){
                result = true;
            }else{
                result = false;
            }
            this.func_postScore();
            move = true;
            checkCollide = false;
        }
        
        //Continue moving animation
        if(move){
            
            if(moveCounter==0){
                if(result){
                    this.tractor.animations.play('right', 6, true);
                    if(audioStatus) okSound.play();
                    passedLevels++;        
                    if(debugMode) console.log("passedLevels = "+passedLevels); 
                    okImg.alpha = 1;
                }else{
                    if(audioStatus) errorSound.play();
                    errorImg.alpha = 1;
                }
            }
            
            moveCounter += 1;
            
            if(result){
                if(sublevelType=='Minus'){
                    this.tractor.x -=2;
                }else{
                    this.tractor.x +=2;
                }
            }
            
            if(moveCounter>=moveEnd){
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
    
    func_overSquare: function(){

        if(!clicked){
            //on level type A
            if(levelType=="A"){
                for(let i=0;i<floorCount;i++){
                    if(i<=this.indice){
                        floorBlocks.children[i].alpha = 1;
                    }else{
                        floorBlocks.children[i].alpha = 0.5;
                    }
                }
                floorIndex = this.indice;
            //on level type B
            }else if(levelType=="B"){
                for(let i=0;i<numBlocks;i++){
                    if(i<=this.indice){
                        blocks.children[i].alpha = 0.5;
                    }else{
                        blocks.children[i].alpha = 0.2;
                    }
                }
                blockIndex = this.indice;
            }
        }

    },

    func_outSquare: function(){

        if(!clicked){
            //on level type A
            if(levelType=="A"){
                for(let i=0;i<floorCount;i++){
                    floorBlocks.children[i].alpha = 0.5;
                }
                floorIndex = -1;
            //on level type B
            }else if(levelType=="B"){
                for(let i=0;i<numBlocks;i++){
                    blocks.children[i].alpha = 0.5;
                }
                blockIndex = -1;
            }
        }

    },
    
    func_clickSquare: function(){

        if(!clicked && !move){
            
            //on level type A
            if(levelType=='A'){
    
                arrow.alpha = 1;
                clicked = true;
                animate = true;
                if(audioStatus) beepSound.play();            
                this.tractor.animations.play('right', 5, true);
                
                if(levelLabel){ //Hiding labels
                    blockLabel.visible = false;
                    blockSeparator.visible = false;
                }
                
                //cleaning path
                if(sublevelType=='Minus'){
                    for(let i=0; i< floorCount; i++){
                        if(i>floorIndex){
                            floorBlocks.children[i].alpha = 0;
                        }
                    }
                }else{
                    for(let i=0; i< floorCount; i++){
                        if(i>floorIndex){
                            floorBlocks.children[i].alpha = 0;
                        }
                    }
                }
                    
                blockIndex = numBlocks - 1;

            //on level type B
            }else if(levelType=='B'){ //Delete unselected blocks

                let minusBlocks = 0;
                for(let i=0;i<numBlocks;i++){
                    if(i<=blockIndex){
                        blocks.children[i].alpha = 1;
                    }else{
                        blocks.children[i].visible = false; //Delete unselected block
                        minusBlocks +=1; //number of blocks to reduce
                    }
                }
                numBlocks -= minusBlocks; //Final reduced blocks
                
                arrow.alpha = 0;
                clicked = true;
                animate = true;
                if(audioStatus) beepSound.play();
                this.tractor.animations.play('right', 5, true);

                if(levelLabel){ //Hiding labels
                    blockLabel.visible = false;
                    blockSeparator.visible = false;
                }
            }
        }

    },

    func_postScore: function (){
    
        // Get correct information about username and default language
    	// Variables 'username' and 'lang' is define on: js/menu.js
    	// Variable 'lang' has all the JSON content of 'assets/languages/pt_BR.json', 'lang.lang' defined in 'js/preMenu.js' (func_setLang())

        let abst = "numBlocks:" + numBlocks + ", valBlocks: " + detail + " blockIndex: " + blockIndex + ", floorIndex: " + floorIndex;

        let hr = new XMLHttpRequest();

        // Create some variables we need to send to our PHP file
        let url = "php/save.php";
        let vars = "s_ip=" + hip + "&s_name=" + username + "&s_lang=" + langString + "&s_game=" + levelShape + "&s_mode=" + levelType;
        vars += "&s_oper=" + sublevelType + "&s_leve=" + levelDifficulty + "&s_posi=" + levelPosition + "&s_resu=" + result + "&s_time=" + totalTime + "&s_deta=" + abst;

        // Sobre nome do usuario:
    	// * js/squareOne.js: name
    	// * js/pt_BR.json:   welcome="Ola'", insert_name="DIGITE SEU NOME"
    	// * php/save.php : $play = $_REQUEST["s_name"];
    	// * js/preMenu.js : insert_name, game.add.text(...), username = document.getElementById("name_id").value;

    	// Pegar valor de PHP para JS: echo("<script language='javascript'>location.href='download.php?arquivo=$nome_arquivo&dir=$dir&id_exer=$id_exer'</script>");

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

    }
    
};