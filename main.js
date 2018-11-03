
var myGamePiece;
var player;
var ball;

function startGame() {
    myGameArea.start();
    ball = new ballObj(300, 300, 5);
    myGamePiece = new component(30, 30, "red", 10, 120);
    window.addEventListener("keydown", movePlayer, false);
}

function movePlayer(e) {
    switch(e.keyCode){
        case 37:
        //left key pressed
        myGamePiece.speedX -= 1;
        break;
        case 38:
        //up key pressed
        myGamePiece.speedY -= 1;
        break;
        case 39:
        //right key pressed
        myGamePiece.speedX += 1;
        break;
        case 40:
        //down key pressed
        myGamePiece.speedY += 1;
        break;
    }
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
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

function ballObj(x, y, r){
    this.x = x;
    this.y = y;
    this.r = r;
    
    this.fill = function(ctx){
        ctx.begingPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
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
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function updateGameArea() {
    myGameArea.clear();
    myGamePiece.newPos();
    myGamePiece.update();
}