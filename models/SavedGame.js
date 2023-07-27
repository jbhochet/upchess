import mongoose from "mongoose";

/**
 * Représente la sauvegarde d'une partie dans la bdd
 * @class SavedGame
 * @extends mongoose.Model
 * @constructor SavedGame
 * @param {Object} opt
 * @param {mongoose.Schema.Types.ObjectId} opt.black - l'id de l'utilisateur qui à joue les pièces noires
 * @param {mongoose.Schema.Types.ObjectId} opt.white - l'id de l'utilisateur qui à joue les pièces blanches
 * @param {string} opt.winner - La couleur gagnante: 'w' ou 'b'
 * @param {Date} [opt.playedOn=Date.now()] - la date de fin de la partie
 * @param {string} opt.pgn - la partie dans le format pgn
 * @property {mongoose.Schema.Types.ObjectId} black - l'id de l'utilisateur qui à joue les pièces noires
 * @property {mongoose.Schema.Types.ObjectId} white - l'id de l'utilisateur qui à joue les pièces blanches
 * @property {string} winner - La couleur gagnante: 'w' ou 'b'
 * @property {Date} [playedOn=Date.now()] - la date de fin de la partie
 * @property {string} pgn - la partie dans le format pgn
 */
const savedGameSchema = new mongoose.Schema({

    black: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    white: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    winner: String,

    playedOn: {type: Date, default: Date.now},

    pgn: String

});

export default mongoose.model("SavedGame",savedGameSchema);
