/* FOR MOODLE
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
  let str = '';
  if (iLMparameters.iLM_PARAM_SendAnswer == 'false') { // Student - sending results
    str += 'gameTypeString:' + gameTypeString
      + '\ngameShape:' + gameShape
      + '\ngameMode:' + gameMode
      + '\ngameOperation:' + gameOperation
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
      alert(game.lang.error_must_select_game);
      return x;
    }
    moodleVar.hits = [0, 0, 0, 0];
    moodleVar.errors = [0, 0, 0, 0];
    moodleVar.time = [0, 0, 0, 0];
    str += 'gameTypeString:' + gameTypeString
      + '\ngameShape:' + gameShape
      + '\ngameMode:' + gameMode
      + '\ngameOperation:' + gameOperation
      + '\ngameDifficulty:' + gameDifficulty
      + '\nfractionLabel:' + fractionLabel;
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

  const url = iLMparameters.iLM_PARAM_Assignment;

  if (url == null) {
    console.error("[integrationFunctions.js] getiLMContent(): iLMparameters.iLM_PARAM_Assignment " + game.lang.error_moodle_file_ext);
    return;
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

}

function updateGlobalVariables(info, infoResults) {
  // Update new values
  gameTypeString = info['gameTypeString'];
  gameShape = info['gameShape'];
  gameMode = info['gameMode'];
  gameOperation = info['gameOperation'];
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
      cur = cur.slice(1); // Remove {
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