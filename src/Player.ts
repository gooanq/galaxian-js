namespace Game {
	export class Player {

		public readonly WIDTH: number;
		public readonly HEIGHT: number;


		public x: number;
		public y: number;
		private cooldown: number = 200;
		private isColdown: boolean = false
		public img: HTMLImageElement;


		public constructor(x: number, y: number, img: HTMLImageElement) {
			this.x = x;
			this.y = y;
			this.img = img;
			this.WIDTH = img.width;
			this.HEIGHT = img.height;
		}


		moveX(x: number) {
			const newX = this.x + x;
			if (newX <= 0) {
				this.x = 0;
			}
			else if (newX >= gameAreaWidth - this.WIDTH) {
				this.x = gameAreaWidth - this.WIDTH;
			}
			else {
				this.x = newX;
			}

			this.draw();
		}

		moveY(y: number) {
			const newY = this.y + y;
			if (newY <= 0) {
				this.y = 0;
			}
			else if (this.HEIGHT + newY >= gameAreaHeight) {
				this.y = gameAreaHeight - this.HEIGHT;
			}
			else {
				this.y = newY;
			}
			this.draw();
		}

		draw() {
			ctx.drawImage(this.img, this.x, this.y);
		}

		shoot() {
			if (this.isColdown) {
				return;
			}
			else {
				// const blast = new Blast(this.x + (this.WIDTH / 2), this.y);
				new Blast(this.x + 15, this.y+4)
				new Blast(this.x + 50, this.y+4)
				this.isColdown = true;
				setTimeout(() => this.isColdown = false,this.cooldown);
			}
		}
	}


	export class Blast {
		public static ALL_BLASTS: Blast[] = [];
		static drawALL() {
			const length = Blast.ALL_BLASTS.length;
			for (let i = 0; i < length; i++) {
				ctx.fillStyle = "orange";
				Blast.ALL_BLASTS[i].draw();
			}
		}
		static moveALL() {
			const length = Blast.ALL_BLASTS.length;
			for (let i = 0; i < length; i++) {
				Blast.ALL_BLASTS[i].move();
			}
		}
		public static SPEED: number;
		public static WIDTH: number = 3;
		public static HEIGHT: number = 10;

		public x: number;
		public y: number;

		public constructor(x: number, y: number) {
			this.x = x;
			this.y = y;
			Blast.ALL_BLASTS.push(this);
			this.draw();
		}

		draw() {
			ctx.fillRect(this.x, this.y, Blast.WIDTH, Blast.HEIGHT);
		}

		move() {
			this.y = this.y - Blast.SPEED;
			this.draw();
		}


	}
}