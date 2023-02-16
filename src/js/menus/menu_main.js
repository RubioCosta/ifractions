/******************************
 * This file holds game states.
 ******************************/

/** [MAIN MENU STATE] Screen where the user can select a game.
 *
 * @namespace
 */
const menuState = {
  /**
   * Main code
   */
  create: function () {
    // FOR MOODLE
    if (moodle && iLMparameters.iLM_PARAM_SendAnswer == 'false') {
      // Student role

      playerName = game.lang.student; // TODO pegar o nome do aluno no bd do moodle
      getiLMContent();
    } else {
      // FOR MOODLE
      if (moodle && iLMparameters.iLM_PARAM_SendAnswer == 'true')
        playerName = game.lang.professor;

      renderBackground();

      // Overtitle: Welcome, <player name>!
      game.add.text(
        context.canvas.width / 2,
        60,
        game.lang.welcome + ', ' + playerName + '!',
        textStyles.h3_brown
      );
      // Title : Select a game
      game.add.text(
        context.canvas.width / 2,
        120,
        game.lang.menu_title,
        textStyles.h1_green
      );
      // Subtitle : <game mode>
      this.lbl_game = game.add.text(
        context.canvas.width / 2,
        160,
        '',
        textStyles.h2_blue
      );

      // Loads navigation icons
      navigationIcons.add(false, false, false, true, true, false, false);

      // INFO ICONS

      this.menuIcons = [];
      let infoIcon;

      // --------------------------- GAME ICONS

      const offset = game.math.getOffset(
        context.canvas.width,
        info.gameType.length
      );

      for (let i = 0, x = offset; i < info.gameType.length; i++, x += offset) {
        const icon = game.add.image(
          x,
          context.canvas.height / 2 - 70,
          info.gameTypeUrl[i],
          1.5
        );
        icon.anchor(0.5, 0.5);

        icon.gameShape = info.gameShape[i];
        icon.gameType = info.gameType[i];
        icon.iconType = 'game';

        this.menuIcons.push(icon);

        // "more information" button
        infoIcon = game.add.image(
          x + 110,
          context.canvas.height / 2 - 100 - 80 - 10,
          'info',
          1,
          1
        );
        infoIcon.anchor(0.5, 0.5);
        infoIcon.iconType = 'infoIcon';
        infoIcon.id = icon.gameType;
        this.menuIcons.push(infoIcon);
      }

      // --------------------------- INFO BOX

      this.infoBox = document.querySelector('.ifr-modal');

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

      this.infoBoxContent = {
        squareOne: {
          title:
            '<strong>' +
            game.lang.game +
            ':</strong> ' +
            game.lang.square +
            ' I',
          body: '<ul>' + game.lang.infoBox_squareOne + '</ul>',
          img:
            '<img class="mx-auto" width=60% src="' +
            game.image['s1-A'].src +
            '">',
        },
        circleOne: {
          title:
            '<strong>' +
            game.lang.game +
            ':</strong> ' +
            game.lang.circle +
            ' I',
          body: '<ul>' + game.lang.infoBox_circleOne + '</ul>',
          img:
            '<img class="mx-auto" width=80% src="' +
            game.image['c1-A'].src +
            '">',
        },
        squareTwo: {
          title:
            '<strong>' +
            game.lang.game +
            ':</strong> ' +
            game.lang.square +
            ' II',
          body: '<ul>' + game.lang.infoBox_squareTwo + '</ul>',
          img:
            '<img class="mx-auto" width=80% src="' +
            game.image['s2'].src +
            '">',
        },
      };

      // ------------- EVENTS

      game.event.add('click', this.onInputDown);
      game.event.add('mousemove', this.onInputOver);

      console.log('DEBUG');
      const s1 = 0;
      const c1 = 2;
      const s2 = 4;
      this.load(self.menuIcons[s1]);
    }
  },

  /**
   * Displays game menu information boxes.
   */
  showInfoBox: function (icon) {
    self.infoBox.style.display = 'block';

    let msg =
      '<h3>' +
      self.infoBoxContent[icon.id].title +
      '</h3>' +
      '<p>' +
      self.infoBoxContent[icon.id].body +
      '</p>' +
      self.infoBoxContent[icon.id].img;

    document.querySelector('.ifr-modal__infobox').innerHTML = msg;
  },

  /**
   * Saves info from selected game and goes to next state
   *
   * @param {object} icon clicked icon
   */
  load: function (icon) {
    if (audioStatus) game.audio.popSound.play();

    switch (icon.iconType) {
      case 'infoIcon':
        self.showInfoBox(icon);
        break;
      case 'game':
        gameShape = icon.gameShape;
        gameType = icon.gameType;
        if (!info.gameType.includes(gameType))
          console.error('Game error: the name of the game is not valid.');
        self.menuIcons = self.lbl_game.name;
        game.state.start('customMenu');
        break;
    }
  },

  /**
   * Display the name of the game on screen
   *
   * @param {object} icon icon for the game
   */
  showTitle: function (icon) {
    const number = icon.gameType.slice(-3) == 'One' ? 'I' : 'II';

    self.lbl_game.name = game.lang[icon.gameShape] + ' ' + number;
  },

  /**
   * Remove the name of the game from screen
   */
  clearTitle: function () {
    self.lbl_game.name = '';
  },

  /**
   * Called by mouse click event
   *
   * @param {object} mouseEvent contains the mouse click coordinates
   */
  onInputDown: function (mouseEvent) {
    const x = game.math.getMouse(mouseEvent).x;
    const y = game.math.getMouse(mouseEvent).y;

    // Check menu icons
    for (let i in self.menuIcons) {
      // If mouse is within the bounds of an icon
      if (game.math.isOverIcon(x, y, self.menuIcons[i])) {
        // Click first valid icon
        self.load(self.menuIcons[i]);
        break;
      }
    }

    // Check navigation icons
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

    // Check menu icons
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
      if (self.menuIcons[overIcon].iconType == 'game')
        self.showTitle(self.menuIcons[overIcon]);
      self.menuIcons.forEach((cur) => {
        if (cur.iconType == self.menuIcons[overIcon].iconType) {
          // If its in the same icon category
          if (cur == self.menuIcons[overIcon]) {
            // If its the icon the pointer is over
            cur.scale = cur.originalScale * 1.1;
          } else {
            cur.scale = cur.originalScale;
          }
        }
      });
    } else {
      // If pointer is not over icon
      self.clearTitle();
      self.menuIcons.forEach((cur) => {
        cur.scale = cur.originalScale;
      });
      document.body.style.cursor = 'auto';
    }

    // Check navigation icons
    navigationIcons.onInputOver(x, y);

    game.render.all();
  },
};
