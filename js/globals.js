const imgsrc = "assets/img/"
const defaultWidth = 900;
const defaultHeight = 600;

const debugMode = false; 	// Turns console messages ON/OFF
let audioStatus = false; 	// Turns game audio ON/OFF

let playerName;
let langString; 			// String that contains the selected language
let lang = {};
let sound = {};

let levelLabel = true; 		// Turns explicitly showing the fractions in levels ON/OFF

let currentGameState; 		// Name of the current selected 'game' state
let self;

let mapPosition;			// character position in the map
let mapCanMove;				// When true the character can move to next position in the map
let completedLevels;		// Number of finished levels in the map

let levelShape;		 	    // Can be 'circle' or 'square'
let levelDifficulty; 		// A value from 1..3 or 1..5 that defines the current level difficulty

/* LEVEL TYPE (the ones in the menu screen)
 * in squareOne/circleOne can be: 'A' (click on the floor) or 'B' (click on the amount to go/stacked figures)
 * in squareTwo           can be: 'C' (comparing fractions) */
let levelType;

/* SUBLEVEL TYPE (the ones in the difficulty screen)
 * in squareOne		levels can be: 'Plus' or 'Minus'
 * in circleOne 	levels can be: 'Plus', 'Minus' or 'Mixed'
 * in squareTwo     levels can be: 'A', 'B' or 'C' */
let sublevelType;

let timer, totalTime; // Counts time spent in each game

const hip = "143.107.45.11"; // Host ip

// Colors available
const colors = {
	// used in text
	green: 		"#00804d",
	darkRed: 	"#330000",
	blue: 		"#003cb3",
	mediumBlue: "#000080",
	black: 		"#000000",
	almostWhite: "#f0f5f5",
	// difficulty stairs
	diffBlue: 	"0x99b3ff",
	diffRed: 	"0xff6666",
	diffPurple: "0xb366ff",
	// Background color
	blueBckg: 		0xcce5ff, // default 
	blueBckgLevel: 	0xa8c0e6, // in gameSquareOne (used for floor gap)
	// ok button in name State
	teal:			0x3d5c5c,
	// difficulty symbols and game color identifier 
	darkBlue: 		0x31314e,
	red: 			0xb30000,
	lightBlue: 		0xefeff5,
	// gameSquareTwo
	darkRed_: 		0x330000,
	lightRed: 		0xd27979,
	lighterRed: 	0xf2d9d9,
	darkGreen: 		0x1e2f2f,
	lightGreen: 	0x83afaf,
	lighterGreen: 	0xe0ebeb,
};

// Text styles available
const textStyles = {

	// titles
	title1: { font: "32px Arial", fill: colors.green, align: "center" },
	title2: { font: "27px Arial", fill: colors.green, align: "center" },

	overtitle: { font: "20px Arial", fill: colors.darkRed, align: "center" },

	subtitle1: { font: "27px Arial", fill: colors.blue, align: "center" },
	subtitle2: { font: "27px Arial", fill: colors.black, align: "center" },

	// button labels
	buttonLabel: { font: '34px Arial', fill: colors.almostWhite, align: 'center' },
	difficultyLabel: { font: '25px Arial', fill: colors.almostWhite, align: 'center' },
	// in game labels
	valueLabelBlue1: { font: '26px Arial', fill: colors.mediumBlue, align: 'center' },
	valueLabelBlue2: { font: '20px Arial', fill: colors.mediumBlue, align: 'center' }, // numbers in gameSquareTwo
	valueLabelBlue3: { font: '15px Arial', fill: colors.mediumBlue, align: 'center' }, // fractions numbers in gameSquareOne

};

