 //enregistrer la référence à l'élément Canvas dans une variable nommée Canvas + création de la variable ctx pour stocker le contexte de rendu 2d


//toutes les intructions sont entre beginPath et closePath

/* création d'un rectangle  "rect" à 20px de la gche et 40px du haut avec un largeur et une hauteur de 50
fillStyle stocke la couleur qui sera utilisé par la méthode fill
ctx.beginPath();
ctx.rect(20, 40, 50, 50);
ctx.fillStyle = "#FF0000";
ctx.fill();
ctx.closePath();

// création d'un cercle "arc" de coordonnées XY( 240,160), d'un rayon de 20,avec un angle de 0 jusqu'à PI*2, False correspond à la direction du dessin (sens des aiguilles d'une montre)
ctx.beginPath();
ctx.arc(240, 160, 20, 0, Math.PI*2, false);
ctx.fillStyle = "green";
ctx.fill();
ctx.closePath();

//possible de remplacer fillStyle et fill par strokeStyle et stroke pour avoir seulement un contour coloré
ctx.beginPath();
ctx.rect(160, 10, 100, 40);
ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
ctx.stroke();
ctx.closePath();





// Pour garder à jour le dessin du canvas il faut définir une fonction draw éxécutée en continue

function draw() {
  //créer l'effaceur de de trainée
  ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.beginPath();
//définir x et y dans arc
ctx.arc(x, y, 10, 0, Math.PI*2);
ctx.fillStyle = "#0095DD";
ctx.fill();
ctx.closePath();
//donner l'effet de mouvement dans la fonction
x += dx;
y += dy;
//il apparait une trainée avec leffet de mouvement que l'on efface avec ctx.clearRect

}*/
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
//définir un point de départ en XY
var x = canvas.width/2;
var y = canvas.height-30;
//variable pour le rayon de la balle
var ballRadius = 10;
//définir la valeur qui s'ajoute à X et Y pour donner l'effet de mouvement
var dx = 2;
var dy = -2;
//créer une raquette (paddle), il s'agit d'un rectangle de 10X75 placer au centre du canvas
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
//variable pour définir si le bouton est pressé ou non (boolean)
var rightPressed = false;
var leftPressed = false;
//créer les variables liées aux briques
var brickRowCount = 3;
var brickColumnCount = 5;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
//définir la largeur utilisable en fonction du  nombre de briques
var newCanvasWidth = (canvas.width - (brickOffsetLeft * 2) - brickPadding * (brickColumnCount - 1));
//définir la largeur des briques en fonctions du nombre de briques
var brickWidth = newCanvasWidth / brickColumnCount;
// définir la hauteur utilisable en fonction du nombres de briques
var newCanvasHeight = (canvas.height / 2 ) - (brickOffsetTop * 2) - brickPadding * (brickRowCount - 1);
console.log(newCanvasHeight);
//définir la hauteur des briques en fonction du nombre de briques
var brickHeight = newCanvasHeight / brickRowCount;
var gameOverNotify = document.querySelector('.game-over-notify');
var interval;
var score = 0;
// créer des nouvelles briques
var bricks = [];
for(var c=0; c<brickColumnCount; c++){
   bricks[c] = [];
   for(var r=0; r<brickRowCount; r++){
     // on vérifie la valeur de status de chaque brique. si 1 déssiner sinon maj drawbricks
     bricks[c][r] = {x: 0, y:0, status: 1};
   }
 }
//pour savoir si des touches sont préssées on utilise des "listener"
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
gameOverNotify.addEventListener("click", function() {
  document.location.reload();
});



//fonction de gestion d'appui sur les touches. e variable 37= touche fleche gche  39= touche flèche droite
//si gche préssée leftPressed est mis à true et false quand relachée...idem rightPressed
function keyDownHandler(e) {
  if(e.keyCode == 39) {
    rightPressed = true;
  }
  else if(e.keyCode == 37) {
    leftPressed = true;
  }
}
function keyUpHandler(e) {
  if(e.keyCode == 39) {
    rightPressed = false;
  }
  else if(e.keyCode == 37) {
    leftPressed = false;
  }
}
//Détection des collisions
function collisionDetection() {
  for(var c=0; c<brickColumnCount; c++) {
  for(var r=0; r<brickRowCount; r++) {
    var b = bricks[c][r];
    //calcul de la condition de collisions et rebond
    if(b.status ==1){
    if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
      dy = -dy;
      b.status = 0;
      // Ajoute 1 point à chaque brique cassée
           score++;
           //message de victoire et rechargement du jeu
           if(score == brickRowCount*brickColumnCount) {
            alert("YOU WIN, CONGRATS!");
            document.location.reload();
            clearInterval(interval); // Needed for Chrome to end game
          }
    }
    }
   }
  }
}
// Ecrire le score: font définit la taille et la police, filltext: charger le texte et sa position
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}
//séparer la fontion draw() en deux fonctions
function drawBall(){
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}
// dessiner le paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#BADA55";
  ctx.fill();
  ctx.closePath();
}
//Dessiner les briques
function drawBricks() {
  for(var c=0; c<brickColumnCount; c++){
    for(var r=0; r<brickRowCount; r++){
    //agir en fonction du status de la brique
      if(bricks[c][r].status == 1) {
        var brickX = (c*(brickWidth + brickPadding)) + brickOffsetLeft;
        var brickY = (r*(brickHeight + brickPadding)) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX,brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
        }
    }
  }
}


function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  collisionDetection();
  //rebondir à gauche et à droite
  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  //Rebondir en haut et en bas + GameOver si touche le bas
  if(y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height-ballRadius) {
    // gérer le rebond sur le paddle
    if(x > paddleX && x < paddleX + paddleWidth) {
      if(y= y-paddleHeight){
      dy = -dy;
    }
    }
    else {
  gameOverNotify.style.display = 'flex';
  clearInterval(interval);
  return;
    }
  }
  // si dte préssée +7 sur X
  if(rightPressed && paddleX < canvas.width-paddleWidth) {
    paddleX += 7;
  }
  //si gche préssée -7 sur X
  if(leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
  x += dx;
  y += dy;
}
//défini l'intervalle de répétition en millisecondes et se répète à l'infini
setInterval (draw, 10);
