// ============================================
// GESTION DES ÉQUIPES - DRAG & DROP
// Dashboard Admin AL ILM 2026
// ============================================

// Données des 10 équipes
const EQUIPES_DATA = [
    { id: 1, nom: 'AL-FURQAN', symbole: '⚖️', couleur: '#2c3e50' },
    { id: 2, nom: 'AS-SABIQUN', symbole: '🏃', couleur: '#27ae60' },
    { id: 3, nom: 'AL-MUJAHIDUN', symbole: '⚔️', couleur: '#c0392b' },
    { id: 4, nom: 'AN-NUR', symbole: '💡', couleur: '#f39c12' },
    { id: 5, nom: 'AL-HUDA', symbole: '🧭', couleur: '#16a085' },
    { id: 6, nom: 'AL-BADR', symbole: '🌕', couleur: '#95a5a6' },
    { id: 7, nom: 'AL-FIRDAWS', symbole: '🌴', couleur: '#27ae60' },
    { id: 8, nom: 'AL-MUFLIHUN', symbole: '🎯', couleur: '#e67e22' },
    { id: 9, nom: 'AS-SADIQUN', symbole: '🤝', couleur: '#9b59b6' },
    { id: 10, nom: 'AL-IMAN', symbole: '🕋', couleur: '#34495e' }
];

// État global
let participants = [];
let equipes = {};
let draggedElement = null;

// Initialisation
document.addEventListener('DOMContentLoaded', async () => {
    // Afficher le nom de l'utilisateur
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userNameElement = document.getElementById('userName');
    if (userNameElement && user.nom) {
        userNameElement.textContent = `${user.prenom || ''} ${user.nom}`.trim();
    }

    // Gérer la déconnexion
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login.html';
        });
    }

    await loadParticipants();
    initEquipes();
    renderEquipes();
    renderParticipants();
    initEventListeners();
});

/**
 * Charger les participants depuis l'API
 */
async function loadParticipants() {
    try {
        const response = await fetch('/api/participants');
        if (!response.ok) throw new Error('Erreur réseau');
        
        const data = await response.json();
        participants = data.filter(p => !p.equipe_id); // Seulement les non assignés
        
        updatePoolCount();
    } catch (error) {
        console.error('Erreur lors du chargement des participants:', error);
        showNotification('Impossible de charger les participants', 'error');
    }
}

/**
 * Initialiser la structure des équipes
 */
function initEquipes() {
    EQUIPES_DATA.forEach(equipe => {
        equipes[equipe.id] = {
            ...equipe,
            membres: [],
            capitaine: null
        };
    });
}

/**
 * Rendre les équipes
 */
function renderEquipes() {
    const grid = document.getElementById('equipesGrid');
    
    grid.innerHTML = EQUIPES_DATA.map(equipe => `
        <div class="equipe-box" 
             data-equipe-id="${equipe.id}"
             ondrop="drop(event)"
             ondragover="allowDrop(event)"
             ondragleave="dragLeave(event)">
            <div class="equipe-header">
                <div class="equipe-symbol">${equipe.symbole}</div>
                <div class="equipe-info">
                    <h3>${equipe.nom}</h3>
                    <p class="equipe-count">
                        <span id="count-${equipe.id}">0</span> membre(s)
                    </p>
                </div>
            </div>
            <div class="equipe-members" id="members-${equipe.id}">
                <p style="text-align: center; color: #adb5bd; padding: 2rem;">
                    Glissez des participants ici
                </p>
            </div>
        </div>
    `).join('');
}

/**
 * Rendre les participants non assignés
 */
