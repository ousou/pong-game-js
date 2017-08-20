var pong = {};

pong.canvas = document.getElementById("pongCanvas");
pong.ctx = pong.canvas.getContext("2d");

pong.constants = {};
pong.constants.drawInterval = 7;
pong.constants.ballRadius = 10;
pong.constants.color = "#FFFFFF";
pong.constants.paddleHeight = 15;
pong.constants.paddleWidth = 75;
pong.constants.paddlePadding = 10;
pong.constants.paddleSpeed = 4;

pong.state = {};
pong.state.x = pong.canvas.width / 2;
pong.state.y = pong.canvas.height - 30;
pong.state.dx = 2;
pong.state.dy = -2;

pong.state.paddle1 = {};
pong.state.paddle1.right = false;
pong.state.paddle1.left = false;
pong.state.paddle1.x = (pong.canvas.width - pong.constants.paddleWidth) / 2;

pong.state.paddle2 = {};
pong.state.paddle2.x = (pong.canvas.width - pong.constants.paddleWidth) / 2;
pong.state.paddle2.right = false;
pong.state.paddle2.left = false;

pong.score = {
    1: 0,
    2: 0
}

function resetState() {
    pong.state.x = pong.canvas.width / 2;
    pong.state.y = pong.canvas.height - 30;
    pong.state.dx = 2;
    pong.state.dy = -2;

    pong.state.paddle1 = {};
    pong.state.paddle1.right = false;
    pong.state.paddle1.left = false;
    pong.state.paddle1.x = (pong.canvas.width - pong.constants.paddleWidth) / 2;

    pong.state.paddle2 = {};
    pong.state.paddle2.x = (pong.canvas.width - pong.constants.paddleWidth) / 2;
    pong.state.paddle2.right = false;
    pong.state.paddle2.left = false;

}

function drawBall(ctx, xCoord, yCoord, radius, color) {
    ctx.beginPath();
    ctx.arc(xCoord, yCoord, radius, 0, Math.PI*2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(ctx, xCoord, yCoord, height, width, color) {
    ctx.beginPath();
    ctx.rect(xCoord, yCoord, width, height);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function checkCollisions() {
    if (pong.state.x + pong.state.dx > pong.canvas.width - pong.constants.ballRadius || pong.state.x + pong.state.dx < pong.constants.ballRadius) {
        pong.state.dx = -pong.state.dx;
    }
    if (pong.state.y + pong.state.dy < pong.constants.ballRadius) {
        if (pong.state.x > pong.state.paddle2.x && pong.state.x < pong.state.paddle2.x + pong.constants.paddleWidth) {
            pong.state.dy = -pong.state.dy;
        } else {
            handleGameOver("1");
        }
    } else if (pong.state.y + pong.state.dy > pong.canvas.height - pong.constants.ballRadius) {
        if (pong.state.x > pong.state.paddle1.x && pong.state.x < pong.state.paddle1.x + pong.constants.paddleWidth) {
            pong.state.dy = -pong.state.dy;
        } else {
            handleGameOver("2");
        }
    }
}

function handleGameOver(winner) {
    pong['score'][winner] = pong['score'][winner] + 1;
    alert("Player " + winner + " wins! \n\n" + "Score: \n" + "Player 1: " + pong['score']['1'] + "\n" + "Player 2: " + pong['score']['2']);
    resetState();
}

function updateBallLocation() {
    pong.state.x += pong.state.dx;
    pong.state.y += pong.state.dy;
}

function updatePaddleLocation(paddle) {
    if (paddle.right && paddle.x < pong.canvas.width - pong.constants.paddleWidth) {
        paddle.x += pong.constants.paddleSpeed;
    } else if (paddle.left && paddle.x > 0) {
        paddle.x -= pong.constants.paddleSpeed;
    }
}

function draw() {
    pong.ctx.clearRect(0, 0, pong.canvas.width, pong.canvas.height);
    drawBall(pong.ctx, pong.state.x, pong.state.y, pong.constants.ballRadius, pong.constants.color);
    drawPaddle(pong.ctx, pong.state.paddle1.x, pong.canvas.height - pong.constants.paddleHeight - pong.constants.paddlePadding, pong.constants.paddleHeight, pong.constants.paddleWidth, pong.constants.color);
    drawPaddle(pong.ctx, pong.state.paddle2.x, pong.constants.paddlePadding, pong.constants.paddleHeight, pong.constants.paddleWidth, pong.constants.color);
    checkCollisions();
    updateBallLocation();
    updatePaddleLocation(pong.state.paddle1);
    updatePaddleLocation(pong.state.paddle2);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.keyCode == 39) {
        pong.state.paddle1.right = true;
    } else if (e.keyCode == 37) {
        pong.state.paddle1.left = true;
    } else if (e.keyCode == 90) {
        pong.state.paddle2.left = true;
    } else if (e.keyCode == 88) {
        pong.state.paddle2.right = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        pong.state.paddle1.right = false;
    } else if (e.keyCode == 37) {
        pong.state.paddle1.left = false;
    } else if (e.keyCode == 90) {
        pong.state.paddle2.left = false;
    } else if (e.keyCode == 88) {
        pong.state.paddle2.right = false;
    }
}

setInterval(draw, pong.constants.drawInterval);
