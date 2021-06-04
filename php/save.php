<?php

// IMPORTANT

// * database name : db_ifractions
// * table name : ifractions

// php/save.php on line 24, referer: http://milanesa.ime.usp.br/ifractions1/

// @see js/globals.js
// @see js/circleOne.js
// @see js/squareOne.js
// @see js/squareTwo.js

function remove_accents ($stripAccents) {
  /*
  $stripAccents = strtr($stripAccents,
         'àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ',
         'aaaaaceeeeiiiinooooouuuuyyAAAAACEEEEIIIINOOOOOUUUUY');
  $stripAccents = preg_replace('/[^\x20-\x7E]/','', $stripAccents);
  */
  return $stripAccents;
}

// Creates array [0,1] of client data
function clientIP () {
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

$ip = clientIP();

// /js/globals.js: data = s_ip=120.0.0.1&s_name=name&s_lang=pt_BR
// /js/squareOne.js: data += &s_game=Square&s_mode=A&s_oper=Plus&s_leve=1&s_posi=1&s_resu=true&s_time=3&s_deta=numBlocks:3, valBlocks: 1,1,1, blockIndex: 2, floorIndex: 2;url=php/save.php
$name = $_REQUEST["s_name"];
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

$nameUnchanged = $name; // /js/preMenu.js: playerName

$name = remove_accents($name); 

if (is_object($lang))
  $lang = json_decode($lang);

// Table 'ifractions': id s_hostip s_playername s_datetime s_lang s_game s_mode s_operator s_level s_mappos s_result s_time s_details
$sql = "INSERT INTO ifractions
(s_hostip, s_playername, s_datetime, s_lang, s_game, s_mode, s_operator, s_level, s_mappos, s_result, s_time, s_details)
VALUES
('$ip', '$name', '$date', '$lang', '$game', '$mode', '$oper', $leve, $posi, '$resu', $time, '$deta')";

// Register in database
if ($conn->query($sql) === TRUE) {
  print "Saved.";
  $result = "OK";
} else {
  print "Error: " . $sql . "<br>" . $conn->error;
  $result = "Error: " . $conn->error;
}



// DEBUG
$date = date('Y_m_d_H_i_s');
$fp = fopen('../temp/file_' . $date . ".txt", 'w');
fwrite($fp, "name_unchanged=" . $nameUnchanged . ", name=" . $name . "\n" . $sql . "\nResultado: " . $result);
fclose($fp);

$conn->close();

?> 