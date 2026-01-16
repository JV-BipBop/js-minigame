let snake = null; // Array da cobra 
let piece = null; // Comida
let pieceOn = false; // Evita criar várias comidas

nome_jogo.innerText = "Cobrinha"; // Nome do jogo

// Cria cobra
function start(){
  head = newPiece(0, 0); // Cria peça na posição (0,0)
  head.id = "head";
  direction = 39; // para direita
  snake = [head];
  pieceOn = false;
  createRandomPiece(Math.floor(Math.random() * 9) * 20, Math.floor(Math.random() * 9) * 40); // Gera comida
}

// Move, verifica colisão, etc.
function loop(){
  createRandomPiece(Math.floor(Math.random() * 9) * 20, Math.floor(Math.random() * 9) * 40); // Gera comida (se não existir)
  eatPiece(); // Verifica se comeu
  refreshTail(); // Atualiza corpo
  move(); // Move a cabeça
  if(gameOver()) return; // Verifica 'game over'
}

// Movimento da cabeça
function move(){
  switch (direction) {
    case 37: // Esquerda
      head.style.left = (getPosition(head, "left")-20) + "px";
      break;
    case 38: // Cima
      head.style.top = (getPosition(head, "top")-20) + "px";
      break;
    case 39: // Direita
      head.style.left = (getPosition(head, "left")+20) + "px";
      break;
    case 40: // Baixo
      head.style.top = (getPosition(head, "top")+20) + "px";
      break;
  }
}

// Gera comida (se não existir)
function createRandomPiece(left, top){
  if(!pieceOn){
    piece = newPiece(left, top);
    pieceOn = true;
  }
}

// Verifica se há 'Game Over' e campo-limite do jogo
function gameOver(){
  let left = getPosition(head, "left");
  let top = getPosition(head, "top");
  if(left < 0 || left > 180 || top < 0 || top > 380){
    return endGame();
  }
  else{
    snake.forEach(function(piece, index, array){
      if(index > 1){
        if(colision(head, piece)){
          return endGame();
        }
      }
    });
  }
}

// Verifica se comeu
function eatPiece(){
  if(colision(head, piece)){
    pieceOn = false;
    piece.className = "piece tail";
    snake.push(piece); // Comida vira parte do corpo

    points.innerText = snake.length-1; // Atualiza os pontos

    // Acelera o jogo em 10 milisegundos
    clearInterval(timer);
    time -= 10
    timer = setInterval(loop, time);
  }
}

// Atualiza corpo
function refreshTail(){
  snake.forEach(function(piece, index, array){
    if(index > 0){
      if(array.length > index+1){
        piece.style.left = getPosition(array[index+1], "left")+"px";
        piece.style.top = getPosition(array[index+1], "top")+"px";
      }
      else{
        piece.style.left = getPosition(head, "left")+"px";
        piece.style.top = getPosition(head, "top")+"px";
      }
    }
  });
}