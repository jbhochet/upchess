/*
 * Script
 */

let gameIsOver = false;
let isMyTurn = false;
let legalMoves = [];

const whiteSquareGrey = '#a9a9a9'
const blackSquareGrey = '#696969'

const opponentTimer = makeTime("opponentTime");
const myTimer = makeTime("myTime");

const promotion = { src: null, dst: null };

const gameoverModal = new bootstrap.Modal("#gameoverModal");
const promotionDialog = new bootstrap.Modal("#promotionModal");

/*
 * Configuration du plateau
 */

const config={
    position:'start',
    draggable: true,
    dropOffBoard: 'snapback',
    pieceTheme: pieceTheme,
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare
}

const board = new Chessboard('board', config);

// Configuration du plateau

// On change le sens du plateau si besoin
if(!isWhite) board.flip();

// Gestion de la taille améliorée
handleResize();
window.onresize = handleResize;

// Désactivation du menu contextuel pour les écrans tactiles
document.getElementById("board")
    .addEventListener("contextmenu", (event) => event.preventDefault());
document.querySelector("body > img[data-piece]")
    .addEventListener("contextmenu", (event) => event.preventDefault());

/*
 * Formulaire de promotion
 */

const promotionForm = document.forms["promotion-form"];
promotionForm.addEventListener("submit", (event) => {
    const piece = promotionForm["promotionRadio"].value;
    socket.emit("move", promotion.src, promotion.dst, piece);
    promotionDialog.hide();
    event.preventDefault();
});


/*
 * Gestion du socket
 */

const socket=io("/game_room");

socket.on("connect",()=>{
    console.log(socket.id);
});

socket.on("turn", (turn, fen, whiteTime, blackTime, history, moves) => {
    // On actualise le plteau
    board.position(fen);
    // On met à jour le prochain joueur qui doit jouer
    isMyTurn = (isWhite && turn == 'w') || (!isWhite && turn == 'b');
    // On actualise le temps
    if(isWhite) {
        myTimer.time = whiteTime;
        opponentTimer.time = blackTime;
    } else {
        myTimer.time = blackTime;
        opponentTimer.time = whiteTime;
    }
    // On affiche les temps
    displayTime(myTimer);
    displayTime(opponentTimer);
    // On configure quel temps doit décrémenter
    if(isMyTurn) {
        myTimer.dec = true;
        opponentTimer.dec = false;
    } else {
        myTimer.dec = false;
        opponentTimer.dec = true;
    }
    // On s'occupe des logs
    if(history) {
        if(history instanceof Array) {
            // On recharge tout l'historique
            logsTableBody.innerHTML = "";
            history.forEach((move) => {
                addLog(move.color == "w", move.from, move.to);
            });
        } else {
            // On ajoute un mouvement à l'historique
            addLog(history.color == "w", history.from, history.to);
        }
    }
    // On actualise les coups légaux
    if(moves)
        legalMoves = moves;
});

socket.on("gameover", (winner, fen) => {
    board.position(fen);
    gameIsOver=true;

    // On génère le texte qui contient le resultat
    let result;
    if(winner == 'd') {
        result = "La partie est nulle.";
    } else {
        if( (isWhite && winner == "w") || (!isWhite && winner == 'b') )
            result = "Vous avez gagné !";
        else result = "Votre adversaire a gagné !"
    }

    // On modifie le message dans le modal
    gameoverResult.innerHTML = result;

    gameoverModal.show();
})

/*
 * Configuration des timers
 */

// On définit l'interval qui va gérer l'affichage du temps
setInterval(() => {
    if(myTimer.dec) {
        if(myTimer.time > 0) myTimer.time--;
        displayTime(myTimer);
    }
    if(opponentTimer.dec) {
        if(opponentTimer.time > 0) opponentTimer.time--;
        displayTime(opponentTimer);
    }
}, 1000);

/*
 * Fonctions
 */

function removeGreySquares () {
    $('#board .square-55d63').css('background', '');
}

function greySquare (square) {
    var $square = $('#board .square-' + square);

    var background = whiteSquareGrey;
    if ($square.hasClass('black-3c85d')) {
        background = blackSquareGrey;
    }

    $square.css('background', background);
}

function displayTime(timer) {
    timer.element.innerHTML = formatTime(timer.time);
}

function makeTime(elementId) {
    return {
        time: 0,
        dec: false,
        element: document.getElementById(elementId)
    };
}

function formatTime(time) {
    // On récupère les heures
    const hours = Math.floor(time / 3600);
    time -= hours * 3600;
    // On récupère les minutes
    const min = Math.floor(time / 60);
    time -= min * 60;
    // time contient le nombre de secondes restantes
    return `${hours}:${min}:${time}`;
}

function addLog(isWhite, from, to) {
    const n = logsTableBody.children.length + 1;
    let style;
    if(isWhite) {
        style = "background-color: #fff; color: #000";
    } else {
        style = "background-color: #000; color: #fff";
    }
    const html = `
    <tr>
        <td style="${style}">${n}</td>
        <td>${from}</td>
        <td>${to}</td>
    </tr>
    `;
    logsTableBody.innerHTML = html + logsTableBody.innerHTML;
}

function handleResize() {
    const $boardbox = $("#boardbox");
    const width = $boardbox.width();
    const height = $boardbox.height();
    const boardWidth = Math.min(width, height);
    $("#boardparent").width(boardWidth);
    board.resize();
}

function getPieceAtPos(pos) {
    const obj = Chessboard.fenToObj(board.fen());
    return obj[pos];
}

function onDrop(src, dst){
    removeGreySquares();
    // On vérifie si le coups est légal
    if(!legalMoves.find(e => e.from == src && e.to == dst))
        return "snapback";
    // Gestion de la promotion
    if((isWhite && dst[1] == "8") || (!isWhite && dst[1] == "1")) {
        const piece = getPieceAtPos(src);
        if(piece[1] == "P") {
            promotion.src = src;
            promotion.dst = dst;
            promotionDialog.show()
            return "snapback";
        }
    }
    socket.emit("move", src, dst);
}

function onMouseoverSquare (square, piece) {
    let moves = legalMoves.filter(e => e.from == square);

    if(moves.length === 0) return;

    greySquare(square);

    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to)
    }
}

function onMouseoutSquare (square, piece) {
    removeGreySquares();
}

function abandon(){
    socket.emit("abandon");
}

function onDragStart (source, piece, position, orientation){
    if(gameIsOver) return false;

    onMouseoverSquare(source, piece)

    if(isMyTurn && isWhite && piece.search(/^b/)!==-1) return false;

    if(isMyTurn && !isWhite && piece.search(/^w/)!==-1) return false;

    if(!isMyTurn)return false;
}

