const baseUrl = 'src/assets/img/'; // Base directory for media

/**
 * Information for all the games
 * @type {Array}
 */
const gameList = [
  {
    gameName: 'squareOne',
    gameMode: ['A', 'B'],
    gameOperation: ['Plus', 'Minus'],
    gameDifficulty: 3,

    // info
    gameShape: 'square',

    assets: {
      gameNameBtn: 'game0',
      gameModeBtn: ['mode0', 'mode1'],
      gameOperationBtn: ['operation_plus', 'operation_minus'],
      mapCharacterAnimation: (operation) => {
        return operation === 'plus'
          ? ['green_tractor', [0, 1, 2, 3, 4], 3]
          : ['red_tractor', [10, 11, 12, 13, 14], 3];
      },
      mapCharacter: (operation) => {
        let char;
        if (operation == 'Plus') {
          char = game.add.sprite(
            self.points.x[curMapPosition],
            self.points.y[curMapPosition],
            'tractor',
            0,
            0.75
          );
        }
        if (operation === 'Minus') {
          char = game.add.sprite(
            self.points.x[curMapPosition],
            self.points.y[curMapPosition],
            'tractor',
            10,
            0.75
          );
        }
        char.rotate = -30; // 25 anticlock
        return char;
      },
      mapStart: () => {
        return game.add
          .image(self.points.x[0], self.points.y[0], 'garage', 0.6)
          .anchor(0.5, 1);
      },
      mapEnd: () => {
        return game.add
          .image(self.points.x[5], self.points.y[5], 'farm', 0.9)
          .anchor(0.4, 0.7);
      },
    },
  },
  {
    // game data
    gameName: 'circleOne',
    gameMode: ['A', 'B'],
    gameOperation: ['Plus', 'Minus', 'Mixed'],
    gameDifficulty: 5,

    // info
    gameShape: 'circle',

    assets: {
      gameNameBtn: 'game1',
      gameModeBtn: ['mode2', 'mode3'],
      gameOperationBtn: [
        'operation_plus',
        'operation_minus',
        'operation_mixed',
      ],
      mapCharacterAnimation: () => {
        ['kid', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3];
      },
      mapCharacter: () => {
        return game.add.sprite(
          self.points.x[curMapPosition],
          self.points.y[curMapPosition],
          'kid_run',
          0,
          0.6
        );
      },
      mapStart: () => {
        return game.add
          .image(self.points.x[0], self.points.y[0], 'house', 1.05)
          .anchor(0.5, 0.8);
      },
      mapEnd: () => {
        return game.add
          .image(self.points.x[5], self.points.y[5], 'school', 0.525)
          .anchor(0.2, 0.7);
      },
    },
  },
  {
    // game data
    gameName: 'squareTwo',
    gameMode: ['A', 'B'],
    gameOperation: ['Equals'],
    gameDifficulty: 5,

    // info
    gameShape: 'square',
    assets: {
      gameNameBtn: 'game2',
      gameModeBtn: ['mode4', 'mode5'],
      gameOperationBtn: ['operation_equals'],
      mapCharacterAnimation: () => {
        ['kid', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3];
      },
      mapCharacter: () => {
        return game.add.sprite(
          self.points.x[curMapPosition],
          self.points.y[curMapPosition],
          'kid_run',
          0,
          0.6
        );
      },
      mapStart: () => {
        return game.add
          .image(this.points.x[0], this.points.y[0], 'house', 1.05)
          .anchor(0.5, 0.8);
      },
      mapEnd: () => {
        return game.add
          .image(this.points.x[5], this.points.y[5], 'school', 0.525)
          .anchor(0.2, 0.7);
      },
    },
  },
  {
    // game data
    gameName: 'scaleOne',
    gameMode: ['A'],
    gameOperation: ['Plus'],
    gameDifficulty: 1,

    // info
    gameShape: 'noShape',

    assets: {
      gameNameBtn: 'game3',
      gameModeBtn: ['mode6'],
      gameOperationBtn: ['operation_equals'],
      mapCharacterAnimation: (operation) => {
        return operation === 'plus'
          ? ['green_tractor', [0, 1, 2, 3, 4], 3]
          : ['red_tractor', [10, 11, 12, 13, 14], 3];
      },
      mapCharacter: (operation) => {
        let char;
        if (operation == 'Plus') {
          char = game.add.sprite(
            self.points.x[curMapPosition],
            self.points.y[curMapPosition],
            'tractor',
            0,
            0.75
          );
        }
        if (operation === 'Minus') {
          char = game.add.sprite(
            self.points.x[curMapPosition],
            self.points.y[curMapPosition],
            'tractor',
            10,
            0.75
          );
        }
        char.rotate = -30; // 25 anticlock
        return char;
      },
      mapStart: () => {
        return game.add
          .image(self.points.x[0], self.points.y[0], 'garage', 0.6)
          .anchor(0.5, 1);
      },
      mapEnd: () => {
        return game.add
          .image(self.points.x[5], self.points.y[5], 'farm', 0.9)
          .anchor(0.4, 0.7);
      },
    },
  },
];

