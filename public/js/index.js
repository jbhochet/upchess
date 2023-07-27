// Premier appel pour afficher la valeur par défaut
updateTime();

// Afficher le temps séléctionné de façon dynamique
time.addEventListener("input", updateTime);

// Fonctions

/* Met à jour le contenu de l'élément avec l'id showTime avec le temps
 * sélectionné dans le formulaire de création de partie */
function updateTime() {
    let val = parseInt(time.value, 10);
    let text = [];
    let hours = Math.floor(val / 60);
    if(hours > 0) {
        val -= hours * 60;
        text.push(`${hours} heure(s)`);
    }
    if(val > 0) {
        text.push(`${val} minute(s)`);
    }
    showTime.innerHTML = text.join(" et ");
}
