const defaultWidth = 900;
const defaultHeight = 600;
const medSrc = "assets/img/";

const debugMode = false; 	// Turns console messages ON/OFF
let audioStatus = false; 	// Turns game audio ON/OFF
let fractionLabel = true; 	// Turns showing fractions in levels ON/OFF

let playerName;
let langString; 		// String that contains the selected language

let self;				// Current state

let mapPosition;		// character position in the map (1..4 valid, 5 end)
let mapMove;			// When true, the character can move to next position in the map
let completedLevels;	// Number of finished levels in the map

/*
.................................................... 
.............square.................circle.......... }					} (gameShape)		 			 
.........../........\.................|............. } game (gameType)
........One..........Two.............One............ }
......./...\..........|............./...\........... 
......A.....B.........C............A.....B.......... } level (levelType)
.(floor)..(stack)..(equal).....(floor).(circle)..... } 
.......\./............|..............\./............ 
........|.............|...............|............. 
......./.\........../.|.\.........../.|.\........... 
...Plus...Minus....A..B..C.....Plus.Minus.Mixed..... } sublevel (sublevelType)
.......\./..........\.|./...........\.|./........... 
........|.............|...............|............. 
......1,2,3.......1,2,3,4,5.......1,2,3,4,5......... } difficulty (gameDifficulty)
.................................................... 
*/

const TESTE = {
	gameShape: [
		'Square',
		'Square',
		'Circle'
	],
	gameType: [
		'squareOne',
		'squareTwo',
		'circleOne'
	],
	levelType: [
		['A', 'B'],
		['C'],
		['A', 'B']
	],
	sublevelType: [
		['Plus', 'Minus'],
		['A', 'B', 'C'],
		['Plus', 'Minus', 'Mixed']
	],
	gameDifficulty: [
		3,
		5,
		5
	],
};

/* GAME TYPE (in menu screen)
 * can be: squareOne, 'SquareTwo' or 'CircleOne' */
let gameType, gameTypeString;

let gameShape;	// can be: 'circle' or 'square'

/* LEVEL TYPE (in menu screen)
 * in squareOne/circleOne 	can be: 'A' (click on the floor) or 'B' (click on the amount to go/stacked figures)
 * in squareTwo           	can be: 'C' (comparing fractions) */
let levelType;

/* SUBLEVEL TYPE (in difficulty screen)
 * in squareOne		can be: 'Plus' or 'Minus'
 * in circleOne 	can be: 'Plus', 'Minus' or 'Mixed'
 * in squareTwo     can be: 'A', 'B' or 'C' */
let sublevelType;

/* GAME DIFFICULTY 
 * in squareOne 			can be: 1..3
 * in circleOne/squareTwo	can be: 1..5 */
let gameDifficulty;



// Colors
const colors = {
	white: "#fff",
	black: "#000",
	gray: "#708090",

	// used in text
	green: "#00804d",
	blue: "#003cb3",

	darkRed: "#330000",
	mediumBlue: "#000080",

	// difficulty stairs
	diffBlue: "#99b3ff",
	diffRed: "#ff6666",
	diffPurple: "#b366ff",

	// Background color
	blueBckg: "#cce5ff", // default 
	blueBckgLevel: "#a8c0e6", // in squareOne (used for floor gap)

	// ok button in name State
	teal: "#3d5c5c",

	// difficulty symbols and game color identifier 
	red: "#b30000",

	darkBlue: "#183780",
	lightBlue: "#efeff5",

	// squareTwo
	darkRed: "#330000",
	lightRed: "#d27979",
	lighterRed: "#2d9d9",

	darkGreen: "#1e2f2f",
	lightGreen: "#83afaf",
	lighterGreen: "#e0ebeb",
};

// Text styles
const textStyles = {

	dafault: { font: "12px Arial", fill: colors.black, align: "center" },

	// titles
	title1: { font: "32px Arial", fill: colors.green, align: "center" },
	title2: { font: "27px Arial", fill: colors.green, align: "center" },
	title2right: { font: "27px Arial", fill: colors.green, align: 'right' },

	overtitle: { font: "20px Arial", fill: colors.darkRed, align: "center" },
	overtitlel: { font: "20px Arial", fill: colors.darkRed, align: "left" },
	overtitler: { font: "20px Arial", fill: colors.darkRed, align: "right" },

	subtitle1: { font: "27px Arial", fill: colors.blue, align: "center" },
	subtitle2: { font: "27px Arial", fill: colors.black, align: "center" },
	subtitle2l: { font: "27px Arial", fill: colors.black, align: "left" },
	subtitle2r: { font: "27px Arial", fill: colors.black, align: "right" },

	// button labels
	buttonLabel: { font: '34px Arial', fill: colors.white, align: 'center' },
	difficultyLabel: { font: '25px Arial', fill: colors.white, align: 'center' },
	// in game labels
	valueLabelBlue1: { font: '26px Arial', fill: colors.mediumBlue, align: 'center' },
	valueLabelBlue2: { font: '20px Arial', fill: colors.mediumBlue, align: 'center' }, // numbers in squareTwo
	valueLabelBlue3: { font: '15px Arial', fill: colors.mediumBlue, align: 'center' }, // fractions numbers in squareOne

};

