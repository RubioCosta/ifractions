// LInE - Free Education, Private Data.

/*
..................................................... 
...............square....................circle...... }				        	} (gameShape)
.........../...........\....................|........ } game (gameType)
........One.............Two................One....... }
......./...\.........../...\............./....\...... 
......A.....B.........A.....B...........A......B..... } game mode (gameModeType)
.(floor)..(stack)..(top)..(bottom)..(floor)..(stack). } 
.......\./.............\./................\./........ 
........|...............|..................|......... 
......./.\..............|................/.|.\....... 
...Plus...Minus.......Equals........Plus.Minus.Mixed. } game math operation (gameOperationType)
.......\./..............|................\.|./....... 
........|...............|..................|......... 
......1,2,3.........1,2,3,4,5..........1,2,3,4,5..... } difficulty (gameDifficulty)
..................................................... 
*/

/**
 * Turns console messages ON/OFF (for debug purposes only)
 * @type {boolean}
 */
const debugMode = false;
// MOODLE MODIF.
/**
 * defines if the game is suposed to run online or on moodle <br>
 * - if true, on moodle <br>
 * - if false, online
 */
const moodle = false;

const medSrc = 'assets/img/'; // Base directory for media
const defaultWidth = 900; // Default width for the Canvas
const defaultHeight = 600; // Default height for the Canvas

/**
 * HTMLCanvasElement : Canvas where all the game elements are rendered.
 * 
 * @type {object}
 */
let canvas;

/**
 * Selected game object.<br>
 * Can be the objects: squareOne, squareTwo or circleOne.
 * 
 * @type {object}
 */
let gameType;
/**
 * Name of the selected game.<br>
 * Can be: 'squareOne', 'squareTwo' or 'circleOne'.
 * 
 * @type {string}
 */
let gameTypeString;
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
let gameModeType;
/**
 * Holds game math operation.<br>
 * In squareOne     can be: 'Plus' (green tractor goes right) or 'Minus' (red tractor goes left).<br>
 * In circleOne     can be: 'Plus' (green tractor goes right), 'Minus' (red tractor goes left) or 'Mixed' (green tractor goes both sides).<br>
 * In squareTwo     can be: 'Equals' (compares two rectangle subdivisions).
 * 
 * @type {string}
 */
let gameOperationType;
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
 * Character position on the map, aka game levels (1..4: valid; 5: end)
 * @type {number}
 */
let mapPosition;
/**
 * When true, the character can move to next position in the map
 * @type {boolean}
 */
let mapMove;
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
let langstring;
/**
 * Holds the current state.<br>
 * Is used as if it was a 'this' inside state functions.
 * @type {object}
 */
let self;

/**
 * Metadata for all games
 * @type {object}
 */
const info = {

  squareOne: {
    gameShape: 'square',
    gameType: 'squareOne',
    gameTypeUrl: 'game0',
    gameModeType: ['A', 'B'],
    gameModeTypeUrl: ['mode0', 'mode1'],
    gameOperationType: ['Plus', 'Minus'],
    gameDifficulty: 3
  },

  circleOne: {
    gameShape: 'circle',
    gameType: 'circleOne',
    gameTypeUrl: 'game1',
    gameModeType: ['A', 'B'],
    gameModeTypeUrl: ['mode2', 'mode3'],
    gameOperationType: ['Plus', 'Minus', 'Mixed'],
    gameDifficulty: 5
  },

  squareTwo: {
    gameShape: 'square',
    gameType: 'squareTwo',
    gameTypeUrl: 'game2',
    gameModeType: ['A', 'B'],
    gameModeTypeUrl: ['mode4', 'mode5'],
    gameOperationType: ['Equals'],
    gameDifficulty: 5
  },

  gameShape: [],
  gameType: [],
  gameTypeUrl: [],
  gameModeType: [],
  gameModeTypeUrl: [],
  gameOperationType: [],
  gameDifficulty: [],

  /**
   * Load values
   */
  start: function () {

    info.gameShape = [
      info.squareOne.gameShape,
      info.circleOne.gameShape,
      info.squareTwo.gameShape
    ];

    info.gameType = [
      info.squareOne.gameType,
      info.circleOne.gameType,
      info.squareTwo.gameType
    ];

    info.gameTypeUrl = [
      info.squareOne.gameTypeUrl,
      info.circleOne.gameTypeUrl,
      info.squareTwo.gameTypeUrl
    ];

    info.gameModeType = info.squareOne.gameModeType.concat(info.circleOne.gameModeType, info.squareTwo.gameModeType);

    info.gameModeTypeUrl = info.squareOne.gameModeTypeUrl.concat(info.circleOne.gameModeTypeUrl, info.squareTwo.gameModeTypeUrl);

    info.gameOperationType = info.squareOne.gameOperationType.concat(info.circleOne.gameOperationType, info.squareTwo.gameOperationType);

    info.gameDifficulty = [
      info.squareOne.gameDifficulty,
      info.circleOne.gameDifficulty,
      info.squareTwo.gameDifficulty
    ];
  }
};

