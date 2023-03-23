/******************************
 * This file holds game states.
 ******************************/

/** [GAME STATE]
 *
 * .squareTwo. = gameName
 * .../...\...
 * ..a.....b.. = gameMode
 * ....\./....
 * .....|.....
 * ...minus.. = gameOperation
 * .....|.....
 * .1,2,3,4,5. = gameDifficulty
 *
 * Character : kid
 * Theme : (not themed)
 * Concept : player select equivalent dividends for fractions with different divisors
 * Represent fractions as : subdivided rectangles
 *
 * Game modes can be :
 *
 *   a : equivalence of fractions
 *       top has more subdivisions
 *   b : equivalence of fractions
 *       bottom has more subdivisions
 *
 * Operations :
 *
 *   minus : Player selects equivalent fractions of both blocks
 *
 * @namespace
 */
const squareTwo = {
  /**
   * Main code
   */
  create: function () {
    // CONTROL VARIABLES

    this.result = false; // Check if selected blocks are correct
    this.delay = 0; // Counter for game dalays
    this.endLevel = false;

    this.a = {
      blocks: [], // List of selection blocks
      auxBlocks: [], // List of shadow under selection blocks
      fractions: [], // Fraction numbers
      selected: 0, // Number of selected blocks for (a)
      hasClicked: false, // Check if player clicked blocks from (a)
      animate: false, // Animate blocks from (a)
      warningText: undefined,
      label: undefined,
    };

    this.b = {
      blocks: [],
      auxBlocks: [],
      fractions: [],
      selected: 0,
      hasClicked: false,
      animate: false,
      warningText: undefined,
      label: undefined,
    };

    // BACKGROUND AND KID
    renderBackground();

    // Calls function that loads navigation icons

    // FOR MOODLE
    if (moodle) {
      navigationIcons.add(
        false,
        false,
        false, // Left buttons
        true,
        false, // Right buttons
        false,
        false
      );
    } else {
      navigationIcons.add(
        true,
        true,
        false, // Left buttons
        true,
        false, // Right buttons
        'customMenu',
        false
      );
    }

    // Add kid
    this.kidAnimation = game.add.sprite(
      100,
      context.canvas.height - 128 * 1.5,
      'kid_standing',
      5,
      1.2
    );
    this.kidAnimation.anchor(0.5, 0.7);

    // Width and Height of (a) and (b)
    this.figureWidth = 400 * 1.5;
    const figureHeight = 50 * 1.5;

    // Coordinates for (a) and (b)
    let xA, xB, yA, yB;
    if (gameMode != 'b') {
      // More subdivisions on (b)
      xA = context.canvas.width / 2 - this.figureWidth / 2;
      yA = gameFrame().y;
      xB = xA;
      yB = yA + 3 * figureHeight + 30;
    } else {
      // More subdivisions on (a)
      xB = context.canvas.width / 2 - this.figureWidth / 2;
      yB = gameFrame().y;
      xA = xB;
      yA = yB + 3 * figureHeight + 30;
    }

    // Possible points for (a)
    const points = [2, 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20];

    // Random index for 'points'
    const randomIndex = game.math.randomInRange(
      (gameDifficulty - 1) * 2 + 1,
      (gameDifficulty - 1) * 2 + 3
    );

    // Number of subdivisions of (a) and (b) (blocks)
    const totalBlocksA = points[randomIndex];
    const totalBlocksB = game.math.randomDivisor(totalBlocksA);

    if (isDebugMode) {
      console.log(
        'Difficulty: ' +
          gameDifficulty +
          '\ncur index: ' +
          randomIndex +
          ', (min index: ' +
          ((gameDifficulty - 1) * 2 + 1) +
          ', max index: ' +
          ((gameDifficulty - 1) * 2 + 3) +
          ')' +
          '\ntotal blocks a: ' +
          totalBlocksA +
          ', total blocks b: ' +
          totalBlocksB
      );
    }

    // CREATING TOP FIGURE (a)
    let blockWidth = this.figureWidth / totalBlocksA; // Width of each block in (a)
    let lineColor = colors.redDark;
    let fillColor = colors.redLight;

    // Create blocks
    for (let i = 0; i < totalBlocksA; i++) {
      const x = xA + i * blockWidth;

      // Blocks
      const block = game.add.geom.rect(
        x,
        yA,
        blockWidth,
        figureHeight,
        lineColor,
        2,
        fillColor,
        0.5
      );
      block.figure = 'a';
      block.index = i;
      block.finalX = xA;
      this.a.blocks.push(block);

      // Auxiliar blocks
      const alpha = fractionLabel ? 0.1 : 0;

      const yAux = yA + figureHeight + 10; // On the bottom of (a)
      const auxBlock = game.add.geom.rect(
        x,
        yAux,
        blockWidth,
        figureHeight,
        lineColor,
        1,
        fillColor,
        alpha
      );
      this.a.auxBlocks.push(auxBlock);
    }

    // 'total blocks' label for (a) : on the side of (a)
    let xLabel = xA + this.figureWidth + 30;
    let yLabel = yA + figureHeight / 2;

    this.a.label = game.add.text(
      xLabel,
      yLabel,
      this.a.blocks.length,
      textStyles.h4_blueDark
    );

    // 'selected blocks/fraction' label for (a) : at the bottom of (a)
    yLabel = yA + figureHeight + 34;

    this.a.fractions[0] = game.add.text(
      xLabel,
      yLabel,
      '',
      textStyles.h4_blueDark
    );
    this.a.fractions[1] = game.add.text(
      xLabel,
      yLabel + 21,
      '',
      textStyles.h4_blueDark
    );
    this.a.fractions[2] = game.add.text(
      xLabel,
      yLabel,
      '___',
      textStyles.h4_blueDark
    );
    this.a.fractions[0].alpha = 0;
    this.a.fractions[1].alpha = 0;
    this.a.fractions[2].alpha = 0;

    // CREATING BOTTOM FIGURE (b)
    blockWidth = this.figureWidth / totalBlocksB; // Width of each block in (b)
    lineColor = colors.greenDark;
    fillColor = colors.greenLight;

    // Blocks and auxiliar blocks
    for (let i = 0; i < totalBlocksB; i++) {
      const x = xB + i * blockWidth;

      // Blocks
      const block = game.add.geom.rect(
        x,
        yB,
        blockWidth,
        figureHeight,
        lineColor,
        2,
        fillColor,
        0.5
      );
      block.figure = 'b';
      block.index = i;
      block.finalX = xB;
      this.b.blocks.push(block);

      // Auxiliar blocks
      const alpha = fractionLabel ? 0.1 : 0;
      const yAux = yB + figureHeight + 10; // On the bottom of (b)
      const auxBlock = game.add.geom.rect(
        x,
        yAux,
        blockWidth,
        figureHeight,
        lineColor,
        1,
        fillColor,
        alpha
      );
      this.b.auxBlocks.push(auxBlock);
    }

    // Label block (b)
    xLabel = xB + this.figureWidth + 30;
    yLabel = yB + figureHeight / 2;

    this.b.label = game.add.text(
      xLabel,
      yLabel,
      this.b.blocks.length,
      textStyles.h4_blueDark
    );

    // Label fraction
    yLabel = yB + figureHeight + 34;

    this.b.fractions[0] = game.add.text(
      xLabel,
      yLabel,
      '',
      textStyles.h4_blueDark
    );
    this.b.fractions[1] = game.add.text(
      xLabel,
      yLabel + 21,
      '',
      textStyles.h4_blueDark
    );
    this.b.fractions[2] = game.add.text(
      xLabel,
      yLabel,
      '___',
      textStyles.h4_blueDark
    );
    this.b.fractions[0].alpha = 0;
    this.b.fractions[1].alpha = 0;
    this.b.fractions[2].alpha = 0;

    // Invalid selection text
    this.a.warningText = game.add.text(
      context.canvas.width / 2,
      context.canvas.height / 2 - 225,
      '',
      textStyles.h4_brown
    );
    this.b.warningText = game.add.text(
      context.canvas.width / 2,
      context.canvas.height / 2 - 45,
      '',
      textStyles.h4_brown
    );

    game.timer.start(); // Set a timer for the current level (used in postScore)

    game.event.add('click', this.onInputDown);
    game.event.add('mousemove', this.onInputOver);
  },

  /**
   * Game loop
   */
  update: function () {
    // Animate blocks
    if (self.a.animate || self.b.animate) {
      ['a', 'b'].forEach((cur) => {
        if (self[cur].animate) {
          // Lower selected blocks
          for (let i = 0; i < self[cur].selected; i++) {
            self[cur].blocks[i].y += 2;
          }

          // After fully lowering blocks, set fraction value
          if (self[cur].blocks[0].y >= self[cur].auxBlocks[0].y) {
            self[cur].fractions[0].name = self[cur].selected;
            self[cur].animate = false;
          }
        }
      });
    }

    // If (a) and (b) are already clicked
    if (self.a.hasClicked && self.b.hasClicked && !self.endLevel) {
      game.timer.stop();
      self.delay++;

      // After delay is over, check result
      if (self.delay > 50) {
        self.result =
          self.a.selected / self.a.blocks.length ==
          self.b.selected / self.b.blocks.length;

        // Fractions are equivalent : CORRECT
        if (self.result) {
          if (audioStatus) game.audio.okSound.play();

          game.add
            .image(context.canvas.width / 2, context.canvas.height / 2, 'ok')
            .anchor(0.5, 0.5);
          canGoToNextMapPosition = true; // Allow character to move to next level in map state
          completedLevels++;

          if (isDebugMode) console.log('Completed Levels: ' + completedLevels);

          // Fractions are not equivalent : INCORRECT
        } else {
          if (audioStatus) game.audio.errorSound.play();
          game.add
            .image(context.canvas.width / 2, context.canvas.height / 2, 'error')
            .anchor(0.5, 0.5);
          canGoToNextMapPosition = false; // Doesnt allow character to move to next level in map state
        }

        self.postScore();
        self.endLevel = true;

        // Reset delay values for next delay
        self.delay = 0;
      }
    }

    // Wait a bit and go to map state
    if (self.endLevel) {
      self.delay++;

      if (self.delay >= 80) {
        game.state.start('map');
      }
    }

    game.render.all();
  },

  /**
   * Function called by self.onInputOver() when cursor is over a valid rectangle.
   *
   * @param {object} curBlock rectangle the cursor is over : can be self.a.blocks[i] or self.b.blocks[i]
   */
  overSquare: function (curBlock) {
    const curSet = curBlock.figure; // 'a' || 'b'

    if (!self[curSet].hasClicked) {
      // self.a.hasClicked || self.b.hasClicked
      // If over fraction 'n/n' shows warning message not allowing it
      if (curBlock.index == self[curSet].blocks.length - 1) {
        const otherSet = curSet == 'a' ? 'b' : 'a';

        self[curSet].warningText.name = game.lang.s2_error_msg;
        self[otherSet].warningText.name = '';

        self.outSquare(curSet);
      } else {
        document.body.style.cursor = 'pointer';

        self.a.warningText.name = '';
        self.b.warningText.name = '';

        // Selected blocks become fully visible
        for (let i in self[curSet].blocks) {
          self[curSet].blocks[i].alpha = i <= curBlock.index ? 1 : 0.5;
        }

        self[curSet].fractions[0].name = curBlock.index + 1; // Nominator : selected blocks
        self[curSet].fractions[1].name = self[curSet].blocks.length; // Denominator : total blocks

        const newX =
          curBlock.finalX +
          (curBlock.index + 1) *
            (self.figureWidth / self[curSet].blocks.length) +
          25;
        self[curSet].fractions[0].x = newX;
        self[curSet].fractions[1].x = newX;
        self[curSet].fractions[2].x = newX;

        self[curSet].fractions[0].alpha = 1;
      }
    }
  },

  /**
   * Function called (by self.onInputOver() and self.overSquare()) when cursor is out of a valid rectangle.
   *
   * @param {object} curSet set of rectangles : can be top (self.a) or bottom (self.b)
   */
  outSquare: function (curSet) {
    if (!self[curSet].hasClicked) {
      self[curSet].fractions[0].alpha = 0;
      self[curSet].fractions[1].alpha = 0;
      self[curSet].fractions[2].alpha = 0;

      self[curSet].blocks.forEach((cur) => {
        cur.alpha = 0.5;
      });
    }
  },

  /**
   * Function called by self.onInputDown() when player clicked a valid rectangle.
   *
   * @param {object} curBlock clicked rectangle : can be self.a.blocks[i] or self.b.blocks[i]
   */
  clickSquare: function (curBlock) {
    const curSet = curBlock.figure; // 'a' || 'b'

    if (
      !self[curSet].hasClicked &&
      curBlock.index != self[curSet].blocks.length - 1
    ) {
      document.body.style.cursor = 'auto';

      // Turn auxiliar blocks invisible
      for (let i in self[curSet].blocks) {
        if (i > curBlock.index) self[curSet].auxBlocks[i].alpha = 0;
      }

      // Turn value label invisible
      self[curSet].label.alpha = 0;

      if (audioStatus) game.audio.popSound.play();

      // Save number of selected blocks
      self[curSet].selected = curBlock.index + 1;

      // Set fraction x position
      const newX =
        curBlock.finalX +
        self[curSet].selected *
          (self.figureWidth / self[curSet].blocks.length) +
        25;
      self[curSet].fractions[0].x = newX;
      self[curSet].fractions[1].x = newX;
      self[curSet].fractions[2].x = newX;

      self[curSet].fractions[1].alpha = 1;
      self[curSet].fractions[2].alpha = 1;

      self[curSet].hasClicked = true; // Inform player have clicked in current block set
      self[curSet].animate = true; // Let it initiate animation
    }

    game.render.all();
  },

  /**
   * Called by mouse click event
   *
   * @param {object} mouseEvent contains the mouse click coordinates
   */
  onInputDown: function (mouseEvent) {
    const x = game.math.getMouse(mouseEvent).x;
    const y = game.math.getMouse(mouseEvent).y;

    // Click block in (a)
    self.a.blocks.forEach((cur) => {
      if (game.math.isOverIcon(x, y, cur)) self.clickSquare(cur);
    });

    // Click block in (b)
    self.b.blocks.forEach((cur) => {
      if (game.math.isOverIcon(x, y, cur)) self.clickSquare(cur);
    });

    // Click navigation icons
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
    let flagA = false;
    let flagB = false;

    // Mouse over (a) : show fraction
    self.a.blocks.forEach((cur) => {
      if (game.math.isOverIcon(x, y, cur)) {
        flagA = true;
        self.overSquare(cur);
      }
    });
    if (!flagA) self.outSquare('a');

    // Mouse over (b) : show fraction
    self.b.blocks.forEach((cur) => {
      if (game.math.isOverIcon(x, y, cur)) {
        flagB = true;
        self.overSquare(cur);
      }
    });
    if (!flagB) self.outSquare('b');

    if (!flagA && !flagB) document.body.style.cursor = 'auto';

    // Mouse over navigation icons : show name
    navigationIcons.onInputOver(x, y);

    game.render.all();
  },

  /**
   * Saves players data after level ends - to be sent to database. <br>
   *
   * Attention: the 'line_' prefix data table must be compatible to data table fields (MySQL server)
   *
   * @see /php/save.php
   */
  postScore: function () {
    // Creates string that is going to be sent to db
    const data =
      '&line_game=' +
      gameShape +
      '&line_mode=' +
      gameMode +
      '&line_oper=Equal' +
      '&line_leve=' +
      gameDifficulty +
      '&line_posi=' +
      curMapPosition +
      '&line_resu=' +
      self.result +
      '&line_time=' +
      game.timer.elapsed +
      '&line_deta=' +
      'numBlocksA: ' +
      self.a.blocks.length +
      ', valueA: ' +
      self.a.selected +
      ', numBlocksB: ' +
      self.b.blocks.length +
      ', valueB: ' +
      self.b.selected;

    // FOR MOODLE
    sendToDatabase(data);
  },
};
