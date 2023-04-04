/******************************
 * This file holds game states.
 ******************************/

/** [GAME STATE]
 *
 * ..squareOne...	= gameName
 * ..../...\.....
 * ...a.....b.... = gameMode
 * .....\./......
 * ......|.......
 * ...../.\......
 * .plus...minus. = gameOperation
 * .....\./......
 * ......|.......
 * ....1,2,3..... = gameDifficulty
 *
 * Character : tractor
 * Theme : farm
 * Concept : Player associates 'blocks carried by the tractor' and 'floor spaces to be filled by them'
 * Represent fractions as : blocks/rectangles
 *
 * Game modes can be :
 *
 *   a : Player can select # of 'floor blocks' (hole in the ground)
 *       Selects size of hole to be made in the ground (to fill with the blocks in front of the truck)
 *   b : Player can select # of 'stacked blocks' (in front of the truck)
 *       Selects number of blocks in front of the truck (to fill the hole on the ground)
 *
 * Operations can be :
 *
 *   plus : addition of fractions
 *     Represented by : tractor going to the right (floor positions 0..8)
 *   minus : subtraction of fractions
 *     Represented by: tractor going to the left (floor positions 8..0)
 *
 * @namespace
 */
const squareOne = {
  default: undefined,

  control: undefined,
  animation: undefined,

  tractor: undefined,
  stck: undefined,
  floor: undefined,

  help: undefined,
  message: undefined,
  continue: undefined,

  /**
   * Main code
   */
  create: function () {
    this.continue = {
      modal: undefined,
      button: undefined,
      text: undefined,
    };

    this.control = {
      direc: gameOperation == 'minus' ? -1 : 1, // Will be multiplied to values to easily change tractor direction when needed
      divisorsList: '', // Hold the divisors for each fraction on stacked blocks (created for postScore())

      hasClicked: false, // Checks if player 'clicked' on a block
      checkAnswer: false, // When true allows game to run 'check answer' code in update
      isCorrect: false, // Checks player 'answer'

      count: 0, // An 'x' position counter used in the tractor animation
    };

    this.animation = {
      animateTractor: false, // When true allows game to run 'tractor animation' code in update (turns animation of the moving tractor ON/OFF)
      animateEnding: false, // When true allows game to run 'tractor ending animation' code in update (turns 'ending' animation of the moving tractor ON/OFF)
      speed: 2 * this.control.direc, // X distance in which the tractor moves in each iteration of the animation
    };

    this.default = {
      width: context.canvas.width / 11, // Base block width,
      height: 40 * 1.5, // Base block height
      x0:
        gameOperation == 'minus' ? context.canvas.width - 170 * 1.5 : 170 * 1.5, // Initial 'x' coordinate for the tractor and stacked blocks
      y0: context.canvas.height - 157 * 1.5 + 10,
    };

    renderBackground();

    // Calls function that loads navigation icons

    // FOR MOODLE
    if (moodle) {
      navigation.add.right(['audio']);
    } else {
      navigation.add.left(['back', 'menu', 'show_answer'], 'customMenu');
      navigation.add.right(['audio']);
    }

    this.blocks = {
      stack: {
        list: [],
        index: undefined, // (gameMode 'b') index of 'stacked' block selected by player

        // Control variables for animation
        curIndex: 0, // (needs to be 0)
        curBlockEnd: undefined,

        // Correct values
        correctIndex: undefined, // (gameMode 'b') index of the CORRECT 'stacked' block
      },
      floor: {
        list: [], // Group of 'floor' block objects
        index: undefined, // (gameMode 'a') index of 'floor' block selected by player

        // Control variables for animation
        curIndex: -1, // (needs to be -1)

        // Correct values
        correctIndex: undefined, // (gameMode 'a') index of the CORRECT 'floor' block
        correctX: undefined, // 'x' coordinate of CORRECT 'floor' block
        correctXA: undefined, // Temporary variable
        correctXB: undefined, // Temporary variable
      },
    };

    // // STACKED BLOCKS variables
    // this.stck = {
    //   blocks: [], // Group of 'stacked' block objects

    //   index: undefined, // (gameMode 'b') index of 'stacked' block selected by player

    //   // Control variables for animation
    //   curIndex: 0, // (needs to be 0)
    //   curBlockEnd: undefined,

    //   // Correct values
    //   correctIndex: undefined, // (gameMode 'b') index of the CORRECT 'stacked' block
    // };

    // // FLOOR BLOCKS variables
    // this.floor = {
    //   blocks: [], // Group of 'floor' block objects
    //   index: undefined, // (gameMode 'a') index of 'floor' block selected by player

    //   // Control variables for animation
    //   curIndex: -1, // (needs to be -1)

    //   // Correct values
    //   correctIndex: undefined, // (gameMode 'a') index of the CORRECT 'floor' block
    //   correctX: undefined, // 'x' coordinate of CORRECT 'floor' block
    //   correctXA: undefined, // Temporary variable
    //   correctXB: undefined, // Temporary variable
    // };
    let lineColor = undefined;
    let fillColor = undefined;
    if (gameOperation === 'minus') {
      lineColor = colors.red;
      fillColor = colors.redLight;
    } else {
      lineColor = colors.green;
      fillColor = colors.greenLight;
    }
    this.restart = this.utils.renderStackedBlocks(
      this.control.direc,
      lineColor,
      fillColor
    );
    this.utils.renderFloorBlocks(this.control.direc, lineColor);
    this.utils.renderCharacters();
    this.utils.renderAuxiliarUI(this.control.direc);

    if (!this.restart) {
      game.timer.start(); // Set a timer for the current level (used in postScore())
      game.event.add('click', this.events.onInputDown);
      game.event.add('mousemove', this.events.onInputOver);
    }
  },

  /**
   * Game loop
   */
  update: function () {
    // Starts tractor animation
    if (self.animation.animateTruck) {
      self.utils.animateTruck();
    }

    // Check answer after animation ends
    if (self.control.checkAnswer) {
      self.utils.checkAnswer();
    }

    // Starts tractor moving animation
    if (self.animation.animateEnding) {
      self.utils.animateEnding();
    }

    game.render.all();
  },

  utils: {
    // RENDER
    /**
     * Create stacked blocks for the level in create()
     *
     * @returns {boolean}
     */
    renderStackedBlocks: function (direc, lineColor, fillColor) {
      let restart = false;
      let hasBaseDifficulty = false; // Will be true after next for loop if level has at least one '1/difficulty' fraction (if false, restart)

      const lineSize = 3;

      const max = gameMode == 'b' ? 10 : curMapPosition + 4; // Maximum number of stacked blocks for the level
      const total = game.math.randomInRange(curMapPosition + 2, max); // Current number of stacked blocks for the level

      self.blocks.floor.correctXA =
        self.default.x0 + self.default.width * direc;

      for (let i = 0; i < total; i++) {
        let curFractionItems = undefined;
        let font = undefined;

        let curDivisor = game.math.randomInRange(1, gameDifficulty); // Set divisor for fraction
        if (curDivisor === gameDifficulty) hasBaseDifficulty = true;
        if (curDivisor === 3) curDivisor = 4; // Make sure valid divisors are 1, 2 and 4 (not 3)

        const curBlockWidth = self.default.width / curDivisor; // Current width is a fraction of the default

        self.control.divisorsList += curDivisor + ','; // List of divisors (for postScore())
        self.blocks.floor.correctXA += curBlockWidth * direc;

        const curBlock = game.add.geom.rect(
          self.default.x0,
          self.default.y0 + 17 - i * (self.default.height - lineSize),
          curBlockWidth - lineSize,
          self.default.height - lineSize,
          lineColor,
          lineSize,
          fillColor,
          1
        );
        curBlock.anchor(gameOperation === 'minus' ? 1 : 0, 0);

        // If game mode is (b), adding events to stacked blocks
        if (gameMode == 'b') {
          curBlock.alpha = 0.5;
          curBlock.index = i;
        }

        self.blocks.stack.list.push(curBlock);

        // If 'show fractions' is turned on, create labels that display the fractions on the side of each block
        if (showFractions) {
          const x = self.default.x0 + (curBlockWidth + 40) * direc;
          const y = self.default.height - lineSize;

          if (curDivisor === 1) {
            font = textStyles.h2_;
            curFractionItems = [
              {
                x: x,
                y: self.default.y0 - (i - 1) * y,
                text: gameOperation === 'minus' ? '-1' : '1',
              },
            ];
          } else {
            font = textStyles.p_;
            curFractionItems = [
              {
                x: x,
                y: self.default.y0 + 45 - i * y + 23, //curCircleY + 34,
                text: curDivisor,
              },
              {
                x: x,
                y: self.default.y0 + 40 - i * y, //curCircleY - 2
                text: '1',
              },
              {
                x: x,
                y: self.default.y0 + 40 - i * y, // curCircleY - 2,
                text: '__',
              },
              {
                x: x - 25, // x - 35,
                y: self.default.y0 + 40 + 10 - i * y, // curCircleY + 15
                text: gameOperation === 'minus' ? '-' : '',
              },
            ];
          }
          font = { ...font, font: 'bold ' + font.font, fill: lineColor };

          const fractionPartsList = [];
          for (let cur in curFractionItems) {
            fractionPartsList.push(
              game.add.text(
                curFractionItems[cur].x,
                curFractionItems[cur].y,
                curFractionItems[cur].text,
                font
              )
            );
          }

          curBlock.labels = fractionPartsList;
        }
      }

      // Will be used as a counter in update, adding in the width of each stacked block to check if the end matches the floor selected position
      self.blocks.stack.curBlockEnd =
        self.default.x0 + self.blocks.stack.list[0].width * direc;

      // Check for errors (level too easy for its difficulty or end position out of bounds)
      if (
        !hasBaseDifficulty ||
        (gameOperation == 'plus' &&
          (self.blocks.floor.correctXA < self.default.x0 + self.default.width ||
            self.blocks.floor.correctXA >
              self.default.x0 + 8 * self.default.width)) ||
        (gameOperation == 'minus' &&
          (self.blocks.floor.correctXA <
            self.default.x0 - 8 * self.default.width ||
            self.blocks.floor.correctXA > self.default.x0 - self.default.width))
      ) {
        restart = true; // If any error is found restart the level
      }

      if (isDebugMode)
        console.log(
          'Stacked blocks: ' +
            total +
            ' (min: ' +
            (curMapPosition + 2) +
            ', max: ' +
            max +
            ')'
        );

      return restart;
    },
    /**
     * Create floor blocks for the level in create()
     */
    renderFloorBlocks: function (direc, lineColor) {
      // For each floor block
      const divisor = gameDifficulty == 3 ? 4 : gameDifficulty; // Make sure valid divisors are 1, 2 and 4 (not 3)

      let total = 8 * divisor; // Number of floor blocks

      const blockWidth = self.default.width / divisor; // Width of each floor block

      // If game is type (b), selectiong a random floor x position
      if (gameMode == 'b') {
        self.blocks.stack.correctIndex = game.math.randomInRange(
          0,
          self.blocks.stack.list.length - 1
        ); // Correct stacked index

        self.blocks.floor.correctXB =
          self.default.x0 + self.default.width * direc;

        for (let i = 0; i <= self.blocks.stack.correctIndex; i++) {
          self.blocks.floor.correctXB +=
            self.blocks.stack.list[i].width * direc; // Equivalent x position on the floor
        }
      }

      let flag = true;

      for (let i = 0; i < total; i++) {
        // For each floor block
        // 'x' coordinate for floor block
        const x =
          self.default.x0 + (self.default.width + i * blockWidth) * direc;

        if (flag && gameMode == 'a') {
          if (
            (gameOperation == 'plus' && x >= self.blocks.floor.correctXA) ||
            (gameOperation == 'minus' && x <= self.blocks.floor.correctXA)
          ) {
            self.blocks.floor.correctIndex = i - 1; // Set index of correct floor block
            flag = false;
          }
        }

        if (gameMode == 'b') {
          if (
            (gameOperation == 'plus' && x >= self.blocks.floor.correctXB) ||
            (gameOperation == 'minus' && x <= self.blocks.floor.correctXB)
          ) {
            total = i;
            break;
          }
        }

        // Create floor block
        const lineSize = 0.9;
        const block = game.add.geom.rect(
          x,
          self.default.y0 + 17 + self.default.height - lineSize,
          blockWidth - lineSize,
          self.default.height - lineSize,
          colors.blue,
          lineSize,
          colors.blueBgInsideLevel,
          1
        );
        const anchor = gameOperation == 'minus' ? 1 : 0;
        block.anchor(anchor, 0);

        // If game is type (a), adding events to floor blocks
        if (gameMode == 'a') {
          block.alpha = 0.5;
          block.index = i;
        }

        // Add current label to group of labels
        self.blocks.floor.list.push(block);
      }

      if (gameMode == 'a')
        self.blocks.floor.correctX = self.blocks.floor.correctXA;
      else if (gameMode == 'b')
        self.blocks.floor.correctX = self.blocks.floor.correctXB;

      // Creates labels on the floor to display the numbers
      for (let i = 0; i <= 8; i++) {
        const x = self.default.x0 + (i + 1) * self.default.width * direc;
        const y = self.default.y0 + self.default.height + 80 * 1.5;
        game.add.geom
          .circle(x, y, 60, undefined, 0, colors.white, 0.6)
          .anchor(0, 0.25);
        game.add.text(
          gameOperation === 'minus' ? x - 2 : x,
          y,
          gameOperation === 'minus' ? -i : i,
          {
            ...textStyles.h3_,
            font: 'bold ' + textStyles.h3_.font,
            fill: lineColor,
          }
        );
      }
    },
    renderCharacters: function () {
      self.tractor = game.add.sprite(
        self.default.x0,
        self.default.y0,
        'tractor',
        0,
        1.2
      );

      if (gameOperation == 'plus') {
        self.tractor.anchor(1, 0.5);
        self.tractor.animation = ['move', [0, 1, 2, 3, 4], 4];
      } else {
        self.tractor.anchor(0, 0.5);
        self.tractor.animation = ['move', [5, 6, 7, 8, 9], 4];
        self.tractor.curFrame = 5;
      }
    },
    renderAuxiliarUI: function (direc) {
      // Help pointer
      self.help = game.add.image(0, 0, 'pointer', 1.7, 0);
      //self.help.anchor(0.5, 0);

      // Selection Arrow
      if (gameMode == 'a') {
        self.arrow = game.add.image(
          self.default.x0 + self.default.width * direc,
          self.default.y0 + 35,
          'arrow_down',
          1.5
        );
        self.arrow.anchor(0.5, 0.5);
        self.arrow.alpha = 0.5;
      }

      // Intro text
      self.message = [];
      self.message.push(
        game.add.text(
          context.canvas.width / 2,
          170,
          game.lang.squareOne_intro1,
          textStyles.h1_
        )
      );
      self.message.push(
        game.add.text(
          context.canvas.width / 2,
          220,
          game.lang.squareOne_intro2,
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
    animateTruck: () => {
      const stack = self.blocks.stack;
      const floor = self.blocks.floor;

      // MANAGE HORIZONTAL MOVEMENT

      // Move 'tractor'
      self.tractor.x += self.animation.speed;

      // Move 'stacked blocks'
      for (let i in stack.list) {
        stack.list[i].x += self.animation.speed;
      }

      // MANAGE BLOCKS AND FLOOR GAPS
      // If block is 1/n (not 1/1) there's an extra block space to go through before the start of next block
      const restOfCurBlock =
        (self.default.width - stack.list[stack.curIndex].width) *
        self.control.direc;

      // Check if block falls
      if (
        (gameOperation == 'plus' &&
          stack.list[0].x >= stack.curBlockEnd + restOfCurBlock) ||
        (gameOperation == 'minus' &&
          stack.list[0].x <= stack.curBlockEnd + restOfCurBlock)
      ) {
        let lowerBlock = true;

        const curEnd =
          stack.list[0].x +
          stack.list[stack.curIndex].width * self.control.direc;

        // If current index is (a) last stacked index (correct index - fixed)
        // If current index is (b) selected stacked index
        if (stack.curIndex == stack.index) {
          // floor.index : (a) selected floor index
          // floor.index : (b) last floor index (correct index - fixed)
          const selectedEnd =
            floor.list[floor.index].x +
            floor.list[0].width * self.control.direc;

          // (a) last stacked block (fixed) doesnt fit selected gap AKA NOT ENOUGH FLOOR BLOCKS (DOESNT CHECK TOO MANY)
          // (b) selected stacked index doesnt fit last floor gap (fixed) AKA TOO MANY STACKED BLOCKS (DOESNT CHECK NOT ENOUGH)
          if (
            (gameOperation == 'plus' && curEnd > selectedEnd) ||
            (gameOperation == 'minus' && curEnd < selectedEnd)
          ) {
            lowerBlock = false;
          }
        } else {
          // Update to next block end
          stack.curBlockEnd +=
            stack.list[stack.curIndex + 1].width * self.control.direc;
        }

        // Fill floor gap
        if (lowerBlock) {
          // Until (a) selected floor index
          // Until (b) last floor index (correct index - fixed)
          // Updates floor index to be equivalent to stacked index (and change alpha so floor appears to be filled)
          for (let i = 0; i <= floor.index; i++) {
            if (
              (gameOperation == 'plus' && floor.list[i].x < curEnd) ||
              (gameOperation == 'minus' && floor.list[i].x > curEnd)
            ) {
              floor.list[i].alpha = 0.2;
              floor.curIndex = i;
            }
          }

          // Lower
          stack.list[stack.curIndex].alpha = 0;
          stack.list.forEach((cur) => {
            cur.y += self.default.height - 2;
          }); // Lower stacked blocks
        }

        stack.curIndex++;
      }

      // WHEN REACHED END POSITION
      if (stack.curIndex > stack.index || floor.curIndex == floor.index) {
        self.animation.animateTruck = false;
        self.control.checkAnswer = true;
      }
    },
    checkAnswer: () => {
      game.timer.stop();

      game.animation.stop(self.tractor.animation[0]);

      if (gameMode == 'a') {
        self.control.isCorrect =
          self.blocks.floor.index == self.blocks.floor.correctIndex;
      } else {
        self.control.isCorrect =
          self.blocks.stack.index == self.blocks.stack.correctIndex;
      }

      // Give feedback to player and turns on sprite animation
      if (self.control.isCorrect) {
        // Correct answer
        game.animation.play(self.tractor.animation[0]);

        // Displays feedback image and sound
        game.add
          .image(
            context.canvas.width / 2,
            context.canvas.height / 2,
            'answer_correct'
          )
          .anchor(0.5, 0.5);
        if (audioStatus) game.audio.okSound.play();

        completedLevels++; // Increases number os finished levels
        if (isDebugMode) console.log('Completed Levels: ' + completedLevels);
      } else {
        // Incorrect answer
        // Displays feedback image and sound
        game.add
          .image(
            context.canvas.width / 2,
            context.canvas.height / 2,
            'answer_wrong'
          )
          .anchor(0.5, 0.5);
        if (audioStatus) game.audio.errorSound.play();
      }

      self.fetch.postScore();

      // AFTER CHECK ANSWER
      self.control.checkAnswer = false;
      self.animation.animateEnding = true;
    },
    animateEnding: () => {
      // ANIMATE ENDING

      self.control.count++;

      // If CORRECT ANSWER runs final tractor animation (else tractor desn't move, just wait)
      if (self.control.isCorrect) self.tractor.x += self.animation.speed;

      // WHEN REACHED END POSITION calls map state
      if (self.count >= 140) {
        // If CORRECT ANSWER, player goes to next level in map
        if (self.control.isCorrect) canGoToNextMapPosition = true;
        else canGoToNextMapPosition = false;

        game.state.start('map');
      }
    },

    // INFORMATION
    /**
     * Display correct answer
     */
    showAnswer: function () {
      if (!self.control.hasClicked) {
        // On gameMode (a)
        if (gameMode == 'a') {
          const aux = self.blocks.floor.list[0];
          self.help.x =
            self.blocks.floor.correctX - (aux.width / 2) * self.control.direc;
          self.help.y = 501;
          // On gameMode (b)
        } else {
          const aux = self.blocks.stack.list[self.blocks.stack.correctIndex];
          self.help.x = aux.x + (aux.width / 2) * self.control.direc;
          self.help.y = aux.y;
        }

        self.help.alpha = 0.7;
      }
    },
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

    // HANDLERS
    /**
     * Function called by self.events.onInputDown() when player clicks on a valid rectangle.
     */
    clickSquareHandler: function () {
      if (!self.control.hasClicked && !self.animation.animateEnding) {
        document.body.style.cursor = 'auto';

        // On gameMode (a)
        if (gameMode == 'a') {
          // Turns selection arrow completely visible
          self.arrow.alpha = 1;

          // Make the unselected blocks invisible (look like there's only the ground)
          for (let i in self.blocks.floor.list) {
            // (SELECTION : self.blocks.floor.index)
            if (i > self.blocks.floor.index)
              self.blocks.floor.list[i].alpha = 0; // Make unselected 'floor' blocks invisible
          }

          // (FIXED : self.blocks.stack.index) save the 'stacked' blocks index
          self.blocks.stack.index = self.blocks.stack.list.length - 1;
          // On gameMode (b)
        } else {
          for (let i in self.blocks.stack.list) {
            // (FIXED : self.blocks.stack.index)
            if (i > self.blocks.stack.index)
              self.blocks.stack.list[i].alpha = 0; // Make unselected 'stacked' blocks invisible
          }

          // (SELECTION : self.blocks.floor.index) save the 'floor' blocks index to compare to the stacked index in update
          self.blocks.floor.index = self.blocks.floor.list.length - 1;

          // Save the updated total stacked blocks to compare in update
          self.blocks.stack.list.length = self.blocks.stack.index + 1;
        }

        // Play beep sound
        if (audioStatus) game.audio.popSound.play();

        // Hide labels
        if (showFractions) {
          self.blocks.stack.list.forEach((block) => {
            block.labels.forEach((label) => {
              label.alpha = 0;
            });
          });
        }
        // Hide solution pointer
        if (self.help != undefined) self.help.alpha = 0;

        // Turn tractir animation on
        game.animation.play(self.tractor.animation[0]);

        self.control.hasClicked = true;
        self.animation.animateTruck = true;
      }
    },
    /**
     * Function called by self.events.onInputOver() when cursor is over a valid rectangle
     *
     * @param {object} cur rectangle the cursor is over
     */
    overSquareHandler: function (cur) {
      if (!self.control.hasClicked) {
        document.body.style.cursor = 'pointer';

        // On gameMode (a)
        if (gameMode == 'a') {
          for (let i in self.blocks.floor.list) {
            self.blocks.floor.list[i].alpha = i <= cur.index ? 1 : 0.5;
          }

          // Saves the index of the selected 'floor' block
          self.blocks.floor.index = cur.index;

          // On gameMode (b)
        } else {
          for (let i in self.blocks.stack.list) {
            self.blocks.stack.list[i].alpha = i <= cur.index ? 0.5 : 0.2;
          }

          // Saves the index of the selected 'stack' block
          self.blocks.stack.index = cur.index;
        }
      }
    },
    /**
     * Function called by self.events.onInputOver() when cursos is out of a valid rectangle
     */
    outSquareHandler: function () {
      if (!self.control.hasClicked) {
        document.body.style.cursor = 'auto';

        // On game mode (a)
        if (gameMode == 'a') {
          for (let i in self.blocks.floor.list) {
            self.blocks.floor.list[i].alpha = 0.5; // Back to normal
          }

          self.blocks.floor.index = -1;
          // On game mode (b)
        } else {
          for (let i in self.blocks.stack.list) {
            self.blocks.stack.list[i].alpha = 0.5; // Back to normal
          }

          self.blocks.stack.index = -1;
        }
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

      if (gameMode == 'a') {
        self.blocks.floor.list.forEach((cur) => {
          if (game.math.isOverIcon(x, y, cur))
            self.utils.clickSquareHandler(cur);
        });
      } else {
        self.blocks.stack.list.forEach((cur) => {
          if (game.math.isOverIcon(x, y, cur))
            self.utils.clickSquareHandler(cur);
        });
      }

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

      if (gameMode == 'a') {
        // Make arrow follow mouse
        if (!self.control.hasClicked && !self.animation.animateEnding) {
          if (
            game.math.distanceToPointer(self.arrow.x, x, self.arrow.y, y) > 8
          ) {
            self.arrow.x = x < 250 ? 250 : x; // Limits the arrow left position to 250
          }
        }

        self.blocks.floor.list.forEach((cur) => {
          if (game.math.isOverIcon(x, y, cur)) {
            flagA = true;
            self.utils.overSquareHandler(cur);
          }
        });

        if (!flagA) self.utils.outSquareHandler('a');
      }

      if (gameMode == 'b') {
        self.blocks.stack.list.forEach((cur) => {
          if (game.math.isOverIcon(x, y, cur)) {
            flagB = true;
            self.utils.overSquareHandler(cur);
          }
        });

        if (!flagB) self.utils.outSquareHandler('b');
      }

      navigation.onInputOver(x, y);

      game.render.all();
    },
  },

  fetch: {
    /**
     * Saves players data after level ends - to be sent to database <br>
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
        '&line_oper=' +
        gameOperation +
        '&line_leve=' +
        gameDifficulty +
        '&line_posi=' +
        curMapPosition +
        '&line_resu=' +
        self.control.isCorrect +
        '&line_time=' +
        game.timer.elapsed +
        '&line_deta=' +
        'numBlocks:' +
        self.blocks.stack.list.length +
        ', valBlocks: ' +
        self.control.divisorsList + // Ends in ','
        ' blockIndex: ' +
        self.blocks.stack.index +
        ', floorIndex: ' +
        self.blocks.floor.index;

      // FOR MOODLE
      sendToDatabase(data);
    },
  },
};
