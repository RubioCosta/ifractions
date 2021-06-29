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

    // INFO ICONS

    this.menuIcons = [];
    this.activeIcons = this.menuIcons;
    let infoIcon;

    // --------------------------- GAME ICONS 

    const offset = defaultWidth / (info.gameType.length + 1);

    for (let i = 0, x = offset; i < info.gameType.length; i++, x += offset) {

      const icon = game.add.image(x, defaultHeight / 2 - 70, info.gameTypeUrl[i], 1);
      icon.anchor(0.5, 0.5);

      icon.gameShape = info.gameShape[i];
      icon.gameType = info.gameType[i];
      icon.iconType = 'game';

      this.menuIcons.push(icon);

      infoIcon = game.add.image(x + 70, defaultHeight / 2 - 70 - 80, 'info', 0.6, 0.6);
      infoIcon.anchor(0.5, 0.5);
      infoIcon.iconType = 'infoIcon';
      this.menuIcons.push(infoIcon);

    }

    // --------------------------- INFORMATION BOX

    let cur;
    this.infoBoxElements = []; // grouped to be displayed/hidden when info box is oppened/closed

    cur = game.add.graphic.rect(0, 0, defaultWidth, defaultHeight, undefined, 0, colors.black, 0.6);
    cur.alpha = 0;
    cur.originalAlpha = 0.6;
    this.infoBoxElements.push(cur);

    cur = game.add.graphic.rect(100, 100, defaultWidth - 200, defaultHeight - 200, colors.blue, 2, colors.blueBckg, 1);
    cur.alpha = 0;
    //cur.shadow = true;
    //cur.shadowColor = colors.black;
    //cur.shadowBlur = 10;
    this.infoBoxElements.push(cur);

    this.closeIcon = game.add.image(defaultWidth - 128, 125, 'close', 0.12);
    this.closeIcon.anchor(0.5, 0.5);
    this.closeIcon.alpha = 0;
    this.closeIcon.iconType = 'infoBox';
    this.infoBoxElements.push(this.closeIcon);

    // ------------- EVENTS

    game.event.add('click', this.func_onInputDown);
    game.event.add('mousemove', this.func_onInputOver);

  },

  /**
   * Saves info from selected game and goes to next state
   * 
   * @param {object} icon clicked icon
   */
  func_load: function (icon) {

    if (audioStatus) game.audio.beepSound.play();

    switch (icon.iconType) {
      case 'infoIcon': self.func_showInfoBox(); break;
      case 'infoBox': self.func_closeInfoBox(); break;
      case 'game':
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
        break;
      default: console.error("Game error: Problem with selected icon.");
    }

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

  /**
   * Displays game menu information boxes.
   */
  func_showInfoBox: function () {
    navigationIcons.func_addIcons( // Turn off navigation icons
      false, false, false,
      false, false,
      false, false);
    self.infoBoxElements.forEach(cur => { cur.alpha = (cur.originalAlpha) ? cur.originalAlpha : 1; }); // Make info box visible
    self.activeIcons = [self.closeIcon]; // Update activeIcons to info box icons
  },

  /**
   * Closes game menu information boxes.
   */
  func_closeInfoBox: function () {
    navigationIcons.func_addIcons( // Turn on navigation icons
      false, false, false,
      true, true,
      false, false);
    self.infoBoxElements.forEach(cur => { cur.alpha = 0; }); // Make info box invisible
    self.activeIcons = self.menuIcons; // Update activeIcons to custom menu icons
  },

  /**
   * Called by mouse click event
   * 
   * @param {object} mouseEvent contains the mouse click coordinates
   */
  func_onInputDown: function (mouseEvent) {
    const x = mouseEvent.offsetX, y = mouseEvent.offsetY;

    // Check menu icons
    for (let i in self.activeIcons) {
      // If mouse is within the bounds of an icon
      if (game.math.isOverIcon(x, y, self.activeIcons[i])) {
        // Click first valid icon
        self.func_load(self.activeIcons[i]);
        break;
      }
    }

    // Check navigation icons
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

    // Check menu icons
    for (let i in self.activeIcons) {
      if (game.math.isOverIcon(x, y, self.activeIcons[i])) {
        overIcon = i;
        break;
      }
    }

    // Update gui
    if (overIcon) { // if pointer is over icon
      document.body.style.cursor = 'pointer';
      self.activeIcons.forEach(cur => {
        if (cur.iconType == self.activeIcons[overIcon].iconType) { // if its in the same icon category
          if (cur == self.activeIcons[overIcon]) { // if its the icon the pointer is over 
            if (cur.iconType == 'game') self.func_showTitle(cur);
            cur.scale = cur.originalScale * 1.1;
          } else {
            if (cur.iconType == 'game') self.func_clearTitle(cur);
            cur.scale = cur.originalScale;
          }
        }
      });
    } else { // if pointer is not over icon
      self.activeIcons.forEach(cur => { cur.scale = cur.originalScale; });
      document.body.style.cursor = 'auto';
    }

    // Check navigation icons
    navigationIcons.func_onInputOver(x, y);

    game.render.all();
  }

};