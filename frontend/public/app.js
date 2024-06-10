document.addEventListener('DOMContentLoaded', async () => {
    const content = document.getElementById('content');
    content.innerHTML = '<p>Loading...</p>';

    try {
        const response = await fetch('/api/events');
        const events = await response.json();
        content.innerHTML = `<p>${events.length} events loaded.</p>`;
    } catch (error) {
        content.innerHTML = `<p>Error loading events: ${error.message}</p>`;
    }
});
