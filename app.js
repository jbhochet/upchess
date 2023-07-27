import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import path from "path";
import bodyParser from "body-parser";
import session from "express-session";
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import flash from "connect-flash";
import memorystore from "memorystore";

import GameManager from "./libs/gameManager.js";
import setupWaitingNsp from "./socket/waiting.js";
import setupGameNsp from "./socket/game.js";

import isAuth from "./middlewares/isAuth.js";

import libRouter from "./routes/lib.js";
import userRouter from "./routes/user.js";
import authRouter from "./routes/auth.js";
import gameRouter from "./routes/game.js";


const config = createRequire(import.meta.url)("./config.json");
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {});

// Initialisation de la session
const MemoryStore = memorystore(session);

const sessionMiddleware = session({
    maxAge: 86400000,
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false
});

io.engine.use(sessionMiddleware);
app.use(sessionMiddleware);

// Mise en place de flash
app.use(flash());

// Initialisation de GameManager
const gameManager = new GameManager();

app.set("gameManager", gameManager);

// Configuration des namespaces socket.io
const waitingNsp = io.of("/waiting_room");
const gameNsp = io.of("/game_room");

setupWaitingNsp(waitingNsp, gameManager);
setupGameNsp(gameNsp, gameManager);

app.set("waitingNsp", waitingNsp);

// Mise en place de la connection avec la base de données
mongoose
    .connect(config.mongodb.uri, { dbName: config.mongodb.dbname })
    .then(() => console.log("Connecté à MongoDB !"))
    .catch((err) => {
        console.log("Impossible de se connecter à MongoDB.");
        console.error(err);
    });

// Mise à disposition des fichiers statiques du dossier public
app.use(express.static(path.join(__dirname, "public")));

// Permet de rendre exploitable les données de type application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Mise en place des templates ejs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Configuration des routes
app.use("/lib", libRouter);
app.use("/user", isAuth, userRouter);
app.use("/auth", authRouter);
app.use("/game", gameRouter);

// Affichage des pages web

app.get("/", (req, res) => {
    const anonymous = !req.session.user;
    const playerId = (anonymous) ? req.sessionID : req.session.user.id;
    const isInGame = Boolean(gameManager.getPlayerGame(playerId, anonymous).code)
    res.render("index", {
        user: req.session.user,
        createError: req.flash("createError"),
        joinError: req.flash("joinError"),
        isInGame
    });
});

httpServer.listen(port, () => {
    console.log("Serveur démarré sur le port %d !", port);
});

