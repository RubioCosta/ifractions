/*
LInE - Free Education, Private Data.

.................................................... 
.............square.................circle.......... }					} (gameShape)		 			 
.........../........\.................|............. } game (gameType)
........One..........Two.............One............ }
......./...\..........|............./...\........... 
......A.....B.........C............A.....B.......... } level (levelType)
.(floor)..(stack)..(equal).....(floor).(stack)...... } 
.......\./............|..............\./............ 
........|.............|...............|............. 
......./.\.........../.\............/.|.\........... 
...Plus...Minus.....B...C.......Plus.Minus.Mixed.... } sublevel (sublevelType)
.......\./...........\./............\.|./........... 
........|.............|...............|............. 
......1,2,3.......1,2,3,4,5.......1,2,3,4,5......... } difficulty (gameDifficulty)
.................................................... 
*/

const medSrc = 'assets/img/'; // Base directory for media
const defaultWidth = 900; // Default width for the Canvas
const defaultHeight = 600; // Default height for the Canvas

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
let gameTypestring;

/**
 * Shape that makes the name of the game - e.g in 'squareOne' it is 'square'.<br>
 * Can be: 'circle' or 'square'.
 * 
 * @type {string}
 */
let gameShape;

/**
 * Holds game level.<br>
 * In squareOne/circleOne   can be: 'A' (click on the floor) or 'B' (click on the amount to go/stacked figures).<br>
 * In squareTwo             can be: 'C' (comparing fractions).
 * 
 * @type {string}
 */
let levelType;

/**
 * Holds game operation.<br>
 * In squareOne     can be: 'Plus' or 'Minus'.<br>
 * In circleOne     can be: 'Plus', 'Minus' or 'Mixed'.<br>
 * In squareTwo     can be: 'B' or 'C'
 * 
 * @type {string}
 */
let sublevelType;

/**
 * Holds game difficulty.<br> 
 * In squareOne             can be: 1..3.<br>
 * In circleOne/squareTwo   can be: 1..5.
 * 
 * @type {number}
 */
let gameDifficulty;



/**
 * Turns console messages ON/OFF (for debug purposes only)
 * @type {boolean}
 */
const debugMode = false;
/**
 * Turns game audio ON/OFF
 * @type {boolean}
 */
let audioStatus = false; 
/**
 * Turns displaying the fraction labels on levels ON/OFF
 * @type {boolean}
 */
let fractionLabel = true;


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
 * Character position on the map (1..4: valid; 5: end)
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
 * Metadata for all games
 * @type {object}
 */
const info = {

  squareOne: {
    gameShape: 'square',
    gameType: 'squareOne',
    gameTypeUrl: 'game0',
    levelType: ['A', 'B'],
    levelTypeUrl: ['level0', 'level1'],
    sublevelType: ['Plus', 'Minus'],
    gameDifficulty: 3
  },

  circleOne: {
    gameShape: 'circle',
    gameType: 'circleOne',
    gameTypeUrl: 'game1',
    levelType: ['A', 'B'],
    levelTypeUrl: ['level2', 'level3'],
    sublevelType: ['Plus', 'Minus', 'Mixed'],
    gameDifficulty: 5
  },

  squareTwo: {
    gameShape: 'square',
    gameType: 'squareTwo',
    gameTypeUrl: 'game2',
    levelType: ['C'],
    levelTypeUrl: [],
    sublevelType: [/*'A',*/ 'B', 'C'],
    gameDifficulty: 5
  },

  gameShape: [],
  gameType: [],
  gameTypeUrl: [],
  levelType: [],
  levelTypeUrl: [],
  sublevelType: [],
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

    info.levelType = info.squareOne.levelType.concat(info.circleOne.levelType, info.squareTwo.levelType);

    info.levelTypeUrl = info.squareOne.levelTypeUrl.concat(info.circleOne.levelTypeUrl, info.squareTwo.levelTypeUrl);

    info.sublevelType = info.squareOne.sublevelType.concat(info.circleOne.sublevelType, info.squareTwo.sublevelType);

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
  h4_white: { font: '20px Arial,sans-serif', fill: colors.white, align: 'center' }, // Difficulty numbers (menuState)
  p_white: { font: '14px Arial,sans-serif', fill: colors.white, align: 'center' }, // Enter button (menuState)

  h2_brown: { font: '26px Arial,sans-serif', fill: colors.darkRed, align: 'center' }, // Map difficulty label
  h4_brown: { font: '20px Arial,sans-serif', fill: colors.darkRed, align: 'center' }, // Menu overtitle

  h2_blue_2: { font: '26px Arial,sans-serif', fill: colors.blue, align: 'center' }, // Menu subtitle
  h4_blue_2: { font: '20px Arial,sans-serif', fill: colors.blue, align: 'center' }, // Menu subtitle
  h2_blue: { font: '26px Arial,sans-serif', fill: colors.darkBlue, align: 'center' }, // Fractions
  h4_blue: { font: '20px Arial,sans-serif', fill: colors.darkBlue, align: 'center' }, // Fractions
  p_blue: { font: '14px Arial,sans-serif', fill: colors.darkBlue, align: 'center' } // Fractions
};

