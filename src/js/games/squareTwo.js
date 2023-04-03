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
  control: undefined,
  // animation: undefined,
  // road: undefined,

  blocks: undefined,

  help: undefined,
  message: undefined,
  // continue: undefined,

  /**
   * Main code
   */
  create: function () {
    this.control = {
      // correctX: x0, // Correct position (accumulative)
      // nextX: undefined, // Next point position
      // divisorsList: '', // used in postScore (Accumulative)
      // hasClicked: false, // Checks if user has clicked
      // checkAnswer: false, // Check kid inside ballon's basket
      isCorrect: false, // Check if selected blocks are correct
      showEndInfo: false,
      // // mode 'b' exclusive
      // endIndex: undefined,
      // fractionIndex: -1, // Index of clicked circle (game (b))
      // numberOfPlusFractions: undefined,
    };
    this.continue = {
      modal: undefined,
      button: undefined,
      text: undefined,
    };
    this.default = {
      width: 400 * 1.5,
      height: 50 * 1.5,
    };

    // CONTROL VARIABLES

    this.delay = 0; // Counter for game dalays
    this.endLevel = false;

    this.blocks = {
      a: {
        list: [], // List of selection blocks
        auxBlocks: [], // List of shadow under selection blocks
        fractions: [], // Fraction numbers
        selected: 0, // Number of selected blocks for (a)
        hasClicked: false, // Check if player clicked blocks from (a)
        animate: false, // Animate blocks from (a)
        warningText: undefined,
        label: undefined,
      },
      b: {
        list: [],
        auxBlocks: [],
        fractions: [],
        selected: 0,
        hasClicked: false,
        animate: false,
        warningText: undefined,
        label: undefined,
      },
    };

    renderBackground();

    // Calls function that loads navigation icons

    // FOR MOODLE
    if (moodle) {
      navigation.add.right(['audio']);
    } else {
      navigation.add.left(['back', 'menu'], 'customMenu');
      navigation.add.right(['audio']);
    }

    // Add kid
    this.utils.renderCharacters();
    this.utils.renderBlockSetup();
    this.utils.renderAuxiliarUI();

    game.timer.start(); // Set a timer for the current level (used in postScore)
    game.event.add('click', this.events.onInputDown);
    game.event.add('mousemove', this.events.onInputOver);
  },

  /**
   * Game loop
   */
  update: function () {
    // Animate blocks
    if (self.blocks.a.animate || self.blocks.b.animate) {
      ['a', 'b'].forEach((cur) => {
        if (self.blocks[cur].animate) {
          // Lower selected blocks
          for (let i = 0; i < self.blocks[cur].selected; i++) {
            self.blocks[cur].list[i].y += 2;
          }

          // After fully lowering blocks, set fraction value
          if (self.blocks[cur].list[0].y >= self.blocks[cur].auxBlocks[0].y) {
            self.blocks[cur].fractions[0].name = self.blocks[cur].selected;
            self.blocks[cur].animate = false;
          }
        }
      });
    }

    // If (a) and (b) are already clicked
    if (
      self.blocks.a.hasClicked &&
      self.blocks.b.hasClicked &&
      !self.endLevel
    ) {
      game.timer.stop();
      self.delay++;

      // After delay is over, check result
      if (self.delay > 50) {
        self.control.isCorrect =
          self.blocks.a.selected / self.blocks.a.list.length ==
          self.blocks.b.selected / self.blocks.b.list.length;

        // Fractions are equivalent : CORRECT
        if (self.control.isCorrect) {
          if (audioStatus) game.audio.okSound.play();

          game.add
            .image(
              context.canvas.width / 2,
              context.canvas.height / 2,
              'answer_correct'
            )
            .anchor(0.5, 0.5);
          canGoToNextMapPosition = true; // Allow character to move to next level in map state
          completedLevels++;

          if (isDebugMode) console.log('Completed Levels: ' + completedLevels);

          // Fractions are not equivalent : INCORRECT
        } else {
          if (audioStatus) game.audio.errorSound.play();
          game.add
            .image(
              context.canvas.width / 2,
              context.canvas.height / 2,
              'answer_wrong'
            )
            .anchor(0.5, 0.5);
          canGoToNextMapPosition = false; // Doesnt allow character to move to next level in map state
        }

        self.fetch.postScore();
        self.endLevel = true;

        // Reset delay values for next delay
        self.delay = 0;
      }
    }

    // Wait a bit and go to map state
    if (self.endLevel) {
      self.delay++;

      if (self.delay >= 80) {
        self.control.showEndInfo = true;
        self.utils.showEndInfo();
      }
    }

    game.render.all();
  },

  utils: {
    // RENDERS
    renderBlockSetup: function () {
      // Coordinates for (a) and (b)
      let xA, xB, yA, yB;

      if (gameMode != 'b') {
        // Has more subdivisions on (b)
        xA = context.canvas.width / 2 - self.default.width / 2;
        yA = gameFrame().y;
        xB = xA;
        yB = yA + 3 * self.default.height + 30;
      } else {
        // Has more subdivisions on (a)
        xB = context.canvas.width / 2 - self.default.width / 2;
        yB = gameFrame().y;
        xA = xB;
        yA = yB + 3 * self.default.height + 30;
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

      const blockWidthA = self.default.width / totalBlocksA;
      const blockWidthB = self.default.width / totalBlocksB;

      if (isDebugMode) {
        console.log(
          `Difficulty: ${gameDifficulty}\ncur index: ${randomIndex}, (min index: ${
            (gameDifficulty - 1) * 2 + 1
          }, max index: ${
            (gameDifficulty - 1) * 2 + 3
          })\ntotal blocks a: ${totalBlocksA}, total blocks b: ${totalBlocksB}`
        );
      }

      // (a)
      self.utils.renderBlocks(
        self.blocks.a,
        'a',
        totalBlocksA,
        blockWidthA,
        colors.redDark,
        colors.redLight,
        xA,
        yA
      );

      // (b)
      self.utils.renderBlocks(
        self.blocks.b,
        'b',
        totalBlocksB,
        blockWidthB,
        colors.greenDark,
        colors.greenLight,
        xB,
        yB
      );
    },
    renderBlocks: function (
      blocks,
      blockType,
      totalBlocks,
      blockWidth,
      lineColor,
      fillColor,
      x0,
      y0
    ) {
      // Create blocks
      for (let i = 0; i < totalBlocks; i++) {
        const curX = x0 + i * blockWidth;

        // Blocks
        const block = game.add.geom.rect(
          curX,
          y0,
          blockWidth,
          self.default.height,
          lineColor,
          2,
          fillColor,
          0.5
        );
        block.figure = blockType;
        block.index = i;
        block.finalX = x0;
        blocks.list.push(block);

        // Auxiliar blocks
        const alpha = showFractions ? 0.1 : 0;

        const yAux = y0 + self.default.height + 10; // On the bottom of (a)
        const auxBlock = game.add.geom.rect(
          curX,
          yAux,
          blockWidth,
          self.default.height,
          lineColor,
          1,
          fillColor,
          alpha
        );
        blocks.auxBlocks.push(auxBlock);
      }

      // 'total blocks' label for (a) : on the side of (a)
      const xLabel = x0 + self.default.width + 30;
      let yLabel = y0 + self.default.height / 2;

      blocks.label = game.add.text(
        xLabel,
        yLabel,
        blocks.list.length,
        textStyles.h4_
      );

      // 'selected blocks/fraction' label for (a) : at the bottom of (a)
      yLabel = y0 + self.default.height + 34;

      blocks.fractions[0] = game.add.text(xLabel, yLabel, '', textStyles.h4_);
      blocks.fractions[1] = game.add.text(
        xLabel,
        yLabel + 21,
        '',
        textStyles.h4_
      );
      blocks.fractions[2] = game.add.text(
        xLabel,
        yLabel,
        '___',
        textStyles.h4_
      );
      blocks.fractions[0].alpha = 0;
      blocks.fractions[1].alpha = 0;
      blocks.fractions[2].alpha = 0;

      // Invalid selection text
      blocks.warningText = game.add.text(
        context.canvas.width / 2,
        context.canvas.height / 2 - 225,
        '',
        textStyles.h4_
      );
    },
    renderCharacters: function () {
      self.kidAnimation = game.add.sprite(
        100,
        context.canvas.height - 128 * 1.5,
        'kid_standing',
        5,
        1.2
      );
      self.kidAnimation.anchor(0.5, 0.7);
    },
    renderAuxiliarUI: function () {
      // Intro text
      self.message = [];
      self.message.push(
        game.add.text(
          context.canvas.width / 2,
          170,
          game.lang.squareTwo_intro1 || '...',
          textStyles.h1_
        )
      );
      self.message.push(
        game.add.text(
          context.canvas.width / 2,
          220,
          game.lang.squareTwo_intro2 || '...',
          textStyles.h1_
        )
      );

      // continue button
      self.continue.modal = game.add.geom.rect(
        0,
        0,
        context.canvas.width,
        context.canvas.height,
        undefined,
        0,
        colors.white,
        0
      );
      self.continue.button = game.add.geom.rect(
        context.canvas.width / 2,
        context.canvas.height / 2 + 200,
        300,
        100,
        undefined,
        0,
        colors.green,
        0
      );
      self.continue.button.anchor(0.5, 0.5);
      self.continue.text = game.add.text(
        context.canvas.width / 2,
        context.canvas.height / 2 + 16 + 200,
        game.lang.continue,
        textStyles.btn
      );
      self.continue.text.alpha = 0;
    },

    // UPDATE
    showEndInfo: function () {
      let color;
      //let text;
      if (self.control.isCorrect) {
        color = colors.green;
        //text = game.lang.continue;
      } else {
        color = colors.red;
        //text = game.lang.retry;
      }
      self.continue.modal.alpha = 0.25;
      // self.continue.text.name = text;
      self.continue.text.alpha = 1;
      self.continue.button.fillColor = color;
      self.continue.button.alpha = 1;
    },
    endLevel: function () {
      game.state.start('map');
    },

    // INFORMATION

    // HANDLERS
    /**
     * Function called by self.onInputDown() when player clicked a valid rectangle.
     *
     * @param {object} curBlock clicked rectangle : can be self.blocks.a.list[i] or self.blocks.b.list[i]
     */
    clickSquareHandler: function (curBlock) {
      const curSet = curBlock.figure; // 'a' || 'b'

      if (
        !self.blocks[curSet].hasClicked &&
        curBlock.index != self.blocks[curSet].list.length - 1
      ) {
        document.body.style.cursor = 'auto';

        // Turn auxiliar blocks invisible
        for (let i in self.blocks[curSet].list) {
          if (i > curBlock.index) self.blocks[curSet].auxBlocks[i].alpha = 0;
        }

        // Turn value label invisible
        self.blocks[curSet].label.alpha = 0;

        if (audioStatus) game.audio.popSound.play();

        // Save number of selected blocks
        self.blocks[curSet].selected = curBlock.index + 1;

        // Set fraction x position
        const newX =
          curBlock.finalX +
          self.blocks[curSet].selected *
            (self.figureWidth / self.blocks[curSet].list.length) +
          25;
        self.blocks[curSet].fractions[0].x = newX;
        self.blocks[curSet].fractions[1].x = newX;
        self.blocks[curSet].fractions[2].x = newX;

        self.blocks[curSet].fractions[1].alpha = 1;
        self.blocks[curSet].fractions[2].alpha = 1;

        self.blocks[curSet].hasClicked = true; // Inform player have clicked in current block set
        self.blocks[curSet].animate = true; // Let it initiate animation
      }

      game.render.all();
    },
    /**
     * Function called by self.onInputOver() when cursor is over a valid rectangle.
     *
     * @param {object} curBlock rectangle the cursor is over : can be self.blocks.a.list[i] or self.blocks.b.list[i]
     */
    overSquareHandler: function (curBlock) {
      const curSet = curBlock.figure; // 'a' || 'b'

      if (!self.blocks[curSet].hasClicked) {
        // self.blocks.a.hasClicked || self.blocks.b.hasClicked
        // If over fraction 'n/n' shows warning message not allowing it
        if (curBlock.index == self.blocks[curSet].list.length - 1) {
          const otherSet = curSet == 'a' ? 'b' : 'a';

          self.blocks[curSet].warningText.name = game.lang.s2_error_msg;
          self.blocks[otherSet].warningText.name = '';

          self.utils.outSquareHandler(curSet);
        } else {
          document.body.style.cursor = 'pointer';

          self.blocks.a.warningText.name = '';
          self.blocks.b.warningText.name = '';

          // Selected blocks become fully visible
          for (let i in self.blocks[curSet].list) {
            self.blocks[curSet].list[i].alpha = i <= curBlock.index ? 1 : 0.5;
          }

          self.blocks[curSet].fractions[0].name = curBlock.index + 1; // Nominator : selected blocks
          self.blocks[curSet].fractions[1].name =
            self.blocks[curSet].list.length; // Denominator : total blocks

          const newX =
            curBlock.finalX +
            (curBlock.index + 1) *
              (self.figureWidth / self.blocks[curSet].list.length) +
            25;
          self.blocks[curSet].fractions[0].x = newX;
          self.blocks[curSet].fractions[1].x = newX;
          self.blocks[curSet].fractions[2].x = newX;

          self.blocks[curSet].fractions[0].alpha = 1;
        }
      }
    },
    /**
     * Function called (by self.onInputOver() and self.utils.overSquareHandler()) when cursor is out of a valid rectangle.
     *
     * @param {object} curSet set of rectangles : can be top (self.blocks.a) or bottom (self.blocks.b)
     */
    outSquareHandler: function (curSet) {
      if (!self.blocks[curSet].hasClicked) {
        self.blocks[curSet].fractions[0].alpha = 0;
        self.blocks[curSet].fractions[1].alpha = 0;
        self.blocks[curSet].fractions[2].alpha = 0;

        self.blocks[curSet].list.forEach((cur) => {
          cur.alpha = 0.5;
        });
      }
    },
  },
  events: {
    /**
     * Called by mouse click event
     *
     * @param {object} mouseEvent contains the mouse click coordinates
     */
    onInputDown: function (mouseEvent) {
      const x = game.math.getMouse(mouseEvent).x;
      const y = game.math.getMouse(mouseEvent).y;

      // Click block in (a)
      self.blocks.a.list.forEach((cur) => {
        if (game.math.isOverIcon(x, y, cur)) self.utils.clickSquareHandler(cur);
      });

      // Click block in (b)
      self.blocks.b.list.forEach((cur) => {
        if (game.math.isOverIcon(x, y, cur)) self.utils.clickSquareHandler(cur);
      });

      // Continue button
      if (self.control.showEndInfo) {
        if (game.math.isOverIcon(x, y, self.continue.button)) {
          self.utils.endLevel();
        }
      }

      // Click navigation icons
      navigation.onInputDown(x, y);

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
      self.blocks.a.list.forEach((cur) => {
        if (game.math.isOverIcon(x, y, cur)) {
          flagA = true;
          self.utils.overSquareHandler(cur);
        }
      });
      if (!flagA) self.utils.outSquareHandler('a');

      // Mouse over (b) : show fraction
      self.blocks.b.list.forEach((cur) => {
        if (game.math.isOverIcon(x, y, cur)) {
          flagB = true;
          self.utils.overSquareHandler(cur);
        }
      });
      if (!flagB) self.utils.outSquareHandler('b');

      if (!flagA && !flagB) document.body.style.cursor = 'auto';

      // Continue button
      if (self.control.showEndInfo) {
        if (game.math.isOverIcon(x, y, self.continue.button)) {
          // If pointer is over icon
          document.body.style.cursor = 'pointer';
          self.continue.button.scale = self.continue.button.initialScale * 1.1;
          self.continue.text.style = textStyles.btnLg;
        } else {
          // If pointer is not over icon
          document.body.style.cursor = 'auto';
          self.continue.button.scale = self.continue.button.initialScale * 1;
          self.continue.text.style = textStyles.btn;
        }
      }

      // Mouse over navigation icons : show name
      navigation.onInputOver(x, y);

      game.render.all();
    },
  },
  fetch: {
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
        self.control.isCorrect +
        '&line_time=' +
        game.timer.elapsed +
        '&line_deta=' +
        'numBlocksA: ' +
        self.blocks.a.list.length +
        ', valueA: ' +
        self.blocks.a.selected +
        ', numBlocksB: ' +
        self.blocks.b.list.length +
        ', valueB: ' +
        self.blocks.b.selected;

      // FOR MOODLE
      sendToDatabase(data);
    },
  },
};