/**
 * Preset colors for graphic elements.
 * @type {object}
 */
const colors = {
  // Blues
  blue: '#003cb3', // Subtitle
  blueDark: '#183780', // Line color that indicates right and fraction numbers

  blueBg: '#cce5ff', // Background color
  blueBgOff: '#adc8e6',
  blueBgInsideLevel: '#a8c0e6', // Background color in squareOne (used for floor gap)

  blueMenuLine: '#b7cdf4',

  // Reds
  red: '#b30000', // Linecolor that indicates left
  redLight: '#d27979', // squareTwo figures
  redDark: '#330000', // squareTwo figures and some titles

  // Greens
  green: '#00804d', // Title
  greenLight: '#83afaf', // squareTwo figures
  greenDark: '#1e2f2f', // squareTwo figures
  greenNeon: '#00d600',

  // Basics
  white: '#efeff5',
  gray: '#708090',
  black: '#000',
  yellow: '#ffef1f',
};

const fontSizes = {
  h1: '48px',
  h2: '42px',
  h3: '38px',
  h4: '36px',
  p: '30px',
};
/**
 * Preset text styles for game text.<br>
 * Contains: font, size, text color and text align.
 * @type {object}
 */
const textStyles = {
  h1_green: {
    font: fontSizes.h1 + ' Arial,sans-serif',
    fill: colors.green,
    align: 'center',
  }, // Menu title
  h2_green: {
    font: fontSizes.h2 + ' Arial,sans-serif',
    fill: colors.green,
    align: 'center',
  }, // Flag labels (langState)
  h3_green: {
    font: fontSizes.h3 + ' Arial,sans-serif',
    fill: colors.green,
    align: 'center',
  },
  h4_green: {
    font: fontSizes.h4 + ' Arial,sans-serif',
    fill: colors.green,
    align: 'center',
  },
  p_green: {
    font: fontSizes.p + ' Arial,sans-serif',
    fill: colors.green,
    align: 'center',
  },

  h1_white: {
    font: fontSizes.h1 + ' Arial,sans-serif',
    fill: colors.white,
    align: 'center',
  }, // Ok button (nameState)
  h2_white: {
    font: fontSizes.h2 + ' Arial,sans-serif',
    fill: colors.white,
    align: 'center',
  }, // Difficulty buttons (menuState)
  h3__white: {
    font: fontSizes.h3 + ' Arial,sans-serif',
    fill: colors.white,
    align: 'center',
  }, // Difficulty numbers (menuState)
  h4_white: {
    font: fontSizes.h4 + ' Arial,sans-serif',
    fill: colors.white,
    align: 'center',
  }, // Difficulty numbers (menuState)
  p_white: {
    font: fontSizes.p + ' Arial,sans-serif',
    fill: colors.white,
    align: 'center',
  }, // Enter button (menuState)

  h1_brown: {
    font: fontSizes.h1 + ' Arial,sans-serif',
    fill: colors.redDark,
    align: 'center',
  },
  h2_brown: {
    font: fontSizes.h2 + ' Arial,sans-serif',
    fill: colors.redDark,
    align: 'center',
  }, // Map difficulty label
  h3_brown: {
    font: fontSizes.h3 + ' Arial,sans-serif',
    fill: colors.redDark,
    align: 'center',
  },
  h4_brown: {
    font: fontSizes.h4 + ' Arial,sans-serif',
    fill: colors.redDark,
    align: 'center',
  }, // Menu overtitle
  p_brown: {
    font: fontSizes.p + ' Arial,sans-serif',
    fill: colors.redDark,
    align: 'center',
  }, // Map difficulty label

  h1_blue: {
    font: fontSizes.h1 + ' Arial,sans-serif',
    fill: colors.blue,
    align: 'center',
  },
  h2_blue: {
    font: fontSizes.h2 + ' Arial,sans-serif',
    fill: colors.blue,
    align: 'center',
  }, // Menu subtitle
  h3_blue: {
    font: fontSizes.h3 + ' Arial,sans-serif',
    fill: colors.blue,
    align: 'center',
  },
  h4_blue: {
    font: fontSizes.h4 + ' Arial,sans-serif',
    fill: colors.blue,
    align: 'center',
  }, // Menu subtitle
  p_blue: {
    font: fontSizes.p + ' Arial,sans-serif',
    fill: colors.blue,
    align: 'center',
  },

  h1_blueDark: {
    font: fontSizes.h1 + ' Arial,sans-serif',
    fill: colors.blueDark,
    align: 'center',
  },
  h2_blueDark: {
    font: fontSizes.h2 + ' Arial,sans-serif',
    fill: colors.blueDark,
    align: 'center',
  }, // Fractions
  h3_blueDark: {
    font: fontSizes.h3 + ' Arial,sans-serif',
    fill: colors.blueDark,
    align: 'center',
  },
  h4_blueDark: {
    font: fontSizes.h4 + ' Arial,sans-serif',
    fill: colors.blueDark,
    align: 'center',
  }, // Fractions
  p_blueDark: {
    font: fontSizes.p + ' Arial,sans-serif',
    fill: colors.blueDark,
    align: 'center',
  }, // Fractions
};

