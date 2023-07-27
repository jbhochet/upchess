import mongoose from "mongoose";

/**
 * Représente un utilisateur dans la base de donnée
 * @class User
 * @extends mongoose.Model
 * @constructor User
 * @param {Object} opt
 * @param {string} opt.username - Le nom d'utilisateur
 * @param {string} opt.email - L'adresse email
 * @param {string} opt.password - Le mot de passe
 * @param {Date} [opt.createdAt=Date.now()] - La date de création du compte
 * @property {string} username - le nom d'utilisateur
 * @property {string} email - l'adresse email
 * @property {string} password - le mot de passe
 * @property {Date} createdAt - la date de création
 */
const userSchema = new mongoose.Schema({

    /* username et email doivent être unique, on doit créer un index
     * pour avoir une erreur si on veut insérer une valeur qui existe
     * déjà dans la base de donnée
     * */

    username: { type: String, required: true, unique: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    createdAt: { type: Date, default: Date.now }

});

export default mongoose.model("User", userSchema);
