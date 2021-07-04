/**
 * SECUNDARY MENU STATE: player can select game mode, math operation and overall game difficulty
 * 
 * @namespace
 */
const customMenuState = {

  /**
   * Preloads media for current state
   */
  preload: function () {

    // LOADING MEDIA
    game.load.sprite(url[gameTypeString].sprite);
    game.load.image(url[gameTypeString].image);

  },

  /**
   * Main code
   */
  create: function () {

    // MOODLE MODIF.
    if (moodle && iLMparameters.iLM_PARAM_SendAnswer == 'false') {
      game.state.start('map');
    } else {

      const iconScale = 0.7;
      const baseY = 270 - 40;
      this.menuIcons = [];

      // Background color
      game.add.graphic.rect(0, 0, 900, 600, undefined, 0, colors.blueBckg, 1);
      // Floor
      for (let i = 0; i < defaultWidth / 100; i++) { game.add.image(i * 100, 501, 'floor'); }

      // Overtitle : Selected game
      game.add.text(defaultWidth / 2, 40, game.lang.game + ": " + menuState.menuIcons, textStyles.h4_brown);
      // Title : Customize the selected game
      game.add.text(defaultWidth / 2, 80, game.lang.custom_game, textStyles.h1_green);

      // Loads navigation icons
      navigationIcons.func_addIcons(
        true, false, false,
        true, true,
        'menu', false);

      let x = 150;
      let y = 200 - 40;
      let width = 5;
      let height = 280 + 80;
      let offsetW = 600 / 6;
      let offsetH, infoIcon;

      // Label 'Game Modes'
      game.add.text(x + offsetW - 12, y, game.lang.game_mode, textStyles.h2_blue_2);

      infoIcon = game.add.image(x + 2 * offsetW - 30, y - 40, 'info', 0.5, 0.4);
      infoIcon.anchor(0.5, 0.5);
      infoIcon.iconType = 'infoIcon';
      infoIcon.id = 'gameMode';
      this.menuIcons.push(infoIcon);

      // Label 'Operations'
      game.add.text(x + 3 * offsetW, y, game.lang.operation, textStyles.h2_blue_2);

      infoIcon = game.add.image(x + 4 * offsetW - 30, y - 40, 'info', 0.5, 0.4);
      infoIcon.anchor(0.5, 0.5);
      infoIcon.iconType = 'infoIcon';
      infoIcon.id = 'gameOperation';
      this.menuIcons.push(infoIcon);

      // Label 'Difficulties'
      game.add.text(x + 5 * offsetW, y, game.lang.difficulties, textStyles.h2_blue_2);

      infoIcon = game.add.image(x + 6 * offsetW - 30, y - 40, 'info', 0.5, 0.4);
      infoIcon.anchor(0.5, 0.5);
      infoIcon.iconType = 'infoIcon';
      infoIcon.id = 'gameDifficulty';
      this.menuIcons.push(infoIcon);

      // Horizontal line
      game.add.graphic.rect(x - 25, y + 10, 600 + 50, width, undefined, 0, colors.blueMenuLine).anchor(0, 0.5);
      // Vertical lines
      game.add.graphic.rect(x + 2 * offsetW, y - 25, width, height, undefined, 0, colors.blueMenuLine).anchor(0.5, 0);
      game.add.graphic.rect(x + 4 * offsetW, y - 25, width, height, undefined, 0, colors.blueMenuLine).anchor(0.5, 0);

      // --------------------------- TURN ON/OFF FRACTION LABELS / RECTANGLE GUIDE

      // Horizontal line
      game.add.graphic.rect(x + 4 * offsetW, y + 136, 200 + 25, width, undefined, 0, colors.blueMenuLine).anchor(0, 0.5);

      // Label 'Show Fractions / Auxiliar rectangles'
      game.add.text(x + 5 * offsetW, y + 102, game.lang.show, textStyles.h4_blue_2);

      infoIcon = game.add.image(x + 6 * offsetW + 20, y + 102, 'info', 0.5, 0.4);
      infoIcon.anchor(0.5, 0.5);
      infoIcon.iconType = 'infoIcon';
      infoIcon.id = 'gameMisc';
      this.menuIcons.push(infoIcon);

      let auxText;
      if (gameTypeString == 'squareTwo') {
        auxText = game.lang.aux_rectangle;
        game.add.text(x + 5 * offsetW + 10, y + 102 + 24, auxText, textStyles.h4_blue_2);
      } else {
        auxText = game.lang.title;
        game.add.text(x + 5 * offsetW, y + 102 + 24, auxText, textStyles.h2_blue_2);
      }

      // Selection box
      y += 40;
      const frame = (fractionLabel) ? 1 : 0;

      const selectionBox = game.add.sprite(x + 5 * offsetW, y + 102 + 24 - 2, 'select', frame, 0.11);
      selectionBox.anchor(0.5, 0.5);
      selectionBox.iconType = 'selectionBox';
      this.menuIcons.push(selectionBox);

      // --------------------------- GAME MODE ICONS

      x = 150 + offsetW;
      y = baseY;
      offsetH = this.func_getOffset(height, info[gameTypeString].gameModeType.length);

      for (let i = 0; i < info[gameTypeString].gameModeTypeUrl.length; i++, y += offsetH) {
        const icon = game.add.sprite(x, y, info[gameTypeString].gameModeTypeUrl[i], 0, iconScale, 1);
        icon.anchor(0.5, 0.5);

        icon.gameModeType = info[gameTypeString].gameModeType[i];
        icon.iconType = 'gameMode';
        if (i == 0) {
          gameModeType = icon.gameModeType;
          icon.curFrame = 1;
        }

        this.menuIcons.push(icon);
      }

      // --------------------------- GAME OPERATION ICONS

      x += 2 * offsetW;
      y = baseY;
      offsetH = this.func_getOffset(height, info[gameTypeString].gameOperationType.length);

      let icon;
      let aux = [];
      aux['squareOne'] = [
        ['operation_plus', 'Plus'],
        ['operation_minus', 'Minus']
      ];
      aux['circleOne'] = [
        ['operation_plus', 'Plus'],
        ['operation_minus', 'Minus'],
        ['operation_mixed', 'Mixed']
      ];
      aux['squareTwo'] = [
        ['operation_equals', 'Equals'],
      ];

      // Placing math operation icons
      for (let i = 0; i < aux[gameTypeString].length; i++, y += offsetH) {
        icon = game.add.sprite(x, y, aux[gameTypeString][i][0], 0, iconScale, 1);
        icon.anchor(0.5, 0.5);

        icon.gameOperationType = aux[gameTypeString][i][1];
        icon.iconType = 'gameOperation';

        if (i == 0) {
          gameOperationType = icon.gameOperationType;
          icon.curFrame = 1;
        }

        this.menuIcons.push(icon);
      }

      // --------------------------- DIFFICULTY ICONS

      x = (gameTypeString == 'squareOne') ? 625 : 585;
      y = baseY - 25;

      for (let i = 0; i < info[gameTypeString].gameDifficulty; i++) {
        // Parameters
        const curX = x + (30 + 10) * i;

        // Difficulty menuIcons
        const icon = game.add.graphic.rect(curX, y, 30, 30, undefined, 0, colors.gray, 1);
        icon.anchor(0.5, 0.5);
        icon.difficulty = i + 1;
        icon.iconType = 'difficulty';

        if (i == 0) {
          gameDifficulty = icon.difficulty;
          icon.fillColor = colors.blue;
        }
        this.menuIcons.push(icon);

        // Difficulty numbers
        game.add.text(curX, y + 7, i + 1, textStyles.h4_white);
      }

      // --------------------------- ENTER ICON

      // MOODLE MODIF.
      if (!moodle) {

        x = defaultWidth - 100;
        y = defaultHeight - 110;

        const enterIcon = game.add.image(x, y, 'bush');
        enterIcon.anchor(0.5, 0.5);
        enterIcon.iconType = 'enter';

        this.menuIcons.push(enterIcon);

        this.enterText = game.add.text(x, y, game.lang.continue, textStyles.h4_white);

      }

      // --------------------------- INFO BOX

      this.infoBox = document.getElementById('myModal');

      // When the user clicks on the 'x', close the modal
      document.getElementsByClassName('close')[0].onclick = function () {
        self.infoBox.style.display = 'none';
      }

      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function (event) {
        if (event.target == self.infoBox) {
          self.infoBox.style.display = 'none';
        }
      }

      this.infoBoxContent = {

        gameMode: {
          squareOne: {
            title: '<b>' + game.lang.game_mode + '</b>',
            body: game.lang.infoBox_mode,
            img: '<table> <tr> <td> <b>A)</b> ' + game.lang.infoBox_mode_s1_A +
              ' </td> <td> <b>B)</b> ' + game.lang.infoBox_mode_s1_B +
              ' </td> </tr> <tr> <td> <img width=100% src="'+game.image['s1-A-h'].src+'"> ' +
              ' </td> <td> <img width=100% src="'+game.image['s1-B-h'].src+'"> </td> </tr> <table>'
          },
          circleOne: {
            title: '<b>' + game.lang.game_mode + '</b>',
            body: game.lang.infoBox_mode,
            img: '<table> <tr style="border-bottom: 5px solid white"> <td width=70%> <img width=100% src="'+game.image['c1-A-h'].src+'">' +
            ' </td> <td> &nbsp; <b>A)</b> ' + game.lang.infoBox_mode_c1_A +
            ' </td> </tr> </tr> <td> <img width=100% src="'+game.image['c1-B-h'].src+'"> ' +
            ' </td> <td> &nbsp; <b>B)</b> ' + game.lang.infoBox_mode_c1_B +'</td> </tr> <table>'
          },
          squareTwo: {
            title: '<b>' + game.lang.game_mode + '</b>',
            body: game.lang.infoBox_mode,
            img: '<center> <table> <tr> <td> <b>A)</b> ' + game.lang.infoBox_mode_s2_A +
            ' </td> <td> <b>B)</b> ' + game.lang.infoBox_mode_s2_B +
            ' </td> </tr> <tr> <td> <img width=98% src="'+game.image['s2-A-h'].src+'"> ' +
            ' </td> <td> <img width=98% src="'+game.image['s2-B-h'].src+'"> </td> </tr> <table> </center>'
          }
        },

        gameOperation: {
          title: '<b>' + game.lang.operation_math + '</b>',
          body: game.lang.infoBox_oper,
          img: '<center> <table> <tr style="border-bottom: 5px solid white"> <td> <img width=50 src="'+game.image['operation_plus'].src+'"> ' + game.lang.plus +
            ' </td> <td> <img width=50 src="'+game.image['operation_mixed'].src+'"> ' + game.lang.mixed +
            ' </td> </tr> <tr> <td><img width=50 src="'+game.image['operation_minus'].src+'"> ' + game.lang.minus +
            ' &nbsp; </td> <td> <img width=50 src="'+game.image['operation_equals'].src+'"> ' + game.lang.equals + ' </td> </tr> <table> <center>',
        },

        gameDifficulty: {
          squareOne: {
            title: '<b>' + game.lang.difficulties + '</b>',
            body: game.lang.infoBox_diff + '<br>' + game.lang.infoBox_diff_obs,
            img: '<table> <tr> <td> <b>' + game.lang.difficulty + ':</b> 1' +
            ' </td> <td> <b>' + game.lang.difficulty + ':</b> 3'+
            ' </td> </tr> <tr> <td> <img width=100% src="'+game.image['s1-diff-1'].src+'"> ' +
            ' </td> <td style="border-left: 4px solid white"> <img width=100% src="'+game.image['s1-diff-3'].src+'"> </td> </tr> </table> <br>' +
            game.lang.infoBox_diff_aux + '<center> <img width=50% src="'+game.image['map-s1'].src+'"> </center>'
          },
          circleOne: {
            title: '<b>' + game.lang.difficulties + '</b>',
            body: game.lang.infoBox_diff + '<br>' + game.lang.infoBox_diff_obs,
            img: '<center> <table> <tr> <td style="border-right: 4px solid white"> <b>' + game.lang.difficulty + ':</b> 1' +
            ' </td> <td> <b>' + game.lang.difficulty + ':</b> 5'+
            ' </td> </tr> <tr> <td> <img width=100% src="'+game.image['c1-diff-1'].src+'"> ' +
            ' </td> <td style="border-left: 4px solid white"> <img width=100% src="'+game.image['c1-diff-5'].src+'"> </td> </tr> </table> <center> <br>' +
            game.lang.infoBox_diff_aux + '<center> <img width=50% src="'+game.image['map-c1s2'].src+'"> </center>'
          },
          squareTwo: {
            title: '<b>' + game.lang.difficulties + '</b>',
            body: game.lang.infoBox_diff,
            img: '<table> <tr> <td> <b>' + game.lang.difficulty + ':</b> 1' +
            ' </td> <td> <b>' + game.lang.difficulty + ':</b> 5'+
            ' </td> </tr> <tr> <td> <img width=100% src="'+game.image['s2-diff-1'].src+'"> ' +
            ' </td> <td style="border-left: 4px solid white"> <img width=100% src="'+game.image['s2-diff-5'].src+'"> </td> </tr> </table> <br>' +
            game.lang.infoBox_diff_aux + '<center> <img width=50% src="'+game.image['map-c1s2'].src+'"> </center>'
          },
        },

        gameMisc: {
          squareOne: {
            title: '<b>' + game.lang.show + ' ' + auxText + '</b>',
            body: game.lang.infoBox_misc_label,
            img: '<center> <img width=80% src="'+game.image['s1-label'].src+'"> </center>',
          },
          circleOne: {
            title: '<b>' + game.lang.show + ' ' + auxText + '</b>',
            body: game.lang.infoBox_misc_label,
            img: '<center> <img width=60% src="'+game.image['c1-label'].src+'"> </center>',
          },
          squareTwo: {
            title: '<b>' + game.lang.show + ' ' + auxText + '</b>',
            body: game.lang.infoBox_misc_rect,
            img: '<center> <img width=100% src="'+game.image['s2-label'].src+'"> </center>',
          }
        }

      };

      // ------------- EVENTS

      game.event.add('click', this.func_onInputDown);
      game.event.add('mousemove', this.func_onInputOver);

    }

  },

  /**
   * Displays game menu information boxes.
   */
  func_showInfoBox: function (icon) {
    self.infoBox.style.display = 'block';

    const element = (icon.id == 'gameOperation') ? self.infoBoxContent[icon.id] : self.infoBoxContent[icon.id][gameTypeString];

    let msg = '<h3>' + element.title + '</h3>'
      + '<p>' + element.body + '</p>'
      + element.img;

    document.getElementById('infobox-content').innerHTML = msg;
  },


  /**
   * Saves information selected by the player 
   * 
   * @param {object} icon selected icon
   */
  func_load: function (icon) {

    if (audioStatus) game.audio.beepSound.play();

    const type = icon.iconType;
    switch (type) {
      case 'gameMode': gameModeType = icon.gameModeType; break;
      case 'gameOperation': gameOperationType = icon.gameOperationType; break;
      case 'difficulty': gameDifficulty = icon.difficulty; break;
      case 'infoIcon': self.func_showInfoBox(icon); break;
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
        if (debugMode) console.log('Game State: ' + gameTypeString + ', ' + gameModeType);
        mapPosition = 0;      // Map position
        mapMove = true;       // Move no next point
        completedLevels = 0;  // Reset the game progress when entering a new level
        game.state.start('map');
        break;
    }

  },

  /**
   * Calculate spacing for icons on the menu screen
   * 
   * @param {number} width width of the available part of the screen
   * @param {number} numberOfIcons number or icons to be put on the screen
   * @returns {number}
   */
  func_getOffset: function (width, numberOfIcons) {
    return width / (numberOfIcons + 1);
  },

  /**
   * Called by mouse click event
   * 
   * @param {object} mouseEvent contains the mouse click coordinates
   */
  func_onInputDown: function (mouseEvent) {
    const x = mouseEvent.offsetX, y = mouseEvent.offsetY;
    let overIcon;

    // Check if clicked on an icon
    for (let i in self.menuIcons) {
      if (game.math.isOverIcon(x, y, self.menuIcons[i])) {
        overIcon = i;
        break;
      }
    }

    // Update gui
    if (overIcon) { // if has clicked on an icon
      document.body.style.cursor = 'pointer';
      self.menuIcons.forEach(cur => {
        if (cur.iconType == self.menuIcons[overIcon].iconType) { // if its in the same icon category
          if (cur == self.menuIcons[overIcon]) { // if its the clicked icon
            if (cur.iconType == 'gameMode' || cur.iconType == 'gameOperation') cur.curFrame = 1;
            else if (cur.iconType == 'difficulty') cur.fillColor = colors.blue;
          } else {
            if (cur.iconType == 'gameMode' || cur.iconType == 'gameOperation') cur.curFrame = 0;
            else if (cur.iconType == 'difficulty') cur.fillColor = colors.gray;
          }
        }
      });

      self.func_load(self.menuIcons[overIcon]);

    } else document.body.style.cursor = 'auto';

    navigationIcons.func_onInputDown(x, y);

    game.render.all();

  },

  /**
   * Called by mouse move event
   * 
   * @param {object} mouseEvent contains the mouse move coordinates
   */
  func_onInputOver: function (mouseEvent) {
    const x = mouseEvent.offsetX, y = mouseEvent.offsetY;
    let overIcon;

    // Check if pointer is over an icon
    for (let i in self.menuIcons) {
      if (game.math.isOverIcon(x, y, self.menuIcons[i])) {
        overIcon = i;
        break;
      }
    }

    // Update gui
    if (overIcon) { // if pointer is over icon
      document.body.style.cursor = 'pointer';
      self.menuIcons.forEach(cur => {
        if (cur.iconType == self.menuIcons[overIcon].iconType) { // if its in the same icon category
          if (cur == self.menuIcons[overIcon]) { // if its the icon the pointer is over 
            if (cur.iconType == 'enter') self.enterText.style = textStyles.h3__white;
            cur.scale = cur.originalScale * 1.1;
          } else {
            cur.scale = cur.originalScale;
          }
        }
      });
    } else { // if pointer is not over icon
      self.enterText.style = textStyles.h4_white;
      self.menuIcons.forEach(cur => { cur.scale = cur.originalScale; });
      document.body.style.cursor = 'auto';
    }

    // Check navigation icons
    navigationIcons.func_onInputOver(x, y);

    game.render.all();

  },

}