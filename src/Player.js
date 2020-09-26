var Game;
(function (Game) {
    var Player = /** @class */ (function () {
        function Player(x, y, img) {
            this.cooldown = 200;
            this.isColdown = false;
            this.x = x;
            this.y = y;
            this.img = img;
            this.WIDTH = img.width;
            this.HEIGHT = img.height;
        }
        Player.prototype.moveX = function (x) {
            var newX = this.x + x;
            if (newX <= 0) {
                this.x = 0;
            }
            else if (newX >= Game.gameAreaWidth - this.WIDTH) {
                this.x = Game.gameAreaWidth - this.WIDTH;
            }
            else {
                this.x = newX;
            }
            this.draw();
        };
        Player.prototype.moveY = function (y) {
            var newY = this.y + y;
            if (newY <= 0) {
                this.y = 0;
            }
            else if (this.HEIGHT + newY >= Game.gameAreaHeight) {
                this.y = Game.gameAreaHeight - this.HEIGHT;
            }
            else {
                this.y = newY;
            }
            this.draw();
        };
        Player.prototype.draw = function () {
            Game.ctx.drawImage(this.img, this.x, this.y);
        };
        Player.prototype.shoot = function () {
            var _this = this;
            if (this.isColdown) {
                return;
            }
            else {
                // const blast = new Blast(this.x + (this.WIDTH / 2), this.y);
                new Blast(this.x + 15, this.y + 4);
                new Blast(this.x + 50, this.y + 4);
                this.isColdown = true;
                setTimeout(function () { return _this.isColdown = false; }, this.cooldown);
            }
        };
        return Player;
    }());
    Game.Player = Player;
    var Blast = /** @class */ (function () {
        function Blast(x, y) {
            this.x = x;
            this.y = y;
            Blast.ALL_BLASTS.push(this);
            this.draw();
        }
        Blast.drawALL = function () {
            var length = Blast.ALL_BLASTS.length;
            for (var i = 0; i < length; i++) {
                Game.ctx.fillStyle = "orange";
                Blast.ALL_BLASTS[i].draw();
            }
        };
        Blast.moveALL = function () {
            var length = Blast.ALL_BLASTS.length;
            for (var i = 0; i < length; i++) {
                Blast.ALL_BLASTS[i].move();
            }
        };
        Blast.prototype.draw = function () {
            Game.ctx.fillRect(this.x, this.y, Blast.WIDTH, Blast.HEIGHT);
        };
        Blast.prototype.move = function () {
            this.y = this.y - Blast.SPEED;
            this.draw();
        };
        Blast.ALL_BLASTS = [];
        Blast.WIDTH = 3;
        Blast.HEIGHT = 10;
        return Blast;
    }());
    Game.Blast = Blast;
})(Game || (Game = {}));
