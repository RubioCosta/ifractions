/**************************************************************
 * LInE - Free Education, Private Data - http://www.usp.br/line
 *
 * This file holds all global elements to the game.
 *
 * Generating game levels in menu:
 * .....................................................
 * ...............square....................circle...... }                   = gameShape
 * .........../...........\....................|........ } = gameName (game)
 * ........One.............Two................One....... }
 * ......./...\.........../...\............./....\......
 * ......A.....B.........A.....B...........A......B..... = gameMode (game mode)
 * .(floor)..(stack)..(top)..(bottom)..(floor)..(stack).
 * .......\./.............\./................\./........
 * ........|...............|..................|.........
 * ......./.\..............|................/.|.\.......
 * ...Plus...Minus.......Equals........Plus.Minus.Mixed. = gameOperation (game math operation)
 * .......\./..............|................\.|./.......
 * ........|...............|..................|.........
 * ......1,2,3.........1,2,3,4,5..........1,2,3,4,5..... = gameDifficulty (difficulty level)
 * .....................................................
 *
 * About levels in map:
 *
 * ..................(game.levels)......................
 * ......................__|__..........................
 * .....................|.|.|.|.........................
 * ...................0,1,2,3,4,5....................... = curMapPosition (map positions)
 * ...................|.........|.......................
 * ................(start)....(end).....................
 **************************************************************/

/** FOR MOODLE <br>
 *
 * iFractions can run on a server or inside moodle through iAssign. <br>
 * This variable should be set according to where it is suposed to run: <br>
 * - if true, on moodle <br>
 * - if false, on a server
 */
const moodle = false;

/**
 * Index of the current game in gameList array
 *
 * @type {number}
 */
let gameId;

/**
 * Selected game name.<br>
 * Can be: 'squareOne', 'squareTwo' or 'circleOne'.
 *
 * @type {string}
 */
let gameName;

/**
 * Used for text and game information.<br>
 * Shape that makes the name of the game - e.g in 'squareOne' it is 'square'.<br>
 * Can be: 'circle' or 'square'.
 *
 * @type {string}
 */
let gameShape;

/**
 * Holds selected game mode.<br>
 * In squareOne/circleOne   can be: 'A' (click on the floor) or 'B' (click on the amount to go/stacked figures).<br>
 * In squareTwo             can be: 'A' (more subdivisions on top) or 'B' (more subdivisions on bottom).
 *
 * @type {string}
 */
let gameMode;

/**
 * Holds game math operation.<br>
 * In squareOne   can be: 'Plus' (green tractor goes right) or 'Minus' (red tractor goes left).<br>
 * In circleOne   can be: 'Plus' (green tractor goes right), 'Minus' (red tractor goes left) or 'Mixed' (green tractor goes both sides).<br>
 * In squareTwo   can be: 'Equals' (compares two rectangle subdivisions).
 *
 * @type {string}
 */
let gameOperation;

/**
 * Holds game overall difficulty. 1 (easier) -> n (harder).<br>
 * In squareOne             can be: 1..3.<br>
 * In circleOne/squareTwo   can be: 1..5.
 *
 * @type {number}
 */
let gameDifficulty;

/**
 * Turns displaying the fraction labels on levels ON/OFF
 * @type {boolean}
 */
let fractionLabel = true;

/**
 * When true, the character can move to next position in the map
 * @type {boolean}
 */
let canGoToNextMapPosition;

/**
 * Character position on the map, aka game levels (1..4: valid; 5: end)
 * @type {number}
 */
let curMapPosition;

/**
 * Number of finished levels in the map
 * @type {number}
 */
let completedLevels;

/**
 * Turns game audio ON/OFF
 * @type {boolean}
 */
let audioStatus = false;

/**
 * Player's name
 * @type {string}
 */
let playerName;

/**
 * String that contains the selected language.<br>
 * It is the name of the language file.
 * @type {string}
 */
let langString;

/**
 * Holds the current state.<br>
 * Is used as if it was a 'this' inside state functions.
 * @type {object}
 */
let self;
