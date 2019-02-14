
    var timer, totalTime;

    // Initialize the game
    var game = new Phaser.Game(
        900, 
        600, 
        Phaser.CANVAS,
        'fractions-game'
    );

    hip = "143.107.45.11"; //Host ip
    name = ""; //player name
    lang = ""; //language

    // Game One 
    onePosition = 0; //Map position
    oneMove = false; //Move to next position
    oneDifficulty = 0; //From one to five 
    oneOperator= ""; //Plus; Minus; Mixed
    oneLabel= false; //Show block label
    oneShape = ""; //Circle; square
    oneType = ""; // A - Place distance; B - Select blocks
    oneMenu = true;

    // Game Two
    twoPosition = 0; //Map position
    twoMove = false; //Move to next position
    twoDifficulty = 0; //From one to five 
    twoOperator= ""; //Plus; Minus; Mixed
    twoLabel= false; //Show block label
    twoShape = ""; //Circle; square
    twoType = ""; // A - Normal position; B - Random position
    twoMenu= true;

    //adding game states (scenes)
    game.state.add('boot', bootState); // boot.js
    game.state.add('load', loadState); // boot.js
    game.state.add('name', nameState); // boot.js

    game.state.add('menu', menuState); // menu.js

    game.state.add('menuCOne', menuCircleOne); // circleOne.js
    game.state.add('mapCOne', mapCircleOne); // circleOne.js
    game.state.add('gameCOne', gameCircleOne); // circleOne.js
    game.state.add('endCOne', endCircleOne); // circleOne.js

    game.state.add('menuSOne', menuSquareOne); // squareOne.js
    game.state.add('mapSOne', mapSquareOne); // squareOne.js
    game.state.add('gameSOne', gameSquareOne); // squareOne.js
    game.state.add('endSOne', endSquareOne); // squareOne.js

    game.state.add('menuSTwo', menuSquareTwo); // squareTwo.js
    game.state.add('mapSTwo', mapSquareTwo); // squareTwo.js
    game.state.add('gameSTwo', gameSquareTwo); // squareTwo.js
    game.state.add('endSTwo', endSquareTwo); // squareTwo.js

    //starting to boot game
    game.state.start('boot');