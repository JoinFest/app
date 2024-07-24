// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const ctaButton = document.querySelector('.cta-button');
    
    ctaButton.addEventListener('click', () => {
        alert('Redirection vers la page des événements.');
        // Redirection vers une autre page ou section
    });
    
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
    const bannerText = document.querySelector(".banner-text");

    window.addEventListener("scroll", function() {
        const offset = window.scrollY;
        bannerText.style.transform = "translateY(" + offset * 0.5 + "px)";
    });

    const profileForm = document.getElementById("profile-form");

    profileForm.addEventListener("submit", function(event) {
        event.preventDefault();
        alert("Informations du profil mises à jour !");
    });
});
