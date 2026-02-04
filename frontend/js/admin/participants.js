// ============================================
// GESTION DES PARTICIPANTS - ADMIN
// ============================================

let allParticipants = [];
let currentFilter = 'tous';

document.addEventListener('DOMContentLoaded', async () => {
    // Vérifier l'authentification admin
    const user = getUser();
    
    if (!user || user.role !== 'admin') {
        window.location.href = '/login.html';
        return;
    }
    
    // Charger les participants
    await loadParticipants();
    
    // Gestionnaires d'événements
    setupEventListeners();
});

/**
 * Charger tous les participants
 */
async function loadParticipants(filter = null) {
    try {
        showLoader();
        
        let endpoint = '/participants';
        if (filter) {
            endpoint += `?${new URLSearchParams(filter)}`;
        }
        
        const response = await apiRequest(endpoint);
        allParticipants = response.data;
        
        displayParticipants(allParticipants);
        updateStatistics();
        
    } catch (error) {
        console.error('Erreur lors du chargement des participants:', error);
        showError('errorMessage', 'Impossible de charger les participants');
    } finally {
        hideLoader();
    }
}

/**
 * Afficher les participants dans le tableau
 */
function displayParticipants(participants) {
    const tbody = document.getElementById('participantsTableBody');
    tbody.innerHTML = '';
    
    if (participants.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Aucun participant trouvé</td></tr>';
        return;
    }
    
    participants.forEach(participant => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${participant.id}</td>
            <td>${participant.nom} ${participant.prenom}</td>
            <td>${participant.telephone}</td>
            <td><span class="badge badge-${participant.etablissement === 'ESATIC' ? 'primary' : 'info'}">${participant.etablissement}</span></td>
            <td>${participant.equipe_nom || '<span class="text-muted">Sans équipe</span>'}</td>
            <td><span class="badge badge-${participant.disponibilite ? 'success' : 'secondary'}">${participant.disponibilite ? 'Disponible' : 'Indisponible'}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewParticipant(${participant.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning" onclick="editParticipant(${participant.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteParticipant(${participant.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Mettre à jour les statistiques
 */
function updateStatistics() {
    const total = allParticipants.length;
    const esatic = allParticipants.filter(p => p.etablissement === 'ESATIC').length;
    const emsp = allParticipants.filter(p => p.etablissement === 'EMSP').length;
    const sansEquipe = allParticipants.filter(p => !p.equipe_id).length;
    
    document.getElementById('totalParticipants').textContent = total;
    document.getElementById('totalEsatic').textContent = esatic;
    document.getElementById('totalEmsp').textContent = emsp;
    document.getElementById('totalSansEquipe').textContent = sansEquipe;
}

/**
 * Filtrer les participants
 */
function filterParticipants(filter) {
    currentFilter = filter;
    
    let filtered = allParticipants;
    
    switch (filter) {
        case 'esatic':
            filtered = allParticipants.filter(p => p.etablissement === 'ESATIC');
            break;
        case 'emsp':
            filtered = allParticipants.filter(p => p.etablissement === 'EMSP');
            break;
        case 'sans_equipe':
            filtered = allParticipants.filter(p => !p.equipe_id);
            break;
        default:
            filtered = allParticipants;
    }
    
    displayParticipants(filtered);
}

/**
 * Rechercher un participant
 */
function searchParticipants(searchTerm) {
    const term = searchTerm.toLowerCase();
    
    const filtered = allParticipants.filter(p => 
        p.nom.toLowerCase().includes(term) ||
        p.prenom.toLowerCase().includes(term) ||
        p.telephone.includes(term) ||
        (p.email && p.email.toLowerCase().includes(term))
    );
    
    displayParticipants(filtered);
}

/**
 * Voir les détails d'un participant
 */
async function viewParticipant(id) {
    try {
        const response = await apiRequest(`/participants/${id}`);
        const participant = response.data;
        
        // Afficher un modal avec les détails
        showModal('Détails du participant', `
            <div class="participant-details">
                <p><strong>Nom complet:</strong> ${participant.prenom} ${participant.nom}</p>
                <p><strong>Email:</strong> ${participant.email || 'Non renseigné'}</p>
                <p><strong>Téléphone:</strong> ${participant.telephone}</p>
                <p><strong>Établissement:</strong> ${participant.etablissement}</p>
                <p><strong>Équipe:</strong> ${participant.equipe_nom || 'Sans équipe'}</p>
                <p><strong>Niveau coranique:</strong> ${participant.niveau_coranique || 'Non renseigné'}</p>
                <p><strong>Connaissance hadiths:</strong> ${participant.connaissance_hadiths || 'Non renseigné'}</p>
                <p><strong>Mémorisation sourate:</strong> ${participant.memorisation_sourate || 'Non renseigné'}</p>
                <p><strong>Date d'inscription:</strong> ${new Date(participant.created_at).toLocaleDateString('fr-FR')}</p>
            </div>
        `);
        
    } catch (error) {
        console.error('Erreur:', error);
        showError('errorMessage', 'Impossible de charger les détails');
    }
}

/**
 * Modifier un participant
 */
function editParticipant(id) {
    // Rediriger vers une page d'édition ou ouvrir un modal
    window.location.href = `/admin/edit-participant.html?id=${id}`;
}

/**
 * Supprimer un participant
 */
async function deleteParticipant(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce participant ?')) {
        return;
    }
    
    try {
        await apiRequest(`/participants/${id}`, { method: 'DELETE' });
        showSuccess('successMessage', 'Participant supprimé avec succès');
        await loadParticipants();
    } catch (error) {
        console.error('Erreur:', error);
        showError('errorMessage', 'Impossible de supprimer le participant');
    }
}

/**
 * Configurer les gestionnaires d'événements
 */
function setupEventListeners() {
    // Filtres
    document.getElementById('filterTous')?.addEventListener('click', () => filterParticipants('tous'));
    document.getElementById('filterEsatic')?.addEventListener('click', () => filterParticipants('esatic'));
    document.getElementById('filterEmsp')?.addEventListener('click', () => filterParticipants('emsp'));
    document.getElementById('filterSansEquipe')?.addEventListener('click', () => filterParticipants('sans_equipe'));
    
    // Recherche
    document.getElementById('searchInput')?.addEventListener('input', (e) => {
        searchParticipants(e.target.value);
    });
    
    // Bouton d'ajout
    document.getElementById('btnAddParticipant')?.addEventListener('click', () => {
        window.location.href = '/admin/add-participant.html';
    });
}

// Fonctions helpers
function showLoader() {
    // Afficher un loader
}

function hideLoader() {
    // Cacher le loader
}

function showModal(title, content) {
    // Afficher un modal
    alert(content);
}

function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.classList.add('success');
        setTimeout(() => element.textContent = '', 3000);
    }
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.classList.add('error');
        setTimeout(() => element.textContent = '', 3000);
    }
}
