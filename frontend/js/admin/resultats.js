// ============================================
// GESTION DES RÉSULTATS - AL ILM 2026
// ============================================

let manchesParEtape = [];
let classement = [];
let notationsData = {};

// ============================================
// INITIALISATION
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🏆 Initialisation page résultats');
    
    // Vérifier l'authentification
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }
    
    // Charger les données utilisateur
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    document.getElementById('userName').textContent = user.prenom || 'Admin';
    
    // Event listeners
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Charger les données
    await loadAllData();
});

// ============================================
// CHARGEMENT DES DONNÉES
// ============================================

async function loadAllData() {
    try {
        showNotification('📊 Chargement des données...', 'info');
        
        // Charger les manches groupées par étape
        const manchesRes = await apiRequest('/manches/par-etape');
        manchesParEtape = manchesRes.data || [];
        
        // Charger les notations pour chaque manche
        for (const etape of manchesParEtape) {
            for (const manche of etape.manches) {
                const notations = await apiRequest(`/notation/manche/${manche.id}`);
                notationsData[manche.id] = notations.data || [];
            }
        }
        
        // Charger la configuration d'affichage public
        await chargerConfiguration();
        
        // Afficher les données
        displayEtapes();
        
        showNotification('✅ Données chargées', 'success');
        
    } catch (error) {
        console.error('❌ Erreur chargement:', error);
        showNotification('❌ Erreur de chargement', 'error');
    }
}

// ============================================
// AFFICHAGE STATISTIQUES
// ============================================

function displayStats() {
    const totalEquipes = classement.length;
    const totalManches = manches.length;
    
    let totalNotations = 0;
    let notationsCompletes = 0;
    
    Object.values(notationsData).forEach(notations => {
        totalNotations += notations.length;
    });
    
    // Calculer les notations attendues (nombre d'équipes × manches × rubriques)
    const rubriquesParManche = 9; // AL ILM a 9 rubriques
    const notationsAttendues = totalEquipes * totalManches * rubriquesParManche;
    const completionPercent = notationsAttendues > 0 ? (totalNotations / notationsAttendues * 100) : 0;
    
    // Mettre à jour la barre de progression
    document.getElementById('progressFill').style.width = `${completionPercent}%`;
    document.getElementById('progressPercent').textContent = `${Math.round(completionPercent)}%`;
    document.getElementById('progressText').textContent = `${totalNotations}/${notationsAttendues} notations`;
    
    // Afficher les stats
    const container = document.getElementById('statsSummary');
    container.innerHTML = `
        <div class="stat-box">
            <div class="value">${totalEquipes}</div>
            <div class="label">Équipes</div>
        </div>
        <div class="stat-box">
            <div class="value">${totalManches}</div>
            <div class="label">Manches</div>
        </div>
        <div class="stat-box">
            <div class="value">${totalNotations}</div>
            <div class="label">Notations</div>
        </div>
        <div class="stat-box">
            <div class="value">${Math.round(completionPercent)}%</div>
            <div class="label">Complété</div>
        </div>
    `;
}

// ============================================
// AFFICHAGE MANCHES
// ============================================

// ============================================
// AFFICHAGE DES ÉTAPES
// ============================================

