document.addEventListener("DOMContentLoaded", function () {
  // Get DOM elements
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const startScreen = document.getElementById("start-screen");
  const startButton = document.getElementById("start-button");
  const gameOverScreen = document.getElementById("game-over-screen");
  const finalScore = document.getElementById("final-score");
  const restartButton = document.getElementById("restart-button");
  const scoreDisplay = document.getElementById("score");
  const highScoreDisplay = document.getElementById("high-score");
  const scoreContainer = document.getElementById("score-display");
  const pauseContainer = document.getElementById("pause");

  // Game variables
  let player;
  let enemies = [];
  let bullets = [];
  let score = 0;
  let highScore = localStorage.getItem("highScore") || 0;
  let lastFrameTime = 0;
  let enemyFrequency = 0.02;
  let difficultyLevel = 1;
  let maxEnemies = 5;
  let lastScorePoint = 0;

  // Game state variables
  let gameStarted = false;
  let isGameOver = false;
  let isPaused = false;

  // Variables to track arrow key presses
  let leftArrowPressed = false;
  let rightArrowPressed = false;

  // Images for enemies and the player ships
  const enemyImage = new Image();
  enemyImage.src = "enemy.jpg";

  const playerImage = new Image();
  playerImage.src = "player.jpg";

  // Sound effects for shooting, destroying enemy ships and game over
  const shootSound = new Audio("shoot.wav");
  const explosionSound = new Audio("explosion.wav");
  const gameOverSound = new Audio("game_over.wav");

  // Player object
  class Player {
    constructor() {
      this.image = playerImage;
      this.width = 45;
      this.height = 45;
      this.x = canvas.width / 2 - this.width / 2;
      this.y = canvas.height - this.height - 10;
      this.speed = 200;
    }

    draw() {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    move(direction, time) {
      const distance = this.speed * time;
      if (direction === "left" && this.x > 0) {
        this.x -= distance;
      } else if (direction === "right" && this.x < canvas.width - this.width) {
        this.x += distance;
      }
    }
  }

  // Enemy object
  class Enemy {
    constructor(x, y) {
      this.image = enemyImage;
      this.width = 50;
      this.height = 30;
      this.x = x;
      this.y = y;
      this.speed = 1 + Math.random() * 2;
    }

    draw() {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    move() {
      this.y += this.speed;
    }
  }

  // Bullet object
  class Bullet {
    constructor(x, y) {
      this.width = 2000;
      this.height = 10;
      this.x = x + 20;
      this.y = y;
      this.speed = 1;
    }

    draw() {
      ctx.fillStyle = "#0f0";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move() {
      this.y -= this.speed;
    }
  }

  // Start game function
  function startGame() {
    if (!gameStarted) {
      gameStarted = true;
      startScreen.style.display = "none";
      gameOverScreen.style.display = "none";
      canvas.style.display = "block";
      scoreContainer.style.display = "inline";
      pauseContainer.style.display = "flex";
      isGameOver = false;
      player = new Player();
      enemies = [];
      bullets = [];
      score = 0;
      resize();
      updateScore();
      updateHighScore();
      createEnemies();
      gameLoop();
    }
  }

  function gameLoop(timestamp) {
    if (!isPaused) {
      const time = (timestamp - lastFrameTime) / 1000;
      lastFrameTime = timestamp;

      if (isGameOver) {
        gameOver();
        return;
      }

      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      resize();

      player.draw();
      updatePlayerPosition(time);

      enemies.forEach((enemy) => {
        enemy.draw();
        enemy.move();

        if (checkCollision(player, enemy)) {
          isGameOver = true;
        }

        bullets.forEach((bullet, bulletIndex) => {
          if (checkCollision(bullet, enemy)) {
            bullets.splice(bulletIndex, 1);
            enemies.splice(enemies.indexOf(enemy), 1);
            score++;
            updateScore();
            explosionSound.play();
          }
        });
      });

      bullets.forEach((bullet) => {
        bullet.draw();
        bullet.move();
      });

      bullets = bullets.filter((bullet) => bullet.y > 0);

      updateGameLogic();
    }
    
    requestAnimationFrame(gameLoop);
  }

  function gameOver() {
    gameStarted = false;
    enemyFrequency = 0.02;
    difficultyLevel = 1;
    maxEnemies = 5;
    lastScorePoint = 0;
    gameOverSound.play();
    gameOverScreen.style.display = "flex";
    finalScore.textContent = score;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      updateHighScore();
    }
  }

  function pauseGame() {
    isPaused = true;
  }

  function resumeGame() {
    isPaused = false;
  }

  function updatePlayerPosition(time) {
    if (leftArrowPressed && player.x > 0) {
      player.x -= player.speed * time;
    } else if (rightArrowPressed && player.x < canvas.width - player.width) {
      player.x += player.speed * time;
    }
  }

  function updateGameLogic() {
    increaseDifficulty();
    createEnemies();
  }

  function updateScore() {
    scoreDisplay.textContent = score;
  }

  function updateHighScore() {
    highScoreDisplay.textContent = highScore;
  }

  // Function to increase difficulty level and adjust enemy parameters
  function increaseDifficulty() {
    const currentScorePoint = Math.floor(score / 10) * 10;
    if (currentScorePoint > lastScorePoint && currentScorePoint % 10 === 0) {
      difficultyLevel++;
      enemyFrequency += 0.01;
      maxEnemies += 2;
      lastScorePoint = currentScorePoint;
    }
  }

  function checkCollision(obj1, obj2) {
    return (
      obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y
    );
  }

  function createEnemies() {
    const currentScorePoint = Math.floor(score / 10) * 10;
    if (currentScorePoint > lastScorePoint && currentScorePoint % 10 === 0) {
      lastScorePoint = currentScorePoint;
    }

    // Remove enemies that have gone beyond the screen boundaries
    enemies = enemies.filter((enemy) => enemy.y < canvas.height);

    // Respawn enemies that have gone beyond the screen boundaries
    while (enemies.length < maxEnemies) {
      const x = Math.random() * (canvas.width - 30);
      const y = -30;
      enemies.push(new Enemy(x, y));
    }
  }

  startButton.addEventListener("click", startGame);
  restartButton.addEventListener("click", startGame);

  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      leftArrowPressed = true;
    } else if (event.key === "ArrowRight") {
      rightArrowPressed = true;
    } else if (event.key === " ") {
      bullets.push(new Bullet(player.x, player.y));
      shootSound.play();
      leftArrowPressed = false;
      rightArrowPressed = false;
    } else if (event.key === "Escape") {
      if (isPaused) {
        resumeGame();
      } else {
        pauseGame();
      }
    }
  });

  document.addEventListener("keyup", function (event) {
    if (event.key === "ArrowLeft") {
      leftArrowPressed = false;
    } else if (event.key === "ArrowRight") {
      rightArrowPressed = false;
    }
  });
  
function resize() {
    var ratio = canvas.width / canvas.height;
    var canvas_height = window.innerHeight * 11 / 20;
    var canvas_width = canvas_height * ratio;
    if(canvas_width>window.innerWidth){
        canvas_width=window.innerWidth-2;
        canvas_height=canvas_width/ratio;
    }

    canvas.style.width = canvas_width + 'px';
    canvas.style.height = canvas_height + 'px';
}
window.addEventListener('resize', resize);
});
