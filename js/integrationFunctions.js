/* MOODLE
 * 
 * These functions are used exclusively when iFractions is runnign inside Moodle as an iAssign module. <br>
 * In this case, the global variable 'moodle' must be 'true' (globals.js) <br> 
 * More about iAssign functions and parameters : https://www.ime.usp.br/~igormf/ima-tutorial/ (pt-br)
 */

const iLMparameters = {
  /* Este parâmetro serve para distinguir a situação em que o iMA está sendo manuseado, 
  * - Quando elaboração de atividade (professor), o valor é: true, 
  * - Quando resolução do exercício (aluno), o valor é false. */
  iLM_PARAM_SendAnswer: getParameterByName("iLM_PARAM_SendAnswer"), // Checks if you're student (false) or professor (true)
  /* Este parâmetro é informado quando o usuário está abrindo uma atividade interativa para resolvê-la. 
   * Tem como valor uma URL, que serve para acessar o exercício criado pelo professor.
   * Exemplo de valor: http://myschool.edu/moodle/mod/iassign/ilm_security.php?id=3&token=b3660dd4de0b0e9bb01fea6cc8f02ccd&view=1
   * Observe que o conteúdo do parâmetro token, presente na URL é acessível uma única vez, 
   * ou seja, quando o iMA acessá-la (via AJAX), 
   * obterá a informação a respeito da atividade, 
   * não podendo acessá-la novamente, pois a token será destruída por razões de segurança. */
  iLM_PARAM_Assignment: getParameterByName("iLM_PARAM_Assignment"),
  /* Este parâmetro informa ao iMA em que idioma o Moodle está sendo utilizado, 
   * permitindo a internacionalização. Exemplos de valores: en para inglês; pt para português.*/
  lang: getParameterByName("lang"),
  iLM_PARAM_ServerToGetAnswerURL: getParameterByName("iLM_PARAM_ServerToGetAnswerURL"),
  iLM_PARAM_ServerToGetAnswerURL: getParameterByName("iLM_PARAM_ServerToGetAnswerURL")
};

/* [iAssign function]
 * The iLM will be included in the HTML page as an iFrame, 
 * therefore some parameters are going to be passed by the iAssign to the iLM via URL.
 * 
 * This method is used to read the informed parameters.
 */
function getParameterByName(name) {
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
  return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : null;
}

/* [iAssign function]
 * Este método é invocado automaticamente pelo iTarefa, em dois diferentes momentos:
 *
 * - Quando o PROFESSOR está elaborando a atividade e a finaliza, clicando no botão "Salvar". 
 *   Retorna: dados da atividade criada;
 * 
 * - Quando o ESTUDANTE está resolvendo um exercício e aciona o botão "Salvar", 
 *   Retorna: resposta do estudante para a atividade.
 * 
 * Para ambos os casos, o retorno deste método será recebido pelo iTarefa e será armazenado no banco de dados.
 */
function getAnswer() {
  if (debugMode) console.log("(integrationFunctions.js) start getAnswer()");
  let str = '';
  if (iLMparameters.iLM_PARAM_SendAnswer == 'false') { // Student - sending results
    str += 'gameTypeString:' + gameTypeString
      + '\ngameShape:' + gameShape
      + '\ngameModeType:' + gameModeType
      + '\ngameOperationType:' + gameOperationType
      + '\ngameDifficulty:' + gameDifficulty
      + '\nfractionLabel:' + fractionLabel
      + '\nresults:';
    for (let i = 0; i < moodleVar.hits.length; i++) {
      str += '{level=' + (i + 1)
        + ',hits=' + moodleVar.hits[i]
        + ',errors=' + moodleVar.errors[i]
        + ',timeElapsed=' + moodleVar.time[i]
        + '}';
    }
  } else { // Professor - creating new assignment
    if (!gameType) {
      alert("Erro: Você precisa escolher pelo menos um jogo");
      return x;
    }
    moodleVar.hits = [0, 0, 0, 0];
    moodleVar.errors = [0, 0, 0, 0];
    moodleVar.time = [0, 0, 0, 0];
    str += 'gameTypeString:' + gameTypeString
      + '\ngameShape:' + gameShape
      + '\ngameModeType:' + gameModeType
      + '\ngameOperationType:' + gameOperationType
      + '\ngameDifficulty:' + gameDifficulty
      + '\nfractionLabel:' + fractionLabel;
  }

  if (debugMode) {
    console.log(str);
    console.log("(integrationFunctions.js) end getAnswer()");
  }

  return str;
}

/* [iAssign function]
 * Esta função deve estar presente nos iMA que possuem avaliador automático. 
 * Esta função é invocada pelo iTarefa, quando o aluno submete sua solução para avaliação, 
 * portanto, toda a avaliação deve ser realizada quando o método getEvaluation() é chamado. 
 * O retorno deve ser um número real entre 0.0 e 1.0, que significa a nota atribuída ao aluno.
 * Esta nota será armazenada no banco de dados.
 */
function getEvaluation() {
  if (iLMparameters.iLM_PARAM_SendAnswer == 'false') { // Student
    let i;
    for (i = 0; i < moodleVar.hits.length && moodleVar.hits[i] == 1; i++);
    const grade = i / 4;
    parent.getEvaluationCallback(grade); // Sends grade to moodle database
    return grade;
  }
}

