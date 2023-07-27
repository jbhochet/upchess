export default (io, gameManager) => {
    io.on("connection", async (socket) => {

        /*
         * Vérifications et déclaration des variables
         */

        const req = socket.request;
        const anonymous = !req.session.user;
        const playerId = (anonymous) ? req.session.id : req.session.user.id;
        const { code, game } = gameManager.getPlayerGame(playerId, anonymous);

        // On vérifie si la partie existe et si elle est prête
        if(!game || !game.isReady()) return socket.disconnect(true);

        // On récupère le joueur et sa couleur
        const { player } = game.getPlayer(playerId, anonymous);

        // L'utilisateur rejoint la room pour le jeu
        socket.join(code);

        /*
         * Gestion des évènements
         */

        let first = true;

        const sendTurn = (lastMove) => {
            // On gère l'envoie de l'historique
            let history;
            if(first) {
                history = game.history();
                
            } else {
                if(lastMove) history = lastMove;
            }
            // On gère l'envoie des coups légaux
            let moves;
            if(lastMove || first) {
                if(game.turn() == player) {
                    moves = game.moves();
                } else {
                    moves = [];
                }
            }
            // On met à faux après le premier envoie
            if(first) first = false;
            // On envoie le message au client
            socket.emit("turn", game.chess.turn(), game.chess.fen(),
                game.white.timeLeft, game.black.timeLeft, history, moves);
        }

        const sendGameOver = () => {
            socket.emit("gameover", game.winner || "d", game.chess.fen());
        }

        game.once("gameover", sendGameOver);

        game.on("updateTime", sendTurn);

        game.on("moved", sendTurn);

        game.updateTime();

        socket.once("disconnect", () => {
            game.removeListener("gameover", sendGameOver);
            game.removeListener("updateTime", sendTurn);
            game.removeListener("moved", sendTurn);
        });

        socket.on("abandon", () => {
            game.abandon(player);
        });
        
        // On gère le déplacement
        socket.on("move", async (src, dst, promotion) => {
            game.move(player, src, dst, promotion)
        });
    })
}

