// ============================================
// PAGE CONNEXION - AL ILM 2026
// ============================================

console.log('✅ Script login.js chargé');

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM chargé, initialisation du formulaire...');
    
    const adminForm = document.getElementById('adminForm');
    const equipeForm = document.getElementById('equipeForm');
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    console.log('📋 Formulaires trouvés:', { 
        adminForm: !!adminForm, 
        equipeForm: !!equipeForm,
        tabButtons: tabButtons.length 
    });
    
    // Gestion des onglets
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            console.log('🔄 Changement d\'onglet:', tab);
            
            // Activer l'onglet
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Afficher le bon formulaire
            adminForm.classList.toggle('active', tab === 'admin');
            equipeForm.classList.toggle('active', tab === 'equipe');
        });
    });
    
    // Connexion Admin/Jury
    adminForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('🚀 Soumission du formulaire admin...');
        
        const email = document.getElementById('adminEmail').value.trim();
        const password = document.getElementById('adminPassword').value.trim();
        
        console.log('📧 Email:', email);
        console.log('🔐 Password:', JSON.stringify(password));
        console.log('🔐 Password length:', password.length);
        console.log('🔐 Password chars:', password.split('').map((c, i) => `[${i}]='${c}'`).join(' '));
        
        try {
            console.log('📡 Envoi de la requête API...');
            const response = await apiRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            
            console.log('✅ Réponse reçue:', response);
            
            if (response.success) {
                console.log('✅ Connexion réussie !');
                setAuthToken(response.data.token);
                setUser(response.data.user);
                
                // Rediriger selon le rôle
                if (response.data.user.role === 'admin') {
                    console.log('➡️ Redirection vers dashboard admin');
                    window.location.href = '/admin/dashboard.html';
                } else {
                    console.log('➡️ Redirection vers interface jury');
                    window.location.href = '/jeu/jury.html';
                }
            }
        } catch (error) {
            console.error('❌ Erreur de connexion:', error);
            showError('errorMessage', error.message || 'Email ou mot de passe incorrect');
        }
    });
    
    // Connexion Équipe
    equipeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const code_acces = document.getElementById('codeAcces').value;
        
        try {
            const response = await apiRequest('/auth/login-equipe', {
                method: 'POST',
                body: JSON.stringify({ code_acces })
            });
            
            if (response.success) {
                setAuthToken(response.data.token);
                setUser({ ...response.data.equipe, type: 'equipe' });
                
                window.location.href = '/equipe/dashboard.html';
            }
        } catch (error) {
            showError('errorMessage', error.message || 'Code d\'accès invalide');
        }
    });
});

/**
 * Afficher un message d'erreur
 */
function showError(elementId, message) {
    console.error('🚨 Erreur affichée:', message);
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Masquer après 5 secondes
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }
}
