const grenouille = document.getElementById("frog");
const obstacle = document.getElementById("obstacle");
const scoreEl = document.getElementById("score");
const twerkMusic = new Audio("CardiBWAP.mp3"); // Je suis tellement désolé pour cette ligne
twerkMusic.loop = true;
twerkMusic.volume = 0.1;
const soundBtn = document.getElementById("sound");
const music = new Audio("gameOST.mp3");
music.loop = true;
music.volume = 0.3;

let soundEnabled = false;
let scorefinal = document.getElementById("final-score");
let background = document.getElementById("game");
let isJumping = false; // Saut de la grenouille
let score = 0; // Score du joueur
let gameStarted = false; // État du jeu, démarré ou non
let obstacleInterval; // Intervalle de déplacement de l'obstacle
let gameover = document.getElementById("gameover");
let isSliding = false; // pour savoir si la grenouille glisse
let isTwerking = false; // pour savoir si la grenouille twerk (mdrr)
// ÉTAT INITIAL (jeu non démarré)

grenouille.style.backgroundImage = "url(frog-sleep.gif)"; // Image fixe de la grenouille
gameover.style.display = "none";

// BOUTON SON

soundBtn.addEventListener("click", () => {
  soundEnabled = !soundEnabled;

  if (soundEnabled) {
    music.play();
    soundBtn.style.backgroundImage = "url(Sound.png)";
  } else {
    music.pause();
    soundBtn.style.backgroundImage = "url(Soundmuted.png)";
  }
});

// SAUT DE LA GRENOUILLE

function jump() {
  if (isJumping) return; // Empêche de sauter si déjà en train de sauter
  isJumping = true; // Indique que la grenouille est en train de sauter

  let jumpHeight = 0; // Hauteur actuelle du saut

  // Image pendant le saut
  grenouille.style.backgroundImage = "url(frog-jump.png)";

  const upInterval = setInterval(() => {
    if (jumpHeight >= 220) {
      // Hauteur maximale du saut
      clearInterval(upInterval); // Arrête la montée
      const downInterval = setInterval(() => {
        // Descente
        grenouille.style.bottom = jumpHeight + "px"; // Met à jour la position verticale de la grenouille
        if (jumpHeight <= 0) {
          // Atteint le sol
          clearInterval(downInterval); // Arrête la descente
          isJumping = false; // Indique que la grenouille n'est plus en train de sauter
          grenouille.style.backgroundImage = isSliding
            ? "url(frog-slide.png)"
            : "url(frog-run.gif)"; // Retour à l'état normal ou slide
          // Effet pop à l'atterrissage
          grenouille.classList.add("pop");
          setTimeout(() => grenouille.classList.remove("pop"), 150);
        }
        jumpHeight -= 5; // Diminue la hauteur du saut
      }, 12); // Vitesse de descente
    } else {
      jumpHeight += 5; // Augmente la hauteur du saut
      grenouille.style.bottom = jumpHeight + "px"; // Met à jour la position verticale de la grenouille
    }
  }, 12); // Vitesse de montée
}
// SLIDE
function startSlide() {
  if (isJumping || isSliding) return;
  isSliding = true;
  grenouille.style.height = "100px";
  grenouille.style.width = "100px";
  grenouille.style.bottom = "0px";
  grenouille.style.backgroundImage = "url(frog-slide.png)";
  grenouille.style.transform = "translateX(40px)";
}

function stopSlide() {
  if (!isSliding) return;
  isSliding = false;
  grenouille.style.height = "100px";
  grenouille.style.width = "100px";
  grenouille.style.backgroundImage = "url(frog-run.gif)";
  grenouille.style.transform = "translateX(0px)";
}

// Twerk
function startTwerk() {
  if (isJumping || isSliding || isTwerking) return;
  isTwerking = true;
  grenouille.style.height = "100px";
  grenouille.style.width = "100px";
  grenouille.style.bottom = "0px";
  grenouille.style.backgroundImage = "url(frog-twerk.gif)";
  grenouille.style.transform = "translateY(3px)";
  twerkMusic.currentTime = 0;
  twerkMusic.play();
  if (soundEnabled) {
    music.pause();
    twerkMusic.currentTime = 0;
    twerkMusic.play();
  }
}

function stopTwerk() {
  if (!isTwerking) return;
  isTwerking = false;
  grenouille.style.height = "100px";
  grenouille.style.width = "100px";
  grenouille.style.backgroundImage = "url(frog-run.gif)";
  grenouille.style.transform = "translateY(0px)";
  twerkMusic.pause();

  if (soundEnabled && gameStarted) {
    music.play();
  }
}

