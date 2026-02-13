// ============================================
// GESTION DES MANCHES - ADMIN
// ============================================

let allManches = [];

document.addEventListener('DOMContentLoaded', async () => {
    // Authentification facultative (Mode ouvert)
    // const user = getUser();
    // if (!user || user.role !== 'admin') window.location.href = '/login.html';
    const user = getUser() || { prenom: 'Admin', nom: 'Public', role: 'admin' };

    // Charger les manches
    await loadManches();

    // Gestionnaire pour créer une manche
    document.getElementById('btnCreateManche')?.addEventListener('click', openCreateMancheModal);
});

/**
 * Charger toutes les manches
 */
async function loadManches() {
    try {
        const response = await apiRequest('/manches');
        allManches = response.data;

        displayManches(allManches);

    } catch (error) {
        console.error('Erreur lors du chargement des manches:', error);
        showError('errorMessage', 'Impossible de charger les manches');
    }
}

/**
 * Afficher les manches
 */
function displayManches(manches) {
    const container = document.getElementById('manchesContainer');
    container.innerHTML = '';

    if (manches.length === 0) {
        container.innerHTML = '<p class="text-center">Aucune manche créée</p>';
        return;
    }

    // Grouper par type
    const grouped = {
        preliminaire: [],
        quart: [],
        demi: [],
        finale: []
    };

    manches.forEach(manche => {
        if (grouped[manche.type]) {
            grouped[manche.type].push(manche);
        }
    });

    // Afficher par catégorie
    Object.keys(grouped).forEach(type => {
        if (grouped[type].length > 0) {
            const section = document.createElement('div');
            section.className = 'manche-section';

            section.innerHTML = `<h3>${getTypeLabel(type)}</h3>`;

            grouped[type].forEach(manche => {
                const card = createMancheCard(manche);
                section.appendChild(card);
            });

            container.appendChild(section);
        }
    });
}

/**
 * Créer une carte de manche
 */
function createMancheCard(manche) {
    const card = document.createElement('div');
    card.className = `manche-card status-${manche.statut}`;

    const statutBadge = getStatutBadge(manche.statut);
    const dateFormatted = new Date(manche.date_manche).toLocaleDateString('fr-FR');

    card.innerHTML = `
        <div class="manche-header">
            <h4>${manche.nom}</h4>
            ${statutBadge}
        </div>
        <div class="manche-body">
            <p><i class="fas fa-calendar"></i> ${dateFormatted}</p>
            <p><i class="fas fa-clock"></i> ${manche.heure_debut || 'Non défini'} - ${manche.heure_fin || 'Non défini'}</p>
            ${manche.description ? `<p class="manche-description">${manche.description}</p>` : ''}
        </div>
        <div class="manche-actions">
            <button class="btn btn-sm btn-primary" onclick="viewManche(${manche.id})" title="Voir détails">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn-sm btn-info" onclick="manageRubriques(${manche.id})" title="Rubriques">
                <i class="fas fa-list"></i>
            </button>
            <button class="btn btn-sm btn-${getStatutButtonClass(manche.statut)}" onclick="changeStatut(${manche.id}, '${getNextStatut(manche.statut)}')" title="Changer statut">
                ${getStatutButtonLabel(manche.statut)}
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteManche(${manche.id})" title="Supprimer">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    return card;
}

/**
 * Voir les détails d'une manche
 */
async function viewManche(id) {
    try {
        const response = await apiRequest(`/manches/${id}`);
        const manche = response.data;

        let rubriquesHTML = '<p>Aucune rubrique associée</p>';

        if (manche.rubriques && manche.rubriques.length > 0) {
            rubriquesHTML = '<ol>';
            manche.rubriques.forEach(rubrique => {
                rubriquesHTML += `<li>${rubrique.nom} (${rubrique.points_max} pts)</li>`;
            });
            rubriquesHTML += '</ol>';
        }

        showModal(`Manche: ${manche.nom}`, `
            <div class="manche-details">
                <p><strong>Type:</strong> ${getTypeLabel(manche.type)}</p>
                <p><strong>Date:</strong> ${new Date(manche.date_manche).toLocaleDateString('fr-FR')}</p>
                <p><strong>Horaire:</strong> ${manche.heure_debut || 'Non défini'} - ${manche.heure_fin || 'Non défini'}</p>
                <p><strong>Statut:</strong> ${getStatutLabel(manche.statut)}</p>
                ${manche.description ? `<p><strong>Description:</strong> ${manche.description}</p>` : ''}
                <h4>Rubriques</h4>
                ${rubriquesHTML}
            </div>
        `);

    } catch (error) {
        console.error('Erreur:', error);
        showError('errorMessage', 'Impossible de charger les détails');
    }
}

/**
 * Gérer les rubriques d'une manche
 */
function manageRubriques(id) {
    window.location.href = `/admin/manage-rubriques.html?mancheId=${id}`;
}

/**
 * Changer le statut d'une manche
 */
async function changeStatut(id, newStatut) {
    if (!confirm(`Changer le statut vers "${getStatutLabel(newStatut)}" ?`)) {
        return;
    }

    try {
        await apiRequest(`/manches/${id}/statut`, {
            method: 'PUT',
            body: JSON.stringify({ statut: newStatut })
        });

        showSuccess('successMessage', 'Statut mis à jour');
        await loadManches();

    } catch (error) {
        console.error('Erreur:', error);
        showError('errorMessage', 'Impossible de changer le statut');
    }
}

/**
 * Ouvrir le modal de création de manche
 */
function openCreateMancheModal() {
    window.location.href = '/admin/create-manche.html';
}

// Fonctions utilitaires
function getTypeLabel(type) {
    const labels = {
        preliminaire: 'Manches Préliminaires',
        quart: 'Quarts de Finale',
        demi: 'Demi-Finales',
        finale: 'Finale'
    };
    return labels[type] || type;
}

function getStatutLabel(statut) {
    const labels = {
        brouillon: 'Brouillon',
        publie: 'Publiée',
        en_cours: 'En cours',
        termine: 'Terminée'
    };
    return labels[statut] || statut;
}

function getStatutBadge(statut) {
    const classes = {
        brouillon: 'secondary',
        publie: 'info',
        en_cours: 'warning',
        termine: 'success'
    };
    return `<span class="badge badge-${classes[statut]}">${getStatutLabel(statut)}</span>`;
}

function getStatutButtonClass(statut) {
    return statut === 'brouillon' ? 'success' : statut === 'publie' ? 'warning' : 'secondary';
}

function getStatutButtonLabel(statut) {
    if (statut === 'brouillon') return 'Publier';
    if (statut === 'publie') return 'Démarrer';
    if (statut === 'en_cours') return 'Terminer';
    return 'Archiver';
}

function getNextStatut(currentStatut) {
    const flow = {
        brouillon: 'publie',
        publie: 'en_cours',
        en_cours: 'termine',
        termine: 'termine'
    };
    return flow[currentStatut] || currentStatut;
}

function showModal(title, content) {
    alert(`${title}\n\n${content}`);
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

/**
 * Supprimer une manche
 */
async function deleteManche(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette manche ? Cette action est irréversible et supprimera tous les scores associés.')) {
        return;
    }

    try {
        await apiRequest(`/manches/${id}`, {
            method: 'DELETE'
        });

        showSuccess('successMessage', 'Manche supprimée avec succès');
        await loadManches();

    } catch (error) {
        console.error('Erreur:', error);
        showError('errorMessage', 'Impossible de supprimer la manche');
    }
}
