<?php

// ATENCAO ao
// * nome da base de dados: db_ifractions
// * nome da tabela dados : ifractions

// assets/cn/save.php on line 23, referer: http://milanesa.ime.usp.br/ifractions1/

/// @see js/circleOne.js
/// @see js/squareOne.js
/// @see js/squareTwo.js

function remove_accents ($stripAccents) {
  /*
  $stripAccents = strtr($stripAccents,
         'àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ',
         'aaaaaceeeeiiiinooooouuuuyyAAAAACEEEEIIIINOOOOOUUUUY');
  $stripAccents = preg_replace('/[^\x20-\x7E]/','', $stripAccents);
  */
  return $stripAccents;
  }

// Monta vetor [0,1] de dados da m<E1>quina cliente
function ipMaquina0 () {
  if (getenv("HTTP_CLIENT_IP"))
    $ip = getenv("HTTP_CLIENT_IP");
  elseif (getenv("HTTP_X_FORWARDED_FOR"))
    $ip = getenv("HTTP_X_FORWARDED_FOR");
  elseif (getenv("REMOTE_ADDR"))
    $ip = getenv("REMOTE_ADDR");
  $resp[0] = $ip;
  $resp[1] = gethostbyaddr($ip);
  return $resp;
  }

// Monta vetor [0,1] de dados da m<E1>quina cliente
function ipMaquina () {
  if (getenv("HTTP_CLIENT_IP"))
    $ip = getenv("HTTP_CLIENT_IP");
  elseif (getenv("HTTP_X_FORWARDED_FOR"))
    $ip = getenv("HTTP_X_FORWARDED_FOR");
  elseif (getenv("REMOTE_ADDR"))
    $ip = getenv("REMOTE_ADDR");
  $strIP = $ip;
  $resp = gethostbyaddr($ip);
  if (isset($resp) && strlen($resp)>0) {
    $strIP .= "; " . $resp;
    }
  return $strIP;
  }


$servername = "localhost";
$username = "root"; // put here the name of user root of MySQL
$password = "put_paswd"; // put here the password of user root of MySQL
$dbname = "put_name_of_base"; // put here the name of data base used to register iFraction use

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
  }


// $ip = $_REQUEST["s_ip"];
$ip = ipMaquina();
/*
$vet_ip = ipMaquina0();
$ip = "";
if (isset($vet_ip[0]) && strlen($vet_ip[0]>0))
  $ip = $vet_ip[0];
if (isset($vet_ip[1]) && strlen($vet_ip[1]>0))
  if (strlen($ip)>0)
    $ip = $ip . " - " . $vet_ip[1];
  else
    $ip = $vet_ip[1];
*/

$play = $_REQUEST["s_name"];
$date = date("Y-m-d H:i:s");
$lang = $_REQUEST["s_lang"];
$game = $_REQUEST["s_game"];
$mode = $_REQUEST["s_mode"];
$oper = $_REQUEST["s_oper"];
$leve = $_REQUEST["s_leve"];
$posi = $_REQUEST["s_posi"];
$resu = $_REQUEST["s_resu"];
$time = $_REQUEST["s_time"];
$deta = $_REQUEST["s_deta"];

$play0 = $play; // /var/www/html/ifractions1/js/preMenu.js: insert_name
$play = remove_accents($play); // /js/squareOne.js:vars=s_ip=143.107.45.11&s_name=&s_lang=pt&s_game=Square&s_mode=A&s_oper=Plus&s_leve=1&s_posi=1&s_resu=true&s_time=3&s_deta=numBlocks:3, valBlocks: 1,1,1, blockIndex: 2, floorIndex: 2; url=assets/cn/save.php

if (is_object($lang))
  $lang = json_decode($lang);

// Table 'ifractions': id s_hostip s_playername s_datetime s_lang s_game s_mode s_operator s_level s_mappos s_result s_time s_details
$sql = "INSERT INTO ifractions
(s_hostip, s_playername, s_datetime, s_lang, s_game, s_mode, s_operator, s_level, s_mappos, s_result, s_time, s_details)
VALUES
('$ip', '$play', '$date', '$lang', '$game', '$mode', '$oper', $leve, $posi, '$resu', $time, '$deta')";

// Register in database
if ($conn->query($sql) === TRUE) {
  print "Gravado/Grabado";
  $result = "OK";
} else {
  print "Error: " . $sql . "<br>" . $conn->error;
  $result = "Erro: " . $conn->error;
  }


//DEBUG
// js/menu.js : var menuState = { player_info = ... username ...}
// welcome
// index.php: game.state.add('name', nameState);
$name = $_REQUEST["name"];
$username = $_REQUEST["username"];
$data = date('Y_m_d_H_i_s');
$fp = fopen('../../temp/file_' . $data . ".txt", 'w');
fwrite($fp, "nome=" . $play0 . ", name=" . $name . ", username=" . $username . "\n" . $sql . "\nResultado: " . $result);
fclose($fp);

$conn->close();
?> 