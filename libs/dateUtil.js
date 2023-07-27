/**
 * Ce module permet de mettre en forme des dates en français pour rendre
 * l'éxpérience utilisateur sur le site plus agréable. Ainsi ces fonctions sont
 * centralisé ici et ne polluent pas les fichiers de routes.
 * @module dateUtil
 */ 

const DAY = [
    "dimanche",
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi"
];

const MONTH = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre"
];

/**
 * Renvoie la date formatée en français de la forme.
 * @param {(Date|*)} date - La date à utiliser, doit être accepté par le constructeur `new Date()`
 * @returns {string} La date formatée en français.
 */
function formatDate(date) {
    if(!(date instanceof Date))
        date = new Date(date);
    let res = [];
    res.push(DAY[date.getDay()]);
    res.push(date.getDate());
    res.push(MONTH[date.getMonth()]);
    return res.join(" ");
}

/**
 * Renvoie une chaine de caractères qui permet de situer une date par rapport à aujourd'hui.
 * @param {(Date|*)} date - La date à utiliser, doit être accepté par le constructeur `new Date()`
 * @returns {string} Une chaine de caractère en français qui permet de situer dans le passé la date.
 */
function elapsedDays(date) {
    if(!(date instanceof Date))
        date = new Date(date);
    const today = new Date();
    const days = Math.floor( (today - date) / (1000*60*60*24) );
    let res;
    switch(days) {
        case 0:
            res = "aujourd'hui"
            break;
        case 1:
            res = "hier";
            break;
        default:
            res = `${days} jours`;
    }
    return res;

}

export { formatDate, elapsedDays };
