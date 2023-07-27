/* Vérifie si l'utilisateur est connecté 
 * Il est redirigé vers l'accueil si il ne l'est pas */

export default function(req, res, next) {
    if(!req.session.user)
        return res.redirect("/");
    next();
}
