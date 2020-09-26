"use strict";
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
var Game;
(function (Game) {
    var Setings = /** @class */ (function () {
        function Setings(speed, as, score, aMinTime, aMaxTime) {
            this.speed = speed;
            this.asteroidSpeed = as;
            this.asteroidMinSpawnTime = aMinTime;
            this.asteroidMaxSpawnTime = aMaxTime;
            this.timeScore = score;
        }
        return Setings;
    }());
    Game.Setings = Setings;
})(Game || (Game = {}));
/// <reference path="Player.ts"/>
/// <reference path="Asteroid.ts"/>
/// <reference path="Setings.ts"/>
var Game;
(function (Game_1) {
    var _a;
    var recordAmount = 10;
    // let records: Array<{ name: string, score: number }> = [];
    // while (records.length < recordAmount) {
    // 	records.push({
    // 		name: 'none',
    // 		score: 100,
    // 	})
    // }
    // localStorage.removeItem('records');
    var records = (_a = JSON.parse(localStorage.getItem('records'))) !== null && _a !== void 0 ? _a : new Array();
    console.log(records);
    //localStorage.setItem('records', JSON.stringify(records));
    var Menu = document.getElementById('menu');
    var Game = document.getElementById('game');
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
    function loadImage(src) {
        imageCount++;
        var result = new Image();
        result.src = src;
        result.onload = checkLoad;
        return result;
    }
    var pictureCount = [];
    var imageCount = 0;
    var playerImg = loadImage('pictures/player.png');
    var bgImg = loadImage('pictures/bg.png');
    Game_1.brownAsteroidImg = loadImage('pictures/asteroid.png');
    Game_1.greyAsteroidImg = loadImage('pictures/asteroid1.png');
    var enemyImg = loadImage('pictures/enemy.png');
    ////////////////////////////////////////////////////////////////
    var cvs = document.getElementById('canvas');
    Game_1.ctx = cvs.getContext('2d');
    Game_1.gameAreaHeight = parseInt(getComputedStyle(cvs).height);
    Game_1.gameAreaWidth = parseInt(getComputedStyle(cvs).width);
    var scoreCtx = document.getElementById('score-canvas').getContext('2d');
    scoreCtx.font = '25px Impact';
    scoreCtx.fillStyle = 'red';
    Game_1.ctx.font = "22px Verdana";
    var player;
    var bgPosition = 0;
    function runGame(setings) {
        Game_1.Asteroid.ALL_ASTEROIDS = [];
        var directions = {
            left: function () {
                player.moveX(-setings.speed);
            },
            up: function () {
                player.moveY(-setings.speed);
            },
            down: function () {
                player.moveY(setings.speed);
            },
            right: function () {
                player.moveX(setings.speed);
            },
            none: function () { }
        };
        var directionButtonPressed = false;
        function directionButtonsDown(e) {
            if (e.code === "Space") {
                player.shoot();
                return;
            }
            if (directionButtonPressed) {
                return;
            }
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
        var keys = ['KeyA', 'KeyW', 'KeyS', 'KeyD', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
        function directionButtonsUp(e) {
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
        var startSpawnAsteroid = function (minTime, maxTime) {
            return setTimeout(function spawn() {
                new Game_1.Asteroid();
                setTimeout(spawn, Game_1.random(minTime, maxTime));
            }, Game_1.random(minTime, maxTime));
        };
        var collisionCondition = function (asteroid) {
            return (((asteroid.x >= player.x) &&
                (asteroid.x <= (player.x + player.WIDTH)) &&
                (Math.abs(player.y - asteroid.y) < (asteroid.HEIGHT - 20))) ||
                ((player.x >= asteroid.x) &&
                    (player.x <= (asteroid.x + asteroid.WIDTH)) &&
                    (Math.abs(player.y - asteroid.y) < (asteroid.HEIGHT - 20))));
        };
        var shotConditionAsteroid = function (blast, asteroid) {
            return ((blast.x >= asteroid.x) &&
                (blast.x <= (asteroid.x + asteroid.WIDTH)) &&
                (Math.abs(blast.y - asteroid.y) < asteroid.HEIGHT));
        };
        Game_1.Blast.SPEED = setings.speed * 3;
        Game_1.Asteroid.SPEED = setings.asteroidSpeed;
        var movePlayer = function () { };
        player = new Game_1.Player(300, 700, playerImg);
        var score = 0;
        var scoreInterval = setInterval(function () { return score++; }, setings.timeScore);
        var asteroidTimer = startSpawnAsteroid(setings.asteroidMinSpawnTime, setings.asteroidMaxSpawnTime);
        var drawBackground = (function closure() {
            var bgStart = bgImg.naturalHeight - Game_1.gameAreaHeight;
            var bgPos = bgStart;
            return function () {
                if (bgPos < 0) {
                    Game_1.ctx.drawImage(bgImg, 0, bgImg.naturalHeight + bgPos, bgImg.naturalWidth, Game_1.gameAreaHeight, 0, 0, Game_1.gameAreaWidth, Game_1.gameAreaHeight);
                    if (bgPos < (-1 * Game_1.gameAreaHeight)) {
                        bgPos = bgStart;
                    }
                }
                Game_1.ctx.drawImage(bgImg, 0, bgPos, bgImg.naturalWidth, Game_1.gameAreaHeight, 0, 0, Game_1.gameAreaWidth, Game_1.gameAreaHeight);
                bgPos -= (setings.speed / 2);
            };
        })();
        function gameLoop() {
            Game_1.ctx.clearRect(0, 0, Game_1.gameAreaWidth, Game_1.gameAreaHeight);
            drawBackground();
            scoreCtx.clearRect(0, 0, 250, 100);
            movePlayer();
            Game_1.Blast.moveALL();
            Game_1.Asteroid.moveALL();
            player.draw();
            Game_1.Blast.drawALL();
            Game_1.Asteroid.drawALL();
            /////SHOOT ASTEROID/////////
            for (var i = 0; i < Game_1.Blast.ALL_BLASTS.length; i++) {
                for (var j = 0; j < Game_1.Asteroid.ALL_ASTEROIDS.length; j++) {
                    if (Game_1.Blast.ALL_BLASTS[i] && Game_1.Asteroid.ALL_ASTEROIDS[j]) {
                        if (shotConditionAsteroid(Game_1.Blast.ALL_BLASTS[i], Game_1.Asteroid.ALL_ASTEROIDS[j])) {
                            Game_1.Blast.ALL_BLASTS.splice(i, 1);
                            for (var k = 0; k < Game_1.Blast.ALL_BLASTS.length; k++) {
                                if (shotConditionAsteroid(Game_1.Blast.ALL_BLASTS[k], Game_1.Asteroid.ALL_ASTEROIDS[j])) {
                                    Game_1.Blast.ALL_BLASTS.splice(k, 1);
                                }
                            }
                            Game_1.Asteroid.ALL_ASTEROIDS.splice(j, 1);
                            score += 100;
                        }
                    }
                }
            }
            ///////COLLISION///////////////
            for (var i = 0; i < Game_1.Asteroid.ALL_ASTEROIDS.length; i++) {
                if (collisionCondition(Game_1.Asteroid.ALL_ASTEROIDS[i])) {
                    endGame(score);
                    clearTimeout(asteroidTimer);
                    return;
                }
            }
            //////DELETE SHOTS////////
            for (var i = 0; i < Game_1.Blast.ALL_BLASTS.length; i++) {
                if (Game_1.Blast.ALL_BLASTS[i].y < 0) {
                    Game_1.Blast.ALL_BLASTS.splice(i, 1);
                }
            }
            ////DELETE ASTEROIDS/////////
            for (var i = 0; i < Game_1.Asteroid.ALL_ASTEROIDS.length; i++) {
                if ((Game_1.Asteroid.ALL_ASTEROIDS[i].y > Game_1.gameAreaHeight) ||
                    (Game_1.Asteroid.ALL_ASTEROIDS[i].x < (-1 * Game_1.Asteroid.ALL_ASTEROIDS[i].WIDTH)) ||
                    (Game_1.Asteroid.ALL_ASTEROIDS[i].x > Game_1.gameAreaWidth)) {
                    Game_1.Asteroid.ALL_ASTEROIDS.splice(i, 1);
                }
            }
            // ctx.fillText(`${JSON.stringify(pressed, null, 2)}\nShots: ${Blast.ALL_BLASTS.length}\n
            // Asteroids: ${Asteroid.ALL_ASTEROIDS.length}`, 0, 20);
            scoreCtx.fillText("Score: " + score, 0, 20);
            requestAnimationFrame(gameLoop);
        }
        gameLoop();
    }
    function endGame(score) {
        var _a;
        Game.style.display = 'none';
        Menu.style.display = 'block';
        Menu.querySelector('.score').textContent = "Your score: " + score;
        if (score < ((_a = records[recordAmount - 1]) === null || _a === void 0 ? void 0 : _a.score) && records !== null) {
            return;
        }
        document.getElementById('panel').style.display = 'none';
        document.getElementById('record-name').style.display = 'block';
        var input = document.getElementById('name-input');
        document.getElementById('btn-save').onclick = function () {
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
                for (var i = records.length - 1; i >= 0; i--) {
                    if (records[i].score < score) {
                        records[i] = {
                            name: input.value,
                            score: score,
                        };
                        break;
                    }
                }
            }
            records.sort(function (a, b) { return -(a.score - b.score); });
            records.slice(recordAmount, 1);
            localStorage.setItem('records', JSON.stringify(records));
            document.getElementById('panel').style.display = 'block';
            document.getElementById('record-name').style.display = 'none';
        };
    }
    ////////////MENU//////////////////////////////
    function start(setings) {
        Menu.style.display = "none";
        Game.style.display = "flex";
        runGame(setings);
    }
    document.querySelector('.btn-easy').addEventListener('click', function () { return start(new Game_1.Setings(7, 4, 1000, 800, 1100)); });
    document.querySelector('.btn-medium').addEventListener('click', function () { return start(new Game_1.Setings(9, 7, 500, 500, 800)); });
    document.querySelector('.btn-hard').addEventListener('click', function () { return start(new Game_1.Setings(12, 9, 100, 350, 700)); });
    document.querySelector('.btn-score').addEventListener('click', function () {
        if (records.length === 0) {
            return;
        }
        document.getElementById('panel').style.display = 'none';
        document.getElementById('score-table').style.display = 'block';
        var recordBlock = document.getElementById('records');
        recordBlock.innerHTML = ' ';
        records.forEach(function (item) { return recordBlock.insertAdjacentHTML('beforeend', "<p>" + item.name + " : " + item.score + "</p>"); });
    });
    document.querySelector('#btn-close').addEventListener('click', function () {
        document.getElementById('panel').style.display = 'block';
        document.getElementById('score-table').style.display = 'none';
    });
    document.addEventListener('load', function () {
        Game.style.display = "none";
    });
})(Game || (Game = {}));
//# sourceMappingURL=app.js.map