function renderParticipants() {
    const list = document.getElementById('participantsList');
    
    if (participants.length === 0) {
        list.innerHTML = `
            <p style="text-align: center; color: #adb5bd; padding: 2rem;">
                Aucun participant disponible
            </p>
        `;
        return;
    }
    
    list.innerHTML = participants.map(p => `
        <div class="participant-card" 
             draggable="true"
             data-participant-id="${p.id}"
             ondragstart="dragStart(event)">
            <div class="participant-name">${p.nom} ${p.prenom}</div>
            <div class="participant-info">
                ${p.niveau || 'N/A'} • ${p.sexe === 'M' ? 'Homme' : 'Femme'}
            </div>
        </div>
    `).join('');
}

/**
 * Mettre à jour le compteur du pool
 */
function updatePoolCount() {
    document.getElementById('poolCount').textContent = participants.length;
}

/**
 * Événements drag & drop
 */
function dragStart(event) {
    draggedElement = event.target;
    event.target.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('participantId', event.target.dataset.participantId);
}

function allowDrop(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    
    const equipeBox = event.currentTarget;
    if (equipeBox.classList.contains('equipe-box')) {
        equipeBox.classList.add('drag-over');
    }
}

function dragLeave(event) {
    const equipeBox = event.currentTarget;
    if (equipeBox.classList.contains('equipe-box')) {
        equipeBox.classList.remove('drag-over');
    }
}

function drop(event) {
    event.preventDefault();
    
    const equipeBox = event.currentTarget;
    equipeBox.classList.remove('drag-over');
    
    const participantId = parseInt(event.dataTransfer.getData('participantId'));
    const equipeId = parseInt(equipeBox.dataset.equipeId);
    
    if (draggedElement) {
        draggedElement.classList.remove('dragging');
        draggedElement = null;
    }
    
    addToEquipe(participantId, equipeId);
}

/**
 * Ajouter un participant à une équipe
 */
function addToEquipe(participantId, equipeId) {
    const participant = participants.find(p => p.id === participantId);
    if (!participant) return;
    
    if (equipes[equipeId].membres.length >= 10) {
        showNotification('Cette équipe est complète (max 10 membres)', 'warning');
        return;
    }
    
    participants = participants.filter(p => p.id !== participantId);
    equipes[equipeId].membres.push(participant);
    
    renderParticipants();
    renderEquipeMembers(equipeId);
    updatePoolCount();
    updateEquipeCount(equipeId);
    updateProgressStats();
}

/**
 * Rendre les membres d'une équipe
 */
