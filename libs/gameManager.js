import { nanoid } from "nanoid";
import Game from "./game.js";


/**
 * @typedef {Object} GameInfo
 * @property {string} code - Le code de la partie
 * @property {Game} game - L'instance de la partie
 */


/**
 * Permet de gérer plusieurs instances de {@link Game}
 *
 * @property {Game[]} games - Contient l'ensemble des instances de Game
 * (les parties en cours)
 */
class GameManager {

    games;

    constructor() {
        this.games = {};
    }

    /**
     * Renvoie l'instance de game qui possède ce code, peut renvoyer null si aucune partie possède
     * ce code.
     * @param {string} code - Le code de la partie
     * @returns {?Game}
     * */
    getGame(code) {
        return this.games[code] || null;
    }

    /**
     * Renvoie l'objet contenant le code et l'instance de la partie
     * @returns {?GameInfo}
     */
    getPlayerGame(playerId, anonymous) {
        let res = { code: null, game: null };
        for(const [code, game] of Object.entries(this.games)) {
            for(const player of [game.white, game.black]) {
                if(player && player.anonymous === anonymous && player.id === playerId) {
                    res.code = code;
                    res.game = game;
                    break; // On sort de la boucle quand on trouve le joueur
                }
            }
            if(res.code) break; // On sort de la boucle car on a trouvé la partie
        }
        return res;
    }
    
    /**
     * Initialise un nouvelle instance de game et renvoie son code
     * @param {string} playerId - L'identifiant du joueur
     * @param {string} username - Le nom d'utilisateur qui sera utilisé par le joueur
     * @param {string} color - La couleur du joueur
     * @param {number} time - Le temps initial de la partie
     * @returns {string} Le code de la partie nouvellement créée
     */
    initGame(playerId, username, color, time) {
        const code = nanoid(10);
        this.games[code] = new Game(playerId, username, color, time);
        this.games[code].once("gameover", () => { this.deleteGame(code) });
        return code;
    }
    
    /** 
     * Supprime la partie en mémoire
     * @param {string} code - Le code de la partie
     */
    deleteGame(code) {
        const game = this.getGame(code);
        if(game) {
            delete this.games[code];
        }
    }

}

export default GameManager;
