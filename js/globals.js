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

const info = {

	squareOne : {
		gameShape : 'Square',
		gameType : 'squareOne',
		gameTypeUrl : 'game0',
		levelType : ['A', 'B'],
		levelTypeUrl : ['level0', 'level1'],
		sublevelType : ['Plus', 'Minus'],
		gameDifficulty : 3
	},

	circleOne : {
		gameShape : 'Circle',
		gameType : 'circleOne',
		gameTypeUrl : 'game1',
		levelType : ['A', 'B'],
		levelTypeUrl : ['level2','level3'],
		sublevelType : ['Plus', 'Minus', 'Mixed'],
		gameDifficulty : 5
	},

	squareTwo : {
		gameShape : 'Square',
		gameType : 'squareTwo',
		gameTypeUrl : 'game2',
		levelType : ['C'],
		levelTypeUrl : [],
		sublevelType : [/*'A',*/ 'B', 'C'],
		gameDifficulty : 5
	},

	gameShape : [],
	gameType : [],
	gameTypeUrl : [],
	levelType : [],
	levelTypeUrl : [],
	sublevelType : [],
	gameDifficulty : [],

	start : function () {

		info.gameShape = [ 
			info.squareOne.gameShape, 
			info.circleOne.gameShape, 
			info.squareTwo.gameShape
		];
	
		info.gameType = [ 
			info.squareOne.gameType, 
			info.circleOne.gameType,
			info.squareTwo.gameType
		];
	
		info.gameTypeUrl = [ 
			info.squareOne.gameTypeUrl, 
			info.circleOne.gameTypeUrl,
			info.squareTwo.gameTypeUrl
		];
	
		info.levelType = info.squareOne.levelType.concat(info.circleOne.levelType, info.squareTwo.levelType);
	
		info.levelTypeUrl = info.squareOne.levelTypeUrl.concat(info.circleOne.levelTypeUrl, info.squareTwo.levelTypeUrl);
	
		info.sublevelType = info.squareOne.sublevelType.concat(info.circleOne.sublevelType, info.squareTwo.sublevelType);
	
		info.gameDifficulty = [ 
			info.squareOne.gameDifficulty, 
			info.circleOne.gameDifficulty, 
			info.squareTwo.gameDifficulty 
		];

	},

};

// Colors
const colors = {

	// blues

	blueBckg: "#cce5ff", // background color 
	blueBckgOff: "#adc8e6",
	blueBckgInsideLevel: "#a8c0e6", // background color in squareOne (used for floor gap)
	blue: "#003cb3", // subtitle
	blueMenuLine: "#b7cdf4",
	darkBlue: "#183780", // linecolor that indicates right and fraction numbers

	// reds

	red: "#b30000", // linecolor that indicates left
	lightRed: "#d27979", // squareTwo figures
	darkRed: "#330000", // squareTwo figures and some titles

	// greens

	green: "#00804d", // title
	lightGreen: "#83afaf", // squareTwo figures
	darkGreen: "#1e2f2f", // squareTwo figures
	intenseGreen: "#00d600",

	// neutrals
	
	white: "#efeff5",
	gray: "#708090",
	black: "#000",
	yellow: "#fff570",
};

