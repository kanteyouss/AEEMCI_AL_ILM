// ============================================
// API HELPER - AL ILM 2026
// ============================================

const API_BASE_URL = window.location.origin + '/api';

/**
 * Récupérer le token d'authentification
 */
function getAuthToken() {
    return localStorage.getItem('authToken');
}

/**
 * Sauvegarder le token d'authentification
 */
function setAuthToken(token) {
    localStorage.setItem('authToken', token);
}

/**
 * Supprimer le token d'authentification
 */
function clearAuthToken() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
}

/**
 * Sauvegarder les informations utilisateur
 */
function setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

/**
 * Récupérer les informations utilisateur
 */
function getUser() {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
}

/**
 * Effectuer une requête API
 */
async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Add cache busting for GET requests
    let url = `${API_BASE_URL}${endpoint}`;
    if (!options.method || options.method.toUpperCase() === 'GET') {
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}_t=${Date.now()}`;
    }

    const config = {
        ...options,
        headers
    };

    try {
        const response = await fetch(url, config);

        // Gérer le cas de session expirée (401 Unauthorized)
        if (response.status === 401) {
            console.warn('⚠️ Session expirée ou invalide (401)');
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Une erreur est survenue');
        }

        return data;
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('📡 Requête API annulée (Abort)');
            return null;
        }

        // Diagnostic automatique si erreur réseau
        if (error instanceof TypeError && error.message.includes('fetch')) {
            console.error('🚨 [NETWORK ERROR] Tentative de diagnostic...');
            try {
                const healthCheck = await fetch(`${window.location.origin}/api/health`).then(r => r.json());
                console.log('✅ Le serveur répond au health check:', healthCheck);
                console.warn('💡 Le serveur est en ligne, le problème vient probablement de la route spécifique ou de CORS.');
            } catch (e) {
                console.error('❌ Le serveur semble être HORS LIGNE (Health check échoué).');
            }
        }

        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Vérifier si l'utilisateur est authentifié
 */
async function checkAuth() {
    const token = getAuthToken();

    if (!token) {
        return false;
    }

    try {
        await apiRequest('/auth/verify');
        return true;
    } catch (error) {
        clearAuthToken();
        return false;
    }
}

/**
 * Se déconnecter
 */
async function logout() {
    try {
        await apiRequest('/auth/logout', { method: 'POST' });
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        clearAuthToken();
        window.location.href = '/login.html';
    }
}

/**
 * Afficher un message d'erreur
 */
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.classList.add('show');

        setTimeout(() => {
            element.classList.remove('show');
        }, 5000);
    }
}

/**
 * Afficher un message de succès
 */
function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.classList.add('show');

        setTimeout(() => {
            element.classList.remove('show');
        }, 5000);
    }
}

/**
 * Formater une date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}

/**
 * Formater une heure
 */
function formatTime(timeString) {
    if (!timeString) return '';
    return timeString.substring(0, 5); // HH:MM
}

/**
 * Appliquer la configuration de navigation globale
 * Cette fonction doit être appelée sur toutes les pages publiques
 */
/**
 * Appliquer la configuration de navigation globale
 * Cette fonction doit être appelée sur toutes les pages publiques
 */
async function applyGlobalNavConfig() {
    // 1. Essayer d'appliquer depuis le cache local (localStorage) immédiatement
    // Cela évite l'effet de "flash" où les menus apparaissent puis disparaissent
    const cachedConfig = localStorage.getItem('navConfig');
    if (cachedConfig) {
        try {
            applyNavVisibility(JSON.parse(cachedConfig));
        } catch (e) {
            console.error('Erreur lecture cache nav:', e);
        }
    }

    // 2. Récupérer la configuration fraîche depuis le serveur
    try {
        const response = await fetch(`${API_BASE_URL}/classement-config`);
        if (!response.ok) return;

        const result = await response.json();
        const config = result.data;

        // Mettre à jour le cache
        localStorage.setItem('navConfig', JSON.stringify(config));

        // Appliquer
        applyNavVisibility(config);

    } catch (error) {
        console.error('Erreur chargement config navigation:', error);
    }
}

/**
 * Fonction helper pour appliquer la visibilité (évite la duplication)
 */
function applyNavVisibility(config) {
    // Si une équipe est connectée, on ne touche pas à la navbar (gérée par init-navbar.js)
    try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user && user.type === 'equipe') return;
        }
    } catch (e) {
        // Ignorer erreur parsing
    }

    // Sélecteurs pour les liens de navigation (basés sur les attributs href standards)
    // On cible spécifiquement les liens dans la barre de navigation (.nav)
    const navLinks = {
        calendrier: document.querySelector('#alilm-nav a[href*="calendrier.html"]'),
        classement: document.querySelector('#alilm-nav a[href*="classement.html"]'),
        inscription: document.querySelector('#alilm-nav a[href*="inscription.html"]'),
        connexion: document.querySelector('#alilm-nav a[href*="login.html"]')
    };

    // Appliquer la visibilité
    if (navLinks.calendrier)
        navLinks.calendrier.style.display = (config.afficher_nav_calendrier !== false) ? '' : 'none';

    if (navLinks.classement)
        navLinks.classement.style.display = (config.afficher_nav_classement !== false) ? '' : 'none';

    if (navLinks.inscription)
        navLinks.inscription.style.display = (config.afficher_nav_inscription !== false) ? '' : 'none';

    if (navLinks.connexion)
        navLinks.connexion.style.display = (config.afficher_nav_connexion !== false) ? '' : 'none';
}

// Exécuter automatiquement au chargement du DOM si nous sommes sur une page publique
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyGlobalNavConfig);
} else {
    applyGlobalNavConfig();
}
