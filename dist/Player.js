"use strict";
var Game;
(function (Game) {
    class Player {
        constructor() {
            this.a = 0;
        }
        show() {
            alert(this.a);
        }
    }
    Game.Player = Player;
})(Game || (Game = {}));
//# sourceMappingURL=Player.js.map