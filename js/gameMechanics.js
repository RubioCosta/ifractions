const game = {

	audio: {}, lang: {}, // Holds cache reference to media : Directly used in code to get audio and dicitonary
	image: {}, sprite: {}, // Holds cache reference to media : Not directly used in code
	mediaTypes: ['lang', 'audio', 'image', 'sprite'],
	loadedMedia: [],
	isLoaded: [],

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
		default : {
			// all
			x: 0,
			y: 0,
			_xWithAnchor: 0,
			_yWithAnchor: 0,
			xAnchor: 0,
			yAnchor: 0,

			shadow : false,
			shadowColor : "#0075c5",
			shadowBlur : 20,
			alpha: 1,

			// image, sprite, square, circle
			scale: 1,

			// text
			font: '14px Arial,sans-serif',
			fill: '#000',
			align: 'center',

			// square, circle (image and sprite have width and height, but do not have default values)
			width: 50,
			height: 50,

			lineColor: "#000",
			lineWidth: 1,
			fillColor: 0, // default no fill

			// circle 
			diameter: 50,
			anticlockwise: false,
		},
		// game.add.image(x, y, img)
		// game.add.image(x, y, img, scale)
		// game.add.image(x, y, img, scale, alpha)
		image: function (x, y, img, scale, alpha) {
			if (x == undefined || y == undefined || img == undefined) console.error("Game error: parameters missing");
			else if (game.image[img] == undefined) console.error("Game error: image not found in cache: " + img);
			else {
				const med = {
					typeOfMedia: 'image',
					name: img,

					x: x || game.add.default.x,
					y: y || game.add.default.y,
					_xWithAnchor: x || game.add.default._xWithAnchor,
					_yWithAnchor: y || game.add.default._yWithAnchor,
					xAnchor: game.add.default.xAnchor,
					yAnchor: game.add.default.yAnchor,

					shadow : game.add.default.shadow,
					shadowColor : game.add.default.shadowColor,
					shadowBlur : game.add.default.shadowBlur,
					alpha: (alpha != undefined) ? alpha : game.add.default.alpha,

					scale: scale || game.add.default.scale,
					width: game.image[img].width,
					height: game.image[img].height,

					anchor: function (xAnchor, yAnchor) {
						this.xAnchor = xAnchor;
						this.yAnchor = yAnchor;
					},
					get xWithAnchor() { return this.x - (this.width * this.scale * this.xAnchor); },
					get yWithAnchor() { return this.y - (this.height * this.scale * this.yAnchor); }
				};
				game.render.queue.push(med);
				return med;
			}
		},
		// game.add.sprite(x, y, img) 
		// game.add.sprite(x, y, img, curFrame) 
		// game.add.sprite(x, y, img, curFrame, scale) 
		// game.add.sprite(x, y, img, curFrame, scale, alpha) 
		sprite: function (x, y, img, curFrame, scale, alpha) {
			if (x == undefined || y == undefined || img == undefined) console.error("Game error: parameters missing");
			else if (game.sprite[img] == undefined) console.error("Game error: sprite not found in cache: " + img);
			else {
				const med = {
					typeOfMedia: 'sprite',
					name: img,

					x: x || game.add.default.x,
					y: y || game.add.default.y,
					_xWithAnchor: x || game.add.default._xWithAnchor,
					_yWithAnchor: y || game.add.default._yWithAnchor,
					xAnchor: game.add.default.xAnchor,
					yAnchor: game.add.default.yAnchor,

					shadow : game.add.default.shadow,
					shadowColor : game.add.default.shadowColor,
					shadowBlur : game.add.default.shadowBlur,
					alpha: (alpha != undefined) ? alpha : game.add.default.alpha,

					scale: scale || game.add.default.scale,
					width: game.sprite[img].width / game.sprite[img].frames, // frame width
					height: game.sprite[img].height, // frame height
					
					curFrame: curFrame || 0,

					anchor: function (xAnchor, yAnchor) {
						this.xAnchor = xAnchor;
						this.yAnchor = yAnchor;
					},
					get xWithAnchor() { return this.x - (this.width * this.scale * this.xAnchor); },
					get yWithAnchor() { return this.y - (this.height * this.scale * this.yAnchor); }
				};
				game.render.queue.push(med);
				return med;
			}
		},
		// game.add.text(x, y, text, style) 
		// game.add.text(x, y, text, style, align) 
		text: function (x, y, text, style, align) {
			if (x == undefined || y == undefined || text == undefined || style == undefined) console.error("Game error: parameters missing");
			else {
				const med = {
					typeOfMedia: 'text',
					name: text,

					x: x || game.add.default.x,
					y: y || game.add.default.y,
					_xWithAnchor: x || game.add.default._xWithAnchor,
					_yWithAnchor: y || game.add.default._yWithAnchor,
					xAnchor: game.add.default.xAnchor,
					yAnchor: game.add.default.yAnchor,

					shadow : game.add.default.shadow,
					shadowColor : game.add.default.shadowColor,
					shadowBlur : game.add.default.shadowBlur,
					alpha: game.add.default.alpha,

					font: style.font || game.add.default.font,
					fill: style.fill || game.add.default.fill,
					align: align || style.align || game.add.default.align,

					anchor: function () { console.error("Game error: there's no anchor for text"); },
					get xWithAnchor() { return this.x; },
					get yWithAnchor() { return this.y; }
				};
				game.render.queue.push(med);
				return med;
			}
		},
		graphic: {
			// game.add.graphic.rect(x, y, width, height)
			// game.add.graphic.rect(x, y, width, height, lineColor)
			// game.add.graphic.rect(x, y, width, height, lineColor, lineWidth)
			// game.add.graphic.rect(x, y, width, height, lineColor, lineWidth, fillColor)
			// game.add.graphic.rect(x, y, width, height, lineColor, lineWidth, fillColor, alpha)
			rect: function (x, y, width, height, lineColor, lineWidth, fillColor, alpha) {
				if (x == undefined || y == undefined || width == undefined) console.error("Game error: parameters missing");
				else {
					const med = {
						typeOfMedia: 'rect',

						x: x || game.add.default.x,
						y: y || game.add.default.y,
						_xWithAnchor: x || game.add.default._xWithAnchor,
						_yWithAnchor: y || game.add.default._yWithAnchor,
						xAnchor: game.add.default.xAnchor,
						yAnchor: game.add.default.yAnchor,

						shadow : game.add.default.shadow,
						shadowColor : game.add.default.shadowColor,
						shadowBlur : game.add.default.shadowBlur,
						alpha: (alpha != undefined) ? alpha : game.add.default.alpha,

						scale: game.add.default.scale,

						width: 0,
						height: 0,

						lineColor: lineColor || game.add.default.lineColor,
						lineWidth: 0,
						fillColor: fillColor || game.add.default.fillColor,

						anchor: function (xAnchor, yAnchor) {
							this.xAnchor = xAnchor;
							this.yAnchor = yAnchor;
						},
						get xWithAnchor() { return this.x - (this.width * this.scale * this.xAnchor); },
						get yWithAnchor() { return this.y - (this.height * this.scale * this.yAnchor); }
					};
					if (width != 0) { med.width = width || game.add.default.width; }
					if (height != 0) { med.height = height || width || game.add.default.height; }	
					if (lineWidth != 0) { med.lineWidth = lineWidth || game.add.default.lineWidth; }							
					game.render.queue.push(med);
					return med;
				}
			},
			// game.add.graphic.circle(x, y, diameter)
			// game.add.graphic.circle(x, y, diameter, lineColor)
			// game.add.graphic.circle(x, y, diameter, lineColor, lineWidth)
			// game.add.graphic.circle(x, y, diameter, lineColor, lineWidth, fillColor)
			// game.add.graphic.circle(x, y, diameter, lineColor, lineWidth, fillColor, alpha)
			circle: function (x, y, diameter, lineColor, lineWidth, fillColor, alpha) { 
				if (x == undefined || y == undefined || diameter == undefined) console.error("Game error: parameters missing");
				else {
					const med = {
						typeOfMedia: 'arc',
						
						x: x || game.add.default.x,
						y: y || game.add.default.y,
						_xWithAnchor: x || game.add.default._xWithAnchor,
						_yWithAnchor: y || game.add.default._yWithAnchor,
						xAnchor: game.add.default.xAnchor,
						yAnchor: game.add.default.yAnchor,

						shadow : game.add.default.shadow,
						shadowColor : game.add.default.shadowColor,
						shadowBlur : game.add.default.shadowBlur,
						alpha: (alpha != undefined) ? alpha : game.add.default.alpha,

						scale: game.add.default.scale,

						diameter: 0,

						width: 0,
						height: 0,

						angleStart: 0,
						angleEnd: 2 * Math.PI,
						anticlockwise: game.add.default.anticlockwise,

						lineColor: lineColor || game.add.default.lineColor,
						lineWidth: 0,
						fillColor: fillColor || game.add.default.fillColor,

						anchor: function (xAnchor, yAnchor) {
							this.xAnchor = xAnchor;
							this.yAnchor = yAnchor;
						},
						get xWithAnchor() { return this.x - (this.width * this.scale * this.xAnchor); },
						get yWithAnchor() { return this.y - (this.height * this.scale * this.yAnchor); }
					};
					if (diameter != 0) {
						med.diameter = diameter || game.add.default.diameter;
						med.width = med.height = med.diameter;
					}
					if (lineWidth != 0) {
						med.lineWidth = lineWidth || game.add.default.lineWidth;
					}
					game.render.queue.push(med);
					return med;
				}
			},
			// game.add.graphic.arc(x, y, diameter, angleStart, angleEnd)
			// game.add.graphic.arc(x, y, diameter, angleStart, angleEnd, anticlockWise)
			// game.add.graphic.arc(x, y, diameter, angleStart, angleEnd, anticlockWise, lineColor)
			// game.add.graphic.arc(x, y, diameter, angleStart, angleEnd, anticlockWise, lineColor, lineWidth)
			// game.add.graphic.arc(x, y, diameter, angleStart, angleEnd, anticlockWise, lineColor, lineWidth, fillColor)
			// game.add.graphic.arc(x, y, diameter, angleStart, angleEnd, anticlockWise, lineColor, lineWidth, fillColor, alpha)
			arc: function (x, y, diameter, angleStart, angleEnd, anticlockwise, lineColor, lineWidth, fillColor, alpha) {
				if (x == undefined || y == undefined || diameter == undefined || angleStart == undefined || angleEnd == undefined) console.error("Game error: parameters missing");
				else {
					const med = {
						typeOfMedia: 'arc',

						x: x || game.add.default.x,
						y: y || game.add.default.y,
						_xWithAnchor: x || game.add.default._xWithAnchor,
						_yWithAnchor: y || game.add.default._yWithAnchor,
						xAnchor: game.add.default.xAnchor,
						yAnchor: game.add.default.yAnchor,

						shadow : game.add.default.shadow,
						shadowColor : game.add.default.shadowColor,
						shadowBlur : game.add.default.shadowBlur,
						alpha: (alpha != undefined) ? alpha : game.add.default.alpha,

						scale: game.add.default.scale,

						diameter: 0,

						width: 0,
						height: 0,

						angleStart: angleStart || 0,
						angleEnd: angleEnd || 2 * Math.PI,
						anticlockwise: anticlockwise || game.add.default.anticlockwise,

						lineColor: lineColor || game.add.default.lineColor,
						lineWidth: 0,
						fillColor: fillColor || game.add.default.fillColor,

						anchor: function (xAnchor, yAnchor) {
							this.xAnchor = xAnchor;
							this.yAnchor = yAnchor;
						},
						get xWithAnchor() { return this.x - (this.width * this.scale * this.xAnchor); },
						get yWithAnchor() { return this.y - (this.height * this.scale * this.yAnchor); }
					};
					if (diameter != 0) {
						med.diameter = diameter || game.add.default.diameter;
						med.width = med.height = med.diameter;
					}
					if (lineWidth != 0) { med.lineWidth = lineWidth || game.add.default.lineWidth; }
					game.render.queue.push(med);
					return med;
				}
			}
		}
	},
	
	// Renders media on current screen
	render: {
		queue: [], // media queue to be rendered by the current state
		_image: function (cur) {	// ( x, y, img, scale, alpha)
			const x = cur.xWithAnchor, y = cur.yWithAnchor;
			if (cur.rotate && cur.rotate != 0) {
				context.save();
				context.translate(cur.x, cur.y);
				context.rotate(cur.rotate * Math.PI / 180);
				context.translate(-cur.x, -cur.y);
			}
			context.globalAlpha = cur.alpha;
			context.shadowBlur = (cur.shadow) ? cur.shadowBlur : 0;
			context.shadowColor = cur.shadowColor;
			context.drawImage(
				game.image[cur.name],
				x,
				y,
				cur.width * cur.scale,
				cur.height * cur.scale
			);
			context.shadowBlur = 0;
			context.globalAlpha = 1;
			if (cur.rotate && cur.rotate != 0) context.restore();
		},
		_sprite: function (cur) {	// ( x, y, img, curFrame, scale, alpha )
			const x = cur.xWithAnchor, y = cur.yWithAnchor;
			if (cur.rotate && cur.rotate != 0) {
				context.save();
				context.translate(cur.x, cur.y);
				context.rotate(cur.rotate * Math.PI / 180);
				context.translate(-cur.x, -cur.y);
			}
			context.globalAlpha = cur.alpha;
			context.shadowBlur = (cur.shadow) ? cur.shadowBlur : 0;
			context.shadowColor = cur.shadowColor;
			context.drawImage(
				game.sprite[cur.name],
				cur.width * cur.curFrame,
				0,
				cur.width,
				cur.height,
				x,
				y,
				cur.width * cur.scale,
				cur.height * cur.scale
			);
			context.shadowBlur = 0;
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
			context.shadowBlur = (cur.shadow) ? cur.shadowBlur : 0;
			context.shadowColor = cur.shadowColor;
			context.font = cur.font;
			context.textAlign = cur.align;
			context.fillStyle = cur.fill;
			context.fillText(cur.name, x, y);
			context.shadowBlur = 0;
			context.globalAlpha = 1;
			if (cur.rotate && cur.rotate != 0) context.restore();
		},
		_graphic: {
			_rect: function (cur) { // ( x, y, width, height, lineColor, lineWidth, fillColor, alpha)
				const x = cur.xWithAnchor, y = cur.yWithAnchor;
				// rotation
				if (cur.rotate && cur.rotate != 0) {
					context.save();
					context.translate(cur.x, cur.y);
					context.rotate(cur.rotate * Math.PI / 180);
					context.translate(-cur.x, -cur.y);
				}
				// alpha
				context.globalAlpha = cur.alpha;
				// shadow
				context.shadowBlur = (cur.shadow) ? cur.shadowBlur : 0;
				context.shadowColor = cur.shadowColor;
				// fill
				if (cur.fillColor != 0) {
					context.fillStyle = cur.fillColor;
					context.fillRect(x, y, cur.width * cur.scale, cur.height * cur.scale);
				}
				// stroke
				if (cur.lineWidth != 0) {
					context.strokeStyle = cur.lineColor;
					context.lineWidth = cur.lineWidth;
					context.strokeRect(x, y, cur.width * cur.scale, cur.height * cur.scale);
				}
				// end
				context.shadowBlur = 0;
				context.globalAlpha = 1;
				if (cur.rotate && cur.rotate != 0) context.restore();
			},

			_arc: function (cur) {	// ( x, y, diameter, angleStart, angleEnd, anticlockWise, lineColor, lineWidth, fillColor, alpha);
				const x = cur.xWithAnchor, y = cur.yWithAnchor;
				// rotation
				if (cur.rotate && cur.rotate != 0) {
					context.save();
					context.translate(cur.x, cur.y);
					context.rotate(cur.rotate * Math.PI / 180);
					context.translate(-cur.x, -cur.y);
				}
				// alpha
				context.globalAlpha = cur.alpha;
				// shadow
				context.shadowBlur = (cur.shadow) ? cur.shadowBlur : 0;
				context.shadowColor = cur.shadowColor;
				// fill info
				if (cur.fillColor != 0) context.fillStyle = cur.fillColor;
				// stroke info
				if (cur.lineWidth != 0) {
					context.strokeStyle = cur.lineColor;
					context.lineWidth = cur.lineWidth;
				}
				// path
				context.beginPath();
				if (cur.angleEnd != 2 * Math.PI) context.lineTo(x, y);
				context.arc(x, y, (cur.diameter / 2) * cur.scale, cur.angleStart, cur.angleEnd, cur.anticlockwise);
				if (cur.angleEnd != 2 * Math.PI) context.lineTo(x, y);
				// end
				if (cur.fillColor != 0) context.fill();
				if (cur.lineWidth != 0) context.stroke();
				context.shadowBlur = 0;
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
		isOverIcon : function (xMouse, yMouse, icon) {
			const x = xMouse, y = yMouse, cur = icon;
			const valid = 
			y >= cur.yWithAnchor && y <= (cur.yWithAnchor + cur.height * cur.scale) && 
			(x >= cur.xWithAnchor && x <= (cur.xWithAnchor + cur.width * cur.scale));
			return valid;
		}
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