// Text styles
const textStyles = {

	h1_green: { font: "32px Arial,sans-serif", fill: colors.green, align: "center" }, // menu title
	h2_green: { font: "26px Arial,sans-serif", fill: colors.green, align: 'center' }, // flag labels (langScreen)

	h1_white: { font: '32px Arial,sans-serif', fill: colors.white, align: 'center' }, // ok button (nameScreen)
	h2_white: { font: '26px Arial,sans-serif', fill: colors.white, align: 'center' }, // difficulty buttons (menuScreen)
	h4_white: { font: '20px Arial,sans-serif', fill: colors.white, align: 'center' }, // difficulty numbers (menuScreen)
	p_white: { font: '14px Arial,sans-serif', fill: colors.white, align: 'center' }, // enter button (menuScreen)

	h2_brown: { font: "26px Arial,sans-serif", fill: colors.darkRed, align: "center" }, // map difficulty label
	h4_brown: { font: "20px Arial,sans-serif", fill: colors.darkRed, align: "center" }, // menu overtitle

	h2_blue_2: { font: "26px Arial,sans-serif", fill: colors.blue, align: "center" }, // menu subtitle
	h4_blue_2: { font: "20px Arial,sans-serif", fill: colors.blue, align: "center" }, // menu subtitle
	h2_blue: { font: '26px Arial,sans-serif', fill: colors.darkBlue, align: 'center' }, // fractions
	h4_blue: { font: '20px Arial,sans-serif', fill: colors.darkBlue, align: 'center' }, // fractions
	p_blue: { font: '14px Arial,sans-serif', fill: colors.darkBlue, align: 'center' }, // fractions

};


