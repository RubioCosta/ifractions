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
 * ..equals... = gameOperation
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
 *   equals : Player selects equivalent fractions of both blocks
 *
 * @namespace
 */
const squareTwo = {
  ui: undefined,
  control: undefined,

  blocks: undefined,

  /**
   * Main code
   */
  create: function () {
    this.ui = {
      message: undefined,
      startChoice: {
        message: undefined,
        card: undefined,
        image: undefined,
        title: undefined,
        subtitle: undefined,
        accept: {
          button: undefined,
          text: undefined,
        },
        yes: {
          button: undefined,
          text: undefined,
        },
        no: {
          button: undefined,
          text: undefined,
        },
      },
      continue: {
        // modal: undefined,
        button: undefined,
        text: undefined,
      },
      explanation: {
        button: undefined,
        text: undefined,
      },
    };
    this.control = {
      blockWidth: 600,
      blockHeight: 75,
      isCorrect: false,
      showEndInfo: false,
      showExplanation: false,
      animationDelay: 0,
      startDelay: false,
      startEndAnimation: false,
      started: false,
      blockConfig: undefined,
      challengePreview: undefined,
      challengeAnsweredYes: undefined,
    };
    this.blocks = {
      top: {
        list: [], // List of block objects
        auxBlocks: [], // List of shadow under selection blocks
        fractions: [], // Fractions
        selectedAmount: 0,
        hasClicked: false, // Check if player clicked blocks from (a)
        animate: false, // Animate blocks from (a)
        warningText: undefined,
        label: undefined,
      },
      bottom: {
        list: [],
        auxBlocks: [],
        fractions: [],
        selectedAmount: 0,
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

    // Pre-generate the level configuration so the challenge modal can preview real fractions
    this.control.blockConfig = this.utils.generateBlockConfig();
    this.control.challengePreview = this.utils.generateChallengePreview(
      this.control.blockConfig
    );

    // Wait for user confirmation before starting the level
    this.utils.renderStartChoiceUI();

    game.event.add('click', this.events.onInputDown);
    game.event.add('mousemove', this.events.onInputOver);
  },

  /**
   * Game loop
   */
  update: function () {
    // Animate blocks
    if (self.blocks.top.animate || self.blocks.bottom.animate) {
      self.utils.moveBlocks();
    }

    // If (a) and (b) are already clicked
    if (
      !self.control.startDelay &&
      !self.control.startEndAnimation &&
      self.blocks.top.hasClicked &&
      self.blocks.bottom.hasClicked
    ) {
      self.control.startDelay = true;
    }

    if (self.control.startDelay && !self.control.startEndAnimation) {
      self.utils.startDelayHandler();
    }

    // Wait a bit and go to map state
    if (self.control.startEndAnimation) {
      self.utils.runEndAnimation();
    }

    game.render.all();
  },

  utils: {
    // RENDERS
    generateBlockConfig: function () {
      // Coordinates for (a) and (b)
      let xA, xB, yA, yB;

      if (gameMode != 'b') {
        // Has more subdivisions on (a)
        xA = context.canvas.width / 2 - self.control.blockWidth / 2;
        yA = getFrameInfo().y + 100;
        xB = xA;
        yB = yA + 3 * self.control.blockHeight + 30;
      } else {
        // Has more subdivisions on (b)
        xB = context.canvas.width / 2 - self.control.blockWidth / 2;
        yB = getFrameInfo().y + 100;
        xA = xB;
        yA = yB + 3 * self.control.blockHeight + 30;
      }

      // Possible subdivisionList for (a)
      const subdivisionList = [2, 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20];
      const minIndex = (gameDifficulty - 1) * 2 + 1;
      const maxIndex = (gameDifficulty - 1) * 2 + 3;

      // Build a shuffled pool of all (A, B) pairs for this difficulty and
      // iterate through it so the same combination never repeats until all
      // possibilities have been exhausted, then reshuffle and start again.
      if (
        !squareTwo._configPool ||
        squareTwo._configPoolDifficulty !== gameDifficulty ||
        squareTwo._configIndex >= squareTwo._configPool.length
      ) {
        const allPairs = [];
        for (let i = minIndex; i <= maxIndex; i++) {
          const a = subdivisionList[i];
          for (let b = 2; b < a; b++) {
            if (a % b === 0) allPairs.push({ a, b });
          }
        }
        // Fisher-Yates shuffle
        for (let i = allPairs.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allPairs[i], allPairs[j]] = [allPairs[j], allPairs[i]];
        }
        squareTwo._configPool = allPairs;
        squareTwo._configPoolDifficulty = gameDifficulty;
        squareTwo._configIndex = 0;
      }

      // Number of subdivisions of (a) and (b) (blocks)
      const { a: totalBlocksA, b: totalBlocksB } =
        squareTwo._configPool[squareTwo._configIndex++];

      const blockWidthA = self.control.blockWidth / totalBlocksA;
      const blockWidthB = self.control.blockWidth / totalBlocksB;

      if (isDebugMode) {
        console.log(
          '------------------------------' +
            '\nGame Map Position: ' +
            curMapPosition +
            '\n------------------------ setup' +
            '\narray: [2, 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20]' +
            '\nMin index ((gameDifficulty - 1) * 2 + 1): ' +
            ((gameDifficulty - 1) * 2 + 1) +
            '\nMax index ((gameDifficulty - 1) * 2 + 3): ' +
            ((gameDifficulty - 1) * 2 + 3) +
            '\n------------------------ this' +
            '\ntotalBlocksA: ' +
            totalBlocksA +
            '\ntotalBlocksB: ' +
            totalBlocksB +
            '\npool index: ' + (squareTwo._configIndex - 1) + '/' + squareTwo._configPool.length +
            '\n------------------------------'
        );
      }

      return {
        xA,
        yA,
        xB,
        yB,
        totalBlocksA,
        totalBlocksB,
        blockWidthA,
        blockWidthB,
      };
    },
    generateChallengePreview: function (blockConfig) {
      if (!blockConfig) return undefined;

      const { totalBlocksA, totalBlocksB } = blockConfig;
      if (!totalBlocksA || !totalBlocksB) return undefined;

      const gcd = (a, b) => {
        let x = Math.abs(a);
        let y = Math.abs(b);
        while (y !== 0) {
          const t = x % y;
          x = y;
          y = t;
        }
        return x;
      };

      // Always produce an equivalent integer pair using the gcd
      const g = gcd(totalBlocksA, totalBlocksB);
      const leftUnit = totalBlocksA / g;
      const rightUnit = totalBlocksB / g;

      // Deterministic preview (prevents changing values between renders)
      const selectedA = leftUnit;
      const selectedB = rightUnit;

      // Show as left/right fractions in the modal (keep order consistent with blocks)
      return {
        left: { num: selectedA, den: totalBlocksA },
        right: { num: selectedB, den: totalBlocksB },
      };
    },
    renderStartChoiceUI: () => {
      const centerX = context.canvas.width / 2;
      const centerY = context.canvas.height / 2;

      const yesLabel = game.lang.yes;
      const noLabel = game.lang.no;
      const withNewlines = (s) => (s == null ? '' : String(s).replace(/\\n/g, '\n'));
      const title = withNewlines(game.lang.s2_challenge_title);
      const subtitle = withNewlines(game.lang.s2_challenge_subtitle);
      const question = withNewlines(game.lang.s2_challenge_question);

      // Layout reference (no white panel/card)
      const cardH = 560;

      const panelTop = centerY - cardH / 2;

      // Challenge image (ribbon + question mark)
      const imageScale = 0.7;
      const imageY = panelTop - 150;
      self.ui.startChoice.image = game.add.image(
        centerX,
        imageY,
        'challenge',
        imageScale,
        1
      );

      self.ui.startChoice.image.anchor(0.5, 0);

      // Title + subtitle
      self.ui.startChoice.title = game.add.text(
        centerX,
        imageY + 65,
        title,
        { ...textStyles.h2_, fill: colors.white, font: 'bold ' + textStyles.h2_.font }
      );
      self.ui.startChoice.title.anchor(0.5, 0.5);

      // Subtitle split in two lines (top emphasized)
      const subtitleLines = String(subtitle || '').split('\n');
      const subtitleTop = subtitleLines[0] || '';
      const subtitleBottom = subtitleLines.slice(1).join('\n');

      self.ui.startChoice.subtitle = {};

      self.ui.startChoice.subtitle.top = game.add.text(
        centerX,
        panelTop + 10,
        subtitleTop,
        {
          ...textStyles.h4_,
          font: 'bold ' + textStyles.h4_.font,
          fill: colors.blueDark,
        }
      );
      self.ui.startChoice.subtitle.top.anchor(0.5, 0.5);

      self.ui.startChoice.subtitle.bottom = game.add.text(
        centerX,
        panelTop + 55,
        subtitleBottom,
        { ...textStyles.h3_, fill: colors.blue }
      );
      self.ui.startChoice.subtitle.bottom.anchor(0.5, 0.5);

      // Fractions preview (left and right) - based on the real generated blockConfig
      const preview =
        self.control.challengePreview ||
        self.utils.generateChallengePreview(self.control.blockConfig);
      self.control.challengePreview = preview;
      if (preview && preview.left && preview.right) {
        const fracFont = { ...textStyles.fraction, fill: colors.blueDark, align: 'center', font: '76px monospace' };
        const fracY = panelTop + 255;
        const offsetX = 260;

        const leftX = centerX - offsetX;
        const rightX = centerX + offsetX;

        const leftText = game.add.text(
          leftX,
          fracY,
          preview.left.num + '\n' + preview.left.den,
          fracFont,
          70
        );
        leftText.anchor(0.5, 0.5);
        const leftLine = game.add.geom.rect(
          leftX,
          fracY + 10,
          120,
          4,
          colors.blueDark,
          1,
          colors.blueDark,
          4
        );
        leftLine.anchor(0.5, 0);

        const rightText = game.add.text(
          rightX,
          fracY,
          preview.right.num + '\n' + preview.right.den,
          fracFont,
          70
        );
        rightText.anchor(0.5, 0.5);
        const rightLine = game.add.geom.rect(
          rightX,
          fracY + 10,
          120,
          4,
          colors.blueDark,
          1,
          colors.blueDark,
          4
        );
        rightLine.anchor(0.5, 0);

        self.ui.startChoice.fractions = {
          leftText,
          leftLine,
          rightText,
          rightLine,
        };
      }

      // Prompt
      self.ui.startChoice.message = game.add.text(
        centerX,
        panelTop + 415,
        question,
        {
          ...textStyles.h3_,
          font: 'bold ' + textStyles.h3_.font,
          fill: colors.blueDark,
        }
      );
      self.ui.startChoice.message.anchor(0.5, 0.5);

      // Buttons
      const buttonW = 340;
      const buttonH = 90;
      const gap = 90;
      const buttonsY = panelTop + 600;

      const choiceTextStyle = { ...textStyles.h3_, fill: colors.blueDark, font: 'bold ' + textStyles.h3_.font };
      const borderColor = colors.blueMenuLine;
      const fillColor = colors.white;
      const fillAlpha = 0.9;
      const selectedFillColor = colors.blueLight;

      const createPillButton = (x, y, label) => {
        // Invisible hit target used for hover/click detection
        const hit = game.add.geom.rect(
          x,
          y,
          buttonW,
          buttonH,
          colors.white,
          0,
          colors.white,
          0
        );
        hit.anchor(0.5, 0.5);

        const outerW = buttonW;
        const outerH = buttonH;

        const innerInset = 10;
        const innerW = outerW - innerInset;
        const innerH = outerH - innerInset;

        const outerRect = game.add.geom.rect(
          x,
          y,
          outerW,
          outerH,
          borderColor,
          1,
          borderColor,
          0
        );
        outerRect.anchor(0.5, 0.5);
        outerRect.shadow = true;
        outerRect.shadowColor = colors.gray;
        outerRect.shadowBlur = 8;

        const innerRect = game.add.geom.rect(
          x,
          y,
          innerW,
          innerH,
          fillColor,
          fillAlpha,
          fillColor,
          0
        );
        innerRect.anchor(0.5, 0.5);

        const text = game.add.text(x, y + 10, label, choiceTextStyle);

        return {
          hit,
          text,
          outerParts: [outerRect],
          innerParts: [innerRect],
          setSelected: (isSelected) => {
            const c = isSelected ? selectedFillColor : fillColor;
            [innerRect].forEach((p) => {
              p.fillColor = c;
              p.lineColor = c;
            });
          },
        };
      };

      const yesX = centerX - (buttonW / 2 + gap / 2);
      const noX = centerX + (buttonW / 2 + gap / 2);

      const yes = createPillButton(yesX, buttonsY, yesLabel);
      const no = createPillButton(noX, buttonsY, noLabel);

      // keep existing structure expected by event handlers
      self.ui.startChoice.yes.button = yes.hit;
      self.ui.startChoice.yes.text = yes.text;
      self.ui.startChoice.yes.visual = yes;

      self.ui.startChoice.no.button = no.hit;
      self.ui.startChoice.no.text = no.text;
      self.ui.startChoice.no.visual = no;

      game.render.all();
    },
    updateChallengeChoiceUI: () => {
      const selected = self.control.challengeAnsweredYes;
      const yesBtn = self.ui.startChoice?.yes?.button;
      const noBtn = self.ui.startChoice?.no?.button;

      const yesVisual = self.ui.startChoice?.yes?.visual;
      const noVisual = self.ui.startChoice?.no?.visual;

      if (yesBtn) {
        if (yesVisual && yesVisual.setSelected) {
          yesVisual.setSelected(selected === true);
        } else {
          yesBtn.fillColor = selected === true ? colors.blueLight : colors.white;
        }
      }
      if (noBtn) {
        if (noVisual && noVisual.setSelected) {
          noVisual.setSelected(selected === false);
        } else {
          noBtn.fillColor = selected === false ? colors.blueLight : colors.white;
        }
      }

      game.render.all();
    },
    startGame: () => {
      if (self.control.started) return;
      self.control.started = true;

      // Hide pre-start UI
      if (self.ui.startChoice && self.ui.startChoice.message) {
        self.ui.startChoice.message.alpha = 0;
      }
      if (self.ui.startChoice && self.ui.startChoice.title) {
        self.ui.startChoice.title.alpha = 0;
      }
      if (self.ui.startChoice && self.ui.startChoice.subtitle) {
        if (self.ui.startChoice.subtitle.alpha != null) {
          self.ui.startChoice.subtitle.alpha = 0;
        } else {
          const s = self.ui.startChoice.subtitle;
          if (s.top) s.top.alpha = 0;
          if (s.bottom) s.bottom.alpha = 0;
        }
      }
      if (self.ui.startChoice && self.ui.startChoice.image) {
        self.ui.startChoice.image.alpha = 0;
      }
      if (self.ui.startChoice && self.ui.startChoice.fractions) {
        Object.values(self.ui.startChoice.fractions).forEach((obj) => {
          if (obj) obj.alpha = 0;
        });
      }
      if (self.ui.startChoice && self.ui.startChoice.card) {
        self.ui.startChoice.card.alpha = 0;
      }
      if (self.ui.startChoice && self.ui.startChoice.yes) {
        if (self.ui.startChoice.yes.button) self.ui.startChoice.yes.button.alpha = 0;
        if (self.ui.startChoice.yes.text) self.ui.startChoice.yes.text.alpha = 0;
        if (self.ui.startChoice.yes.visual) {
          const v = self.ui.startChoice.yes.visual;
          if (v.outerParts) v.outerParts.forEach((p) => (p.alpha = 0));
          if (v.innerParts) v.innerParts.forEach((p) => (p.alpha = 0));
        }
      }
      if (self.ui.startChoice && self.ui.startChoice.no) {
        if (self.ui.startChoice.no.button) self.ui.startChoice.no.button.alpha = 0;
        if (self.ui.startChoice.no.text) self.ui.startChoice.no.text.alpha = 0;
        if (self.ui.startChoice.no.visual) {
          const v = self.ui.startChoice.no.visual;
          if (v.outerParts) v.outerParts.forEach((p) => (p.alpha = 0));
          if (v.innerParts) v.innerParts.forEach((p) => (p.alpha = 0));
        }
      }
      if (self.ui.startChoice && self.ui.startChoice.accept) {
        if (self.ui.startChoice.accept.button)
          self.ui.startChoice.accept.button.alpha = 0;
        if (self.ui.startChoice.accept.text)
          self.ui.startChoice.accept.text.alpha = 0;
      }
      document.body.style.cursor = 'auto';

      // Add kid + blocks + UI (original flow)
      self.utils.renderCharacters();
      self.utils.renderBlockSetup(self.control.blockConfig);
      self.utils.renderMainUI();

      game.timer.start(); // Set a timer for the current level (used in postScore)
      game.render.all();
    },
    renderBlockSetup: function (blockConfig) {
      const cfg = blockConfig || self.utils.generateBlockConfig();
      if (!cfg) return;

      const {
        xA,
        yA,
        xB,
        yB,
        totalBlocksA,
        totalBlocksB,
        blockWidthA,
        blockWidthB,
      } = cfg;

      // (a)
      self.utils.renderBlocks(
        self.blocks.top,
        'top',
        totalBlocksA,
        blockWidthA,
        colors.blueDark,
        colors.blueLight,
        xA,
        yA
      );

      // (b)
      self.utils.renderBlocks(
        self.blocks.bottom,
        'bottom',
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
      for (let i = 0; i < totalBlocks; i++) {
        // Blocks
        const curX = x0 + i * blockWidth;
        const curBlock = game.add.geom.rect(
          curX,
          y0,
          blockWidth,
          self.control.blockHeight,
          fillColor,
          0.5,
          lineColor,
          4
        );
        curBlock.position = blockType;
        curBlock.index = i;
        curBlock.finalX = x0;
        blocks.list.push(curBlock);

        // Auxiliar blocks (lower alpha)
        const alpha = 0.2;
        const curYAux = y0 + self.control.blockHeight + 10;
        const curAuxBlock = game.add.geom.rect(
          curX,
          curYAux,
          blockWidth,
          self.control.blockHeight,
          fillColor,
          alpha,
          lineColor,
          1
        );
        blocks.auxBlocks.push(curAuxBlock);
      }

      // Label - number of blocks (on the right)
      let yLabel = y0 + self.control.blockHeight / 2 + 10;
      const xLabel = x0 + self.control.blockWidth + 35;
      const font = {
        ...textStyles.h4_,
        font: 'bold ' + textStyles.h4_.font,
        fill: lineColor,
      };
      blocks.label = game.add.text(xLabel, yLabel, blocks.list.length, font);
      blocks.label.alpha = showFractions ? 1 : 0;

      // 'selected blocks/fraction' label for (a) : at the bottom of (a)
      yLabel = y0 + self.control.blockHeight + 40;

      blocks.fractions[0] = game.add.text(xLabel, yLabel, '', font);
      blocks.fractions[1] = game.add.geom.line(
        xLabel,
        yLabel + 10,
        xLabel + 50,
        yLabel + 10,
        2,
        lineColor
      );
      blocks.fractions[1].anchor(0.5, 0);
      blocks.fractions[0].alpha = 0;
      blocks.fractions[1].alpha = 0;

      // Invalid selection text
      blocks.warningText = game.add.text(
        context.canvas.width / 2,
        y0 - 20,
        game.lang.s2_error_msg,
        { ...font, font: textStyles.h4_.font }
      );
      blocks.warningText.alpha = 0;
    },
    renderCharacters: function () {
      self.kidAnimation = game.add.sprite(
        100,
        context.canvas.height - 128 * 1.5,
        'kid_standing',
        0,
        1.2
      );
      self.kidAnimation.anchor(0.5, 0.7);
      self.kidAnimation.curFrame = 3;
    },
    renderMainUI: () => {
      // Intro text
      const treatedMessage = game.lang.squareTwo_intro.split('\\n');
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
      const uiList = [
        ...self.blocks.top.list,
        ...self.blocks.bottom.list,
        ...self.blocks.top.fractions,
        ...self.blocks.bottom.fractions,
      ];
      moveList(uiList, -400, 0);

      const font = textStyles.fraction;
      font.fill = colors.black;
      font.align = 'center';

      const nominators = [
        self.blocks.top.selectedAmount,
        self.blocks.bottom.selectedAmount,
      ];
      const denominators = [
        self.blocks.top.list.length,
        self.blocks.bottom.list.length,
      ];

      if (gameMode === 'b') {
        const leftNom = nominators[0];
        const leftDenom = denominators[0];
        nominators[0] = nominators[1];
        denominators[0] = denominators[1];
        nominators[1] = leftNom;
        denominators[1] = leftDenom;
      }

      const renderList = [];

      const padding = 100;
      const offsetX = 100;

      const cardHeight = 400;

      const x0 = padding + 400;
      const y0 = context.canvas.height / 2;
      let nextX = x0;

      const cardX = x0 - padding;
      const cardY = y0;

      // Card
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

      renderList.push(
        game.add.text(
          nextX,
          y0,
          nominators[0] + '\n' + denominators[0],
          font,
          70
        )
      );
      const topFractionLine = game.add.geom.rect(
        nextX,
        y0 + 10,
        100,
        4,
        colors.black,
        4
      );
      topFractionLine.anchor(0.5, 0);
      renderList.push(topFractionLine);

      font.fill = self.control.isCorrect ? colors.green : colors.red;
      nextX += offsetX;
      renderList.push(
        game.add.text(nextX, y0 + 35, self.control.isCorrect ? '=' : '≠', font)
      );

      font.fill = colors.black;
      nextX += offsetX;
      renderList.push(
        game.add.text(
          nextX,
          y0,
          nominators[1] + '\n' + denominators[1],
          font,
          70
        )
      );
      const bottomFractionLine = game.add.geom.rect(
        nextX,
        y0 + 10,
        100,
        4,
        colors.black,
        4
      );
      bottomFractionLine.anchor(0.5, 0);
      renderList.push(bottomFractionLine);

      //let resultWidth = ''.length * widthOfChar;
      const cardWidth = nextX - x0 + padding * 2;
      card.width = cardWidth;

      const endSignX =
        (context.canvas.width - cardWidth) / 2 + cardWidth + 400 + 50;

      // Center Card
      moveList(renderList, (context.canvas.width - cardWidth) / 2, 0);

      self.fractionOperationUI = renderList;

      return endSignX;
    },
    renderExplanationUI: () => {
      const cx = context.canvas.width / 2;
      const cy = context.canvas.height / 2;
      const withNewlines = (s) =>
        s == null ? '' : String(s).replace(/\\n/g, '\n');

      // WRONG ANSWER: simple small card (no equation/bars)
      if (!self.control.isCorrect) {
        const errW = 680; const errH = 220;
        const errLeft = cx - errW / 2; const errTop = cy - errH / 2;
        const errBottom = errTop + errH;
        game.add.geom.rect(errLeft, errTop, errW, errH, colors.white, 0.97, colors.red, 4);
        game.add.text(cx, cy - 12,
          game.lang.s2_explain_body_wrong,
          { ...textStyles.h3_, fill: colors.red }
        );
        const btnW = 360; const btnH = 70; const btnCY = errBottom - 52;
        self.ui.explanation.button = game.add.geom.rect(
          cx - btnW / 2, btnCY - btnH / 2, btnW, btnH, colors.red
        );
        self.ui.explanation.text = game.add.text(cx, btnCY + 16, game.lang.retry, textStyles.btn);
        self.control.showExplanation = true;
        return;
      }

      // CORRECT ANSWER: full explanation card
      // Image is 1298×816 — all positions are relative to image coordinates
      const imgW = 1298; const imgH = 816;
      const cardLeft = cx - imgW / 2;  // 311
      const cardTop  = cy - imgH / 2;  // 132
      const cardBottom = cardTop + imgH; // 948

      // 1. Background image + title text (image has the 🔍 icon, we add the text)
      game.add.image(cx, cy, gameMode === 'b' ? 'result-bg-multiply' : 'result-bg').anchor(0.5, 0.5);
      const titleText = withNewlines(game.lang.s2_explain_title);
      const titleY = cardTop + (titleText.includes('\n') ? 42 : 62);
      game.add.text(cx, titleY, titleText, {
        ...textStyles.h3_, fill: colors.blueDark, font: 'bold ' + textStyles.h3_.font,
      });

      // Fraction values
      let bigNum, bigDen, bigLineColor, bigFillColor;
      let smallNum, smallDen, smallLineColor, smallFillColor;
      if (gameMode !== 'b') {
        bigNum = self.blocks.top.selectedAmount; bigDen = self.blocks.top.list.length;
        bigLineColor = colors.blueDark; bigFillColor = colors.blue;
        smallNum = self.blocks.bottom.selectedAmount; smallDen = self.blocks.bottom.list.length;
        smallLineColor = colors.greenDark; smallFillColor = colors.green;
      } else {
        bigNum = self.blocks.bottom.selectedAmount; bigDen = self.blocks.bottom.list.length;
        bigLineColor = colors.greenDark; bigFillColor = colors.green;
        smallNum = self.blocks.top.selectedAmount; smallDen = self.blocks.top.list.length;
        smallLineColor = colors.blueDark; smallFillColor = colors.blue;
      }
      const factorRaw = (gameMode === 'b') ? smallDen / bigDen : bigDen / smallDen;
      const factor = Number.isInteger(factorRaw) ? factorRaw : parseFloat(factorRaw.toFixed(1));
      const fracStyle = { ...textStyles.fraction, fill: colors.blueDark, align: 'center' };

      // 2. Fraction numbers — placed over the image's fraction bar template
      // Image fraction bar LINE is at ~y=250 from image top; numY+32 should align with it
      // x centres measured from image: left≈24%, mid≈47%, right≈75%
      const numY = cardTop + 238; // numerator baseline
      const c1 = cardLeft + 315;  // left fraction  (≈ 626)
      const c3 = cardLeft + (gameMode === 'b' ? 635 : 610);  // centre fraction (≈ 921)
      const c5 = cardLeft + 975;  // right fraction  (≈ 1286)
      game.add.text(c1, numY, bigNum + '\n' + bigDen, fracStyle, 65);
      game.add.text(c3, numY, factor + '\n' + factor, fracStyle, 65);
      game.add.text(c5, numY, smallNum + '\n' + smallDen, fracStyle, 65);

      // 3. Block bars + badge — centred around the image's star area
      // Star centre is ~49% of image width, ~51% of image height
      const badgeCx = cx; // star centre aligned to screen centre
      const barsTop = cardTop + 390; // ≈ 522
      const barH = 72; const barW = 270; const badgeW = 210; const barGap = 95;
      const leftBarLeft  = badgeCx - badgeW / 2 - barGap - barW;
      const rightBarLeft = badgeCx + badgeW / 2 + barGap;
      const bwBig = barW / bigDen;
      for (let i = 0; i < bigDen; i++) {
        game.add.geom.rect(leftBarLeft + i * bwBig, barsTop, bwBig, barH,
          i < bigNum ? bigFillColor : colors.blueLight,
          i < bigNum ? 0.75 : 0.25, bigLineColor, 2);
      }
      const bwSmall = barW / smallDen;
      for (let i = 0; i < smallDen; i++) {
        game.add.geom.rect(rightBarLeft + i * bwSmall, barsTop, bwSmall, barH,
          i < smallNum ? smallFillColor : colors.greenLight,
          i < smallNum ? 0.75 : 0.25, smallLineColor, 2);
      }
      // Badge — image already draws the star, just overlay the text
      const badgeCenterY = barsTop + barH / 2;
      const badgeFontSize = Number.isInteger(factorRaw) ? 40 : 30;
      game.add.text(cx, badgeCenterY - 8, factor + '/' + factor + ' = 1', {
        ...textStyles.h4_, fill: colors.blueDark, font: `bold ${badgeFontSize}px Arial, sans-serif`,
      });

      // 4. Body text — below the star area, image body zone starts ~560px from image top
      const bodyKey = (gameMode === 'b') ? 's2_explain_body_correct_multiply' : 's2_explain_body_correct';
      const bodyParts = withNewlines(game.lang[bodyKey]).split('\n');
      const line1Raw = bodyParts[0];
      const wrapAt = 42;
      const wrapPos = line1Raw.lastIndexOf(' ', wrapAt);
      const line1 = (wrapPos > 0 && line1Raw.length > wrapAt)
        ? line1Raw.slice(0, wrapPos) + '\n' + line1Raw.slice(wrapPos + 1)
        : line1Raw;
      const line2 = (game.lang.s2_explain_body_factor_prefix) +
        ' ' + factor + '/' + factor + ' ' +
        (game.lang.s2_explain_body_factor_suffix);
      const line3 = bodyParts[1];

      const bodyStyle = { ...textStyles.p_, fill: colors.blueDark, font: 'bold 33px Arial, sans-serif' };
      const bodyStyleNormal = { ...textStyles.p_, fill: colors.blueDark, font: '33px Arial, sans-serif' };
      const bodyY = cardTop + 550;
      game.add.text(cx, bodyY, line1, bodyStyle, 38);
      game.add.text(cx, bodyY + 84, line2, bodyStyleNormal);
      game.add.text(cx, bodyY + 122, line3, bodyStyleNormal);

      // 5. Continue button
      const btnW = 400; const btnH = 75; const btnCenterY = cardBottom - 62;
      self.ui.explanation.button = game.add.geom.rect(
        cx - btnW / 2, btnCenterY - btnH / 2, btnW, btnH, colors.green
      );
      self.ui.explanation.text = game.add.text(cx, btnCenterY + 16, game.lang.continue, textStyles.btn);
      self.control.showExplanation = true;
    },
    renderEndUI: () => {
      let btnColor = colors.green;
      let btnText = game.lang.continue;

      if (!self.control.isCorrect) {
        btnColor = colors.red;
        btnText = game.lang.retry;
      }

      // continue button
      self.ui.continue.button = game.add.geom.rect(
        context.canvas.width / 2 + 400,
        context.canvas.height / 2 + 280,
        450,
        100,
        btnColor
      );
      self.ui.continue.button.anchor(0.5, 0.5);
      self.ui.continue.text = game.add.text(
        context.canvas.width / 2 + 400,
        context.canvas.height / 2 + 16 + 280,
        btnText,
        textStyles.btn
      );
    },
    startDelayHandler: () => {
      game.timer.stop();

      self.control.animationDelay++;

      if (self.control.animationDelay === 50) {
        self.ui.message[0].alpha = 0;
        self.utils.checkAnswer();
        self.control.animationDelay = 0;
        self.control.startEndAnimation = true;
      }
    },

    // UPDATE
    moveBlocks: function () {
      ['top', 'bottom'].forEach((cur) => {
        if (self.blocks[cur].animate) {
          // Lower selected blocks
          for (let i = 0; i < self.blocks[cur].selectedAmount; i++) {
            self.blocks[cur].list[i].y += 2;
          }

          // After fully lowering blocks, set fraction value
          if (self.blocks[cur].list[0].y >= self.blocks[cur].auxBlocks[0].y) {
            self.blocks[cur].fractions[0].name =
              self.blocks[cur].selectedAmount +
              '\n' +
              self.blocks[cur].list.length;
            self.blocks[cur].animate = false;
          }
        }
      });
    },
    checkAnswer: function () {
      self.control.isCorrect =
        self.blocks.top.selectedAmount / self.blocks.top.list.length ==
        self.blocks.bottom.selectedAmount / self.blocks.bottom.list.length;

      if (self.control.isCorrect) {
        // Correct: hide blocks to make room for explanation card
        ['top', 'bottom'].forEach((s) => {
          self.blocks[s].list.forEach((b) => (b.alpha = 0));
          self.blocks[s].auxBlocks.forEach((b) => (b.alpha = 0));
          self.blocks[s].fractions.forEach((b) => { if (b) b.alpha = 0; });
          if (self.blocks[s].label) self.blocks[s].label.alpha = 0;
          if (self.blocks[s].warningText) self.blocks[s].warningText.alpha = 0;
        });
        if (audioStatus) game.audio.okSound.play();
        completedLevels++;
        if (isDebugMode) console.log('Completed Levels: ' + completedLevels);
      } else {
        // Wrong: keep main blocks visible but hide aux blocks (they don't shift with renderOperationUI)
        ['top', 'bottom'].forEach((s) => {
          self.blocks[s].auxBlocks.forEach((b) => (b.alpha = 0));
        });
        if (audioStatus) game.audio.errorSound.play();
      }

      self.fetch.postScore();
    },
    runEndAnimation: function () {
      self.control.animationDelay++;

      if (self.control.animationDelay === 1) {
        if (self.control.isCorrect) {
          self.utils.renderExplanationUI();
        } else {
          const x = self.utils.renderOperationUI();
          game.add.image(x, context.canvas.height / 3, 'answer_wrong').anchor(0.5, 0.5);
          self.utils.renderEndUI();
          self.control.showEndInfo = true;
        }
      }
    },
    endLevel: function () {
      game.state.start('map');
    },

    // HANDLERS
    /**
     * Function called by self.onInputDown() when player clicked a valid rectangle.
     *
     * @param {object} curBlock clicked rectangle : can be self.blocks.top.list[i] or self.blocks.bottom.list[i]
     */
    clickSquareHandler: function (curBlock) {
      const curSet = curBlock.position;

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
        self.blocks[curSet].selectedAmount = curBlock.index + 1;

        // Set fraction x position
        const newX =
          curBlock.finalX +
          self.blocks[curSet].selectedAmount *
            (self.control.blockWidth / self.blocks[curSet].list.length) +
          40;

        self.blocks[curSet].fractions[0].x = newX;
        self.blocks[curSet].fractions[1].x = newX;

        self.blocks[curSet].fractions[0].name = `${curBlock.index + 1}\n${
          self.blocks[curSet].list.length
        }`;

        // End fraction line
        self.blocks[curSet].fractions[1].alpha = showFractions ? 1 : 0;

        self.blocks[curSet].hasClicked = true; // Inform player have clicked in current block set
        self.blocks[curSet].animate = true; // Let it initiate animation
      }

      game.render.all();
    },
    /**
     * Function called by self.onInputOver() when cursor is over a valid rectangle.
     *
     * @param {object} curBlock rectangle the cursor is over : can be self.blocks.top.list[i] or self.blocks.bottom.list[i]
     */
    overSquareHandler: function (curBlock) {
      const curSet = curBlock.position;

      if (!self.blocks[curSet].hasClicked) {
        // self.blocks.top.hasClicked || self.blocks.bottom.hasClicked
        // If over fraction 'n/n' shows warning message not allowing it
        if (curBlock.index == self.blocks[curSet].list.length - 1) {
          const otherSet = curSet == 'top' ? 'bottom' : 'top';

          self.blocks[curSet].warningText.alpha = 1;
          self.blocks[otherSet].warningText.alpha = 0;

          self.utils.outSquareHandler(curSet);
        } else {
          document.body.style.cursor = 'pointer';

          self.blocks.top.warningText.alpha = 0;
          self.blocks.bottom.warningText.alpha = 0;

          // Selected blocks become fully visible
          for (let i in self.blocks[curSet].list) {
            self.blocks[curSet].list[i].alpha = i <= curBlock.index ? 1 : 0.5;
          }

          self.blocks[curSet].fractions[0].name = curBlock.index + 1; // Nominator : selected blocks

          const newX =
            curBlock.finalX +
            (curBlock.index + 1) *
              (self.control.blockWidth / self.blocks[curSet].list.length) +
            25;
          self.blocks[curSet].fractions[0].x = newX;
          self.blocks[curSet].fractions[1].x = newX;

          // End fraction nominator and denominator
          self.blocks[curSet].fractions[0].alpha = showFractions ? 1 : 0;
        }
      }
    },
    /**
     * Function called (by self.onInputOver() and self.utils.overSquareHandler()) when cursor is out of a valid rectangle.
     *
     * @param {object} curSet set of rectangles : can be top (self.blocks.top) or bottom (self.blocks.bottom)
     */
    outSquareHandler: function (curSet) {
      if (!self.blocks[curSet].hasClicked) {
        self.blocks[curSet].fractions[0].alpha = 0;
        self.blocks[curSet].fractions[1].alpha = 0;

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

      // Pre-start screen: only handle SIM/NÃO + navigation
      if (!self.control.started) {
        if (
          self.ui.startChoice &&
          self.ui.startChoice.yes &&
          self.ui.startChoice.yes.button &&
          game.math.isOverIcon(x, y, self.ui.startChoice.yes.button)
        ) {
          if (audioStatus) game.audio.popSound.play();
          self.control.challengeAnsweredYes = true;
          self.utils.updateChallengeChoiceUI();
          self.utils.startGame();
          return;
        }
        if (
          self.ui.startChoice &&
          self.ui.startChoice.no &&
          self.ui.startChoice.no.button &&
          game.math.isOverIcon(x, y, self.ui.startChoice.no.button)
        ) {
          if (audioStatus) game.audio.popSound.play();
          self.control.challengeAnsweredYes = false;
          self.utils.updateChallengeChoiceUI();
          self.utils.startGame();
          return;
        }

        navigation.onInputDown(x, y);
        game.render.all();
        return;
      }

      // Click block in (a)
      self.blocks.top.list.forEach((cur) => {
        if (game.math.isOverIcon(x, y, cur)) self.utils.clickSquareHandler(cur);
      });

      // Click block in (b)
      self.blocks.bottom.list.forEach((cur) => {
        if (game.math.isOverIcon(x, y, cur)) self.utils.clickSquareHandler(cur);
      });

      // Explanation screen continue/retry button
      if (self.control.showExplanation) {
        if (game.math.isOverIcon(x, y, self.ui.explanation.button)) {
          if (audioStatus) game.audio.popSound.play();
          canGoToNextMapPosition = self.control.isCorrect;
          self.utils.endLevel();
        }
      }

      // Continue button
      if (self.control.showEndInfo) {
        if (game.math.isOverIcon(x, y, self.ui.continue.button)) {
          if (audioStatus) game.audio.popSound.play();
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

      // Pre-start screen hover: SIM/NÃO + navigation
      if (!self.control.started) {
        let isOverChoice = false;

        const choiceTextStyle = { ...textStyles.h3_, fill: colors.blueDark, font: 'bold ' + textStyles.h3_.font };

        const yesBtn = self.ui.startChoice && self.ui.startChoice.yes && self.ui.startChoice.yes.button;
        const noBtn = self.ui.startChoice && self.ui.startChoice.no && self.ui.startChoice.no.button;
        const yesVisual = self.ui.startChoice && self.ui.startChoice.yes && self.ui.startChoice.yes.visual;
        const noVisual = self.ui.startChoice && self.ui.startChoice.no && self.ui.startChoice.no.visual;

        if (yesBtn && game.math.isOverIcon(x, y, yesBtn)) {
          isOverChoice = true;
          document.body.style.cursor = 'pointer';
          if (self.ui.startChoice.yes.text) self.ui.startChoice.yes.text.style = choiceTextStyle;
          if (yesVisual && yesVisual.outerParts && yesVisual.innerParts) {
            yesVisual.outerParts.forEach((p) => { p.shadowBlur = 10; });
            yesVisual.innerParts.forEach((p) => { p.fillColor = '#e8f0fc'; p.lineColor = '#e8f0fc'; });
          }
        } else if (yesBtn) {
          if (self.ui.startChoice.yes.text) self.ui.startChoice.yes.text.style = choiceTextStyle;
          if (yesVisual && yesVisual.outerParts && yesVisual.innerParts) {
            yesVisual.outerParts.forEach((p) => { p.shadowBlur = 8; });
            yesVisual.innerParts.forEach((p) => { p.fillColor = colors.white; p.lineColor = colors.white; });
          }
        }

        if (noBtn && game.math.isOverIcon(x, y, noBtn)) {
          isOverChoice = true;
          document.body.style.cursor = 'pointer';
          if (self.ui.startChoice.no.text) self.ui.startChoice.no.text.style = choiceTextStyle;
          if (noVisual && noVisual.outerParts && noVisual.innerParts) {
            noVisual.outerParts.forEach((p) => { p.shadowBlur = 10; });
            noVisual.innerParts.forEach((p) => { p.fillColor = '#e8f0fc'; p.lineColor = '#e8f0fc'; });
          }
        } else if (noBtn) {
          if (self.ui.startChoice.no.text) self.ui.startChoice.no.text.style = choiceTextStyle;
          if (noVisual && noVisual.outerParts && noVisual.innerParts) {
            noVisual.outerParts.forEach((p) => { p.shadowBlur = 8; });
            noVisual.innerParts.forEach((p) => { p.fillColor = colors.white; p.lineColor = colors.white; });
          }
        }

        if (!isOverChoice) document.body.style.cursor = 'auto';
        navigation.onInputOver(x, y);
        game.render.all();
        return;
      }
      let flagA = false;
      let flagB = false;

      // Mouse over (a) : show fraction
      self.blocks.top.list.forEach((cur) => {
        if (game.math.isOverIcon(x, y, cur)) {
          flagA = true;
          self.utils.overSquareHandler(cur);
        }
      });
      if (!flagA) self.utils.outSquareHandler('top');

      // Mouse over (b) : show fraction
      self.blocks.bottom.list.forEach((cur) => {
        if (game.math.isOverIcon(x, y, cur)) {
          flagB = true;
          self.utils.overSquareHandler(cur);
        }
      });
      if (!flagB) self.utils.outSquareHandler('bottom');

      if (!flagA && !flagB) document.body.style.cursor = 'auto';

      // Explanation button hover
      if (self.control.showExplanation && self.ui.explanation.button) {
        if (game.math.isOverIcon(x, y, self.ui.explanation.button)) {
          document.body.style.cursor = 'pointer';
          self.ui.explanation.button.scale = self.ui.explanation.button.initialScale * 1.1;
          self.ui.explanation.text.style = textStyles.btnLg;
        } else {
          self.ui.explanation.button.scale = self.ui.explanation.button.initialScale * 1;
          self.ui.explanation.text.style = textStyles.btn;
        }
      }

      // Continue button
      if (self.control.showEndInfo) {
        if (game.math.isOverIcon(x, y, self.ui.continue.button)) {
          // If pointer is over icon
          document.body.style.cursor = 'pointer';
          self.ui.continue.button.scale =
            self.ui.continue.button.initialScale * 1.1;
          self.ui.continue.text.style = textStyles.btnLg;
        } else {
          // If pointer is not over icon
          document.body.style.cursor = 'auto';
          self.ui.continue.button.scale =
            self.ui.continue.button.initialScale * 1;
          self.ui.continue.text.style = textStyles.btn;
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
        '&line_oper=equal' +
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
        self.blocks.top.list.length +
        ', valueA: ' +
        self.blocks.top.selectedAmount +
        ', numBlocksB: ' +
        self.blocks.bottom.list.length +
        ', valueB: ' +
        self.blocks.bottom.selectedAmount +
        '&challenge_answered_yes=' +
        self.control.challengeAnsweredYes;

      // FOR MOODLE
      sendToDatabase(data);
    },
  },
};