function displayEtapes() {
    const container = document.getElementById('etapesContainer');
    
    if (!container) {
        console.error('Container etapesContainer introuvable');
        return;
    }
    
    if (manchesParEtape.length === 0) {
        container.innerHTML = `
            <p style="color: #6b7280; text-align: center; padding: 2rem;">
                Aucune manche créée. Allez dans le Dashboard pour créer des manches.
            </p>
        `;
        return;
    }
    
    const etapeIcons = {
        preliminaire: '🎯',
        quart: '⚡',
        demi: '🔥',
        finale: '👑'
    };
    
    container.innerHTML = manchesParEtape.map(etape => {
        const totalManches = etape.manches.length;
        let totalNotations = 0;
        
        etape.manches.forEach(manche => {
            const notations = notationsData[manche.id] || [];
            totalNotations += notations.length;
        });
        
        // Une étape est considérée complète si elle a au moins une notation
        const isEtapeComplete = totalNotations > 0;
        const icon = etapeIcons[etape.code] || '📋';
        
        return `
            <section style="margin-bottom: 3rem;">
                <h2 style="margin-bottom: 1.5rem;">${icon} ${etape.nom}</h2>
                
                <!-- Manches de l'étape -->
                <div class="results-grid">
                    ${etape.manches.map(manche => {
                        const notations = notationsData[manche.id] || [];
                        const equipes = manche.nombre_equipes || 0;
                        const rubriques = manche.nombre_rubriques || 0;
                        const notationsAttendues = equipes * rubriques;
                        const isMancheComplete = notations.length >= notationsAttendues && notationsAttendues > 0;
                        
                        return `
                            <div class="result-card">
                                <h3>
                                    <span>📅</span>
                                    Manche ${manche.numero}
                                </h3>
                                <p style="color: #6b7280; font-size: 0.9rem; margin: 0.5rem 0;">
                                    ${new Date(manche.date_manche).toLocaleDateString('fr-FR', { 
                                        weekday: 'long', 
                                        day: 'numeric', 
                                        month: 'long', 
                                        year: 'numeric' 
                                    })}
                                </p>
                                
                                <div class="verification-list" style="margin: 1rem 0;">
                                    <div class="verification-item ${manche.nombre_equipes > 0 ? 'ok' : 'error'}">
                                        ${manche.nombre_equipes || 0} équipe(s) inscrites
                                    </div>
                                    <div class="verification-item ${manche.nombre_rubriques > 0 ? 'ok' : 'error'}">
                                        ${manche.nombre_rubriques || 0} rubrique(s) configurées
                                    </div>
                                    <div class="verification-item ${isMancheComplete ? 'ok' : 'error'}">
                                        ${notations.length}/${notationsAttendues} notations
                                    </div>
                                </div>
                                
                                <div class="actions-grid">
                                    <button class="btn-publish btn-preview" onclick="previewManche(${manche.id})">
                                        👁️ Voir Classement
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <!-- Classement cumulé de l'étape -->
                <div class="result-card" style="margin-top: 1.5rem; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);">
                    <h3>
                        <span>📊</span>
                        Classement ${etape.nom}
                    </h3>
                    <p style="color: #6b7280; margin-bottom: 1rem;">
                        Résultat cumulé des ${totalManches} manche(s) de cette étape
                    </p>
                    
                    <div class="verification-list" style="margin: 1rem 0;">
                        <div class="verification-item ${totalNotations > 0 ? 'ok' : 'error'}">
                            ${totalNotations} notation(s) enregistrée(s)
                        </div>
                        <div class="verification-item ${isEtapeComplete ? 'ok' : 'warning'}">
                            ${isEtapeComplete ? 'Étape complète' : 'Notations en cours'}
                        </div>
                    </div>
                    
                    <div class="actions-grid">
                        <button class="btn-publish btn-preview" onclick="previewEtape('${etape.code}')">
                            👁️ Prévisualiser Classement
                        </button>
                        <button class="btn-publish" onclick="publierEtape('${etape.code}')" ${!isEtapeComplete ? 'disabled' : ''}>
                            🌐 Publier ${etape.nom}
                        </button>
                        <button class="btn-publish btn-export" onclick="exportEtape('${etape.code}')">
                            📊 Exporter Excel
                        </button>
                    </div>
                    
                    <div id="preview-${etape.code}" style="display: none; margin-top: 1.5rem;"></div>
                </div>
            </section>
        `;
    }).join('');
}

// ============================================
// FONCTIONS DE PRÉVISUALISATION ET PUBLICATION
// ============================================

async function previewManche(mancheId) {
    try {
        const response = await apiRequest(`/classement/manche/${mancheId}`);
        const classement = response.classement || [];
        
        showClassementModal(`Manche ${mancheId}`, classement);
    } catch (error) {
        console.error('Erreur prévisualisation manche:', error);
        showNotification('❌ Erreur lors de la prévisualisation', 'error');
    }
}

async function previewEtape(etapeCode) {
    try {
        const response = await apiRequest(`/classement/etape/${etapeCode}`);
        const classement = response.classement || [];
        
        const etapeNom = manchesParEtape.find(e => e.code === etapeCode)?.nom || etapeCode;
        showClassementModal(etapeNom, classement);
    } catch (error) {
        console.error('Erreur prévisualisation étape:', error);
        showNotification('❌ Erreur lors de la prévisualisation', 'error');
    }
}

function showClassementModal(titre, classement) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 2rem;
    `;
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 12px; max-width: 800px; width: 100%; max-height: 80vh; overflow-y: auto; padding: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2 style="margin: 0;">📊 ${titre}</h2>
                <button onclick="this.closest('div[style*=fixed]').remove()" style="background: none; border: none; font-size: 2rem; cursor: pointer;">&times;</button>
            </div>
            
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: var(--primary-color); color: white;">
                        <th style="padding: 0.75rem; text-align: center;">Rang</th>
                        <th style="padding: 0.75rem; text-align: left;">Équipe</th>
                        <th style="padding: 0.75rem; text-align: center;">Score</th>
                        <th style="padding: 0.75rem; text-align: center;">Manches</th>
                        <th style="padding: 0.75rem; text-align: center;">Moyenne</th>
                    </tr>
                </thead>
                <tbody>
                    ${classement.map((equipe, index) => {
                        // Gérer les différents formats d'API (manche vs étape)
                        const equipeNom = equipe.nom_equipe || equipe.equipe || 'Équipe inconnue';
                        const score = equipe.score_total || equipe.points_totaux || 0;
                        const scoreNum = parseFloat(score) || 0;
                        const nombreManches = equipe.nombre_manches || 1;
                        
                        const position = index + 1;
                        const moyenne = nombreManches > 0 
                            ? (scoreNum / nombreManches).toFixed(1)
                            : '0.0';
                        const bgColor = position <= 3 ? 
                            (position === 1 ? '#fef3c7' : position === 2 ? '#e5e7eb' : '#fed7aa') 
                            : 'white';
                        
                        return `
                            <tr style="background: ${bgColor}; border-bottom: 1px solid #e5e7eb;">
                                <td style="padding: 0.75rem; text-align: center; font-weight: bold; font-size: 1.2rem;">
                                    ${position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : position}
                                </td>
                                <td style="padding: 0.75rem;">
                                    <strong>${equipeNom}</strong>
                                </td>
                                <td style="padding: 0.75rem; text-align: center; font-weight: bold; font-size: 1.1rem; color: var(--primary-color);">
                                    ${scoreNum.toFixed(1)}
                                </td>
                                <td style="padding: 0.75rem; text-align: center;">
                                    ${nombreManches}
                                </td>
                                <td style="padding: 0.75rem; text-align: center;">
                                    ${moyenne}
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    document.body.appendChild(modal);
}

async function publierEtape(etapeCode) {
    const etapeNom = manchesParEtape.find(e => e.code === etapeCode)?.nom || etapeCode;
    
    if (!confirm(`Voulez-vous publier les résultats de "${etapeNom}" sur la page publique ?`)) {
        return;
    }
    
    try {
        // Mettre à jour la config pour afficher cette étape
        await apiRequest('/classement-config/batch', {
            method: 'PUT',
            body: JSON.stringify({
                classement_publie: true,
                etape_publiee: etapeCode,
                derniere_publication: new Date().toISOString()
            })
        });
        
        showNotification(`✅ ${etapeNom} publiée !`, 'success');
    } catch (error) {
        console.error('Erreur publication:', error);
        showNotification('❌ Erreur lors de la publication', 'error');
    }
}

async function exportEtape(etapeCode) {
    showNotification('📊 Export en développement...', 'info');
}

function displayManches() {
    // Fonction supprimée - remplacée par displayEtapes()
}

function getMancheIcon(type) {
    const icons = {
        'preliminaire': '🎯',
        'quart': '⚡',
        'demi': '🔥',
        'finale': '👑'
    };
    return icons[type] || '📅';
}

function displayClassementStatus() {
    // Fonction supprimée - intégrée dans displayEtapes()
}

function displayFinalVerification() {
    // Fonction supprimée
}

// ============================================
// PRÉVISUALISATION DES RÉSULTATS
// ============================================

async function previewManche(mancheId) {
    try {
        const response = await apiRequest(`/classement/manche/${mancheId}`);
        const results = response.data || [];
        
        if (results.length === 0) {
            showNotification('⚠️ Aucun résultat pour cette manche', 'error');
            return;
        }
        
        // Trouver le nom de la manche
        let mancheName = `Manche ${mancheId}`;
        for (const etape of manchesParEtape) {
            const manche = etape.manches.find(m => m.id === mancheId);
            if (manche) {
                mancheName = `Manche ${manche.numero} - ${manche.nom || ''}`;
                break;
            }
        }
        
        showClassementModal(
            `📊 Résultats - ${mancheName}`,
            results
        );
        
    } catch (error) {
        console.error('❌ Erreur:', error);
        showNotification('❌ Erreur de chargement', 'error');
    }
}

// ============================================
// EXPORT
// ============================================

async function exportManche(mancheId) {
    showNotification(`ℹ️ Export en développement - Manche ${mancheId}`, 'info');
}

async function exportEtape(etapeCode) {
    showNotification(`ℹ️ Export en développement - Étape ${etapeCode}`, 'info');
}

// ============================================
// UTILITAIRES
// ============================================

async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
        }
    };
    
    const response = await fetch(`/api${endpoint}`, config);
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur API');
    }
    
    return response.json();
}

function showModal(title, message, onConfirm) {
    const modal = document.getElementById('confirmModal');
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').innerHTML = message;
    
    const confirmBtn = document.getElementById('modalConfirm');
    confirmBtn.onclick = onConfirm || (() => closeModal());
    
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('confirmModal').classList.remove('active');
}

function showNotification(message, type = 'info') {
    // Supprimer les anciennes notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
}

// ============================================
// CONFIGURATION AFFICHAGE PUBLIC
// ============================================

// ...existing code...
async function chargerConfiguration() {
    try {
        const response = await apiRequest('/classement-config');
        const config = response.data;
        
        // Remplir les champs avec les valeurs actuelles
        document.getElementById('configAfficherPodium').checked = config.afficher_podium || false;
        document.getElementById('configAfficherStatistiques').checked = config.afficher_statistiques || false;
        document.getElementById('configAfficherFiltres').checked = config.afficher_filtres || false;
        document.getElementById('configAfficherClassementComplet').checked = config.afficher_classement_complet || false;
        
        // Messages personnalisés par phase
        if (document.getElementById('configMessagePreliminaire'))
            document.getElementById('configMessagePreliminaire').value = config.message_preliminaire || '';
        if (document.getElementById('configMessageQuart'))
            document.getElementById('configMessageQuart').value = config.message_quart || '';
        if (document.getElementById('configMessageDemi'))
            document.getElementById('configMessageDemi').value = config.message_demi || '';
        if (document.getElementById('configMessageFinale'))
            document.getElementById('configMessageFinale').value = config.message_finale || '';

        // Configurations des phases
        if(document.getElementById('configAfficherPhasePreliminaire')) 
            document.getElementById('configAfficherPhasePreliminaire').checked = config.afficher_phase_preliminaire !== false;
        if(document.getElementById('configAfficherPhaseQuart'))
            document.getElementById('configAfficherPhaseQuart').checked = config.afficher_phase_quart !== false;
        if(document.getElementById('configAfficherPhaseDemi'))
            document.getElementById('configAfficherPhaseDemi').checked = config.afficher_phase_demi !== false;
        if(document.getElementById('configAfficherPhaseFinale'))
            document.getElementById('configAfficherPhaseFinale').checked = config.afficher_phase_finale !== false;
        
        // Configurations de la navigation
        if(document.getElementById('configAfficherNavCalendrier'))
            document.getElementById('configAfficherNavCalendrier').checked = config.afficher_nav_calendrier !== false;
        if(document.getElementById('configAfficherNavClassement'))
            document.getElementById('configAfficherNavClassement').checked = config.afficher_nav_classement !== false;
        if(document.getElementById('configAfficherNavInscription'))
            document.getElementById('configAfficherNavInscription').checked = config.afficher_nav_inscription !== false;
        if(document.getElementById('configAfficherNavConnexion'))
            document.getElementById('configAfficherNavConnexion').checked = config.afficher_nav_connexion !== false;

        console.log('✅ Configuration chargée:', config);
    } catch (error) {
        console.error('❌ Erreur chargement configuration:', error);
        showNotification('Erreur lors du chargement de la configuration', 'error');
    }
}

async function sauvegarderConfiguration() {
    try {
        showNotification('💾 Sauvegarde de la configuration...', 'info');
        
        // Récupérer les valeurs des champs
        const config = {
            afficher_podium: document.getElementById('configAfficherPodium').checked,
            afficher_statistiques: document.getElementById('configAfficherStatistiques').checked,
            afficher_filtres: document.getElementById('configAfficherFiltres').checked,
            afficher_classement_complet: document.getElementById('configAfficherClassementComplet').checked,
            
            // Messages personnalisés par phase
            message_preliminaire: document.getElementById('configMessagePreliminaire').value.trim(),
            message_quart: document.getElementById('configMessageQuart').value.trim(),
            message_demi: document.getElementById('configMessageDemi').value.trim(),
            message_finale: document.getElementById('configMessageFinale').value.trim(),

            // Nouvelles configs de phases
            afficher_phase_preliminaire: document.getElementById('configAfficherPhasePreliminaire').checked,
            afficher_phase_quart: document.getElementById('configAfficherPhaseQuart').checked,
            afficher_phase_demi: document.getElementById('configAfficherPhaseDemi').checked,
            afficher_phase_finale: document.getElementById('configAfficherPhaseFinale').checked,

            // Nouvelles configs de navigation
            afficher_nav_calendrier: document.getElementById('configAfficherNavCalendrier').checked,
            afficher_nav_classement: document.getElementById('configAfficherNavClassement').checked,
            afficher_nav_inscription: document.getElementById('configAfficherNavInscription').checked,
            afficher_nav_connexion: document.getElementById('configAfficherNavConnexion').checked
        };
        
        // Envoyer au serveur
        const response = await apiRequest('/classement-config/batch', {
            method: 'PUT',
            body: JSON.stringify(config)
        });
        
        if (response.success) {
            showNotification('✅ Configuration sauvegardée avec succès', 'success');
            console.log('✅ Configuration mise à jour:', config);
        } else {
            throw new Error(response.message || 'Erreur lors de la sauvegarde');
        }
    } catch (error) {
        console.error('❌ Erreur sauvegarde configuration:', error);
        showNotification('❌ Erreur lors de la sauvegarde: ' + error.message, 'error');
    }
}
