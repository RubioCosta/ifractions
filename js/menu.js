/**
 * MAIN MENU STATE: main menu - player can select the game he wants to play 
 * 
 * @namespace
 */
const menuState = {

  /**
   * Preloads media for current state
   */
  preload: function () {

    // LOADING MEDIA
    game.load.image(url.menu.image);
    game.load.sprite(url.menu.sprite);

  },

  /**
   * Main code
   */
  create: function () {

    // Background color
    game.add.graphic.rect(0, 0, 900, 600, undefined, 0, colors.blueBckg, 1);
    // Floor
    for (let i = 0; i < defaultWidth / 100; i++) { game.add.image(i * 100, 501, 'floor'); }

    // Overtitle: Welcome, <player name>!
    game.add.text(defaultWidth / 2, 40, game.lang.welcome + ', ' + playerName + '!', textStyles.h4_brown);
    // Title : Select a game
    game.add.text(defaultWidth / 2, 80, game.lang.menu_title, textStyles.h1_green);
    // Subtitle : <game mode> 
    this.lbl_game = game.add.text(defaultWidth / 2, 110, '', textStyles.h2_blue_2);

    // Loads navigation icons
    navigationIcons.func_addIcons(
      false, false, false,
      true, true,
      false, false);

    // --------------------------- GAME ICONS 

    this.menuIcons = [];

    const offset = defaultWidth / (info.gameType.length + 1);

    for (let i = 0, x = offset; i < info.gameType.length; i++, x += offset) {

      const icon = game.add.image(x, defaultHeight / 2 - 70, info.gameTypeUrl[i], 1);
      icon.anchor(0.5, 0.5);

      icon.gameShape = info.gameShape[i];
      icon.gameType = info.gameType[i];

      this.menuIcons.push(icon);

    }

    // ------------- EVENTS

    game.event.add('click', this.func_onInputDown);
    game.event.add('mousemove', this.func_onInputOver);

  },



  /* EVENTS */

  /**
   * Called by mouse click event
   * 
   * @param {object} mouseEvent contains the mouse click coordinates
   */
  func_onInputDown: function (mouseEvent) {
    const x = mouseEvent.offsetX, y = mouseEvent.offsetY;

    // Check menu icons
    for (let i in self.menuIcons) {
      // If mouse is within the bounds of an icon
      if (game.math.isOverIcon(x, y, self.menuIcons[i])) {
        // Click first valid icon
        self.func_load(self.menuIcons[i]);
        break;
      }
    }

    // Check navigation icons
    navigationIcons.func_onInputDown(x, y);
  },

  /**
   * Called by mouse move event
   * 
   * @param {object} mouseEvent contains the mouse move coordinates
   */
  func_onInputOver: function (mouseEvent) {
    const x = mouseEvent.offsetX, y = mouseEvent.offsetY;
    let flag = false;

    // Check menu icons
    self.menuIcons.forEach(cur => {
      if (game.math.isOverIcon(x, y, cur)) {
        cur.scale = 1.08;
        self.func_showTitle(cur);
        flag = true;
      } else {
        cur.scale = 1;
      }
    });

    if (flag) {
      document.body.style.cursor = 'pointer';
    } else {
      self.func_clearTitle();
      document.body.style.cursor = 'auto';
    }

    // Check navigation icons
    navigationIcons.func_onInputOver(x, y);

    game.render.all();
  },



  /* GAME FUNCTIONS */

  /**
   * Saves info from selected game and goes to next state
   * 
   * @param {object} icon clicked icon
   */
  func_load: function (icon) {

    if (audioStatus) game.audio.beepSound.play();

    gameShape = icon.gameShape;
    gameTypeString = icon.gameType;
    switch (gameTypeString) {
      case 'squareOne': gameType = squareOne; break;
      case 'squareTwo': gameType = squareTwo; break;
      case 'circleOne': gameType = circleOne; break;
      default: console.error('Game error: the name of the game is not valid');
    }

    self.menuIcons = self.lbl_game.name;

    game.state.start('customMenu');

  },

  /**
   * Display the name of the game on screen
   * 
   * @param {object} icon icon for the game
   */
  func_showTitle: function (icon) {

    let title;

    switch (icon.gameShape) {
      case 'circle': title = game.lang.circle; break;
      case 'square': title = game.lang.square; break;
    }

    const type = icon.gameType.substring(icon.gameType.length - 3);

    switch (type) {
      case 'One': title += ' I'; break;
      case 'Two': title += ' II'; break;
    }

    self.lbl_game.name = title;

  },

  /**
   * Remove the name of the game from screen
   */
  func_clearTitle: function () {
    self.lbl_game.name = '';
  },

};

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
    let offsetH;

    // Label 'Game Mode'
    game.add.text(x + offsetW - 12, y, game.lang.game_mode, textStyles.h2_blue_2);
    // Label 'Operation'
    game.add.text(x + 3 * offsetW, y, game.lang.operation, textStyles.h2_blue_2);
    // Label 'Difficulty'
    game.add.text(x + 5 * offsetW, y, game.lang.difficulty, textStyles.h2_blue_2);
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
      
      if (gameTypeString == 'squareTwo') {
        game.add.text(x + 5 * offsetW + 10, y + 102 + 24,  game.lang.aux_rectangle, textStyles.h4_blue_2);
      } else {
        game.add.text(x + 5 * offsetW, y + 102 + 24, game.lang.title, textStyles.h2_blue_2);
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

    x = defaultWidth - 100;
    y = defaultHeight - 110;

    const enterIcon = game.add.image(x, y, 'bush');
    enterIcon.anchor(0.5, 0.5);
    enterIcon.iconType = 'enter';

    this.menuIcons.push(enterIcon);

    this.enterText = game.add.text(x, y, game.lang.continue, textStyles.h4_white);

    // ------------- EVENTS

    game.event.add('click', this.func_onInputDown);
    game.event.add('mousemove', this.func_onInputOver);

  },

  /* GAME FUNCTIONS */

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

  /* EVENTS */

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