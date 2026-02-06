// État global de l'application
const state = {
    mancheId: null,
    sessionData: null,
    rubriques: [],
    equipes: [],
    rubriqueActive: null,
    equipeActive: null,
    membreActif: null,
    questionActive: null,
    timer: null,
    tempsRestant: 0
};

// Initialisation
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    await loadManches();
    setupEventListeners();
});

// Vérification de l'authentification
async function checkAuth() {
    const token = getAuthToken();
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    try {
        const response = await fetch('/api/auth/verify', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Token invalide');
        }

        const data = await response.json();
        document.getElementById('userName').textContent = data.nom || 'Admin';
    } catch (error) {
        console.error('Erreur auth:', error);
        clearAuthToken();
        window.location.href = '/login.html';
    }
}

// Chargement des manches
async function loadManches() {
    try {
        const token = getAuthToken();
        const response = await fetch('/api/manches', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Erreur de chargement');
        const data = await response.json();
        const select = document.getElementById('mancheSelect');
        
        data.forEach(manche => {
            const option = document.createElement('option');
            option.value = manche.id;
            option.textContent = `${manche.nom} - ${manche.date_debut}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur chargement manches:', error);
        alert('Erreur lors du chargement des manches');
    }
}

// Configuration des événements
function setupEventListeners() {
    document.getElementById('mancheSelect').addEventListener('change', demarrerSession);
    document.getElementById('rubriqueSelect').addEventListener('change', onRubriqueChange);
    document.getElementById('equipeSelect').addEventListener('change', onEquipeChange);
    document.getElementById('btnGenerer').addEventListener('click', genererQuestion);
    document.getElementById('btnCorrect').addEventListener('click', () => validerReponse(true));
    document.getElementById('btnIncorrect').addEventListener('click', () => validerReponse(false));
    document.getElementById('logoutBtn').addEventListener('click', logout);
}

// Démarrage de la session
async function demarrerSession() {
    const mancheId = parseInt(document.getElementById('mancheSelect').value);
    if (!mancheId) {
        document.getElementById('jeuGrid').style.display = 'none';
        return;
    }

    try {
        const token = getAuthToken();
        const response = await fetch('/api/jeu/demarrer', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mancheId })
        });
        if (!response.ok) throw new Error('Erreur démarrage session');
        const data = await response.json();
        state.mancheId = mancheId;
        state.sessionData = data;
        state.rubriques = data.rubriques;
        state.equipes = data.equipes;

        // Afficher l'interface de jeu
        document.getElementById('alerteDemarrage').style.display = 'none';
        document.getElementById('jeuGrid').style.display = 'grid';

        // Charger les rubriques
        loadRubriques();
        loadEquipes();
        await updateProgression();
    } catch (error) {
        console.error('Erreur démarrage session:', error);
        alert('Erreur lors du démarrage de la session');
    }
}

// Chargement des rubriques
function loadRubriques() {
    const select = document.getElementById('rubriqueSelect');
    select.innerHTML = '<option value="">-- Sélectionnez --</option>';
    
    state.rubriques.forEach(rubrique => {
        const option = document.createElement('option');
        option.value = rubrique.id;
        option.textContent = `${rubrique.nom} (${rubrique.nombre_questions} questions, ${rubrique.temps_par_question}s)`;
        select.appendChild(option);
    });
}

// Chargement des équipes
function loadEquipes() {
    const select = document.getElementById('equipeSelect');
    select.innerHTML = '<option value="">-- Sélectionnez --</option>';
    
    state.equipes.forEach(equipe => {
        const option = document.createElement('option');
        option.value = equipe.id;
        option.textContent = `${equipe.nom} (${equipe.nb_membres} membres)`;
        select.appendChild(option);
    });
}

// Changement de rubrique
function onRubriqueChange() {
    const rubriqueId = parseInt(document.getElementById('rubriqueSelect').value);
    state.rubriqueActive = rubriqueId ? state.rubriques.find(r => r.id === rubriqueId) : null;
    updateGenerateButton();
}

// Changement d'équipe
async function onEquipeChange() {
    const equipeId = parseInt(document.getElementById('equipeSelect').value);
    const membreSelect = document.getElementById('membreSelect');
    
    if (!equipeId) {
        membreSelect.disabled = true;
        membreSelect.innerHTML = '<option value="">-- Sélectionnez --</option>';
        state.equipeActive = null;
        updateGenerateButton();
        return;
    }

    state.equipeActive = state.equipes.find(e => e.id === equipeId);

    try {
        const token = getAuthToken();
        const response = await fetch(`/api/equipes/${equipeId}/membres`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Erreur membres');
        const data = await response.json();
        membreSelect.innerHTML = '<option value="">-- Sélectionnez --</option>';
        
        data.forEach(membre => {
            const option = document.createElement('option');
            option.value = membre.id;
            option.textContent = `${membre.prenom} ${membre.nom}`;
            membreSelect.appendChild(option);
        });
        
        membreSelect.disabled = false;
        membreSelect.addEventListener('change', () => {
            state.membreActif = parseInt(membreSelect.value);
            updateGenerateButton();
        });
    } catch (error) {
        console.error('Erreur chargement membres:', error);
        alert('Erreur lors du chargement des membres');
    }
}

// Mise à jour du bouton génération
function updateGenerateButton() {
    const btn = document.getElementById('btnGenerer');
    btn.disabled = !(state.rubriqueActive && state.equipeActive && state.membreActif);
}

// Génération de question
async function genererQuestion() {
    if (!state.rubriqueActive || !state.equipeActive || !state.membreActif) {
        alert('Veuillez sélectionner une rubrique, une équipe et un membre');
        return;
    }

    try {
        const token = getAuthToken();
        const response = await fetch('/api/jeu/generer-question', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mancheId: state.mancheId,
                rubriqueId: state.rubriqueActive.id,
                equipeId: state.equipeActive.id
            })
        });
        if (!response.ok) throw new Error('Erreur génération question');
        const data = await response.json();

        state.questionActive = data;
        afficherQuestion(data);
        demarrerChronometre(data.temps_par_question || 15);

        // Masquer le bouton génération, afficher les boutons validation
        document.getElementById('btnGenerer').style.display = 'none';
        document.getElementById('btnCorrect').style.display = 'block';
        document.getElementById('btnIncorrect').style.display = 'block';
    } catch (error) {
        console.error('Erreur génération question:', error);
        alert('Erreur: ' + (error.message || 'Impossible de générer une question'));
    }
}

// Affichage de la question
function afficherQuestion(question) {
    const display = document.getElementById('questionDisplay');
    const optionsContainer = document.getElementById('optionsContainer');
    
    // Afficher la question
    document.getElementById('questionNumero').textContent = `Question #${question.id} - ${state.rubriqueActive.nom}`;
    document.getElementById('questionTexte').textContent = question.question_texte;
    document.getElementById('questionPoints').textContent = `💎 ${question.points} points`;
    
    display.classList.add('visible');

    // Afficher les options si QCM
    if (question.type === 'qcm' && question.options) {
        const options = JSON.parse(question.options);
        const lettres = ['A', 'B', 'C', 'D'];
        
        optionsContainer.innerHTML = '';
        options.forEach((option, index) => {
            const card = document.createElement('div');
            card.className = 'option-card';
            card.innerHTML = `
                <span class="option-lettre">${lettres[index]}</span>
                ${option}
            `;
            optionsContainer.appendChild(card);
        });
        
        optionsContainer.style.display = 'grid';
    } else {
        optionsContainer.style.display = 'none';
    }

    // Masquer le résultat précédent
    document.getElementById('resultatReponse').classList.remove('visible');
}

// Démarrage du chronomètre
function demarrerChronometre(secondes) {
    state.tempsRestant = secondes;
    const chronoEl = document.getElementById('chronometre');
    
    // Nettoyage du timer précédent
    if (state.timer) {
        clearInterval(state.timer);
    }

    // Affichage initial
    chronoEl.textContent = formatTemps(state.tempsRestant);
    chronoEl.classList.remove('urgent');

    // Démarrage du compte à rebours
    state.timer = setInterval(() => {
        state.tempsRestant--;
        chronoEl.textContent = formatTemps(state.tempsRestant);

        // Alerte visuelle quand moins de 5 secondes
        if (state.tempsRestant <= 5) {
            chronoEl.classList.add('urgent');
        }

        // Arrêt à 0
        if (state.tempsRestant <= 0) {
            clearInterval(state.timer);
            chronoEl.textContent = '⏰';
        }
    }, 1000);
}

// Formatage du temps (MM:SS)
function formatTemps(secondes) {
    const min = Math.floor(secondes / 60);
    const sec = secondes % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
}

// Validation de la réponse
async function validerReponse(estCorrecte) {
    if (!state.questionActive) return;

    // Arrêter le chronomètre
    if (state.timer) {
        clearInterval(state.timer);
        state.timer = null;
    }

    try {
        const token = getAuthToken();
        const response = await fetch('/api/jeu/soumettre-reponse', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mancheId: state.mancheId,
                rubriqueId: state.rubriqueActive.id,
                equipeId: state.equipeActive.id,
                participantId: state.membreActif,
                questionId: state.questionActive.id,
                estCorrecte,
                tempsReponse: state.questionActive.temps_par_question - state.tempsRestant
            })
        });
        if (!response.ok) throw new Error('Erreur validation réponse');
        const data = await response.json();

        // Afficher le résultat
        const resultatEl = document.getElementById('resultatReponse');
        if (estCorrecte) {
            resultatEl.className = 'resultat-reponse visible correcte';
            resultatEl.innerHTML = `✅ Bonne réponse ! +${state.questionActive.points} points`;
        } else {
            resultatEl.className = 'resultat-reponse visible incorrecte';
            resultatEl.innerHTML = '❌ Mauvaise réponse. 0 point';
        }

        // Masquer les boutons de validation
        document.getElementById('btnCorrect').style.display = 'none';
        document.getElementById('btnIncorrect').style.display = 'none';
        
        // Réafficher le bouton génération après 2 secondes
        setTimeout(() => {
            document.getElementById('questionDisplay').classList.remove('visible');
            document.getElementById('btnGenerer').style.display = 'block';
            state.questionActive = null;
        }, 2500);

        // Mettre à jour la progression et les scores
        await updateProgression();
        await updateScorePanel();
    } catch (error) {
        console.error('Erreur validation réponse:', error);
        alert('Erreur lors de la validation de la réponse');
    }
}

// Mise à jour de la progression
async function updateProgression() {
    if (!state.mancheId) return;

    try {
        const token = getAuthToken();
        const response = await fetch(`/api/jeu/etat/${state.mancheId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Erreur progression');
        const data = await response.json();
        const container = document.getElementById('progressionContent');
        
        container.innerHTML = '';

        state.rubriques.forEach(rubrique => {
            const rubriqueDiv = document.createElement('div');
            rubriqueDiv.className = 'rubrique-progress';
            
            let html = `<div class="rubrique-nom">${rubrique.nom}</div>`;
            
            state.equipes.forEach(equipe => {
                const progression = data.find(p => 
                    p.equipe_id === equipe.id && p.rubrique_id === rubrique.id
                );
                
                const repondues = progression?.questions_repondues || 0;
                const total = rubrique.nombre_questions;
                const termine = repondues >= total;
                const enCours = repondues > 0 && !termine;
                
                let status = 'en-attente';
                let icon = '⏳';
                if (termine) {
                    status = 'termine';
                    icon = '✅';
                } else if (enCours) {
                    status = 'en-cours';
                    icon = '🔄';
                }
                
                html += `
                    <div class="equipe-status ${status}">
                        <span>${equipe.nom}</span>
                        <span>${icon} ${repondues}/${total}</span>
                    </div>
                `;
            });
            
            rubriqueDiv.innerHTML = html;
            container.appendChild(rubriqueDiv);
        });
    } catch (error) {
        console.error('Erreur mise à jour progression:', error);
    }
}

// Mise à jour du panneau de score
async function updateScorePanel() {
    if (!state.rubriqueActive || !state.equipeActive) return;

    try {
        const token = getAuthToken();
        const response = await fetch(`/api/jeu/questions-restantes?mancheId=${state.mancheId}&rubriqueId=${state.rubriqueActive.id}&equipeId=${state.equipeActive.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Erreur score');
        const data = await response.json();
        
        document.getElementById('scoreRepondues').textContent = data.repondues;
        document.getElementById('scoreRestantes').textContent = data.restantes;
        document.getElementById('scoreRubrique').textContent = data.score || 0;
        document.getElementById('scorePanel').style.display = 'block';
    } catch (error) {
        console.error('Erreur mise à jour score:', error);
    }
}

// Déconnexion
function logout() {
    clearAuthToken();
    window.location.href = '/login.html';
}
