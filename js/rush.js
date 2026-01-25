let car = [];
let obstacles = [];
let side = 0;
let edges = [];
let speed = 20;
const carY = 300; // limite inferior
let sideX = [40, 100]; // 40 = carro à esquerda; 100 = carro à direita
let score = 0; // pontuacao
// Modela o carro
const carModel = [
    [20, 0],
    [0, 20], [20, 20], [40, 20],
    [20, 40],
    [0, 60], [40, 60]
];
const obsGap = 80;

nome_jogo.innerText = "Corrida";

// Criar carro
function start(){
    // limpa o campo 
    Array.from(field.children).forEach(p => p.remove());
    // Reinicia obstáculos
    obstacles = [];
    score = 0;
    document.getElementById("points").innerText = score; // atualiza na tela

    // Inicializa carro e parâmetros para posição
    car = []; 
    // Posiciona o carro
    carModel.forEach(([dx, dy]) => {
        const p = newPiece(sideX[side] + dx, carY + dy);
        p.classList.add("car");
        car.push(p);
    });

    // Cria bordas
    createEdges();
}

// Move, verifica colisão, atualiza pontos, aumenta velocidade progressivamente, cria obstáculos
function loop(){
    moveEdges();
    move();
    moveObstacles();

    if(checkCrash()){
        endGame();
    }
}

function checkCrash(){
    const carTop = carY;
    const carBottom = carY + 60;

    for (const obs of obstacles) {

        // só testa se estiver na mesma faixa
        if (obs.side !== side) continue;

        const obsTop = obs.y;
        const obsBottom = obs.y + 60;

        // interseção vertical
        if (carBottom >= obsTop && carTop <= obsBottom) {
            return true; // bateu
        }
    }

    return false;
}


// Cria bordas
function createEdges() {
    edges = [];

    for(let y = -60; y < 400; y += 120){

        const group = {
            y: y,
            pieces: []
        };

        // esquerda
        for(let i = 0; i < 3; i++){
            let p = newPiece(0, y + i * 20);
            p.classList.add("edge");
            group.pieces.push(p);
        }

        // direita
        for(let i = 0; i < 3; i++){
            let p = newPiece(180, y + i * 20);
            p.classList.add("edge");
            group.pieces.push(p);
        }

        edges.push(group);
    }
}


// Move bordas
function moveEdges() {
    edges.forEach(group => {
        group.y += speed;

        group.pieces.forEach((p, i) => {
            p.style.top = group.y + (i % 3) * 20 + "px";
        });

        // quando o grupo inteiro sai
        if(group.y > 400){
            group.y = -60;
        }
    });
}


// Movimento do carro
function move(){
    // Esquerda
    if(direction === 37 && side > 0){
        side = 0;
    }

    // Direita
    if(direction === 39 && side < 1){
        side = 1;
    }

    // Move cada .piece
    car.forEach((p, i) => {
        p.style.left = sideX[side] + carModel[i][0] + "px";
        p.style.top  = carY + carModel[i][1] + "px";
    });

    direction = null;
}

// Cria obstáculos
function createObstacle() {
    const obs = {
        pieces: [],
        side: Math.floor(Math.random() * 2),
        y: -80, // Nasce fora de tela
        scored: false
    };

    carModel.forEach(([dx, dy]) => {
        const p = newPiece(sideX[obs.side] + dx, obs.y + dy);
        p.classList.add("obstacle");
        obs.pieces.push(p);
    });

    obstacles.push(obs);
}

// Move obstáculos
function moveObstacles(){

    // cria o primeiro
    if(obstacles.length === 0){
        createObstacle();
    }

    // cria o próximo se houver espaço
    if(obstacles.length > 0){
        const last = obstacles[obstacles.length - 1];

        if(last.y > obsGap){
            createObstacle();
        }
    }

    obstacles.forEach(obs => {
        obs.y += speed;

        obs.pieces.forEach((p, i) => {
            p.style.top = obs.y + carModel[i][1] + "px";
        });
    });

    obstacles.forEach(obs => {
        // só conta UMA vez
        if (!obs.scored) {

            // carro já passou completamente
            if (obs.y > carY + 60) {
                obs.scored = true;
                score++;
                document.getElementById("points").innerText = score;

                // aceleração progressiva
                if (time > MIN_TIME) {
                    updateGameSpeed(time - 20); // diminui o intervalo → mais rápido
                }
            }
        }
    });

    // remove obstáculos fora da tela
    if(obstacles.length > 0 && obstacles[0].y > 420){
        obstacles[0].pieces.forEach(p => p.remove());
        obstacles.shift();
    }
}