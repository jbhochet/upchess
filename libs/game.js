import { EventEmitter } from 'node:events';
import { Chess } from "chess.js";
import Timer from "./timer.js";
import Player from './player.js';
import SavedGame from "../models/SavedGame.js";

/**
 * @typedef {Object} PlayerInfo
 * @property {string} color - la couleur du joueur
 * @property {Player} player - l'instance de player correspondante
 */

/**
 * @typedef {Object} PastMove
 * @property {string} from - la case de départ
 * @property {string} to - la case de destination
 * @property {string} color - la couleur du joueur qui a joué ce coup
 */

/**
 * @typedef {Object} Move
 * @property {string} from - la case de départ
 * @property {string} to - la case de destination
 */

/**
 * @class
 * @property {number} time
 * @property {?Player} white - L'instance de {@link Player} qui joue avec les
 *           pièces blanches
 * @property {?Player} black - L'instance de {@link Player} qui joue avec les
 *           pièces noires
 * @property {?string} winner - Contient la couleur du gagnant, 'b' ou 'w' 
 * @property {number} time - Le temps de réflexion pour chaque joueur
 * @property {Chess} chess - Instance de la classe Chess qui gère la logique du
 *           jeu
 * @property {number} timeout - Contient l'identifiant du timeout qui met fin à
 *           la partie
 */
class Game extends EventEmitter {

    //Attributs
    time;
    white;
    black;
    winner;
    timer;
    chess;
    timeout;

    /**
     * @constructor
     * @param {string} playerId - l'id du joueur qui crée la partie
     * @param {string} username - le nom du joueur
     * @param {string} color - la couleur du joueur
     * @param {number} time - le temps de réflexion par joueur en seconde
     */
    constructor(playerId, username, color, time) {
        super();
        this.time = time;
        this.black = null;
        this.white = null;
        this.winner = null;
        this.chess = new Chess();
        this.timer = new Timer();
        this.timeout = null;

        // Création player en fonction de la couleur
        const player = new Player(playerId, username, time);
        if(color == "white") {
            this.white = player;
        } else {
            this.black = player;
        }
        this.once("gameover", () => this.save());
    }

    //Méthode

    /**
     * Initialise une instance de Player pour la couleur où il n'y a pas encore de Player
     * @param {string} playerId - L'id du joueur
     * @param {string} username - Le nom d'utilisateur
     */
    addPlayer(playerId, username){
        const player = new Player(playerId, username, this.time);
        if(this.white) {
            this.black = player;
        } else {
            this.white = player;
        }
        this.startTimer();
    }

    /**
     * Renvoie l'instance Player dont c'est le tour
     * @returns {Player} - L'insance Player qui doit jouer
     */
    turn(){
        const p=this.chess.turn();
        if(p=="w"){
            return this.white;
        }
        else{
            return this.black;
        }
    }

    /**
     * Vérifie si la partie est prête à démarrer
     * @returns {boolean} Vrai si la partie peut démarrer, faux sinon
     */
    isReady() {
        return (this.white && this.black);
    }

    /**
     * Renvoie la couleur du joueur passé en argument
     * @param {Player} - le joueur dont on veut connaitre la couleur
     * @returns {string} - la couleur du joueur (w ou b)
     */
    getPlayerColor(player) {
        if(player === this.white)
            return "w";
        else return "b";
    }

    /**
     * Démarre le timer pour le joueur dont c'est le tour
     */
    startTimer() {
        this.timer.start();
        this.timeout = setTimeout(() => {
            this.abandon(this.turn());
        }, this.turn().timeLeft * 1000);
    }

    /**
     * Stop le timer et décrémente le temps du joueur dont c'est le tour
     */
    stopTimer() {
        this.turn().timeLeft -= this.timer.stop();
        clearTimeout(this.timeout);
    }

    /**
     * Met à jour le temps du joueur dont c'est le tour
     */
    updateTime() {
        this.stopTimer();
        this.startTimer();
        this.emit("updateTime");
    }

    /**
     * Effectue le mouvement si il est possible
     * @param {string} from - la case de départ
     * @param {string} to - la case de destination
     * @returns {boolean} vrai si le déplacement est effectué, faux sinon
     */
    move(player, from, to, promotion) {
        let isLegal = false;
        const color = this.getPlayerColor(player)
        if(color == this.chess.turn()) {
            this.stopTimer();
            if(!promotion || !["q", "n", "r", "b"].includes(promotion)) promotion = "q";
            try {
                this.chess.move({ from, to, promotion: promotion });
                isLegal = true;
            }
            catch(err) { /* On ignore */ }
            if(this.chess.isGameOver()) {
                if(!this.chess.isDraw())
                    this.winner = (this.white === this.turn()) ? "b" : "w";
                this.emit("gameover");
            } else {
                this.startTimer();
                if(isLegal)
                    this.emit("moved", {from, to, color});
                else this.emit("updateTime");
            }
        }
        return isLegal;
    }

    /**
     * Renvoie la couleur et l'instance de player
     * @returns {PlayerInfo}
     */
    getPlayer(playerId, anonymous) {
        let res = { color: null, player: null };
        if(this.white.anonymous === anonymous && this.white.id === playerId) {
            res.color = "w";
            res.player = this.white;
        } else if(this.black.anonymous === anonymous && this.black.id === playerId) {
            res.color = "b";
            res.player = this.black;
        }
        return res;
    }

    /**
     * Déclenche l'abandon du joueur
     * @param {Player} player - le joueur qui abandonne
     */
    abandon(player) {
        this.winner = (this.white === player) ? "b" : "w";
        this.emit("gameover");
    }

    /**
     * Renvoie le gagnant de la partie ou null
     * @returns {?Player} - Le gagnant de la partie, null si égalité
     * */
    getWinner() {
        let res = null;
        if(this.winner)
            res = (this.winner === "w") ? this.white : this.black;
        return res;
    }

    /**
     * Renvoie l'historique des coups de la partie
     * @returns {PastMove[]} 
     */
    history() {
        return this.chess.history({ verbose: true })
            .map(e => {
                return { from: e.from, to: e.to, color: e.color };
            });
    }

    /**
     * Renvoie la liste des coups possible pour le joueur dont c'est le tour
     * @returns {Move[]}
     */
    moves() {
        return this.chess.moves({verbose: true}).map(e => {
            return { from: e.from, to: e.to };
        });
    }

    /**
     * Sauvegarde la partie dans la bdd. À chaque appel, une nouvelle sauvegarde est
     * créée dans la bdd.
     */
    save() {
        const savedGame = new SavedGame({
            black: (this.black.anonymous) ? null : this.black.id,
            white: (this.white.anonymous) ? null : this.white.id,
            winner: this.winner,
            pgn: this.chess.pgn()
        });
        savedGame.save();
    }

}

export default Game;
