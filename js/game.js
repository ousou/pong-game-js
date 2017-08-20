var pong = {};

pong.canvas = document.getElementById("pongCanvas");
pong.ctx = pong.canvas.getContext("2d");


pong.state = {};
pong.state.lastWinner = "1";
pong.constants = {};
pong.constants.drawInterval = 7;
pong.constants.ballRadius = 14;
pong.constants.initTotalSpeed = 3;
pong.constants.initDx = 2;
pong.constants.initDy = -2;
pong.constants.color = "#FFFFFF";
pong.constants.paddleHeight = 15;
pong.constants.paddleWidth = 75;
pong.constants.paddlePadding = 10;
pong.constants.paddleSpeed = 4;
pong.constants.paddle1 = {};
pong.constants.paddle1.leftKey = 37;
pong.constants.paddle1.rightKey = 39;
pong.constants.paddle2 = {};
pong.constants.paddle2.leftKey = 90;
pong.constants.paddle2.rightKey = 88;

pong.score = {
    1: 0,
    2: 0
}

function startGame() {
    var coords = getInitialCoords();
    var speed = getInitialSpeed();
    resetState(coords, speed);
    document.getElementById("start").disabled = true;
    pong.state.intervalId = setInterval(draw, pong.constants.drawInterval);
}

function getInitialCoords() {
    return {
        x: pong.canvas.width / 2,
        y: pong.canvas.height / 2
    }
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function getInitialSpeed() {
    var initDx = getRandom(-pong.constants.initTotalSpeed + 1, pong.constants.initTotalSpeed - 1);
    var initDy = Math.sqrt(pong.constants.initTotalSpeed * pong.constants.initTotalSpeed - initDx * initDx);
    if (pong.state.lastWinner === "2") {
        initDy = -initDy;
    }
    return {
        dx: initDx,
        dy: initDy
    }
}

function resetState(coords, speed) {
    pong.state.ball = {};
    pong.state.ball.x = coords.x;
    pong.state.ball.y = coords.y;
    pong.state.ball.dx = speed.dx;
    pong.state.ball.dy = speed.dy;
    pong.state.ball.radius = pong.constants.ballRadius;

    pong.state.paddle1 = {};
    pong.state.paddle1.number = 1;
    pong.state.paddle1.right = false;
    pong.state.paddle1.left = false;
    pong.state.paddle1.x = (pong.canvas.width - pong.constants.paddleWidth) / 2;
    pong.state.paddle1.y = pong.canvas.height - pong.constants.paddleHeight - pong.constants.paddlePadding;
    pong.state.paddle1.height = pong.constants.paddleHeight;
    pong.state.paddle1.width = pong.constants.paddleWidth;

    pong.state.paddle2 = {};
    pong.state.paddle2.number = 2;
    pong.state.paddle2.right = false;
    pong.state.paddle2.left = false;
    pong.state.paddle2.x = (pong.canvas.width - pong.constants.paddleWidth) / 2;
    pong.state.paddle2.y = pong.constants.paddlePadding;
    pong.state.paddle2.height = pong.constants.paddleHeight;
    pong.state.paddle2.width = pong.constants.paddleWidth;
}

function drawBall(ctx, xCoord, yCoord, radius, color) {
    ctx.beginPath();
    ctx.rect(xCoord, yCoord, radius, radius);
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

function checkSideWallCollisions() {
    if (pong.state.ball.x + pong.state.ball.dx > pong.canvas.width - pong.state.ball.radius || pong.state.ball.x + pong.state.ball.dx < 0) {
        pong.state.ball.dx = -pong.state.ball.dx;
    }
}

function checkEndWallCollisions() {
    if (pong.state.ball.y + pong.state.ball.dy < 0) {
        handleGameOver("1");
    } else if (pong.state.ball.y + pong.state.ball.dy > pong.canvas.height - pong.state.ball.radius) {
        handleGameOver("2");
    }
}

function checkPaddleCollision(ball, paddle) {
    if (paddle.number === 1) {
        if (ball.x <= paddle.x + paddle.width &&
            ball.x + ball.radius >= paddle.x &&
            ball.y + ball.radius >= paddle.y) {
                ball.y = paddle.y - ball.radius;
                ball.dy = -ball.dy;
        }
    } else if (paddle.number === 2) {
        if (ball.x <= paddle.x + paddle.width &&
            ball.x + ball.radius >= paddle.x &&
            ball.y <= paddle.y + paddle.height) {
                ball.y = paddle.y + paddle.height;
                ball.dy = -ball.dy;
        }
    }

}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
}

function checkCollisions() {
    checkSideWallCollisions();
    checkPaddleCollision(pong.state.ball, pong.state.paddle1, 1);
    checkPaddleCollision(pong.state.ball, pong.state.paddle2, 2);
    checkEndWallCollisions();
}

function handleGameOver(winner) {
    pong['score'][winner] = pong['score'][winner] + 1;
    pong.state.lastWinner = winner;
    updateScoreTable();
    alert("Player " + winner + " wins!");
    clearInterval(pong.state.intervalId);
    document.getElementById("start").disabled = false;
}

function updateScoreTable() {
    document.getElementById("player1Score").innerHTML = pong['score']['1'];
    document.getElementById("player2Score").innerHTML = pong['score']['2'];
}

function updateBallLocation() {
    pong.state.ball.x += pong.state.ball.dx;
    pong.state.ball.y += pong.state.ball.dy;
}

function updatePaddleLocation(paddle) {
    if (paddle.right && paddle.x < pong.canvas.width - pong.constants.paddleWidth - 5) {
        paddle.x += pong.constants.paddleSpeed;
    } else if (paddle.left && paddle.x > 5) {
        paddle.x -= pong.constants.paddleSpeed;
    }
}

function draw() {
    pong.ctx.clearRect(0, 0, pong.canvas.width, pong.canvas.height);
    drawBall(pong.ctx, pong.state.ball.x, pong.state.ball.y, pong.constants.ballRadius, pong.constants.color);
    drawPaddle(pong.ctx, pong.state.paddle1.x, pong.state.paddle1.y, pong.constants.paddleHeight, pong.constants.paddleWidth, pong.constants.color);
    drawPaddle(pong.ctx, pong.state.paddle2.x, pong.state.paddle2.y, pong.constants.paddleHeight, pong.constants.paddleWidth, pong.constants.color);
    checkCollisions();
    updateBallLocation();
    updatePaddleLocation(pong.state.paddle1);
    updatePaddleLocation(pong.state.paddle2);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.keyCode == pong.constants.paddle1.rightKey) {
        pong.state.paddle1.right = true;
    } else if (e.keyCode == pong.constants.paddle1.leftKey) {
        pong.state.paddle1.left = true;
    } else if (e.keyCode == pong.constants.paddle2.leftKey) {
        pong.state.paddle2.left = true;
    } else if (e.keyCode == pong.constants.paddle2.rightKey) {
        pong.state.paddle2.right = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == pong.constants.paddle1.rightKey) {
        pong.state.paddle1.right = false;
    } else if (e.keyCode == pong.constants.paddle1.leftKey) {
        pong.state.paddle1.left = false;
    } else if (e.keyCode == pong.constants.paddle2.leftKey) {
        pong.state.paddle2.left = false;
    } else if (e.keyCode == pong.constants.paddle2.rightKey) {
        pong.state.paddle2.right = false;
    }
}
