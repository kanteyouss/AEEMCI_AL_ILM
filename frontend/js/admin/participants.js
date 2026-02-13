// ============================================
// GESTION DES PARTICIPANTS - AL ILM 2026
// ============================================

let participants = [];
let filteredParticipants = [];

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initialisation page participants');

    // Authentification facultative
    // await checkAuth();
    // if (!getAuthToken()) window.location.href = '/login.html';
    const user = getUser() || { prenom: 'Admin', nom: 'Public', role: 'admin' };

    const userNameElement = document.getElementById('userName');
    const adminBadge = document.querySelector('.admin-badge');

    if (userNameElement) {
        const displayName = user.prenom ? `${user.prenom} ${user.nom}` : (user.nom || 'Utilisateur');
        userNameElement.textContent = displayName;
    }

    if (adminBadge && user.type === 'equipe') {
        adminBadge.textContent = 'Session Équipe';
        adminBadge.style.background = 'rgba(76, 175, 80, 0.1)';
        adminBadge.style.color = '#4caf50';
    }

    document.getElementById('logoutBtn').addEventListener('click', async () => {
        await logout();
    });

    const searchInput = document.getElementById('searchParticipant');
    const filterEtab = document.getElementById('filterEtablissement');
    const filterEq = document.getElementById('filterEquipe');
    const filterSx = document.getElementById('filterSexe');

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (filterEtab) filterEtab.addEventListener('change', applyFilters);
    if (filterEq) filterEq.addEventListener('change', applyFilters);
    if (filterSx) filterSx.addEventListener('change', applyFilters);

    console.log('📥 Chargement des participants...');
    await loadParticipants();
});