function renderEquipeMembers(equipeId) {
    const container = document.getElementById(`members-${equipeId}`);
    const equipe = equipes[equipeId];
    
    if (equipe.membres.length === 0) {
        container.innerHTML = `
            <p style="text-align: center; color: #adb5bd; padding: 2rem;">
                Glissez des participants ici
            </p>
        `;
        return;
    }
    
    container.innerHTML = equipe.membres.map(membre => {
        const isCaptain = equipe.capitaine === membre.id;
        
        return `
            <div class="member-card ${isCaptain ? 'captain' : ''}" 
                 data-member-id="${membre.id}">
                ${isCaptain ? '<span class="captain-badge">👑 Capitaine</span>' : ''}
                <div class="member-name">${membre.nom} ${membre.prenom}</div>
                <div class="participant-info">
                    ${membre.niveau || 'N/A'} • ${membre.sexe === 'M' ? 'Homme' : 'Femme'}
                </div>
                <div class="member-actions">
                    ${!isCaptain ? `
                        <button class="btn-captain" onclick="setCaptain(${equipeId}, ${membre.id})">
                            👑 Capitaine
                        </button>
                    ` : ''}
                    <button class="btn-remove" onclick="removeFromEquipe(${equipeId}, ${membre.id})">
                        ❌ Retirer
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Mettre à jour le compteur d'une équipe
 */
function updateEquipeCount(equipeId) {
    const countElem = document.getElementById(`count-${equipeId}`);
    if (countElem) {
        countElem.textContent = equipes[equipeId].membres.length;
    }
}

/**
 * Définir un capitaine
 */
function setCaptain(equipeId, membreId) {
    equipes[equipeId].capitaine = membreId;
    renderEquipeMembers(equipeId);
    updateProgressStats();
    showNotification('Capitaine désigné !', 'success');
}

/**
 * Retirer un membre d'une équipe
 */
function removeFromEquipe(equipeId, membreId) {
    const membre = equipes[equipeId].membres.find(m => m.id === membreId);
    if (!membre) return;
    
    equipes[equipeId].membres = equipes[equipeId].membres.filter(m => m.id !== membreId);
    
    if (equipes[equipeId].capitaine === membreId) {
        equipes[equipeId].capitaine = null;
    }
    
    participants.push(membre);
    
    renderParticipants();
    renderEquipeMembers(equipeId);
    updatePoolCount();
    updateEquipeCount(equipeId);
    updateProgressStats();
}

/**
 * Mettre à jour les statistiques de progression
 */
function updateProgressStats() {
    const progressBar = document.getElementById('progressBar');
    const statsEquipes = document.getElementById('statsEquipes');
    const statsMembres = document.getElementById('statsMembres');
    const statsCapitaines = document.getElementById('statsCapitaines');
    const statsNonAssignes = document.getElementById('statsNonAssignes');
    const readyIndicator = document.getElementById('readyIndicator');
    
    if (!progressBar) return;
    
    // Calculer les statistiques
    let nbEquipesFormees = 0;
    let totalMembres = 0;
    let nbCapitaines = 0;
    
    EQUIPES_DATA.forEach(eq => {
        const equipe = equipes[eq.id];
        if (equipe.membres.length > 0) {
            nbEquipesFormees++;
            totalMembres += equipe.membres.length;
            if (equipe.capitaine) {
                nbCapitaines++;
            }
        }
    });
    
    const nbNonAssignes = participants.length;
    
    // Mettre à jour l'affichage
    statsEquipes.textContent = nbEquipesFormees;
    statsMembres.textContent = totalMembres;
    statsCapitaines.textContent = nbCapitaines;
    statsNonAssignes.textContent = nbNonAssignes;
    
    // Afficher la barre si des équipes sont formées
    if (nbEquipesFormees > 0) {
        progressBar.style.display = 'block';
        
        // Indicateur de préparation
        const allHaveCaptains = nbEquipesFormees === nbCapitaines;
        
        if (allHaveCaptains && nbEquipesFormees > 0) {
            readyIndicator.style.display = 'block';
            readyIndicator.style.background = '#d4edda';
            readyIndicator.style.color = '#155724';
            readyIndicator.innerHTML = '✅ Prêt pour la validation ! Tous les capitaines sont désignés.';
        } else if (nbEquipesFormees > 0 && nbCapitaines > 0) {
            readyIndicator.style.display = 'block';
            readyIndicator.style.background = '#fff3cd';
            readyIndicator.style.color = '#856404';
            readyIndicator.innerHTML = `⚠️ ${nbEquipesFormees - nbCapitaines} équipe(s) sans capitaine. Désignez les capitaines manquants.`;
        } else {
            readyIndicator.style.display = 'none';
        }
    } else {
        progressBar.style.display = 'none';
    }
}

/**
 * Répartition automatique
 */
function autoAssign() {
    if (participants.length === 0) {
        showNotification('Aucun participant à répartir', 'warning');
        return;
    }
    
    if (!confirm('Voulez-vous répartir automatiquement les participants ?\nCela effacera la répartition actuelle.')) {
        return;
    }
    
    resetAllEquipes();
    
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    const equipesIds = EQUIPES_DATA.map(e => e.id);
    let equipeIndex = 0;
    
    shuffled.forEach(participant => {
        const equipeId = equipesIds[equipeIndex];
        equipes[equipeId].membres.push(participant);
        equipeIndex = (equipeIndex + 1) % equipesIds.length;
    });
    
    participants = [];
    
    equipesIds.forEach(id => {
        if (equipes[id].membres.length > 0) {
            equipes[id].capitaine = equipes[id].membres[0].id;
        }
    });
    
    renderParticipants();
    equipesIds.forEach(id => {
        renderEquipeMembers(id);
        updateEquipeCount(id);
    });
    updatePoolCount();
    updateProgressStats();
    
    showNotification('Répartition automatique effectuée !', 'success');
}

/**
 * Réinitialiser toutes les équipes
 */
function resetAllEquipes() {
    EQUIPES_DATA.forEach(eq => {
        participants.push(...equipes[eq.id].membres);
        equipes[eq.id].membres = [];
        equipes[eq.id].capitaine = null;
    });
    
    renderParticipants();
    EQUIPES_DATA.forEach(eq => {
        renderEquipeMembers(eq.id);
        updateEquipeCount(eq.id);
    });
    updatePoolCount();
}

/**
 * Réinitialiser tout
 */
function resetAll() {
    if (!confirm('Voulez-vous vraiment tout réinitialiser ?\nCette action est irréversible.')) {
        return;
    }
    
    resetAllEquipes();
    showNotification('Réinitialisation effectuée', 'info');
}

/**
 * Valider et générer les codes
 */
function validateEquipes() {
    const warnings = [];
    
    EQUIPES_DATA.forEach(eq => {
        const equipe = equipes[eq.id];
        
        if (equipe.membres.length === 0) {
            warnings.push(`${eq.nom} est vide`);
        }
        
        if (equipe.membres.length > 0 && !equipe.capitaine) {
            warnings.push(`${eq.nom} n'a pas de capitaine`);
        }
    });
    
    if (participants.length > 0) {
        warnings.push(`${participants.length} participant(s) non assigné(s)`);
    }
    
    showValidationModal(warnings);
}

