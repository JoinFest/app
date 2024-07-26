document.addEventListener('DOMContentLoaded', () => {
    // Fonction pour charger un fichier HTML et l'insérer dans un élément
    function loadHTML(elementId, filePath) {
        fetch(filePath)
            .then(response => response.text())
            .then(data => {
                console.log(document.getElementById(elementId));

                document.getElementById(elementId).innerHTML = data;

                // Ajouter la logique pour le lien du profil après avoir chargé le navbar
                const profileLink = document.getElementById('profile-link');
                if (profileLink) {
                    profileLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        const token = localStorage.getItem('jwt');
                        if (token) {
                            window.location.href = 'profile.html';
                        } else {
                            window.location.href = 'login.html';
                        }
                    });
                }
            })
            .catch(error => console.error('Error loading file:', error));
    }

    // Charger le navbar et le footer
    loadHTML('navbar', 'navbar.html');
    loadHTML('footer', 'footer.html');

    // Simuler une vérification de JWT pour l'authentification
    function checkAuth() {
        const token = localStorage.getItem('jwt');
        if (!token) {
            window.location.href = 'login.html';
        }
    }

    // Gestion du formulaire de création d'évènement
    const createEventForm = document.getElementById('create-event-form');
    if (createEventForm) {
        checkAuth();
        console.log("createEventForm", createEventForm);
        createEventForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Ici on enverrait les données au backend
            const eventName = document.getElementById('event-name').value;
            const eventDate = document.getElementById('event-date').value;
            const eventDescription = document.getElementById('event-description').value;

            console.log('Évènement créé:', {eventName, eventDate, eventDescription});
            // Redirection ou affichage d'un message de succès
        });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password})
            })
                .then(response => response.json())
                .then(data => {
                    if (data.access_token) {
                        localStorage.setItem('jwt', data.access_token);
                        window.location.href = 'index.html';
                    } else {
                        console.error('Login failed:', data);
                        // Optionally display an error message to the user
                    }
                })
                .catch(error => console.error('Error:', error));
        });
    }

    // Gestion du formulaire de création de compte
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Ici on enverrait les données au backend pour créer le compte
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;

            console.log('Compte créé:', {name, email, password});
            // Redirection ou affichage d'un message de succès
        });
    }

    // Gestion du formulaire de mise à jour du profil
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            checkAuth();

            // Ici on enverrait les données au backend pour mettre à jour le profil
            const name = document.getElementById('profile-name').value;
            const email = document.getElementById('profile-email').value;

            console.log('Profil mis à jour:', {name, email});
            // Redirection ou affichage d'un message de succès
        });
    }

    const eventsList = document.getElementById('events-list');
    if (eventsList) {
        fetch('http://localhost:3000/events')
            .then(response => response.json())
            .then(events => {
                console.log('Évènements:', events);

                const dateOptions = {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                };

                events.forEach(event => {
                    const formattedDate = new Intl.DateTimeFormat('fr-FR', dateOptions).format(new Date(event.date));
                    const randomImage = getRandomImage();

                    fetch(`http://localhost:3000/users/${event.hostId}`)
                        .then(response => response.json())
                        .then(user => {
                            const eventElement = document.createElement('div');
                            eventElement.classList.add('col-md-4', 'mb-4');
                            eventElement.innerHTML = `
                            <div class="card h-100 clickable-card" data-id="${event._id}">
                                <img src="${randomImage}" class="card-img-top" alt="Image de l'événement">
                                <div class="card-body">
                                    <h5 class="card-title">${event.name}</h5>
                                    <p class="card-text">
                                        <i class="fas fa-calendar-alt"></i> ${formattedDate}
                                    </p>
                                    <p class="card-text">
                                        <i class="fas fa-map-marker-alt"></i> ${event.location}
                                    </p>
                                    <p class="card-text">${event.description}</p>
                                    <p class="card-text"><strong>Organisateur:</strong> ${user.name}</p>
                                </div>
                            </div>`;
                            eventsList.appendChild(eventElement);

                            document.querySelectorAll('.clickable-card').forEach(card => {
                                card.addEventListener('click', () => {
                                    const eventId = card.getAttribute('data-id');
                                    window.location.href = `event.html?id=${eventId}`;
                                });
                            });
                        })
                        .catch(error => console.error('Error loading user details:', error));
                });
            });
    }


    // Chargement des évènements personnels
    const myEventsList = document.getElementById('my-events-list');
    if (myEventsList) {
        checkAuth();

        // Simuler le chargement des évènements depuis le backend
        const myEvents = [
            {name: 'My Event 1', date: '2024-09-01', description: 'My Description 1'},
            {name: 'My Event 2', date: '2024-09-15', description: 'My Description 2'},
            // etc.
        ];
        myEvents.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.classList.add('card', 'col-md-4');
            eventElement.innerHTML = `<h3>${event.name}</h3><p>${event.date}</p><p>${event.description}</p>`;
            myEventsList.appendChild(eventElement);
        });
    }

    const eventId = new URLSearchParams(window.location.search).get('id');
    if (eventId && document.getElementById('event-name')) {
        fetch(`http://localhost:3000/events/${eventId}`)
            .then(response => response.json())
            .then(eventDetails => {
                const dateOptions = {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                };
                const formattedDate = new Intl.DateTimeFormat('fr-FR', dateOptions).format(new Date(eventDetails.date));
                const randomImage = getRandomImage();

                document.getElementById('event-name').textContent = eventDetails.name;
                document.getElementById('event-date').textContent = formattedDate;
                document.getElementById('event-location').textContent = eventDetails.location;
                document.getElementById('event-description').textContent = eventDetails.description;
                const eventImage = document.getElementById('event-image');
                eventImage.src = randomImage;
                eventImage.classList.add('event-img', 'card-img-top');

                const qrCodeUrl = `http://localhost:3000/event/join/?eventId=${eventId}`;
                new QRCode(document.getElementById('qrcode'), qrCodeUrl);

                fetch(`http://localhost:3000/users/${eventDetails.hostId}`)
                    .then(response => response.json())
                    .then(user => {
                        document.getElementById('organizer-name').textContent = user.name;
                    })
                    .catch(error => console.error('Error loading user details:', error));

                const shareButton = document.getElementById('share-button');
                const shareNotification = document.getElementById('share-notification');
                const eventUrl = `${window.location.origin}/event.html?id=${eventId}`;

                shareButton.addEventListener('click', () => {
                    navigator.clipboard.writeText(eventUrl).then(() => {
                        shareNotification.style.display = 'block';
                        setTimeout(() => {
                            shareNotification.style.display = 'none';
                        }, 2000);
                    }).catch(err => {
                        console.error('Could not copy text: ', err);
                    });
                });

                document.getElementById('share-facebook').addEventListener('click', () => {
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`, '_blank');
                });

                document.getElementById('share-twitter').addEventListener('click', () => {
                    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(eventUrl)}&text=${encodeURIComponent(eventDetails.name)}`, '_blank');
                });

                document.getElementById('share-linkedin').addEventListener('click', () => {
                    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(eventUrl)}&title=${encodeURIComponent(eventDetails.name)}`, '_blank');
                });
            })
            .catch(error => console.error('Error loading event details:', error));
    }
      // Fonction pour charger les événements statiques passés
      function loadStaticPastEvents() {
        const historyEventsList = document.getElementById('history-events-list');
        if (historyEventsList) {
            // Données statiques des événements passés
            const pastEvents = [
                {
                    name: 'Événement Passé 1',
                    date: '2023-06-15T18:00:00',
                    location: 'Paris, France',
                    description: 'Description de l\'événement passé 1.',
                    image: './img/event1.jpg'
                },
                {
                    name: 'Événement Passé 2',
                    date: '2023-07-20T18:00:00',
                    location: 'Lyon, France',
                    description: 'Description de l\'événement passé 2.',
                    image: './img/event2.jpg'
                },
                {
                    name: 'Événement Passé 3',
                    date: '2023-08-25T18:00:00',
                    location: 'Marseille, France',
                    description: 'Description de l\'événement passé 3.',
                    image: './img/event3.jpg'
                }
            ];

            pastEvents.forEach(event => {
                const formattedDate = new Intl.DateTimeFormat('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }).format(new Date(event.date));

                const eventElement = document.createElement('div');
                eventElement.classList.add('col-md-4', 'mb-4');
                eventElement.innerHTML = `
                    <div class="card h-100">
                        <img src="${event.image}" class="card-img-top" alt="Image de l'événement">
                        <div class="card-body">
                            <h5 class="card-title">${event.name}</h5>
                            <p class="card-text"><i class="fas fa-calendar-alt"></i> ${formattedDate}</p>
                            <p class="card-text"><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                            <p class="card-text">${event.description}</p>
                        </div>
                    </div>`;
                historyEventsList.appendChild(eventElement);
            });
        }
    }

    // Appel de la fonction pour charger les événements statiques passés si on est sur la page d'historique
    if (document.getElementById('history-events-list')) {
        loadStaticPastEvents();
    }


});

const imagePool = [
    './img/event1.jpeg',
    './img/event1.jpg',
    './img/event2.jpg',
    './img/event3.jpg',
    './img/event4.webp',
];

function getRandomImage() {
    const randomIndex = Math.floor(Math.random() * imagePool.length);
    return imagePool[randomIndex];
}
