var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 960;
        this.canvas.height = 540;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        this.frameNo = 0;
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
var obstacleSpeed = 3;
var obstaclesRate = 100;
var myBall;
var myPlayer;
var myObstacles = [];
var myScore;

function startGame() {
    myGameArea.start();
    myBall = new ball(200, 200, 5, "red");
    myPlayer = new player(60, 30, "black", 400, 500);
    myScore = new player("30px", "Consolas", "black", 750, 30, "text");
}
function everyInterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {
        obstaclesRate -= 1;
        return true;
    }
    return false;
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

        var boom = false;
        if (myright == otherleft && othertop < this.y && this.y < otherbottom) {
            ballHitObj("left");
            boom = true;
        }
        if (myleft == otherright && othertop < this.y && this.y < otherbottom) {
            ballHitObj("right");
            boom = true;
        }
        if (mybottom == othertop && otherleft < this.x && this.x < otherright) {
            ballHitObj("down");
            boom = true;
        }
        if (mytop == otherbottom && otherleft < this.x && this.x < otherright) {
            ballHitObj("up");
            boom = true;
        }
        return boom;
    }
}

function player(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.crash = function (otherObj) {
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

function obstacle(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.isHorizontal = Math.random() >= 0.5;
    this.isRight = Math.random() >= 0.5;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

function updateGameArea() {
    // check collusions
    checkCollusions();
    // clear game area
    myGameArea.clear();

    // move frame and create anoter obstacle
    createObstacles();
    myGameArea.frameNo += 1;


    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();

    // move all objects
    moveObjects();
    // draw objects in new locations
    myBall.update();
    myPlayer.update();
}

function createObstacles() {
    if (everyInterval(obstaclesRate)) {
        if (Math.random() >= 0.5) {
            x = Math.floor(Math.random() * (myGameArea.canvas.width - 50) + 50);
            y = 0;
        } else {
            y = Math.floor(Math.random() * (myGameArea.canvas.height - 20) + 20);
            x = 0;
        }
        myObstacles.push(new obstacle(50, 20, "green", x, y));
    }
}

function moveObjects() {
    // move player
    if (myGameArea.keys && myGameArea.keys[37]) {
        if (myPlayer.x != 0) myPlayer.x -= playerSpeed;
    }
    if (myGameArea.keys && myGameArea.keys[38]) {
        if (myPlayer.y != 0) myPlayer.y -= playerSpeed;
    }
    if (myGameArea.keys && myGameArea.keys[39]) {
        if ((myPlayer.x + myPlayer.width) != myGameArea.canvas.width) myPlayer.x += playerSpeed;
    }
    if (myGameArea.keys && myGameArea.keys[40]) {
        if ((myPlayer.y + myPlayer.height) != myGameArea.canvas.height) myPlayer.y += playerSpeed;
    }
    // move ball
    if (myBall.isRight) { myBall.x += ballSpeed; }
    else { myBall.x -= ballSpeed; }
    if (myBall.isDown) { myBall.y += ballSpeed; }
    else { myBall.y -= ballSpeed; }

    // move obstacles
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myObstacles[i].isHorizontal) {
            if (myObstacles[i].isRight) {
                myObstacles[i].x += obstacleSpeed;
                // hit right wall
                if (myObstacles[i].x >= myGameArea.canvas.width)
                    myObstacles[i].x = -50;
            }
            else {
                myObstacles[i].x -= obstacleSpeed;
                // hit left wall
                if (myObstacles[i].x <= -50)
                    myObstacles[i].x = myGameArea.canvas.width;
            }
        } else {
            if (myObstacles[i].isDown) {
                myObstacles[i].y += obstacleSpeed;
                // hit botoom wall
                if (myObstacles[i].y <= myGameArea.canvas.height)
                    myObstacles[i].y = -20;
            }
            else {
                myObstacles[i].y -= obstacleSpeed;
                // hit top wall
                if (myObstacles[i].y <= -20)
                    myObstacles[i].y = myGameArea.canvas.height;
            }
        }
        myObstacles[i].update();
    }
}

function checkCollusions() {

    for (i = 0; i < myObstacles.length; i++) {
        // obstacles hits player - game over
        if (myPlayer.crash(myObstacles[i])) {
            myGameArea.stop();
            return;
        }
        // obstacles hits ball - remove obstacle - change ball direction
        if (myBall.collusion(myObstacles[i])) {
            myObstacles.splice(i, 1);
        }
    }
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