/**
 * Afficher le modal de validation
 */
function showValidationModal(warnings) {
    const modal = document.getElementById('validationModal');
    const body = document.getElementById('modalBody');
    
    let html = '';
    
    if (warnings.length > 0) {
        html += `
            <div class="warning-box">
                <strong>⚠️ Avertissements (${warnings.length}):</strong>
                <ul>
                    ${warnings.map(w => `<li>${w}</li>`).join('')}
                </ul>
                <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #856404;">
                    💡 Vous pouvez continuer, mais il est recommandé de corriger ces avertissements.
                </p>
            </div>
        `;
    } else {
        html += `
            <div style="background: #d4edda; border-left: 4px solid #28a745; padding: 1rem; margin-bottom: 1rem; border-radius: 5px;">
                <strong style="color: #155724; display: flex; align-items: center; gap: 0.5rem;">
                    ✅ Tout est prêt !
                </strong>
                <p style="margin: 0.5rem 0 0 0; color: #155724;">
                    Toutes les équipes sont complètes et ont un capitaine désigné.
                </p>
            </div>
        `;
    }
    
    let totalMembres = 0;
    
    EQUIPES_DATA.forEach(eq => {
        const equipe = equipes[eq.id];
        
        if (equipe.membres.length > 0) {
            totalMembres += equipe.membres.length;
            const capitaine = equipe.membres.find(m => m.id === equipe.capitaine);
            
            html += `
                <div class="equipe-summary">
                    <h4>
                        <span>${eq.symbole} ${eq.nom}</span>
                    </h4>
                    <div class="equipe-stats">
                        👥 ${equipe.membres.length} membre${equipe.membres.length > 1 ? 's' : ''}
                        ${capitaine ? ` • 👑 Capitaine: ${capitaine.prenom} ${capitaine.nom}` : ' • ⚠️ Pas de capitaine'}
                    </div>
                    <ul>
                        ${equipe.membres.map(m => {
                            const isCap = equipe.capitaine === m.id;
                            return `
                                <li>
                                    <span>${m.nom} ${m.prenom}</span>
                                    ${isCap ? '<span class="captain-indicator">👑 Capitaine</span>' : ''}
                                </li>
                            `;
                        }).join('')}
                    </ul>
                </div>
            `;
        }
    });
    
    // Afficher le résumé global
    const nbEquipes = EQUIPES_DATA.filter(eq => equipes[eq.id].membres.length > 0).length;
    html = `
        <div style="background: var(--primary-color); color: white; padding: 1rem; border-radius: 10px; margin-bottom: 1.5rem; text-align: center;">
            <h3 style="margin: 0 0 0.5rem 0;">📊 Récapitulatif Global</h3>
            <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <div style="font-size: 2rem; font-weight: bold;">${nbEquipes}</div>
                    <div style="font-size: 0.9rem; opacity: 0.9;">Équipes</div>
                </div>
                <div>
                    <div style="font-size: 2rem; font-weight: bold;">${totalMembres}</div>
                    <div style="font-size: 0.9rem; opacity: 0.9;">Participants</div>
                </div>
                <div>
                    <div style="font-size: 2rem; font-weight: bold;">${participants.length}</div>
                    <div style="font-size: 0.9rem; opacity: 0.9;">Non assignés</div>
                </div>
            </div>
        </div>
    ` + html;
    
    body.innerHTML = html;
    modal.classList.add('show');
}

