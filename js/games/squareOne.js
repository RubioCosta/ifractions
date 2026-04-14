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
  control: undefined, // level related data
  default: undefined, // level related default values

  ui: undefined, // graphic elements
  animation: undefined, // animation control
  tractor: undefined,

  stack: undefined, // stack blocks info
  floor: undefined, // floor blocks info

  /**
   * Main code
   */
  create: function () {
    const truckWidth = 201;
    const divisor = gameDifficulty == 3 ? 4 : gameDifficulty; // Make sure valid divisors are 1, 2 and 4 (not 3)
    let lineColor = undefined;
    let fillColor = undefined;
    if (gameOperation === 'minus') {
      lineColor = colors.red;
      fillColor = colors.redLight;
    } else {
      lineColor = colors.green;
      fillColor = colors.greenLight;
    }

    this.ui = {
      arrow: undefined,
      help: undefined,
      message: undefined,
      challenge: {},
      explanation: {
        button: undefined,
        text: undefined,
      },
    };
    this.control = {
      direc: gameOperation == 'minus' ? -1 : 1, // Will be multiplied to values to easily change tractor direction when needed
      divisorsList: '', // Hold the divisors for each fraction on stacked blocks (created for postScore())
      lineWidth: 3,

      hasClicked: false, // Checks if player 'clicked' on a block
      checkAnswer: false, // When true allows game to run 'check answer' code in update
      isCorrect: false, // Checks player 'answer'

      count: 0, // An 'x' position counter used in the tractor animation

      showChallenge: false, // When true, challenge modal is displayed (blocks interaction gated)
      showExplanation: false, // When true, explanation modal is displayed at end of level
      challengeAnsweredYes: null, // null = not yet answered, true = accepted challenge
    };
    this.animation = {
      animateTractor: false, // When true allows game to run 'tractor animation' code in update (turns animation of the moving tractor ON/OFF)
      animateEnding: false, // When true allows game to run 'tractor ending animation' code in update (turns 'ending' animation of the moving tractor ON/OFF)
      speed: 2 * this.control.direc, // X distance in which the tractor moves in each iteration of the animation
    };
    this.default = {
      width: 172, // Base block width,
      height: 70, // Base block height
      x0:
        gameOperation == 'minus'
          ? context.canvas.width - truckWidth
          : truckWidth, // Initial 'x' coordinate for the tractor and stacked blocks
      y0: context.canvas.height - game.image['floor_grass'].width * 1.5,
    };
    this.default.arrowX0 =
      self.default.x0 + self.default.width * self.control.direc;
    this.default.arrowXEnd =
      self.default.arrowX0 + self.default.width * self.control.direc * 8;

    renderBackground();

    // FOR MOODLE
    if (moodle) {
      navigation.add.right(['audio']);
    } else {
      navigation.add.left(['back', 'menu', 'show_answer'], 'customMenu');
      navigation.add.right(['audio']);
    }

    this.stack = {
      list: [],
      /**
       * (a) all blocks (fixed) (random)
       * (b) (updates) user selection
       */
      selectedIndex: undefined,
      /**
       * (a) UNDEFINED
       * (b) subsection of blocks (fixed) (random)
       */
      correctIndex: undefined,
      /**
       * (a/b) (updates) cur index (for animation/check control)
       *
       * initial value: 0
       */
      curIndex: 0,
      /**
       * (a/b) (updates) end of current stack block x coord
       */
      curBlockEndX: undefined,
    };
    this.floor = {
      list: [],
      /**
       * (a) (updates) user selection
       * (b) subsection of floor blocks (fixed) (generated)
       */
      selectedIndex: undefined,
      /**
       * (a) correct floor index - equiv to all in STACK
       * (b) UNDEFINED
       */
      correctIndex: undefined,
      /**
       * (a/b) (updates) cur index (for animation/check control)
       *
       * initial value: -1
       */
      curIndex: -1,
      /**
       * (a) correct floor x coord - equiv to all in STACK
       * (b) generated floor x coord - equiv to correct in STACK (fixed) (generated)
       */
      correctX: undefined,
    };

    let [restart, correctXA] = this.utils.renderStackedBlocks(
      this.control.direc,
      lineColor,
      fillColor,
      this.control.lineWidth,
      divisor
    );

    this.utils.renderFloorBlocks(
      this.control.direc,
      lineColor,
      this.control.lineWidth,
      divisor,
      correctXA
    );
    this.utils.renderCharacters();
    this.restart = restart;
    this.utils.renderChallengeUI();
    // Events added now so challenge button is clickable; game block interaction gated by showChallenge flag
    game.event.add('click', this.events.onInputDown);
    game.event.add('mousemove', this.events.onInputOver);
  },

  /**
   * Game loop
   */
  update: function () {
    // Starts tractor animation
    if (self.animation.animateTractor) {
      self.utils.animateTractorHandler();
    }

    // Check answer after animation ends
    if (self.control.checkAnswer) {
      self.utils.checkAnswerHandler();
    }

    // Starts tractor moving animation
    if (self.animation.animateEnding) {
      self.utils.animateEndingHandler();
    }

    game.render.all();
  },

  utils: {
    // RENDER
    /**
     * Create stacked blocks for the level in create()
     */
    renderStackedBlocks: (direc, lineColor, fillColor, lineWidth, divisor) => {
      let restart = false;
      let hasBaseDifficulty = false; // Will be true after next for loop if level has at least one '1/difficulty' fraction (if false, restart)
      const max = gameMode == 'b' ? 10 : curMapPosition + 4; // Maximum # of stacked blocks for the level
      const total = game.math.randomInRange(curMapPosition + 2, max); // Total # of stacked blocks for the level

      const renderLabels = (curDivisor, x, y, i, curBlock) => {
        let font, curFractionItems;
        const fractionPartsList = [];

        if (curDivisor === 1) {
          font = textStyles.h2_;
          curFractionItems = [
            {
              x: x,
              y: self.default.y0 - i * y - 20,
              text: '1',
            },
            {
              x: x - 25,
              y: self.default.y0 - i * y - 27,
              text: gameOperation === 'minus' ? '-' : '',
            },
            null,
          ];
        } else {
          font = textStyles.p_;
          curFractionItems = [
            {
              x: x,
              y: self.default.y0 - i * y - 40,
              text: '1\n' + curDivisor,
            },
            {
              x: x - 25,
              y: self.default.y0 - i * y - 27,
              text: gameOperation === 'minus' ? '-' : '',
            },
            {
              x0: x,
              y: self.default.y0 - i * y - 35,
              x1: x + 25,
              lineWidth: 2,
              color: lineColor,
            },
          ];
        }
        font = { ...font, font: 'bold ' + font.font, fill: lineColor };

        for (let i = 0; i < 2; i++) {
          const item = game.add.text(
            curFractionItems[i].x,
            curFractionItems[i].y,
            curFractionItems[i].text,
            font
          );
          item.lineHeight = 30;
          fractionPartsList.push(item);
        }

        if (curFractionItems[2]) {
          const line = game.add.geom.line(
            curFractionItems[2].x0,
            curFractionItems[2].y,
            curFractionItems[2].x1,
            curFractionItems[2].y,
            curFractionItems[2].lineWidth,
            curFractionItems[2].color
          );
          line.anchor(0.5, 0);
          fractionPartsList.push(line);
        } else {
          fractionPartsList.push(null);
        }

        curBlock.fraction = {
          labels: fractionPartsList,
          nominator: direc,
          denominator: curDivisor,
        };

        if (!showFractions) {
          curBlock.fraction.labels.forEach((label) => {
            if (label) label.alpha = 0;
          });
        }
      };
      const shouldRestart = (hasBaseDifficulty, correctXA) => {
        if (
          !hasBaseDifficulty ||
          (gameOperation == 'plus' &&
            (correctXA < self.default.x0 + self.default.width ||
              correctXA > self.default.x0 + 8 * self.default.width)) ||
          (gameOperation == 'minus' &&
            (correctXA < self.default.x0 - 8 * self.default.width ||
              correctXA > self.default.x0 - self.default.width))
        )
          return true;
        return false;
      };

      let correctXA = self.default.x0 + self.default.width * direc; // Equivalent x coordinate on the floor

      // Render blocks
      for (let i = 0; i < total; i++) {
        let curDivisor = game.math.randomInRange(1, gameDifficulty); // Set divisor for current fraction
        if (curDivisor === gameDifficulty) hasBaseDifficulty = true;
        if (curDivisor === 3) curDivisor = 4; // Make sure valid divisors are 1, 2 and 4 (not 3)

        const curBlockWidth = self.default.width / curDivisor; // Current width is a fraction of the default
        self.control.divisorsList += curDivisor + ','; // Documenting list of divisors (for postScore())
        correctXA += curBlockWidth * direc;

        const curBlock = game.add.geom.rect(
          self.default.x0,
          self.default.y0 - i * self.default.height - lineWidth,
          curBlockWidth,
          self.default.height,
          fillColor,
          1,
          lineColor,
          lineWidth
        );
        curBlock.anchor(gameOperation === 'minus' ? 1 : 0, 1);
        curBlock.blockValue = divisor / curDivisor;

        // If game mode is (b), add events to stacked blocks
        if (gameMode === 'b') curBlock.blockIndex = i;

        // Add to stack blocks list
        self.stack.list.push(curBlock);

        // If 'show fractions' is turned on, create labels that display the fractions on the side of each block
        const x = self.default.x0 + (curBlockWidth + 40) * direc;
        const y = self.default.height + 1;
        renderLabels(curDivisor, x, y, i, curBlock);
      }

      // Computer generated correct stack index
      if (gameMode === 'a') self.stack.selectedIndex = total - 1;

      // Will be used as a counter in update, adding in the width of each stacked block to check if the end matches the floor selected position
      // initial value is end of current block
      self.stack.curBlockEndX =
        self.default.x0 + self.stack.list[0].width * direc;

      // Check for errors (level too easy for its difficulty or end position out of bounds)
      restart = shouldRestart(hasBaseDifficulty, correctXA);

      if (isDebugMode) {
        console.log(
          `------------------------------
            \nGame Map Position: ${curMapPosition} 
            \n------------------------ setup stack 
            \nMin blocks (curMapPosition + 2): ${curMapPosition + 2}
            ${
              gameMode === 'a'
                ? `\nMax blocks (A mode) (curMapPosition + 4):  ${
                    curMapPosition + 4
                  }`
                : '\nMax blocks (B mode): 10'
            } 
            \nTotal blocks (random min..max): ${total} 
            \nPossible divisors (random 1..gameDifficulty / if 3 then 4): 1..${
              gameDifficulty == 3 ? 4 : gameDifficulty
            } 
            \n(Checks if has 1/diff or floor x is out of bounds)
            `
        );

        if (restart) console.log('Error during level setup. Retrying...');
        else console.log('Successfull level setup!');
      }

      return [restart, correctXA];
    },
    /**
     * Create floor blocks for the level in create()
     */
    renderFloorBlocks: (direc, lineColor, lineWidth, divisor, correctXA) => {
      let correctXB = 0;
      let total = 8 * divisor; // Number of floor blocks
      const blockWidth = self.default.width / divisor; // Width of each floor block

      const renderLabels = () => {
        for (let i = 0; i <= 8; i++) {
          const x = self.default.x0 + (i + 1) * self.default.width * direc;
          const y = self.default.y0 + self.default.height + 45 - 65;

          let numberX = x;
          let numberText = i;
          let numberCircleSize = 45;
          let numberFont = {
            ...textStyles.h3_,
            fill: lineColor,
            font: 'bold ' + textStyles.h3_.font,
          };
          if (gameOperation === 'minus') {
            numberX = i !== 0 ? x - 2 : x;
            numberText = -i;
            numberCircleSize = 45;
            numberFont.font = 'bold ' + textStyles.h4_.font;
          }

          game.add.geom
            .circle(x, y, numberCircleSize, undefined, 0, colors.white, 1)
            .anchor(0, 0.25);
          game.add.text(numberX, y + 2, numberText, numberFont);
        }
      };

      // If game is type (b), select a random floor x position
      if (gameMode === 'b') {
        self.stack.correctIndex = game.math.randomInRange(
          0,
          self.stack.list.length - 1
        ); // Correct stacked index

        correctXB = self.default.x0 + self.default.width * direc;

        for (let i = 0; i <= self.stack.correctIndex; i++) {
          correctXB += self.stack.list[i].width * direc; // Equivalent x position on the floor
        }
      }

      // Render floor blocks
      for (let i = 0, shouldUpdateIndex = true; i < total; i++) {
        const curX =
          self.default.x0 + (self.default.width + i * blockWidth) * direc;

        // If game is type (a), iterate until find equivalent floor index
        if (gameMode === 'a' && shouldUpdateIndex) {
          if (
            (gameOperation == 'plus' && curX >= correctXA) ||
            (gameOperation == 'minus' && curX <= correctXA)
          ) {
            self.floor.correctIndex = i - 1; // Set index of correct floor block
            shouldUpdateIndex = false;
          }
        }

        // If game is type (b), stop iterating after find equivalent floor block
        if (gameMode === 'b') {
          if (
            (gameOperation == 'plus' && curX >= correctXB) ||
            (gameOperation == 'minus' && curX <= correctXB)
          ) {
            total = i;
            break;
          }
        }

        // Render floor block
        const curBlock = game.add.geom.rect(
          curX,
          self.default.y0,
          blockWidth,
          self.default.height + 10,
          colors.blueBgInsideLevel,
          1,
          colors.gray,
          lineWidth
        );
        const anchor = gameOperation == 'minus' ? 1 : 0;
        curBlock.anchor(anchor, 0);
        curBlock.blockValue = 1;

        // If game is type (a), add events to floor blocks
        if (gameMode === 'a') {
          curBlock.fillColor = 'transparent';
          curBlock.blockIndex = i;
        }

        // Add current block to list
        self.floor.list.push(curBlock);
      }

      if (gameMode === 'b') {
        self.floor.selectedIndex = total - 1; // Computer generated correct floor index
        self.floor.correctX = correctXB;
      } else {
        self.floor.correctX = correctXA;
      }

      // Creates labels on the floor to display the numbers
      renderLabels();

      if (isDebugMode) {
        console.log(
          `------------------------ setup floor
            \nDivisor (gameDifficulty / if 3 then 4): ${divisor}
            ${
              gameMode === 'a'
                ? `\nTotal blocks (A) (divisor * 8): ${divisor} * 8 = ${
                    divisor * 8
                  }`
                : `\nTotal blocks (B) (((equiv. to stack))): ${self.floor.list.length}`
            }
            ${
              gameMode === 'a'
                ? `\nCorrect index (A) (((equival. to stack))): ${self.floor.correctIndex}`
                : ''
            }
            `
        );
      }
    },
    renderCharacters: () => {
      self.tractor = game.add.sprite(
        self.default.x0,
        self.default.y0,
        'tractor',
        0,
        1
      );

      if (gameOperation == 'plus') {
        self.tractor.anchor(1, 1);
        self.tractor.animation = ['move', [0, 1, 2, 3, 4], 4];
      } else {
        self.tractor.anchor(0, 1);
        self.tractor.animation = ['move', [5, 6, 7, 8, 9], 4];
        self.tractor.curFrame = 5;
      }
    },
    renderChallengeUI: () => {
      const cx = context.canvas.width / 2;
      const withNewlines = (s) => (s == null ? '' : String(s).replace(/\\n/g, '\n'));
      const FRAC_UNICODE = { 1: '1', 2: '\u00BD', 4: '\u00BC' };

      // challenge-card.png is 2544×396px; scale 0.27 → 687×107px
      const ribbonScale = 0.27;
      const ribbonH = Math.round(396 * ribbonScale); // ≈ 107px
      const ribbonY = 30;

      // Challenge ribbon image at top center
      self.ui.challenge.image = game.add.image(cx, ribbonY, 'challenge-card', ribbonScale, 1);
      self.ui.challenge.image.anchor(0.5, 0);

      // Title overlaid on ribbon (nudged down slightly to visual center of ribbon)
      const ribbonCenterY = ribbonY + ribbonH / 2 + 8;
      self.ui.challenge.title = game.add.text(
        cx, ribbonCenterY,
        withNewlines(game.lang.s1_challenge_title),
        { ...textStyles.h2_, fill: colors.white, font: 'bold ' + textStyles.h2_.font }
      );
      self.ui.challenge.title.anchor(0.5, 0.5);

      // Subtitle lines below the ribbon
      const ribbonBottom = ribbonY + ribbonH;
      const subtitleLines = withNewlines(game.lang.s1_challenge_subtitle).split('\n');
      self.ui.challenge.subtitleTop = game.add.text(
        cx, ribbonBottom + 48,
        subtitleLines[0] || '',
        { ...textStyles.h4_, fill: colors.blueDark, font: 'bold ' + textStyles.h4_.font }
      );
      self.ui.challenge.subtitleTop.anchor(0.5, 0.5);

      self.ui.challenge.subtitleBottom = game.add.text(
        cx, ribbonBottom + 100,
        subtitleLines.slice(1).join('\n'),
        { ...textStyles.h3_, fill: colors.blue }
      );
      self.ui.challenge.subtitleBottom.anchor(0.5, 0.5);

      // "Blocos a carregar:" label above the stacked blocks
      const stackTopY = self.default.y0 - self.stack.list.length * self.default.height;
      // Center label over the block stack (x0 is the edge; blocks extend inward by direc)
      const labelX = self.default.x0 + self.default.width / 2 * self.control.direc;
      self.ui.challenge.blocksLabel = game.add.text(
        labelX, stackTopY - 50,
        withNewlines(game.lang.s1_blocks_label),
        { ...textStyles.h4_, fill: colors.blueDark, font: 'bold ' + textStyles.h4_.font }
      );
      self.ui.challenge.blocksLabel.anchor(0.5, 0.5);

      // question-mark-with-arrow.png is 1230×864px; scale 0.20 → 246×173px
      // Placed at the correct floor hole position, bottom of image at floor level
      const holeIdx = gameMode === 'b' ? self.floor.selectedIndex : self.floor.correctIndex;
      const correctFloorBlock = self.floor.list[holeIdx];
      const markerX = correctFloorBlock
        ? correctFloorBlock.x + (correctFloorBlock.width / 2) * (gameOperation === 'minus' ? -1 : 1)
        : cx;
      self.ui.challenge.holeMarker = game.add.image(
        markerX, self.default.y0 - 10,
        'question-mark-with-arrow',
        0.20, 1
      );
      self.ui.challenge.holeMarker.anchor(0.5, 1);

      // Question card – right half, moved up from center
      const cardW = 520; const cardH = 260;
      const cardX = cx + (gameOperation === 'minus' ? -200 : 200);
      const cardY = context.canvas.height / 2 - 80;
      self.ui.challenge.card = game.add.geom.rect(
        cardX, cardY, cardW, cardH, colors.white, 0.95, colors.blueMenuLine, 4
      );
      self.ui.challenge.card.anchor(0.5, 0.5);

      // Question text: split into two lines at the midpoint word to fit inside card
      const rawQuestion = withNewlines(game.lang.s1_challenge_question);
      const qWords = rawQuestion.replace(/\n/g, ' ').split(' ');
      const mid = Math.ceil(qWords.length / 2);
      const questionWrapped = qWords.slice(0, mid).join(' ') + '\n' + qWords.slice(mid).join(' ');
      self.ui.challenge.question = game.add.text(
        cardX, cardY - 65,
        questionWrapped,
        { ...textStyles.h3_, fill: colors.blueDark, font: 'bold ' + textStyles.h3_.font }
      );
      self.ui.challenge.question.anchor(0.5, 0.5);

      // Fraction equation: "1 + ½ + ... =" as text, then circle — group centered at cardX
      // Show only the blocks that will fill the hole (0 → stack.correctIndex) in both modes
      const stackEndIdx = self.stack.correctIndex ?? (self.stack.list.length - 1);
      const equationParts = self.stack.list.slice(0, stackEndIdx + 1).map(block => {
        const den = block.fraction.denominator;
        return FRAC_UNICODE[den] ?? `1/${den}`;
      });
      const circleScale = 0.20;
      const circleR = 35;
      const gap = 10;
      const eqStyle = { ...textStyles.h3_, fill: colors.blueDark };
      const maxW = cardW - 80; // max group width before wrapping

      context.save();
      context.font = '38px Arial, sans-serif';

      const isMinus = gameOperation === 'minus';
      const eqSep   = isMinus ? ' - ' : ' + ';
      const eqFirst = isMinus ? '-' + equationParts[0] : equationParts[0];
      const eqRest  = equationParts.slice(1).join(eqSep);
      const eqBody  = eqFirst + (eqRest ? eqSep + eqRest : '');
      const fullStr = eqBody + ' =';
      const fullW = context.measureText(fullStr).width;

      if (fullW + gap + circleR * 2 <= maxW) {
        // Single line — group centered at cardX
        const eqY = cardY + 42;
        const textX = cardX - gap / 2 - circleR;
        const circleX = cardX + fullW / 2 + gap / 2;
        self.ui.challenge.equation = game.add.text(textX, eqY, fullStr, eqStyle);
        self.ui.challenge.equationCircle = game.add.image(circleX, eqY - 14, 'circular-question', circleScale, 1);
        self.ui.challenge.equationCircle.anchor(0.5, 0.5);
      } else {
        // Two lines — split parts roughly in half
        const mid = Math.ceil(equationParts.length / 2);
        const line1Parts = isMinus
          ? '-' + equationParts[0] + (mid > 1 ? eqSep + equationParts.slice(1, mid).join(eqSep) : '')
          : equationParts.slice(0, mid).join(eqSep);
        const line1Str = line1Parts + eqSep.trimEnd();
        const line2Str = equationParts.slice(mid).join(eqSep) + ' =';
        const line2W = context.measureText(line2Str).width;

        const line1Y = cardY + 28;
        const line2Y = cardY + 68;

        // Both lines centered at cardX; circle goes right of line 2 text
        self.ui.challenge.equation = game.add.text(cardX, line1Y, line1Str, eqStyle);
        self.ui.challenge.equationLine2 = game.add.text(cardX, line2Y, line2Str, eqStyle);
        const line2CircleX = cardX + line2W / 2 + gap + circleR;
        self.ui.challenge.equationCircle = game.add.image(line2CircleX, line2Y - 14, 'circular-question', circleScale, 1);
        self.ui.challenge.equationCircle.anchor(0.5, 0.5);
      }

      context.restore();

      // Accept button – directly below the card
      const btnW = cardW; const btnH = 90;
      const btnY = cardY + cardH / 2 + 65;
      self.ui.challenge.button = game.add.geom.rect(cardX, btnY, btnW, btnH, '#e09800', 1);
      self.ui.challenge.button.anchor(0.5, 0.5);
      self.ui.challenge.buttonText = game.add.text(
        cardX, btnY + 14,
        withNewlines(game.lang.s1_challenge_accept),
        textStyles.btn
      );
      self.ui.challenge.buttonText.anchor(0.5, 0.5);

      self.control.showChallenge = true;
    },

    acceptChallenge: () => {
      self.control.challengeAnsweredYes = true;
      // Hide all challenge overlay elements
      Object.values(self.ui.challenge).forEach(el => {
        if (el && typeof el.alpha !== 'undefined') el.alpha = 0;
      });
      self.control.showChallenge = false;

      // Show main game UI (intro message, selection arrow)
      self.utils.renderMainUI();

      // Start timer now that challenge has been accepted
      if (!self.restart) {
        game.timer.start();
      }
    },

    renderMainUI: () => {
      // Help pointer
      self.ui.help = game.add.image(0, 0, 'pointer', 1.7, 0);
      if (gameMode === 'b') self.ui.help.anchor(0.25, 0.7);
      else self.ui.help.anchor(0.2, 0);

      // Selection Arrow
      if (gameMode === 'a') {
        self.ui.arrow = game.add.image(
          self.default.arrowX0,
          self.default.y0,
          'arrow_down',
          1.5
        );
        self.ui.arrow.anchor(0.5, 1);
        self.ui.arrow.alpha = 0.5;
      }

      // Intro text
      const correctMessage =
        gameMode === 'a'
          ? game.lang.squareOne_intro_a
          : game.lang.squareOne_intro_b;
      const treatedMessage = correctMessage.split('\\n');
      const font = textStyles.h1_;
      self.ui.message = [];
      self.ui.message.push(
        game.add.text(
          context.canvas.width / 2,
          170,
          treatedMessage[0] + '\n' + treatedMessage[1],
          font
        )
      );
    },
    renderOperationUI: () => {
      /**
       *
       * if game mode A:
       * - left: (1) selected floor position (user selection)
       * - right: (2) expected floor position equivalent to the stack of blocks (pre-set)
       *
       * if game mode B:
       * - left: (3) floor position equivalent to the stack of blocks (user selection)
       * - right: (4) generated floor position (pre-set)
       */

      const divisor = gameDifficulty == 3 ? 4 : gameDifficulty;

      const renderFloorFractions = (lastIndex, divisor) => {
        const operator = gameOperation === 'minus' ? '-' : '+';
        const index = lastIndex;
        const blocks = index + 1;

        const valueReal = blocks / divisor;
        const valueFloor = Math.floor(valueReal);
        const valueRest = valueReal - valueFloor;

        let fracNomin = (fracDenomin = fracLine = '');
        // adds sign on the left of the equation
        if (gameOperation === 'minus') {
          fracNomin += ' ';
          fracDenomin += ' ';
          fracLine += operator;
        }
        // 1 _ _
        if (valueFloor) {
          fracNomin += ' ';
          fracDenomin += ' ';
          fracLine += valueFloor;
        }
        // _ + _
        if (valueFloor && valueRest) {
          fracNomin += ' ';
          fracDenomin += ' ';
          fracLine += operator;
        }
        // _ _ 1/5
        if (valueRest) {
          fracNomin += `${valueRest * divisor}`;
          fracDenomin += `${divisor}`;
          fracLine += '-';
        }

        return [fracNomin, fracDenomin, fracLine, valueReal];
      };

      const renderStackFractions = (lastIndex) => {
        const operator = gameOperation === 'minus' ? '-' : '+';
        const index = lastIndex;
        const blocks = index + 1;

        const nominators = [];
        const denominators = [];
        const values = [];
        let valueReal = 0;
        let fracNomin = (fracDenomin = fracLine = '');

        for (let i = 0; i < blocks; i++) {
          const m = self.stack.list[i].fraction.denominator || 1;
          const temp = self.stack.list[i].fraction.nominator || 0;
          const n = gameOperation === 'minus' ? -temp : +temp;
          const nm = n / m;
          nominators[i] = n + 0;
          denominators[i] = m + 0;
          values[i] = nm;
          valueReal += nm;
        }

        for (let i = 0; i < blocks; i++) {
          const valueReal = values[i];
          const valueFloor = Math.floor(valueReal);
          const valueRest = valueReal - valueFloor;

          if (i > 0 || gameOperation === 'minus') {
            fracNomin += ' ';
            fracDenomin += ' ';
            fracLine += operator;
          }
          if (valueFloor && !valueRest) {
            fracNomin += ' ';
            fracDenomin += ' ';
            fracLine += valueFloor;
          }
          if (valueRest) {
            fracNomin += `${nominators[i]}`;
            fracDenomin += `${denominators[i]}`;
            fracLine += '-';
          }
        }

        return [fracNomin, fracDenomin, fracLine, valueReal];
      };

      // Initial setup
      const font = textStyles.fraction;
      font.fill = colors.black;

      const padding = 100;
      const offsetX = 100;
      const widthOfChar = 35;

      const x0 = padding;
      const y0 = context.canvas.height / 3;
      let nextX = x0;

      const cardHeight = 400;
      const cardX = x0 - padding;
      const cardY = y0;

      const renderList = [];

      // Render Card
      const card = game.add.geom.rect(
        cardX,
        cardY,
        0,
        cardHeight,
        colors.blueLight,
        0.5,
        colors.blueDark,
        8
      );
      card.id = 'card';
      card.anchor(0, 0.5);
      renderList.push(card);

      // Fraction setup
      console.clear();
      const [floorNominators, floorDenominators, floorLines, floorValue] =
        renderFloorFractions(
          self.floor.selectedIndex,
          divisor
          // 'LEFT SIDE - a fração escolhida no chão é...\n\n'
        );
      renderFloorFractions(
        self.floor.correctIndex,
        divisor
        // '\n\nRIGHT SIDE 1 - a fração CORRETA no chão é...\n\n'
      );
      const [stackNominators, stackDenominators, stackLines, stackValue] =
        renderStackFractions(
          self.stack.selectedIndex
          // '\n\nRIGHT SIDE 2 - a fração CORRETA na stack é...\n\n'
        );

      const renderFloorOperationLine = (x) => {
        font.fill = colors.black;
        const floorNom = game.add.text(
          x + offsetX / 2,
          y0,
          floorNominators,
          font,
          60
        );
        const floorDenom = game.add.text(
          x + offsetX / 2,
          y0 + 70,
          floorDenominators,
          font,
          60
        );
        const floorLin = game.add.text(
          x + offsetX / 2,
          y0 + 35,
          floorLines,
          font,
          60
        );
        renderList.push(floorNom);
        renderList.push(floorDenom);
        renderList.push(floorLin);
      };
      const renderStackOperationLine = (x) => {
        font.fill = colors.black;
        const stackNom = game.add.text(
          x + offsetX / 2,
          y0,
          stackNominators,
          font,
          60
        );
        const stackDenom = game.add.text(
          x + offsetX / 2,
          y0 + 70,
          stackDenominators,
          font,
          60
        );
        const stackLin = game.add.text(
          x + offsetX / 2,
          y0 + 35,
          stackLines,
          font,
          60
        );
        renderList.push(stackNom);
        renderList.push(stackDenom);
        renderList.push(stackLin);
      };

      // Render LEFT part of the operation
      if (gameMode === 'a') renderFloorOperationLine(x0);
      else renderStackOperationLine(x0);

      let curNominators = gameMode === 'a' ? floorNominators : stackNominators;
      nextX = x0 + (curNominators.length + 2) * widthOfChar;

      // Render middle sign - equal by default
      font.fill = colors.green;
      let comparisonSign = '=';
      // Render middle sign - if not equal
      if (floorValue != stackValue) {
        font.fill = colors.red;
        let leftSideIsLarger = floorValue > stackValue;
        if (gameMode === 'b') leftSideIsLarger = !leftSideIsLarger;
        if (gameOperation === 'minus') leftSideIsLarger = !leftSideIsLarger;
        comparisonSign = leftSideIsLarger ? '>' : '<';
      }
      renderList.push(game.add.text(nextX, y0 + 35, comparisonSign, font));

      // Render RIGHT part of the operation
      if (gameMode === 'a') renderStackOperationLine(nextX);
      else renderFloorOperationLine(nextX);

      curNominators = gameMode === 'a' ? stackNominators : floorNominators;
      const resultWidth = (curNominators.length + 2) * widthOfChar;

      const cardWidth = nextX - x0 + resultWidth + padding * 2;
      card.width = cardWidth;

      const endSignX = (context.canvas.width - cardWidth) / 2 + cardWidth;

      // Center Card
      moveList(renderList, (context.canvas.width - cardWidth) / 2, 0);

      self.fractionOperationUI = renderList;

      return endSignX;
    },
    renderExplanationUI: () => {
      const cx = context.canvas.width / 2;
      const cy = context.canvas.height / 2;
      const withNewlines = (s) => (s == null ? '' : String(s).replace(/\\n/g, '\n'));
      const FRAC_UNICODE = { 1: '1', 2: '\u00BD', 4: '\u00BC' };
      const divisor = gameDifficulty == 3 ? 4 : gameDifficulty;

      // WRONG ANSWER: just a button, no extra background rectangle
      if (!self.control.isCorrect) {
        context.font = textStyles.btn.font;
        const retryText = game.lang.retry || 'Retry';
        const btnW = Math.max(420, context.measureText(retryText).width + 120);
        const btnH = 80; const btnCY = cy + 60;
        self.ui.explanation.button = game.add.geom.rect(cx, btnCY, btnW, btnH, colors.red);
        self.ui.explanation.button.anchor(0.5, 0.5);
        self.ui.explanation.text = game.add.text(cx, btnCY + 14, retryText, textStyles.btn);
        self.control.showExplanation = true;
        return;
      }

      // CORRECT ANSWER: full explanation card — positions based on actual image dimensions
      const naturalW = game.image['end-tractor-game'].width;
      const naturalH = game.image['end-tractor-game'].height;
      const canvasW  = context.canvas.width;
      const canvasH  = context.canvas.height;
      const imgScale = Math.min((canvasW * 0.92) / naturalW, (canvasH * 0.92) / naturalH);
      const imgW = naturalW * imgScale;
      const imgH = naturalH * imgScale;
      const cardTop    = cy - imgH / 2;
      const cardBottom = cy + imgH / 2;
      const cardLeft   = cx - imgW / 2;

      // Background image — scaled to fit canvas
      const bgImg = game.add.image(cx, cy, 'end-tractor-game');
      bgImg.anchor(0.5, 0.5);
      bgImg.scale = imgScale;

      // Title overlaid on the image's top blue bar (no emoji — image already has magnifying glass)
      const titleText = withNewlines(game.lang.s1_explain_title);
      game.add.text(cx + imgW * 0.04, cardTop + imgH * 0.07, titleText, {
        ...textStyles.h3_, fill: colors.white, font: 'bold ' + textStyles.h3_.font,
      });

      // Step labels below the image's built-in circles (image already draws 1 → 2 → 3)
      const stepTexts = [
        withNewlines(game.lang.s1_explain_step1),
        withNewlines(game.lang.s1_explain_step2),
        withNewlines(game.lang.s1_explain_step3),
      ];
      const stepFont = `24px ${font.families.default}`;
      const stepStyle = { ...textStyles.p_, fill: colors.blueDark, font: stepFont };
      const stepsLine1Y = cardTop + imgH * 0.245;
      const stepsLine2Y = stepsLine1Y + 26;
      // Positions centred under each circle in the background image
      const stepCenters = [
        cardLeft + imgW * 0.28,
        cardLeft + imgW * 0.50,
        cardLeft + imgW * 0.75,
      ];
      stepCenters.forEach((sx, idx) => {
        const lines = stepTexts[idx].split('\n');
        game.add.text(sx, stepsLine1Y, lines[0] || '', stepStyle);
        if (lines[1]) game.add.text(sx, stepsLine2Y, lines[1], stepStyle);
      });

      // Fraction equation — placed in the image's equation box area
      let holeNumerator = 0;
      const lastIdx = self.stack.correctIndex ?? (self.stack.list.length - 1);
      for (let i = 0; i <= lastIdx; i++) {
        holeNumerator += divisor / self.stack.list[i].fraction.denominator;
      }
      const holeSize = holeNumerator / divisor;
      const formatNum = (n) => {
        if (Number.isInteger(n)) return String(n);
        const whole = Math.floor(n);
        const frac = n - whole;
        const FRAC_MAP = { 0.25: '\u00BC', 0.5: '\u00BD', 0.75: '\u00BE' };
        return (whole ? whole + ' + ' : '') + (FRAC_MAP[Math.round(frac * 4) / 4] ?? n.toFixed(2).replace(/0+$/, ''));
      };
      const equationParts = self.stack.list.slice(0, lastIdx + 1).map(block => {
        return FRAC_UNICODE[block.fraction.denominator] ?? `1/${block.fraction.denominator}`;
      });
      const isMinus = gameOperation === 'minus';
      const eqSeparator = isMinus ? ' - ' : ' + ';
      const eqTerms = isMinus
        ? '-' + equationParts[0] + (equationParts.length > 1 ? eqSeparator + equationParts.slice(1).join(eqSeparator) : '')
        : equationParts.join(eqSeparator);
      // For minus: "-3 + ¾" → "-3 - ¾" so the sign stays consistent
      const resultStr = isMinus
        ? '-' + formatNum(holeSize).replace(' + ', ' - ')
        : formatNum(holeSize);
      const equationStr = eqTerms + ' = ' + resultStr;
      game.add.text(cx, cardTop + imgH * 0.355, equationStr, {
        ...textStyles.h3_, fill: colors.blueDark, font: 'bold ' + textStyles.h3_.font,
      });

      // Block bars — stacked upward from ground level, height proportional to fraction
      const groundY     = cardTop + imgH * 0.72;   // ground line where tractor sits
      const stackTopMin = cardTop + imgH * 0.44;   // never go above equation box
      const maxStackH   = groundY - stackTopMin;   // available vertical space
      const barW        = imgW * 0.055;
      const barsStartX  = cardLeft + imgW * 0.30;
      const totalBlocks = lastIdx + 1;
      const fillColor   = gameOperation === 'minus' ? colors.redLight : '#79d2a1';
      const borderColor = gameOperation === 'minus' ? colors.red      : colors.green;

      // Calculate proportional heights, then scale down if they exceed available space
      const blocks = self.stack.list.slice(0, totalBlocks);
      const rawUnitH = Math.max(48, Math.min(80, maxStackH / holeSize));
      const rawHeights = blocks.map(b => Math.max(20, rawUnitH / b.fraction.denominator));
      const rawTotal   = rawHeights.reduce((s, h) => s + h + 4, -4);
      const scale      = rawTotal > maxStackH ? maxStackH / rawTotal : 1;
      const blockHeights = rawHeights.map(h => Math.max(10, h * scale));
      const totalStackH = blockHeights.reduce((s, h) => s + h + 4, -4);
      let curY = groundY - totalStackH;
      blocks.forEach((block, i) => {
        const bh = blockHeights[i];
        game.add.geom.rect(barsStartX, curY, barW, bh, fillColor, 0.8, borderColor, 2);
        const fracLabel = FRAC_UNICODE[block.fraction.denominator] ?? `1/${block.fraction.denominator}`;
        game.add.text(barsStartX + barW + 20, curY + bh / 2 + 4, fracLabel, {
          ...textStyles.p_, fill: colors.blueDark, font: `20px ${font.families.default}`,
        });
        curY += bh + 4;
      });

      // Hole label — text only, centred over the image's built-in blue rounded rectangle
      const holeLabelCX = cardLeft + imgW * 0.675;
      const holeLabelCY = cardTop  + imgH * 0.588;
      const holeWords = (game.lang.s1_hole_label || 'Hole of size').split(' ');
      const holeMid = Math.ceil(holeWords.length / 2);
      const holeLabelLine1 = holeWords.slice(0, holeMid).join(' ');
      const holeLabelLine2 = holeWords.slice(holeMid).join(' ');
      const holeLabelLine3 = (isMinus ? '-' : '') + formatNum(holeSize).replace(' + ', ' - ');
      const holeFont = `bold 24px ${font.families.default}`;
      const holeLineH = 24;
      game.add.text(holeLabelCX, holeLabelCY - holeLineH,  holeLabelLine1, { ...textStyles.p_, fill: colors.white, font: holeFont });
      game.add.text(holeLabelCX, holeLabelCY,               holeLabelLine2, { ...textStyles.p_, fill: colors.white, font: holeFont });
      game.add.text(holeLabelCX, holeLabelCY + holeLineH,  holeLabelLine3, { ...textStyles.p_, fill: colors.white, font: holeFont });

      // Body text
      const bodyLines = withNewlines(game.lang.s1_explain_body).split('\n');
      game.add.text(cx, cardBottom - imgH * 0.20, bodyLines[0], { ...textStyles.p_, fill: colors.blueDark });
      if (bodyLines[1]) {
        game.add.text(cx, cardBottom - imgH * 0.13, bodyLines[1], { ...textStyles.p_, fill: colors.blueDark });
      }

      // Continue button — anchored at centre so hover scale grows evenly from centre
      const btnW = imgW * 0.38; const btnH = 62; const btnCY = cardBottom - imgH * 0.07;
      self.ui.explanation.button = game.add.geom.rect(cx, btnCY, btnW, btnH, colors.green);
      self.ui.explanation.button.anchor(0.5, 0.5);
      self.ui.explanation.text = game.add.text(cx, btnCY + 14, game.lang.continue, textStyles.btn);
      self.control.showExplanation = true;
    },

    // UPDATE HANDLERS
    animateTractorHandler: () => {
      // Move
      self.tractor.x += self.animation.speed;
      self.stack.list.forEach((block) => (block.x += self.animation.speed));

      // If the current block is 1/n (not 1/1) we need to consider the
      // extra space the truck needs to pass after the blocks falls but
      // before reaching the next block
      const curBlockExtra =
        (self.default.width - self.stack.list[self.stack.curIndex].width) *
        self.control.direc;

      const canLowerBlocks =
        (gameOperation == 'plus' &&
          self.stack.list[0].x >= self.stack.curBlockEndX + curBlockExtra) ||
        (gameOperation == 'minus' &&
          self.stack.list[0].x <= self.stack.curBlockEndX + curBlockExtra);
      if (canLowerBlocks) {
        const endAnimation = self.utils.lowerBlocksHandler();

        if (!endAnimation) {
          self.animation.animateTractor = false;
          self.control.checkAnswer = true;
        }
      }
    },
    lowerBlocksHandler: () => {
      self.floor.curIndex += self.stack.list[self.stack.curIndex].blockValue;

      const tooManyStackBlocks = self.floor.curIndex > self.floor.selectedIndex;
      if (tooManyStackBlocks) return false;

      // fill floor
      for (let i = 0; i <= self.floor.curIndex; i++) {
        self.floor.list[i].fillColor = 'transparent';
      }
      // lower blocks
      self.stack.list.forEach((block) => {
        block.y += self.default.height;
      });
      // hide current block
      self.stack.list[self.stack.curIndex].alpha = 0;

      const isLastFloorBlock = self.floor.curIndex === self.floor.selectedIndex;
      const notEnoughStackBlocks =
        self.stack.curIndex === self.stack.list.length - 1;

      if (isLastFloorBlock || notEnoughStackBlocks) return false;

      // update stack blocks
      self.stack.curIndex++;
      self.stack.curBlockEndX +=
        self.stack.list[self.stack.curIndex].width * self.control.direc;

      return true;
    },
    checkAnswerHandler: () => {
      game.timer.stop();

      game.animation.stop(self.tractor.animation[0]);

      if (gameMode === 'a') self.ui.arrow.alpha = 0;

      self.control.isCorrect =
        gameMode === 'a'
          ? self.floor.selectedIndex === self.floor.correctIndex
          : self.stack.selectedIndex === self.stack.correctIndex;

      const feedbackX = context.canvas.width * 0.75;
      const feedbackY = context.canvas.height / 3;

      // Give feedback to player and turns on sprite animation
      if (self.control.isCorrect) {
        completedLevels++; // Increases number os finished levels
        if (audioStatus) game.audio.okSound.play();
        game.animation.play(self.tractor.animation[0]);
        if (isDebugMode) console.log('Completed Levels: ' + completedLevels);
      } else {
        if (audioStatus) game.audio.errorSound.play();
        game.add.image(feedbackX, feedbackY, 'answer_wrong').anchor(0.5, 0.5);
      }

      self.fetch.postScore();

      self.control.checkAnswer = false;
      self.animation.animateEnding = true;
    },
    animateEndingHandler: () => {
      // ANIMATE ENDING
      self.control.count++;

      // If CORRECT ANSWER runs final tractor animation (else tractor desn't move, just wait)
      if (self.control.isCorrect) self.tractor.x += self.animation.speed;

      if (self.control.count === 100) {
        self.utils.renderExplanationUI();

        if (self.control.isCorrect) canGoToNextMapPosition = true;
        else canGoToNextMapPosition = false;
      }
    },
    endLevel: () => {
      game.state.start('map');
    },

    // INFORMATION
    /**
     * Display correct answer
     */
    showAnswer: () => {
      if (!self.control.hasClicked) {
        // On gameMode (a)
        if (gameMode === 'a') {
          const aux = self.floor.list[0];
          self.ui.help.x =
            self.floor.correctX - (aux.width / 2) * self.control.direc;
          self.ui.help.y = self.default.y0;
          // On gameMode (b)
        } else {
          const aux = self.stack.list[self.stack.correctIndex];
          self.ui.help.x = aux.x + (aux.width / 2) * self.control.direc;
          self.ui.help.y = aux.y;
        }

        self.ui.help.alpha = 0.7;
      }
    },

    // EVENT HANDLERS
    /**
     * Function called by self.events.onInputDown() when player clicks on a valid rectangle.
     */
    clickHandler: (clickedIndex, curSet) => {
      if (!self.control.hasClicked && !self.animation.animateEnding && !self.control.showChallenge) {
        document.body.style.cursor = 'auto';
        // Play beep sound
        if (audioStatus) game.audio.popSound.play();

        // Disable show answer nav icon
        navigation.disableIcon(navigation.showAnswerIcon);
        // Hide intro message
        self.ui.message[0].alpha = 0;
        // Hide labels
        if (showFractions) {
          self.stack.list.forEach((block) => {
            block.fraction.labels.forEach((lbl) => {
              if (lbl) lbl.alpha = 0;
            });
          });
        }
        // Hide solution pointer
        if (self.ui.help != undefined) self.ui.help.alpha = 0;
        // Hide unselected blocks
        for (let i = curSet.list.length - 1; i > clickedIndex; i--) {
          curSet.list[i].alpha = 0;
        }

        // Save selected index
        curSet.selectedIndex = clickedIndex;

        if (gameMode === 'a') {
          self.ui.arrow.alpha = 0;
        } else {
          // update list size
          self.stack.list.length = curSet.selectedIndex + 1;
        }

        // Turn tractor animation on
        game.animation.play(self.tractor.animation[0]);
        self.animation.animateTractor = true;
        self.control.hasClicked = true;
      }
    },
    /**
     * Function called by self.events.onInputOver() when cursor is over a valid rectangle
     *
     * @param {object} cur rectangle the cursor is over
     */
    overHandler: (cur) => {
      if (!self.control.hasClicked) {
        document.body.style.cursor = 'pointer';

        if (gameMode === 'a') {
          for (let i in self.floor.list) {
            self.floor.list[i].fillColor =
              i <= cur.blockIndex ? colors.blueBgInsideLevel : 'transparent';
          }
          self.floor.selectedIndex = cur.blockIndex;
        } else {
          for (let i in self.stack.list) {
            const alpha = i <= cur.blockIndex ? 1 : 0.4;

            self.stack.list[i].alpha = alpha;
            if (showFractions) {
              self.stack.list[i].fraction.labels.forEach((lbl) => {
                if (lbl) lbl.alpha = alpha;
              });
            }
          }
          self.stack.selectedIndex = cur.blockIndex;
        }
      }
    },
    /**
     * Function called by self.events.onInputOver() when cursos is out of a valid rectangle
     */
    outHandler: () => {
      if (!self.control.hasClicked) {
        document.body.style.cursor = 'auto';

        if (gameMode === 'a') {
          for (let i in self.floor.list) {
            self.floor.list[i].fillColor = 'transparent';
          }
          self.floor.selectedIndex = undefined;
        } else {
          for (let i in self.stack.list) {
            self.stack.list[i].alpha = 1;
            if (showFractions) {
              self.stack.list[i].fraction.labels.forEach((lbl) => {
                if (lbl) lbl.alpha = 1;
              });
            }
          }
          self.stack.selectedIndex = undefined;
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
    onInputDown: (mouseEvent) => {
      const x = game.math.getMouse(mouseEvent).x;
      const y = game.math.getMouse(mouseEvent).y;

      // Challenge modal: block all game interaction until accepted
      if (self.control.showChallenge) {
        if (game.math.isOverIcon(x, y, self.ui.challenge.button)) {
          if (audioStatus) game.audio.popSound.play();
          self.utils.acceptChallenge();
        }
        navigation.onInputDown(x, y);
        game.render.all();
        return;
      }

      // Hide intro message on first click after challenge acceptance
      if (!self.control.hasClicked && self.ui.message && self.ui.message[0]) {
        self.ui.message[0].alpha = 0;
      }

      // click blocks
      const curSet = gameMode == 'a' ? self.floor : self.stack;
      for (let i in curSet.list) {
        if (game.math.isOverIcon(x, y, curSet.list[i])) {
          self.utils.clickHandler(+i, curSet);
          break;
        }
      }

      // Explanation button
      if (self.control.showExplanation) {
        if (game.math.isOverIcon(x, y, self.ui.explanation.button)) {
          if (audioStatus) game.audio.popSound.play();
          self.utils.endLevel();
        }
      }

      navigation.onInputDown(x, y);

      game.render.all();
    },

    /**
     * Called by mouse move event
     *
     * @param {object} mouseEvent contains the mouse move coordinates
     */
    onInputOver: (mouseEvent) => {
      const x = game.math.getMouse(mouseEvent).x;
      const y = game.math.getMouse(mouseEvent).y;
      let isOverFloor = false;
      let isOverStack = false;

      if (!self.control.showChallenge) {
        if (gameMode === 'a') {
          self.floor.list.forEach((cur) => {
            // hover floor blocks
            if (game.math.isOverIcon(x, y, cur)) {
              isOverFloor = true;
              self.utils.overHandler(cur);
            }
            // move arrow
            if (
              !self.control.hasClicked &&
              !self.animation.animateEnding &&
              game.math.isOverIcon(x, self.default.y0, cur)
            ) {
              self.ui.arrow.x = x;
            }
          });

          if (!isOverFloor) self.utils.outHandler('a');
        }

        if (gameMode === 'b') {
          // hover stack blocks
          self.stack.list.forEach((cur) => {
            if (game.math.isOverIcon(x, y, cur)) {
              isOverStack = true;
              self.utils.overHandler(cur);
            }
          });
          if (!isOverStack) self.utils.outHandler('b');
        }
      }

      // Challenge accept button hover
      if (self.control.showChallenge && self.ui.challenge.button) {
        if (game.math.isOverIcon(x, y, self.ui.challenge.button)) {
          document.body.style.cursor = 'pointer';
          self.ui.challenge.button.scale = self.ui.challenge.button.initialScale * 1.1;
          self.ui.challenge.buttonText.style = textStyles.btnLg;
        } else {
          document.body.style.cursor = 'auto';
          self.ui.challenge.button.scale = self.ui.challenge.button.initialScale * 1;
          self.ui.challenge.buttonText.style = textStyles.btn;
        }
      }

      // Explanation button hover
      if (self.control.showExplanation) {
        if (game.math.isOverIcon(x, y, self.ui.explanation.button)) {
          document.body.style.cursor = 'pointer';
          self.ui.explanation.button.scale =
            self.ui.explanation.button.initialScale * 1.05;
          self.ui.explanation.text.style = textStyles.btnLg;
        } else {
          document.body.style.cursor = 'auto';
          self.ui.explanation.button.scale =
            self.ui.explanation.button.initialScale * 1;
          self.ui.explanation.text.style = textStyles.btn;
        }
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
    postScore: () => {
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
        self.stack.list.length +
        ', valBlocks: ' +
        self.control.divisorsList + // Ends in ','
        ' blockIndex: ' +
        self.stack.selectedIndex +
        ', floorIndex: ' +
        self.floor.selectedIndex +
        '&challenge_answered_yes=' +
        self.control.challengeAnsweredYes;

      // FOR MOODLE
      sendToDatabase(data);
    },
  },
};
