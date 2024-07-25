document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour récupérer les cookies
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // Fonction pour afficher les événements
    function displayEvents(events) {
        const eventGrid = document.querySelector('.event-grid');
        eventGrid.innerHTML = ''; // Vide la grille d'événements avant d'ajouter les nouveaux éléments

        events.forEach(event => {
            // Crée une carte d'événement
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';

            // Crée l'image de l'événement
            const eventImage = document.createElement('img');
            eventImage.src = event.image || 'default-event-image.jpg'; // Assure-toi de définir une image par défaut
            eventImage.alt = `Image de l'événement: ${event.name}`;

            // Crée les informations de l'événement
            const eventInfo = document.createElement('div');
            eventInfo.className = 'event-info';
            eventInfo.innerHTML = `
                <h3>${event.name}</h3>
                <p>${new Date(event.date).toLocaleDateString('fr-FR')}</p>
                <p>${event.description}</p>
                <button class="details-button" data-event-id="${event.id}">Détails</button>
            `;

            // Ajoute l'image et les informations à la carte
            eventCard.appendChild(eventImage);
            eventCard.appendChild(eventInfo);

            // Ajoute la carte à la grille
            eventGrid.appendChild(eventCard);
        });
    }

    // Fonction pour récupérer les événements depuis l'API
    function fetchEvents() {
        const accessToken = getCookie('access_token');

        if (!accessToken) {
            alert('Vous devez être connecté pour voir les événements.');
            window.location.href = 'login.html'; // Redirection vers la page de connexion
            return;
        }

        // Prépare les options pour l'envoi de la requête GET
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}` // Ajoute le jeton d'accès aux en-têtes
            }
        };

        // Envoie la requête GET à l'API pour récupérer les événements
        fetch('http://localhost:3000/events', requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Échec de la récupération des événements.');
                }
                return response.json();
            })
            .then(data => {
                displayEvents(data); // Affiche les événements récupérés
            })
            .catch(error => {
                alert(error.message);
            });
    }

    // Appelle la fonction pour récupérer les événements lorsque la page est chargée
    fetchEvents();
});
