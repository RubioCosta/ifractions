/******************************
 * This file holds game states.
 ******************************/

/** [ENDING STATE] Ending screen shown when the player has completed all 4 levels and therefore completed the game.
 *
 * @namespace
 */
const endState = {
  /**
   * Main code
   */
  create: function () {
    self.preAnimate = false;
    self.animate = true;

    self.waitUserAction = false;
    self.endUpdate = false;

    renderBackground();

    // Progress bar
    const y = 20;
    game.add.geom.rect(
      context.canvas.width - 300,
      y,
      4 * 37.5,
      35,
      undefined,
      0,
      colors.greenNeon,
      0.5
    );
    game.add.geom.rect(
      context.canvas.width - 300 + 1,
      y + 1,
      149,
      34,
      colors.blue,
      3,
      undefined,
      1
    );
    game.add.text(
      context.canvas.width - 300 + 160,
      y + 33,
      '100%',
      textStyles.h2_
    ).align = 'left';
    game.add.text(
      context.canvas.width - 300 - 10,
      y + 33,
      game.lang.difficulty + ' ' + gameDifficulty,
      textStyles.h2_
    ).align = 'right';

    game.add
      .image(360 + 400, context.canvas.height - 100, 'tree_4', 1.05)
      .anchor(0, 1);

    gameList[gameId].assets.end.building();

    this.character = gameList[gameId].assets.end.character();
    this.character.animation = gameList[gameId].assets.end.characterAnimation;

    if (gameName === 'circleOne') {
      this.preAnimate = true;
      this.animate = false;

      // Balloon
      this.balloon = game.add.image(0, -260, 'balloon', 1.5);
      this.balloon.anchor(0.5, 0.5);

      this.basket = game.add.image(0, -150, 'balloon_basket', 1.5);
      this.basket.anchor(0.5, 0.5);
    }

    if (this.animate) game.animation.play(this.character.animation[0]);

    //tree
    game.add
      .image(30 + 200, context.canvas.height - 20, 'tree_4', 1.275)
      .anchor(0, 1);

    // feedback
    this.continueButton = game.add.geom.rect(
      context.canvas.width / 2,
      context.canvas.height / 2,
      500,
      100,
      undefined,
      1,
      colors.blueDark,
      0
    );
    this.continueButton.anchor(0.5, 0.5);

    game.add.text(
      context.canvas.width / 2,
      200,
      'Congratulations!',
      textStyles.h1_
    );
    this.continueText = game.add.text(
      context.canvas.width / 2,
      context.canvas.height / 2 + 16,
      'Go back to menu',
      textStyles.h1_
    );
    this.continueText.alpha = 0;

    game.event.add('click', this.onInputDown);
    game.event.add('mousemove', this.onInputOver);
  },

  /**
   * Game loop
   */
  update: function () {
    if (isDebugMode && debugState.end.status) {
      if (debugState.end.stop) {
        self.animate = false;
      }
    }

    // Balloon falling
    if (self.preAnimate) {
      if (self.character.y < 460) {
        self.balloon.y += 2;
        self.basket.y += 2;
        self.character.y += 2;

        self.balloon.x++;
        self.basket.x++;
        self.character.x++;
      } else {
        self.preAnimate = false;
        self.animate = true;
        game.animation.play(self.character.animation[0]);
      }
    }

    // Character running
    if (self.animate) {
      if (self.character.x <= 700) {
        self.character.x += 2;
      } else {
        self.waitUserAction = true;
        self.continueText.alpha = 1;
        self.continueButton.alpha = 1;
      }
    }

    if (self.endUpdate) {
      self.animate = false;
      game.animation.stop(self.character.animation[0]);

      // FOR MOODLE
      if (!moodle) {
        completedLevels = 0;
        game.state.start('menu');
      } else {
        // FOR MOODLE
        parent.location.reload(true);
      }
    }

    game.render.all();
  },

  /**
   * Called by mouse click event
   *
   * @param {object} mouseEvent contains the mouse click coordinates
   */
  onInputDown: function (mouseEvent) {
    console.log('clicked');
    const x = game.math.getMouse(mouseEvent).x;
    const y = game.math.getMouse(mouseEvent).y;

    if (game.math.isOverIcon(x, y, self.continueButton)) {
      self.endUpdate = true;
      //self.loadGame();
    }
  },

  /**
   * Called by mouse move event
   *
   * @param {object} mouseEvent contains the mouse move coordinates
   */
  onInputOver: function (mouseEvent) {
    console.log('moved');

    const x = game.math.getMouse(mouseEvent).x;
    const y = game.math.getMouse(mouseEvent).y;
    let overIcon;

    if (game.math.isOverIcon(x, y, self.continueButton)) {
      overIcon = true;
      console.log('is over icon');
    }

    // Update gui
    if (overIcon) {
      // If pointer is over icon
      document.body.style.cursor = 'pointer';
      self.continueButton.scale = self.continueButton.originalScale * 1.1;
    } else {
      // If pointer is not over icon
      self.continueButton.scale = self.continueButton.originalScale * 1;
      document.body.style.cursor = 'auto';
    }
  },
};
