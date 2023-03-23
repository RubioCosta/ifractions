/******************************
 * This file holds game states.
 ******************************/

/** [CUSTOM MENU STATE] Screen where the user can customise the selected game - game mode, math operation, level of difficulty.
 *
 * @namespace
 */
const customMenuState = {
  /**
   * Preloads media for current state
   */
  preload: function () {
    // LOADING MEDIA
    game.load.sprite(url[gameName].sprite);
    game.load.image(url[gameName].image);
  },

  /**
   * Main code
   */
  create: function () {
    // FOR MOODLE
    if (moodle && iLMparameters.iLM_PARAM_SendAnswer == 'false') {
      // Student role
      game.state.start('map');
    } else {
      renderBackground();

      // Overtitle : Selected game
      game.add.text(
        context.canvas.width / 2,
        50,
        game.lang.game.toUpperCase() + ': ' + menuState.menuIcons,
        textStyles.p_brown
      );
      // Title : Customize the selected game
      game.add.text(
        context.canvas.width / 2,
        100,
        game.lang.custom_game,
        textStyles.h1_green
      );

      // Loads navigation icons
      navigationIcons.add(true, false, false, true, true, 'menu', false);

      const curGame = metadata.all[gameName];

      this.menuIcons = [];

      let offsetW = game.math.getOffset(gameFrame().width, 5);
      let offsetH = game.math.getOffset(
        gameFrame().height,
        curGame.gameMode.length
      );

      let x = gameFrame().x;
      let y = gameFrame().y;

      const auxText = this.renderSectionTitles(x, y, offsetW, offsetH);
      this.renderCheckBox(x, y, offsetW, offsetH);
      this.renderModeSection(x, y, offsetW, offsetH, curGame);
      this.renderOperationSection(x, y, offsetW, offsetH, curGame);
      this.renderDifficultySection(x, y, offsetW, offsetH, curGame);
      this.renderEnterSection(x, y);
      this.renderInfoBox(auxText);

      // ------------- EVENTS

      game.event.add('click', this.onInputDown);
      game.event.add('mousemove', this.onInputOver);

      // console.log('DEBUG');
      //gameFrame().rect();
      //gameFrame().point(offsetW, offsetH);
      // const s1 = 11;
      // const c1 = 14;
      // const s2 = 12;
      // self.load(this.menuIcons[s1]);
    }
  },

  /**
   * Saves information selected by the player
   *
   * @param {object} icon selected icon
   */
  load: function (icon) {
    const type = icon.iconType;

    if (audioStatus) game.audio.popSound.play();

    switch (type) {
      case 'gameMode':
        gameMode = icon.gameMode;
        break;
      case 'gameOperation':
        gameOperation = icon.gameOperation;
        break;
      case 'difficulty':
        gameDifficulty = icon.difficulty;
        break;
      case 'infoIcon':
        self.showInfoBox(icon);
        break;
      case 'selectionBox':
        if (icon.curFrame == 0) {
          icon.curFrame = 1;
          fractionLabel = true;
        } else {
          icon.curFrame = 0;
          fractionLabel = false;
        }
        game.render.all();
        break;
      case 'enter':
        if (debugMode) {
          console.log(
            '------------------------------' +
              '\nGame State: ' +
              gameName +
              '\nGame Mode: ' +
              gameMode +
              '\n------------------------------'
          );
        }
        mapPosition = 0; // Map position
        mapMove = true; // Move no next point
        completedLevels = 0; // Reset the game progress when entering a new level
        game.state.start('map');
        break;
    }
  },

  /**
   * Called by mouse click event
   *
   * @param {object} mouseEvent contains the mouse click coordinates
   */
  onInputDown: function (mouseEvent) {
    const x = game.math.getMouse(mouseEvent).x;
    const y = game.math.getMouse(mouseEvent).y;
    let overIcon;

    // Check if clicked on an icon
    for (let i in self.menuIcons) {
      if (game.math.isOverIcon(x, y, self.menuIcons[i])) {
        overIcon = i;
        break;
      }
    }

    // Update gui
    if (overIcon) {
      // If has clicked on an icon
      document.body.style.cursor = 'pointer';
      self.menuIcons.forEach((cur) => {
        if (cur.iconType == self.menuIcons[overIcon].iconType) {
          // If its in the same icon category
          if (cur == self.menuIcons[overIcon]) {
            // If its the clicked icon
            if (cur.iconType == 'gameMode' || cur.iconType == 'gameOperation')
              cur.curFrame = 1;
            else if (cur.iconType == 'difficulty') cur.curFrame = 0;
          } else {
            if (cur.iconType == 'gameMode' || cur.iconType == 'gameOperation')
              cur.curFrame = 0;
            else if (cur.iconType == 'difficulty') cur.curFrame = 1;
          }
        }
      });

      self.load(self.menuIcons[overIcon]);
    } else document.body.style.cursor = 'auto';

    navigationIcons.onInputDown(x, y);

    game.render.all();
  },

  /**
   * Called by mouse move event
   *
   * @param {object} mouseEvent contains the mouse move coordinates
   */
  onInputOver: function (mouseEvent) {
    const x = game.math.getMouse(mouseEvent).x;
    const y = game.math.getMouse(mouseEvent).y;
    let overIcon;

    // Check if pointer is over an icon
    for (let i in self.menuIcons) {
      if (game.math.isOverIcon(x, y, self.menuIcons[i])) {
        overIcon = i;
        break;
      }
    }

    // Update gui
    if (overIcon) {
      // If pointer is over icon
      document.body.style.cursor = 'pointer';
      self.menuIcons.forEach((cur) => {
        if (cur.iconType == self.menuIcons[overIcon].iconType) {
          // If its in the same icon category
          if (cur == self.menuIcons[overIcon]) {
            // If its the icon the pointer is over
            if (cur.iconType == 'enter')
              self.enterText.style = textStyles.h3__white;
            cur.scale = cur.originalScale * 1.1;
          } else {
            cur.scale = cur.originalScale;
          }
        }
      });
    } else {
      // If pointer is not over icon
      if (self.enterText) self.enterText.style = textStyles.h4_white;
      self.menuIcons.forEach((cur) => {
        cur.scale = cur.originalScale;
      });
      document.body.style.cursor = 'auto';
    }

    // Check navigation icons
    navigationIcons.onInputOver(x, y);

    game.render.all();
  },

  renderSectionTitles: function (x, y, offsetW, offsetH) {
    let infoIcon;

    // Label 'Game Modes'
    game.add.text(x + offsetW, y, game.lang.game_modes, textStyles.h2_blue);

    infoIcon = game.add.image(x + 2 * offsetW - 30, y - 20, 'info', 0.9, 1);
    infoIcon.anchor(0.5, 0.5);
    infoIcon.iconType = 'infoIcon';
    infoIcon.id = 'gameMode';
    self.menuIcons.push(infoIcon);

    // Label 'Operations'
    game.add.text(x + 3 * offsetW, y, game.lang.operations, textStyles.h2_blue);

    infoIcon = game.add.image(x + 4 * offsetW - 30, y - 20, 'info', 0.9, 1);
    infoIcon.anchor(0.5, 0.5);
    infoIcon.iconType = 'infoIcon';
    infoIcon.id = 'gameOperation';
    self.menuIcons.push(infoIcon);

    // Label 'Difficulties'
    game.add.text(
      x + 5 * offsetW,
      y,
      game.lang.difficulties,
      textStyles.h2_blue
    );

    infoIcon = game.add.image(x + 6 * offsetW - 30, y - 20, 'info', 0.9, 1);
    infoIcon.anchor(0.5, 0.5);
    infoIcon.iconType = 'infoIcon';
    infoIcon.id = 'gameDifficulty';
    self.menuIcons.push(infoIcon);

    // Label 'Show Fractions / Auxiliar rectangles'
    game.add.text(
      x + 5 * offsetW,
      y + offsetH + 50,
      game.lang.show,
      textStyles.h4_blue
    );

    let auxText;

    if (gameName == 'squareTwo') {
      auxText = game.lang.aux_rectangle;
      game.add.text(
        x + 5 * offsetW + 10,
        y + offsetH + 80,
        auxText,
        textStyles.h4_blue
      );
    } else {
      auxText = game.lang.title;
      game.add.text(
        x + 5 * offsetW,
        y + offsetH + 80,
        auxText,
        textStyles.h2_blue
      );
    }

    return auxText;
  },

  renderCheckBox: function (x, y, offsetW, offsetH) {
    y += 40;
    const frame = fractionLabel ? 1 : 0;

    const selectionBox = game.add.sprite(
      x + 5 * offsetW,
      y + offsetH + 90,
      'select',
      frame,
      1.4
    );
    selectionBox.anchor(0.5, 0.5);
    selectionBox.iconType = 'selectionBox';
    self.menuIcons.push(selectionBox);
  },

  renderModeSection: function (x, y, offsetW, offsetH, curGame) {
    x = gameFrame().x + offsetW;
    y = gameFrame().y + offsetH / 2;

    for (let i = 0; i < curGame.gameModeIconName.length; i++, y += offsetH) {
      const icon = game.add.sprite(x, y, curGame.gameModeIconName[i], 0, 1, 1);
      icon.anchor(0.5, 0.5);

      icon.gameMode = curGame.gameMode[i];
      icon.iconType = 'gameMode';
      if (i == 0) {
        gameMode = icon.gameMode;
        icon.curFrame = 1;
      }

      self.menuIcons.push(icon);
    }
  },

  renderOperationSection: function (x, y, offsetW, offsetH, curGame) {
    x += 3 * offsetW;
    y = gameFrame().y + offsetH / 2;

    offsetH = game.math.getOffset(
      gameFrame().height,
      curGame.gameOperation.length - 1
    );

    let icon;

    // Placing math operation icons
    for (let i = 0; i < curGame.gameOperation.length; i++, y += offsetH) {
      icon = game.add.sprite(x, y, curGame.gameOperationIconName[i], 0, 1, 1);
      icon.anchor(0.5, 0.5);

      icon.gameOperation = curGame.gameOperation[i];
      icon.iconType = 'gameOperation';

      if (i == 0) {
        gameOperation = icon.gameOperation;
        icon.curFrame = 1;
      }

      self.menuIcons.push(icon);
    }
  },

  renderDifficultySection: function (x, y, offsetW, offsetH, curGame) {
    x = gameFrame().x - 50 + 5 * offsetW;

    offsetH = game.math.getOffset(gameFrame().height, curGame.gameMode.length);

    y = gameFrame().y + offsetH / 3;

    if (gameName != 'squareOne') x -= 40;

    for (let i = 0; i < curGame.gameDifficulty; i++) {
      // Parameters
      const curX = x + (50 + 10) * i;

      // Difficulty menuIcons
      // const icon = game.add.geom.rect(
      //   curX,
      //   y - 5,
      //   50,
      //   50,
      //   undefined,
      //   0,
      //   colors.gray,
      //   1
      // );
      const icon = game.add.sprite(curX, y - 5, 'btn_square', 1, 0.8);
      icon.anchor(0.5, 0.5);
      icon.difficulty = i + 1;
      icon.iconType = 'difficulty';

      if (i == 0) {
        gameDifficulty = icon.difficulty;
        icon.curFrame = 0;
      }
      self.menuIcons.push(icon);

      // Difficulty numbers
      game.add.text(curX, y + 7, i + 1, textStyles.h4_white);
    }
  },

  renderEnterSection: function (x, y) {
    // FOR MOODLE
    if (!moodle) {
      x = context.canvas.width - 150;
      y = context.canvas.height - 180;

      const enterIcon = game.add.image(x, y, 'bush', 1.7);
      enterIcon.anchor(0.5, 0.5);
      enterIcon.iconType = 'enter';

      self.menuIcons.push(enterIcon);

      self.enterText = game.add.text(
        x,
        y,
        game.lang.continue,
        textStyles.h4_white
      );
    }
  },

  renderInfoBox: function (auxText) {
    // --------------------------- INFO BOX

    self.infoBox = document.querySelector('.ifr-modal');

    // When the user clicks on the 'x', close the modal
    document.querySelector('.ifr-modal__closeButton').onclick = function () {
      self.infoBox.style.display = 'none';
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == self.infoBox) {
        self.infoBox.style.display = 'none';
      }
    };

    self.infoBoxContent = {
      gameMode: {
        squareOne: {
          title: '<b>' + game.lang.game_modes + '</b>',
          body: game.lang.infoBox_mode,
          img:
            '<table> <tr> <td> <b>A)</b> ' +
            game.lang.infoBox_mode_s1_A +
            ' </td> <td> <b>B)</b> ' +
            game.lang.infoBox_mode_s1_B +
            ' </td> </tr> <tr> <td> <img width=100% src="' +
            game.image['s1-A-h'].src +
            '"> ' +
            ' </td> <td> <img width=100% src="' +
            game.image['s1-B-h'].src +
            '"> </td> </tr> <table>',
        },
        circleOne: {
          title: '<b>' + game.lang.game_modes + '</b>',
          body: game.lang.infoBox_mode,
          img:
            '<table> <tr style="border-bottom: 5px solid white"> <td width=70%> <img width=100% src="' +
            game.image['c1-A-h'].src +
            '">' +
            ' </td> <td> &nbsp; <b>A)</b> ' +
            game.lang.infoBox_mode_c1_A +
            ' </td> </tr> </tr> <td> <img width=100% src="' +
            game.image['c1-B-h'].src +
            '"> ' +
            ' </td> <td> &nbsp; <b>B)</b> ' +
            game.lang.infoBox_mode_c1_B +
            '</td> </tr> <table>',
        },
        squareTwo: {
          title: '<b>' + game.lang.game_modes + '</b>',
          body: game.lang.infoBox_mode,
          img:
            '<table> <tr> <td> <b>A)</b> ' +
            game.lang.infoBox_mode_s2_A +
            ' </td> <td> <b>B)</b> ' +
            game.lang.infoBox_mode_s2_B +
            ' </td> </tr> <tr> <td> <img width=98% src="' +
            game.image['s2-A-h'].src +
            '"> ' +
            ' </td> <td> <img width=98% src="' +
            game.image['s2-B-h'].src +
            '"> </td> </tr> <table>',
        },
      },

      gameOperation: {
        title: '<b>' + game.lang.operation_math + '</b>',
        body: game.lang.infoBox_oper,
        img:
          '<table class="table">' +
          '<tr>' +
          '<td> <img width=50 src="' +
          game.image['operation_plus'].src +
          '"> </td>' +
          '<td> <img width=50 src="' +
          game.image['operation_mixed'].src +
          '"> </td>' +
          '<td> <img width=50 src="' +
          game.image['operation_minus'].src +
          '"> </td>' +
          '<td> <img width=50 src="' +
          game.image['operation_equals'].src +
          '"> </td>' +
          '</tr> <tr>' +
          '<td class="text-center">' +
          game.lang.plus +
          '</td>' +
          '<td class="text-center">' +
          game.lang.mixed +
          '</td>' +
          '<td class="text-center">' +
          game.lang.minus +
          '</td>' +
          '<td class="text-center">' +
          game.lang.equals +
          '</td>' +
          '</tr>' +
          '</table>',
      },

      gameDifficulty: {
        squareOne: {
          title: '<b>' + game.lang.difficulties + '</b>',
          body: game.lang.infoBox_diff + ' ' + game.lang.infoBox_diff_obs,
          img:
            '<table> <tr> <td> <b>' +
            game.lang.difficulty +
            ':</b> 1' +
            ' </td> <td> <b>' +
            game.lang.difficulty +
            ':</b> 3' +
            ' </td> </tr> <tr> <td> <img width=100% src="' +
            game.image['s1-diff-1'].src +
            '"> ' +
            ' </td> <td style="border-left: 4px solid white"> <img width=100% src="' +
            game.image['s1-diff-3'].src +
            '"> </td> </tr> </table> <br>' +
            game.lang.infoBox_diff_aux +
            '<center> <img width=50% src="' +
            game.image['map-s1'].src +
            '"> </center>',
        },
        circleOne: {
          title: '<b>' + game.lang.difficulties + '</b>',
          body: game.lang.infoBox_diff + ' ' + game.lang.infoBox_diff_obs,
          img:
            '<table> <tr> <td style="border-right: 4px solid white"> <b>' +
            game.lang.difficulty +
            ':</b> 1' +
            ' </td> <td> <b>' +
            game.lang.difficulty +
            ':</b> 5' +
            ' </td> </tr> <tr> <td> <img width=100% src="' +
            game.image['c1-diff-1'].src +
            '"> ' +
            ' </td> <td style="border-left: 4px solid white"> <img width=100% src="' +
            game.image['c1-diff-5'].src +
            '"> </td> </tr> </table> <center> <br>' +
            game.lang.infoBox_diff_aux +
            '<center> <img width=50% src="' +
            game.image['map-c1s2'].src +
            '"> </center>',
        },
        squareTwo: {
          title: '<b>' + game.lang.difficulties + '</b>',
          body: game.lang.infoBox_diff,
          img:
            '<table> <tr> <td> <b>' +
            game.lang.difficulty +
            ':</b> 1' +
            ' </td> <td> <b>' +
            game.lang.difficulty +
            ':</b> 5' +
            ' </td> </tr> <tr> <td> <img width=100% src="' +
            game.image['s2-diff-1'].src +
            '"> ' +
            ' </td> <td style="border-left: 4px solid white"> <img width=100% src="' +
            game.image['s2-diff-5'].src +
            '"> </td> </tr> </table> <br>' +
            game.lang.infoBox_diff_aux +
            '<center> <img width=50% src="' +
            game.image['map-c1s2'].src +
            '"> </center>',
        },
      },

      gameMisc: {
        squareOne: {
          title: '<b>' + game.lang.show + ' ' + auxText + '</b>',
          body: game.lang.infoBox_misc_label,
          img:
            '<img class="mx-auto" width=80% src="' +
            game.image['s1-label'].src +
            '">',
        },
        circleOne: {
          title: '<b>' + game.lang.show + ' ' + auxText + '</b>',
          body: game.lang.infoBox_misc_label,
          img:
            '<img class="mx-auto" width=60% src="' +
            game.image['c1-label'].src +
            '">',
        },
        squareTwo: {
          title: '<b>' + game.lang.show + ' ' + auxText + '</b>',
          body: game.lang.infoBox_misc_rect,
          img:
            '<img class="mx-auto" width=100% src="' +
            game.image['s2-label'].src +
            '">',
        },
      },
    };
  },

  /**
   * Displays game menu information boxes.
   */
  showInfoBox: function (icon) {
    self.infoBox.style.display = 'block';

    const element =
      icon.id == 'gameOperation'
        ? self.infoBoxContent[icon.id]
        : self.infoBoxContent[icon.id][gameName];

    let msg =
      '<h3>' +
      element.title +
      '</h3>' +
      '<p align=justify>' +
      element.body +
      '</p>' +
      element.img;

    document.querySelector('.ifr-modal__infobox').innerHTML = msg;
  },
};
