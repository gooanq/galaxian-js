var Game;
(function (Game) {
    var minWidth = 50;
    var minHeight = 40;
    var maxWidth = 150;
    var maxHeight = 150;
    var Asteroid = /** @class */ (function () {
        function Asteroid() {
            this.WIDTH = random(minWidth, maxWidth);
            this.HEIGHT = random(minHeight, maxHeight);
            this.x = random(0, (Game.gameAreaWidth - this.WIDTH));
            this.y = -this.HEIGHT;
            this.xMove = random(-Asteroid.SPEED, Asteroid.SPEED);
            if (random(1, 2) === 1) {
                this.img = Game.brownAsteroidImg;
            }
            else {
                this.img = Game.greyAsteroidImg;
            }
            Asteroid.ALL_ASTEROIDS.push(this);
        }
        Asteroid.drawALL = function () {
            var length = Asteroid.ALL_ASTEROIDS.length;
            for (var i = 0; i < length; i++) {
                Asteroid.ALL_ASTEROIDS[i].draw();
            }
        };
        Asteroid.moveALL = function () {
            var length = Asteroid.ALL_ASTEROIDS.length;
            for (var i = 0; i < length; i++) {
                Asteroid.ALL_ASTEROIDS[i].move();
            }
        };
        Asteroid.prototype.move = function () {
            this.x += this.xMove;
            this.y += Asteroid.SPEED;
        };
        Asteroid.prototype.draw = function () {
            Game.ctx.drawImage(this.img, this.x, this.y, this.WIDTH, this.HEIGHT);
        };
        Asteroid.ALL_ASTEROIDS = [];
        return Asteroid;
    }());
    Game.Asteroid = Asteroid;
    function random(min, max) {
        // случайное число от min до (max+1)
        var rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }
    Game.random = random;
})(Game || (Game = {}));
