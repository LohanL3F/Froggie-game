const grenouille = document.getElementById("frog");
const obstacle = document.getElementById("obstacle");
const scoreEl = document.getElementById("score");

let scorefinal = document.getElementById("final-score");
let background = document.getElementById("game");
let isJumping = false; // Saut de la grenouille
let score = 0; // Score du joueur
let gameStarted = false; // État du jeu, démarré ou non
let obstacleInterval; // Intervalle de déplacement de l'obstacle
let gameover = document.getElementById("gameover");

// ÉTAT INITIAL (jeu non démarré)

grenouille.style.backgroundImage = "url(frog-run-stable.png)"; // Image fixe de la grenouille
gameover.style.display = "none";

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
          grenouille.style.backgroundImage = "url(frog-run.gif)"; // Retour à l'animation de course
          // Effet pop à l'atterrissage
          grenouille.classList.add("pop");
          setTimeout(() => grenouille.classList.remove("pop"), 150);
        }
        jumpHeight -= 5; // Diminue la hauteur du saut
      }, 10); // Vitesse de descente
    } else {
      jumpHeight += 5; // Augmente la hauteur du saut
      grenouille.style.bottom = jumpHeight + "px"; // Met à jour la position verticale de la grenouille
    }
  }, 10); // Vitesse de montée
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

function getObstacleSpeed() {
  // Vitesse de l'obstacle en fonction du score et changement du fond
  if (score < 1000) {
    return 20;
  } else if (score < 2000) {
    grenouille.classList.add("sunset");
    background.style.backgroundImage = "url(LandscapeSunset.gif)";
    return 15;
  } else if (score < 3000) {
    return 10;
  } else {
    grenouille.classList.add("night");
    background.style.backgroundImage = "url(LandscapeNight.gif)";
    return 9;
  }
}

function moveObstacle() {
  let obstaclePos = 1000; // Position initiale de l'obstacle (à droite de l'écran)
  obstacle.style.left = obstaclePos + "px"; // Place l'obstacle à sa position initiale

  let currentSpeed = getObstacleSpeed();

  obstacleInterval = setInterval(() => {
    if (obstaclePos < -60) {
      // Si l'obstacle sort de l'écran à gauche
      obstaclePos = 1000; // Réinitialise la position de l'obstacle
      increaseScoreDynamic(100); // On augmente le score de 100 de manière dynamique avec effet pop
    } else {
      obstaclePos -= 5; // Déplace l'obstacle vers la gauche
      obstacle.style.left = obstaclePos + "px"; // Met à jour la position de l'obstacle
    }

    let newSpeed = getObstacleSpeed(); // Vérifie si la vitesse doit changer
    if (newSpeed !== currentSpeed) {
      // Si la vitesse a changé
      clearInterval(obstacleInterval); // Arrête l'intervalle actuel
      moveObstacle(); // Redémarre le déplacement de l'obstacle avec la nouvelle vitesse
      return;
    }

    // Collision

    if (obstaclePos > 50 && obstaclePos < 100 && !isJumping) {
      // Si l'obstacle est à la position de la grenouille et qu'elle est pas en saut
      clearInterval(obstacleInterval); // Arrête le déplacement des obstacles
      gameStarted = false; // Réinitialise l'état du jeu
      gameover.style.display = "flex";

      grenouille.style.backgroundImage = "url(frog-run-stable.png)"; // Remet l'image initiale de la grenouille
      scorefinal.textContent = score; // Donne le score sur l'écran game over
      score = 0; // Réinitialise le score
      scoreEl.textContent = "Score: " + score; // Met à jour l'affichage du score
      background.style.backgroundImage = "url(Landscape.gif)"; // Remet le fond initial
      grenouille.classList.remove("sunset");
      grenouille.classList.remove("night");
    }
  }, currentSpeed); // Vitesse de déplacement de l'obstacle
}

// DÉMARRAGE DU JEU

function startGame() {
  if (!gameStarted) {
    gameStarted = true; // Indique que le jeu a démarré
    gameover.style.display = "none"; // enlève le message game over
    grenouille.style.backgroundImage = "url(frog-run.gif)"; // La grenouille commence à courir
    moveObstacle(); // Démarre le déplacement des obstacles
  }
}

// GESTION DU CLAVIER
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    // Si la touche espace est pressée
    if (!gameStarted) {
      startGame(); // Démarre le jeu si ce n'est pas déjà fait
    } else {
      jump(); // Fait sauter la grenouille
    }
  }
});
