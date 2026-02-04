// ============================================
// PAGE INSCRIPTION - AL ILM 2026
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const inscriptionForm = document.getElementById('inscriptionForm');
    
    inscriptionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            nom: document.getElementById('nom').value,
            prenom: document.getElementById('prenom').value,
            email: document.getElementById('email').value || null,
            telephone: document.getElementById('telephone').value,
            etablissement: document.getElementById('etablissement').value,
            niveau_coranique: document.getElementById('niveau_coranique').value || null,
            connaissance_hadiths: document.getElementById('connaissance_hadiths').value || null,
            memorisation_sourate: document.getElementById('memorisation_sourate').value || null
        };
        
        try {
            const response = await apiRequest('/participants', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            
            if (response.success) {
                showSuccess('successMessage', 
                    '✅ Inscription réussie ! Vous serez bientôt affecté(e) à une équipe.');
                
                // Réinitialiser le formulaire
                inscriptionForm.reset();
                
                // Rediriger après 3 secondes
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 3000);
            }
        } catch (error) {
            showError('errorMessage', error.message || 'Erreur lors de l\'inscription');
        }
    });
});