/**
 * Preset colors for graphic elements.
 * @type {object}
 */
const colors = {
  // Blues
  blueBckg: '#cce5ff', // Background color 
  blueBckgOff: '#adc8e6',
  blueBckgInsideLevel: '#a8c0e6', // Background color in squareOne (used for floor gap)
  blue: '#003cb3', // Subtitle
  blueMenuLine: '#b7cdf4',
  darkBlue: '#183780', // Line color that indicates right and fraction numbers

  // Reds
  red: '#b30000', // Linecolor that indicates left
  lightRed: '#d27979', // squareTwo figures
  darkRed: '#330000', // squareTwo figures and some titles

  // Greens
  green: '#00804d', // Title
  lightGreen: '#83afaf', // squareTwo figures
  darkGreen: '#1e2f2f', // squareTwo figures
  intenseGreen: '#00d600',

  // Basics
  white: '#efeff5',
  gray: '#708090',
  black: '#000',
  yellow: '#ffef1f'
};

/**
 * Preset text styles for game text.<br>
 * Contains: font, size, text color and text align.
 * @type {object} 
 */
const textStyles = {
  h1_green: { font: '32px Arial,sans-serif', fill: colors.green, align: 'center' }, // Menu title
  h2_green: { font: '26px Arial,sans-serif', fill: colors.green, align: 'center' }, // Flag labels (langState)

  h1_white: { font: '32px Arial,sans-serif', fill: colors.white, align: 'center' }, // Ok button (nameState)
  h2_white: { font: '26px Arial,sans-serif', fill: colors.white, align: 'center' }, // Difficulty buttons (menuState)
  h3__white: { font: '23px Arial,sans-serif', fill: colors.white, align: 'center' }, // Difficulty numbers (menuState)
  h4_white: { font: '20px Arial,sans-serif', fill: colors.white, align: 'center' }, // Difficulty numbers (menuState)
  p_white: { font: '14px Arial,sans-serif', fill: colors.white, align: 'center' }, // Enter button (menuState)

  h2_brown: { font: '26px Arial,sans-serif', fill: colors.darkRed, align: 'center' }, // Map difficulty label
  h4_brown: { font: '20px Arial,sans-serif', fill: colors.darkRed, align: 'center' }, // Menu overtitle
  p_brown: { font: '14px Arial,sans-serif', fill: colors.darkRed, align: 'center' }, // Map difficulty label

  h2_blue_2: { font: '26px Arial,sans-serif', fill: colors.blue, align: 'center' }, // Menu subtitle
  h4_blue_2: { font: '20px Arial,sans-serif', fill: colors.blue, align: 'center' }, // Menu subtitle
  h2_blue: { font: '26px Arial,sans-serif', fill: colors.darkBlue, align: 'center' }, // Fractions
  h4_blue: { font: '20px Arial,sans-serif', fill: colors.darkBlue, align: 'center' }, // Fractions
  p_blue: { font: '14px Arial,sans-serif', fill: colors.darkBlue, align: 'center' } // Fractions
};

/**
 * List of URL for all media in the game.<br>
 * Divided: 1st by the state that loads the media / 2nd by the media type.
 * @type {object}
 */
