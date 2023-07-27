import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user.js"
import { checkEmail, checkPassword } from "../libs/checkUtil.js";
import SavedGame from "../models/SavedGame.js";
import { elapsedDays, formatDate } from "../libs/dateUtil.js";

const router = express.Router();

router.get("/history", async (req, res) => {
    const userId = req.session.user.id;
    // On récupères toutes les données
    const savedGames = await SavedGame.find({
        $or: [ { black: userId }, { white: userId } ]
    }).populate(["white", "black"]);
    // On change
    const games = [];
    for(const savedGame of savedGames) {
        // On format le titre de la partie
        let white = savedGame.white;
        let black = savedGame.black;

        if(!white) white = "anonyme";
        else white = white.username;

        if(!black) black = "anonyme"
        else black = black.username;

        if(savedGame.winner != null) {
            if(savedGame.winner == "w")
                white = "👑 " + white;
            else black = "👑 " + black;
        }

        // On format la date
        const date = formatDate(savedGame.playedOn);
        // On calcule le nombre de jour depuis cette date
        const elapsed = elapsedDays(savedGame.playedOn);
        // On ajoute notre objet
        games.push({
            id: savedGame.id,
            white, black,
            date, elapsed,
            pgn: savedGame.pgn
        });
    }

    res.render("history", { user: req.session.user, games });
});

router.get("/history/:id/delete", async (req, res) => {
    const id = req.params.id;
    const userId = req.session.user.id;
    await SavedGame.bulkWrite([
        {
            deleteMany: {
                filter: {
                    $or: [
                        { _id: id, black: userId, white: null},
                        { _id: id, black: null, white: userId }
                    ]
                }
            }
        },
        {
            updateMany: {
                filter: { _id: id, white: userId },
                update: { white: null }
            }
        },
        {
            updateMany: {
                filter: { _id: id, black: userId },
                update: { black: null }
            }
        }
    ]);
    res.redirect("/user/history");
})

router.get("/account", (req, res) => {
    res.render("account", {
        user: req.session.user,
        success: req.flash("success"),
        updateEmailError: req.flash("updateEmailError"),
        updatePassError: req.flash("updatePassError"),
        deleteError: req.flash("deleteError")
    });
});

router.post("/update_email", async (req, res) => {
    const newEmail = req.body.newEmail;
    const password = req.body.password;
    let error = null;

    if(checkEmail(newEmail) && checkPassword(password)) {
        const user = await User.findById(req.session.user.id);
        const isSame = await bcrypt.compare(password, user.password);
        if(isSame) {
            user.email = newEmail;
            try {
                await user.save();
                req.flash("success", "L'adresse email modifiée avec succès !");
            } catch(err) {
                if(err.code === 11000) { //Erreur si une clef est dupliquée
                    const fields = Object.keys(err.keyPattern);
                    if(fields.includes("email"))
                        error = "L'adresse email est déjà utilisée !";
                } else {
                    error = "Erreur inconnue...";
                    console.error(err);
                }
            }
        } else error = "Le mot de passe ne correspond pas !";
    } else error = "L'email est invalide !";

    if(error) {
        req.flash("updateEmailError", error);
    }

    res.redirect("/user/account");
});

router.post("/update_password", async (req, res) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    let error = null;

    if(checkPassword(oldPassword) && checkPassword(newPassword)) {
        const user = await User.findById(req.session.user.id);
        const isSame = await bcrypt.compare(oldPassword, user.password);
        if(isSame) {
            const hash = await bcrypt.hash(newPassword, 10);
            user.password = hash;
            await user.save();
            req.flash("success", "Le mot de passe a été modifié avec succès !");
            return res.redirect("/user/account");
        } else error = "L'ancien mot de passe ne correspond pas !";
    } else error = "Les mots de passe sont invalides !";

    // On gère l'erreur
    req.flash("updatePassError", error);
    res.redirect("/user/account");
});

router.post("/delete", async (req, res) => {
    const password = req.body.password;

    if(checkPassword(password)) {
        // On récupére l'utilisateur
        const user = await User.findById(req.session.user.id);
        const isSame = await bcrypt.compare(password, user.password);
        if(isSame) {
            // on fait le ménage dans les parties sauvegardées dans la bdd 
            SavedGame.bulkWrite([
                {
                    deleteMany: {
                        filter: {
                            $or: [
                                { black: user.id, white: null},
                                { black: null, white: user.id }
                            ]
                        }
                    }
                },
                {
                    updateMany: {
                        filter: { white: user.id },
                        update: { white: null }
                    }
                },
                {
                    updateMany: {
                        filter: { black: user.id },
                        update: { black: null }
                    }
                }
            ]);
            // On le supprime
            await user.deleteOne();
            await new Promise((resolve) => {
                req.session.destroy(resolve);
            });
            return res.redirect("/");
        }
    }

    req.flash("deleteError", "Le mot de passe est invalide !");
    res.redirect("/user/account");
});


export default router;
