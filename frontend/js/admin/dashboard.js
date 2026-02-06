// ============================================
// DASHBOARD ADMIN - AL ILM 2026
// ============================================

console.log('✅ Dashboard admin chargé');

document.addEventListener('DOMContentLoaded', async () => {
    console.log('✅ DOM chargé, initialisation...');
    
    // Vérifier l'authentification
    const user = getUser();
    console.log('👤 Utilisateur:', user);
    
    if (!user || user.role !== 'admin') {
        console.log('❌ Non autorisé, redirection vers login');
        window.location.href = '/login.html';
        return;
    }
    
    // Afficher les informations de l'admin
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = `${user.prenom} ${user.nom}`;
        console.log('✅ Nom affiché:', userNameElement.textContent);
    }
    
    // Gestion de la navigation entre sections
    initNavigation();
    
    // Bouton déconnexion
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            clearAuthToken();
            window.location.href = '/login.html';
        });
    }
    
    // Bouton import CSV
    const importCSVBtn = document.getElementById('importCSVBtn');
    if (importCSVBtn) {
        importCSVBtn.addEventListener('click', () => {
            console.log('📥 Ouverture du dialog d\'import CSV');
            openCSVImportDialog();
        });
    }
    
    // Charger les statistiques
    await loadStatistics();
    
    console.log('✅ Dashboard initialisé');
});

/**
 * Initialiser la navigation entre sections
 */
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    
    console.log('📋 Navigation items:', navItems.length);
    console.log('📋 Sections:', sections.length);
    
    navItems.forEach(item => {
        // Ignorer les liens externes (equipes.html)
        if (item.getAttribute('href') && item.getAttribute('href') !== '#') {
            console.log('⏭️ Lien externe ignoré:', item.getAttribute('href'));
            return;
        }
        
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetSection = item.dataset.section;
            console.log('🔄 Navigation vers:', targetSection);
            
            // Retirer la classe active de tous les items
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Activer l'item et la section ciblés
            item.classList.add('active');
            const section = document.getElementById(targetSection);
            if (section) {
                section.classList.add('active');
                console.log('✅ Section affichée:', targetSection);
                
                // Mettre à jour l'URL avec le hash
                window.location.hash = targetSection;
                
                // Charger les données de la section
                loadSectionData(targetSection);
            } else {
                console.error('❌ Section non trouvée:', targetSection);
            }
        });
    });
    
    // Détecter le hash dans l'URL au chargement
    const hash = window.location.hash.substring(1); // Enlever le #
    if (hash) {
        console.log('🔗 Hash détecté dans l\'URL:', hash);
        const targetSection = document.getElementById(hash);
        const targetNavItem = document.querySelector(`[data-section="${hash}"]`);
        
        if (targetSection && targetNavItem) {
            // Désactiver toutes les sections et nav items
            sections.forEach(section => section.classList.remove('active'));
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Activer la section ciblée
            targetSection.classList.add('active');
            targetNavItem.classList.add('active');
            
            console.log('✅ Section activée depuis hash:', hash);
            loadSectionData(hash);
        }
    }
}

/**
 * Charger les données d'une section
 */
async function loadSectionData(section) {
    console.log('📊 Chargement des données pour:', section);
    
    switch(section) {
        case 'participants':
            await loadParticipants();
            break;
        case 'equipes':
            await loadEquipes();
            break;
        case 'manches':
            await loadManches();
            break;
        case 'questions':
            await loadQuestions();
            break;
    }
}

/**
 * Charger les statistiques du dashboard
 */
async function loadStatistics() {
    console.log('📊 Chargement des statistiques...');
    try {
        // Récupérer le nombre de participants
        const participantsResponse = await apiRequest('/participants');
        const nbParticipants = participantsResponse.data ? participantsResponse.data.length : 0;
        
        // Récupérer le nombre d'équipes
        const equipesResponse = await apiRequest('/equipes');
        const nbEquipes = equipesResponse.data ? equipesResponse.data.length : 0;
        
        // Récupérer le nombre de manches
        const manchesResponse = await apiRequest('/manches');
        const nbManches = manchesResponse.data ? manchesResponse.data.length : 0;
        
        // Récupérer le nombre de questions
        const questionsResponse = await apiRequest('/questions');
        const nbQuestions = questionsResponse.data ? questionsResponse.data.length : 0;
        
        // Afficher les statistiques
        const totalParticipants = document.getElementById('totalParticipants');
        const totalEquipes = document.getElementById('totalEquipes');
        const totalManches = document.getElementById('totalManches');
        const totalQuestions = document.getElementById('totalQuestions');
        
        if (totalParticipants) totalParticipants.textContent = nbParticipants;
        if (totalEquipes) totalEquipes.textContent = nbEquipes;
        if (totalManches) totalManches.textContent = nbManches;
        if (totalQuestions) totalQuestions.textContent = nbQuestions;
        
        console.log('✅ Statistiques chargées:', { nbParticipants, nbEquipes, nbManches, nbQuestions });
        
    } catch (error) {
        console.error('❌ Erreur lors du chargement des statistiques:', error);
    }
}

/**
 * Charger la liste des participants
 */
