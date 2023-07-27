import express from "express";
import bcrypt from "bcrypt";

import { sendtoMail } from '../libs/mail.js';

import User from "../models/user.js";
import { checkEmail, checkPassword, checkUsername } from "../libs/checkUtil.js";

const router = express.Router();


// Inscription des utilisateurs
router.get("/signup", (req, res) => {
    res.render("signup", { message: null });
});

router.post("/signup", async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    let error = null;

    // Vérification des données
    // https://www.w3resource.com/javascript/form/email-validation.php
    if(checkUsername(username)) {
        if(checkEmail(email)) {
            if(!checkPassword(password))
                error = "Le mot de passe doit contenir au moins 6 caractères !";
        } else error = "L'email est invalide !";
    } else error = "Le nom d'utilisateur doit contenir entre 3 et 20 caractères !";

    if(!error) {
        // Sauvegarde dans la base de donnée
        const hash = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hash });
        try {
            await user.save();
        } catch (err) {
            if(err.code === 11000) { //Erreur si une clef est dupliquée
                const fields = Object.keys(err.keyPattern);
                if(fields.includes("username"))
                    error = "Le nom d'utilisateur est déjà utilisé !";
                else if(fields.includes("email"))
                    error = "L'adresse email est déjà utilisée !";
            } else {
                error = "Erreur inconnue...";
                console.error(err);
            }
        }
        // Si il n'y a pas d'erreur, on initialise la session
        if(!error) {
            //envoi d'email
            sendtoMail(user.email,user.username);
            // Création de la session
            req.session.user = {
                id: user.id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
            };
            return res.redirect("/");
        }
    }

    // Si on arrive ici, il y a eu une erreur
    res.render("signup", { message: error });
});

// Connexion des utilisateurs
router.get("/login", (req, res) => {
    res.render("login", { message: null });
});

router.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if(checkEmail(email) && checkPassword(password)) {
        const user = await User.findOne({ email }).exec();
        if(user) {
            const isSame = await bcrypt.compare(password, user.password);
            if(isSame) {
                // Les mots de passe sont identique
                req.session.user = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    createdAt: user.createdAt,
                };
                return res.redirect("/");
            };
        };
    };
    res.render("login", { message: "L'email ou le mot de passe est incorrect !"});
})

// Déconnection des utilisateurs
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

export default router;
