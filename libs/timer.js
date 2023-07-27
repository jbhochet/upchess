/**
 * Permet de calculer le temps écoulé entre un instant A et un instant B
 * @class
 * @property {Date} #lastTime - contient la date du dernier appel à la méthode
 *           start
 */
class Timer {
    
    #lastTime;

    /**
     * @constructor
     */
    constructor() {
        this.#lastTime = 0;
    }

    /**
     * Démarre le timer
     */
    start() {
        this.#lastTime = new Date();
    }
    
    /**
     * Stop le timer
     * @return {number} le temps en seconde depuis le dernier appel de la méthode start
     */
    stop() {
        if(!this.#lastTime) return 0;
        const now = new Date();
        const sec = Math.round((now - this.#lastTime) / 1000);
        this.#lastTime = 0;
        return sec;
    }

}

export default Timer;