async function loadParticipants() {
    console.log('👥 Chargement des participants...');
    try {
        const response = await apiRequest('/participants');
        console.log('✅ Participants chargés:', response.data.length);
        // TODO: Afficher dans le tableau
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

/**
 * Charger la liste des équipes
 */
async function loadEquipes() {
    console.log('🎯 Chargement des équipes...');
    try {
        const response = await apiRequest('/equipes');
        console.log('✅ Équipes chargées:', response.data.length);
        // TODO: Afficher dans le tableau
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

/**
 * Charger la liste des manches
 */
async function loadManches() {
    console.log('📅 Chargement des manches...');
    try {
        const response = await apiRequest('/manches');
        console.log('✅ Manches chargées:', response.data.length);
        console.log('📋 Détails des manches:', response.data);
        
        // Charger les manches créées
        await loadCreatedManches();
        
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

/**
 * Charger la liste des questions
 */
async function loadQuestions() {
    console.log('❓ Chargement des questions...');
    try {
        const response = await apiRequest('/questions');
        console.log('✅ Questions chargées:', response.data.length);
        // TODO: Afficher dans le tableau
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

/**
 * Charger le classement
 */
async function loadClassement() {
    console.log('🏆 Chargement du classement...');
    try {
        // Charger les manches pour le filtre
        const manchesResponse = await apiRequest('/manches');
        const filterSelect = document.getElementById('filterMancheClassement');
        if (filterSelect && manchesResponse.data) {
            filterSelect.innerHTML = '<option value="">Toutes les manches (Classement général)</option>';
            manchesResponse.data.forEach(manche => {
                const option = document.createElement('option');
                option.value = manche.id;
                option.textContent = `Manche ${manche.numero} - ${new Date(manche.date_debut).toLocaleDateString('fr-FR')}`;
                filterSelect.appendChild(option);
            });
            
            // Event listener pour le filtre
            filterSelect.addEventListener('change', () => loadClassement());
        }
        
        // Récupérer le filtre sélectionné
        const mancheId = filterSelect?.value || '';
        const queryParam = mancheId ? `?manche_id=${mancheId}` : '';
        
        const response = await apiRequest(`/classement/general${queryParam}`);
        console.log('✅ Classement chargé:', response);
        
        const container = document.getElementById('classementTable');
        if (!container) return;
        
        if (!response.classement || response.classement.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #718096;">
                    <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">📊 Aucune donnée de classement</p>
                    <p style="font-size: 0.9rem;">Les scores apparaîtront après la notation des équipes</p>
                </div>
            `;
            return;
        }
        
        // Créer le tableau HTML
        container.innerHTML = `
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <thead>
                        <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                            <th style="padding: 1rem; text-align: center; font-weight: 600;">Rang</th>
                            <th style="padding: 1rem; text-align: left; font-weight: 600;">Équipe</th>
                            <th style="padding: 1rem; text-align: center; font-weight: 600;">Manches</th>
                            <th style="padding: 1rem; text-align: center; font-weight: 600;">Participants</th>
                            <th style="padding: 1rem; text-align: center; font-weight: 600;">Score Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${response.classement.map((equipe, index) => {
                            const isTop3 = index < 3;
                            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
                            const bgColor = index % 2 === 0 ? '#f9fafb' : 'white';
                            
                            return `
                                <tr style="background: ${bgColor}; border-bottom: 1px solid #e5e7eb;">
                                    <td style="padding: 1rem; text-align: center; font-size: ${isTop3 ? '1.5rem' : '1rem'}; font-weight: ${isTop3 ? 'bold' : 'normal'};">
                                        ${medal || equipe.rang}
                                    </td>
                                    <td style="padding: 1rem;">
                                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                                            <div style="width: 40px; height: 40px; background: ${equipe.couleur || '#667eea'}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.2rem;">
                                                ${equipe.symbole || equipe.nom_equipe.charAt(0)}
                                            </div>
                                            <span style="font-weight: 600; color: #2d3748;">${equipe.nom_equipe}</span>
                                        </div>
                                    </td>
                                    <td style="padding: 1rem; text-align: center; color: #4b5563;">
                                        ${equipe.nombre_manches || 0}
                                    </td>
                                    <td style="padding: 1rem; text-align: center; color: #4b5563;">
                                        ${equipe.nombre_participants || 0}
                                    </td>
                                    <td style="padding: 1rem; text-align: center;">
                                        <span style="font-size: 1.25rem; font-weight: bold; color: ${isTop3 ? '#10b981' : '#2d3748'};">
                                            ${parseFloat(equipe.score_total).toFixed(1)} pts
                                        </span>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
    } catch (error) {
        console.error('❌ Erreur:', error);
        const container = document.getElementById('classementTable');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #dc2626;">
                    <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">❌ Erreur de chargement</p>
                    <p style="font-size: 0.9rem;">${error.message}</p>
                </div>
            `;
        }
    }
}

/**
 * Charger les activités récentes
 */
async function loadRecentActivities() {
    try {
        // Récupérer les dernières inscriptions
        const participantsResponse = await apiRequest('/participants');
        const recentParticipants = participantsResponse.data
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5);
        
        // Afficher les activités
        const activitiesList = document.getElementById('recentActivities');
        activitiesList.innerHTML = '';
        
        recentParticipants.forEach(participant => {
            const li = document.createElement('li');
            li.className = 'activity-item';
            li.innerHTML = `
                <span class="activity-icon">👤</span>
                <div class="activity-content">
                    <strong>${participant.prenom} ${participant.nom}</strong>
                    <small>${participant.etablissement} - ${formatDate(participant.created_at)}</small>
                </div>
            `;
            activitiesList.appendChild(li);
        });
        
    } catch (error) {
        console.error('Erreur lors du chargement des activités:', error);
    }
}

/**
 * Créer des graphiques de statistiques
 */
function createCharts(participants, equipes) {
    // Répartition par établissement
    const esaticCount = participants.filter(p => p.etablissement === 'ESATIC').length;
    const emspCount = participants.filter(p => p.etablissement === 'EMSP').length;
    
    const etablissementChart = document.getElementById('etablissementChart');
    if (etablissementChart) {
        etablissementChart.innerHTML = `
            <div class="chart-bar">
                <div class="chart-label">ESATIC</div>
                <div class="chart-progress">
                    <div class="chart-fill" style="width: ${(esaticCount / participants.length) * 100}%"></div>
                </div>
                <div class="chart-value">${esaticCount}</div>
            </div>
            <div class="chart-bar">
                <div class="chart-label">EMSP</div>
                <div class="chart-progress">
                    <div class="chart-fill" style="width: ${(emspCount / participants.length) * 100}%"></div>
                </div>
                <div class="chart-value">${emspCount}</div>
            </div>
        `;
    }
}

/**
 * Formater une date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) {
        return `il y a ${minutes} min`;
    } else if (hours < 24) {
        return `il y a ${hours}h`;
    } else if (days < 7) {
        return `il y a ${days}j`;
    } else {
        return date.toLocaleDateString('fr-FR');
    }
}

/**
 * Navigation vers les différentes sections
 */
document.getElementById('btnParticipants')?.addEventListener('click', () => {
    window.location.href = '/admin/participants.html';
});

document.getElementById('btnEquipes')?.addEventListener('click', () => {
    window.location.href = '/admin/equipes.html';
});

document.getElementById('btnManches')?.addEventListener('click', () => {
    window.location.href = '/admin/manches.html';
});

document.getElementById('btnClassement')?.addEventListener('click', () => {
    window.location.href = '/admin/classement.html';
});

/**
 * Déconnexion
 */
document.getElementById('btnLogout')?.addEventListener('click', async () => {
    await logout();
});

/**
 * Ouvrir le dialog d'import CSV
 */
function openCSVImportDialog() {
    // Créer un input file temporaire
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv';
    fileInput.style.display = 'none';
    
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        console.log('📄 Fichier sélectionné:', file.name);
        await importCSVFile(file);
    });
    
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
}

/**
 * Importer un fichier CSV
 */
async function importCSVFile(file) {
    try {
        console.log('📤 Upload du fichier CSV...');
        
        // Créer un FormData pour envoyer le fichier
        const formData = new FormData();
        formData.append('file', file);
        
        // Envoyer le fichier au backend
        const response = await fetch(`${API_BASE_URL}/upload/participants`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: formData
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Erreur lors de l\'import');
        }
        
        console.log('✅ Import réussi:', result);
        
        // Afficher un message de succès
        alert(`✅ Import réussi !\n\n${result.data.success} participant(s) importé(s)\n${result.data.errors || 0} erreur(s)`);
        
        // Recharger les statistiques
        await loadStatistics();
        
        // Si on est sur la section participants, recharger la liste
        const activeSection = document.querySelector('.content-section.active');
        if (activeSection && activeSection.id === 'participants') {
            await loadParticipants();
        }
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'import CSV:', error);
        alert(`❌ Erreur lors de l'import :\n${error.message}`);
    }
}

// ============================================
// GESTION DES MANCHES
// ============================================

/**
 * Mapper les types de manche vers les noms
 */
const MANCHE_TYPES = {
    'preliminaire': 'Phase Préliminaire',
    'quart': 'Quart de Finale',
    'demi': 'Demi-Finale',
    'finale': 'Grande Finale'
};

/**
 * Variables globales pour la création de manche
 */
let rubriquesDisponibles = [];
let equipesDisponibles = [];
let currentMancheData = null;

/**
 * Initialiser les boutons de création de manches
 */
function initMancheCreation() {
    console.log('🔧 Initialisation des boutons de création de manches...');
    const createButtons = document.querySelectorAll('.btn-create-manche');
    console.log(`📊 Nombre de boutons trouvés: ${createButtons.length}`);
    
    createButtons.forEach((button, index) => {
        console.log(`📌 Bouton ${index + 1}: type=${button.dataset.type}, numero=${button.dataset.numero}`);
        button.addEventListener('click', async (e) => {
            console.log('🖱️ Clic sur bouton de création de manche');
            
            // Vérifier si le bouton est désactivé (manche déjà créée)
            if (button.disabled) {
                console.warn('⚠️ Ce bouton est désactivé (manche déjà créée)');
                alert('⚠️ Cette manche a déjà été créée. Utilisez le bouton "Modifier" dans la liste des manches créées.');
                return;
            }
            
            const type = button.dataset.type;
            const numero = button.dataset.numero;
            
            // Récupérer la carte parent pour obtenir les valeurs
            const card = button.closest('.manche-card');
            const dateInput = card.querySelector('input[type="date"]');
            const timeInput = card.querySelector('input[type="time"]');
            
            console.log(`📅 Date sélectionnée: ${dateInput.value}`);
            console.log(`🕐 Heure sélectionnée: ${timeInput.value}`);
            
            if (!dateInput.value) {
                alert('⚠️ Veuillez sélectionner une date pour cette manche.');
                return;
            }
            
            // Stocker les données de la manche
            currentMancheData = {
                type,
                numero,
                date: dateInput.value,
                time: timeInput.value,
                button
            };
            
            console.log('📦 Données de la manche stockées:', currentMancheData);
            
            // Charger les rubriques et ouvrir le modal
            await loadRubriquesAndShowModal();
        });
    });
    
    // Initialiser le modal
    console.log('🔧 Initialisation du modal des rubriques...');
    initRubriquesModal();
}

/**
 * Créer ou modifier une manche
 */
async function createManche(type, numero, date, time, button, rubriques = [], equipes = [], isEdit = false, mancheId = null, note = '') {
    try {
        console.log(`🎯 === DÉBUT ${isEdit ? 'MODIFICATION' : 'CRÉATION'} MANCHE ===`);
        console.log('📋 Paramètres reçus:', { type, numero, date, time, rubriques, equipes, isEdit, mancheId, note });
        
        // En mode création SEULEMENT, vérifier si la manche n'existe pas déjà
        if (!isEdit) {
            console.log('🔍 Mode CRÉATION détecté, vérification des doublons...');
            const existingResponse = await apiRequest('/manches');
            const existingManches = existingResponse.data || [];
            const mancheExists = existingManches.find(m => m.numero === parseInt(numero));
            
            if (mancheExists) {
                console.error(`❌ La manche ${numero} existe déjà (ID: ${mancheExists.id})`);
                showNotification('error', `La manche ${numero} existe déjà. Utilisez le bouton "Modifier" pour la mettre à jour.`);
                
                // Réactiver le bouton
                if (button) {
                    button.disabled = false;
                    button.textContent = 'Créer cette manche';
                }
                
                // Recharger pour désactiver le bouton
                await loadCreatedManches();
                return;
            }
            console.log('✅ Aucune manche existante, création autorisée');
        } else {
            console.log('✏️ Mode ÉDITION détecté, pas de vérification de doublon');
        }
        
        // Désactiver le bouton pendant l'opération
        if (button) {
            button.disabled = true;
            button.textContent = isEdit ? 'Modification en cours...' : 'Création en cours...';
            console.log('🔒 Bouton désactivé');
        }
        
        // Préparer les données de la manche
        const mancheData = {
            type,
            numero: parseInt(numero),
            nom: `Manche ${numero}`, // Nom par défaut
            date_manche: date,
            heure_debut: time,
            heure_fin: calculateEndTime(time), // +2h par défaut
            statut: isEdit ? undefined : 'brouillon', // Statut par défaut à la création
            rubriques: rubriques,
            equipes: equipes,
            note_bas_page: note
        };
        
        console.log('📦 Données prêtes à envoyer:', mancheData);
        
        // Envoyer la requête au backend
        let response;
        if (isEdit) {
            console.log(`🌐 Envoi de la requête PUT à /api/manches/${mancheId}...`);
            response = await apiRequest(`/manches/${mancheId}`, {
                method: 'PUT',
                body: JSON.stringify(mancheData)
            });
        } else {
            console.log('🌐 Envoi de la requête POST à /api/manches...');
            response = await apiRequest('/manches', {
                method: 'POST',
                body: JSON.stringify(mancheData)
            });
        }
        
        console.log('📡 Réponse du serveur:', response);
        console.log(`✅ Manche ${isEdit ? 'modifiée' : 'créée'} avec succès:`, response.data);
        
        // Mettre à jour le bouton (seulement en mode création)
        if (button && !isEdit) {
            button.classList.add('created');
            button.textContent = '✅ Créée';
            button.disabled = true;
            console.log('✅ Bouton mis à jour');
        }
        
        // Mettre à jour la liste des manches créées
        console.log('🔄 Rechargement de la liste des manches...');
        await loadCreatedManches();
        
        // Mettre à jour les statistiques
        console.log('📊 Mise à jour des statistiques...');
        await loadStatistics();
        
        // Afficher un message de succès
        const actionText = isEdit ? 'modifiée' : 'créée';
        showNotification('success', `Manche ${numero} ${actionText} avec ${rubriques.length} rubrique(s) !`);
        
        console.log(`🎯 === FIN ${isEdit ? 'MODIFICATION' : 'CRÉATION'} MANCHE - SUCCÈS ===`);
        
    } catch (error) {
        const isEdit = currentMancheData && currentMancheData.isEdit;
        console.error(`❌ === ERREUR ${isEdit ? 'MODIFICATION' : 'CRÉATION'} MANCHE ===`);
        console.error('📋 Type d\'erreur:', error.name);
        console.error('💬 Message:', error.message);
        console.error('📚 Stack:', error.stack);
        console.error('📦 Objet erreur complet:', error);
        
        // Réactiver le bouton
        if (button) {
            button.disabled = false;
            button.textContent = isEdit ? 'Modifier' : 'Créer cette manche';
            console.log('🔓 Bouton réactivé');
        }
        
        // Afficher un message d'erreur
        const actionText = isEdit ? 'modification' : 'création';
        showNotification('error', error.message || `Erreur lors de la ${actionText} de la manche`);
        
        console.log(`❌ === FIN ${isEdit ? 'MODIFICATION' : 'CRÉATION'} MANCHE - ÉCHEC ===`);
    }
}

/**
 * Calculer l'heure de fin (2h après le début)
 */
function calculateEndTime(startTime) {
    const [hours, minutes] = startTime.split(':');
    const endHours = (parseInt(hours) + 1) % 24; // +1 heure au lieu de +2
    return `${endHours.toString().padStart(2, '0')}:${minutes}`;
}

/**
 * Obtenir le jour en fonction du numéro de manche
 */
function getJourByNumero(numero) {
    const numInt = parseInt(numero);
    if (numInt <= 3) return numInt; // Préliminaire Jour 1-3
    if (numInt <= 6) return numInt - 3; // Quart Jour 1-3
    if (numInt <= 8) return numInt - 6; // Demi Jour 1-2
    return 1; // Finale Jour 1
}

/**
 * Charger la liste des manches créées
 */
async function loadCreatedManches() {
    try {
        console.log('🔄 Chargement des manches créées...');
        const response = await apiRequest('/manches');
        const manches = response.data || [];
        
        console.log('📅 Manches créées:', manches.length);
        console.log('📋 Données complètes:', manches);
        
        // Afficher dans le div manchesCreees
        const manchesCreees = document.getElementById('manchesCreees');
        if (!manchesCreees) {
            console.error('❌ Élément manchesCreees non trouvé !');
            return;
        }
        
        if (manches.length === 0) {
            manchesCreees.innerHTML = '<p style="text-align: center; color: #718096;">Aucune manche créée pour le moment</p>';
            console.log('ℹ️ Aucune manche à afficher');
            return;
        }
        
        // Trier par numéro de manche
        manches.sort((a, b) => (a.numero || 0) - (b.numero || 0));
        
        // Générer le HTML
        manchesCreees.innerHTML = manches.map(manche => `
            <div class="manche-item">
                <div class="manche-item-info">
                    <h4>
                        <span class="manche-badge badge-${manche.type}">
                            Manche ${manche.numero || ''}
                        </span>
                        ${manche.nom}
                    </h4>
                    <p>
                        📅 ${formatMancheDate(manche.date_manche)} 
                        🕐 ${manche.heure_debut} - ${manche.heure_fin}
                    </p>
                    ${manche.rubriques && manche.rubriques.length > 0 ? `
                        <p style="margin-top: 0.5rem; color: var(--primary-color);">
                            📋 ${manche.rubriques.length} rubrique(s): 
                            ${manche.rubriques.map(r => r.nom).join(', ')}
                        </p>
                    ` : ''}
                </div>
                <div class="manche-item-actions">
                    <span class="manche-status status-${manche.statut || 'publie'}">
                        ${formatStatut(manche.statut || 'publie')}
                    </span>
                    <button class="btn btn-secondary btn-edit-manche" 
                            data-manche-id="${manche.id}"
                            data-manche-numero="${manche.numero}"
                            data-manche-type="${manche.type}">
                        ✏️ Modifier
                    </button>
                </div>
            </div>
        `).join('');
        
        console.log('✅ HTML généré pour les manches');
        
        // Attacher les événements aux boutons Modifier
        const editButtons = document.querySelectorAll('.btn-edit-manche');
        console.log(`🔧 Nombre de boutons Modifier trouvés: ${editButtons.length}`);
        
        editButtons.forEach((btn, index) => {
            console.log(`📌 Bouton ${index + 1}: mancheId=${btn.dataset.mancheId}`);
            btn.addEventListener('click', () => {
                console.log('🖱️ Clic sur bouton Modifier, mancheId:', btn.dataset.mancheId);
                editManche(btn.dataset.mancheId);
            });
        });
        
        // Marquer les boutons des manches déjà créées
        console.log('🔒 Désactivation des boutons pour les manches déjà créées...');
        manches.forEach(manche => {
            const numero = manche.numero;
            if (numero) {
                console.log(`🔍 Recherche du bouton pour la manche numéro ${numero}...`);
                const button = document.querySelector(`.btn-create-manche[data-numero="${numero}"]`);
                if (button) {
                    console.log(`✅ Bouton trouvé pour manche ${numero}, désactivation...`);
                    button.classList.add('created');
                    button.textContent = '✅ Créée';
                    button.disabled = true;
                } else {
                    console.warn(`⚠️ Bouton non trouvé pour la manche numéro ${numero}`);
                }
            }
        });
        console.log('✅ Désactivation des boutons terminée');
        
    } catch (error) {
        console.error('❌ Erreur lors du chargement des manches:', error);
    }
}

/**
 * Formater la date d'une manche
 */
function formatMancheDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
}

/**
 * Formater le statut d'une manche
 */
function formatStatut(statut) {
    const statuts = {
        'brouillon': 'Brouillon',
        'publie': 'Publiée',
        'en_cours': 'En cours',
        'termine': 'Terminée'
    };
    return statuts[statut] || statut;
}

/**
 * Modifier une manche existante
 */
async function editManche(mancheId) {
    try {
        console.log('✏️ Modification de la manche:', mancheId);
        
        // Récupérer les données de la manche
        const response = await apiRequest(`/manches/${mancheId}`);
        const manche = response.data;
        
        console.log('📋 Données de la manche:', manche);
        
        // Stocker les données pour la modification
        currentMancheData = {
            id: manche.id,
            type: manche.type,
            numero: manche.numero,
            date: manche.date_manche,
            time: manche.heure_debut,
            isEdit: true, // Mode édition
            existingRubriques: manche.rubriques ? manche.rubriques.map(r => r.id) : [],
            existingEquipes: manche.equipes ? manche.equipes.map(e => e.id) : [],
            note: manche.note_bas_page
        };
        
        console.log('📦 Données de la manche stockées:', currentMancheData);
        
        // Charger les rubriques et afficher le modal
        await loadRubriquesAndShowModal();
        
    } catch (error) {
        console.error('❌ Erreur lors de la récupération de la manche:', error);
        alert('Erreur lors de la récupération de la manche: ' + error.message);
    }
}

/**
 * Afficher une notification
 */
function showNotification(type, message) {
    // Simple alert pour le moment, peut être amélioré avec un système de toast
    if (type === 'success') {
        alert('✅ ' + message);
    } else {
        alert('❌ ' + message);
    }
}

// ============================================
// MODAL SÉLECTION RUBRIQUES
// ============================================

/**
 * Initialiser le modal de sélection des rubriques
 */
function initRubriquesModal() {
    const modal = document.getElementById('rubriquesModal');
    const closeBtn = document.querySelector('.modal-close');
    const cancelBtn = document.getElementById('btnCancelRubriques');
    const confirmBtn = document.getElementById('btnConfirmRubriques');
    const deleteBtn = document.getElementById('btnDeleteManche');
    
    // Fermer le modal
    const closeModal = () => {
        modal.classList.remove('show');
        modal.style.display = 'none'; // Retirer le style inline
        currentMancheData = null;
    };
    
    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);
    
    // Fermer en cliquant à l'extérieur
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Supprimer la manche
    deleteBtn?.addEventListener('click', async () => {
        if (!currentMancheData || !currentMancheData.id) {
            console.error('❌ Impossible de supprimer : pas de manche sélectionnée');
            return;
        }
        
        const mancheId = currentMancheData.id;
        const mancheNumero = currentMancheData.numero;
        
        // Demander confirmation
        const confirmDelete = confirm(`⚠️ Êtes-vous sûr de vouloir supprimer la Manche ${mancheNumero} ?\n\nCette action est irréversible.`);
        
        if (!confirmDelete) {
            console.log('❌ Suppression annulée par l\'utilisateur');
            return;
        }
        
        try {
            console.log('🗑️ Suppression de la manche:', mancheId);
            
            // Fermer le modal
            closeModal();
            
            // Envoyer la requête de suppression
            await apiRequest(`/manches/${mancheId}`, {
                method: 'DELETE'
            });
            
            console.log('✅ Manche supprimée avec succès');
            
            // Recharger la liste des manches
            await loadCreatedManches();
            await loadStatistics();
            
            showNotification('success', `Manche ${mancheNumero} supprimée avec succès`);
            
        } catch (error) {
            console.error('❌ Erreur lors de la suppression:', error);
            showNotification('error', error.message || 'Erreur lors de la suppression de la manche');
        }
    });
    
    // Confirmer la sélection
    confirmBtn?.addEventListener('click', async () => {
        console.log('✅ Clic sur le bouton Confirmer');
        const selectedRubriques = getSelectedRubriques();
        
        console.log(`📋 Rubriques sélectionnées: ${selectedRubriques.length}`, selectedRubriques);
        
        if (selectedRubriques.length === 0) {
            console.warn('⚠️ Aucune rubrique sélectionnée');
            alert('⚠️ Veuillez sélectionner au moins une rubrique.');
            return;
        }
        
        // IMPORTANT: Sauvegarder currentMancheData AVANT de fermer le modal
        // car closeModal() réinitialise currentMancheData à null
        const mancheData = currentMancheData;
        
        if (!mancheData) {
            console.error('❌ currentMancheData est null !');
            return;
        }
        
        // En mode édition, récupérer les nouvelles valeurs de date/heure
        let finalDate = mancheData.date;
        let finalTime = mancheData.time;
        
        if (mancheData.isEdit) {
            const editDateInput = document.getElementById('editDateInput');
            const editTimeInput = document.getElementById('editTimeInput');
            
            if (editDateInput.value) {
                finalDate = editDateInput.value;
            }
            if (editTimeInput.value) {
                finalTime = editTimeInput.value;
            }
            
            console.log('📅 Nouvelles valeurs de date/heure:', { finalDate, finalTime });
        }
        
        // Fermer le modal
        console.log('🚪 Fermeture du modal');
        closeModal();
        
        // Récupérer les équipes sélectionnées
        const selectedEquipes = getSelectedEquipes();
        console.log(`👥 ${selectedEquipes.length} équipe(s) sélectionnée(s):`, selectedEquipes);
        
        // Récupérer la note
        const noteInput = document.getElementById('mancheNoteInput');
        const note = noteInput ? noteInput.value : '';

        // Créer ou modifier la manche avec les rubriques et équipes sélectionnées
        console.log(`🎯 Appel de createManche (mode: ${mancheData.isEdit ? 'édition' : 'création'})`);
        await createManche(
            mancheData.type,
            mancheData.numero,
            finalDate,
            finalTime,
            mancheData.button || null, // null en mode édition
            selectedRubriques,
            selectedEquipes, // Ajouter les équipes sélectionnées
            mancheData.isEdit, // Passer le mode explicitement
            mancheData.id, // Passer l'ID explicitement
            note // Passer la note
        );
    });
}

/**
 * Charger les rubriques et afficher le modal
 */
async function loadRubriquesAndShowModal() {
    try {
        console.log('🔄 Chargement des rubriques pour le modal...');
        
        // Charger les rubriques si ce n'est pas déjà fait
        if (rubriquesDisponibles.length === 0) {
            console.log('📡 Requête API pour récupérer les rubriques...');
            const response = await apiRequest('/rubriques');
            rubriquesDisponibles = response.data || [];
            console.log(`✅ ${rubriquesDisponibles.length} rubriques chargées:`, rubriquesDisponibles);
        } else {
            console.log(`ℹ️ ${rubriquesDisponibles.length} rubriques déjà en cache`);
        }
        
        // Charger les équipes si ce n'est pas déjà fait
        await loadEquipesIfNeeded();
        
        // Afficher le modal
        console.log('🎭 Affichage du modal...');
        showRubriquesModal();
        
    } catch (error) {
        console.error('❌ Erreur lors du chargement des rubriques:', error);
        console.error('📋 Détails de l\'erreur:', error.message, error.stack);
        alert('Erreur lors du chargement des rubriques: ' + error.message);
    }
}

/**
 * Charger les équipes si nécessaire
 */
async function loadEquipesIfNeeded() {
    if (equipesDisponibles.length === 0) {
        console.log('📡 Requête API pour récupérer les équipes...');
        const response = await apiRequest('/equipes');
        equipesDisponibles = response.data || [];
        console.log(`✅ ${equipesDisponibles.length} équipes chargées:`, equipesDisponibles);
    } else {
        console.log(`ℹ️ ${equipesDisponibles.length} équipes déjà en cache`);
    }
}

/**
 * Afficher le modal de sélection des rubriques
 */
function showRubriquesModal() {
    console.log('🎭 Fonction showRubriquesModal appelée');
    
    const modal = document.getElementById('rubriquesModal');
    const title = document.getElementById('mancheModalTitle');
    const selection = document.getElementById('rubriquesSelection');
    
    console.log('🔍 Éléments du modal:', {
        modal: modal ? 'trouvé' : 'NON TROUVÉ',
        title: title ? 'trouvé' : 'NON TROUVÉ',
        selection: selection ? 'trouvé' : 'NON TROUVÉ'
    });
    
    if (!currentMancheData) {
        console.error('❌ currentMancheData est null !');
        return;
    }
    
    console.log('📦 currentMancheData:', currentMancheData);
    
    // Mettre à jour le titre et les boutons
    const modeText = currentMancheData.isEdit ? 'Modifier' : 'Créer';
    title.textContent = `${modeText} Manche ${currentMancheData.numero} - ${MANCHE_TYPES[currentMancheData.type]}`;
    
    // Afficher/masquer la section de modification de date
    const editDateSection = document.getElementById('editDateSection');
    const editDateInput = document.getElementById('editDateInput');
    const editTimeInput = document.getElementById('editTimeInput');
    const deleteBtn = document.getElementById('btnDeleteManche');
    const confirmBtn = document.getElementById('btnConfirmRubriques');
    
    // Remplir le champ note s'il existe
    const noteInput = document.getElementById('mancheNoteInput');
    if (noteInput) {
        noteInput.value = currentMancheData.note || '';
    }

    if (currentMancheData.isEdit) {
        // Mode édition : afficher la section date/heure et le bouton supprimer
        editDateSection.style.display = 'block';
        editDateInput.value = currentMancheData.date;
        editTimeInput.value = currentMancheData.time;
        deleteBtn.style.display = 'inline-block';
        confirmBtn.textContent = '✅ Enregistrer les modifications';
    } else {
        // Mode création : masquer la section date/heure et le bouton supprimer
        editDateSection.style.display = 'none';
        deleteBtn.style.display = 'none';
        confirmBtn.textContent = 'Créer la manche';
    }
    
    console.log('📝 Titre du modal mis à jour, mode:', modeText);
    
    // Générer les checkboxes de rubriques
    console.log(`📋 Génération de ${rubriquesDisponibles.length} checkboxes...`);
    const existingRubriques = currentMancheData.existingRubriques || [];
    selection.innerHTML = rubriquesDisponibles.map(rubrique => {
        const isChecked = existingRubriques.includes(rubrique.id);
        return `
        <label class="rubrique-checkbox ${isChecked ? 'selected' : ''}" data-rubrique-id="${rubrique.id}">
            <input type="checkbox" value="${rubrique.id}" ${isChecked ? 'checked' : ''}>
            <div class="rubrique-info">
                <h4>${rubrique.nom}</h4>
                <p>${rubrique.description || ''}</p>
            </div>
            <div class="rubrique-meta">
                <span class="rubrique-badge badge-${rubrique.type}">
                    ${formatRubriqueType(rubrique.type)}
                </span>
                <span class="rubrique-points">${rubrique.points_max} pts</span>
            </div>
        </label>
        `;
    }).join('');
    
    console.log('✅ Checkboxes générées', existingRubriques.length > 0 ? `avec ${existingRubriques.length} pré-sélectionnées` : '');
    
    // Ajouter les événements de sélection
    const checkboxes = selection.querySelectorAll('input[type="checkbox"]');
    console.log(`🎯 Ajout des événements sur ${checkboxes.length} checkboxes`);
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateRubriqueSelection();
        });
    });
    
    // Afficher les équipes
    displayEquipesSelection();
    
    // Afficher le modal
    console.log('👁️ Affichage du modal (ajout classe show)');
    modal.classList.add('show');
    modal.style.display = 'flex'; // Force l'affichage
    console.log('📐 Style du modal:', window.getComputedStyle(modal).display);
    console.log('🎨 Classes du modal:', modal.className);
    
    // Réinitialiser le compteur
    updateSelectionCount();
    console.log('✅ Modal affiché avec succès');
}

