"use strict";
var Game;
(function (Game) {
    const minWidth = 50;
    const minHeight = 40;
    const maxWidth = 150;
    const maxHeight = 150;
    class Asteroid {
        constructor() {
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
        move() {
            this.x += this.xMove;
            this.y += Asteroid.SPEED;
        }
        draw() {
            Game.ctx.drawImage(this.img, this.x, this.y, this.WIDTH, this.HEIGHT);
        }
    }
    Asteroid.ALL_ASTEROIDS = [];
    Game.Asteroid = Asteroid;
    function random(min, max) {
        // случайное число от min до (max+1)
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }
    Game.random = random;
})(Game || (Game = {}));
var Game;
(function (Game) {
    class Player {
        constructor(x, y, img) {
            this.cooldown = 200;
            this.isColdown = false;
            this.x = x;
            this.y = y;
            this.img = img;
            this.WIDTH = img.width;
            this.HEIGHT = img.height;
        }
        moveX(x) {
            const newX = this.x + x;
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
        }
        moveY(y) {
            const newY = this.y + y;
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
        }
        draw() {
            Game.ctx.drawImage(this.img, this.x, this.y);
        }
        shoot() {
            if (this.isColdown) {
                return;
            }
            else {
                // const blast = new Blast(this.x + (this.WIDTH / 2), this.y);
                new Blast(this.x + 15, this.y + 4);
                new Blast(this.x + 50, this.y + 4);
                this.isColdown = true;
                setTimeout(() => this.isColdown = false, this.cooldown);
            }
        }
    }
    Game.Player = Player;
    class Blast {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            Blast.ALL_BLASTS.push(this);
            this.draw();
        }
        static drawALL() {
            const length = Blast.ALL_BLASTS.length;
            for (let i = 0; i < length; i++) {
                Game.ctx.fillStyle = "orange";
                Blast.ALL_BLASTS[i].draw();
            }
        }
        static moveALL() {
            const length = Blast.ALL_BLASTS.length;
            for (let i = 0; i < length; i++) {
                Blast.ALL_BLASTS[i].move();
            }
        }
        draw() {
            Game.ctx.fillRect(this.x, this.y, Blast.WIDTH, Blast.HEIGHT);
        }
        move() {
            this.y = this.y - Blast.SPEED;
            this.draw();
        }
    }
    Blast.ALL_BLASTS = [];
    Blast.WIDTH = 3;
    Blast.HEIGHT = 10;
    Game.Blast = Blast;
})(Game || (Game = {}));
/// <reference path="Player.ts"/>
/// <reference path="Asteroid.ts"/>
/// <reference path="menu.ts"/>
var Game;
(function (Game) {
    //////Test/////////////
    const pressed = {
        left: false,
        right: false,
        up: false,
        down: false
    };
    ////////////////////////////////////////////////////////////////////
    let records = localStorage.getItem('records');
    console.log(JSON.stringify(records));
    const setings = {
        speed: 12,
        asteroidSpeed: 8,
        asteroidMinSpawnTime: 200,
        asteroidMaxSpawnTime: 500,
    };
    Game.Blast.SPEED = setings.speed * 3;
    Game.Asteroid.SPEED = setings.asteroidSpeed;
    let movePlayer = () => { };
    let directionButtonPressed = false;
    const cvs = document.getElementById('canvas');
    Game.ctx = cvs.getContext('2d');
    Game.gameAreaHeight = parseInt(getComputedStyle(cvs).height);
    Game.gameAreaWidth = parseInt(getComputedStyle(cvs).width);
    const scoreCtx = document.getElementById('score-canvas').getContext('2d');
    scoreCtx.font = '25px Impact';
    scoreCtx.fillStyle = 'red';
    let score = 0;
    const pictureCount = [];
    let imageCount = 0;
    const playerImg = loadImage('pictures/player.png');
    Game.brownAsteroidImg = loadImage('pictures/asteroid.png');
    Game.greyAsteroidImg = loadImage('pictures/asteroid1.png');
    const enemyImg = loadImage('pictures/enemy.png');
    let player;
    Game.ctx.font = "22px Verdana";
    const collisionCondition = (asteroid) => {
        return (((asteroid.x >= player.x) &&
            (asteroid.x <= (player.x + player.WIDTH)) &&
            (Math.abs(player.y - asteroid.y) < (asteroid.HEIGHT - 20))) ||
            ((player.x >= asteroid.x) &&
                (player.x <= (asteroid.x + asteroid.WIDTH)) &&
                (Math.abs(player.y - asteroid.y) < (asteroid.HEIGHT - 20))));
    };
    const shotConditionAsteroid = (blast, asteroid) => {
        return ((blast.x >= asteroid.x) &&
            (blast.x <= (asteroid.x + asteroid.WIDTH)) &&
            (Math.abs(blast.y - asteroid.y) < asteroid.HEIGHT));
    };
    let bgPosition = 0;
    function runGame() {
        player = new Game.Player(300, 700, playerImg);
        let asteroidTimer = startSpawnAsteroid(setings.asteroidMinSpawnTime, setings.asteroidMaxSpawnTime);
        function gameLoop() {
            cvs.style.backgroundPositionY = (bgPosition += (setings.speed / 2)) + 'px';
            Game.ctx.clearRect(0, 0, Game.gameAreaWidth, Game.gameAreaHeight);
            scoreCtx.clearRect(0, 0, 250, 100);
            movePlayer();
            Game.Blast.moveALL();
            Game.Asteroid.moveALL();
            player.draw();
            Game.Blast.drawALL();
            Game.Asteroid.drawALL();
            /////SHOOT ASTEROID/////////
            for (let i = 0; i < Game.Blast.ALL_BLASTS.length; i++) {
                for (let j = 0; j < Game.Asteroid.ALL_ASTEROIDS.length; j++) {
                    try {
                        if (shotConditionAsteroid(Game.Blast.ALL_BLASTS[i], Game.Asteroid.ALL_ASTEROIDS[j])) {
                            Game.Blast.ALL_BLASTS.splice(i, 1);
                            for (let k = 0; k < Game.Blast.ALL_BLASTS.length; k++) {
                                if (shotConditionAsteroid(Game.Blast.ALL_BLASTS[k], Game.Asteroid.ALL_ASTEROIDS[j])) {
                                    Game.Blast.ALL_BLASTS.splice(k, 1);
                                }
                            }
                            Game.Asteroid.ALL_ASTEROIDS.splice(j, 1);
                            score += 100;
                        }
                    }
                    catch (_a) {
                    }
                }
            }
            ///////COLLISION////////////////
            for (let i = 0; i < Game.Asteroid.ALL_ASTEROIDS.length; i++) {
                if (collisionCondition(Game.Asteroid.ALL_ASTEROIDS[i])) {
                    document.body.innerHTML = '<h1>Game over</h1>';
                }
            }
            //////DELETE SHOTS////////
            for (let i = 0; i < Game.Blast.ALL_BLASTS.length; i++) {
                if (Game.Blast.ALL_BLASTS[i].y < 0) {
                    Game.Blast.ALL_BLASTS.splice(i, 1);
                }
            }
            ////DELETE ASTEROIDS/////////
            for (let i = 0; i < Game.Asteroid.ALL_ASTEROIDS.length; i++) {
                if ((Game.Asteroid.ALL_ASTEROIDS[i].y > Game.gameAreaHeight) ||
                    (Game.Asteroid.ALL_ASTEROIDS[i].x < (-1 * Game.Asteroid.ALL_ASTEROIDS[i].WIDTH)) ||
                    (Game.Asteroid.ALL_ASTEROIDS[i].x > Game.gameAreaWidth)) {
                    Game.Asteroid.ALL_ASTEROIDS.splice(i, 1);
                }
            }
            Game.ctx.fillText(`${JSON.stringify(pressed, null, 2)}\nShots: ${Game.Blast.ALL_BLASTS.length}\n
			Asteroids: ${Game.Asteroid.ALL_ASTEROIDS.length}`, 0, 20);
            score += 1;
            const text = `Score: ${score.toString()}`;
            scoreCtx.fillText('Score: ' + score, 0, 20);
            requestAnimationFrame(gameLoop);
        }
        gameLoop();
    }
    function startSpawnAsteroid(minTime, maxTime) {
        return setTimeout(function spawn() {
            new Game.Asteroid();
            setTimeout(spawn, Game.random(minTime, maxTime));
        }, Game.random(minTime, maxTime));
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
    };
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
    const keys = ['KeyA', 'KeyW', 'KeyS', 'KeyD', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    function directionButtonsUp(e) {
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
    function showMenu(score) {
        const menu = document.getElementById('menu');
    }
    function checkLoad() {
        pictureCount.push(true);
        if (pictureCount.length === imageCount) {
            runGame();
        }
    }
    function loadImage(src) {
        imageCount++;
        const result = new Image();
        result.src = src;
        result.onload = checkLoad;
        return result;
    }
    window.onresize = () => {
        const height = window.innerHeight;
        if (height > Game.gameAreaHeight) {
            const margin = (window.innerHeight - Game.gameAreaHeight) / 2;
            cvs.style.marginTop = margin + 'px';
        }
        else {
            cvs.style.marginTop = '0';
        }
    };
})(Game || (Game = {}));
//# sourceMappingURL=app.js.map