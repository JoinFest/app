// script.js

function buyTicket() {
    alert("Fonction d'achat de ticket à implémenter.");
}

function inviteFriends() {
    alert("Fonction d'invitation d'amis à implémenter.");
}

function showEventDetails(eventId) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `<h2>Détails de l'événement: ${eventId}</h2><p>Description de l'événement...</p>`;
    modal.style.display = 'block';
}

function viewProfile(friendId) {
    alert(`Afficher le profil pour l'ami: ${friendId}`);
}

function inviteToEvent(friendId) {
    alert(`Inviter l'ami: ${friendId} à un événement.`);
}

function showQrCode(eventId) {
    const qrCodeSection = document.getElementById('qrcode-section');
    const qrCodeDiv = document.getElementById('qrcode');

    qrCodeDiv.innerHTML = "";
    new QRCode(qrCodeDiv, {
        text: `Ticket pour l'événement: ${eventId}`,
        width: 128,
        height: 128
    });

    qrCodeSection.style.display = 'block';
}

function closeQrCode() {
    document.getElementById('qrcode-section').style.display = 'none';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function createEvent() {
    alert("Fonction de création d'événement à implémenter.");
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            if (action) {
                window[action](e.target.dataset.id);
            }
        });
    });
});