/**
 * Afficher la sélection des équipes
 */
function displayEquipesSelection() {
    const equipesSelection = document.getElementById('equipesSelection');
    if (!equipesSelection) {
        console.error('❌ Element equipesSelection non trouvé');
        return;
    }
    
    const existingEquipes = currentMancheData.existingEquipes || [];
    console.log(`📋 Affichage de ${equipesDisponibles.length} équipes, ${existingEquipes.length} pré-sélectionnées`);
    
    // Créer les boutons "Tout sélectionner" / "Tout désélectionner"
    const selectionButtons = `
        <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
            <button type="button" onclick="selectAllEquipes(true)" class="btn-secondary" style="flex: 1; padding: 0.5rem; font-size: 0.9rem;">
                ✅ Toutes
            </button>
            <button type="button" onclick="selectAllEquipes(false)" class="btn-secondary" style="flex: 1; padding: 0.5rem; font-size: 0.9rem;">
                ❌ Aucune
            </button>
        </div>
    `;
    
    // Créer la grille d'équipes
    const equipesGrid = `
        <div class="equipes-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem; max-height: 300px; overflow-y: auto;">
            ${equipesDisponibles.map(equipe => {
                const isChecked = existingEquipes.includes(equipe.id);
                return `
                    <label class="equipe-checkbox ${isChecked ? 'selected' : ''}" 
                           style="display: flex; align-items: center; padding: 0.75rem; background: white; border: 2px solid ${isChecked ? 'var(--primary-color)' : '#e0e6ed'}; border-radius: 8px; cursor: pointer; transition: all 0.2s;">
                        <input type="checkbox" 
                               value="${equipe.id}" 
                               ${isChecked ? 'checked' : ''}
                               onchange="updateEquipeSelection()"
                               style="margin-right: 0.5rem;">
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: #1e293b;">${equipe.nom}</div>
                            ${equipe.couleur ? `<div style="font-size: 0.8rem; color: ${equipe.couleur};">●</div>` : ''}
                        </div>
                    </label>
                `;
            }).join('')}
        </div>
    `;
    
    equipesSelection.innerHTML = selectionButtons + equipesGrid;
}

