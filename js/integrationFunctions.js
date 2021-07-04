// MOODLE MODIF.
if (debugMode) console.log("(integrationFunctions.js start)");

const moodleVar = {
  hits: [0,0,0,0],
  errors: [0,0,0,0],
  time: [0,0,0,0]
}

function getParameterByName (name) {
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
  return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : null;
}

const iLMparameters = {
  iLM_PARAM_ServerToGetAnswerURL: getParameterByName("iLM_PARAM_ServerToGetAnswerURL"),
  iLM_PARAM_SendAnswer: getParameterByName("iLM_PARAM_SendAnswer"),
  iLM_PARAM_AssignmentURL: getParameterByName("iLM_PARAM_AssignmentURL"),
  iLM_PARAM_Assignment: getParameterByName("iLM_PARAM_Assignment"),
  lang: getParameterByName("lang")
};

function getAnswer() {
  if (debugMode) console.log("(integrationFunctions.js) start getAnswer()");
  let str = '';
  if (iLMparameters.iLM_PARAM_SendAnswer == 'false') { // student - sending results
    str += 'gameTypeString:' + gameTypeString
      + '\ngameShape:' + gameShape
      + '\ngameModeType:' + gameModeType
      + '\ngameOperationType:' + gameOperationType
      + '\ngameDifficulty:' + gameDifficulty
      + '\nfractionLabel:' + fractionLabel
      + '\nresults:';
    for (let i = 0; i < moodleVar.hits.length; i++) { // professor - creating new assignment
      str += '{level:' + (i + 1)
        + ',hits:' + moodleVar.hits[i]
        + ',errors:' + moodleVar.errors[i]
        + ',timeElapsed:' + moodleVar.time[i]
        + '}';
    }
  } else { // professor
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

function getEvaluation() {
  if (iLMparameters.iLM_PARAM_SendAnswer == 'false') { // student
    // TODO - evaluation method
    const nota = 1;
    parent.getEvaluationCallback(nota);
    return nota;
  }
}

function decodificaArquivo(text) {
  let gameInfo = {};
  let line = text.split('\n');
  line.forEach(cur => {
    try {
      let newline = cur.split(':');
      const chave = newline[0].replace(/^\s+|\s+$/g, '');
      const valor = newline[1].replace(/^\s+|\s+$/g, '');
      gameInfo[chave.trim()] = valor.trim();
    } catch (Error) { console.error('Sintax error'); }
  });
  // update global variables
  gameTypeString = gameInfo['gameTypeString'];
  gameShape = gameInfo['gameShape'];
  gameModeType = gameInfo['gameModeType'];
  gameOperationType = gameInfo['gameOperationType'];
  gameDifficulty = parseInt(gameInfo['gameDifficulty']);
  fractionLabel = gameInfo['fractionLabel'];
  if (debugMode) console.log("(integrationFunctions.js) decodificaArquivo() :", gameTypeString, gameShape, gameModeType, gameOperationType, gameDifficulty, fractionLabel);
  // Reset global variables to default values
  mapPosition = 0; 
  mapMove = true;
  completedLevels = 0;

  if (iLMparameters.iLM_PARAM_SendAnswer == 'false') { // student
    iLMparameters.return_get_answer = 1;
    iLMparameters.iLM_PARAM_ActivityEvaluation = ((mapPosition == 4) ? 1 : 0);
    iLMparameters.iLM_PARAM_ArchiveContent = text;
  } else { // professor
    iLMparameters.iLM_PARAM_ActivityEvaluation = 0;
    iLMparameters.iLM_PARAM_ArchiveContent = text;
  }

  game.state.start('customMenu'); // calls custom menu after updating game variables
}

function getiLMContent() {
  const url = iLMparameters.iLM_PARAM_Assignment;
  if (iLMparameters.iLM_PARAM_Assignment == null) {
    console.log("(integrationFunctions.js) getiLMContent(): NAO existe arquivo FRC para ser carregado (iLMparameters.iLM_PARAM_Assignment vazio), finalize.");
    return;
  }
  if (debugMode) console.log("(integrationFunctions.js) getiLMContent(): tenta pegar arquivo de " + url);
  let gameFile = new XMLHttpRequest();
  gameFile.open("GET", url, true);
  gameFile.send();
  gameFile.responseType = "text";
  gameFile.onreadystatechange = function () {
    if (gameFile.readyState === 4 && gameFile.status === 200) {
      const text = gameFile.responseText;
      decodificaArquivo(text);
    }
  }
  if (debugMode) console.log("(integrationFunctions.js) getiLMContent(): final");
}

if (debugMode) console.log("(integrationFunctions.js start)");