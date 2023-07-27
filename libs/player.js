/**
 * Représente un joueur en mémoire
 * @class
 * @property {string} id - Identifiant du joueur
 * @property {string} username - Pseudo du joueur
 * @property {boolean} anonymous - Vrai si le joueur est anonyme
 * @property {number} timeLeft - Le temps de réflexion restant au joueur
 */
class Player { 

    id;
    username;
    anonymous;
    timeLeft;

    /**
     * @constructor
     * @param {string} id - L'identifiant de l'utilisateur
     * @param {string} username - Le peudo de ce joueur
     * @param {number} timeLeft - Le temps restant au joueur en seconde
     */
    constructor(id, username, timeLeft){
        this.id = id;
        this.username = username || "Anonyme";
        this.anonymous = !username;
        this.timeLeft = timeLeft;
    }

}

export default Player;
