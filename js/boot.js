// Start phaser
const game = new Phaser.Game(
	defaultWidth,
	defaultHeight,
	Phaser.CANVAS,
	'fractions-game'
);

// Game state : preload progress bar icon to use while preloading game assets

let loadProgressBar = {
	preload: function () {
		game.load.image('progressBar', imgsrc + 'scenario/pgbar.png');
	},
	create: function () {
		game.state.start('loadAssets');
	}
};

// Game state : Load assets (and calls first game screen)

let loadAssets = {

	preload: function () {

		// Create progress bar
		const progressBar = game.add.sprite(game.world.centerX, game.world.centerY, 'progressBar');
		progressBar.anchor.setTo(0.5, 0.5);
		// Executes progress bar untill the end of preload function
		game.load.setPreloadSprite(progressBar);

		// Sets default background color (persistent through screen changes)
		game.stage.backgroundColor = colors.blueBckg;

		// Loading assets

		loadAudios(media.boot('audio'));

		for (let i = 0, image = media.boot('image'); i < image.length; i++) {
			game.load.image(image[i][0], image[i][1]);
		}

		for (let i = 0, sprite = media.boot('spritesheet'); i < sprite.length; i++) {
			game.load.spritesheet(sprite[i][0], sprite[i][1], sprite[i][2], sprite[i][3], sprite[i][4]);
		}


	},

	create: function () {

		// Centers phaser canvas in its containing div
		game.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;

		// Enable phaser Arcade Physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// Calls first screen seen by the player
		game.state.start('language');

	}

};

// Adding game states

game.state.add('language', langState); // preMenu.js
game.state.add('load', loadState); // preMenu.js
game.state.add('name', nameState); // preMenu.js
game.state.add('menu', menuState); // menu.js
game.state.add('map', mapState); // map.js
game.state.add('end', endState); // map.js
game.state.add('difficulty', difficultyState); // difficulty.js
game.state.add('gameCircleOne', gameCircleOne); // circleOne.js
game.state.add('gameSquareOne', gameSquareOne); // squareOne.js
game.state.add('gameSquareTwo', gameSquareTwo); // squareTwo.js
game.state.add('loadProgressBar', loadProgressBar); // boot.js
game.state.add('loadAssets', loadAssets); // boot.js

// Calls first game state

game.state.start('loadProgressBar');

