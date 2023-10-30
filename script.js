const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

function setCanvasSize() {
    const targetRatio = 600 / 320;
    const windowRatio = window.innerHeight / window.innerWidth;

    if (windowRatio > targetRatio) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerWidth * targetRatio;
    } else {
        canvas.height = window.innerHeight;
        canvas.width = window.innerHeight / targetRatio;
    }
}

window.addEventListener('resize', setCanvasSize);
setCanvasSize();

 // Aktualisieren Sie die Canvas-Größe, wenn das Fenster neu skaliert wird
setCanvasSize(); // Setzen Sie die Canvas-Größe beim ersten Laden

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
            mistakeChance = 0.2;
            break;
        case "medium":
            mistakeChance = 0.1;
            break;
        case "hard":
            mistakeChance = 0.05;
            break;
    }
    return Math.random() < mistakeChance;
}

function restartGame() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() < 0.5 ? -1 : 1) * ball.speed;
    ball.dy = (Math.random() * 4 - 2) * ball.speed;
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

function displayEndMessage(message) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0f0";
    ctx.font = "40px Arial";
    ctx.fillText(message, canvas.width / 2 - ctx.measureText(message).width / 2, canvas.height / 2);
}

function update() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Kollision mit den Wänden
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
    }

    // Kollision mit den Schlägern
    if (
        (ball.dx < 0 && ball.x - ball.radius < player.x + player.width && ball.y + ball.radius > player.y && ball.y - ball.radius < player.y + player.height) ||
        (ball.dx > 0 && ball.x + ball.radius > computer.x && ball.y + ball.radius > computer.y && ball.y - ball.radius < computer.y + computer.height)
    ) {
        ball.dx = -ball.dx;
        hitCount++;
    }

    // Punktevergabe
    if (ball.x - ball.radius < 0) {
        computerScore++;
        if (computerScore >= 10) {
            displayEndMessage("Game Over");
            return;
        }
        restartGame();
    } else if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        if (playerScore >= 10) {
            displayEndMessage("Win!");
            return;
        }
        restartGame();
    }

    // KI für den Computer-Schläger
    if (!shouldMakeMistake()) {
        computer.y += (ball.y - (computer.y + computer.height / 2)) * 0.05;
    } else {
        computer.y -= (ball.y - (computer.y + computer.height / 2)) * 0.05;
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
