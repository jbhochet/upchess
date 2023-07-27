const editPasswordForm = document.getElementById("edit-password-form");

editPasswordForm.addEventListener("submit", (event) => {
    const newPassword = editPasswordForm["newPassword"];
    const confirmPassword = editPasswordForm["confirmPassword"];
    if(newPassword.value !== confirmPassword.value) {
        const boxError = document.getElementById("boxError");
        boxError.innerHTML = [ 
            '<div class="alert alert-danger" role="alert">',
            'Les mots de passe ne sont pas identiques !',
            '</div>'
        ].join("\n");;
        event.preventDefault();
    }
})

