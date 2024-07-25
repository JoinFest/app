document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('signup-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche le formulaire de se soumettre normalement

        // Récupère les valeurs des champs du formulaire
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Vérifie que les mots de passe correspondent
        if (password !== confirmPassword) {
            alert('Les mots de passe ne correspondent pas.');
            return;
        }

        // Crée l'objet de données à envoyer
        const data = {
            name: username,
            email: email,
            password: password
        };

        // Envoie la requête POST à l'API
        fetch('http://localhost:3000/api/auth/register', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Redirige l'utilisateur ou affiche un message de succès
                alert('Compte créé avec succès !');
                window.location.href = 'login.html'; // Redirection vers la page de connexion
            } else {
                // Affiche un message d'erreur
                alert('Erreur lors de la création du compte : ' + data.message);
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Une erreur est survenue.');
        });
    });
});