async function loadParticipants() {
    try {
        const result = await apiRequest('/participants');
        participants = result.data || [];
        filteredParticipants = participants;

        console.log(`✅ ${participants.length} participants chargés`);
        console.log('📊 Premiers participants:', participants.slice(0, 3));

        updateStatistics();
        renderParticipants();

    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

function updateStatistics() {
    const total = participants.length;
    const assignes = participants.filter(p => p.equipe_id).length;
    const libres = total - assignes;

    document.getElementById('totalParticipants').textContent = total;
    document.getElementById('participantsAssignes').textContent = assignes;
    document.getElementById('participantsLibres').textContent = libres;
}

function applyFilters() {
    const search = document.getElementById('searchParticipant').value.toLowerCase();
    const etablissement = document.getElementById('filterEtablissement').value;
    const equipe = document.getElementById('filterEquipe').value;
    const sexe = document.getElementById('filterSexe').value;

    filteredParticipants = participants.filter(p => {
        if (search && !(p.nom.toLowerCase().includes(search) || p.prenom.toLowerCase().includes(search))) {
            return false;
        }
        if (etablissement && p.etablissement !== etablissement) {
            return false;
        }
        if (equipe === 'assigne' && !p.equipe_id) {
            return false;
        }
        if (equipe === 'libre' && p.equipe_id) {
            return false;
        }
        if (sexe && p.genre !== sexe) {
            return false;
        }
        return true;
    });

    renderParticipants();
}

function renderParticipants() {
    const tbody = document.getElementById('participantsTableBody');

    if (filteredParticipants.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align: center; padding: 3rem; color: #718096;">
                    Aucun participant trouvé
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filteredParticipants.map(p => `
        <tr>
            <td>
                ${p.photo_url
            ? `<img src="${p.photo_url}" alt="${p.prenom}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">`
            : `<div style="width: 40px; height: 40px; border-radius: 50%; background: var(--primary-color); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                        ${p.prenom.charAt(0)}${p.nom.charAt(0)}
                    </div>`
        }
            </td>
            <td><strong>${p.nom}</strong></td>
            <td>${p.prenom}</td>
            <td>${p.genre || 'N/A'}</td>
            <td>${p.etablissement || 'N/A'}</td>
            <td>${p.telephone || 'N/A'}</td>
            <td>${p.email || 'N/A'}</td>
            <td>
                ${p.equipe_nom
            ? `<span style="background: var(--primary-color); color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem;">
                        ${p.equipe_nom}
                    </span>`
            : '<span style="color: #718096;">Non assigné</span>'
        }
            </td>
            <td>
                ${p.est_capitaine
            ? '<span style="color: #d97706; font-weight: 600;">Capitaine</span>'
            : p.equipe_id ? 'Membre' : '-'
        }
            </td>
            <td>
                <button onclick="viewParticipant(${p.id})" class="btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;" title="Voir détails">
                    Détails
                </button>
            </td>
        </tr>
    `).join('');
}

function viewParticipant(id) {
    const participant = participants.find(p => p.id === id);
    if (!participant) return;

    // Créer le modal
    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;';

    modal.innerHTML = `
        <div style="background: white; border-radius: 12px; padding: 2rem; max-width: 500px; width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 1rem;">
                <h3 style="margin: 0; color: var(--primary-color);">Détails du participant</h3>
                <button onclick="this.closest('[style*=fixed]').remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #718096;">&times;</button>
            </div>
            
            <div style="display: grid; gap: 1rem;">
                <div style="display: grid; grid-template-columns: 140px 1fr; gap: 0.5rem;">
                    <strong style="color: #4a5568;">Nom complet:</strong>
                    <span>${participant.prenom} ${participant.nom}</span>
                </div>
                
                <div style="display: grid; grid-template-columns: 140px 1fr; gap: 0.5rem;">
                    <strong style="color: #4a5568;">Genre:</strong>
                    <span>${participant.genre || 'Non renseigné'}</span>
                </div>
                
                <div style="display: grid; grid-template-columns: 140px 1fr; gap: 0.5rem;">
                    <strong style="color: #4a5568;">Établissement:</strong>
                    <span>${participant.etablissement || 'Non renseigné'}</span>
                </div>
                
                <div style="display: grid; grid-template-columns: 140px 1fr; gap: 0.5rem;">
                    <strong style="color: #4a5568;">Téléphone:</strong>
                    <span>${participant.telephone || 'Non renseigné'}</span>
                </div>
                
                <div style="display: grid; grid-template-columns: 140px 1fr; gap: 0.5rem;">
                    <strong style="color: #4a5568;">Email:</strong>
                    <span>${participant.email || 'Non renseigné'}</span>
                </div>
                
                <div style="height: 1px; background: #e2e8f0; margin: 0.5rem 0;"></div>
                
                <div style="display: grid; grid-template-columns: 140px 1fr; gap: 0.5rem;">
                    <strong style="color: #4a5568;">Équipe:</strong>
                    <span style="${participant.equipe_nom ? 'color: var(--primary-color); font-weight: 600;' : ''}">
                        ${participant.equipe_nom || 'Non assigné'}
                    </span>
                </div>
                
                <div style="display: grid; grid-template-columns: 140px 1fr; gap: 0.5rem;">
                    <strong style="color: #4a5568;">Rôle:</strong>
                    <span style="${participant.est_capitaine ? 'color: #d97706; font-weight: 600;' : ''}">
                        ${participant.est_capitaine ? 'Capitaine' : participant.equipe_id ? 'Membre' : 'Non assigné'}
                    </span>
                </div>
                
                <div style="height: 1px; background: #e2e8f0; margin: 0.5rem 0;"></div>
                
                <div style="display: grid; grid-template-columns: 140px 1fr; gap: 0.5rem;">
                    <strong style="color: #4a5568;">Niveau coranique:</strong>
                    <span>${participant.niveau_coranique || 'Non renseigné'}</span>
                </div>
                
                <div style="display: grid; grid-template-columns: 140px 1fr; gap: 0.5rem;">
                    <strong style="color: #4a5568;">Mémorisation:</strong>
                    <span>${participant.memorisation_sourate || 'Non renseigné'}</span>
                </div>
            </div>
            
            <div style="margin-top: 2rem; text-align: right;">
                <button onclick="this.closest('[style*=fixed]').remove()" class="btn-primary" style="padding: 0.6rem 1.5rem;">
                    Fermer
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Fermer en cliquant sur l'arrière-plan
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}
