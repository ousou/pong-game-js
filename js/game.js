var pong = {};

pong.canvas = document.getElementById("pongCanvas");
pong.ctx = pong.canvas.getContext("2d");

pong.state = {};

pong.state.x = pong.canvas.width / 2;
pong.state.y = pong.canvas.height - 30;
pong.state.dx = 2;
pong.state.dy = -2;
pong.state.ballRadius = 10;
pong.state.color = "#FFFFFF";
pong.state.paddleHeight = 10;
pong.state.paddleWidth = 75;
pong.state.paddleX = (pong.canvas.width - pong.state.paddleWidth) / 2;
pong.state.rightPressed = false;
pong.state.leftPressed = false;

function drawBall(ctx, xCoord, yCoord, radius, color) {
    ctx.beginPath();
    ctx.arc(xCoord, yCoord, radius, 0, Math.PI*2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(ctx, xCoord, height, width, color) {
    ctx.beginPath();
    ctx.rect(xCoord, pong.canvas.height - height, width, height);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function checkCollisions() {
    if (pong.state.x + pong.state.dx > pong.canvas.width - pong.state.ballRadius || pong.state.x + pong.state.dx < pong.state.ballRadius) {
        pong.state.dx = -pong.state.dx;
    }
    if (pong.state.y + pong.state.dy < pong.state.ballRadius) {
        pong.state.dy = -pong.state.dy;
    } else if (pong.state.y + pong.state.dy > pong.canvas.height - pong.state.ballRadius) {
        if (pong.state.x > pong.state.paddleX && pong.state.x < pong.state.paddleX + pong.state.paddleWidth) {
            pong.state.dy = -pong.state.dy;
        } else {
            alert("GAME OVER");
            document.location.reload();
        }
    }
}

function updateBallLocation() {
    pong.state.x += pong.state.dx;
    pong.state.y += pong.state.dy;
}

function updatePaddleLocation() {
    if (pong.state.rightPressed && pong.state.paddleX < pong.canvas.width - pong.state.paddleWidth) {
        pong.state.paddleX += 4;
    } else if (pong.state.leftPressed && pong.state.paddleX > 0) {
        pong.state.paddleX -= 4;
    }
}

function draw() {
    pong.ctx.clearRect(0, 0, pong.canvas.width, pong.canvas.height);
    drawBall(pong.ctx, pong.state.x, pong.state.y, pong.state.ballRadius, pong.state.color);
    drawPaddle(pong.ctx, pong.state.paddleX, pong.state.paddleHeight, pong.state.paddleWidth, pong.state.color);
    checkCollisions();
    updateBallLocation();
    updatePaddleLocation();
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.keyCode == 39) {
        pong.state.rightPressed = true;
    }
    else if (e.keyCode == 37) {
        pong.state.leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        pong.state.rightPressed = false;
    }
    else if (e.keyCode == 37) {
        pong.state.leftPressed = false;
    }
}

setInterval(draw, 7);
