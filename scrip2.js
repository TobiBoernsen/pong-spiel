// Initialisierung der Spiel-Elemente
const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 2,
    dx: 2,
    dy: 2,
    color: "#0f0"
};

const player = {
    x: 0,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    dy: 4,
    color: "#0f0"
};

const computer = {
    x: canvas.width - 10,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    dy: 4,
    color: "#0f0"
};

let playerScore = 0;
let computerScore = 0;
let hitCount = 0;
const difficultySelect = document.getElementById("difficulty");
let difficulty = difficultySelect.value;

difficultySelect.addEventListener("change", function() {
    difficulty = difficultySelect.value;
    resetDifficulty();
    restartGame();
});

function resetDifficulty() {
    switch(difficulty) {
        case "easy":
            computer.dy = 2;
            ball.speed = 1.5;
            speedIncreaseFactor = 1.015;
            break;
        case "medium":
            computer.dy = 4;
            ball.speed = 2;
            speedIncreaseFactor = 1.025;
            break;
        case "hard":
            computer.dy = 6;
            ball.speed = 2.5;
            speedIncreaseFactor = 1.035;
            break;
    }
}

function shouldMakeMistake() {
    let mistakeChance = 0;
    switch(difficulty) {
        case "easy":
            if (hitCount >= 1 && hitCount <= 7) mistakeChance = 0.15;
            break;
        case "medium":
            if (hitCount >= 4 && hitCount <= 12) mistakeChance = 0.1;
            break;
        case "hard":
            if (hitCount >= 7 && hitCount <= 15) mistakeChance = 0.05;
            break;
    }
    return Math.random() < mistakeChance;
}

function restartGame() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = -ball.dx;
    ball.dy = (Math.random() * 4) - 2;
    hitCount = 0;
}

function drawBall() {
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawPaddle(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawScore() {
    ctx.font = "24px Arial";
    ctx.fillText(playerScore, canvas.width / 4, 30);
    ctx.fillText(computerScore, (3 * canvas.width) / 4, 30);
}

function update() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
    }
    if (ball.x - ball.radius < 0) {
        computerScore++;
        restartGame();
    } else if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        restartGame();
    }

    if ((ball.x - ball.radius < player.x + player.width && ball.x + ball.radius > player.x &&
         ball.y - ball.radius < player.y + player.height && ball.y + ball.radius > player.y) ||
        (ball.x - ball.radius < computer.x + computer.width && ball.x + ball.radius > computer.x &&
         ball.y - ball.radius < computer.y + computer.height && ball.y + ball.radius > computer.y)) {
        
        let collidePoint = (ball.y - (ball.x < canvas.width / 2 ? player.y : computer.y)) / ((ball.x < canvas.width / 2 ? player.height : computer.height) / 2);
        let angle = collidePoint * (Math.PI / 4);
        ball.dx = -ball.speed * Math.cos(angle);
        ball.dy = ball.speed * Math.sin(angle);
        ball.dx = -ball.dx;
        hitCount++;
    }

    if (!shouldMakeMistake()) {
        computer.y += (ball.y - (computer.y + computer.height / 2)) * 0.05;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle(player.x, player.y, player.width, player.height, player.color);
    drawPaddle(computer.x, computer.y, computer.width, computer.height, computer.color);
    drawScore();
    requestAnimationFrame(update);
}

canvas.addEventListener("mousemove", function(event) {
    const rect = canvas.getBoundingClientRect();
    player.y = event.clientY - rect.top - player.height / 2;
});

document.addEventListener("keydown", function(event) {
    switch(event.keyCode) {
        case 38:
            movePaddle(player, "up");
            break;
        case 40:
            movePaddle(player, "down");
            break;
    }
});

document.getElementById("moveUp").addEventListener("touchstart", function() {
    movePaddle(player, "up");
});
document.getElementById("moveDown").addEventListener("touchstart", function() {
    movePaddle(player, "down");
});

function movePaddle(paddle, direction) {
    if (direction === "up") {
        paddle.y -= paddle.dy * 10;
    } else if (direction === "down") {
        paddle.y += paddle.dy * 10;
    }
}

let speedIncreaseFactor = 1.025;
setInterval(function() {
    ball.dx *= speedIncreaseFactor;
    ball.dy *= speedIncreaseFactor;
}, 10000);

resetDifficulty();
update();
