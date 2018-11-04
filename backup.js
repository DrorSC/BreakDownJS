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

var myBall;
var myPlayer;

function startGame() {
    myGameArea.start();
    myBall = new ball(200, 200, 5, "red");
    myPlayer = new player(80, 20, "black", 400, 500);
}

function ball(x, y, r, color) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.isDown = true;
    this.isRight = true;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
    }
    this.collusion = function (otherObj) {
        if (otherObj)
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

function player(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.collusion = function (otherObj) {
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
function updateGameArea() {
    myGameArea.clear();
    moveObjects();
    myBall.update();
    myPlayer.update();
}

function moveObjects() {
    // move player
    if (myGameArea.keys && myGameArea.keys[37]) { myPlayer.x -= 10; }
    if (myGameArea.keys && myGameArea.keys[38]) { myPlayer.y -= 10; }
    if (myGameArea.keys && myGameArea.keys[39]) { myPlayer.x += 10; }
    if (myGameArea.keys && myGameArea.keys[40]) { myPlayer.y += 10; }
    // move ball
    if(myBall.isRight){ myBall.x += 1; }
    else { myBall.x -= 1; }
    if(myBall.isDown){ myBall.y += 1; }
    else { myBall.y -= 1; }
}