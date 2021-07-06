// FOR MOODLE 

/**
 * To be show on moodle
 */
const studentReport = {

  create: function () {

    const offsetW = defaultWidth / 4;
    let x = offsetW / 2;
    let y = defaultHeight / 2 - 50;

    game.add.geom.rect(0, 0, defaultWidth, defaultHeight, undefined, 0, colors.blueBckg, 1);
    game.add.image(300, 100, 'cloud');
    game.add.image(660, 80, 'cloud');
    game.add.image(110, 85, 'cloud', 0.8);

    for (let i = 0; i < 9; i++) { game.add.image(i * 100, defaultHeight - 100, 'floor'); }

    game.add.text(defaultWidth / 2, 80, game.lang.results, textStyles.h1_green);
    game.add.image(x - 40, y - 70, info[gameTypeString].gameTypeUrl, 0.8);

    text = game.lang[gameShape].charAt(0).toUpperCase() + game.lang[gameShape].slice(1);
    text = game.lang.game + ': ' + text + ((gameTypeString.slice(-3) == 'One') ? ' I' : ' II');

    game.add.text(190, y - 50, text, textStyles.h4_brown).align = 'left';
    game.add.text(190, y - 25, game.lang.game_mode + ': ' + gameMode, textStyles.h4_brown).align = 'left';
    game.add.text(190, y, game.lang.operation + ': ' + gameOperation, textStyles.h4_brown).align = 'left';
    game.add.text(190, y + 25, game.lang.difficulty + ': ' + gameDifficulty, textStyles.h4_brown).align = 'left';

    y = defaultHeight - 200;

    for (let i = 0; i < 4; i++, x += offsetW) {

      if (moodleVar.hits[i] == 0) {
        const sign = game.add.image(x, defaultHeight - 100, 'broken_sign', 0.7);
        sign.anchor(0.5, 0.5);
        continue;
      }

      const sign = game.add.image(x, defaultHeight - 100, 'sign', 0.7);
      sign.anchor(0.5, 0.5);
      game.add.text(x, defaultHeight - 100, '' + (i + 1), textStyles.h2_white);

      game.add.geom.rect(x - 55, y - 40, 5, 135, undefined, 0, colors.blueMenuLine);
      game.add.text(x - 40, y - 25, game.lang.time + ': ' + convertTime(moodleVar.time[i]), textStyles.h4_brown).align = 'left';
      game.add.text(x - 40, y, game.lang.hits + ': ' + moodleVar.hits[i], textStyles.h4_brown).align = 'left';
      game.add.text(x - 40, y + 25, game.lang.errors + ': ' + moodleVar.errors[i], textStyles.h4_brown).align = 'left';
    }

  },

  convertTime: function (s) {

    let h = 0, m = 0;

    if (s > 1200) {
      h = s / 1200;
      s = s % 1200;
    }

    if (s > 60) {
      m = s / 60;
      s = s % 60;
    }

    h = '' + h;
    m = '' + m;
    s = '' + s;

    if (h.length < 2) h = '0' + h;
    if (m.length < 2) m = '0' + m;
    if (s.length < 2) s = '0' + s;

    return h + ':' + m + ':' + s;

  }

}