const url = {
  boot: {
    image: [
      // Scene
      ['bgimage', medSrc + 'scene/bg.jpg'],
      ['bgmap', medSrc + 'scene/bg_map.png'],
      ['bush', medSrc + 'scene/bush.png'],
      ['cloud', medSrc + 'scene/cloud.png'],
      ['floor', medSrc + 'scene/floor.png'],
      ['place_off', medSrc + 'scene/place_off.png'],
      ['place_on', medSrc + 'scene/place_on.png'],
      ['rock', medSrc + 'scene/rock.png'],
      ['road', medSrc + 'scene/road.png'],
      ['sign', medSrc + 'scene/sign.png'],
      ['tree1', medSrc + 'scene/tree.png'],
      ['tree2', medSrc + 'scene/tree2.png'],
      ['tree3', medSrc + 'scene/tree3.png'],
      ['tree4', medSrc + 'scene/tree4.png'],
      // Flags
      ['flag_BR', medSrc + 'flag/BRAZ.jpg'],
      ['flag_FR', medSrc + 'flag/FRAN.jpg'],
      ['flag_IT', medSrc + 'flag/ITAL.png'],
      ['flag_PE', medSrc + 'flag/PERU.jpg'],
      ['flag_US', medSrc + 'flag/UNST.jpg'],
      // Navigation icons on the top of the page
      ['back', medSrc + 'navig_icon/back.png'],
      ['help', medSrc + 'navig_icon/help.png'],
      ['home', medSrc + 'navig_icon/home.png'],
      ['language', medSrc + 'navig_icon/language.png'],
      ['menu', medSrc + 'navig_icon/menu.png'],
      // Interactive icons
      ['arrow_down', medSrc + 'interac_icon/down.png'],
      ['close', medSrc + 'interac_icon/close.png'],
      ['error', medSrc + 'interac_icon/error.png'],
      ['help_pointer', medSrc + 'interac_icon/pointer.png'],
      ['info', medSrc + 'interac_icon/info.png'],
      ['ok', medSrc + 'interac_icon/ok.png'],
    ],
    sprite: [
      // Game Sprites
      ['kid_walk', medSrc + 'character/kid/walk.png', 26],
      // Navigation icons on the top of the page
      ['audio', medSrc + 'navig_icon/audio.png', 2],
      // Interactive icons
      ['select', medSrc + 'interac_icon/selectionBox.png', 2]
    ],
    audio: [
      // Sound effects
      ['beepSound', ['assets/audio/beep.ogg', 'assets/audio/beep.mp3']],
      ['okSound', ['assets/audio/ok.ogg', 'assets/audio/ok.mp3']],
      ['errorSound', ['assets/audio/error.ogg', 'assets/audio/error.mp3']]
    ]
  },
  menu: {
    image: [
      // Game
      ['game0', medSrc + 'levels/squareOne.png'], // Square I
      ['game1', medSrc + 'levels/circleOne.png'], // Circle I
      ['game2', medSrc + 'levels/squareTwo.png'], // Square II
      // Info box icons
      ['c1-A', medSrc + 'info_box/c1-A.png'],
      ['c1-A-h', medSrc + 'info_box/c1-A-h.png'],
      ['c1-B-h', medSrc + 'info_box/c1-B-h.png'],
      ['c1-diff-1', medSrc + 'info_box/c1-diff-1.png'],
      ['c1-diff-5', medSrc + 'info_box/c1-diff-5.png'],
      ['c1-label', medSrc + 'info_box/c1-label.png'],
      ['map-c1s2', medSrc + 'info_box/map-c1s2.png'],
      ['map-s1', medSrc + 'info_box/map-s1.png'],
      ['s1-A', medSrc + 'info_box/s1-A.png'],
      ['s1-A-h', medSrc + 'info_box/s1-A-h.png'],
      ['s1-B-h', medSrc + 'info_box/s1-B-h.png'],
      ['s1-diff-1', medSrc + 'info_box/s1-diff-1.png'],
      ['s1-diff-3', medSrc + 'info_box/s1-diff-3.png'],
      ['s1-label', medSrc + 'info_box/s1-label.png'],
      ['s2', medSrc + 'info_box/s2.png'],
      ['s2-A-h', medSrc + 'info_box/s2-A-h.png'],
      ['s2-B-h', medSrc + 'info_box/s2-B-h.png'],
      ['s2-diff-1', medSrc + 'info_box/s2-diff-1.png'],
      ['s2-diff-5', medSrc + 'info_box/s2-diff-5.png'],
      ['s2-label', medSrc + 'info_box/s2-label.png'],
      ['operation_plus', medSrc + 'info_box/operation_plus.png'],
      ['operation_minus', medSrc + 'info_box/operation_minus.png'],
      ['operation_mixed', medSrc + 'info_box/operation_mixed.png'],
      ['operation_equals', medSrc + 'info_box/operation_equals.png'],
    ],
    sprite: [
      // Game modes
      ['mode0', medSrc + 'levels/squareOne_1.png', 2], // Square I : A
      ['mode1', medSrc + 'levels/squareOne_2.png', 2], // Square I : B
      ['mode2', medSrc + 'levels/circleOne_1.png', 2], // Circle I : A
      ['mode3', medSrc + 'levels/circleOne_2.png', 2], // Circle I : B
      ['mode4', medSrc + 'levels/squareTwo_1.png', 2], // Square II : A
      ['mode5', medSrc + 'levels/squareTwo_2.png', 2], // Square II : B
      // Math operations
      ['operation_plus', medSrc + 'levels/operation_plus.png', 2], // Square/circle I : right
      ['operation_minus', medSrc + 'levels/operation_minus.png', 2], // Square/circle I : left
      ['operation_mixed', medSrc + 'levels/operation_mixed.png', 2], // Circle I : mixed 
      ['operation_equals', medSrc + 'levels/operation_equals.png', 2], // Square II : equals
    ],
    audio: []
  },
  squareOne: {
    image: [
      // Scene
      ['farm', medSrc + 'scene/farm.png'],
      ['garage', medSrc + 'scene/garage.png']
    ],
    sprite: [
      // Game sprites
      ['tractor', medSrc + 'character/tractor/tractor.png', 15]
    ],
    audio: []
  },
  squareTwo: {
    image: [
      // Scene
      ['house', medSrc + 'scene/house.png'],
      ['school', medSrc + 'scene/school.png']
    ],
    sprite: [
      // Game sprites
      ['kid_standing', medSrc + 'character/kid/lost.png', 6],
      ['kid_run', medSrc + 'character/kid/run.png', 12]
    ],
    audio: []
  },
  circleOne: {
    image: [
      // Scene
      ['house', medSrc + 'scene/house.png'],
      ['school', medSrc + 'scene/school.png'],
      // Game images
      ['balloon', medSrc + 'character/balloon/airballoon_upper.png'],
      ['balloon_basket', medSrc + 'character/balloon/airballoon_base.png']
    ],
    sprite: [
      // Game sprites
      ['kid_run', medSrc + 'character/kid/run.png', 12]
    ],
    audio: []
  },
};

