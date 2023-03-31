/******************************
 * This file holds game states.
 ******************************/

/** [GAME STATE]
 *
 * .....circleOne.... = gameName
 * ....../....\......
 * .....a......a..... = gameMode
 * .......\./........
 * ........|.........
 * ....../.|.\.......
 * .plus.minus.mixed. = gameOperation
 * ......\.|./.......
 * ........|.........
 * ....1,2,3,4,5..... = gameDifficulty
 *
 * Character : kid/balloon
 * Theme : flying in a balloon
 * Concept : 'How much the kid has to walk to get to the balloon?'
 * Represent fractions as : circles/arcs
 *
 * Game modes can be :
 *
 *   a : Player can place balloon position
 *       Place balloon in position (so the kid can get to it)
 *   b : Player can select # of circles
 *       Selects number of circles (that represent distance kid needs to walk to get to the balloon)
 *
 * Operations can be :
 *
 *   plus : addition of fractions
 *     Represented by : kid going to the right (floor positions 0..5)
 *   minus : subtraction of fractions
 *     Represented by: kid going to the left (floor positions 5..0)
 *   mixed : Mix addition and subtraction of fractions in same
 *     Represented by: kid going to the left (floor positions 0..5)
 *
 * @namespace
 */
const circleOne = {
  /**
   * Main code
   */
  divisorsList: undefined,
  road: undefined,
  control: undefined,
  animation: undefined,
  walkedPath: undefined,
  circles: undefined,
  balloonX: undefined,
  divisorsList: undefined,
  // end b only
  kid: undefined,
  balloon: undefined,
  basket: undefined,
  help: undefined,

  create: function () {
    this.divisorsList = '';

    this.road = {
      x: 150,
      y: context.canvas.height - game.image['floor_grass'].width * 1.5,
      width: 1620,
    };
    const validPath = {
      x0: undefined,
      y0: undefined,
      distanceBetweenPoints: undefined,
    };

    const pointWidth = (game.sprite['map_place'].width / 2) * 0.45;
    validPath.distanceBetweenPoints =
      (context.canvas.width - this.road.x * 2 - pointWidth) / 5; // Distance between road points
    validPath.y0 = this.road.y + 20;
    validPath.x0 =
      gameOperation == 'minus'
        ? this.road.x + 5 * validPath.distanceBetweenPoints - pointWidth / 2
        : this.road.x + pointWidth / 2; // Initial 'x' coordinate for the kid and the baloon

    const diameter =
      game.math.getRadiusFromCircunference(validPath.distanceBetweenPoints) * 2; // (Fixed) diameter for circles
    this.circles = {
      diameter: diameter,
      radius: diameter / 2,
      cur: 0, // Current circle index
      list: [], // Circles objects of current level
    };

    this.control = {
      checkAnswer: false, // Check kid inside ballon's basket
      hasClicked: false, // Air ballon positioned
      result: false, // Game is correct
      correctX: validPath.x0, // Ending position, is accumulative
      nextX: undefined,
      hasBaseDifficulty: false, // Will validate that level isnt too easy (has at least one '1/difficulty' fraction)
      endIndex: null,
      // mode 'b' exclusive
      fractionIndex: -1, // Index of clicked circle (game (b))
      numberOfPlusFractions: undefined,
    };

    const walkOffsetX = 2;
    const walksPerDistanceBetweenPoints =
      validPath.distanceBetweenPoints / walkOffsetX;
    const angleOffset = 360 / walksPerDistanceBetweenPoints;

    this.animation = {
      list: {
        left: undefined,
        right: undefined,
      },
      invertDirection: undefined,
      animateKid: false,
      animateBalloon: false,
      counter: undefined,
      walkOffsetX: walkOffsetX,
      angleOffset: angleOffset,
    };

    renderBackground('farmRoad');
    this.utils.renderRoad(validPath);

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
        true, // Left buttons
        true,
        false, // Right buttons
        'customMenu',
        this.utils.showAnswer
      );
    }

    this.restart = this.utils.renderCircles(validPath);
    this.utils.renderCharacters(validPath);

    // Help pointer
    this.help = game.add.image(0, 0, 'pointer', 0.5);
    this.help.anchor(0.5, 0);
    this.help.alpha = 0;

    // Text
    game.add.text(
      context.canvas.width / 2,
      200,
      'Onde o balão deve ficar para que o menino consiga chegar até ele?',
      textStyles.h1_
    );

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
    // Start animation
    if (self.animation.animateKid) {
      let lowerCircles = undefined;
      let curCircle = self.circles.list[self.circles.cur];
      let curDirec = curCircle.info.direc;

      // Move
      self.circles.list.forEach((circle) => {
        circle.x += this.animation.walkOffsetX * curDirec;
      });
      self.kid.x += this.animation.walkOffsetX * curDirec;
      self.walkedPath.width += this.animation.walkOffsetX * curDirec;
      self.walkedPath.lineColor = curCircle.lineColor;

      // Update arc
      curCircle.info.angleDegree += this.animation.angleOffset * curDirec;
      curCircle.angleEnd = game.math.degreeToRad(curCircle.info.angleDegree);

      // When finish current circle
      if (curCircle.info.direction === 'right') {
        lowerCircles = curCircle.x >= self.control.nextX;
      } else if (curCircle.info.direction === 'left') {
        lowerCircles = curCircle.x <= self.control.nextX;
        // If just changed from 'right' to 'left' inform to change direction of kid animation
        if (
          self.animation.invertDirection === undefined &&
          self.circles.cur > 0 &&
          self.circles.list[self.circles.cur - 1].info.direction === 'right'
        ) {
          self.animation.invertDirection = true;
        }
      }

      // Change direction of kid animation
      if (self.animation.invertDirection) {
        self.animation.invertDirection = false;
        game.animation.stop(self.kid.animation[0]);

        self.kid.animation = self.animation.list.left;
        self.kid.curFrame = 23;
        game.animation.play('left');
      }

      if (lowerCircles) {
        // Hide current circle
        curCircle.alpha = 0;

        // Lowers kid and other circles
        self.circles.list.forEach((circle) => {
          circle.y += self.circles.diameter;
        });
        self.kid.y += self.circles.diameter;

        self.circles.cur++; // Update index of current circle

        if (self.circles.list[self.circles.cur]) {
          curCircle = self.circles.list[self.circles.cur];
          curDirec = curCircle.info.direc;
          self.control.nextX += curCircle.info.distance * curDirec; // Update next position
        }
      }

      // When finish all circles (final position)
      if (
        self.circles.cur === self.circles.list.length ||
        curCircle.alpha == 0
      ) {
        self.animation.animateKid = false;
        self.control.checkAnswer = true;
      }
    }

    // Check if kid is inside the basket
    if (self.control.checkAnswer) {
      game.timer.stop();

      game.animation.stop(self.kid.animation[0]);

      if (self.utils.isOverlap(self.basket, self.kid)) {
        self.control.result = true; // Answer is correct
        self.kid.curFrame = self.kid.curFrame < 12 ? 24 : 25;
        if (audioStatus) game.audio.okSound.play();
        game.add
          .image(
            context.canvas.width / 2,
            context.canvas.height / 2,
            'answer_correct'
          )
          .anchor(0.5, 0.5);
        completedLevels++;
        if (isDebugMode) console.log('Completed Levels: ' + completedLevels);
      } else {
        self.control.result = false; // Answer is incorrect
        if (audioStatus) game.audio.errorSound.play();
        game.add
          .image(
            context.canvas.width / 2,
            context.canvas.height / 2,
            'answer_wrong'
          )
          .anchor(0.5, 0.5);
      }

      self.server.postScore();

      self.animation.animateBalloon = true;
      self.control.checkAnswer = false;

      self.animation.counter = 0;
    }

    // Balloon flying animation
    if (self.animation.animateBalloon) {
      self.animation.counter++;
      self.balloon.y -= 2;
      self.basket.y -= 2;

      if (self.control.result) self.kid.y -= 2;

      if (self.animation.counter >= 140) {
        if (self.control.result) canGoToNextMapPosition = true;
        else canGoToNextMapPosition = false;

        game.state.start('map');
      }
    }

    game.render.all();
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

      // GAME MODE A : click road
      if (gameMode == 'a') {
        const valid =
          y > 150 && x >= self.road.x && x <= self.road.x + self.road.width;
        if (valid) self.utils.clickHandler(x);
      }

      // GAME MODE B : click circle
      if (gameMode == 'b') {
        self.circles.list.forEach((circle) => {
          const valid =
            game.math.distanceToPointer(
              x,
              circle.xWithAnchor,
              y,
              circle.yWithAnchor
            ) <=
            (cur.diameter / 2) * circle.scale;
          if (valid) self.utils.clickHandler(circle);
        });
      }

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
      let flag = false;

      // GAME MODE A : balloon follow mouse
      if (gameMode == 'a' && !self.control.hasClicked) {
        if (
          game.math.distanceToPointer(x, self.balloon.x, y, self.balloon.y) > 8
        ) {
          self.balloon.x = x;
          self.basket.x = x;
        }
        document.body.style.cursor = 'auto';
      }

      // GAME MODE B : hover circle
      if (gameMode == 'b' && !self.control.hasClicked) {
        self.circles.list.forEach((circle) => {
          const valid =
            game.math.distanceToPointer(
              x,
              circle.xWithAnchor,
              y,
              circle.yWithAnchor
            ) <=
            (circle.diameter / 2) * circle.scale;
          if (valid) {
            self.utils.overCircleHandler(circle);
            flag = true;
          }
        });
        if (!flag) self.utils.outCircleHandler();
      }

      navigationIcons.onInputOver(x, y);

      game.render.all();
    },
  },

  server: {
    /**
     * Saves players data after level ends - to be sent to database <br>
     *
     * Attention: the 'line_' prefix data table must be compatible to data table fields (MySQL server)
     *
     * @see /php/squareOne.js
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
        self.control.result +
        '&line_time=' +
        game.timer.elapsed +
        '&line_deta=' +
        'numCircles:' +
        self.circles.list.length +
        ', valCircles: ' +
        self.divisorsList +
        ' balloonX: ' +
        self.basket.x +
        ', selIndex: ' +
        self.control.fractionIndex;

      // FOR MOODLE
      sendToDatabase(data);
    },
  },

  utils: {
    renderRoad: function (validPath) {
      // Road points
      const directionModifier = gameOperation === 'minus' ? -1 : 1;
      for (let i = 0; i <= 5; i++) {
        game.add
          .sprite(
            validPath.x0 +
              i * validPath.distanceBetweenPoints * directionModifier,
            validPath.y0,
            'map_place',
            0,
            0.45
          )
          .anchor(0.5, 0.5);
        game.add.geom
          .circle(
            validPath.x0 +
              i * validPath.distanceBetweenPoints * directionModifier,
            validPath.y0 + 55,
            50,
            undefined,
            0,
            colors.white,
            0.7
          )
          .anchor(0, 0.25);
        game.add.text(
          validPath.x0 +
            i * validPath.distanceBetweenPoints * directionModifier,
          validPath.y0 + 55,
          i,
          {
            ...textStyles.h2_,
            font: 'bold ' + textStyles.h2_.font,
            fill: directionModifier == 1 ? colors.green : colors.red,
          }
        );
      }

      self.walkedPath = game.add.geom.rect(
        validPath.x0 - 1,
        validPath.y0,
        1,
        1,
        colors.blue,
        2
      );
      self.walkedPath.alpha = 0;
    },

    renderCircles: function (validPath) {
      // Balloon place
      let restart = false;
      const directionModifier = gameOperation == 'minus' ? -1 : 1;
      const fractionX =
        validPath.x0 +
        self.circles.diameter * directionModifier -
        15 * directionModifier;
      const font = {
        ...textStyles.h3_,
        font: 'bold ' + textStyles.h2_.font,
      };
      self.balloonX = context.canvas.width / 2;

      // Number of circles
      const max =
        gameOperation == 'mixed' || gameMode == 'b' ? 6 : curMapPosition + 1;
      const min =
        gameOperation == 'mixed' && curMapPosition < 2 ? 2 : curMapPosition; // Mixed level has at least 2 fractions
      const total = game.math.randomInRange(min, max); // Total number of circles
      // for mode 'b'
      self.control.numberOfPlusFractions = game.math.randomInRange(
        1,
        total - 1
      );

      for (let i = 0; i < total; i++) {
        let curDirection = undefined;
        let curLineColor = undefined;
        let curFillColor = undefined;
        let curAngleDegree = undefined;
        let curIsCounterclockwise = undefined;
        let curFractionItems = undefined;
        let curCircle = undefined;
        const curCircleInfo = {
          direction: undefined,
          direc: undefined,
          distance: undefined,
          angle: undefined,
          label: [],
        };
        const curDivisor = game.math.randomInRange(1, gameDifficulty); // Set fraction 'divisor' (depends on difficulty)

        if (curDivisor === gameDifficulty)
          self.control.hasBaseDifficulty = true; // True if after for ends has at least 1 '1/difficulty' fraction

        self.divisorsList += curDivisor + ','; // Add this divisor to the list of divisors (for postScore())

        // Set each circle direction
        switch (gameOperation) {
          case 'plus':
            curDirection = 'right';
            break;
          case 'minus':
            curDirection = 'left';
            break;
          case 'mixed':
            curDirection =
              i < self.control.numberOfPlusFractions ? 'right' : 'left';
            break;
        }
        curCircleInfo.direction = curDirection;

        // Set each circle visual info
        if (curDirection === 'right') {
          curIsCounterclockwise = true;
          curLineColor = colors.green;
          curFillColor = colors.greenLight;
          curCircleInfo.direc = 1;
        } else {
          curIsCounterclockwise = false;
          curLineColor = colors.red;
          curFillColor = colors.redLight;
          curCircleInfo.direc = -1;
        }
        font.fill = curLineColor;

        const curCircleY =
          validPath.y0 - self.circles.diameter / 2 - i * self.circles.diameter;

        // Draw circles
        if (curDivisor === 1) {
          curAngleDegree = 360;
          curCircle = game.add.geom.circle(
            validPath.x0,
            curCircleY,
            self.circles.diameter,
            curLineColor,
            3,
            curFillColor,
            1
          );
          curCircle.counterclockwise = curIsCounterclockwise;
          curCircleInfo.angleDegree = curAngleDegree;

          curFractionItems = [
            {
              y: curCircleY + 10,
              text: '1',
            },
          ];
        } else {
          curAngleDegree = 360 / curDivisor;
          if (curDirection === 'right') curAngleDegree = 360 - curAngleDegree; // counterclockwise equivalent

          curCircle = game.add.geom.arc(
            validPath.x0,
            curCircleY,
            self.circles.diameter,
            0,
            game.math.degreeToRad(curAngleDegree),
            curIsCounterclockwise,
            curLineColor,
            3,
            curFillColor,
            1
          );
          curCircleInfo.angleDegree = curAngleDegree;

          curFractionItems = [
            {
              y: curCircleY + 34,
              text: curDivisor,
            },
            {
              y: curCircleY - 2,
              text: '1',
            },
            {
              y: curCircleY - 2,
              text: '__',
            },
          ];
        }

        if (fractionLabel) {
          for (let item in curFractionItems) {
            curCircleInfo.label.push(
              game.add.text(
                fractionX,
                curFractionItems[item].y,
                curFractionItems[item].text,
                font
              )
            );
          }
        }

        curCircle.rotate = 90;

        // If game is type (b) (select fractions)
        if (gameMode == 'b') {
          curCircle.alpha = 0.5;
          curCircle.index = i;
        }

        curCircleInfo.distance = Math.floor(
          validPath.distanceBetweenPoints / curDivisor
        );

        // Add to the list
        curCircle.info = curCircleInfo;
        self.circles.list.push(curCircle);

        self.control.correctX +=
          Math.floor(validPath.distanceBetweenPoints / curDivisor) *
          curCircle.info.direc;
      }

      // Restart if
      // Does not have base difficulty
      if (!self.control.hasBaseDifficulty) {
        restart = true;
      }

      // Calculate next circle
      self.control.nextX =
        validPath.x0 +
        self.circles.list[0].info.distance * self.circles.list[0].info.direc;

      // Restart if
      // Correct position is out of bounds
      let isBeforeMin, isAfterMax;
      if (gameOperation === 'minus') {
        isBeforeMin = self.control.correctX > validPath.x0;
        isAfterMax =
          self.control.correctX <
          validPath.x0 - 3 * validPath.distanceBetweenPoints;
      } else {
        isBeforeMin = self.control.correctX < validPath.x0;
        isAfterMax =
          self.control.correctX >
          validPath.x0 + 3 * validPath.distanceBetweenPoints;
      }
      if (isBeforeMin || isAfterMax) {
        restart = true;
      }

      // If game is type (b), selectiong a random balloon place
      if (gameMode == 'b') {
        self.balloonX = validPath.x0;
        self.control.endIndex = game.math.randomInRange(
          self.control.numberOfPlusFractions,
          self.circles.list.length
        );

        for (let i = 0; i < self.control.endIndex; i++) {
          self.balloonX +=
            self.circles.list[i].info.distance *
            self.circles.list[i].info.direc;
        }

        // Restart if
        // Balloon position is out of bounds
        if (gameOperation === 'minus') {
          isBeforeMin = self.balloonX > validPath.x0;
          isAfterMax =
            self.balloonX < validPath.x0 - 3 * validPath.distanceBetweenPoints;
        } else {
          isBeforeMin = self.balloonX < validPath.x0;
          isAfterMax = self.balloonX > validPath.x0 + self.road.width;
        }
        if (isBeforeMin || isAfterMax) {
          restart = true;
        }
      }

      return restart;
    },

    renderCharacters: function (validPath) {
      // KID
      self.kid = game.add.sprite(
        validPath.x0,
        validPath.y0 - 32 - self.circles.list.length * self.circles.diameter,
        'kid_walking',
        0,
        1.2
      );
      self.kid.anchor(0.5, 0.8);

      self.animation.list.right = [
        'right',
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        4,
      ];
      self.animation.list.left = [
        'left',
        [23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12],
        4,
      ];

      if (gameOperation == 'minus') {
        self.kid.animation = self.animation.list.left;
        self.kid.curFrame = 23;
      } else {
        self.kid.animation = self.animation.list.right;
      }

      // BALLOON
      self.balloon = game.add.image(
        self.balloonX,
        validPath.y0 - 295,
        'balloon',
        1.5,
        0.5
      );
      self.balloon.alpha = 0.5;
      self.balloon.anchor(0.5, 0.5);

      self.basket = game.add.image(
        self.balloonX,
        validPath.y0 - 95,
        'balloon_basket',
        1.5
      );
      self.basket.anchor(0.5, 0.5);
    },

    /**
     * (in gameMode 'b') Function called when player clicked over a valid circle
     *
     * @param {number|object} cur clicked circle
     */
    clickHandler: function (cur) {
      if (!self.control.hasClicked) {
        // On gameMode (a)
        if (gameMode == 'a') {
          self.balloon.x = cur;
          self.basket.x = cur;
        }

        // On gameMode (b)
        if (gameMode == 'b') {
          document.body.style.cursor = 'auto';

          for (let i in self.circles.list) {
            if (i <= cur.index) {
              self.circles.list[i].alpha = 1; // Keep selected circle
              self.control.fractionIndex = cur.index;
            } else {
              self.circles.list[i].alpha = 0; // Hide unselected circle
              self.kid.y += self.circles.diameter; // Lower kid to selected circle
            }
          }
        }

        if (audioStatus) game.audio.popSound.play();

        // Hide fractions
        if (fractionLabel) {
          self.circles.list.forEach((circle) => {
            circle.info.label.forEach((labelPart) => {
              labelPart.alpha = 0;
            });
          });
        }

        // Hide solution pointer
        if (self.help != undefined) self.help.alpha = 0;

        self.balloon.alpha = 1;
        self.walkedPath.alpha = 1;

        self.control.hasClicked = true;
        self.animation.animateKid = true;

        game.animation.play(self.kid.animation[0]);
      }
    },

    /**
     * (in gameMode 'b') Function called when cursor is over a valid circle
     *
     * @param {object} cur circle the cursor is over
     */
    overCircleHandler: function (cur) {
      if (!self.control.hasClicked) {
        document.body.style.cursor = 'pointer';
        for (let i in self.circles.list) {
          self.circles.list[i].alpha = i <= cur.index ? 1 : 0.5;
        }
      }
    },

    /**
     * (in gameMode 'b') Function called when cursor leaves a valid circle
     */
    outCircleHandler: function () {
      if (!self.control.hasClicked) {
        document.body.style.cursor = 'auto';
        self.circles.list.forEach((circle) => {
          circle.alpha = 0.5;
        });
      }
    },

    /**
     * Checks if 2 images overlap
     *
     * @param {object} spriteA image 1
     * @param {object} spriteB image 2
     *
     * @returns {boolean} true if there is overlap
     */
    isOverlap: function (spriteA, spriteB) {
      const xA = spriteA.x;
      const xB = spriteB.x;

      // Consider it comming from both sides
      if (Math.abs(xA - xB) > 14) return false;
      else return true;
    },

    /**
     * Show correct answer
     */
    showAnswer: function () {
      if (!self.control.hasClicked) {
        // On gameMode (a)
        if (gameMode == 'a') {
          self.help.x = self.control.correctX;
          self.help.y = 490;
          // On gameMode (b)
        } else {
          self.help.x = self.circles.list[self.control.endIndex - 1].x;
          self.help.y =
            self.circles.list[self.control.endIndex - 1].y -
            self.circles.diameter / 2;
        }
        self.help.alpha = 0.7;
      }
    },
  },
};
