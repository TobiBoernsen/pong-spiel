/* Initialisierung der Spiel-Elemente */
const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Ball-Objekt
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 2,
    dx: 2,
    dy: 2,
    color: "#0f0"
};

// Spieler-Schläger-Objekt
const player = {
    x: 0,
    y: canvas.height / 2 - 40,
    width: 10,
    height: 80,
    dy: 4,
    color: "#0f0"
};

// Computer-Schläger-Objekt
const computer = {
    x: canvas.width - 10,
    y: canvas.height / 2 - 40,
    width: 10,
    height: 80,
    dy: 4,
    color: "#0f0"
};

/* Zeichenfunktionen */
// Zeichnet den Ball
function drawBall() {
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

// Zeichnet die Schläger
function drawPaddle(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

/* Spiel-Update-Funktion */
function update() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball-Kollision mit der oberen und unteren Wand
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
    }

    // Ball-Kollision mit den Schlägern
    if (ball.x - ball.radius < player.x + player.width && ball.x + ball.radius > player.x &&
        ball.y - ball.radius < player.y + player.height && ball.y + ball.radius > player.y ||
        ball.x - ball.radius < computer.x + computer.width && ball.x + ball.radius > computer.x &&
        ball.y - ball.radius < computer.y + computer.height && ball.y + ball.radius > computer.y) {
        ball.dx = -ball.dx;
    }

    // KI für den Computer-Schläger
    computer.y += (ball.y - (computer.y + computer.height / 2)) * 0.05;

    // Zeichnen der Elemente
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle(player.x, player.y, player.width, player.height, player.color);
    drawPaddle(computer.x, computer.y, computer.width, computer.height, computer.color);
    requestAnimationFrame(update);
}

/* Event-Handler für die Steuerung */
// Maussteuerung
canvas.addEventListener("mousemove", function(event) {
    const rect = canvas.getBoundingClientRect();
    player.y = event.clientY - rect.top - player.height / 2;
});

// Tastatursteuerung
document.addEventListener("keydown", function(event) {
    switch(event.keyCode) {
        case 38: // Pfeil nach oben
            movePaddle(player, "up");
            break;
        case 40: // Pfeil nach unten
            movePaddle(player, "down");
            break;
    }
});

// Schaltflächensteuerung für Mobilgeräte
document.getElementById("moveUp").addEventListener("touchstart", function() {
    movePaddle(player, "up");
});
document.getElementById("moveDown").addEventListener("touchstart", function() {
    movePaddle(player, "down");
});

// Funktion zum Bewegen des Schlägers
function movePaddle(paddle, direction) {
    if (direction === "up") {
        paddle.y -= paddle.dy * 10;
    } else if (direction === "down") {
        paddle.y += paddle.dy * 10;
    }
}

// Startet das Spiel-Update
update();