/**
 * Fermer le modal
 */
function closeModal() {
    document.getElementById('validationModal').classList.remove('show');
}

/**
 * Confirmer la validation
 */
/**
 * Générer les fiches PDF des équipes
 */
function generateEquipesPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    let pageCount = 0;
    
    EQUIPES_DATA.forEach((equipeData, index) => {
        const equipe = equipes[equipeData.id];
        
        // Ne générer que les équipes avec des membres
        if (!equipe || equipe.membres.length === 0) return;
        
        // Nouvelle page pour chaque équipe (sauf la première)
        if (pageCount > 0) {
            doc.addPage();
        }
        pageCount++;
        
        // En-tête
        doc.setFillColor(45, 106, 79); // Couleur primaire
        doc.rect(0, 0, 210, 40, 'F');
        
        // Logo/Titre
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('🕌 AL ILM 2026', 105, 15, { align: 'center' });
        
        doc.setFontSize(16);
        doc.text('FICHE ÉQUIPE', 105, 25, { align: 'center' });
        
        // Nom de l'équipe avec symbole
        doc.setFontSize(14);
        doc.text(`${equipeData.symbole} ${equipeData.nom}`, 105, 35, { align: 'center' });
        
        // Informations de l'équipe
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        
        let y = 55;
        
        // Code d'accès
        doc.setFillColor(240, 240, 240);
        doc.roundedRect(20, y - 5, 170, 15, 3, 3, 'F');
        doc.text('Code d\'accès:', 25, y + 5);
        doc.setFont('courier', 'bold');
        doc.setFontSize(14);
        doc.text(equipe.code || 'NON GÉNÉRÉ', 70, y + 5);
        
        y += 25;
        
        // Capitaine
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        const capitaine = equipe.membres.find(m => m.id === equipe.capitaine);
        doc.text('👑 Capitaine:', 25, y);
        doc.setFont('helvetica', 'normal');
        if (capitaine) {
            doc.text(`${capitaine.prenom} ${capitaine.nom} - ${capitaine.etablissement}`, 60, y);
        } else {
            doc.text('Non désigné', 60, y);
        }
        
        y += 15;
        
        // Liste des membres
        doc.setFont('helvetica', 'bold');
        doc.text(`👥 Membres (${equipe.membres.length}):`, 25, y);
        
        y += 10;
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        
        equipe.membres.forEach((membre, idx) => {
            const isCap = membre.id === equipe.capitaine;
            const prefix = isCap ? '👑' : `${idx + 1}.`;
            const text = `${prefix} ${membre.prenom} ${membre.nom}`;
            const etablissement = membre.etablissement;
            
            // Nom
            doc.text(text, 30, y);
            
            // Établissement
            doc.setTextColor(100, 100, 100);
            doc.setFontSize(9);
            doc.text(etablissement, 30, y + 4);
            
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            
            y += 12;
            
            // Nouvelle page si nécessaire
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
        });
        
        // Pied de page
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('AL ILM 2026 - Compétition Islamique Inter-Écoles', 105, 285, { align: 'center' });
        doc.text(`Page ${pageCount}`, 105, 290, { align: 'center' });
    });
    
    // Télécharger le PDF
    const date = new Date().toISOString().split('T')[0];
    doc.save(`AL_ILM_2026_Equipes_${date}.pdf`);
    
    showNotification('✅ Fiches PDF générées avec succès !', 'success');
}