// Navigation icons on the top of the screen
const navigationIcons = {

	// Add navigation icons on the top of the screen based on parameters

	func_addIcons: function (left_btn0, left_btn1, left_btn2, 	// first 3 icon spaces
		right_btn0, right_btn1, 			// last 2 icon spaces
		level, helpBtn) { 					// auxiliar variables

		this.level = level;
		this.helpBtn = helpBtn;

		let left_x = 10;
		let right_x = defaultWidth - 50 - 10;

		this.iconsList = [];

		// 'Descriptive labels' for the navigation icons

		this.left_text = game.add.text(left_x, 73, "", textStyles.overtitlel);

		this.right_text = game.add.text(right_x + 50, 73, "", textStyles.overtitler);

		// 'Icons' on the LEFT side of the page

		if (left_btn0) { // Return to select difficulty screen
			const icon_back = game.add.image(left_x, 10, 'back');
			this.iconsList.push(icon_back);
			left_x += 50; // Offsets value of x for next icon
		}

		if (left_btn1) { // Return to main menu screen
			const icon_list = game.add.image(left_x, 10, 'menu');
			this.iconsList.push(icon_list);
			left_x += 50; // Offsets value of x for next icon
		}

		if (left_btn2) { // In some levels, shows solution to the game
			const icon_help = game.add.image(left_x, 10, 'help');
			this.iconsList.push(icon_help);
			left_x += 50; // Offsets value of x for next icon
		}

		// 'Icons' on the RIGHT side of the page

		if (right_btn0) { // Turns game audio on/off
			this.icon_audio = game.add.sprite(right_x, 10, 'audio', 1);
			audioStatus ? this.icon_audio.curFrame = 0 : this.icon_audio.curFrame = 1;
			this.iconsList.push(this.icon_audio);
			right_x -= 50; // Offsets value of x for next icon
		}

		if (right_btn1) { // Return to select language screen
			icon_world = game.add.image(right_x, 10, 'language');
			this.iconsList.push(icon_world);
			right_x -= 50; // Offsets value of x for next icon
		}

	},

	func_CallScreen: function (screen) {

		if (audioStatus) game.audio.beepSound.play();

		game.event.clear(self);

		screen.preload();

	},

	func_onInputDown: function (x, y) {

		navigationIcons.iconsList.forEach(cur => {

			const valid = y >= cur.yWithAnchor && y <= (cur.yWithAnchor + cur.height * cur.scaleHeight) &&
				(x >= cur.xWithAnchor && x <= (cur.xWithAnchor + cur.width * cur.scaleWidth));

			if (valid) {
				if (cur.name == 'back') navigationIcons.func_CallScreen(navigationIcons.level);
				else if (cur.name == 'menu') navigationIcons.func_CallScreen(menuScreen);
				else if (cur.name == 'help') navigationIcons.helpBtn();
				else if (cur.name == 'language') navigationIcons.func_CallScreen(langScreen);
				else if (cur.name == 'audio') {
					if (audioStatus) {
						audioStatus = false;
						navigationIcons.icon_audio.curFrame = 1;
					} else {
						audioStatus = true;
						navigationIcons.icon_audio.curFrame = 0;
					}
					game.render.all();
				}
			}
		});
	},

	func_onInputOver: function (x, y) {

		let flag = false;

		navigationIcons.iconsList.forEach(cur => {

			const valid = y >= cur.yWithAnchor && y <= (cur.yWithAnchor + cur.height * cur.scaleHeight) &&
				(x >= cur.xWithAnchor && x <= (cur.xWithAnchor + cur.width * cur.scaleWidth));

			if (valid) {

				flag = true;

				if (cur.name == 'back') navigationIcons.left_text.name = game.lang.menu_back;
				else if (cur.name == 'menu') navigationIcons.left_text.name = game.lang.menu_list;
				else if (cur.name == 'help') navigationIcons.left_text.name = game.lang.menu_help;

				else if (cur.name == 'language') navigationIcons.right_text.name = game.lang.menu_world;
				else if (cur.name == 'audio') navigationIcons.right_text.name = game.lang.audio;

			}

		});

		if (!flag) {
			navigationIcons.left_text.name = "";
			navigationIcons.right_text.name = "";
		} else {
			document.body.style.cursor = "pointer";
		}

	}

};

// Send game information to database 
const postScore = function (extraData) {

	// Create some variables we need to send to our PHP file
	const data = "s_ip=143.107.45.11"
		+ "&s_name=" + playerName
		+ "&s_lang=" + langString
		+ extraData;

	const url = "php/save.php";

	const hr = new XMLHttpRequest();

	hr.open("POST", url, true);

	hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	hr.onreadystatechange = function () {
		if (debugMode) console.log(hr);
		if (hr.readyState == 4 && hr.status == 200) {
			if (debugMode) console.log(hr.responseText);
		}
	}

	// Send the data to PHP now... and wait for response to update the status div
	hr.send(data); // Actually execute the request

	if (debugMode) {
		console.log("processing...");
		console.log(data);
	}

};