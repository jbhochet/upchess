/**
 * Ce module contient des fonctions utilitaires pour vérifier que les données
 * envoyées à travers les formulaires html soit valides. Ainsi, l'ensemble des
 * vérifications sont centralisées ici. La modification des critères
 * d'acceptations des données peut être effectuée directement ici.
 * @module checkUtil
 */

/**
 * Vérifie si le nom d'utilisateur est valide. Sa taille doit être comprise
 * entre 3 et 20 caractères.
 * @param {string} username - Le nom d'utilisateur à tester
 * @returns {boolean} Vrai si le nom d'utilisateur est valide, faux sinon
 */
function checkUsername(username) {
    let res = false;
    if(username && username.length >= 3 && username.length <= 20)
        res = true;
    return res;
}

/**
 * Vérifie si l'email est valide. Il doit respecter le format classique d'un
 * email.
 * @param {string} email - L'email à tester
 * @returns {boolean} Vrai si l'email est valide, faux sinon
 */
function checkEmail(email) {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let res = false;
    if(email && email.length <= 320 && regex.test(email))
        res = true;
    return res;
}

/**
 * Vérifie si le mot de passe est valide. Le mot de passe doit faire au moins 6
 * caractères
 * @param {string} password - Le mot de passe à tester, il doit faire au
 * moins 6 caractères.
 * @returns {boolean} Vrai si le mot de passe est valide, faux sinon
 */
function checkPassword(password) {
    let res = false;
    if(password && password.length >= 6)
        res = true
    return res;
}

/**
 * Vérifie si le temps est valide. il doit être un multiple de 5 compris
 * entre 5 et 120.
 * @param {number} time - Le temps en minutes à tester
 * @returns {boolean} Vrai si le temps est valide, faux sinon
 */
function checkTime(time) {
    let res = false;
    if(!Number.isNaN(time) && time >= 5 && time <= 2*60 && time%5 == 0)
        res = true;
    return res;
}

/**
 * Vérifie si le code de partie est valide, il doit avoir exactement 10
 * caractères.
 * @param {string} code - Le code de la partie à tester
 * @returns {boolean} Vrai si le code est valide, faux sinon
 */
function checkCode(code) {
    let res = false;
    if(code && code.length == 10)
        res = true;
    return res;
}

/**
 * Vérifie si la couleur est valide, la couleur doit être 'black' ou
 * 'white'.
 * @param {string} color - Le code à tester
 * @returns {boolean} Vrai si la couleur est valide, faux sinon
 */
function checkColor(color) {
    const colors = [ "white", "black" ];
    let res = false;
    if(color && colors.includes(color))
        res = true;
    return res;
}


export {
    checkUsername,
    checkEmail,
    checkPassword,
    checkTime,
    checkCode,
    checkColor
};
