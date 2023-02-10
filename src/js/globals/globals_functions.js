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
   * @param {boolean} leftIcon0 1st left icon (back)
   * @param {boolean} leftIcon1 2nd left icon (main menu)
   * @param {boolean} leftIcon2 3rd left icon (solve game)
   * @param {boolean} rightIcon0 1st right icon (audio)
   * @param {boolean} rightIcon1 2nd right icon (lang)
   * @param {undefined|string} state state to be called by the 'back' button (must exist if param 'leftIcon0' is true)
   * @param {undefined|function} help function in the current game state that display correct answer
   */
  add: function (
    leftIcon0,
    leftIcon1,
    leftIcon2,
    rightIcon0,
    rightIcon1,
    state,
    help
  ) {
    const iconSize = 75;
    let xLeft = 10;
    let xRight = context.canvas.width - iconSize - 10;

    this.iconsList = [];

    // 'Descriptive labels' for the navigation icons
    this.left_text = game.add.text(xLeft, 73, '', textStyles.h4_brown);
    this.left_text.align = 'left';

    this.right_text = game.add.text(xRight + 50, 73, '', textStyles.h4_brown);
    this.right_text.align = 'right';

    // Left icons

    if (leftIcon0) {
      // Return to previous screen
      if (!state) {
        console.error(
          "Game error: You tried to add a 'back' icon without the 'state' parameter."
        );
      } else {
        this.state = state;
        this.iconsList.push(game.add.image(xLeft, 10, 'back', 1.5));
        xLeft += iconSize;
      }
    }

    if (leftIcon1) {
      // Return to main menu screen
      this.iconsList.push(game.add.image(xLeft, 10, 'menu', 1.5));
      xLeft += iconSize;
    }

    if (leftIcon2) {
      // Shows solution to the game
      if (!help) {
        console.error(
          "Game error: You tried to add a 'game solution' icon without the 'help' parameter."
        );
      } else {
        this.help = help;
        this.iconsList.push(game.add.image(xLeft, 10, 'help', 1.5));
        xLeft += iconSize;
      }
    }

    // Right icons

    if (rightIcon0) {
      // Turns game audio on/off
      this.audioIcon = game.add.sprite(xRight, 10, 'audio', 1, 1.5);
      this.audioIcon.curFrame = audioStatus ? 0 : 1;
      this.iconsList.push(this.audioIcon);
      xRight -= iconSize;
    }

    if (rightIcon1) {
      // Return to select language screen
      this.iconsList.push(game.add.image(xRight, 10, 'language', 1.5));
      xRight -= iconSize;
    }
  },

  /**
   * When 'back' icon is clicked go to this state
   *
   * @param {string} state name of the next state
   */
  callState: function (state) {
    if (audioStatus) game.audio.popSound.play();

    game.event.clear(self);
    game.state.start(state);
  },

  /**
   * Called by mouse click event
   *
   * @param {number} x contains the mouse x coordinate
   * @param {number} y contains the mouse y coordinate
   */
  onInputDown: function (x, y) {
    navigationIcons.iconsList.forEach((cur) => {
      if (game.math.isOverIcon(x, y, cur)) {
        const name = cur.name;
        switch (name) {
          case 'back':
            navigationIcons.callState(navigationIcons.state);
            break;
          case 'menu':
            navigationIcons.callState('menu');
            break;
          case 'help':
            navigationIcons.help();
            break;
          case 'language':
            navigationIcons.callState('lang');
            break;
          case 'audio':
            if (audioStatus) {
              audioStatus = false;
              navigationIcons.audioIcon.curFrame = 1;
            } else {
              audioStatus = true;
              if (audioStatus) game.audio.popSound.play();
              navigationIcons.audioIcon.curFrame = 0;
            }
            game.render.all();
            break;
          default:
            console.error('Game error: error in navigation icon');
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
  onInputOver: function (x, y) {
    let flag = false;

    navigationIcons.iconsList.forEach((cur) => {
      if (game.math.isOverIcon(x, y, cur)) {
        flag = true;
        let name = cur.name;
        switch (name) {
          case 'back':
            navigationIcons.left_text.name = game.lang.nav_back;
            break;
          case 'menu':
            navigationIcons.left_text.name = game.lang.nav_menu;
            break;
          case 'help':
            navigationIcons.left_text.name = game.lang.nav_help;
            break;
          case 'language':
            navigationIcons.right_text.name = game.lang.nav_lang;
            break;
          case 'audio':
            navigationIcons.right_text.name = game.lang.audio;
            break;
        }
      }
    });

    if (!flag) {
      navigationIcons.left_text.name = '';
      navigationIcons.right_text.name = '';
    } else {
      document.body.style.cursor = 'pointer';
    }
  },
};

/**
 * Sends game information to database
 *
 * @param {string} extraData player information for the current game
 */
const sendToDatabase = function (extraData) {
  // FOR MOODLE
  if (moodle) {
    if (self.result) moodleVar.hits[mapPosition - 1]++;
    else moodleVar.errors[mapPosition - 1]++;

    moodleVar.time[mapPosition - 1] += game.timer.elapsed;

    const url = iLMparameters.iLM_PARAM_ServerToGetAnswerURL;
    const grade = '' + getEvaluation();
    const report = getAnswer();
    const data =
      'return_get_answer=1' +
      '&iLM_PARAM_ActivityEvaluation=' +
      encodeURIComponent(grade) +
      '&iLM_PARAM_ArchiveContent=' +
      encodeURIComponent(report);

    const init = {
      method: 'POST',
      body: data,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    };

    fetch(url, init)
      .then((response) => {
        if (response.ok) {
          if (debugMode) console.log('Processing...');
        } else {
          console.error('Game error: Network response was not ok.');
        }
      })
      .catch((error) => {
        console.error(
          'Game error: problem with fetch operation - ' + error.message + '.'
        );
      });
  } else {
    // Create some variables we need to send to our PHP file
    // Attention: this names must be compactible to data table (MySQL server)
    // @see php/save.php
    const data =
      'line_ip=143.107.45.11' + // INSERT database server IP
      '&line_name=' +
      playerName +
      '&line_lang=' +
      langString +
      extraData;

    const url = 'php/save.php';

    const init = {
      method: 'POST',
      body: data,
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
    };
    fetch(url, init)
      .then((response) => {
        if (response.ok) {
          if (debugMode) console.log('Processing...');
          response.text().then((text) => {
            if (debugMode) {
              console.log(text);
            }
          });
        } else {
          console.error('Game error: Network response was not ok.');
        }
      })
      .catch((error) => {
        console.error(
          'Game error: problem with fetch operation - ' + error.message + '.'
        );
      });
  }
};

const renderBackground = (type) => {
  if (type === 'plain') {
    // Add plain blue background
    game.add.geom.rect(
      0,
      0,
      context.canvas.width,
      context.canvas.height,
      colors.white,
      0,
      colors.blueBg,
      1
    );
  } else {
    // Add background image
    game.add.image(0, 0, 'bgimage', 2.2);

    // Add clouds
    game.add.image(640, 100, 'cloud', 1.5);
    game.add.image(1280, 80, 'cloud', 1.5);
    game.add.image(300, 85, 'cloud', 1.2);

    // Add floor
    for (let i = 0; i < context.canvas.width / 150; i++) {
      game.add.image(i * 150, context.canvas.height - 150, 'floor', 1.5);
    }
  }
};

const gameFrame = function () {
  let x = (y = 300);
  let width = context.canvas.width - 2 * x;
  let height = context.canvas.height - 2 * y;
  let rect = function () {
    game.add.geom.rect(x, y, width, height, colors.red, 2);
  };
  let point = function (offsetW, offsetH) {
    for (let i = 0, y1 = y; i < 4; i++) {
      x1 = x;
      for (let j = 0; j < 7; j++) {
        game.add.geom.rect(x1, y1, 20, 20, undefined, 0, colors.red, 1);
        x1 += offsetW;
      }
      y1 += offsetH;
    }
  };
  return { x, y, width, height, rect, point };
};

// For debug
const debug = {
  grid: function () {
    const grid = 2;
    const h = 1920 / (grid + 0.5);
    const v = 1080 / (grid + 0.5);
    for (let i = 0; i < grid; i++) {
      game.add.geom.rect(
        h / 2 + i * h,
        0,
        h / 2,
        1080,
        '',
        0,
        colors.blue,
        0.3
      );
      game.add.geom.rect(
        0,
        v / 2 + i * v,
        1920,
        v / 2,
        '',
        0,
        colors.blue,
        0.3
      );
    }
  },
};