/**
 * List of URL for all media in the game
 * divided 1st by the 'state' that loads the media
 * and 2nd by the 'media type' for that state.
 *
 * @type {object}
 */
const url = {
  /**
   * url.<state>
   * where <state> can be: boot, menu, squareOne, squareTwo, circleOne.
   */
  boot: {
    /**
     * url.<state>.<media type>
     * where <media type> can be: image, sprite, audio <br><br>
     *
     * image: [ [name, source], ... ] <br>
     * sprite: [ [name, source, number of frames], ... ] <br>
     * audio: [ [name, [source, alternative source] ], ... ]
     */
    image: [
      // Scene
      ['bgimage', baseUrl + 'scene/bg.jpg'],
      ['bg_snow', baseUrl + 'scene/bg_snow.png'],
      ['bgmap', baseUrl + 'scene/bg_map.png'],
      ['broken_sign', baseUrl + 'scene/broken_sign.png'],
      ['bush', baseUrl + 'scene/bush.png'],
      ['cloud', baseUrl + 'scene/cloud.png'],
      ['floor_stone_left', baseUrl + 'scene/floor_stone_left.png'],
      ['floor_stone_right', baseUrl + 'scene/floor_stone_right.png'],
      ['floor_stone', baseUrl + 'scene/floor_stone.png'],
      ['floor', baseUrl + 'scene/floor.png'],
      ['wood_shelf', baseUrl + 'scene/wood_shelf.png'],
      ['place_off', baseUrl + 'scene/place_off.png'],
      ['place_on', baseUrl + 'scene/place_on.png'],
      ['rock', baseUrl + 'scene/rock.png'],
      ['road', baseUrl + 'scene/road.png'],
      ['sign', baseUrl + 'scene/sign.png'],
      ['tree1', baseUrl + 'scene/tree.png'],
      ['tree2', baseUrl + 'scene/tree2.png'],
      ['tree3', baseUrl + 'scene/tree3.png'],
      ['tree4', baseUrl + 'scene/tree4.png'],
      // Flags
      ['flag_BR', baseUrl + 'flag/br.png'],
      ['flag_FR', baseUrl + 'flag/fr.png'],
      ['flag_IT', baseUrl + 'flag/it.png'],
      ['flag_PE', baseUrl + 'flag/pe.png'],
      ['flag_US', baseUrl + 'flag/us.png'],
      // Navigation icons on the top of the page
      ['back', baseUrl + 'navig_icon/back.png'],
      ['help', baseUrl + 'navig_icon/help.png'],
      ['home', baseUrl + 'navig_icon/home.png'],
      ['language', baseUrl + 'navig_icon/language.png'],
      ['menu', baseUrl + 'navig_icon/menu.png'],
      // Interactive icons
      ['arrow_down', baseUrl + 'interac_icon/down.png'],
      ['close', baseUrl + 'interac_icon/close.png'],
      ['error', baseUrl + 'interac_icon/error.png'],
      ['help_pointer', baseUrl + 'interac_icon/pointer.png'],
      ['info', baseUrl + 'interac_icon/info.png'],
      ['ok', baseUrl + 'interac_icon/ok.png'],
      ['button', baseUrl + 'interac_icon/button.png'],
      // Menu icons - Games
      ['game0', baseUrl + 'levels/squareOne.png'], // Square I
      ['game1', baseUrl + 'levels/circleOne.png'], // Circle I
      ['game2', baseUrl + 'levels/squareTwo.png'], // Square II
      ['game3', baseUrl + 'levels/scaleOne.png'], // Scale I
      // Menu icons - Info box
      ['c1-A', baseUrl + 'info_box/c1-A.png'],
      ['c1-A-h', baseUrl + 'info_box/c1-A-h.png'],
      ['c1-B-h', baseUrl + 'info_box/c1-B-h.png'],
      ['c1-diff-1', baseUrl + 'info_box/c1-diff-1.png'],
      ['c1-diff-5', baseUrl + 'info_box/c1-diff-5.png'],
      ['c1-label', baseUrl + 'info_box/c1-label.png'],
      ['map-c1s2', baseUrl + 'info_box/map-c1s2.png'],
      ['map-s1', baseUrl + 'info_box/map-s1.png'],
      ['s1-A', baseUrl + 'info_box/s1-A.png'],
      ['s1-A-h', baseUrl + 'info_box/s1-A-h.png'],
      ['s1-B-h', baseUrl + 'info_box/s1-B-h.png'],
      ['s1-diff-1', baseUrl + 'info_box/s1-diff-1.png'],
      ['s1-diff-3', baseUrl + 'info_box/s1-diff-3.png'],
      ['s1-label', baseUrl + 'info_box/s1-label.png'],
      ['s2', baseUrl + 'info_box/s2.png'],
      ['s2-A-h', baseUrl + 'info_box/s2-A-h.png'],
      ['s2-B-h', baseUrl + 'info_box/s2-B-h.png'],
      ['s2-diff-1', baseUrl + 'info_box/s2-diff-1.png'],
      ['s2-diff-5', baseUrl + 'info_box/s2-diff-5.png'],
      ['s2-label', baseUrl + 'info_box/s2-label.png'],
      ['operation_plus', baseUrl + 'info_box/operation_plus.png'],
      ['operation_minus', baseUrl + 'info_box/operation_minus.png'],
      ['operation_mixed', baseUrl + 'info_box/operation_mixed.png'],
      ['operation_equals', baseUrl + 'info_box/operation_equals.png'],
    ],
    sprite: [
      // Game Sprites
      ['kid_walk', baseUrl + 'character/kid/walk.png', 26],
      // Navigation icons on the top of the page
      ['audio', baseUrl + 'navig_icon/audio.png', 2],
      // Interactive icons
      ['select', baseUrl + 'interac_icon/selection_box.png', 2],
      ['btn_square', baseUrl + 'interac_icon/button_square.png', 2],
      // Menu icons - Game modes
      ['mode0', baseUrl + 'levels/squareOne_1.png', 2], // Square I : A
      ['mode1', baseUrl + 'levels/squareOne_2.png', 2], // Square I : B
      ['mode2', baseUrl + 'levels/circleOne_1.png', 2], // Circle I : A
      ['mode3', baseUrl + 'levels/circleOne_2.png', 2], // Circle I : B
      ['mode4', baseUrl + 'levels/squareTwo_1.png', 2], // Square II : A
      ['mode5', baseUrl + 'levels/squareTwo_2.png', 2], // Square II : B
      ['mode6', baseUrl + 'levels/scaleOne_1.png', 2], // Scale I : A
      // Menu icons - Math operations
      ['operation_plus', baseUrl + 'levels/operation_plus.png', 2], // Square/circle I : right
      ['operation_minus', baseUrl + 'levels/operation_minus.png', 2], // Square/circle I : left
      ['operation_mixed', baseUrl + 'levels/operation_mixed.png', 2], // Circle I : mixed
      ['operation_equals', baseUrl + 'levels/operation_equals.png', 2], // Square II : equals
    ],
    audio: [
      // Sound effects
      ['beepSound', ['src/assets/audio/beep.ogg', 'src/assets/audio/beep.mp3']],
      ['okSound', ['src/assets/audio/ok.ogg', 'src/assets/audio/ok.mp3']],
      [
        'errorSound',
        ['src/assets/audio/error.ogg', 'src/assets/audio/error.mp3'],
      ],
      ['popSound', ['', 'src/assets/audio/pop.wav']],
    ],
  },
  squareOne: {
    image: [
      // Map buildings
      ['farm', baseUrl + 'scene/farm.png'],
      ['garage', baseUrl + 'scene/garage.png'],
    ],
    sprite: [
      // Game sprites
      ['tractor', baseUrl + 'character/tractor/tractor.png', 15],
    ],
    audio: [],
  },
  squareTwo: {
    image: [
      // Map buildings
      ['house', baseUrl + 'scene/house.png'],
      ['school', baseUrl + 'scene/school.png'],
    ],
    sprite: [
      // Game sprites
      ['kid_standing', baseUrl + 'character/kid/lost.png', 6],
      ['kid_run', baseUrl + 'character/kid/run.png', 12],
    ],
    audio: [],
  },
  circleOne: {
    image: [
      // Map buildings
      ['house', baseUrl + 'scene/house.png'],
      ['school', baseUrl + 'scene/school.png'],
      // Game images
      ['balloon', baseUrl + 'character/balloon/airballoon_upper.png'],
      ['balloon_basket', baseUrl + 'character/balloon/airballoon_base.png'],
    ],
    sprite: [
      // Game sprites
      ['kid_run', baseUrl + 'character/kid/run.png', 12],
    ],
    audio: [],
  },
  scaleOne: {
    image: [
      // Map buildings
      ['farm', baseUrl + 'scene/farm.png'],
      ['garage', baseUrl + 'scene/garage.png'],

      ['scale_base', baseUrl + 'character/scale/scale_base.png'],
      ['scale_top', baseUrl + 'character/scale/scale_top.png'],
      ['scale_plate', baseUrl + 'character/scale/scale_plate.png'],
    ],
    sprite: [
      // Game sprites
      ['tractor', baseUrl + 'character/tractor/tractor.png', 15],
      ['floor_snow', baseUrl + 'scene/floor_snow.png', 9],
    ],
    audio: [],
  },
};
