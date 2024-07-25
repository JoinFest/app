document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour récupérer le jeton d'accès depuis les cookies
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // Vérifie si l'utilisateur est connecté
    function checkUserLoggedIn() {
        const accessToken = getCookie('access_token');
        if (!accessToken) {
            alert('Vous devez être connecté pour accéder à cette page.');
            window.location.href = 'login.html'; // Redirection vers la page de connexion
        }
    }

    // Appelle la fonction pour vérifier la connexion de l'utilisateur
    checkUserLoggedIn();

    document.getElementById('create-event-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche le formulaire de se soumettre normalement

        // Récupère les valeurs des champs du formulaire
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const date = document.getElementById('date').value;

        // Crée l'objet de données à envoyer
        const eventData = {
            name: title,
            description: description,
            date: date
        };

        // Récupère le jeton d'accès stocké dans les cookies
        const accessToken = getCookie('access_token');

        if (!accessToken) {
            alert('Vous devez être connecté pour créer un événement.');
            return;
        }

        // Prépare les options pour l'envoi de la requête POST
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}` // Ajoute le jeton d'accès aux en-têtes
            },
            body: JSON.stringify(eventData)
        };

        // Envoie la requête POST à l'API de création d'événement
        fetch('http://localhost:3000/events', requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Échec de la création de l\'événement.');
                }
                return response.json();
            })
            .then(data => {
                alert('Événement créé avec succès !');
                window.location.href = '/EventDetails'; // Exemple de redirection
            })
            .catch(error => {
                alert(error.message);
            });
    });
});
