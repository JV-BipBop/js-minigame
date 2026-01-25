let time = 500; // Tempo do jogo
const MIN_TIME = 120; // limite jogável
let timer = null;
let direction = null; // Direção

btn_top.onclick = () => {direction = 38};
btn_left.onclick = () => {direction = 37};
btn_right.onclick = () => {direction = 39};
btn_botton.onclick = () => {direction = 40}; // Define direções dos botões
btn_start.onclick = startGame;
btn_end.onclick = endGame;
document.body.onkeydown = function (e) {
  if(e.which >= 37 && e.which <=40){ // Teclas direcionais
    direction = e.which;
    if (e.which === 38) boostPressed = true;
  } else if(e.which == 32){ // Barra de espaço
    startGame();
  } else if(e.which == 19){ // Botão de pause
    endGame();
  }
};
document.body.onkeyup = function (e) {
  if (e.which === 38) { // soltar UP
    boostPressed = false;
    if (typeof onBoostEnd === "function") {
      onBoostEnd();
    }
  }
};


// (Re)Inicia o timer do jogo e chama a função start()
function startGame(){
  if(timer != null) endGame();
  Array.from(field.children).forEach(function(p){p.remove();});
  time = 500;
  timer = setInterval(loop, time);
  start(); // Tem que ser criada no sou próprio Javascript
}

// Finaliza o jogo
function endGame(){
  clearInterval(timer);
  alert("Game Over");
  timer = null;
  return true;
}

// Cria um novo pixel
function newPiece(left, top){
    piece = document.createElement("div");
    piece.className = "piece";
    piece.style.left = left+"px";
    piece.style.top = top+"px";
    field.appendChild(piece);  
    return piece;
}

// Verifica colisão de pixels
function colision(objA, objB){
  let aLeft = getPosition(objA, "left");
  let aTop = getPosition(objA, "top");
  let bLeft = getPosition(objB, "left");
  let bTop = getPosition(objB, "top");
  
  return (aLeft == bLeft && aTop == bTop)
}

// Verifica posição do pixel
function getPosition(obj, direction){  
  return parseInt(obj.style[direction])
}

// Altera velocidade do jogo
function updateGameSpeed(newTime){
  if (timer !== null) {
    clearInterval(timer);
    // trava no mínimo jogável
    time = Math.max(newTime, MIN_TIME);
    timer = setInterval(loop, time);
  }
}