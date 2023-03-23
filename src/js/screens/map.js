/******************************
 * This file holds game states.
 ******************************/

/** [MAP STATE] Screen that shows the 4 generated levels in a map (and the level where the player is currently in).
 *
 * @namespace
 */
const mapState = {
  /**
   * Main code
   */
  create: function () {
    renderBackground('plain');

    // Calls function that loads navigation icons

    // FOR MOODLE
    if (moodle) {
      navigationIcons.add(
        false,
        false,
        false, // Left icons
        false,
        false, // Right icons
        false,
        false
      );
    } else {
      navigationIcons.add(
        true,
        true,
        false, // Left icons
        false,
        false, // Right icons
        'customMenu',
        false
      );
    }

    // console.log('DEBUG');
    const xAdjust = 0;
    const yAdjust = 200;

    let xInitial = 90 + 40;
    let yInitial = 486 + 20;
    let xOffset = 114 * 1.5;
    let yOffset = -64 * 1.5;
    this.points = {
      x: [
        xInitial + xOffset * 0 + xAdjust,
        xInitial + xOffset * 1 + xAdjust,
        xInitial + xOffset * 2 + xAdjust * 2,
        xInitial + xOffset * 3 + xAdjust * 3,
        xInitial + xOffset * 4 + xAdjust * 4,
        xInitial + xOffset * 5 + xAdjust * 5,
      ],
      y: [
        yInitial + yOffset * 0 + yAdjust,
        yInitial + yOffset * 1 + yAdjust,
        yInitial + yOffset * 2 + yAdjust,
        yInitial + yOffset * 3 + yAdjust,
        yInitial + yOffset * 4 + yAdjust,
        yInitial + yOffset * 5 + yAdjust,
      ], // origem, placa 1, placa 2, placa 3, destino
    };

    xOffset = 60;
    yOffset = 100;
    const rocks = {
      x: [
        156 + xOffset,
        276 + xOffset * 2,
        441 + xOffset * 4,
        590 + xOffset * 3,
        275 + xOffset,
        452 + xOffset * 3,
        712 + xOffset * 4.5,
      ],
      y: [
        309 + yOffset,
        259 + yOffset,
        156 + yOffset - 50,
        136 + yOffset - 75,
        543 + yOffset * 2.5,
        419 + yOffset * 2,
        316 + yOffset * 1.8,
      ],
      type: [1, 2, 1, 2, 1, 2, 2],
    };

    yOffset = 100;
    const trees = {
      x: [
        105 + 50,
        214 + 100,
        354 + 200,
        364 + 150,
        570 + 200,
        600 + 200,
        740 + 310,
        779 + 300,
      ],
      y: [
        341 + yOffset,
        219 + yOffset - 40,
        180 + yOffset - 50,
        520 + yOffset * 2.5,
        550 + yOffset * 2.5,
        392 + yOffset * 2,
        488 + yOffset * -1,
        286 + yOffset * 4,
      ],
      type: [2, 4, 3, 4, 1, 2, 4, 4],
    };

    const hOffset = gameFrame().y - 200;
    const wOffset = gameFrame().x;
    for (let i = 0, cur = this.points; i < cur.x.length; i++) {
      cur.x[i] += wOffset;
      cur.y[i] += hOffset;
    }
    for (let i = 0, cur = rocks; i < cur.x.length; i++) {
      cur.x[i] += wOffset;
      cur.y[i] += hOffset;
    }
    for (let i = 0, cur = trees; i < cur.x.length; i++) {
      cur.x[i] += wOffset;
      cur.y[i] += hOffset;
    }

    // Map
    game.add.image(wOffset, hOffset + 40, 'bgmap', 1.5);

    // Progress bar
    const percentText = completedLevels * 25;

    let y = 20;

    if (completedLevels >= 4)
      game.add.geom.rect(
        context.canvas.width - 240,
        y,
        4 * 37.5,
        35,
        undefined,
        0,
        colors.greenNeon,
        0.5
      );
    else
      game.add.geom.rect(
        context.canvas.width - 240,
        y,
        completedLevels * 37.5,
        35,
        undefined,
        0,
        colors.yellow,
        0.9
      );

    game.add.geom.rect(
      context.canvas.width - 240 + 1,
      y + 1,
      149,
      34,
      colors.blue,
      3,
      undefined,
      1
    );
    // Status Box
    game.add.text(
      context.canvas.width - 240 + 160,
      y + 33,
      percentText + '%',
      textStyles.h2_blueDark
    ).align = 'left';

    game.add.text(
      context.canvas.width - 240 - 10,
      y + 33,
      game.lang.difficulty + ' ' + gameDifficulty,
      textStyles.h2_blueDark
    ).align = 'right';

    // Map positions
    if (gameName == 'squareOne' || gameName == 'scaleOne') {
      // Garage
      game.add
        .image(this.points.x[0], this.points.y[0], 'garage', 0.6)
        .anchor(0.5, 1);
      // Farm
      game.add
        .image(this.points.x[5], this.points.y[5], 'farm', 0.9)
        .anchor(0.4, 0.7);
    } else {
      // House
      game.add
        .image(this.points.x[0], this.points.y[0], 'house', 1.05)
        .anchor(0.5, 0.8);
      // School
      game.add
        .image(this.points.x[5], this.points.y[5], 'school', 0.525)
        .anchor(0.2, 0.7);
    }

    // Rocks and bushes
    for (let i in rocks.type) {
      if (rocks.type[i] == 1) {
        game.add.image(rocks.x[i], rocks.y[i], 'rock', 0.6).anchor(0.5, 0.95);
      } else {
        game.add.image(rocks.x[i], rocks.y[i], 'bush', 0.7).anchor(0.5, 0.95);
      }
    }

    // Trees
    for (let i in trees.type) {
      game.add
        .image(trees.x[i], trees.y[i], 'tree' + trees.type[i], 0.9)
        .anchor(0.5, 0.95);
    }

    // Map positions
    for (let i = 1; i < this.points.x.length - 1; i++) {
      const aux =
        i < curMapPosition || (canGoToNextMapPosition && i == curMapPosition)
          ? 'place_on'
          : 'place_off';

      // Map road positions - game levels
      game.add
        .image(this.points.x[i], this.points.y[i], aux, 0.45)
        .anchor(0.5, 0.5);

      // Map road signs - game level number
      game.add
        .image(this.points.x[i] - 20, this.points.y[i] - 100, 'sign', 0.6)
        .anchor(0.5, 1);
      game.add.text(
        this.points.x[i] - 20,
        this.points.y[i] - 125,
        i,
        textStyles.h2_white
      );
    }

    // Game Character
    if (gameName == 'squareOne' || gameName == 'scaleOne') {
      if (gameOperation == 'Plus') {
        this.character = game.add.sprite(
          this.points.x[curMapPosition],
          this.points.y[curMapPosition],
          'tractor',
          0,
          0.75
        );
        this.character.animation = ['green_tractor', [0, 1, 2, 3, 4], 3];
      } else {
        this.character = game.add.sprite(
          this.points.x[curMapPosition],
          this.points.y[curMapPosition],
          'tractor',
          10,
          0.75
        );
        this.character.animation = ['red_tractor', [10, 11, 12, 13, 14], 3];
      }

      this.character.rotate = -30; // 25 anticlock
    } else {
      this.character = game.add.sprite(
        this.points.x[curMapPosition],
        this.points.y[curMapPosition],
        'kid_run',
        0,
        0.6
      );
      this.character.animation = ['kid', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3];
    }

    this.character.anchor(0.5, 1);
    game.animation.play(this.character.animation[0]);

    this.count = 0;

    const speed = 60;
    const xA = this.points.x[curMapPosition];
    const yA = this.points.y[curMapPosition];
    const xB = this.points.x[curMapPosition + 1];
    const yB = this.points.y[curMapPosition + 1];
    self.speedX = (xB - xA) / speed;
    self.speedY = (yA - yB) / speed;

    game.event.add('click', this.onInputDown);
    game.event.add('mousemove', this.onInputOver);
  },

  /**
   * Game loop
   */
  update: function () {
    // console.log('DEBUG');
    // self.loadGame();

    let endUpdate = false;

    self.count++;

    if (self.count > 60) {
      // Wait 1 second before moving or staring a game

      if (canGoToNextMapPosition) {
        // Move character on screen for 1 second
        self.character.x += self.speedX;
        self.character.y -= self.speedY;
        if (Math.ceil(self.character.x) >= self.points.x[curMapPosition + 1]) {
          // Reached next map position
          canGoToNextMapPosition = false;
          curMapPosition++; // Set new next position
        }
      }

      if (!canGoToNextMapPosition) {
        endUpdate = true;
      }
    }

    game.render.all();

    if (endUpdate) {
      game.animation.stop(self.character.animation[0]);
      // console.log('DEBUG');
      self.loadGame();
    }
  },

  /**
   * Calls game state
   */
  loadGame: function () {
    if (curMapPosition <= 4) game.state.start('' + gameName);
    else game.state.start('end');
  },

  /**
   * Called by mouse click event
   *
   * @param {object} mouseEvent contains the mouse click coordinates
   */
  onInputDown: function (mouseEvent) {
    const x = game.math.getMouse(mouseEvent).x;
    const y = game.math.getMouse(mouseEvent).y;
    navigationIcons.onInputDown(x, y);
  },

  /**
   * Called by mouse move event
   *
   * @param {object} mouseEvent contains the mouse move coordinates
   */
  onInputOver: function (mouseEvent) {
    const x = game.math.getMouse(mouseEvent).x;
    const y = game.math.getMouse(mouseEvent).y;
    navigationIcons.onInputOver(x, y);
  },
};
