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


var playerSpeed = 10;
var ballSpeed = 5;
var myBall;
var myPlayer;

function startGame() {
    myGameArea.start();
    myBall = new ball(200, 200, 5, "red");
    myPlayer = new player(100, 80, "black", 400, 500);
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
        var myleft = this.x - r;
        var myright = this.x + r;
        var mytop = this.y - r;
        var mybottom = this.y + r;
        var otherleft = otherObj.x;
        var otherright = otherObj.x + otherObj.width;
        var othertop = otherObj.y;
        var otherbottom = otherObj.y + otherObj.height;

        if (myright == otherleft && othertop < this.y && this.y < otherbottom) { ballHitObj("left"); }
        if (myleft == otherright && othertop < this.y && this.y < otherbottom) { ballHitObj("right"); }
        
        if (mybottom == othertop && otherleft < this.x && this.x < otherright) { ballHitObj("down"); }
        if (mytop == otherbottom && otherleft < this.x && this.x < otherright) { ballHitObj("up"); }
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
    // check collusions
    checkCollusions();
    // clear game area
    myGameArea.clear();
    // move all objects
    moveObjects();
    // draw objects in new locations
    myBall.update();
    myPlayer.update();
}

function moveObjects() {
    // move player
    if (myGameArea.keys && myGameArea.keys[37]) { myPlayer.x -= playerSpeed; }
    if (myGameArea.keys && myGameArea.keys[38]) { myPlayer.y -= playerSpeed; }
    if (myGameArea.keys && myGameArea.keys[39]) { myPlayer.x += playerSpeed; }
    if (myGameArea.keys && myGameArea.keys[40]) { myPlayer.y += playerSpeed; }
    // move ball
    if (myBall.isRight) { myBall.x += ballSpeed; }
    else { myBall.x -= ballSpeed; }
    if (myBall.isDown) { myBall.y += ballSpeed; }
    else { myBall.y -= ballSpeed; }
}

function checkCollusions() {
    // check player hits
    // player hit 4 walls


    // ball hits
    // ball hit player
    myBall.collusion(myPlayer);
    // ball hit 4 walls
    if (myBall.x <= 0) { ballHitObj("right"); }
    if (myBall.x >= myGameArea.canvas.width) { ballHitObj("left"); }
    if (myBall.y <= 0) { ballHitObj("up"); }
    if (myBall.y >= myGameArea.canvas.height) { ballHitObj("down"); }
    // ball hit brick
}

function ballHitObj(side) {
    switch (side) {
        case "left":
            myBall.isRight = false;
            break;
        case "right":
            myBall.isRight = true;
            break;
        case "up":
            myBall.isDown = true;
            break;
        case "down":
            myBall.isDown = false;
            break;
    }
}