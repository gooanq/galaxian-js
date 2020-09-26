/// <reference path="Player.ts"/>
/// <reference path="Asteroid.ts"/>
/// <reference path="Setings.ts"/>

namespace Game {
	const recordAmount = 10;
	// let records: Array<{ name: string, score: number }> = [];
	// while (records.length < recordAmount) {
	// 	records.push({
	// 		name: 'none',
	// 		score: 100,
	// 	})
	// }
	// localStorage.removeItem('records');
	let records: Array<{ name: string, score: number }> = JSON.parse(localStorage.getItem('records')) ?? new Array<{ name: string, score: number }>();

	console.log(records);
	//localStorage.setItem('records', JSON.stringify(records));

	const Menu = document.getElementById('menu');
	const Game = document.getElementById('game');
	//////Test/////////////
	// const pressed = {
	// 	left: false,
	// 	right: false,
	// 	up: false,
	// 	down: false
	// }
	////////////////////////////////////////////////////////////////////



	////////////IMAGES//////////////////////////////////////////////
	function checkLoad() {
		pictureCount.push(true);
		if (pictureCount.length === imageCount) {
			Menu.style.display = "block";
		}
	}

	function loadImage(src: string): HTMLImageElement {
		imageCount++;
		const result = new Image();
		result.src = src;
		result.onload = checkLoad;
		return result;
	}
	const pictureCount: boolean[] = []
	let imageCount: number = 0;
	const playerImg = loadImage('pictures/player.png');
	const bgImg = loadImage('pictures/bg.png');
	export const brownAsteroidImg = loadImage('pictures/asteroid.png');
	export const greyAsteroidImg = loadImage('pictures/asteroid1.png');
	const enemyImg = loadImage('pictures/enemy.png');
	////////////////////////////////////////////////////////////////









	const cvs: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
	export const ctx: CanvasRenderingContext2D = cvs.getContext('2d');
	export const gameAreaHeight: number = parseInt(getComputedStyle(cvs).height);
	export const gameAreaWidth: number = parseInt(getComputedStyle(cvs).width);

	const scoreCtx = (document.getElementById('score-canvas') as HTMLCanvasElement).getContext('2d');
	scoreCtx.font = '25px Impact';
	scoreCtx.fillStyle = 'red';
	ctx.font = "22px Verdana";


	let player: Player;
	let bgPosition: number = 0;