async function confirmValidation() {
    try {
        const equipesData = EQUIPES_DATA.map(eq => ({
            equipe_id: eq.id,
            membres: equipes[eq.id].membres.map(m => m.id),
            capitaine_id: equipes[eq.id].capitaine
        })).filter(e => e.membres.length > 0);
        
        const response = await fetch('/api/equipes/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ equipes: equipesData })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erreur serveur');
        }
        
        const result = await response.json();
        
        // Mettre à jour les codes d'accès localement
        result.data.forEach(equipeResult => {
            const equipeLocal = EQUIPES_DATA.find(e => e.id === equipeResult.equipe_id);
            if (equipeLocal) {
                equipes[equipeResult.equipe_id].code = equipeResult.code_acces;
            }
        });
        
        closeModal();
        showNotification(`✅ ${result.data.length} équipe(s) validée(s) ! Codes générés.`, 'success');
        
        // Afficher les codes générés
        setTimeout(() => {
            let codesMessage = '🎯 CODES D\'ACCÈS GÉNÉRÉS\n\n';
            result.data.forEach(eq => {
                const equipeData = EQUIPES_DATA.find(e => e.id === eq.equipe_id);
                codesMessage += `${equipeData.symbole} ${equipeData.nom}: ${eq.code_acces}\n`;
            });
            codesMessage += '\n💡 Les codes sont maintenant disponibles dans les fiches PDF.';
            
            alert(codesMessage);
        }, 1000);
        
    } catch (error) {
        console.error('Erreur lors de la validation:', error);
        showNotification(`❌ ${error.message}`, 'error');
    }
}

/**
 * Afficher l'aide
 */
