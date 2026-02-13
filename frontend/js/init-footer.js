/**
 * Initialisation du footer dynamique
 */
function initFooter() {
    const footerRoot = document.getElementById('footer-root');
    if (!footerRoot) return;

    fetch('/components/footer.html')
        .then(response => {
            if (!response.ok) throw new Error('Erreur chargement footer');
            return response.text();
        })
        .then(html => {
            footerRoot.innerHTML = html;
        })
        .catch(error => {
            console.error('Erreur footer:', error);
        });
}

// Lancer au chargement
document.addEventListener('DOMContentLoaded', initFooter);
