/// <reference path="Player.ts"/>
/// <reference path="Asteroid.ts"/>
/// <reference path="menu.ts"/>

namespace Game {

	
	//////Test/////////////
	const pressed = {
		left: false,
		right: false,
		up: false,
		down: false
	}
	////////////////////////////////////////////////////////////////////

	let records = localStorage.getItem('records');
	console.log(JSON.stringify(records));

	const setings = {
		speed: 12,
		asteroidSpeed: 8,
		asteroidMinSpawnTime: 200,
		asteroidMaxSpawnTime: 500,
	}
	Blast.SPEED = setings.speed * 3;
	Asteroid.SPEED = setings.asteroidSpeed;
	let movePlayer = () => { };


	let directionButtonPressed: boolean = false;
	const cvs: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
	export const ctx: CanvasRenderingContext2D = cvs.getContext('2d');
	export const gameAreaHeight: number = parseInt(getComputedStyle(cvs).height);
	export const gameAreaWidth: number = parseInt(getComputedStyle(cvs).width);

	const scoreCtx = (document.getElementById('score-canvas') as HTMLCanvasElement).getContext('2d');
	scoreCtx.font = '25px Impact';
	scoreCtx.fillStyle = 'red';

	let score: number = 0;
	const pictureCount: boolean[] = []
	let imageCount: number = 0;

	const playerImg = loadImage('pictures/player.png');
	export const brownAsteroidImg = loadImage('pictures/asteroid.png');
	export const greyAsteroidImg = loadImage('pictures/asteroid1.png');
	const enemyImg = loadImage('pictures/enemy.png');


	let player: Player;
	ctx.font = "22px Verdana";


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

	let bgPosition: number = 0;
	function runGame() {

		player = new Player(300, 700, playerImg);

		let asteroidTimer = startSpawnAsteroid(setings.asteroidMinSpawnTime, setings.asteroidMaxSpawnTime);


		function gameLoop() {
			cvs.style.backgroundPositionY = (bgPosition += (setings.speed / 2)) + 'px';
			ctx.clearRect(0, 0, gameAreaWidth, gameAreaHeight);
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
					try {
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
					catch {

					}
				}
			}


			///////COLLISION////////////////

			for (let i = 0; i < Asteroid.ALL_ASTEROIDS.length; i++) {
				if (
					collisionCondition(Asteroid.ALL_ASTEROIDS[i])
				) {
					document.body.innerHTML = '<h1>Game over</h1>';
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


			ctx.fillText(`${JSON.stringify(pressed, null, 2)}\nShots: ${Blast.ALL_BLASTS.length}\n
			Asteroids: ${Asteroid.ALL_ASTEROIDS.length}`, 0, 20);

			score += 1;
			const text = `Score: ${score.toString()}`
			scoreCtx.fillText('Score: ' + score, 0, 20);
			requestAnimationFrame(gameLoop);
		}

		gameLoop();

	}

	function startSpawnAsteroid(minTime: number, maxTime: number) {
		return setTimeout(function spawn() {
			new Asteroid();
			setTimeout(spawn, random(minTime, maxTime))
		}, random(minTime, maxTime))
	}

	//////PLAYER///////////
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
				pressed.left = true;
				break;
			case 'KeyW':
			case 'ArrowUp':
				movePlayer = directions.up;
				pressed.up = true;
				break;
			case 'KeyS':
			case 'ArrowDown':
				movePlayer = directions.down;
				pressed.down = true;
				break;
			case 'KeyD':
			case 'ArrowRight':
				movePlayer = directions.right;
				pressed.right = true;
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
					pressed.left = false;
					movePlayer = directions.none;
					break;
				case 'KeyW':
				case 'ArrowUp':
					pressed.up = false;
					movePlayer = directions.none;
					break;
				case 'KeyS':
				case 'ArrowDown':
					pressed.down = false;
					movePlayer = directions.none;
					break;
				case 'KeyD':
				case 'ArrowRight':
					pressed.right = false;
					movePlayer = directions.none;
					break;
			}
			directionButtonPressed = false;
		}
	}


	document.addEventListener('keydown', directionButtonsDown);
	document.addEventListener('keyup', directionButtonsUp);

	/////////////////////////////////////















	///////////////////////////////////////////////////////////////////////////////////////////
	function showMenu(score: number) {
		const menu = document.getElementById('menu');
	}
	function checkLoad() {
		pictureCount.push(true);
		if (pictureCount.length === imageCount) {
			runGame();
		}
	}

	function loadImage(src: string): HTMLImageElement {
		imageCount++;
		const result = new Image();
		result.src = src;
		result.onload = checkLoad;
		return result;
	}

	window.onresize = () => {
		const height = window.innerHeight;
		if (height > gameAreaHeight) {
			const margin = (window.innerHeight - gameAreaHeight) / 2;
			cvs.style.marginTop = margin + 'px';
		} else {
			cvs.style.marginTop = '0';
		}
	}
}