// List of media URL
url = {
	boot: {
		image: [
			// Scene
			['bgimage', medSrc + 'scene/bg.jpg'],
			['bgmap', 	medSrc + 'scene/bg_map.png'],
			['bush', 	medSrc + 'scene/bush.png'],
			['cloud', 	medSrc + 'scene/cloud.png'],
			['floor', 	medSrc + 'scene/floor.png'],
			['place_off', 	medSrc + 'scene/place_off.png'],
			['place_on', 	medSrc + 'scene/place_on.png'],
			['rock', 	medSrc + 'scene/rock.png'],
			['road', 	medSrc + 'scene/road.png'],
			['sign', 	medSrc + 'scene/sign.png'],
			['tree1', 	medSrc + 'scene/tree.png'],
			['tree2', 	medSrc + 'scene/tree2.png'],
			['tree3', 	medSrc + 'scene/tree3.png'],
			['tree4', 	medSrc + 'scene/tree4.png'],
			// Flags
			['flag_BR', medSrc + 'flag/BRAZ.jpg'],
			['flag_FR', medSrc + 'flag/FRAN.jpg'],
			['flag_IT', medSrc + 'flag/ITAL.png'],
			['flag_PE', medSrc + 'flag/PERU.jpg'],
			['flag_US', medSrc + 'flag/UNST.jpg'],
			// Navigation icons on the top of the page
			['back', 		medSrc + 'navig_icon/back.png'],
			['help', 		medSrc + 'navig_icon/help.png'],
			['home', 		medSrc + 'navig_icon/home.png'],
			['language', 	medSrc + 'navig_icon/language.png'],
			['menu', 		medSrc + 'navig_icon/menu.png'],
			// Interactive icons
			['arrow_down', 		medSrc + 'interac_icon/down.png'],
			['error', 			medSrc + 'interac_icon/error.png'],
			['help_pointer', 	medSrc + 'interac_icon/pointer.png'],
			['ok',				medSrc + 'interac_icon/ok.png'],
			// Non-interactive icons
			['arrow_double', 	medSrc + 'non_interac_icon/double.png'],
			['arrow_left', 		medSrc + 'non_interac_icon/left_arrow.png'],
			['arrow_right', 	medSrc + 'non_interac_icon/right_arrow.png'],
			['equal', 			medSrc + 'non_interac_icon/equal.png']
		],
		sprite: [
			// Game Sprites
			['kid_walk', 	medSrc + 'character/kid/walk.png', 26],
			// Navigation icons on the top of the page
			['audio', 		medSrc + 'navig_icon/audio.png', 2],
			// Interactive icons
			['select', 		medSrc + 'interac_icon/selectionBox.png', 2]
		],
		audio: [
			// Sound effects
			['beepSound', ['assets/audio/beep.ogg', 'assets/audio/beep.mp3']],
			['okSound', ['assets/audio/ok.ogg', 'assets/audio/ok.mp3']],
			['errorSound', ['assets/audio/error.ogg', 'assets/audio/error.mp3']]
		]
	},
	menu: {
		image: [
			// Game
			['game0', medSrc + 'levels/squareOne.png'], // Square I
			['game1', medSrc + 'levels/circleOne.png'], // Circle I
			['game2', medSrc + 'levels/squareTwo.png'], // Square II
			// level
			['level0', medSrc + 'levels/squareOne_1.png'], // Square I : A
			['level1', medSrc + 'levels/squareOne_2.png'], // Square I : B
			['level2', medSrc + 'levels/circleOne_1.png'], // Circle I : A
			['level3', medSrc + 'levels/circleOne_2.png'], // Circle I : B
			['level4', medSrc + 'levels/squareTwo.png'],  // Square II : C
			// sublevel
			['sublevel_right', medSrc + 'levels/sublevel_right.png'], // Square I/II : left
			['sublevel_left', medSrc + 'levels/sublevel_left.png'], // Square I/II : right
			['sublevel_mixed', medSrc + 'levels/sublevel_mixed.png'], // Circle I : mixed
			['sublevel_top', medSrc + 'levels/sublevel_top.png'], // Square II : top
			['sublevel_bottom', medSrc + 'levels/sublevel_bottom.png']  // Square II : bottom
		],
		sprite: [],
		audio: []
	},
	squareOne: {
		image: [
			// Scene
			['farm', 	medSrc + 'scene/farm.png'],
			['garage', 	medSrc + 'scene/garage.png']
		],
		sprite: [
			// Game sprites
			['tractor', medSrc + 'character/tractor/tractor.png', 15]
		],
		audio: []
	},
	squareTwo: {
		image: [
			// Scene
			['house', 	medSrc + 'scene/house.png'],
			['school', 	medSrc + 'scene/school.png']
		],
		sprite: [
			// Game sprites
			['kid_standing', 	medSrc + 'character/kid/lost.png', 6],
			['kid_run', 		medSrc + 'character/kid/run.png', 12]
		],
		audio: []
	},
	circleOne: {
		image: [
			// Scene
			['house', medSrc + 'scene/house.png'],
			['school', medSrc + 'scene/school.png'],
			// Game images
			['balloon', medSrc + 'character/balloon/airballoon_upper.png'],
			['balloon_basket', medSrc + 'character/balloon/airballoon_base.png']
		],
		sprite: [
			// Game sprites
			['kid_run', medSrc + 'character/kid/run.png', 12]
		],
		audio: []
	},
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

		this.left_text = game.add.text(left_x, 73, "", textStyles.h4_brown, 'left');

		this.right_text = game.add.text(right_x + 50, 73, "", textStyles.h4_brown, 'right');

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

			const valid = y >= cur.yWithAnchor && y <= (cur.yWithAnchor + cur.height * cur.scale) &&
				(x >= cur.xWithAnchor && x <= (cur.xWithAnchor + cur.width * cur.scale));

			if (valid) {
				const name = cur.name;
				switch (name) {
					case 'back' : navigationIcons.func_CallScreen(navigationIcons.level); break;
					case 'menu' : navigationIcons.func_CallScreen(menuScreen); break;
					case 'help' : navigationIcons.helpBtn(); break;
					case 'language' : navigationIcons.func_CallScreen(langScreen); break;
					case  'audio' :
						if (audioStatus) {
							audioStatus = false;
							navigationIcons.icon_audio.curFrame = 1;
						} else {
							audioStatus = true;
							navigationIcons.icon_audio.curFrame = 0;
						}
						game.render.all();
						break;
					default: console.log("Game error: error in navigation icon")
				}
			}
		});
	},

	func_onInputOver: function (x, y) {

		let flag = false;

		navigationIcons.iconsList.forEach(cur => {

			const valid = y >= cur.yWithAnchor && y <= (cur.yWithAnchor + cur.height * cur.scale) &&
				(x >= cur.xWithAnchor && x <= (cur.xWithAnchor + cur.width * cur.scale));

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