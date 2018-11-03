
var player;
var ball;

function startGame() {
    myGameArea.start();
    ball = new ballObj(300, 300, 5);
    myGamePiece = new component(50, 10, "black", 400, 500);
    myBricks = new component(50, 20, "blue", 50, 100);
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    this.crashWidth = function (otherObj) {
        var myleft = this.x;
        var myright = this.x + this.width;
        var mytop = this.y;
        var mybottom = this.y + this.height;
        var otherleft = otherObj.x;
        var otherright = otherObj.x + otherObj.width;
        var othertop = otherObj.y;
        var otherbottom = otherObj.y + otherObj.height;
        var crash = true;
        if ((mybottom < othertop) || mytop > otherbottom || myright < otherleft || myleft > otherright) {
            crash = false;
        }
        return crash;
    }
}

function ballObj(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;

    this.fill = function (ctx) {
        ctx.begingPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
    }
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 960;
        this.canvas.height = 540;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = false;
        })
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    }
}

function updateGameArea() {
    if (myGamePiece.crashWidth(myBricks)) {
        myGameArea.stop();
    } else {
        myGameArea.clear();
        myGamePiece.speedX = 0;
        myGamePiece.speedY = 0;
        if (myGameArea.keys && myGameArea.keys[37]) { myGamePiece.speedX = -10; }
        if (myGameArea.keys && myGameArea.keys[38]) { myGamePiece.speedY = -10; }
        if (myGameArea.keys && myGameArea.keys[39]) { myGamePiece.speedX = 10; }
        if (myGameArea.keys && myGameArea.keys[40]) { myGamePiece.speedY = 10; }
        myBricks.update();
        myGamePiece.newPos();
        myGamePiece.update();
    }
}