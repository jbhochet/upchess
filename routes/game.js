import express from "express";
import { checkCode, checkColor, checkTime } from "../libs/checkUtil.js";

const router = express.Router();

router.post("/create", (req, res) => {
    const time = parseInt(req.body.time, 10);
    const color = req.body.color;
    let error = null;

    // On vérifie les données du formulaire 
    if(checkTime(time)) {
        if(!checkColor(color))
            error = "La couleur est invalide !";
    } else error = "Le temps est invalide !";

    // Si il n'y a pas d'erreur
    if(!error) {
        const gameManager = res.app.get("gameManager");
        const anonymous = !req.session.user;
        const playerId = (anonymous) ? req.session.id : req.session.user.id;
        // On vérifie si le joueur n'est pas déjà dans une partie
        if(!gameManager.getPlayerGame(playerId, anonymous).code) {
            let username = null;
            if(anonymous) {
                req.session.anonymous = true;
            } else username = req.session.user.username;
            gameManager.initGame(playerId, username, color, time*60);
            return res.redirect("/game/waiting_room");
        } else error = "Vous êtes déjà dans une partie !";
    }

    // Si on arrive ici, il y a une erreur
    req.flash("createError", error);
    res.redirect("/");
});

router.post("/join", (req, res) => {
    const code = req.body.code;
    let error = null;

    // On verifie les données du formulaire
    if(!checkCode(code))
        error = "Le code est invalide !";

    // Si il n'y a pas d'erreur
    if(!error) {
        const gameManager = res.app.get("gameManager");
        const game = gameManager.getGame(code);
        const anonymous = !req.session.user;
        const playerId = (anonymous) ? req.session.id : req.session.user.id;
        // On vérifie que l'utilisateur ne soit pas déjà dans une partie
        if(!gameManager.getPlayerGame(playerId, anonymous).code){
            // On verifie si le code fait bien référence a une partie
            if(game) {
                // On vérifie que la partie n'est pas complète
                if(!game.isReady()) {
                    const waitingNsp = res.app.get("waitingNsp");
                    // On modifie la session pour que l'id ne change pas
                    let username = null;
                    if(anonymous) {
                        req.session.anonymous = true;
                    } else {
                        username = req.session.user.username;
                    }
                    // On ajoute le joueur
                    game.addPlayer(playerId, username);
                    // On envoie un message dans la salle d'attente
                    waitingNsp.to(code).emit("ready");
                    // On redirige est on sort
                    return res.redirect("/game/game_room");
                } else error = "La partie est complète !"
            } else error = "La partie n'existe pas !";
        } else error = "Vous êtes déjà dans une partie !";
    }

    // Si on arrive ici, il y a une erreur
    req.flash("joinError", error);
    res.redirect("/");
});

router.get("/waiting_room", (req, res) => {
    const gameManager = res.app.get("gameManager");
    const anonymous = !req.session.user;
    const playerId = (anonymous) ? req.session.id : req.session.user.id;
    const { code, game } = gameManager.getPlayerGame(playerId, anonymous);

    // on vérifie si l'utilisateur est dans une partie
    if(code) {
        // on vérifie si la partie est déjà prête
        if(game.isReady()) {
            // on le redirige si elle est prête
            res.redirect("/game/game_room");
        } else {
            // on affiche le code sinon
            return res.render("waiting_room", { user: req.session.user, code })
        }
    }
    // l'utilisateur n'a rien à faire ici
    res.redirect("/");
});

router.get("/game_room", (req, res) => {
    const anonymous = !req.session.user;
    const playerId = (anonymous) ? req.session.id : req.session.user.id;
    const gameManager = res.app.get("gameManager");
    const { code, game } = gameManager.getPlayerGame(playerId, anonymous);

    // Si l'utilisateur n'est pas dans une partie, on le redirige
    if(!code) return res.redirect("/");

    // On vérifie si la partie est prête
    if(!game.isReady()) return res.redirect("/game/waiting_room");

    let player;
    let otherPlayer;
    if(game.white.id == playerId) {
        player = game.white;
        otherPlayer = game.black;
    } else {
        player = game.black;
        otherPlayer = game.white;
    }
    
    res.render("game", {
        user: req.session.user,
        isWhite: (game.white.id == playerId),
        player,
        otherPlayer,
        time: game.time
    });
});

export default router;
