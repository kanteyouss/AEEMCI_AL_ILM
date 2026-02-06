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
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Une erreur est survenue');
        }
        
        return data;
    } catch (error) {
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