/**
 * Mettre à jour l'apparence de la sélection
 */
function updateRubriqueSelection() {
    const labels = document.querySelectorAll('.rubrique-checkbox');
    
    labels.forEach(label => {
        const checkbox = label.querySelector('input[type="checkbox"]');
        if (checkbox.checked) {
            label.classList.add('selected');
        } else {
            label.classList.remove('selected');
        }
    });
    
    updateSelectionCount();
}

/**
 * Mettre à jour le compteur de rubriques sélectionnées
 */
function updateSelectionCount() {
    const selectedCount = document.getElementById('selectedCount');
    const count = getSelectedRubriques().length;
    
    if (selectedCount) {
        selectedCount.textContent = count;
    }
}

/**
 * Obtenir les IDs des rubriques sélectionnées
 */
function getSelectedRubriques() {
    const checkboxes = document.querySelectorAll('#rubriquesSelection input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => parseInt(cb.value));
}

/**
 * Formater le type de rubrique
 */
function formatRubriqueType(type) {
    const types = {
        'recitation': 'Récitation',
        'questions_ecrites': 'Questions écrites',
        'relais': 'Relais',
        'hadith': 'Hadith'
    };
    return types[type] || type;
}

/**
 * Mettre à jour l'apparence de la sélection d'équipes
 */
window.updateEquipeSelection = function() {
    const labels = document.querySelectorAll('.equipe-checkbox');
    
    labels.forEach(label => {
        const checkbox = label.querySelector('input[type="checkbox"]');
        if (checkbox.checked) {
            label.classList.add('selected');
            label.style.borderColor = 'var(--primary-color)';
            label.style.background = '#f0f9ff';
        } else {
            label.classList.remove('selected');
            label.style.borderColor = '#e0e6ed';
            label.style.background = 'white';
        }
    });
};

/**
 * Sélectionner toutes les équipes ou aucune
 */
window.selectAllEquipes = function(selectAll) {
    const checkboxes = document.querySelectorAll('.equipes-grid input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll;
    });
    updateEquipeSelection();
};

/**
 * Obtenir les IDs des équipes sélectionnées
 */
function getSelectedEquipes() {
    const checkboxes = document.querySelectorAll('.equipes-grid input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => parseInt(cb.value));
}

// Initialiser la gestion des manches au chargement
document.addEventListener('DOMContentLoaded', () => {
    console.log('📌 DOMContentLoaded - Initialisation différée des manches...');
    // Attendre un peu que le reste se charge
    setTimeout(() => {
        console.log('⏰ Timeout exécuté - Initialisation des manches maintenant');
        initMancheCreation();
        loadCreatedManches();
    }, 500);
});

