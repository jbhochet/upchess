const form = document.getElementById("registration-form");

form.addEventListener("submit", (event) => {

    if(form["password"].value !== form["confirm-password"].value) {
        errorMsg.innerHTML = `
        <div class="alert alert-danger" role="alert">
            Les mots de passe ne sont pas identiques !
        </div>`;
        event.preventDefault();
    }
});
