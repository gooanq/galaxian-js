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