function showHelp() {
    const helpContent = `
        <div style="text-align: left; max-height: 70vh; overflow-y: auto;">
            <h3 style="color: var(--primary-color); margin-top: 0;">📖 Guide Rapide de Formation des Équipes</h3>
            
            <div style="background: #e3f2fd; padding: 1rem; border-radius: 8px; margin: 1rem 0; border-left: 4px solid #2196f3;">
                <h4 style="margin: 0 0 0.5rem 0; color: #1976d2;">🎯 Objectif</h4>
                <p style="margin: 0;">Répartir les participants dans 10 équipes, désigner un capitaine pour chaque équipe, puis valider pour générer les codes d'accès.</p>
            </div>
            
            <h4 style="color: var(--primary-color);">1️⃣ Répartir les participants</h4>
            <ul style="line-height: 1.8;">
                <li><strong>🎲 Répartition Auto</strong> : Cliquez sur "Répartition Automatique" pour une répartition équilibrée</li>
                <li><strong>🖱️ Glisser-Déposer</strong> : Glissez un participant du pool vers une équipe</li>
                <li><strong>🔍 Rechercher</strong> : Utilisez la barre de recherche pour trouver un participant</li>
            </ul>
            
            <h4 style="color: var(--primary-color);">2️⃣ Désigner les capitaines</h4>
            <ul style="line-height: 1.8;">
                <li>Pour chaque équipe avec des membres, cliquez sur <strong>"👑 Capitaine"</strong> à côté du membre choisi</li>
                <li>Le capitaine aura un <strong>badge doré</strong> et une <strong>bordure colorée</strong></li>
                <li>Un seul capitaine par équipe (change automatiquement si vous en désignez un autre)</li>
                <li><strong>⚠️ Important</strong> : Chaque équipe DOIT avoir un capitaine avant validation</li>
            </ul>
            
            <h4 style="color: var(--primary-color);">3️⃣ Valider la composition</h4>
            <ul style="line-height: 1.8;">
                <li>Cliquez sur <strong>"✅ Valider & Générer les Codes"</strong></li>
                <li>Vérifiez le récapitulatif (nombre d'équipes, membres, capitaines)</li>
                <li>Corrigez les <strong>avertissements</strong> si nécessaire</li>
                <li>Cliquez sur <strong>"Confirmer & Générer"</strong></li>
            </ul>
            
            <h4 style="color: var(--primary-color);">4️⃣ Télécharger les fiches PDF</h4>
            <ul style="line-height: 1.8;">
                <li>Après validation, cliquez sur <strong>"📄 Télécharger Fiches PDF"</strong></li>
                <li>Le PDF contient 1 page par équipe avec le code d'accès</li>
                <li>Distribuez les fiches aux capitaines</li>
            </ul>
            
            <div style="background: #fff3cd; padding: 1rem; border-radius: 8px; margin: 1rem 0; border-left: 4px solid #ffc107;">
                <h4 style="margin: 0 0 0.5rem 0; color: #856404;">💡 Conseils</h4>
                <ul style="margin: 0.5rem 0 0 1.5rem; line-height: 1.8;">
                    <li>3-5 membres par équipe recommandés</li>
                    <li>Choisissez des capitaines fiables et organisés</li>
                    <li>Vérifiez toujours le récapitulatif avant validation</li>
                    <li>Les codes d'accès sont générés automatiquement (6 caractères)</li>
                </ul>
            </div>
            
            <div style="background: #f3e5f5; padding: 1rem; border-radius: 8px; margin: 1rem 0; border-left: 4px solid #9c27b0;">
                <h4 style="margin: 0 0 0.5rem 0; color: #6a1b9a;">📚 Documentation Complète</h4>
                <p style="margin: 0;">Consultez <strong>GUIDE_FORMATION_EQUIPES.md</strong> pour le guide détaillé avec captures d'écran et résolution de problèmes.</p>
            </div>
        </div>
    `;
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = helpContent;
    
    // Modifier les boutons du modal
    const btnConfirm = document.getElementById('btnConfirmValidation');
    const btnCancel = btnConfirm.previousElementSibling;
    
    // Sauvegarder les gestionnaires d'origine
    const originalCancelText = btnCancel.textContent;
    const originalConfirmDisplay = btnConfirm.style.display;
    
    btnCancel.textContent = 'Fermer';
    btnConfirm.style.display = 'none';
    
    // Ouvrir le modal
    document.getElementById('validationModal').classList.add('show');
    
    // Restaurer les boutons à la fermeture
    const modal = document.getElementById('validationModal');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class' && !modal.classList.contains('show')) {
                btnCancel.textContent = originalCancelText;
                btnConfirm.style.display = originalConfirmDisplay;
                observer.disconnect();
            }
        });
    });
    observer.observe(modal, { attributes: true });
}

/**
 * Initialiser les listeners
 */
function initEventListeners() {
    document.getElementById('searchParticipants').addEventListener('input', (e) => {
        const search = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.participant-card');
        
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(search) ? 'block' : 'none';
        });
    });
    
    document.getElementById('btnAutoAssign').addEventListener('click', autoAssign);
    document.getElementById('btnReset').addEventListener('click', resetAll);
    document.getElementById('btnValidate').addEventListener('click', validateEquipes);
    document.getElementById('btnConfirmValidation').addEventListener('click', confirmValidation);
    document.getElementById('btnGeneratePDF').addEventListener('click', generateEquipesPDF);
    
    document.getElementById('btnLogout').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '../login.html';
    });
}

/**
 * Afficher une notification
 */
function showNotification(message, type = 'info') {
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