	function runGame(setings: Setings) {

		Asteroid.ALL_ASTEROIDS = [];
		const directions = {
			left() {
				player.moveX(-setings.speed);
			},

			up() {
				player.moveY(-setings.speed);
			},

			down() {
				player.moveY(setings.speed);
			},

			right() {
				player.moveX(setings.speed);
			},

			none() { }
		}

		let directionButtonPressed: boolean = false;
		function directionButtonsDown(e: KeyboardEvent) {


			if (e.code === "Space") {
				player.shoot();
				return;
			}

			if (directionButtonPressed) { return }

			switch (e.code) {
				case 'KeyA':
				case 'ArrowLeft':
					movePlayer = directions.left;
					//pressed.left = true;
					break;
				case 'KeyW':
				case 'ArrowUp':
					movePlayer = directions.up;
					//pressed.up = true;
					break;
				case 'KeyS':
				case 'ArrowDown':
					movePlayer = directions.down;
					//pressed.down = true;
					break;
				case 'KeyD':
				case 'ArrowRight':
					movePlayer = directions.right;
					//pressed.right = true;
					break;
			}
			directionButtonPressed = true;
		}

		const keys = ['KeyA', 'KeyW', 'KeyS', 'KeyD', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']

		function directionButtonsUp(e: KeyboardEvent) {
			if (keys.indexOf(e.code) === -1) {
				e.preventDefault();
				return;
			}
			if (directionButtonPressed) {

				switch (e.code) {
					case 'KeyA':
					case 'ArrowLeft':
					//pressed.left = false;
					// = directions.none;
					//break;
					case 'KeyW':
					case 'ArrowUp':
					//pressed.up = false;
					//movePlayer = directions.none;
					//break;
					case 'KeyS':
					case 'ArrowDown':
					//pressed.down = false;
					//movePlayer = directions.none;
					//break;
					case 'KeyD':
					case 'ArrowRight':
						//pressed.right = false;
						movePlayer = directions.none;
						break;
				}
				directionButtonPressed = false;
			}
		}
		document.addEventListener('keydown', directionButtonsDown);
		document.addEventListener('keyup', directionButtonsUp);


		const startSpawnAsteroid = (minTime: number, maxTime: number) => {
			return setTimeout(function spawn() {
				new Asteroid();
				setTimeout(spawn, random(minTime, maxTime))
			}, random(minTime, maxTime))
		}

		const collisionCondition = (asteroid: Asteroid): boolean => {
			return (
				((asteroid.x >= player.x) &&
					(asteroid.x <= (player.x + player.WIDTH)) &&
					(Math.abs(player.y - asteroid.y) < (asteroid.HEIGHT - 20))
				) ||
				(
					(player.x >= asteroid.x) &&
					(player.x <= (asteroid.x + asteroid.WIDTH)) &&
					(Math.abs(player.y - asteroid.y) < (asteroid.HEIGHT - 20))
				)
			)
		}

		const shotConditionAsteroid = (blast: Blast, asteroid: Asteroid): boolean => {
			return (
				(blast.x >= asteroid.x) &&
				(blast.x <= (asteroid.x + asteroid.WIDTH)) &&
				(Math.abs(blast.y - asteroid.y) < asteroid.HEIGHT)
			)
		}



		Blast.SPEED = setings.speed * 3;
		Asteroid.SPEED = setings.asteroidSpeed;
		let movePlayer = () => { };
		player = new Player(300, 700, playerImg);
		let score: number = 0;
		const scoreInterval = setInterval(() => score++, setings.timeScore);
		let asteroidTimer = startSpawnAsteroid(setings.asteroidMinSpawnTime, setings.asteroidMaxSpawnTime);

		const drawBackground = (function closure() {
			const bgStart: number = bgImg.naturalHeight - gameAreaHeight
			let bgPos: number = bgStart;

			return () => {
				if (bgPos < 0) {
					ctx.drawImage(bgImg, 0, bgImg.naturalHeight + bgPos, bgImg.naturalWidth, gameAreaHeight, 0, 0, gameAreaWidth, gameAreaHeight);
					if (bgPos < (-1 * gameAreaHeight)) {
						bgPos = bgStart;
					}
				}
				ctx.drawImage(bgImg, 0, bgPos, bgImg.naturalWidth, gameAreaHeight, 0, 0, gameAreaWidth, gameAreaHeight);
				bgPos -= (setings.speed / 2);
			}
		})();

		function gameLoop() {
			ctx.clearRect(0, 0, gameAreaWidth, gameAreaHeight);

			drawBackground();

			scoreCtx.clearRect(0, 0, 250, 100);

			movePlayer();
			Blast.moveALL();
			Asteroid.moveALL();

			player.draw();
			Blast.drawALL();
			Asteroid.drawALL();



			/////SHOOT ASTEROID/////////
			for (let i = 0; i < Blast.ALL_BLASTS.length; i++) {
				for (let j = 0; j < Asteroid.ALL_ASTEROIDS.length; j++) {
					if (Blast.ALL_BLASTS[i] && Asteroid.ALL_ASTEROIDS[j]) {

						if (shotConditionAsteroid(Blast.ALL_BLASTS[i], Asteroid.ALL_ASTEROIDS[j])) {

							Blast.ALL_BLASTS.splice(i, 1);

							for (let k = 0; k < Blast.ALL_BLASTS.length; k++) {
								if (shotConditionAsteroid(Blast.ALL_BLASTS[k], Asteroid.ALL_ASTEROIDS[j])) {
									Blast.ALL_BLASTS.splice(k, 1);
								}
							}

							Asteroid.ALL_ASTEROIDS.splice(j, 1);
							score += 100;

						}

					}
				}
			}


			///////COLLISION///////////////
			for (let i = 0; i < Asteroid.ALL_ASTEROIDS.length; i++) {
				if (
					collisionCondition(Asteroid.ALL_ASTEROIDS[i])
				) {
					endGame(score);
					clearTimeout(asteroidTimer);
					return;
				}
			}


			//////DELETE SHOTS////////
			for (let i = 0; i < Blast.ALL_BLASTS.length; i++) {
				if (Blast.ALL_BLASTS[i].y < 0) {
					Blast.ALL_BLASTS.splice(i, 1);
				}
			}

			////DELETE ASTEROIDS/////////
			for (let i = 0; i < Asteroid.ALL_ASTEROIDS.length; i++) {
				if (
					(Asteroid.ALL_ASTEROIDS[i].y > gameAreaHeight) ||
					(Asteroid.ALL_ASTEROIDS[i].x < (-1 * Asteroid.ALL_ASTEROIDS[i].WIDTH)) ||
					(Asteroid.ALL_ASTEROIDS[i].x > gameAreaWidth)
				) {
					Asteroid.ALL_ASTEROIDS.splice(i, 1);
				}
			}


			// ctx.fillText(`${JSON.stringify(pressed, null, 2)}\nShots: ${Blast.ALL_BLASTS.length}\n
			// Asteroids: ${Asteroid.ALL_ASTEROIDS.length}`, 0, 20);

			scoreCtx.fillText(`Score: ${score}`, 0, 20);
			requestAnimationFrame(gameLoop);
		}

		gameLoop();
	}




	function endGame(score: number) {
		Game.style.display = 'none';
		Menu.style.display = 'block';
		Menu.querySelector('.score').textContent = `Your score: ${score}`;

		if(score < records[recordAmount-1]?.score && records !== null){
			return;
		}

		document.getElementById('panel').style.display = 'none';
		document.getElementById('record-name').style.display = 'block'
		const input = document.getElementById('name-input') as HTMLInputElement;
		document.getElementById('btn-save').onclick = () => {
			if (input.value.length === 0) {
				return;
			}
			else if (records.length < recordAmount) {
				records.push({
					name: input.value,
					score: score,
				});
			}
			else {
				for (let i = records.length - 1; i >= 0; i--) {
					if (records[i].score < score) {
						records[i] = {
							name: input.value,
							score: score,
						}
						break;
					}
				}
			}

			records.sort((a, b) => -(a.score - b.score));
			records.slice(recordAmount, 1);
			localStorage.setItem('records', JSON.stringify(records));
			document.getElementById('panel').style.display = 'block';
			document.getElementById('record-name').style.display = 'none'
		}
	}



	////////////MENU//////////////////////////////

	function start(setings: Setings) {
		Menu.style.display = "none";
		Game.style.display = "flex";
		runGame(setings)
	}

	document.querySelector('.btn-easy').addEventListener('click', () => start(new Setings(7, 4, 1000, 800, 1100)));
	document.querySelector('.btn-medium').addEventListener('click', () => start(new Setings(9, 7, 500, 500, 800)));
	document.querySelector('.btn-hard').addEventListener('click', () => start(new Setings(12, 9, 100, 350, 700)));

	document.querySelector('.btn-score').addEventListener('click', () => {
		if (records.length === 0) {
			return;
		}
		document.getElementById('panel').style.display = 'none';
		document.getElementById('score-table').style.display = 'block';
		const recordBlock = document.getElementById('records');
		recordBlock.innerHTML = ' ';
		records.forEach(item => recordBlock.insertAdjacentHTML('beforeend', `<p>${item.name} : ${item.score}</p>`));
	});



	document.querySelector('#btn-close').addEventListener('click', () => {
		document.getElementById('panel').style.display = 'block';
		document.getElementById('score-table').style.display = 'none';
	});

	document.addEventListener('load', () => {
		Game.style.display = "none";
	}
	)

}