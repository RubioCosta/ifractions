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

    // Background color
    game.add.geom.rect(
      0,
      0,
      context.canvas.width,
      context.canvas.height,
      undefined,
      0,
      colors.blueBg,
      1
    );

    renderBackground();

    // Progress bar
    game.add.geom.rect(
      660,
      10,
      4 * 37.5,
      35,
      undefined,
      0,
      colors.greenNeon,
      0.5
    ); // Progress
    game.add.geom.rect(661, 11, 149, 34, colors.blue, 3, undefined, 1); // Box
    game.add.text(820, 38, '100%', textStyles.h2_blueDark).align = 'left';
    game.add.text(
      650,
      38,
      game.lang.difficulty + ' ' + gameDifficulty,
      textStyles.h2_blueDark
    ).align = 'right';

    game.add.image(360, 545, 'tree4', 0.7).anchor(0, 1);

    // Level character
    switch (gameName) {
      case 'circleOne':
        this.preAnimate = true;
        this.animate = false;

        // School
        game.add.image(600, 222, 'school', 0.7);

        // Kid
        this.character = game.add.sprite(0, -152, 'kid_run', 0, 0.7);
        this.character.anchor(0.5, 0.5);
        this.character.animation = [
          'move',
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          3,
        ];

        // Balloon
        this.balloon = game.add.image(0, -260, 'balloon');
        this.balloon.anchor(0.5, 0.5);

        this.basket = game.add.image(0, -150, 'balloon_basket');
        this.basket.anchor(0.5, 0.5);

        break;

      case 'squareTwo':
        // School
        game.add.image(600, 222, 'school', 0.7);

        // Kid
        this.character = game.add.sprite(0, 460, 'kid_run', 6, 0.7);
        this.character.anchor(0.5, 0.5);
        this.character.animation = [
          'move',
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          3,
        ];

        break;

      case 'squareOne':
        // Farm
        game.add.image(650, 260, 'farm', 1.1);

        // Tractor
        this.character = game.add.sprite(0, 490, 'tractor', 0, 0.7);
        this.character.anchor(0.5, 0.5);
        if (gameOperation == 'Plus') {
          this.character.animation = ['move', [0, 1, 2, 3, 4], 4];
        } else {
          this.character.curFrame = 10;
          this.character.animation = ['move', [10, 11, 12, 13, 14], 4];
        }

        break;
    }

    if (this.animate) game.animation.play(this.character.animation[0]);

    game.add.image(30, 585, 'tree4', 0.85).anchor(0, 1);
  },

  /**
   * Game loop
   */
  update: function () {
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
    }

    game.render.all();
  },
};