// List of media URL
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
      ['error', medSrc + 'interac_icon/error.png'],
      ['help_pointer', medSrc + 'interac_icon/pointer.png'],
      ['ok', medSrc + 'interac_icon/ok.png'],
      // Non-interactive icons
      ['arrow_double', medSrc + 'non_interac_icon/double.png'],
      ['arrow_left', medSrc + 'non_interac_icon/left_arrow.png'],
      ['arrow_right', medSrc + 'non_interac_icon/right_arrow.png'],
      ['equal', medSrc + 'non_interac_icon/equal.png']
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
      // Level
      ['level0', medSrc + 'levels/squareOne_1.png'], // Square I : A
      ['level1', medSrc + 'levels/squareOne_2.png'], // Square I : B
      ['level2', medSrc + 'levels/circleOne_1.png'], // Circle I : A
      ['level3', medSrc + 'levels/circleOne_2.png'], // Circle I : B
      ['level4', medSrc + 'levels/squareTwo.png'],  // Square II : C
      // Sublevel
      ['sublevel_right', medSrc + 'levels/sublevel_right.png'], // Square/circle I : right
      ['sublevel_left', medSrc + 'levels/sublevel_left.png'], // Square/circle I : left
      ['sublevel_mixed', medSrc + 'levels/sublevel_mixed.png'], // Circle I : mixed
      ['sublevel_top', medSrc + 'levels/sublevel_top.png'], // Square II : top
      ['sublevel_bottom', medSrc + 'levels/sublevel_bottom.png']  // Square II : bottom
    ],
    sprite: [],
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
   * The icons on the left are ordered from left to right.
   * The icons on the right are ordered from right to left.
   * 
   * @param {boolean} leftIcon0 1st left icon 
   * @param {boolean} leftIcon1 2nd left icon
   * @param {boolean} leftIcon2 3rd left icon
   * @param {boolean} rightIcon0 1st right icon
   * @param {boolean} rightIcon1 2nd right icon
   * @param {string} level state to be called by the 'back' button
   * @param {function} help function in the current game state that display correct answer
   */
  func_addIcons: function (leftIcon0, leftIcon1, leftIcon2, rightIcon0, rightIcon1, level, help) {
    this.level = level;
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
          case 'back': navigationIcons.func_CallState(navigationIcons.level); break;
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

        if (cur.name == 'back') navigationIcons.left_text.name = game.lang.menu_back;
        else if (cur.name == 'menu') navigationIcons.left_text.name = game.lang.menu_list;
        else if (cur.name == 'help') navigationIcons.left_text.name = game.lang.menu_help;

        else if (cur.name == 'language') navigationIcons.right_text.name = game.lang.menu_world;
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

};