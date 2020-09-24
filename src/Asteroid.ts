namespace Game {
	const minWidth: number = 50;
	const minHeight: number = 40;
	const maxWidth: number = 150;
	const maxHeight: number = 150;
	export class Asteroid {
		public static SPEED: number;
		public static ALL_ASTEROIDS: Asteroid[] = [];
		static drawALL() {
			const length = Asteroid.ALL_ASTEROIDS.length;
			for (let i = 0; i < length; i++) {
				Asteroid.ALL_ASTEROIDS[i].draw();
			}
		}
		static moveALL() {
			const length = Asteroid.ALL_ASTEROIDS.length;
			for (let i = 0; i < length; i++) {
				Asteroid.ALL_ASTEROIDS[i].move();
			}
		}
		public readonly WIDTH: number;
		public readonly HEIGHT: number;


		public x: number;
		public y: number;
		public xMove: number;
		public img: HTMLImageElement;


		public constructor() {

			this.WIDTH = random(minWidth, maxWidth);
			this.HEIGHT = random(minHeight, maxHeight);
			this.x = random(0, (gameAreaWidth - this.WIDTH));
			this.y = -this.HEIGHT;
			this.xMove = random(-Asteroid.SPEED, Asteroid.SPEED)
			if (random(1, 2) === 1) {
				this.img = brownAsteroidImg;
			} else {
				this.img = greyAsteroidImg;
			}
			Asteroid.ALL_ASTEROIDS.push(this);

		}


		move() {
			this.x += this.xMove;
			this.y += Asteroid.SPEED
		}

		draw() {
			ctx.drawImage(this.img, this.x, this.y, this.WIDTH, this.HEIGHT);
		}

	}


	export function random(min: number, max: number): number {
		// случайное число от min до (max+1)
		let rand = min + Math.random() * (max + 1 - min);
		return Math.floor(rand);
	}
}