// images, spritesheets and audio files
const media = {

	boot: function (type) {
		image = [
			// scenario
			['birch',	imgsrc + 'scenario/birch.png'],
			['bgimage', imgsrc + 'scenario/bg.jpg'],
			['bgmap',	imgsrc + 'scenario/bg_map.png'],
			['cloud', 	imgsrc + 'scenario/cloud.png'],
			['floor', 	imgsrc + 'scenario/floor.png'],
			['place_a', imgsrc + 'scenario/place_a.png'],
			['place_b', imgsrc + 'scenario/place_b.png'],
			['rock', 	imgsrc + 'scenario/rock.png'],
			['road', 	imgsrc + 'scenario/road.png'],
			['sign', 	imgsrc + 'scenario/sign.png'],
			['tree1', 	imgsrc + 'scenario/tree.png'],
			['tree2', 	imgsrc + 'scenario/tree2.png'],
			['tree3', 	imgsrc + 'scenario/tree3.png'],
			['tree4', 	imgsrc + 'scenario/tree4.png'],
			// flags
			['flag_BR', imgsrc + 'flag/BRAZ.jpg'],
			['flag_FR', imgsrc + 'flag/FRAN.jpg'],
			['flag_IT', imgsrc + 'flag/ITAL.png'],
			['flag_PE', imgsrc + 'flag/PERU.jpg'],
			['flag_US', imgsrc + 'flag/UNST.jpg'],
			// Navigation icons on the top of the page
			['back', 	imgsrc + 'navIcon/back.png'],
			['block', 	imgsrc + 'navIcon/block.png'],
			['help',	imgsrc + 'navIcon/help.png'],
			['home', 	imgsrc + 'navIcon/home.png'],
			['world', 	imgsrc + 'navIcon/language.png'],
			['list', 	imgsrc + 'navIcon/menu.png'],
			['pgbar', 	imgsrc + 'navIcon/progressBar.png'],
			// mathematical operators 
			['equal', 			imgsrc + 'operator/equal.png'],
			['fractionLine', 	imgsrc + 'operator/fractionLine.png'],
			//feedback options 
			['h_arrow', 	imgsrc + 'help/arrow.png'],
			['h_double', 	imgsrc + 'help/double.png'],
			['down', 		imgsrc + 'help/down.png'],
			['h_error', 	imgsrc + 'help/error.png'],
			['h_ok', 		imgsrc + 'help/ok.png'],
			['pointer', 	imgsrc + 'help/pointer.png'],
		];
		spritesheet = [
			// Game Sprites
			['kid_walk', imgsrc + 'character/kid/walk.png', 78, 175, 26],
			// Menu icons n the top of the page
			['audio', 	imgsrc + 'navIcon/audio_48x48.png', 48, 48, 2],
			// feedback options 
			['select', 	imgsrc + 'help/selectionBox.png', 310, 310, 2],
		];
		audio = [
			// Sound effects
			['beepSound', ['/Ifractions-web/assets/audio/beep.ogg', '/Ifractions-web/assets/audio/beep.mp3']],
			['okSound', ['/Ifractions-web/assets/audio/ok.ogg', '/Ifractions-web/assets/audio/ok.mp3']],
			['errorSound', ['/Ifractions-web/assets/audio/error.ogg', '/Ifractions-web/assets/audio/error.mp3']],
		];
		return media.returnType(type);
	},

	gameSquareOne: function (type) {
		image = [
			// scenario
			['farm', 	imgsrc + 'scenario/farm.png'],
			['garage', 	imgsrc + 'scenario/garage.png'],
		];
		spritesheet = [
			// Game sprites
			['tractor', imgsrc + 'character/tractor/frame.png', 201, 144, 10]
		];
		audio = [];
		return media.returnType(type);
	},

	gameSquareTwo: function (type) {
		image = [
			// scenario
			['house', 	imgsrc + 'scenario/house.png'],
			['school', 	imgsrc + 'scenario/school.png'],
		];
		spritesheet = [
			['kid_lost',	imgsrc + 'character/kid/lost.png', 72, 170, 6],
			['kid_run', 	imgsrc + 'character/kid/run.png', 82, 178, 12],
		];
		audio = [];
		return media.returnType(type);
	},

	gameCircleOne: function (type) {
		image = [
			// scenario
			['house', 	imgsrc + 'scenario/house.png'],
			['school', 	imgsrc + 'scenario/school.png'],
			// Game Sprites
			['balloon', 		imgsrc + 'character/balloon/airballoon_upper.png'],
			['balloon_basket', 	imgsrc + 'character/balloon/airballoon_base.png'],
		];
		spritesheet = [
			['kid_run', imgsrc + 'character/kid/run.png', 82, 178, 12],
		];
		audio = [];
		return media.returnType(type);
	},

	menu: function (type) {
		image = [
			// level Icrons
			['', imgsrc + 'game/squareOne_1.png', 'Square', 'A'], // Square I
			['', imgsrc + 'game/squareOne_2.png', 'Square', 'B'], // Square II
			['', imgsrc + 'game/circleOne_1.png', 'Circle', 'A'], // Circle I
			['', imgsrc + 'game/circleOne_2.png', 'Circle', 'B'], // Circle II
			['', imgsrc + 'game/squareTwo_3.png', 'Square', 'C']	// Square III
		];
		if (debugMode) {
			for (let i = 0; i < 8; i++) {
				image.push(['', imgsrc + 'game/squareTwo_3.png', 'Square', 'C']);
			}
		}
		audio = [];
		spritesheet = [];
		return media.returnType(type);
	},

	returnType: function (type) {
		if (type == 'image') return image;
		else if (type == 'spritesheet') return spritesheet;
		else if (type == 'audio') return audio;
	},

};

