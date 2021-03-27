const game = {

	audio: {}, lang: {}, // Holds cache reference to media : Directly used in code to get audio and dicitonary
	image: {}, sprite: {}, // Holds cache reference to media : Not directly used in code
	mediaTypes: ['lang', 'audio', 'image', 'sprite'],
	loadedMedia: [],
	isLoaded: [],
	
	// List of media URL
	url: {
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
			// @@ TRY TO MAKE GAME+I NOVAMENTE PARA NAO PRECISAR DEFINIR O NOME DO JOGO SEMPRE
			image: [
				// Level Icons
				['game0', medSrc + 'levels/squareOne_1.png', 'Square', 'A'], // Square I
				['game1', medSrc + 'levels/squareOne_2.png', 'Square', 'B'], // Square II
				['game2', medSrc + 'levels/circleOne_1.png', 'Circle', 'A'], // Circle I
				['game3', medSrc + 'levels/circleOne_2.png', 'Circle', 'B'], // Circle II
				['game4', medSrc + 'levels/squareTwo_3.png', 'Square', 'C']	// Square III
			],
			//if (debugMode) {
			//	for (let i = 0; i < 8; i++) {
			//		image.push(['', medSrc + 'levels/squareTwo_3.png', 'Square', 'C']);
			//	}
			//}
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
	},

	// Loads a list of URL to Cache
	load: {
		lang: function (url) {
			game.isLoaded['lang'] = false;
			game.loadedMedia['lang'] = 0;
			game.lang = {}; // clear previously loaded language
			const init = { mode: "same-origin" };
			fetch(url, init)
				.then(function (response) {
					return response.text();
				})
				.then(function (text) {
					let msg = text.split("\n");
					msg.forEach(cur => {
						try {
							let msg = cur.split("=");
							game.lang[msg[0].trim()] = msg[1].trim();
						} catch (Error) { if (debugMode) console.log("Sintax error fixed"); }
						game.load._informMediaIsLoaded(msg.length - 1, 'lang');
					});
				});
		},
		audio: function (urls) {
			game.isLoaded['audio'] = false;
			game.loadedMedia['audio'] = 0;
			urls = this._getNotLoadedUrls(urls, game.audio);
			if (urls.length == 0) {
				game.load._informMediaIsLoaded(0, 'audio');
			} else {
				const init = { mode: "same-origin" };
				urls.forEach(cur => {
					fetch(cur[1][1], init)
						.then(response => response.blob())
						.then(function (myBlob) {
							game.audio[cur[0]] = new Audio(URL.createObjectURL(myBlob));
							game.load._informMediaIsLoaded(urls.length - 1, 'audio');
						});
				});
			}
		},
		image: function (urls) {
			game.isLoaded['image'] = false;
			game.loadedMedia['image'] = 0;
			urls = this._getNotLoadedUrls(urls, game.image);
			if (urls.length == 0) {
				game.load._informMediaIsLoaded(0, 'image');
			} else {
				urls.forEach(cur => {
					const img = new Image(); //HTMLImageElement
					img.onload = () => {
						game.image[cur[0]] = img;
						game.load._informMediaIsLoaded(urls.length - 1, 'image');
					}
					img.src = cur[1];
				});
			}
		},
		sprite: function (urls) {
			game.isLoaded['sprite'] = false;
			game.loadedMedia['sprite'] = 0;
			urls = this._getNotLoadedUrls(urls, game.sprite);
			if (urls.length == 0) {
				game.load._informMediaIsLoaded(0, 'sprite');
			} else {
				urls.forEach(cur => {
					const img = new Image(); //HTMLImageElement
					img.onload = () => {
						game.sprite[cur[0]] = img;
						game.load._informMediaIsLoaded(urls.length - 1, 'sprite');
					}
					img.src = cur[1];
					img.frames = cur[2];
				});
			}
		},
		// get list of urls and return only valid ones
		_getNotLoadedUrls: function (urls, media) {
			const newUrls = [];
			urls.forEach(cur => { if (media[cur[0]] == undefined) newUrls.push(cur); });
			return newUrls;
		},
		_informMediaIsLoaded: function (last, type) {
			if (game.loadedMedia[type] == last) { // if all media of that type was loaded	
				game.isLoaded[type] = true;
				game.load._isPreloadDone(type);
			}
			game.loadedMedia[type]++;
		},
		// Calls create() for current screen if all media for screen was loaded
		_isPreloadDone: function (type) {
			let flag = true;
			for (let i in game.mediaTypes) {
				// if all media for the screen was loaded flag wont change
				if (game.isLoaded[game.mediaTypes[i]] == false) {
					flag = false;
					break;
				}
			}
			// if flag doesnt change preload is complete
			if (flag) {
				game.isLoaded = [];
				game.loadedMedia[type] = 0;
				self.create();
			}
		}
	},

	// Adds new media to "media queue" to be rendered by current screen
	add: {
		// game.add.image(x, y, img)
		// game.add.image(x, y, img, scale)
		// game.add.image(x, y, img, scaleWidth, scaleHeigth)
		// game.add.image(x, y, img, scaleWidth, scaleHeigth, alpha)
		image: function (x, y, img, sW, sH, alpha) {
			if (x == undefined || y == undefined || img == undefined) console.error("Game error: parameters missing");
			else if (game.image[img] == undefined) console.error("Game error: image not found in cache: " + img);
			else {
				const med = {
					typeOfMedia: 'image',
					name: img,

					x: x || 0,
					y: y || 0,
					_xWithAnchor: x || 0,
					_yWithAnchor: y || 0,
					xAnchor: 0,
					yAnchor: 0,

					scaleWidth: sW || 1,
					scaleHeight: sW || 1,
					width: game.image[img].width,
					height: game.image[img].height,

					alpha: alpha || 1,

					anchor: function (xAnchor, yAnchor) {
						this.xAnchor = xAnchor;
						this.yAnchor = yAnchor;
					},

					get xWithAnchor() { return this.x - (this.width * this.scaleWidth * this.xAnchor); },
					get yWithAnchor() { return this.y - (this.height * this.scaleHeight * this.yAnchor); }
				};
				if (sH != undefined) med.scaleHeight = sH;
				game.render.queue.push(med);
				return med;
			}
		},
		// game.add.sprite(x, y, img) 
		// game.add.sprite(x, y, img, curFrame) 
		// game.add.sprite(x, y, img, curFrame, scale) 
		sprite: function (x, y, img, curFrame, scale) {
			if (x == undefined || y == undefined || img == undefined) console.error("Game error: parameters missing");
			else if (game.sprite[img] == undefined) console.error("Game error: sprite not found in cache: " + img);
			else {
				const med = {
					typeOfMedia: 'sprite',
					name: img,

					x: x || 0,
					y: y || 0,
					_xWithAnchor: x || 0,
					_yWithAnchor: y || 0,
					xAnchor: 0,
					yAnchor: 0,

					scaleWidth: scale || 1,
					scaleHeight: scale || 1,
					width: game.sprite[img].width / game.sprite[img].frames, // frame width
					height: game.sprite[img].height, // frame height

					curFrame: curFrame || 0,

					alpha: 1,

					anchor: function (xAnchor, yAnchor) {
						this.xAnchor = xAnchor;
						this.yAnchor = yAnchor;
					},

					get xWithAnchor() { return this.x - (this.width * this.scaleWidth * this.xAnchor); },
					get yWithAnchor() { return this.y - (this.height * this.scaleHeight * this.yAnchor); }
				};
				game.render.queue.push(med);
				return med;
			}
		},
		// game.add.text(x, y, text)
		// game.add.text(x, y, text, style) 
		text: function (x, y, text, style) {
			if (x == undefined || y == undefined || text == undefined) console.error("Game error: parameters missing");
			else {
				const med = {
					typeOfMedia: 'text',
					name: text,

					x: x || 0,
					y: y || 0,
					_xWithAnchor: x || 0,
					_yWithAnchor: y || 0,
					xAnchor: 0,
					yAnchor: 0,

					style: style || textStyles.default,

					alpha: 1,

					anchor: function () { console.error("Game error: there's no anchor for text"); },

					get xWithAnchor() { return this.x; },
					get yWithAnchor() { return this.y; }
				};
				game.render.queue.push(med);
				return med;
			}
		},
		graphic: {
			// game.add.graphics.rect(x, y, width, height)
			// game.add.graphics.rect(x, y, width, height, lineColor)
			// game.add.graphics.rect(x, y, width, height, lineColor, lineWidth)
			// game.add.graphics.rect(x, y, width, height, lineColor, lineWidth, fillColor)
			// game.add.graphics.rect(x, y, width, height, lineColor, lineWidth, fillColor, alpha)
			rect: function (x, y, width, height, lineColor, lineWidth, fillColor, alpha) {
				if (x == undefined || y == undefined || width == undefined || height == undefined) console.error("Game error: parameters missing");
				else {
					const med = {
						typeOfMedia: 'rect',

						x: x || 0,
						y: y || 0,
						_xWithAnchor: x || 0,
						_yWithAnchor: y || 0,
						xAnchor: 0,
						yAnchor: 0,

						scaleWidth: 1,
						scaleHeight: 1,
						width: width || 50,
						height: height || 50,

						lineColor: lineColor || colors.black,
						lineWidth: lineWidth || 0,	// by default there's no line width
						fillColor: fillColor || 0,

						alpha: (alpha != undefined) ? alpha : 1,

						anchor: function (xAnchor, yAnchor) {
							this.xAnchor = xAnchor;
							this.yAnchor = yAnchor;
						},

						get xWithAnchor() { return this.x - (this.width * this.scaleWidth * this.xAnchor); },
						get yWithAnchor() { return this.y - (this.height * this.scaleHeight * this.yAnchor); }
					};
					game.render.queue.push(med);
					return med;
				}
			},
			// game.add.graphics.circle(x, y, diameter)
			// game.add.graphics.circle(x, y, diameter, lineColor)
			// game.add.graphics.circle(x, y, diameter, lineColor, lineWidth)
			// game.add.graphics.circle(x, y, diameter, lineColor, lineWidth, fillColor)
			// game.add.graphics.circle(x, y, diameter, lineColor, lineWidth, fillColor, alpha)
			circle: function (x, y, diameter, lineColor, lineWidth, fillColor, alpha) {
				if (x == undefined || y == undefined || diameter == undefined) console.error("Game error: parameters missing");
				else {
					const med = {
						typeOfMedia: 'arc',

						x: x || 0,
						y: y || 0,
						_xWithAnchor: x || 0,
						_yWithAnchor: y || 0,
						xAnchor: 0,
						yAnchor: 0,

						diameter: diameter || 50,
						angleStart: 0,
						angleEnd: 2 * Math.PI,
						anticlockwise: false,

						scaleWidth: 1,
						scaleHeight: 1,
						width: diameter,
						height: diameter,

						lineColor: lineColor || colors.black,
						lineWidth: lineWidth || 0, 		// by default there's no line width
						fillColor: fillColor || colors.white,

						alpha: (alpha != undefined) ? alpha : 1,

						anchor: function (xAnchor, yAnchor) {
							this.xAnchor = xAnchor;
							this.yAnchor = yAnchor;
						},

						get xWithAnchor() { return this.x - (this.width * this.scaleWidth * this.xAnchor); },
						get yWithAnchor() { return this.y - (this.height * this.scaleHeight * this.yAnchor); }
					};
					game.render.queue.push(med);
					return med;
				}
			},
			// game.add.graphics.arc(x, y, diameter, angleStart, angleEnd, anticlockWise)
			// game.add.graphics.arc(x, y, diameter, angleStart, angleEnd, anticlockWise, lineColor)
			// game.add.graphics.arc(x, y, diameter, angleStart, angleEnd, anticlockWise, lineColor, lineWidth)
			// game.add.graphics.arc(x, y, diameter, angleStart, angleEnd, anticlockWise, lineColor, lineWidth, fillColor)
			// game.add.graphics.arc(x, y, diameter, angleStart, angleEnd, anticlockWise, lineColor, lineWidth, fillColor, alpha)
			arc: function (x, y, diameter, angleStart, angleEnd, anticlockwise, lineColor, lineWidth, fillColor, alpha) {
				if (x == undefined || y == undefined || diameter == undefined || angleStart == undefined || angleEnd == undefined) console.error("Game error: parameters missing");
				else {
					const med = {
						typeOfMedia: 'arc',

						x: x || 0,
						y: y || 0,
						_xWithAnchor: x || 0,
						_yWithAnchor: y || 0,
						xAnchor: 0,
						yAnchor: 0,

						diameter: diameter || 50,
						angleStart: angleStart,
						angleEnd: angleEnd,
						anticlockwise: anticlockwise || false,

						scaleWidth: 1,
						scaleHeight: 1,
						width: diameter,
						height: diameter,

						lineColor: lineColor || colors.black,
						lineWidth: lineWidth || 0, 		// by default there's no line width
						fillColor: fillColor || colors.white,

						alpha: (alpha != undefined) ? alpha : 1,

						anchor: function (xAnchor, yAnchor) {
							this.xAnchor = xAnchor;
							this.yAnchor = yAnchor;
						},

						get xWithAnchor() { return this.x - (this.width * this.scaleWidth * this.xAnchor); },
						get yWithAnchor() { return this.y - (this.height * this.scaleHeight * this.yAnchor); }
					};
					game.render.queue.push(med);
					return med;
				}
			}
		}
	},

	// Renders media on current screen
	render: {
		queue: [], // media queue to be rendered by the current state
		_image: function (cur) {	// ( x, y, img, sW, sH, alpha)
			const x = cur.xWithAnchor, y = cur.yWithAnchor;
			if (cur.rotate && cur.rotate != 0) {
				context.save();
				context.translate(cur.x, cur.y);
				context.rotate(cur.rotate * Math.PI / 180);
				context.translate(-cur.x, -cur.y);
			}
			context.globalAlpha = cur.alpha;
			context.drawImage(
				game.image[cur.name],
				x,
				y,
				cur.width * cur.scaleWidth,
				cur.height * cur.scaleHeight
			);
			context.globalAlpha = 1;
			if (cur.rotate && cur.rotate != 0) context.restore();
		},
		_sprite: function (cur) {	// ( x, y, img, curFrame, s )
			const x = cur.xWithAnchor, y = cur.yWithAnchor;
			if (cur.rotate && cur.rotate != 0) {
				context.save();
				context.translate(cur.x, cur.y);
				context.rotate(cur.rotate * Math.PI / 180);
				context.translate(-cur.x, -cur.y);
			}
			context.globalAlpha = cur.alpha;
			context.drawImage(
				game.sprite[cur.name],
				cur.width * cur.curFrame,
				0,
				cur.width,
				cur.height,
				x,
				y,
				cur.width * cur.scaleWidth,
				cur.height * cur.scaleHeight
			);
			context.globalAlpha = 1;
			if (cur.rotate && cur.rotate != 0) context.restore();
		},
		_text: function (cur) {		// ( x, y, text, style )
			const x = cur.xWithAnchor, y = cur.yWithAnchor;
			if (cur.rotate && cur.rotate != 0) {
				context.save();
				context.translate(cur.x, cur.y);
				context.rotate(cur.rotate * Math.PI / 180);
				context.translate(-cur.x, -cur.y);
			}
			context.globalAlpha = cur.alpha;
			context.font = cur.style.font;
			context.textAlign = cur.style.align;
			context.fillStyle = cur.style.fill;
			context.fillText(cur.name, x, y);
			context.globalAlpha = 1;
			if (cur.rotate && cur.rotate != 0) context.restore();
		},
		_graphic: {
			_rect: function (cur) { // ( x, y, width, height, lineColor, lineWidth, fillColor, alpha)
				const x = cur.xWithAnchor, y = cur.yWithAnchor;
				if (cur.rotate && cur.rotate != 0) {
					context.save();
					context.translate(cur.x, cur.y);
					context.rotate(cur.rotate * Math.PI / 180);
					context.translate(-cur.x, -cur.y);
				}
				context.globalAlpha = cur.alpha;
				if (cur.fillColor != 0) {
					context.fillStyle = cur.fillColor;
					context.fillRect(x, y, cur.width, cur.height);
				}
				if (cur.lineWidth != 0) {
					context.strokeStyle = cur.lineColor;
					context.lineWidth = cur.lineWidth;
					context.strokeRect(x, y, cur.width, cur.height);
				}
				context.globalAlpha = 1;
				if (cur.rotate && cur.rotate != 0) context.restore();
			},

			_arc: function (cur) {	// ( x, y, diameter, angleStart, angleEnd, anticlockWise, lineColor, lineWidth, fillColor, alpha);
				const x = cur.xWithAnchor, y = cur.yWithAnchor;
				if (cur.rotate && cur.rotate != 0) {
					context.save();
					context.translate(cur.x, cur.y);
					context.rotate(cur.rotate * Math.PI / 180);
					context.translate(-cur.x, -cur.y);
				}
				context.globalAlpha = cur.alpha;
				context.fillStyle = cur.fillColor;
				context.strokeStyle = cur.lineColor;
				context.lineWidth = cur.lineWidth;
				context.beginPath();
				if (cur.angleEnd != 2 * Math.PI) context.lineTo(x, y);
				context.arc(x, y, cur.diameter / 2, cur.angleStart, cur.angleEnd, cur.anticlockwise);
				if (cur.angleEnd != 2 * Math.PI) context.lineTo(x, y);
				context.fill();
				context.stroke();
				context.globalAlpha = 1;
				if (cur.rotate && cur.rotate != 0) context.restore();
			},

		},
		// game.render.all() : draws all queued media to screen
		all: function () {
			game.render.queue.forEach(cur => {
				switch (cur.typeOfMedia) {
					case 'image': this._image(cur); break;
					case 'sprite': this._sprite(cur); break;
					case 'text': this._text(cur); break;
					case 'rect': this._graphic._rect(cur); break;
					case 'arc': this._graphic._arc(cur); break;
				}
			});

		},
		// game.render.clear() : clears all queued media
		clear: function () {
			game.render.queue = [];
		}
	},

	// Math functions
	math: {
		randomInRange: function (min, max) { // integer
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is also inclusive
		},
		randomDivisor: function (number) { //Get random divisor for a number
			const validDivisors = []; // Divisors found
			for (let i = 2; i < number; i++) {
				// if 'number' can be divided by 'i', add to list of 'validDivisors'
				if (number % i == 0) validDivisors.push(i);
			}
			const randIndex = game.math.randomInRange(0, validDivisors.length - 1);
			return validDivisors[randIndex];
		},
		degreeToRad: function (degree) {
			return degree * Math.PI / 180;
		},
		radToDegree: function (radian) {
			return radian * 180 / Math.PI;
		},
		distanceToPointer: function (xMouse, xIcon, yMouse, yIcon) {
			const a = Math.max(xMouse, xIcon) - Math.min(xMouse, xIcon);
			const b = Math.max(yMouse, yIcon) - Math.min(yMouse, yIcon);
			return Math.sqrt(a * a + b * b);
		},
	},

	// Timer 
	timer: {
		_start: 0,	// start time
		_end: 0,	// end time
		elapsed: 0, // elapsed time
		start: function () {
			game.timer._start = game.timer._end = game.timer._elapsed = 0; // clear
			game.timer._start = new Date().getTime(); // set start time
		},
		stop: function () {
			if (game.timer._start != 0 && game.timer._end == 0) { // if timer has started but not finished
				game.timer._end = new Date().getTime(); // set end time
				game.timer._elapsed = Math.floor((game.timer._end - game.timer._start) / 1000); // set elapsed time
			}
		},
		get elapsed() { return game.timer._elapsed; }
	},

	// Handles to pointer events
	event: {
		_list: [], // list of events in current state
		add: function (name, func) {
			canvas.addEventListener(name, func); // param : name of the event, function to be called
			game.event._list.push([name, func]);
		},
		clear: function () {
			game.event._list.forEach(cur => {
				canvas.removeEventListener(cur[0], cur[1]);
			});
			game.event._list = [];
		},
	},

	// Game loop : handles repetition of method update and sprite animation
	// game.loop.start();
	// game.loop.stop();
	loop: {
		id: undefined,		// holds animation event
		curState: undefined,	// state that called loop
		status: "off", 	// loop status can be : 'on', 'ending' or 'off'
		waitingToStart: undefined,
		startTime: 0,
		DURATION: 1000 / 60, // 1000: 1 second | 60: expected frames per second
		start: function (state) {
			if (game.loop.status == "off") {
				game.loop.curState = state;
				game.loop.startTime = new Date().getTime();
				game.loop.status = "on";
				game.loop.id = requestAnimationFrame(game.loop._run);
			} else { // if "game.loop.status" is either "on" or "ending"
				game.loop.waitingToStart = state;
				if (game.loop.status == "on") game.loop.stop();
			}
		},
		stop: function () {
			if (game.loop.status == "on") game.loop.status = "ending";
		},
		_run: function () {
			if (game.loop.status != "on") {
				game.loop._clear();
			} else {
				const timestamp = new Date().getTime();
				const runtime = timestamp - game.loop.startTime;
				if (runtime >= game.loop.DURATION) {
					if (debugMode) {
						let fps = runtime / 1000;
						fps = Math.round(1 / fps);
						displayFps.innerHTML = "Fps: " + fps; // show fps
					}
					// Update state
					game.loop.curState.update();
					// Animate state
					game.animation._run();
				}
				game.loop.id = requestAnimationFrame(game.loop._run);
			}
		},
		_clear: function () {
			if (game.loop.id != undefined) {
				cancelAnimationFrame(game.loop.id);	// cancel animation event
				game.loop.id = undefined;		// clear object that holds animation event	
				game.loop.curState = undefined;	// clear object that holds current state
				game.loop.status = "off"; 	// inform animation must end (read in _run())
				displayFps.innerHTML = "";	// Stop showing fps
			}
			if (game.loop.waitingToStart != undefined) {
				const temp = game.loop.waitingToStart;
				game.loop.waitingToStart = undefined;
				game.loop.start(temp);
			}
		},
	},

	// Change frames in queued spritesheets making animation
	// game.animation.play(<animationName>); 
	// game.animation.stop(<animationName>);
	// game.animation.clear();
	animation: {
		queue: [], // animation queue for current level
		count: 0,
		play: function (name) {
			let newAnimation;
			// gets first object that has that animation name (name) in game.render.queue
			for (let i in game.render.queue) {
				if (game.render.queue[i].animation != undefined && game.render.queue[i].animation[0] == name) {
					newAnimation = game.render.queue[i];
					break;
				}
			}
			// If found, saves object in game.animation.queue
			if (newAnimation != undefined) game.animation.queue.push(newAnimation);
		},
		stop: function (name) {
			// remove all with that name is game.animation.queue
			game.animation.queue.forEach(cur => {
				if (cur.animation[0] == name) {
					game.animation.queue.splice(cur, 1);
				}
			});
		},
		_run: function () {
			game.animation.queue.forEach(character => {
				if (!character.animation[2] || game.animation.count % character.animation[2] == 0) {
					const i = character.animation[1].indexOf(character.curFrame);
					if (i == -1) { // frame not found
						if (debugMode) console.error("Game error: animation frame not found");
					} else if (i < character.animation[1].length - 1) { // go to next frame
						character.curFrame = character.animation[1][i + 1];
					} else {
						character.curFrame = character.animation[1][0]; // if last frame, restart
					}
				}
			});
			game.animation.count++;
		},
		clear: function () {
			// resets animation count
			game.animation.count = 0;
			// clears property 'animation' from objects in game.render.queue
			game.render.queue.forEach(cur => {
				if (cur.animation != undefined) {
					delete cur.animation;
				}
			});
			// clears game.animation.queue
			game.animation.queue = [];
		},
	}

};