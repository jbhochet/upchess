import { Chess } from "/lib/chess/chess.js";

let historyNav = null;

const chess = new Chess();

// Configuration du modal d'affichage du jeu

const boardModal = new bootstrap.Modal("#boardModal");

// Configuration de chessboard.js

const config = {
    position:'start',
    dropOffBoard: 'snapback',
    pieceTheme: pieceTheme,
}

const board = Chessboard('board', config)

window.onresize = resizeBoard;


// On met a jour la taille du plateau quand le modal s'ouvre
document.getElementById("boardModal").addEventListener("shown.bs.modal", resizeBoard);

// Navigation entre les coups
document.getElementById("clickStart").addEventListener("click", clickStart);
document.getElementById("clickPrevious").addEventListener("click", clickPrevious);
document.getElementById("clickNext").addEventListener("click", clickNext);
document.getElementById("clickEnd").addEventListener("click", clickEnd);

// Classe

class HistoryNavigator {

    currentPos;
    history;

    constructor(history) {
        this.history = history;
        this.currentPos = 0;
    }

    start() { this.currentPos = 0 }

    end() { this.currentPos = this.history.length - 1}

    next() {
        if(this.currentPos >= this.history.length - 1) return;
        this.currentPos++;
    }

    previous() {
        if(this.currentPos <= 0) return;
        this.currentPos--;
    }

    getFen() {
        return this.history[this.currentPos];
    }

}

// Fonctions

function handleDeleteClick(event, id) {
    event.stopPropagation();
    window.location.href = `/user/history/${id}/delete`;
}

function resizeBoard() {
    const width = $("#boardbox").width();
    const height = $("#boardbox").height();
    const boardWidth = Math.min(width, height);
    $("#boardparent").width(boardWidth);
    board.resize();
}

function showGameView(el, pgn) {
    const h1 = document.querySelector("#boardModal h1");
    h1.innerHTML = el.querySelector("h5").innerHTML;
    const history = getHistory(pgn);
    historyNav = new HistoryNavigator(history);
    updateBoard();
    boardModal.show();
}

function getHistory(pgn) {
    let res = [];
    chess.loadPgn(pgn);
    const history = chess.history({ verbose: true });
    if(history.length > 0) {
        res = history.map((e) => e.before);
        res.push(history[history.length - 1].after);
    }
    return res;
}

function updateBoard() {
    if(!historyNav) return;
    board.position(historyNav.getFen());
}

function clickStart() {
    if(!historyNav) return;
    historyNav.start();
    updateBoard();
}

function clickPrevious() {
    if(!historyNav) return;
    historyNav.previous();
    updateBoard();
}

function clickNext() {
    if(!historyNav) return;
    historyNav.next();
    updateBoard();
}

function clickEnd() {
    if(!historyNav) return;
    historyNav.end();
    updateBoard();
}

// On rend accessible la fonction sur la page web
window.handleDeleteClick = handleDeleteClick;
window.showGameView = showGameView;