// Control navigation icons on the top of the screen
let iconSettings = {

	// Add navigation icons on the top of the screen based on parameters
	func_addIcons: function (left_side, right_side, // icon side
		left_btn0, left_btn1, left_btn2, // first 3 icon spaces
		right_btn0, right_btn1, // last 2 icon spaces
		level, helpBtn) { // auxiliar variables

		let left_x = 10;
		let right_x = defaultWidth - 50 - 10;

		// 'Descriptive labels' for the navigation icons

		if (left_side) this.left_text = game.add.text(left_x, 53, "", textStyles.overtitle);

		if (right_side) {
			this.right_text = game.add.text(right_x + 50, 53, "", textStyles.overtitle);
			this.right_text.anchor.setTo(1, 0.02);
		}

		// 'Icons' on the LEFT side of the page

		if (left_btn0) { // Return to select difficulty screen
			const icon_back = game.add.sprite(left_x, 10, 'back');

			icon_back.inputEnabled = true;
			icon_back.input.useHandCursor = true;
			icon_back.events.onInputDown.add(this.func_callState, { state: level });
			icon_back.events.onInputOver.add(function () { this.left_text.text = lang.menu_back }, { left_text: this.left_text });
			icon_back.events.onInputOut.add(function () { this.left_text.text = "" }, { left_text: this.left_text });
			// Offsets value of x for next icon
			left_x += 50;
		}

		if (left_btn1) { // Return to main menu screen
			const icon_list = game.add.sprite(left_x, 10, 'list');

			icon_list.inputEnabled = true;
			icon_list.input.useHandCursor = true;
			icon_list.events.onInputDown.add(this.func_callState, { state: "menu" });
			icon_list.events.onInputOver.add(function () { this.left_text.text = lang.menu_list }, { left_text: this.left_text });
			icon_list.events.onInputOut.add(function () { this.left_text.text = "" }, { left_text: this.left_text });
			// Offsets value of x for next icon
			left_x += 50;
		}

		if (left_btn2) { // In some levels, shows solution to the game
			const icon_help = game.add.sprite(left_x, 10, 'help');

			icon_help.inputEnabled = true;
			icon_help.input.useHandCursor = true;
			icon_help.events.onInputDown.add(helpBtn);
			icon_help.events.onInputOver.add(function () { this.left_text.text = lang.menu_help }, { left_text: this.left_text });
			icon_help.events.onInputOut.add(function () { this.left_text.text = "" }, { left_text: this.left_text });
			// Offsets value of x for next icon
			left_x += 50;
		}

		// 'Icons' on the RIGHT side of the page

		if (right_btn0) { // Turns game audio on/off
			this.icon_audio = game.add.sprite(right_x, 10, 'audio');
			audioStatus ? this.icon_audio.frame = 0 : this.icon_audio.frame = 1;

			this.icon_audio.inputEnabled = true;
			this.icon_audio.input.useHandCursor = true;
			this.icon_audio.events.onInputDown.add(function () { if (audioStatus) { audioStatus = false; this.icon_audio.frame = 1; } else { audioStatus = true; this.icon_audio.frame = 0; } }, { icon_audio: this.icon_audio });
			this.icon_audio.events.onInputOver.add(function () { this.right_text.text = lang.audio }, { right_text: this.right_text });
			this.icon_audio.events.onInputOut.add(function () { this.right_text.text = "" }, { right_text: this.right_text });
			// Offsets value of x for next icon
			right_x -= 50;
		}

		if (right_btn1) { // Return to select language screen
			this.icon_world = game.add.sprite(right_x, 10, 'world');

			this.icon_world.inputEnabled = true;
			this.icon_world.input.useHandCursor = true;
			this.icon_world.events.onInputDown.add(this.func_callState, { state: "language" });
			this.icon_world.events.onInputOver.add(function () { this.right_text.text = lang.menu_world }, { right_text: this.right_text });
			this.icon_world.events.onInputOut.add(function () { this.right_text.text = "" }, { right_text: this.right_text });
			// Offsets value of x for next icon
			right_x -= 50;
		}

	},

	// refresh values of x for icons when menu screen move sideways
	func_refreshRightIcons_x: function (newWidth) {
		this.right_text.x = newWidth - 10;
		this.icon_audio.x = newWidth - 50 - 10;
		this.icon_world.x = newWidth - 50 - 50 - 10;
	},

	func_callState: function () {

		if (audioStatus) sound.beepSound.play();

		game.state.start(this.state);

	}

};

let loadLangs = function (url) {

	lang = {};

	var init = {
		mode: "same-origin"
	};

	fetch(url, init)

		.then(function (response) {
			return response.text();
		})

		.then(function (text) {

			let msg = text.split("\n");

			msg.forEach((temp) => {

				try {

					let msg = temp.split("=");

					lang[msg[0].trim()] = msg[1].trim();

				} catch { console.log("erro de sintaxe corrigido"); }

			});

		});

}

let loadAudios = function (audiosURL) {

	sound = {};

	var init = {
		mode: "same-origin",
	};

	audiosURL.forEach((item) => {

		fetch(item[1][1], init)

			.then(response => response.blob())

			.then(function (myBlob) {
				sound[item[0]] = new Audio(URL.createObjectURL(myBlob));
			})

	});

};