// Fonction pour le "POP" du score

function increaseScoreDynamic(points) {
  const targetScore = score + points; // score qu'on veut atteindre
  const step = 10; // incrément par 10
  const intervalTime = 30; // vitesse de l'animation

  const scoreInterval = setInterval(() => {
    score += step;
    if (score >= targetScore) score = targetScore;
    scoreEl.textContent = "SCORE: " + score;

    // effet pop
    scoreEl.classList.add("pop"); // On ajoute la classe .pop
    setTimeout(() => scoreEl.classList.remove("pop"), 150); // On l'enlève

    if (score >= targetScore) clearInterval(scoreInterval);
  }, intervalTime);
}

// DÉPLACEMENT DE L'OBSTACLE
// VITESSE DES OBSTACLES
function getObstacleSpeed() {
  if (score < 1000) return 20;
  else if (score < 2000) {
    grenouille.classList.add("sunset");
    background.style.backgroundImage = "url(LandscapeSunset.gif)";
    return 15;
  } else if (score < 3000) return 10;
  else {
    grenouille.classList.add("night");
    background.style.backgroundImage = "url(LandscapeNight.gif)";
    return 9;
  }
}

// DÉPLACEMENT DES OBSTACLES
function moveObstacle() {
  let obstaclePos = 1000;
  obstacle.style.left = obstaclePos + "px";

  // 0 = obstacle haut (jump), 1 = obstacle bas (slide)
  let obstacleType = Math.random() < 0.5 ? 0 : 1;
  setObstacleAppearance(obstacleType);

  let currentSpeed = getObstacleSpeed();

  obstacleInterval = setInterval(() => {
    if (obstaclePos < -80) {
      obstaclePos = 1000;
      obstacleType = Math.random() < 0.5 ? 0 : 1;
      setObstacleAppearance(obstacleType);
      increaseScoreDynamic(100);
    } else {
      obstaclePos -= 5;
      obstacle.style.left = obstaclePos + "px";
    }

    let newSpeed = getObstacleSpeed();
    if (newSpeed !== currentSpeed) {
      clearInterval(obstacleInterval);
      moveObstacle();
      return;
    }

    // COLLISION
    const frogRect = grenouille.getBoundingClientRect();
    const obsRect = obstacle.getBoundingClientRect();
    let collided = false;

    if (frogRect.right > obsRect.left && frogRect.left < obsRect.right) {
      if (obstacleType === 0 && !isJumping) collided = true;
      if (obstacleType === 1 && !isSliding) collided = true;
    }

    if (collided) {
      clearInterval(obstacleInterval);
      gameStarted = false;
      gameover.style.display = "flex";

      grenouille.style.backgroundImage = "url(frog-sleep.gif)";
      scorefinal.textContent = "TON SCORE FINAL EST : " + score;
      score = 0;
      scoreEl.textContent = "Score: " + score;
      background.style.backgroundImage = "url(Landscape.gif)";
      grenouille.classList.remove("sunset");
      grenouille.classList.remove("night");
      music.pause();
      music.currentTime = 0;
    }
  }, currentSpeed);
}

// Fonction pour définir visuellement l'obstacle selon son type
function setObstacleAppearance(type) {
  if (type === 0) {
    obstacle.style.height = "160px";
    obstacle.style.width = "80px";
    obstacle.style.bottom = "0px";
    obstacle.style.backgroundImage = "url(obstacle.png)";
  } else {
    obstacle.style.height = "100px";
    obstacle.style.width = "100px";
    obstacle.style.bottom = "0px";
    obstacle.style.backgroundImage = "url(obstacle2.png)";
  }
}

// DÉMARRAGE DU JEU

function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    gameover.style.display = "none";
    grenouille.style.backgroundImage = "url(frog-run.gif)";
    moveObstacle();

    if (soundEnabled) {
      music.play();
    }
  }
}

// GESTION DU CLAVIER
document.addEventListener("keydown", (e) => {
  // Jump
  if (
    e.code === "Space" ||
    e.code === "ArrowUp" ||
    e.key.toLowerCase() === "z"
  ) {
    if (!gameStarted) startGame();
    else jump();
  }

  // Slide
  if (e.code === "ArrowDown" || e.key.toLowerCase() === "s") {
    startSlide();
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowDown" || e.key.toLowerCase() === "s") {
    stopSlide();
  }
});

// Twerk
document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft" || e.key.toLowerCase() === "t") {
    startTwerk();
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft" || e.key.toLowerCase() === "t") {
    stopTwerk();
  }
});