/**
 * Manages navigation icons on the top of the screen
 * @namespace
 */
const navigationIcons = {

  /**
   * Add navigation icons.<br>
   *  * The icons on the left are ordered from left to right. <br>
   *  * The icons on the right are ordered from right to left.
   * 
   * @param {boolean} leftIcon0 1st left icon 
   * @param {boolean} leftIcon1 2nd left icon
   * @param {boolean} leftIcon2 3rd left icon
   * @param {boolean} rightIcon0 1st right icon
   * @param {boolean} rightIcon1 2nd right icon
   * @param {string} state state to be called by the 'back' button
   * @param {function} help function in the current game state that display correct answer
   */
  func_addIcons: function (leftIcon0, leftIcon1, leftIcon2, rightIcon0, rightIcon1, state, help) {
    this.state = state;
    this.help = help;

    let left_x = 10;
    let right_x = defaultWidth - 50 - 10;

    this.iconsList = [];

    // 'Descriptive labels' for the navigation icons
    this.left_text = game.add.text(left_x, 73, '', textStyles.h4_brown, 'left');
    this.right_text = game.add.text(right_x + 50, 73, '', textStyles.h4_brown, 'right');

    // 'Icons' on the LEFT side of the page
    if (leftIcon0) { // Return to select difficulty screen
      const icon_back = game.add.image(left_x, 10, 'back');
      this.iconsList.push(icon_back);
      left_x += 50; // Offsets value of x for next icon
    }

    if (leftIcon1) { // Return to main menu screen
      const icon_list = game.add.image(left_x, 10, 'menu');
      this.iconsList.push(icon_list);
      left_x += 50; // Offsets value of x for next icon
    }

    if (leftIcon2) { // In some levels, shows solution to the game
      const icon_help = game.add.image(left_x, 10, 'help');
      this.iconsList.push(icon_help);
      left_x += 50; // Offsets value of x for next icon
    }

    // 'Icons' on the RIGHT side of the page

    if (rightIcon0) { // Turns game audio on/off
      this.icon_audio = game.add.sprite(right_x, 10, 'audio', 1);
      audioStatus ? this.icon_audio.curFrame = 0 : this.icon_audio.curFrame = 1;
      this.iconsList.push(this.icon_audio);
      right_x -= 50; // Offsets value of x for next icon
    }

    if (rightIcon1) { // Return to select language screen
      icon_world = game.add.image(right_x, 10, 'language');
      this.iconsList.push(icon_world);
      right_x -= 50; // Offsets value of x for next icon
    }
  },

  /**
   * When 'back' icon is clicked go to this state
   * 
   * @param {string} state name of the next state
   */
  func_CallState: function (state) {
    if (audioStatus) game.audio.beepSound.play();

    game.event.clear(self);
    game.state.start(state);
  },

  /**
   * Called by mouse click event 
   * 
   * @param {number} x contains the mouse x coordinate
   * @param {number} y contains the mouse y coordinate
   */
  func_onInputDown: function (x, y) {

    navigationIcons.iconsList.forEach(cur => {
      if (game.math.isOverIcon(x, y, cur)) {
        const name = cur.name;
        switch (name) {
          case 'back': navigationIcons.func_CallState(navigationIcons.state); break;
          case 'menu': navigationIcons.func_CallState('menu'); break;
          case 'help': navigationIcons.help(); break;
          case 'language': navigationIcons.func_CallState('lang'); break;
          case 'audio':
            if (audioStatus) {
              audioStatus = false;
              navigationIcons.icon_audio.curFrame = 1;
            } else {
              audioStatus = true;
              if (audioStatus) game.audio.beepSound.play();
              navigationIcons.icon_audio.curFrame = 0;
            }
            game.render.all();
            break;
          default: console.log('Game error: error in navigation icon');
        }
      }
    });
  },

  /**
   * Called by mouse move event
   * 
   * @param {number} x contains the mouse x coordinate
   * @param {number} y contains the mouse y coordinate
   */
  func_onInputOver: function (x, y) {

    let flag = false;

    navigationIcons.iconsList.forEach(cur => {
      if (game.math.isOverIcon(x, y, cur)) {
        flag = true;

        if (cur.name == 'back') navigationIcons.left_text.name = game.lang.nav_back;
        else if (cur.name == 'menu') navigationIcons.left_text.name = game.lang.nav_menu;
        else if (cur.name == 'help') navigationIcons.left_text.name = game.lang.nav_help;

        else if (cur.name == 'language') navigationIcons.right_text.name = game.lang.nav_lang;
        else if (cur.name == 'audio') navigationIcons.right_text.name = game.lang.audio;
      }
    });

    if (!flag) {
      navigationIcons.left_text.name = '';
      navigationIcons.right_text.name = '';
    } else {
      document.body.style.cursor = 'pointer';
    }
  }
};

/**
 * Sends game information to database
 *  
 * @param {string} extraData player information for the current game
 */
const sendToDB = function (extraData) {

  // MOODLE MODIF.
  if (moodle) {

    if (self.result) moodleVar.hits[mapPosition - 1]++;
    else moodleVar.errors[mapPosition - 1]++;

    moodleVar.time[mapPosition - 1] += game.timer.elapsed;

  } else {

    // Create some variables we need to send to our PHP file
    // Attention: this names must be compactible to data table (MySQL server)
    // @see php/save.php
    const data = 'line_ip=143.107.45.11' // INSERT database server IP
      + '&line_name=' + playerName
      + '&line_lang=' + langstring
      + extraData;

    const url = 'php/save.php';

    const hr = new XMLHttpRequest();

    hr.open('POST', url, true);

    hr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    hr.onreadystatechange = function () {
      if (debugMode) console.log(hr);
      if (hr.readyState == 4 && hr.status == 200) {
        if (debugMode) console.log(hr.responseText);
      }
    }

    hr.send(data); // Actually execute the request

    if (debugMode) {
      console.log('processing...');
      console.log(data);
    }

  }
};