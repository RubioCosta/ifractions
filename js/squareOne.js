
/*
    var menuSquareOne = {
        create: function(){},
        ---------------------------- end of phaser functions
        func_loadMap: function(){}
    };

    var gameSquareOne = {
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

    var endSquareOne = {
        create: function(){},
        update: function(){},
        ---------------------------- end of phaser functions
        func_verPrincipal: function(){},
    };
*/

// Tractor and Square states

/****************************** MENU ****************************/

var menuSquareOne = {
	
    create: function() {
          
        // Navigation buttons
        buttonSettings["func_addButtons"](true,true,
                                    false,true,false,
                                    true,false,
                                    false,false);
        
        // Title
        var style = { font: '28px Arial', fill: '#00804d'};
        var title = game.add.text(game.world.centerX, 40, lang.game_menu_title, style);
        title.anchor.setTo(0.5, 0.5);
        
        //SETTING DIFFICULTY LEVELS

        var maxHeight = 120; //Max height of a stair
        var stairHeight = 40; //height growth of a stair
        var stairWidth = 100; //Width of a stair
        var startStair = 320;
        var startSymbol = 180; 
        var startSquare = (startSymbol/2)+startStair+stairWidth*3;
        
        //First stairs, plus, 3 levels, blue square

        var blueSquare = game.add.graphics(startSquare, 175);
            blueSquare.anchor.setTo(0.5,0.5);
            blueSquare.lineStyle(2, 0x31314e);
            blueSquare.beginFill(0xefeff5);
            blueSquare.drawRect(0, 0, 80, 40);
            blueSquare.endFill();
        
        var plusTractorIcon = game.add.sprite(startSymbol+30, 215, 'tractor_green');
            //plus_tractor.frame = 0;
            plusTractorIcon.scale.setTo(0.5);
            plusTractorIcon.alpha = 0.9;
            plusTractorIcon.anchor.setTo(0.5,0.5);
        
        var plusArrowIcon = game.add.sprite(startSymbol+100, 215, 'h_arrow');
            plusArrowIcon.scale.setTo(0.3);
            plusArrowIcon.alpha = 0.9;
            plusArrowIcon.anchor.setTo(0.5,0.5);
        
        var stairsPlus = [];

        for(var i=1;i<=3;i++){
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
        
        //Second stairs, minus, 3 levels, red Square

        var redSquare = game.add.graphics(startSquare, 330);
            redSquare.anchor.setTo(0.5,0.5);
            redSquare.lineStyle(2, 0xb30000);
            redSquare.beginFill(0xefeff5);
            redSquare.drawRect(0, 0, 80, 40);
            redSquare.endFill();

        var minusTractorIcon = game.add.sprite(startSymbol+70, 370, 'tractor_red');
            //minusTractorIcon.frame = 5;
            minusTractorIcon.scale.setTo(0.5);
            minusTractorIcon.alpha = 0.9;
            minusTractorIcon.anchor.setTo(0.5,0.5);
        
        var minusArrowIcon = game.add.sprite(startSymbol, 370, 'h_arrow');
            minusArrowIcon.scale.setTo(0.3);
            minusArrowIcon.alpha = 0.9;
            minusArrowIcon.scale.x *= -1;
            minusArrowIcon.anchor.setTo(0.5,0.5);
        
        var stairsMinus = [];

        for(var i=1;i<=3;i++){
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

    },
        
    //MapLoading function
    func_loadMap: function(){
        
        if(audioStatus){
            this.beep.play();
        }
        
        levelPosition = 0; //Map position
        levelMove = true; //Move no next point
        levelDifficulty  = this.difficulty; //Number of difficulty (1 to 3)
        levelOperator = this.operator; //Operator of game
        passedLevels = 0; //reset the game progress when entering a new level
        
        game.state.start('map');

    }
    
};

/****************************** GAME ****************************/

var gameSquareOne = {

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
        buttonSettings["func_addButtons"](true,true,
                                    true,true,true,
                                    true,false,
                                    "menuSquareOne", this.func_viewHelp);

        //Clouds
        game.add.image(300, 100, 'cloud');
        game.add.image(660, 80, 'cloud');
        game.add.image(110, 85, 'cloud').scale.setTo(0.8);
                
        // Styles for labels
        var stylePlace = { font: '26px Arial', fill: '#400080', align: 'center'};
        var styleLabel = { font: '26px Arial', fill: '#000080', align: 'center'};
        var styleFraction = { font: '15px Arial', fill: '#000080', align: 'center'};
        var styleMenu = { font: '30px Arial', fill: '#000000', align: 'center'};
        
        //Floor and road
        var startX = 170; //Initial tractor and place position
        if(levelOperator=='Minus') startX = 730;
        startX = startX; //Workaround for initial position inside update
        var blockWidth = 80; //Width of blocks and floor spaces
        var blockHeight = 40; //Height of blocks and floor spaces
        for(var i=0;i<9;i++){
            game.add.image(i*100, 501, 'floor');
        }
                
        //Control variables
        clicked = false; //Floor blocks or apilled blocks clicked
        hideLabels = false; //Labels of blocks
        animate = false; //Start move animation
        checkCollide = false; //Check if tractor fon't any block left or floor hole
        result = false; //Game is correct
        move = false; //Continue tractor animation
        moveCounter = 0; //Move counter
        moveEnd = 140; //Move end counter
                
        //tractor
        var tractorAlign = -80;
        if(levelOperator=='Minus'){
            tractorAlign *= -1;
        } 
        tractor = game.add.sprite(startX+tractorAlign, 445, 'tractor');
        tractor.anchor.setTo(0.5, 0.5);
        tractor.scale.setTo(0.8);
        tractor.animations.add('right',[0,1,2,3,4]);
        if(levelOperator=='Minus'){
            tractor.scale.x *= -1;
        }
        
        //generator
        //Blocks and fractions
        if(debugMode) console.log("pos " +levelPosition);
        
        maxBlocks = levelPosition+4; //Maximum blocks
        if(levelType=='B' || levelOperator=='Mixed') maxBlocks = 10;
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
        if(levelOperator=='Minus') endPosition -= blockWidth;
        else endPosition += blockWidth;
        
        //Game A exclusive variables 
        floorBlocks = game.add.group(); //Selectable floor blocks
        floorIndex = -1; //Selected floor block
        floorCount = 8; //Number of floor blocks
        floorClicked = false; //If clicked portion of floor
        curFloor = -1;
        
        //Game B exclusive variables
        arrowPlace = startX; //Fixed place for help arrow
        if(levelOperator=='Minus') arrowPlace  -= blockWidth;
        else arrowPlace += blockWidth;
        fractionClicked = false; //If clicked a fraction (game B)
        fractionIndex = -1; //Index of clicked fraction (game B)
        
        hasFigure = false;

        for(var p=0;p<numBlocks;p++){

            var portion = game.rnd.integerInRange(1, levelDifficulty); //Portion of the square, according to difficulty
            if(portion==3) detail+= "4,";
            else detail += portion+",";
            
            if(portion==levelDifficulty) hasFigure = true;
            var direction = '';
            var lineColor = '';
            
            if(levelOperator=='Plus'){
                direction = 'Right';    
                lineColor = 0x31314e; //plus block: "black'
            }else if(levelOperator=='Minus'){
                direction = 'Left';
                lineColor = 0xb30000;//minus block : "red"
            }
            
            //blocks close to tractor
            var block = game.add.graphics(startX, 460-p*blockHeight);
                block.anchor.setTo(0.5, 0.5);
                block.lineStyle(2, lineColor);
                block.beginFill(0xefeff5);

            blockDirection[p] = direction;
            
            if(portion==1){
                block.drawRect(0, 0, blockWidth, blockHeight);
                
                blockDistance.push(blockWidth);
                //blockAngle.push(360);

                if(levelLabel){
                    var labelX = startX;
                    if(levelOperator=='Minus') labelX -= (15+blockWidth);
                    else labelX += blockWidth+15;
                    var label = game.add.text(labelX, 480-p*blockHeight, portion , styleLabel);
                    label.anchor.setTo(0.5, 0.5);
                    blockLabel.add(label);
                }
            }else{
                if(portion==3) portion = 4;
                
                var distance = blockWidth/portion;
                
                block.drawRect(0, 0, distance, blockHeight);
                
                blockDistance.push(distance);

                if(levelLabel){
                    var labelX = startX;
                    if(levelOperator=='Minus') labelX -= (15+distance);
                    else labelX += 15+distance;
                    var separator = game.add.sprite(labelX, 480-p*blockHeight, 'separator');
                    separator.scale.setTo(0.6);
                    separator.anchor.setTo(0.5, 0.5);
                    blockSeparator.add(separator);
                    var label = game.add.text(labelX, 483-p*blockHeight, '1\n'+portion , styleFraction);
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
                block.events.onInputDown.add(this.func_clickSquare, {indice: p});
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
        
        if (levelOperator=='Plus' && (endPosition<(startX+blockWidth) || endPosition>(startX+8*blockWidth))){
            game.state.start('gameSquareOne');
        }else if (levelOperator=='Minus' && (endPosition>(startX) || endPosition<(startX-(8*blockWidth)))){
            game.state.start('gameSquareOne');
        }
        
        //If game is type B, selectiong a random block floor place
        if(levelType=='B'){
            var end = game.rnd.integerInRange(1, numBlocks);
            for(var i=0;i<end;i++){
                if(blockDirection[i]=='Right')
                    arrowPlace += blockDistance[i];
                else if(blockDirection[i]=='Left')
                    arrowPlace -= blockDistance[i];
            }
        }
        
        //Selectable floor
        floorCount = 8*levelDifficulty;
        
        var widFloor = blockWidth/levelDifficulty;

        if(levelDifficulty==3){
            floorCount = 8*4;
            widFloor = blockWidth/4;
        }
        
        for(var i = 0; i < floorCount; i++){
            var posX = startX;
            
            if(levelOperator=='Minus') posX -= (blockWidth + i*widFloor);
            else posX += (blockWidth + i*widFloor);
            
            if(levelType=='B'){
                if(levelOperator=='Minus'){
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
            var block = game.add.graphics(posX, 500);
                block.anchor.setTo(0.5, 0);
                block.lineStyle(0.9, 0xffffff);
                block.beginFill(0xa8c0e6);
                block.drawRect(0, 0, widFloor, blockHeight);
                block.endFill();
            if(levelOperator=='Minus') block.scale.x *= -1;
            
            if(levelType=="A"){
                block.alpha = 0.5;
                block.inputEnabled = true;
                block.input.useHandCursor = true;
                block.events.onInputDown.add(this.func_clickSquare, {indice: i});
                block.events.onInputOver.add(this.func_overSquare, {indice: i});
                block.events.onInputOut.add(this.func_outSquare, {indice: i});
            }
            
            floorBlocks.add(block);     
        }
        
        for(var i=0;i<=8;i++){
            var posX = startX;
            if(levelOperator=='Minus')posX -= ((9-i)*blockWidth);
            else posX+=((i+1)*blockWidth);
            
            game.add.text(posX, 560, i , stylePlace).anchor.setTo(0.5, 0.5); 
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
                    	var xPos = game.input.mousePointer.x;
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
                tractor.x+=2;
            }else if(blockDirection[curBlock]=='Left'){
                tractor.x-=2;
            }
                        
            for(var i=0;i<numBlocks;i++){ //Moving every block
                if(blockDirection[curBlock]=='Right'){
                    blocks.children[i].x +=2;
                }else{
                    blocks.children[i].x -=2;
                }
            }
            
            var extra = 80-blockDistance[curBlock];
            
            if(blockDirection[curBlock]=='Right'){
                if(blocks.children[curBlock].x>=nextEnd+extra){
                    blocks.children[curBlock].alpha = 0;
                    blocks.y += 40;
                    curBlock +=1;
                    nextEnd += blockDistance[curBlock];
                    for(var i=0; i<=floorIndex; i++ ){
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
                    for(var i=0; i<=floorIndex; i++ ){
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
            tractor.animations.stop();
            timer.stop();
            //Check left blocks
            var resultBlock = true;
            for(var i=0; i<=blockIndex; i++){
                if(blocks.children[i].alpha==1) resultBlock = false;
            }
            
            //check floor Holes
            var resultFloor = true;
            for(var i=0; i<=floorIndex; i++){
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
                    tractor.animations.play('right', 6, true);
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
            
            moveCounter += 1;
            
            if(result){
                if(levelOperator=='Minus'){
                    tractor.x -=2;
                }else{
                    tractor.x +=2;
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
                for(var i=0;i<floorCount;i++){
                    if(i<=this.indice){
                        floorBlocks.children[i].alpha = 1;
                    }else{
                        floorBlocks.children[i].alpha = 0.5;
                    }
                }
                floorIndex = this.indice;
            //on level type B
            }else if(levelType=="B"){
                for(var i=0;i<numBlocks;i++){
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
                for(var i=0;i<floorCount;i++){
                    floorBlocks.children[i].alpha = 0.5;
                }
                floorIndex = -1;
            //on level type B
            }else if(levelType=="B"){
                for(var i=0;i<numBlocks;i++){
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
                if(audioStatus){
                    beepSound.play();
                }            
                tractor.animations.play('right', 5, true);
                
                if(levelLabel){ //Hiding labels
                    blockLabel.visible = false;
                    blockSeparator.visible = false;
                }
                
                //cleaning path
                if(levelOperator=='Minus'){
                    for(var i=0; i< floorCount; i++){
                        if(i>floorIndex){
                            floorBlocks.children[i].alpha = 0;
                        }
                    }
                }else{
                    for(var i=0; i< floorCount; i++){
                        if(i>floorIndex){
                            floorBlocks.children[i].alpha = 0;
                        }
                    }
                }
                    
                blockIndex = numBlocks - 1;

            //on level type B
            }else if(levelType=='B'){ //Delete unselected blocks

                var minusBlocks = 0;
                for(var i=0;i<numBlocks;i++){
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
                if(audioStatus){
                    beepSound.play();
                }
                tractor.animations.play('right', 5, true);

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
    	// TODO: nao descobri esquema para pegar 'lang' (como 'pt_BR' ou 'en_US'), 'lang' esta' com o dicinario de lingua (definido em 'assets/languages/pt_BR.json').
        
        //if (name=='') name = username; //leo the correct is 'username'
        
        // assets/languages/pt_BR.json

        //DEBUG Testar 'lang'
        /*
        
        var contact = "";
        if (typeof lang === 'object') {
          //contact = JSON.parse(lang);
          for (var i in lang) // will enumerate values of 'assets/languages/pt_BR.json'
             contact += lang[i];
          // Finaliza com os valores de 'assets/languages/pt_BR.json': 'CARREGANDOFraçõesSELECIONE UM JOGODificuldadeNívelSELECINAR OPERAÇÃO E DIFICULDADEBom trabalho!Tente novamente!SELECIONAR IDIOMAMENU PRINCIPALVOLTARVER
          // SOLUÇÃOCírculosQuadriláteroslegendaMODOCOMSEMDIGITE SEU NOMEPRONTOOláVocê deve selecionar uma porção menor que o seu tamanho totalVocê esqueceu de digitar seu nomeÁUDIO'
          lang_str = contact; aux = 1;
            }
            else
            // if (lang === 'undefined') lang_str = "pt_BR";
    
        */

        var abst = "numBlocks:" + numBlocks + ", valBlocks: " + detail + " blockIndex: " + blockIndex + ", floorIndex: " + floorIndex;

        var hr = new XMLHttpRequest();

        // Create some variables we need to send to our PHP file
        var url = "php/save.php";
        var vars = "s_ip=" + hip + "&s_name=" + username + "&s_lang=" + lang + "&s_game=" + levelShape + "&s_mode=" + levelType;

        vars += "&s_oper=" + levelOperator + "&s_leve=" + levelDifficulty + "&s_posi=" + levelPosition + "&s_resu=" + result + "&s_time=" + totalTime + "&s_deta=" + abst;

        //D alert('/js/squareOne.js: url=' + url + '; aux=' + aux + ', lang_str=' + lang_str + ', lang=' + lang); //  + ', this.lang=" + this.lang
        //D /js/squareOne.js: url=php/save.php; aux=1, lang_str=CARREGANDOFraçõesSELECIONE UM JOGODificuldadeNívelSELECINAR OPERAÇÃO E DIFICULDADEBom trabalho!Tente novamente!SELECIONAR IDIOMAMENU PRINCIPALVOLTARVER
        //D SOLUÇÃOCírculosQuadriláteroslegendaMODOCOMSEMDIGITE SEU NOMEPRONTOOláVocê deve selecionar uma porção menor que o seu tamanho totalVocê esqueceu de digitar seu nomeÁUDIO, lang=[object Object]

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

    }
    
};

/****************************** END ****************************/

var endSquareOne = {

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
        for(var p=0;p<5;p++){
            var block = game.add.image(660+p*30, 10, 'block');
            block.scale.setTo(2, 1); //Scaling to double width
        }
        game.add.text(820, 10, '100%', styleMenu);
        game.add.text(650, 10, lang.difficulty + ' ' + levelDifficulty, styleMenu).anchor.setTo(1,0);
        game.add.image(660, 10, 'pgbar');
        
        //Farm and trees
        game.add.sprite(650, 260 , 'farm').scale.setTo(1.1);
        game.add.sprite(30, 280 , 'tree4');
        game.add.sprite(360, 250 , 'tree2');
        
        //tractor
        this.tractor = game.add.sprite(0, 490 , 'tractor');
        this.tractor.anchor.setTo(0.5,0.5);
        this.tractor.scale.setTo(0.8);
            
        this.tractor.animations.add('right',[0,1,2,3,4]);
        this.tractor.animations.play('right', 5, true);
        
    },

    update: function() {

        if(this.tractor.x<=700){
            this.tractor.x += 2;
        }else{
            if(levelMenu){
            	passedLevels = 0;
                game.state.start('menu');
            }else{
                this.tractor.animations.stop();
            }
        }

    },
    
    func_verPrincipal: function(){
        game.state.start('welcome');
    },

};
