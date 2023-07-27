export default (io, gameManager) => {
    io.on("connection", (socket) => {
        const req = socket.request;
        const anonymous = !req.session.user;
        const playerId = (anonymous) ? req.session.id : req.session.user.id;

        // On vérifie si il est dans une partie
        const { code, game } = gameManager.getPlayerGame(playerId, anonymous);
        
        if(code) {
            // On vérifie si la partie est prête
            if(game.isReady()) {
                socket.emit("ready");
            } else {
                socket.join(code);
            }
        } else {
            // l'utilisateur n'a rien à faire ici
            socket.disconnect(true);
        }
        
        socket.on("cancel", async () => {
            if(game.isReady()) return;
            gameManager.deleteGame(code);
            io.to(code).emit("canceled");
        });
    });
}
