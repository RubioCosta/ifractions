const baseUrl = 'src/assets/img/'; // Base directory for media

/**
 * Information for all the games
 * @type {Array}
 */
const gameList = [
  {
    gameName: 'squareOne',
    gameMode: ['a', 'b'],
    gameOperation: ['plus', 'minus'],
    gameDifficulty: 3,
    // info
    gameShape: 'square',
    assets: {
      gameNameBtn: 'game_0',
      gameModeBtn: ['mode_0', 'mode_1'],
      gameOperationBtn: ['operation_plus', 'operation_minus'],
      mapCharacterAnimation: (operation) => {
        return operation === 'plus'
          ? ['green_tractor', [0, 1, 2, 3, 4], 3]
          : ['red_tractor', [10, 11, 12, 13, 14], 3];
      },
      mapCharacter: (operation) => {
        let char;
        if (operation == 'plus') {
          char = game.add.sprite(
            self.points.x[curMapPosition],
            self.points.y[curMapPosition],
            'tractor',
            0,
            0.75
          );
        }
        if (operation === 'minus') {
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
      endCharacterAnimation: (animation) =>
        animation === 'plus'
          ? ['move', [0, 1, 2, 3, 4], 4]
          : ['move', [10, 11, 12, 13, 14], 4],
      endCharacter: (operation) => {
        const char = game.add.sprite(0, 490, 'tractor', 0, 0.7);
        char.anchor(0.5, 0.5);
        if (operation === 'plus') char.curFrame = 10;
        return char;
      },
      endBuilding: () => game.add.image(650, 260, 'farm', 1.1),
    },
  },
  {
    gameName: 'circleOne',
    gameMode: ['a', 'b'],
    gameOperation: ['plus', 'minus', 'mixed'],
    gameDifficulty: 5,
    // info
    gameShape: 'circle',
    assets: {
      gameNameBtn: 'game_1',
      gameModeBtn: ['mode_2', 'mode_3'],
      gameOperationBtn: [
        'operation_plus',
        'operation_minus',
        'operation_mixed',
      ],
      mapCharacterAnimation: (operation) => {
        return ['kid', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3];
      },
      mapCharacter: () => {
        return game.add.sprite(
          self.points.x[curMapPosition],
          self.points.y[curMapPosition],
          'kid_running',
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
      endCharacterAnimation: [
        'move',
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        3,
      ],
      endCharacter: () => {
        const char = game.add.sprite(0, -152, 'kid_running', 0, 0.7);
        char.anchor(0.5, 0.5);
        return char;
      },
      endBuilding: () => game.add.image(600, 222, 'school', 0.7),
    },
  },
  {
    gameName: 'squareTwo',
    gameMode: ['a', 'b'],
    gameOperation: ['minus'],
    gameDifficulty: 5,
    // info
    gameShape: 'square',
    assets: {
      gameNameBtn: 'game_2',
      gameModeBtn: ['mode_4', 'mode_5'],
      gameOperationBtn: ['operation_equals'],
      mapCharacterAnimation: (operation) => {
        return ['kid', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3];
      },
      mapCharacter: (operation) => {
        return game.add.sprite(
          self.points.x[curMapPosition],
          self.points.y[curMapPosition],
          'kid_running',
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
      endCharacterAnimation: [
        'move',
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        3,
      ],
      endCharacter: () => {
        const char = game.add.sprite(0, 460, 'kid_running', 6, 0.7);
        char.anchor(0.5, 0.5);
        return char;
      },
      endBuilding: () => game.add.image(600, 222, 'school', 0.7),
    },
  },
  {
    gameName: 'scaleOne',
    gameMode: ['a'],
    gameOperation: ['plus'],
    gameDifficulty: 1,
    // info
    gameShape: 'noShape',
    assets: {
      gameNameBtn: 'game_3',
      gameModeBtn: ['mode_6'],
      gameOperationBtn: ['operation_equals'],
      mapCharacterAnimation: (operation) => {
        return operation === 'plus'
          ? ['green_tractor', [0, 1, 2, 3, 4], 3]
          : ['red_tractor', [10, 11, 12, 13, 14], 3];
      },
      mapCharacter: (operation) => {
        let char;
        if (operation == 'plus') {
          char = game.add.sprite(
            self.points.x[curMapPosition],
            self.points.y[curMapPosition],
            'tractor',
            0,
            0.75
          );
        }
        if (operation === 'minus') {
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
      // scene new level
      ['floor_stone_left', baseUrl + 'scene/new_level/floor_stone_left.png'],
      ['floor_stone_right', baseUrl + 'scene/new_level/floor_stone_right.png'],
      ['floor_stone', baseUrl + 'scene/new_level/floor_stone.png'],
      ['wood_shelf', baseUrl + 'scene/new_level/wood_shelf.png'],
      ['bg_snow', baseUrl + 'scene/new_level/bg_snow.png'],
      // Scene
      ['bg_default', baseUrl + 'scene/bg_default.jpg'],
      ['bg_map', baseUrl + 'scene/bg_map.png'],
      ['bush', baseUrl + 'scene/bush.png'],
      ['cloud', baseUrl + 'scene/cloud.png'],
      ['floor', baseUrl + 'scene/floor.png'],
      ['place_off', baseUrl + 'scene/place_off.png'],
      ['place_on', baseUrl + 'scene/place_on.png'],
      ['rock', baseUrl + 'scene/rock.png'],
      ['road', baseUrl + 'scene/road.png'],
      ['sign', baseUrl + 'scene/sign.png'],
      ['sign_broken', baseUrl + 'scene/sign_broken.png'],
      ['tree_1', baseUrl + 'scene/tree_1.png'],
      ['tree_2', baseUrl + 'scene/tree_2.png'],
      ['tree_3', baseUrl + 'scene/tree_3.png'],
      ['tree_4', baseUrl + 'scene/tree_4.png'],
      // Flags
      ['flag_BR', baseUrl + 'flags/br.png'],
      ['flag_FR', baseUrl + 'flags/fr.png'],
      ['flag_IT', baseUrl + 'flags/it.png'],
      ['flag_PE', baseUrl + 'flags/pe.png'],
      ['flag_US', baseUrl + 'flags/us.png'],
      // Navigation icons on the top of the page
      ['back', baseUrl + 'icons_navigation/back.png'],
      ['show_solution', baseUrl + 'icons_navigation/show_solution.png'],
      ['home', baseUrl + 'icons_navigation/home.png'],
      ['language', baseUrl + 'icons_navigation/language.png'],
      ['menu', baseUrl + 'icons_navigation/menu.png'],
      // Interactive icons
      ['answer_correct', baseUrl + 'icons_interactive/answer_correct.png'],
      ['answer_wrong', baseUrl + 'icons_interactive/answer_wrong.png'],
      ['arrow_down', baseUrl + 'icons_interactive/arrow_down.png'],
      ['btn', baseUrl + 'icons_interactive/btn.png'],
      ['close', baseUrl + 'icons_interactive/close.png'],
      ['info', baseUrl + 'icons_interactive/info.png'],
      ['pointer', baseUrl + 'icons_interactive/pointer.png'],
      // Menu icons - Games
      ['game_0', baseUrl + 'icons_menu/squareOne.png'], // Square I
      ['game_1', baseUrl + 'icons_menu/circleOne.png'], // Circle I
      ['game_2', baseUrl + 'icons_menu/squareTwo.png'], // Square II
      ['game_3', baseUrl + 'icons_menu/scaleOne.png'], // Scale I
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
      ['kid_walking', baseUrl + 'characters/kid/walking.png', 26],
      // Navigation icons on the top of the page
      ['audio', baseUrl + 'icons_navigation/audio.png', 2],
      // Interactive icons
      ['select', baseUrl + 'icons_interactive/selection_box.png', 2],
      ['btn_square', baseUrl + 'icons_interactive/btn_square.png', 2],
      // Menu icons - Game modes
      ['mode_0', baseUrl + 'icons_menu/squareOne_1.png', 2], // Square I : A
      ['mode_1', baseUrl + 'icons_menu/squareOne_2.png', 2], // Square I : B
      ['mode_2', baseUrl + 'icons_menu/circleOne_1.png', 2], // Circle I : A
      ['mode_3', baseUrl + 'icons_menu/circleOne_2.png', 2], // Circle I : B
      ['mode_4', baseUrl + 'icons_menu/squareTwo_1.png', 2], // Square II : A
      ['mode_5', baseUrl + 'icons_menu/squareTwo_2.png', 2], // Square II : B
      ['mode_6', baseUrl + 'icons_menu/scaleOne_1.png', 2], // Scale I : A
      // Menu icons - Math operations
      ['operation_plus', baseUrl + 'icons_menu/operation_plus.png', 2],
      ['operation_minus', baseUrl + 'icons_menu/operation_minus.png', 2],
      ['operation_mixed', baseUrl + 'icons_menu/operation_mixed.png', 2],
      ['operation_equals', baseUrl + 'icons_menu/operation_equals.png', 2],
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
      ['tractor', baseUrl + 'characters/tractor/tractor.png', 15],
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
      ['kid_standing', baseUrl + 'characters/kid/lost.png', 6],
      ['kid_running', baseUrl + 'characters/kid/running.png', 12],
    ],
    audio: [],
  },
  circleOne: {
    image: [
      // Map buildings
      ['house', baseUrl + 'scene/house.png'],
      ['school', baseUrl + 'scene/school.png'],
      // Game images
      ['balloon', baseUrl + 'characters/balloon/balloon.png'],
      ['balloon_basket', baseUrl + 'characters/balloon/balloon_basket.png'],
    ],
    sprite: [
      // Game sprites
      ['kid_running', baseUrl + 'characters/kid/running.png', 12],
    ],
    audio: [],
  },
  scaleOne: {
    image: [
      // Map buildings
      ['farm', baseUrl + 'scene/farm.png'],
      ['garage', baseUrl + 'scene/garage.png'],
      // Game images
      ['scale_base', baseUrl + 'characters/scale/scale_base.png'],
      ['scale_arm', baseUrl + 'characters/scale/scale_arm.png'],
      ['scale_plate', baseUrl + 'characters/scale/scale_plate.png'],
    ],
    sprite: [
      // Map buildings
      ['tractor', baseUrl + 'characters/tractor/tractor.png', 15],
      ['floor_snow', baseUrl + 'scene/new_level/floor_snow.png', 9],
    ],
    audio: [],
  },
};
