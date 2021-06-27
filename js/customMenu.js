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
      this.activeIcons = this.menuIcons;
  
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
  
      // Label 'Game Mode'
      game.add.text(x + offsetW - 12, y, game.lang.game_mode, textStyles.h2_blue_2);
      
      infoIcon = game.add.image(x + 2 * offsetW - 30, y - 40, 'info', 0.5);
      infoIcon.anchor(0.5,0.5);
      infoIcon.iconType = 'infoIcon';
      this.menuIcons.push(infoIcon);
  
      // Label 'Operation'
      game.add.text(x + 3 * offsetW, y, game.lang.operation, textStyles.h2_blue_2);
      
      infoIcon = game.add.image(x + 4 * offsetW - 30, y - 40, 'info', 0.5);
      infoIcon.anchor(0.5,0.5);
      infoIcon.iconType = 'infoIcon';
      this.menuIcons.push(infoIcon);
  
      // Label 'Difficulty'
      game.add.text(x + 5 * offsetW, y, game.lang.difficulty, textStyles.h2_blue_2);
      
      infoIcon = game.add.image(x + 6 * offsetW - 30, y - 40, 'info', 0.5);
      infoIcon.anchor(0.5,0.5);
      infoIcon.iconType = 'infoIcon';
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
        
        infoIcon = game.add.image(x + 6 * offsetW + 20, y + 102, 'info', 0.5);
        infoIcon.anchor(0.5,0.5);
        infoIcon.iconType = 'infoIcon';
        this.menuIcons.push(infoIcon);
        
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
  
      // --------------------------- INFORMATION BOX
      
      let cur;
      this.infoBoxElements = []; // grouped to be displayed/hidden when info box is oppened/closed
      
      cur = game.add.graphic.rect(0, 0, defaultWidth, defaultHeight, undefined, 0, colors.black, 0.6);
      cur.alpha = 0;
      cur.originalAlpha = 0.6;
      this.infoBoxElements.push(cur);
      
      cur = game.add.graphic.rect(100,  100, defaultWidth - 200, defaultHeight - 200, colors.blue, 2, colors.blueBckg, 1);
      cur.alpha = 0;
      this.infoBoxElements.push(cur);
      
      this.closeIcon = game.add.image(defaultWidth - 128, 125, 'close', 0.12);
      this.closeIcon.anchor(0.5,0.5);
      this.closeIcon.alpha = 0;
      this.closeIcon.iconType = 'infoBox';
      this.infoBoxElements.push(this.closeIcon);
  
      // ------------- EVENTS
  
      game.event.add('click', this.func_onInputDown);
      game.event.add('mousemove', this.func_onInputOver);
  
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
        case 'infoIcon': self.func_showInfoBox(); break;
        case 'infoBox' : self.func_closeInfoBox(); break;
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
     * Displays game menu information boxes.
     */
    func_showInfoBox: function () {
      navigationIcons.func_addIcons( // Turn off navigation icons
        false, false, false, 
        false, false, 
        false, false);
      self.infoBoxElements.forEach( cur => { cur.alpha = (cur.originalAlpha) ? cur.originalAlpha : 1; }); // Make info box visible
      self.activeIcons = [self.closeIcon]; // Update activeIcons to info box icons
    },
  
    /**
     * Closes game menu information boxes.
     */
    func_closeInfoBox: function () {
      navigationIcons.func_addIcons( // Turn on navigation icons
        true, false, false,
        true, true,
        'menu', false);
      self.infoBoxElements.forEach( cur => { cur.alpha = 0; }); // Make info box invisible
      self.activeIcons = self.menuIcons; // Update activeIcons to custom menu icons
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
      for (let i in self.activeIcons) {
        if (game.math.isOverIcon(x, y, self.activeIcons[i])) {
          overIcon = i;
          break;
        }
      }
  
      // Update gui
      if (overIcon) { // if has clicked on an icon
        document.body.style.cursor = 'pointer';
        self.activeIcons.forEach(cur => {
          if (cur.iconType == self.activeIcons[overIcon].iconType) { // if its in the same icon category
            if (cur == self.activeIcons[overIcon]) { // if its the clicked icon
              if (cur.iconType == 'gameMode' || cur.iconType == 'gameOperation') cur.curFrame = 1;
              else if (cur.iconType == 'difficulty') cur.fillColor = colors.blue;
            } else {
              if (cur.iconType == 'gameMode' || cur.iconType == 'gameOperation') cur.curFrame = 0;
              else if (cur.iconType == 'difficulty') cur.fillColor = colors.gray;
            }
          }
        });
  
        self.func_load(self.activeIcons[overIcon]);
  
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
              if (cur.iconType == 'enter') self.enterText.style = textStyles.h3__white;
              cur.scale = cur.originalScale * 1.1;
            } else {
              cur.scale = cur.originalScale;
            }
          }
        });
      } else { // if pointer is not over icon
        self.enterText.style = textStyles.h4_white;
        self.activeIcons.forEach(cur => { cur.scale = cur.originalScale; });
        document.body.style.cursor = 'auto';
      }
  
      // Check navigation icons
      navigationIcons.func_onInputOver(x, y);
  
      game.render.all();
  
    },
  
  }