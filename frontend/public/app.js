document.addEventListener('DOMContentLoaded', () => {
    // Fonction pour charger un fichier HTML et l'insérer dans un élément
    function loadHTML(elementId, filePath) {
        fetch(filePath)
            .then(response => response.text())
            .then(data => {
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

    function checkAuth() {
        const token = localStorage.getItem('jwt');
        if (!token) {
            window.location.href = 'login.html';
        }
        return token;
    }


    const createEventForm = document.getElementById('create-event-form');
    if (createEventForm) {
        createEventForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const token = checkAuth();

            const eventName = document.getElementById('event-name').value;
            const eventDate = document.getElementById('event-date').value;
            const eventLocation = document.getElementById('event-location').value;
            const eventDescription = document.getElementById('event-description').value;

            fetch('http://localhost:3000/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: eventName,
                    date: eventDate,
                    location: eventLocation,
                    description: eventDescription
                })
            })
                .then(response => {
                    if (response.ok) {
                        alert('Événement créé avec succès');
                        window.location.href = 'index.html';
                    } else {
                        alert('Erreur lors de la création de l\'événement');
                    }
                })
                .catch(error => console.error('Error:', error));
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
                        alert('Login failed. Please check your email and password.');
                    }
                })
                .catch(error => console.error('Error:', error));
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;

            fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name, email, password})
            })
                .then(response => response.json())
                .then(data => {
                    if (data.id) {
                        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
                        window.location.href = 'login.html';
                    } else {
                        console.error('Inscription échouée:', data);
                        alert('Inscription échouée. Veuillez réessayer.');
                    }
                })
                .catch(error => console.error('Error:', error));
        });
    }

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


    const myEventsList = document.getElementById('my-events-list');
    if (myEventsList) {
        const token = checkAuth();

        fetch('http://localhost:3000/events/my-events', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(events => {
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
                        </div>
                    </div>`;
                    myEventsList.appendChild(eventElement);

                    document.querySelectorAll('.clickable-card').forEach(card => {
                        card.addEventListener('click', () => {
                            const eventId = card.getAttribute('data-id');
                            window.location.href = `event.html?id=${eventId}`;
                        });
                    });
                });
            })
            .catch(error => console.error('Error:', error));
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

    async function searchEvents(name, date, location) {
        const searchResults = document.getElementById('search-results');
        searchResults.innerHTML = ''; // Clear previous results

        const response = await fetch('http://localhost:3000/events');
        const events = await response.json();

        const filteredEvents = events.filter(event => {
            return (!name || event.name.toLowerCase().includes(name.toLowerCase())) &&
                (!date || event.date === date) &&
                (!location || event.location.toLowerCase().includes(location.toLowerCase()));
        });

        const dateOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };

        filteredEvents.forEach(event => {
            const formattedDate = new Intl.DateTimeFormat('fr-FR', dateOptions).format(new Date(event.date));
            const randomImage = getRandomImage();

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
                        </div>
                    </div>`;
            searchResults.appendChild(eventElement);

            document.querySelectorAll('.clickable-card').forEach(card => {
                card.addEventListener('click', () => {
                    const eventId = card.getAttribute('data-id');
                    window.location.href = `event.html?id=${eventId}`;
                });
            });
        });
    }

    // Gestion du formulaire de recherche
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('search-name').value;
            const date = document.getElementById('search-date').value;
            const location = document.getElementById('search-location').value;
            searchEvents(name, date, location);
        });
    }

    // Fonction pour charger les utilisateurs
    function loadUsers() {
        const usersList = document.getElementById('users-list');
        if (usersList) {
            fetch('http://localhost:3000/users')
                .then(response => response.json())
                .then(users => {
                    users.forEach(user => {
                        const userElement = document.createElement('div');
                        userElement.classList.add('col-md-4', 'mb-4');
                        userElement.innerHTML = `
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${user.name}</h5>
                            <p class="card-text"><i class="fas fa-envelope"></i> ${user.email}</p>
                            <p class="card-text"><i class="fas fa-user-tag"></i> ${user.name}</p>
                            <button class="btn btn-primary">Modifier</button>
                            <button class="btn btn-danger">Supprimer</button>
                        </div>
                    </div>`;
                        usersList.appendChild(userElement);
                    });
                });
        }
    }

    // Appel de la fonction pour charger les utilisateurs si on est sur la page de gestion des utilisateurs
    if (document.getElementById('users-list')) {
        loadUsers();
    }
});

const imagePool = [
    './img/event-1.png',
    './img/event-2.png',
    './img/event-3.png',
    './img/event-4.png',
    './img/event-5.png',
    './img/event-6.jpg',
    './img/event-7.png',
];

function getRandomImage() {
    const randomIndex = Math.floor(Math.random() * imagePool.length);
    return imagePool[randomIndex];
}