function getiLMContent() {

  if (debugMode) console.log("(integrationFunctions.js) getiLMContent(): start.");

  const url = iLMparameters.iLM_PARAM_Assignment;

  if (url == null) {
    console.error("Error: (integrationFunctions.js) getiLMContent(): NAO existe arquivo FRC para ser carregado (iLMparameters.iLM_PARAM_Assignment vazio), finalize.");
    return;
  } else {
    if (debugMode) console.log("(integrationFunctions.js) getiLMContent(): try to get file in " + url);
  }

  let xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.send();
  xhr.responseType = "text";
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const txt = xhr.responseText;
      breakString(txt);
    }
  }

  if (debugMode) console.log("(integrationFunctions.js) getiLMContent(): end.");
}

function updateGlobalVariables(info, infoResults) {
  // Update new values
  gameTypeString = info['gameTypeString'];
  gameShape = info['gameShape'];
  gameModeType = info['gameModeType'];
  gameOperationType = info['gameOperationType'];
  gameDifficulty = parseInt(info['gameDifficulty']);
  fractionLabel = info['fractionLabel'];

  // Update default values
  mapPosition = 0;
  mapMove = true;
  completedLevels = 0;

  // Calls custom menu after updating game variables 
  if (infoResults) {
    for (let i = 0; i < moodleVar.hits.length; i++) {
      moodleVar.hits[i] = infoResults['l' + (i + 1)].hits;
      moodleVar.errors[i] = infoResults['l' + (i + 1)].errors;
      moodleVar.time[i] = infoResults['l' + (i + 1)].timeElapsed;
    }
    game.state.start('studentReport');
  } else {
    game.state.start('customMenu');
  }

}

function breakString(text) {
  let gameInfo = {}, results;
  let lines = text.split('\n'); // Break by line
  lines.forEach(cur => {
    try {
      let line = cur.split(':'); // Break by key:value
      if (line[0] != 'results') {
        const key = line[0].replace(/^\s+|\s+$/g, ''); // Removes end character
        const value = line[1].replace(/^\s+|\s+$/g, '');
        gameInfo[key.trim()] = value.trim(); // Removes extra space
      } else {
        results = line[1].replace(/^\s+|\s+$/g, '');
      }
    } catch (Error) { console.error('Sintax error'); }
  });
  if (results) {
    let curLevel = results.split('}');
    results = { l1: {}, l2: {}, l3: {}, l4: {} };
    let i = 1;
    curLevel.forEach(cur => {
      cur = cur.substring(1); // Remove {
      cur = cur.split(','); // Break by line
      cur.forEach(cur => {
        try {
          if (cur.length != 0) {
            let line = cur.split('='); // Break by key=value
            const key = line[0].replace(/^\s+|\s+$/g, ''); // Removes end char
            const value = line[1].replace(/^\s+|\s+$/g, ''); // Removes end char
            results['l' + i][key] = parseInt(value); // Removes extra space    
          }
        } catch (Error) { console.error('Sintax error'); }
      });
      i++;
    });
  }
  updateGlobalVariables(gameInfo, results);
}

const moodleVar = {
  hits: [0, 0, 0, 0],
  errors: [0, 0, 0, 0],
  time: [0, 0, 0, 0]
}

function convertTime(s) {
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

const studentReport = {
  create: function () {
    const offsetW = defaultWidth / 4;
    let x = offsetW / 2;
    let y = defaultHeight/2 - 50;
    game.add.graphic.rect(0, 0, 900, 600, undefined, 0, colors.blueBckg, 1);
    game.add.image(300, 100, 'cloud');
    game.add.image(660, 80, 'cloud');
    game.add.image(110, 85, 'cloud', 0.8);
    for (let i = 0; i < 9; i++) { game.add.image(i * 100, 501, 'floor'); }
    game.add.text(defaultWidth / 2, 80, game.lang.results, textStyles.h1_green);
    game.add.image(x - 40, y - 70, info[gameTypeString].gameTypeUrl, 0.8);
    text = game.lang[gameShape].charAt(0).toUpperCase() + game.lang[gameShape].slice(1);
    text = game.lang.game + ': ' + text + ((gameTypeString.substring(-3) == 'One') ? ' I' :' II');
    game.add.text(190, y - 50, text, textStyles.h4_brown).align = 'left';
    game.add.text(190, y - 25, game.lang.game_mode + ': ' + gameModeType, textStyles.h4_brown).align = 'left';
    game.add.text(190, y, game.lang.operation + ': ' + gameOperationType, textStyles.h4_brown).align = 'left';
    game.add.text(190, y + 25, game.lang.difficulty + ': ' + gameDifficulty, textStyles.h4_brown).align = 'left';
    y = defaultHeight - 200;
    for (let i = 0; i < 4; i++, x += offsetW) {
      if (moodleVar.hits[i] == 0) {
        const sign = game.add.image(x, defaultHeight - 100, 'broken_sign', 0.7);
        sign.anchor(0.5, 0.5);
        continue;
      }
      const sign = game.add.image(x, defaultHeight - 100, 'sign', 0.7);
      sign.anchor(0.5, 0.5)
      game.add.text(x, defaultHeight - 100, '' + (i + 1), textStyles.h2_white);
      game.add.graphic.rect(x - 55, y - 40, 5, 135, undefined, 0, colors.blueMenuLine)//.anchor(0, 0.5);
      game.add.text(x - 40, y - 25, game.lang.time + ': ' + convertTime(moodleVar.time[i]), textStyles.h4_brown).align = 'left';
      game.add.text(x - 40, y, game.lang.hits + ': ' + moodleVar.hits[i], textStyles.h4_brown).align = 'left';
      game.add.text(x - 40, y + 25, game.lang.errors + ': ' + moodleVar.errors[i], textStyles.h4_brown).align = 'left';
    }
  }
}