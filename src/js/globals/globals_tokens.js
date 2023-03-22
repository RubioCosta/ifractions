const medSrc = 'src/assets/img/'; // Base directory for media

/**
 * Metadata for all games
 * @type {object}
 */
const info = {
  all: {
    squareOne: {
      gameShape: 'square',
      gameType: 'squareOne',
      gameTypeUrl: 'game0',
      gameMode: ['A', 'B'],
      gameModeUrl: ['mode0', 'mode1'],
      gameOperation: ['Plus', 'Minus'],
      gameOperationUrl: ['operation_plus', 'operation_minus'],
      gameDifficulty: 3,
    },

    circleOne: {
      gameShape: 'circle',
      gameType: 'circleOne',
      gameTypeUrl: 'game1',
      gameMode: ['A', 'B'],
      gameModeUrl: ['mode2', 'mode3'],
      gameOperation: ['Plus', 'Minus', 'Mixed'],
      gameOperationUrl: [
        'operation_plus',
        'operation_minus',
        'operation_mixed',
      ],
      gameDifficulty: 5,
    },

    squareTwo: {
      gameShape: 'square',
      gameType: 'squareTwo',
      gameTypeUrl: 'game2',
      gameMode: ['A', 'B'],
      gameModeUrl: ['mode4', 'mode5'],
      gameOperation: ['Equals'],
      gameOperationUrl: ['operation_equals'],
      gameDifficulty: 5,
    },

    scaleOne: {
      gameShape: 'scale',
      gameType: 'scaleOne',
      gameTypeUrl: 'game0',
      gameMode: ['A'],
      gameModeUrl: ['mode0'],
      gameOperation: ['Plus'],
      gameOperationUrl: ['operation_plus'],
      gameDifficulty: 5,
    },
  },
  gameShape: [],
  gameType: [],
  gameTypeUrl: [],
  gameMode: [],
  gameModeUrl: [],
  gameOperation: [],
  gameOperationUrl: [],
  gameDifficulty: [],
};

// Called once when the game starts
(function () {
  for (key in info.all) {
    info.gameShape.push(info.all[key].gameShape);
    info.gameType.push(info.all[key].gameType);
    info.gameTypeUrl.push(info.all[key].gameTypeUrl);
    info.gameMode.push(info.all[key].gameMode);
    info.gameModeUrl.push(info.all[key].gameMode);
    info.gameOperation.push(info.all[key].gameOperation);
    info.gameOperationUrl.push(info.all[key].gameOperationUrl);
    info.gameDifficulty.push(info.all[key].gameDifficulty);
  }
})();

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
      ['bgimage', medSrc + 'scene/bg.jpg'],
      ['bg_snow', medSrc + 'scene/bg_snow.png'],
      ['bgmap', medSrc + 'scene/bg_map.png'],
      ['broken_sign', medSrc + 'scene/broken_sign.png'],
      ['bush', medSrc + 'scene/bush.png'],
      ['cloud', medSrc + 'scene/cloud.png'],
      ['floor', medSrc + 'scene/floor.png'],
      ['floor_stone', medSrc + 'scene/floor_stone.png'],
      ['floor_stone_left', medSrc + 'scene/floor_stone_left.png'],
      ['floor_stone_right', medSrc + 'scene/floor_stone_right.png'],
      ['wood_shelf', medSrc + 'scene/wood_shelf.png'],
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
      ['flag_BR', medSrc + 'flag/br.png'],
      ['flag_FR', medSrc + 'flag/fr.png'],
      ['flag_IT', medSrc + 'flag/it.png'],
      ['flag_PE', medSrc + 'flag/pe.png'],
      ['flag_US', medSrc + 'flag/us.png'],
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
      ['button', medSrc + 'interac_icon/button.png'],
      // Menu icons - Games
      ['game0', medSrc + 'levels/squareOne.png'], // Square I
      ['game1', medSrc + 'levels/circleOne.png'], // Circle I
      ['game2', medSrc + 'levels/squareTwo.png'], // Square II
      // Menu icons - Info box
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
      // Game Sprites
      ['kid_walk', medSrc + 'character/kid/walk.png', 26],
      // Navigation icons on the top of the page
      ['audio', medSrc + 'navig_icon/audio.png', 2],
      // Interactive icons
      ['select', medSrc + 'interac_icon/selection_box.png', 2],
      ['btn_square', medSrc + 'interac_icon/button_square.png', 2],
      // Menu icons - Game modes
      ['mode0', medSrc + 'levels/squareOne_1.png', 2], // Square I : A
      ['mode1', medSrc + 'levels/squareOne_2.png', 2], // Square I : B
      ['mode2', medSrc + 'levels/circleOne_1.png', 2], // Circle I : A
      ['mode3', medSrc + 'levels/circleOne_2.png', 2], // Circle I : B
      ['mode4', medSrc + 'levels/squareTwo_1.png', 2], // Square II : A
      ['mode5', medSrc + 'levels/squareTwo_2.png', 2], // Square II : B
      // Menu icons - Math operations
      ['operation_plus', medSrc + 'levels/operation_plus.png', 2], // Square/circle I : right
      ['operation_minus', medSrc + 'levels/operation_minus.png', 2], // Square/circle I : left
      ['operation_mixed', medSrc + 'levels/operation_mixed.png', 2], // Circle I : mixed
      ['operation_equals', medSrc + 'levels/operation_equals.png', 2], // Square II : equals
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
      ['farm', medSrc + 'scene/farm.png'],
      ['garage', medSrc + 'scene/garage.png'],
    ],
    sprite: [
      // Game sprites
      ['tractor', medSrc + 'character/tractor/tractor.png', 15],
    ],
    audio: [],
  },
  squareTwo: {
    image: [
      // Map buildings
      ['house', medSrc + 'scene/house.png'],
      ['school', medSrc + 'scene/school.png'],
    ],
    sprite: [
      // Game sprites
      ['kid_standing', medSrc + 'character/kid/lost.png', 6],
      ['kid_run', medSrc + 'character/kid/run.png', 12],
    ],
    audio: [],
  },
  circleOne: {
    image: [
      // Map buildings
      ['house', medSrc + 'scene/house.png'],
      ['school', medSrc + 'scene/school.png'],
      // Game images
      ['balloon', medSrc + 'character/balloon/airballoon_upper.png'],
      ['balloon_basket', medSrc + 'character/balloon/airballoon_base.png'],
    ],
    sprite: [
      // Game sprites
      ['kid_run', medSrc + 'character/kid/run.png', 12],
    ],
    audio: [],
  },
  scaleOne: {
    image: [
      // Map buildings
      ['farm', medSrc + 'scene/farm.png'],
      ['garage', medSrc + 'scene/garage.png'],

      ['scale_base', medSrc + 'character/scale/scale_base.png'],
      ['scale_top', medSrc + 'character/scale/scale_top.png'],
      ['scale_plate', medSrc + 'character/scale/scale_plate.png'],
    ],
    sprite: [
      // Game sprites
      ['tractor', medSrc + 'character/tractor/tractor.png', 15],
      ['floor_snow', medSrc + 'scene/floor_snow.png', 9],
    ],
    audio: [],
  },
};
