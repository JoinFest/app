document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche le formulaire de se soumettre normalement

        // Récupère les valeurs des champs du formulaire
        const username = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Crée l'objet de données à envoyer
        const data = {
            email: username, // Utilise l'email pour le login
            password: password
        };

        // Envoie la requête POST à l'API de connexion
        fetch('http://localhost:3000/auth/login', { // Assure-toi que l'URL est correcte
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json()) // Convertit la réponse en JSON
        .then(data => {
            // Vérifie si la réponse contient un jeton d'accès
            if (data.access_token) {
                // Stocke le jeton d'accès en tant que cookie
                const expires = new Date();
                expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000)); // Cookie valide pendant 1 jour
                document.cookie = `access_token=${data.access_token}; expires=${expires.toUTCString()}; path=/; Secure; SameSite=Strict`;

                // Affiche un message de succès et redirige l'utilisateur
                alert('Connexion réussie !');
                window.location.href = '/'; // Redirection vers une page protégée ou tableau de bord
            } else {
                throw new Error('Echec de la connexion'); // Gère les erreurs de jeton
            }
        })
        .catch(error => {
            // Affiche une alerte en cas d'erreur
            alert(error.message);
        });
    });
});
