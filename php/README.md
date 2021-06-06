#  save.php

iFractions is developed to run mainly on the client side. However, it communicates with a database using MySQL to save the player information after each level. The file **save.php** manages the connection between the game and the database.

# How to set up the database connection correctly

In order for iFractions to successfully establish a connection to the database you must:

1. set up a MySQL database.
2. update /php/save.php 
3. update /js/globals.js

## 1) Creating the MySQL database for iFractions

You must have MySQL installed on the server. 

Considering the database name to be **db_ifractins** and the table to be **ifractions**, you can setup the MySQL database as follows:

	CREATE DATABASE db_ifractions;

	USE db_ifractions;

	CREATE TABLE ifractions (
		id int(11) NOT NULL AUTO_INCREMENT,
		s_hostip varchar(255) DEFAULT NULL,
		s_playername varchar(256) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
		s_datetime varchar(20) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
		s_lang varchar(6) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
		s_game varchar(10) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
		s_mode varchar(1) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
		s_operator varchar(5) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
		s_level int(5) NOT NULL,
		s_mappos int(5) NOT NULL,
		s_result varchar(6) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
		s_time varchar(20) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
		s_details varchar(120) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
		PRIMARY KEY (id)
	) ENGINE = InnoDB AUTO_INCREMENT = 1816 DEFAULT CHARSET = latin1;

## 2) /php/save.php

You have to set values for the following variables in **/php/save.php** to match the database's:

	$servername = "localhost"; 	// INSERT MYSQL server name
	$username = "put_username";	// INSERT MySQL user name
	$password = "put_password";	// INSERT MySQL password
	$dbname = "db_ifractions";	// INSERT database name (default=db_ifractions) 
	$tablename = "ifractions";	// INSERT table name (default=ifractions)

## 3) /js/globals.js

There is a global function **postScore()** inside /js/globals.js. When the information is collected on the current game file, it is sent as a parameter to this function. Here is where all the information collecting is completed, the data is sent to /php/save.php and the connection to the database done.

	const data = 's_ip='// INSERT the IP of the machine where the MySQL was set up
		+ '&s_name=' + //player's name
		+ '&s_lang=' + // selected language for the game
		+ // data received from the game as parameter to this function


# Where do we use the database in the code?

There is also a function **postScore()** in every game file:
* /js/gameSquareOne.js
* /js/gameSquareTwo.js
* /js/gameCircleOne.js

After each level is completed, information about the player's progress is sent do the database through the function **postScore()**. The data collected in the game is structured as a string that is going to be sent to the database (as can be seen below).

	const data = '&s_game=' +	// collect game shape
	+ '&s_mode=' +	// collect level type
	+ '&s_oper=' +	// collect sublevelType
	+ '&s_leve=' +	// collect the selected difficulty for the game
	+ '&s_posi=' +	// collect the players position on the map
	+ '&s_resu=' +	// collect status for players answer (correct or incorrect)
	+ '&s_time=' +	// collect time spent finishing the game
	+ '&s_deta=' +	// collect extra details specific to current game

The variable **data** is then sent as a parameter to the global function **postScore()** in **/js/globals.js**, that completes the string and sends the information to the database using /php/save.php.