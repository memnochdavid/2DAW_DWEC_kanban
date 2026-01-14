const appStatus = {
    lsElements : JSON.parse(localStorage.getItem('elements')) || []
}


// Función para cargar e insertar un fragmento de HTML
const includeHTML = (selector, url) => {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.text();
        })
        .then(data => {
            document.querySelector(selector).innerHTML = data;
        })
        .catch(error => {
            console.error('Error al cargar el HTML:', error);
            document.querySelector(selector).innerHTML = "<p>Error al cargar el contenido.</p>";
        });
};

// Cuando el DOM esté cargado, incluye el menú
document.addEventListener('DOMContentLoaded', () => {
    includeHTML('#sidebar', './includes/menu.html');
    // Podrías llamar a includeHTML para otros fragmentos también
    // includeHTML('#footer-container', './includes/footer.html');
});
