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
  trace: undefined,
  circles: undefined,
  balloonX: undefined,
  divisorsList: undefined,
  nextX: undefined,
  // end b only
  kid: undefined,
  balloon: undefined,
  basket: undefined,
  help: undefined,
  // b only
  endIndex: undefined,
  numberOfPlusFractions: undefined,

  create: function () {
    this.divisorsList = '';

    const roadPointWidth = (game.sprite['map_place'].width / 2) * 0.45;

    this.road = {
      x: 150,
      y: context.canvas.height - game.image['floor_grass'].width * 1.5,
      width: 1620,
    };

    const distanceBetweenPoints =
      (context.canvas.width - this.road.x * 2 - roadPointWidth) / 5; // Distance between road points

    const y0 = this.road.y + 20;
    const x0 =
      gameOperation == 'minus'
        ? this.road.x - roadPointWidth / 2 + 5 * distanceBetweenPoints
        : this.road.x + roadPointWidth / 2; // Initial 'x' coordinate for the kid and the baloon

    this.animation = {
      list: {
        left: undefined,
        right: undefined,
      },
      invertDirection: false,
      animateKid: false,
      animateBalloon: false,
      count: 0,
    };

    this.control = {
      checkAnswer: false, // Check kid inside ballon's basket
      hasClicked: false, // Air ballon positioned
      result: false, // Game is correct
      correctX: x0, // Ending position, is accumulative
      hasBaseDifficulty: false, // Will validate that level isnt too easy (has at least one '1/difficulty' fraction)
      endIndex: null,
    };

    // CIRCLES AND FRACTIONS
    this.circles = {
      all: [], // Circles objects of current level
      label: [], // Fractions labels

      diameter: 60, // (Fixed) diameter for circles
      cur: 0, // Current circle index

      direction: [], // Circle direction : 'right' (plus), 'left' (minus)
      distance: [], // Fraction of distance between circles (used in walking animation)
      angle: [], // Angle in degrees : 90 / 180 / 270 / 360
      color: [], // Circle line colors (also used for tracing on floor)

      direc: [], // Can be : 1 or -1 : will be multiplied to values to easily change object direction when needed
    };

    renderBackground('farmRoad');

    this.utils.renderRoad(x0, y0, distanceBetweenPoints);

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

    this.restart = this.utils.renderCircles(x0, y0, distanceBetweenPoints);

    this.utils.renderCharacters(x0, y0);

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
    self.animation.count++;

    // Start animation
    if (self.animation.animateKid) {
      let cur = self.circles.cur;
      let direc = self.circles.direc[cur];

      // Lowers animation
      // Move kid
      self.kid.x += 2 * direc;

      // Move circles
      for (let i in self.circles.all) {
        self.circles.all[i].x += 2 * direc;
      }

      // Manage line on the floor
      self.trace.width += 2 * direc;
      self.trace.color = self.circles.all[cur].color;

      // Change angle of current arc
      self.circles.angle[cur] += 2.3 * direc;
      self.circles.all[cur].angleEnd = game.math.degreeToRad(
        self.circles.angle[cur]
      );

      // When finish current circle
      let lowerCircles;
      if (self.circles.direction[cur] == 'right') {
        lowerCircles = self.circles.all[cur].x >= self.nextX;
      } else if (self.circles.direction[cur] == 'left') {
        lowerCircles = self.circles.all[cur].x <= self.nextX;

        // If just changed from 'right' to 'left' inform to change direction of kid animation
        if (
          !self.animation.invertDirection &&
          cur > 0 &&
          self.circles.direction[cur - 1] === 'right'
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

        game.animation.play(self.kid.animation[0]);
      }

      if (lowerCircles) {
        self.circles.all[cur].alpha = 0; // Cicle disappear
        self.circles.all.forEach((cur) => {
          cur.y += self.circles.diameter; // Lower circles
        });
        self.kid.y += self.circles.diameter; // Lower kid

        self.circles.cur++; // Update current circle

        cur = self.circles.cur;
        direc = self.circles.direc[cur];

        self.nextX += self.circles.distance[cur] * direc; // Update next position
      }

      // When finish all circles (final position)
      if (cur == self.circles.all.length || self.circles.all[cur].alpha == 0) {
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

      self.animation.count = 0;
    }

    // Balloon flying animation
    if (self.animation.animateBalloon) {
      self.balloon.y -= 2;
      self.basket.y -= 2;

      if (self.control.result) self.kid.y -= 2;

      if (self.animation.count >= 140) {
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
        const cur = self.road;

        const valid =
          y > 150 &&
          x >= self.road.x && //cur.xWithAnchor &&
          x <= self.road.x + self.road.width; //cur.xWithAnchor + cur.width * cur.scale;
        if (valid) self.utils.clickHandler(x);
      }

      // GAME MODE B : click circle
      if (gameMode == 'b') {
        self.circles.all.forEach((cur) => {
          const valid =
            game.math.distanceToPointer(
              x,
              cur.xWithAnchor,
              y,
              cur.yWithAnchor
            ) <=
            (cur.diameter / 2) * cur.scale;
          if (valid) self.utils.clickHandler(cur);
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
        self.circles.all.forEach((cur) => {
          const valid =
            game.math.distanceToPointer(
              x,
              cur.xWithAnchor,
              y,
              cur.yWithAnchor
            ) <=
            (cur.diameter / 2) * cur.scale;
          if (valid) {
            self.utils.overCircleHandler(cur);
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
        self.circles.all.length +
        ', valCircles: ' +
        self.divisorsList +
        ' balloonX: ' +
        self.basket.x +
        ', selIndex: ' +
        self.fractionIndex;

      // FOR MOODLE
      sendToDatabase(data);
    },
  },

  utils: {
    renderRoad: function (x0, y0, distanceBetweenPoints) {
      // Road points
      for (let i = 0; i <= 5; i++) {
        game.add
          .sprite(x0 + i * distanceBetweenPoints, y0, 'map_place', 0, 0.45)
          .anchor(0.5, 0.5);
        game.add.geom
          .circle(
            x0 + i * distanceBetweenPoints,
            y0 + 55,
            50,
            undefined,
            0,
            colors.white,
            0.5
          )
          .anchor(0, 0.25);
        game.add.text(
          x0 + i * distanceBetweenPoints,
          y0 + 55,
          i,
          textStyles.h2_
        );
      }

      self.trace = game.add.geom.rect(x0 - 1, y0, 1, 1, undefined, 1);
      self.trace.alpha = 0;
    },

    renderCircles: function (x0, y0, distanceBetweenPoints) {
      let restart = false;

      // Balloon place
      self.balloonX = context.canvas.width / 2;

      // Number of circles
      const max =
        gameOperation == 'mixed' || gameMode == 'b' ? 6 : curMapPosition + 1;
      const min =
        gameOperation == 'mixed' && curMapPosition < 2 ? 2 : curMapPosition; // Mixed level has at least 2 fractions
      const total = game.math.randomInRange(min, max); // Total number of circles
      // gameMode 'b' exclusive variables
      self.fractionIndex = -1; // Index of clicked circle (game (b))
      self.numberOfPlusFractions = game.math.randomInRange(1, total - 1);

      // CIRCLES
      const levelDirection = gameOperation == 'minus' ? -1 : 1;
      const x = x0 + 65 * levelDirection;

      for (let i = 0; i < total; i++) {
        const divisor = game.math.randomInRange(1, gameDifficulty); // Set fraction 'divisor' (depends on difficulty)

        if (divisor === gameDifficulty) self.control.hasBaseDifficulty = true; // True if after for ends has at least 1 '1/difficulty' fraction

        self.divisorsList += divisor + ','; // Add this divisor to the list of divisors (for postScore())

        // Set each circle direction
        let direction;

        switch (gameOperation) {
          case 'plus':
            direction = 'right';
            break;
          case 'minus':
            direction = 'left';
            break;
          case 'mixed':
            if (i < self.numberOfPlusFractions) direction = 'right';
            else direction = 'left';
            break;
        }
        self.circles.direction[i] = direction;

        // Set each circle visual info
        let color;
        let font;
        let anticlockwise;

        if (direction === 'right') {
          color = colors.green;
          self.circles.direc[i] = 1;
          anticlockwise = true;
        } else {
          color = colors.red;
          self.circles.direc[i] = -1;
          anticlockwise = false;
        }
        font = { ...textStyles.h2_, fill: color };
        self.circles.color[i] = color;

        // Draw circles
        let circle;
        let label = [];

        if (divisor === 1) {
          circle = game.add.geom.circle(
            x0,
            y0 - 36 - i * self.circles.diameter,
            self.circles.diameter,
            color,
            3,
            colors.white,
            1
          );

          circle.anticlockwise = anticlockwise;

          self.circles.angle.push(360);

          if (fractionLabel) {
            label[0] = game.add.text(
              x,
              y0 - 36 - i * self.circles.diameter,
              divisor,
              font
            );
            self.circles.label.push(label);
          }
        } else {
          let degree = 360 / divisor;

          if (direction == 'right') degree = 360 - degree; // Anticlockwise equivalent

          circle = game.add.geom.arc(
            x0,
            y0 - 54 - i * self.circles.diameter,
            self.circles.diameter,
            0,
            game.math.degreeToRad(degree),
            anticlockwise,
            color,
            3,
            colors.white,
            1
          );

          self.circles.angle.push(degree);

          if (fractionLabel) {
            // bottom
            label[0] = game.add.text(
              x,
              y0 - 46 - i * self.circles.diameter + 32,
              divisor,
              font
            );
            // top
            label[1] = game.add.text(
              x,
              y0 - 38 - i * self.circles.diameter,
              '1',
              font
            );
            // line
            label[2] = game.add.text(
              x,
              y0 - 38 - i * self.circles.diameter,
              '___',
              font
            );
            self.circles.label.push(label);
          }
        }

        circle.rotate = 90;

        // If game is type (b) (select fractions)
        if (gameMode == 'b') {
          circle.alpha = 0.5;
          circle.index = i;
        }
        self.circles.distance.push(Math.floor(distanceBetweenPoints / divisor));
        self.circles.all.push(circle);

        self.control.correctX +=
          Math.floor(distanceBetweenPoints / divisor) * self.circles.direc[i];
      }

      // Calculate next circle
      self.nextX = x0 + self.circles.distance[0] * self.circles.direc[0];

      // If top circle position is out of bounds (when on the ground) or game doesnt have base difficulty, restart
      if (
        self.control.correctX < self.road.x ||
        self.control.correctX > self.road.x + 3 * distanceBetweenPoints ||
        !self.control.hasBaseDifficulty
      ) {
        restart = true;
      }

      // If game is type (b), selectiong a random balloon place
      if (gameMode == 'b') {
        self.balloonX = x0;
        self.control.endIndex = game.math.randomInRange(
          self.numberOfPlusFractions,
          self.circles.all.length
        );

        for (let i = 0; i < self.control.endIndex; i++) {
          self.balloonX += self.circles.distance[i] * self.circles.direc[i];
        }

        // If balloon position is out of bounds, restart
        if (
          self.balloonX < self.road.x ||
          self.balloonX > self.road.x + 5 * distanceBetweenPoints
        ) {
          restart = true;
        }
      }

      return restart;
    },

    renderCharacters: function (x0, y0) {
      // KID
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

      self.kid = game.add.sprite(
        x0,
        y0 - 31 - self.circles.all.length * self.circles.diameter,
        'kid_walking',
        0,
        1.2
      );
      self.kid.anchor(0.5, 0.8);

      if (gameOperation == 'minus') {
        self.kid.animation = self.animation.list.left;
        self.kid.curFrame = 23;
      } else {
        self.kid.animation = self.animation.list.right;
      }

      // BALLOON
      self.balloon = game.add.image(
        self.balloonX,
        y0 - 295,
        'balloon',
        1.5,
        0.5
      );
      self.balloon.alpha = 0.5;
      self.balloon.anchor(0.5, 0.5);

      self.basket = game.add.image(
        self.balloonX,
        y0 - 95,
        'balloon_basket',
        1.5
      );
      self.basket.anchor(0.5, 0.5);
    },

    /**
     * (in gameMode 'b') Function called when cursor is over a valid circle
     *
     * @param {object} cur circle the cursor is over
     */
    overCircleHandler: function (cur) {
      if (!self.control.hasClicked) {
        document.body.style.cursor = 'pointer';
        for (let i in self.circles.all) {
          self.circles.all[i].alpha = i <= cur.index ? 1 : 0.5;
        }
      }
    },

    /**
     * (in gameMode 'b') Function called when cursor leaves a valid circle
     */
    outCircleHandler: function () {
      if (!self.control.hasClicked) {
        document.body.style.cursor = 'auto';
        self.circles.all.forEach((cur) => {
          cur.alpha = 0.5;
        });
      }
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
          // On gameMode (b)
        } else if (gameMode == 'b') {
          document.body.style.cursor = 'auto';

          for (let i in self.circles.all) {
            if (i <= cur.index) {
              self.circles.all[i].alpha = 1; // Keep selected circle
              self.fractionIndex = cur.index;
            } else {
              self.circles.all[i].alpha = 0; // Hide unselected circle
              self.kid.y += self.circles.diameter; // Lower kid to selected circle
            }
          }
        }

        if (audioStatus) game.audio.popSound.play();

        // Hide fractions
        if (fractionLabel) {
          self.circles.label.forEach((cur) => {
            cur.forEach((cur) => {
              cur.alpha = 0;
            });
          });
        }

        // Hide solution pointer
        if (self.help != undefined) self.help.alpha = 0;

        self.balloon.alpha = 1;
        self.trace.alpha = 1;

        self.control.hasClicked = true;
        self.animation.animateKid = true;

        game.animation.play(self.kid.animation[0]);
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
          self.help.x = self.circles.all[self.control.endIndex - 1].x;
          self.help.y =
            self.circles.all[self.control.endIndex - 1].y -
            self.circles.diameter / 2;
        }
        self.help.alpha = 0.7;
      }
    },
  },
};
