document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (username === "" || password === "") {
            alert("Tous les champs sont requis.");
            return;
        }

        // Validation simulée des informations de connexion
        // Ici vous pouvez ajouter des appels API pour vérifier les informations de connexion
        
        // Si la validation est réussie
        alert("Connexion réussie !");
        window.location.href = "home.html";
    });
});
