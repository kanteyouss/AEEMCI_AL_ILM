// ============================================
// NOTATION - AL ILM 2026 (Question par Question)
// ============================================

let manches = [];
let rubriques = [];
let equipes = [];
let currentManche = null;
let currentRubrique = null;
let currentEquipe = null;

// Socket.io
let socket = null;

// État de la session de notation
let notationSession = {
    questions: [],
    currentQuestionIndex: 0,
    totalQuestions: 0,
    pointsPerQuestion: 0,
    timePerQuestion: 0,
    score: 0,
    correctCount: 0,
    incorrectCount: 0,
    timer: null,
    timeRemaining: 0
};

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initialisation page notation');

    // Init Socket
    initSocket();

    // Vérifier l'authentification (profonde)
    // const isAuthenticated = await checkAuth();
    // const user = getUser();
    // console.log('👤 Utilisateur:', user, 'Auth:', isAuthenticated);

    // if (!isAuthenticated || !user || (user.role !== 'admin' && user.role !== 'jury')) {
    //     console.log('❌ Non autorisé ou session invalide, redirection vers login');
    //     window.location.href = '/login.html';
    //     return;
    // }

    // Authentification facultative (Mode ouvert)
    /*
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
        window.location.href = '/login.html';
        return;
    }
    */
    currentJury = getUser() || { id: 1, prenom: 'Jury', nom: 'Public', role: 'admin' };
    console.log('👤 Utilisateur:', currentJury);

    const userNameElement = document.getElementById('userName');
    const adminBadge = document.querySelector('.admin-badge');

    if (userNameElement) {
        const displayName = currentJury.prenom ? `${currentJury.prenom} ${currentJury.nom}` : (currentJury.nom || 'Utilisateur');
        userNameElement.textContent = displayName;
    }

    if (adminBadge && currentJury.type === 'equipe') {
        adminBadge.textContent = 'Session Équipe';
        adminBadge.style.background = 'rgba(76, 175, 80, 0.1)';
        adminBadge.style.color = '#4caf50';
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await logout();
        });
    }

    await loadManches();
    initEventListeners();
});

function initSocket() {
    socket = io();
    socket.emit('join_game', { role: 'admin', mancheId: 'all' }); // 'all' ou null pour écouter globalement ou à adapter

    // Écouter la demande de génération du candidat
    socket.on('admin_trigger_generation', (data) => {
        console.log('📩 Demande de génération reçue du candidat', data);

        // Vérifier si c'est bien pour nous (même rubrique/équipe)
        // Utilisation de == pour gerer string/number
        if (currentRubrique && currentEquipe &&
            data.rubriqueId == currentRubrique.id &&
            data.equipeId == currentEquipe.id) {

            console.log("✅ IDs correspondent : Génération déclenchée !");
            generateQuestion();
        } else {
            console.warn("⚠️ IDs ne correspondent pas ou contexte manquant", {
                received: data,
                current: { rubriqueId: currentRubrique?.id, equipeId: currentEquipe?.id }
            });
        }
    });

    // Écouter les réponses des équipes (Mode Collectif)
    initSocketListenersForCollective();
}

/**
 * Mise à jour de l'état actif sur le serveur (pour débloquer le candidat)
 */
function updateActiveState() {
    if (socket) {
        // Si on a tout, on active explicitement
        if (currentManche && currentRubrique && currentEquipe) {
            socket.emit('set_active_state', {
                mancheId: currentManche.id,
                mancheNom: currentManche.nom,
                rubriqueId: currentRubrique.id,
                equipeId: currentEquipe.id,
                equipeNom: currentEquipe.nom
            });
            console.log('📡 État actif envoyé au serveur');
        } else {
            // Sinon on désactive (pause)
            /*
            socket.emit('set_active_state', {
                mancheId: null, rubriqueId: null, equipeId: null
            });
            */
            // Pour l'instant on ne force pas le reset pour éviter de couper brutalement si on navigue juste
        }
    }
}

/**
 * Charger les manches disponibles
 */
async function loadManches() {
    try {
        const result = await apiRequest('/manches');
        manches = result.data || [];

        const select = document.getElementById('mancheSelect');
        if (manches.length === 0) {
            select.innerHTML = '<option value="">Aucune manche programmée</option>';
            document.getElementById('noSessionAlert').style.display = 'block';
            return;
        }

        select.innerHTML = '<option value="">-- Sélectionnez une manche --</option>';
        manches.forEach(manche => {
            const option = document.createElement('option');
            option.value = manche.id;
            const date = new Date(manche.date_manche).toLocaleDateString('fr-FR', {
                weekday: 'long', day: 'numeric', month: 'long'
            });
            option.textContent = `${manche.nom} - ${date}`;
            option.dataset.manche = JSON.stringify(manche);
            select.appendChild(option);
        });
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

async function loadRubriques(mancheId) {
    try {
        const result = await apiRequest(`/notation/sessions?manche_id=${mancheId}`);
        const sessions = result.data || [];

        const rubriquesMap = new Map();
        sessions.forEach(session => {
            if (!rubriquesMap.has(session.rubrique_id)) {
                rubriquesMap.set(session.rubrique_id, {
                    id: session.rubrique_id,
                    session_id: session.session_id,
                    nom: session.rubrique_nom,
                    type: session.rubrique_type,
                    points_max: session.points_max,
                    criteres_evaluation: session.criteres_evaluation,
                    description: session.description || '',
                    temps_par_question: session.temps_par_question,
                    mode_affichage: session.mode_affichage || 'individuel'
                });
            }
        });

        rubriques = Array.from(rubriquesMap.values());
        const select = document.getElementById('rubriqueSelect');
        select.disabled = false;
        select.innerHTML = '<option value="">-- Sélectionnez une rubrique --</option>';
        rubriques.forEach(rubrique => {
            const option = document.createElement('option');
            option.value = rubrique.id;
            option.textContent = `${rubrique.nom} (${rubrique.points_max} pts)`;
            option.dataset.rubrique = JSON.stringify(rubrique);
            select.appendChild(option);
        });
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

async function loadEquipes(mancheId) {
    try {
        const result = await apiRequest(`/notation/equipes/${mancheId}`);
        equipes = result.data || [];

        const select = document.getElementById('equipeSelect');
        select.disabled = false;
        select.innerHTML = '<option value="">-- Sélectionnez une équipe --</option>';
        equipes.forEach(equipe => {
            const option = document.createElement('option');
            option.value = equipe.id;
            option.textContent = `${equipe.nom} (${equipe.nb_membres} membres)`;
            option.dataset.equipe = JSON.stringify(equipe);
            select.appendChild(option);
        });
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

function initEventListeners() {
    document.getElementById('mancheSelect').addEventListener('change', async (e) => {
        const option = e.target.options[e.target.selectedIndex];
        if (!option.dataset.manche) return;

        currentManche = JSON.parse(option.dataset.manche);
        if (socket) socket.emit('join_game', { role: 'admin', mancheId: currentManche.id });

        document.getElementById('rubriqueSelect').innerHTML = '<option value="">Chargement...</option>';
        document.getElementById('equipeSelect').disabled = true;
        document.getElementById('notationForm').classList.remove('visible');

        await loadRubriques(currentManche.id);
        await loadEquipes(currentManche.id);
    });

    document.getElementById('rubriqueSelect').addEventListener('change', async (e) => {
        const option = e.target.options[e.target.selectedIndex];
        if (!option.dataset.rubrique) return;
        currentRubrique = JSON.parse(option.dataset.rubrique);

        if (currentRubrique.mode_affichage === 'collectif') {
            console.log('👥 Mode Collectif détecté, activation immédiate');
            document.getElementById('equipeSelect').disabled = true;
            document.getElementById('equipeSelect').value = "";
            currentEquipe = null; // Pas d'équipe spécifique sélectionnée au départ
            initCollectiveNotation();
        } else {
            console.log('👤 Mode Individuel');
            document.getElementById('equipeSelect').disabled = false;
            // Reset UI si on vient du mode collectif
            const collContainer = document.getElementById('collectiveContainer');
            if (collContainer) collContainer.style.display = 'none';
            document.getElementById('questionBox').style.display = 'none';
            // On attend la sélection d'équipe pour init
        }

        // updateActiveState(); // On ne met pas à jour tout de suite en mode individuel
    });

    document.getElementById('equipeSelect').addEventListener('change', async (e) => {
        const option = e.target.options[e.target.selectedIndex];
        if (!option.dataset.equipe) return;
        currentEquipe = JSON.parse(option.dataset.equipe);

        await initNotationSession();
        updateActiveState(); // C'est ici que le candidat est débloqué
    });

    document.getElementById('generateBtn').addEventListener('click', generateQuestion);
    document.getElementById('correctBtn').addEventListener('click', () => validateAnswer(true));
    document.getElementById('incorrectBtn').addEventListener('click', () => validateAnswer(false));
    document.getElementById('saveBtn').addEventListener('click', saveNotation);
    document.getElementById('resetBtn').addEventListener('click', resetNotation);
}

// ... Les fonctions checkNotationExistante, loadExistingNotation restent inchangées ou presque ...
// Pour simplifier je ne les remets pas tout, je me concentre sur initQuestionNotation et generate

async function checkNotationExistante() {
    // (Implémentation inchangée)
    try {
        const result = await apiRequest(
            `/notation/check?equipe_id=${currentEquipe.id}&manche_id=${currentManche.id}&rubrique_id=${currentRubrique.id}`
        );
        if (result.existe) {
            if (confirm('Cette équipe a déjà été notée. Modifier ?')) {
                // loadExistingNotation(result.notation);
                return false;
            } else {
                return true;
            }
        }
        return false;
    } catch (e) { return false; }
}

async function initNotationSession() {
    if (!currentManche || !currentRubrique || !currentEquipe) return;

    // cleanupNotationForm(); // Supposé exister ou à vider manuellement

    const exists = await checkNotationExistante();
    if (exists) return;

    // Détection type notation
    const useCriteria = currentRubrique.criteres_evaluation &&
        typeof currentRubrique.criteres_evaluation === 'object' &&
        (currentRubrique.criteres_evaluation.voix !== undefined);

    if (useCriteria) {
        initCriteriaNotation();
    } else if (currentRubrique.mode_affichage === 'collectif') {
        initCollectiveNotation();
    } else {
        await initQuestionNotation();
    }
}

function initCriteriaNotation() {
    // On cache la boite de question et on montre les sliders
    document.getElementById('questionBox').style.display = 'none';
    document.getElementById('answerButtons').style.display = 'none';
    document.getElementById('generateBtn').style.display = 'none';

    // UI Setup
    const badge = document.getElementById('equipeNom');
    badge.textContent = currentEquipe.nom;
    badge.style.background = currentEquipe.couleur;

    document.getElementById('notationForm').classList.add('visible');

    // Container pour les critères
    let container = document.getElementById('criteriaContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'criteriaContainer';
        container.className = 'criteria-container';

        // Insérer avant la section finale (boutons valider)
        const finalSection = document.getElementById('finalSection');
        if (finalSection && finalSection.parentNode) {
            finalSection.parentNode.insertBefore(container, finalSection);
        } else {
            // Fallback : ajouter à la fin du formulaire
            document.getElementById('notationForm').appendChild(container);
        }
    }
    container.style.display = 'grid';
    container.innerHTML = ''; // Reset

    // Afficher la section finale pour avoir le bouton valider
    document.getElementById('finalSection').style.display = 'block';

    // Reset session
    notationSession.score = 0;
    notationSession.correctCount = 0;
    notationSession.incorrectCount = 0;

    // Générer les sliders
    const criteres = currentRubrique.criteres_evaluation || {};

    Object.entries(criteres).forEach(([nom, maxPts]) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'criteria-item';
        wrapper.style.marginBottom = '1rem';
        wrapper.style.padding = '1rem';
        wrapper.style.background = '#f8fafc';
        wrapper.style.borderRadius = '8px';
        wrapper.style.border = '1px solid #e2e8f0';

        const labelRow = document.createElement('div');
        labelRow.style.display = 'flex';
        labelRow.style.justifyContent = 'space-between';
        labelRow.style.marginBottom = '0.5rem';

        const label = document.createElement('label');
        label.style.fontWeight = '600';
        label.style.textTransform = 'capitalize';
        label.textContent = nom;

        const valueDisplay = document.createElement('span');
        valueDisplay.style.fontWeight = 'bold';
        valueDisplay.style.color = '#2563eb';
        valueDisplay.textContent = `0 / ${maxPts}`;

        labelRow.appendChild(label);
        labelRow.appendChild(valueDisplay);

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = maxPts;
        slider.step = '0.5';
        slider.value = '0';
        slider.style.width = '100%';
        slider.style.cursor = 'pointer';

        // Update logic
        slider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            valueDisplay.textContent = `${val} / ${maxPts}`;
            calculateCriteriaScore();
        });

        wrapper.appendChild(labelRow);
        wrapper.appendChild(slider);
        container.appendChild(wrapper);
    });

    // Notify server (Passive mode for candidate ?)
    // Peut-être afficher "Évaluation en cours..." sur le candidat
    if (socket && currentManche && currentRubrique && currentEquipe) {
        // On n'active PAS le bouton générer pour le candidat, donc on peut ne rien envoyer 
        // ou envoyer un état spécifique.
        // updateActiveState() active le bouton générer.
        // Pour l'instant, on ne fait rien, le candidat reste en attente, c'est mieux.
    }
}

function calculateCriteriaScore() {
    let total = 0;
    const sliders = document.querySelectorAll('#criteriaContainer input[type="range"]');
    sliders.forEach(input => {
        total += parseFloat(input.value);
    });
    notationSession.score = total;
    document.getElementById('currentScore').textContent = total.toFixed(1);
}

async function initQuestionNotation() {
    // 1. Déterminer le nombre de questions
    // On utilise la fonction globale définie en bas de fichier, 
    // mais on ajoute une sécurité ici pour le Relais
    let nbQuestions = extractQuestionCount(currentRubrique.description);

    // Force 3 questions si c'est une rubrique Relais (par type ou nom)
    const isRelais = (currentRubrique.type === 'relais' || currentRubrique.nom.toLowerCase().includes('relais'));
    if (isRelais && nbQuestions < 3) {
        nbQuestions = 3;
    }

    // 2. Calcul des points
    const pointsParQuestion = nbQuestions > 0 ? currentRubrique.points_max / nbQuestions : currentRubrique.points_max;

    console.log(`📊 Init Notation : ${isRelais ? '[RELAIS] ' : ''}${nbQuestions} questions, ${pointsParQuestion} pts/qst`);

    notationSession = {
        questions: [],
        currentQuestionIndex: 0,
        totalQuestions: nbQuestions,
        pointsPerQuestion: pointsParQuestion,
        timePerQuestion: currentRubrique.temps_par_question || 15,
        score: 0,
        correctCount: 0,
        incorrectCount: 0,
        timer: null,
        timeRemaining: 0
    };

    const badge = document.getElementById('equipeNom');
    badge.textContent = currentEquipe.nom;
    badge.style.background = currentEquipe.couleur;
    badge.style.color = 'white';

    updateProgressUI();

    // UI Setup
    document.getElementById('notationForm').classList.add('visible');
    document.getElementById('questionBox').style.display = 'block';

    const critContainer = document.getElementById('criteriaContainer');
    if (critContainer) critContainer.style.display = 'none';

    document.getElementById('answerButtons').style.display = 'none';

    // Gestion du bouton générer
    const btnGen = document.getElementById('generateBtn');
    btnGen.style.display = 'block';
    btnGen.disabled = false;

    document.getElementById('questionText').innerHTML = `
        <div style="text-align:center; color:#666;">
            ⏳ En attente que le candidat clique sur "Générer"...<br>
            <small>(Manche : ${currentManche.nom})</small>
        </div>
    `;
    document.getElementById('timer').textContent = '--';

    // Notifier le serveur que l'admin est prêt (et débloquer le candidat)
    updateActiveState();
}

// L'ancienne fonction extractQuestionCount locale est supprimée ici pour utiliser celle du bas de fichier

async function initCollectiveNotation() {
    console.log('👥 Init Notation Collective');

    // 1. Déterminer le nombre de questions
    // Culture générale (ID 6) : 4 questions. Autres (Vie du Prophète, Jurisprudence) : 2 questions.
    const isCulture = /culture/i.test(currentRubrique.nom || '');
    const nbQuestions = isCulture ? 4 : 2;
    const pointsParQuestion = currentRubrique.points_max / nbQuestions;

    notationSession = {
        questions: [],
        currentQuestionIndex: 0,
        totalQuestions: nbQuestions,
        pointsPerQuestion: pointsParQuestion,
        timePerQuestion: currentRubrique.temps_par_question || 30, // Plus long pour écrire
        score: 0, // Pas utilisé en mode collectif global
        correctCount: 0,
        incorrectCount: 0,
        timer: null,
        timeRemaining: 0
    };

    // UI Setup
    document.getElementById('notationForm').classList.add('visible');
    document.getElementById('questionBox').style.display = 'block';

    // Masquer le score individuel global qui ne s'applique pas ici
    const scoreGlobal = document.getElementById('currentScore').parentNode;
    if (scoreGlobal) scoreGlobal.style.visibility = 'hidden';

    // Charger les scores existants pour initialiser l'état et vérifier si déjà noté
    try {
        const result = await apiRequest(`/notation/manche/${currentManche.id}`);
        const notations = result.data || [];

        // Vérifier si la rubrique a déjà été notée par au moins une équipe
        const dejaNote = notations.some(n => n.rubrique_id === currentRubrique.id);

        if (dejaNote) {
            if (!confirm(`⚠️ Cette rubrique collectif (${currentRubrique.nom}) a déjà été notée pour cette manche. Voulez-vous charger les scores existants pour modification ?\n\nAnnuler réinitialisera tout à zéro.`)) {
                equipes.forEach(eq => eq.currentScore = 0);
            } else {
                // Map pour accès rapide
                const scoresMap = new Map();
                notations.forEach(n => {
                    if (n.rubrique_id === currentRubrique.id) {
                        scoresMap.set(n.equipe_id, n.note_totale);
                    }
                });

                // Initialiser le score courant de chaque équipe
                equipes.forEach(eq => {
                    eq.currentScore = parseFloat(scoresMap.get(eq.id)) || 0;
                });
                console.log('📊 Scores existants chargés pour modification:', scoresMap);
            }
        } else {
            equipes.forEach(eq => eq.currentScore = 0);
        }
    } catch (e) {
        console.error("Erreur chargement scores existants", e);
        equipes.forEach(eq => eq.currentScore = 0);
    }

    // Cacher les éléments spécifiques équipe individuelle
    const badge = document.getElementById('equipeNom');
    badge.textContent = "MODE COLLECTIF - TOUTES LES ÉQUIPES";
    badge.style.background = "#333";
    badge.style.width = "100%";
    badge.style.textAlign = "center";

    // Cacher le sélecteur d'équipe s'il est visible (il devrait l'être)
    document.getElementById('equipeSelect').disabled = true;

    // Préparer la zone de notation collective
    let container = document.getElementById('collectiveContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'collectiveContainer';
        container.className = 'collective-container';
        // Insérer après la question
        const questionBox = document.getElementById('questionBox');
        questionBox.parentNode.insertBefore(container, questionBox.nextSibling);
    }
    container.style.display = 'block';
    container.innerHTML = ''; // Reset

    // Masquer les boutons de réponse individuels
    document.getElementById('answerButtons').style.display = 'none';

    // Afficher bouton générer question commune
    const btnGen = document.getElementById('generateBtn');
    btnGen.style.display = 'block';
    btnGen.disabled = false;
    btnGen.textContent = "Générer Question Commune";
    btnGen.onclick = generateCollectiveQuestion; // Override click handler

    document.getElementById('questionText').innerHTML = `
        <div style="text-align:center; color:#666;">
            ⏳ Prêt à lancer la question pour TOUTES les équipes...<br>
            <small>(Manche : ${currentManche.nom})</small>
        </div>
    `;
    document.getElementById('timer').textContent = '--';
}

async function generateCollectiveQuestion() {
    try {
        const btnGen = document.getElementById('generateBtn');
        btnGen.disabled = true;
        document.getElementById('questionText').textContent = 'Chargement et diffusion de la question commune...';

        const result = await apiRequest('/jeu/generer-question-commune', {
            method: 'POST',
            body: JSON.stringify({
                rubrique_id: currentRubrique.id,
                manche_id: currentManche.id
            })
        });

        const question = result.data;
        notationSession.currentQuestion = question;

        // Affichage Admin
        document.getElementById('questionText').innerHTML = `
            <div style="margin-bottom: 1.5rem;">
                <strong>Question Commune :</strong><br/>${question.question_texte}
            </div>
            <div style="background: #e6ffed; padding: 1rem; border-radius: 6px;">
                <strong style="color: #065f46;">✓ Réponse Attendue :</strong><br/>
                <span style="color: #047857;">${question.reponse_correcte}</span>
            </div>
            <div style="margin-top:1rem; text-align:center;">
                <h2 id="adminTimer" style="font-size:2rem; color:#2563eb;">3...</h2>
                <div style="color:gray;">Démarrage automatique dans 3s</div>
            </div>
        `;

        document.getElementById('questionNum').textContent = notationSession.currentQuestionIndex + 1;
        btnGen.style.display = 'none';

        // IMPORTANT : Cacher les boutons Correct/Incorrect individuels (mode individuel)
        document.getElementById('answerButtons').style.display = 'none';

        // Afficher le bouton Force Submit (Désactivé pour l'instant)
        showForceSubmitButton();

        // Afficher la liste des équipes (vide de réponses pour l'instant)
        renderCollectiveGradingList();

        // --- SÉQUENCE TIMER AUTOMATIQUE ---

        let countdown = 3;
        const timerEl = document.getElementById('adminTimer');

        const startInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                timerEl.textContent = `${countdown}...`;
            } else {
                // GO !
                clearInterval(startInterval);
                timerEl.textContent = "⏱️ EN COURS";
                timerEl.style.color = "#d97706";

                // Diffuser le signal de départ (Timer)
                if (socket) {
                    socket.emit('admin_start_timer', {
                        duration: question.temps_limite || 30
                    });
                }

                // Activer le bouton Force Submit
                const forceBtn = document.getElementById('btnForceSubmit');
                if (forceBtn) forceBtn.disabled = false;

                // Démarrer timer purement visuel admin (optionnel)
                startAdminVisualTimer(question.temps_limite || 30);
            }
        }, 1000);

    } catch (error) {
        console.error(error);
        alert("Erreur: " + error.message);
        document.getElementById('generateBtn').disabled = false;
    }
}

function showForceSubmitButton() {
    let container = document.getElementById('collectiveContainer');
    let btn = document.getElementById('btnForceSubmit');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'btnForceSubmit';
        btn.className = 'btn-danger';
        btn.innerHTML = '🛑 STOP / FORCER L\'ENVOI';
        btn.style.width = '100%';
        btn.style.marginTop = '1rem';
        btn.style.marginBottom = '1rem';
        btn.style.padding = '1rem';
        btn.style.fontWeight = 'bold';
        btn.disabled = true; // Disabled during 3s countdown

        btn.onclick = () => {
            if (confirm("Bloquer les écrans et récupérer les réponses ?")) {
                socket.emit('admin_force_submit');
                btn.disabled = true;
                btn.textContent = "✅ Réponses forcées";
                clearInterval(adminTimerInterval);
            }
        };

        // Insérer au début du container
        container.insertBefore(btn, container.firstChild);
    } else {
        btn.style.display = 'block';
        btn.disabled = true;
        btn.innerHTML = '🛑 STOP / FORCER L\'ENVOI';
    }
}

let adminTimerInterval = null;
function startAdminVisualTimer(duration) {
    let timeLeft = duration;
    const timerEl = document.getElementById('adminTimer'); // Réutiliser l'élément du 3...2...1

    if (adminTimerInterval) clearInterval(adminTimerInterval);

    adminTimerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `⏱️ ${timeLeft} s`;

        if (timeLeft <= 5) timerEl.style.color = "red";

        if (timeLeft <= 0) {
            clearInterval(adminTimerInterval);
            timerEl.textContent = "TEMPS ÉCOULÉ";
        }
    }, 1000);
}

// Écouteur pour les réponses reçues
function initSocketListenersForCollective() {
    if (!socket) return;

    // Eviter doublons
    socket.off('team_answered');

    socket.on('team_answered', (data) => {
        console.log('📨 Réponse reçue:', data);
        updateTeamResponseUI(data.equipeId, data.content);
    });
}

// initSocketListenersForCollective est maintenant appelé directement dans initSocket()


function renderCollectiveGradingList() {
    // ... (Code existant légèrement modifié pour inclure la zone de réponse reçue) ...
    const container = document.getElementById('collectiveContainer');
    // On ne vide pas tout pour garder le bouton Force Submit s'il y est
    // On cherche ou crée la grille

    let grid = document.getElementById('collectiveGrid');
    if (!grid) {
        grid = document.createElement('div');
        grid.id = 'collectiveGrid';
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
        grid.style.gap = '1rem';
        grid.style.marginTop = '1rem';
        container.appendChild(grid);
    } else {
        grid.innerHTML = ''; // Reset juste la grille
    }

    equipes.forEach(equipe => {
        const card = document.createElement('div');
        card.className = 'team-grade-card';
        card.id = `card-team-${equipe.id}`;
        card.style.border = '1px solid #ddd';
        card.style.padding = '1rem';
        card.style.borderRadius = '8px';
        card.style.background = '#fff';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.justifyContent = 'space-between';

        // Header
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.innerHTML = `
            <div style="display:flex; align-items:center;">
                <span style="width: 12px; height: 12px; border-radius: 50%; background: ${equipe.couleur}; display: inline-block; margin-right: 8px;"></span>
                <strong>${equipe.nom}</strong>
            </div>
            <div style="text-align:right;">
                <div style="font-size:1.1rem; font-weight:700; color:var(--primary-color);">
                    <span id="total-score-${equipe.id}">${equipe.currentScore || 0}</span> / ${currentRubrique.points_max} pts
                </div>
                <span id="status-${equipe.id}" style="font-size:0.75rem; padding:2px 6px; background:#edf2f7; border-radius:4px; color:#4a5568;">En attente...</span>
            </div>
        `;

        // Zone de réponse reçue
        const answerBox = document.createElement('div');
        answerBox.id = `answer-${equipe.id}`;
        answerBox.style.margin = '1rem 0';
        answerBox.style.padding = '0.75rem';
        answerBox.style.background = '#f8fafc';
        answerBox.style.border = '1px dashed #cbd5e0';
        answerBox.style.borderRadius = '6px';
        answerBox.style.minHeight = '3rem';
        answerBox.style.fontFamily = 'monospace';
        answerBox.style.color = '#718096';
        answerBox.textContent = '(Aucune réponse)';

        // Actions (Correct / Incorrect)
        const actions = document.createElement('div');
        actions.style.display = 'flex';
        actions.style.gap = '0.5rem';

        const btnCorrect = document.createElement('button');
        btnCorrect.textContent = 'Correct';
        btnCorrect.className = 'btn-success-outline';
        btnCorrect.style.flex = '1';

        const btnIncorrect = document.createElement('button');
        btnIncorrect.textContent = 'Incorrect';
        btnIncorrect.className = 'btn-danger-outline';
        btnIncorrect.style.flex = '1';

        const btnReset = document.createElement('button');
        btnReset.textContent = 'Réinit.';
        btnReset.className = 'btn-secondary-outline';
        btnReset.style.flex = '0.6';
        btnReset.title = "Remettre le score de cette équipe à 0";

        const feedback = document.createElement('div');
        feedback.id = `feedback-${equipe.id}`;

        btnCorrect.onclick = () => saveCollectiveScore(equipe, true, feedback, btnCorrect, btnIncorrect);
        btnIncorrect.onclick = () => saveCollectiveScore(equipe, false, feedback, btnCorrect, btnIncorrect);
        btnReset.onclick = () => resetTeamScore(equipe, feedback, [btnCorrect, btnIncorrect, btnReset]);

        actions.appendChild(btnCorrect);
        actions.appendChild(btnIncorrect);
        actions.appendChild(btnReset);

        card.appendChild(header);
        card.appendChild(answerBox);
        card.appendChild(actions);
        card.appendChild(feedback);
        grid.appendChild(card);
    });

    // Bouton Finir (si pas déjà là)
    if (!document.getElementById('btnFinishTour')) {
        const finishBtn = document.createElement('button');
        finishBtn.id = 'btnFinishTour';
        finishBtn.textContent = "Terminer ce tour";
        finishBtn.className = "btn-primary";
        finishBtn.style.marginTop = "2rem";
        finishBtn.style.width = "100%";
        finishBtn.onclick = finishCollectiveTour;
        container.appendChild(finishBtn);
    }
}

function updateTeamResponseUI(equipeId, content) {
    const card = document.getElementById(`card-team-${equipeId}`);
    if (!card) return; // Équipe non trouvée dans la grille ?

    // Update Status
    const status = document.getElementById(`status-${equipeId}`);
    status.textContent = '✅ Reçu';
    status.style.background = '#dcfce7'; // Vert clair
    status.style.color = '#166534';

    // Update Content
    const box = document.getElementById(`answer-${equipeId}`);
    box.textContent = content || '(Réponse vide)';
    box.style.background = '#fff';
    box.style.border = '1px solid #cbd5e0';
    box.style.color = '#1a202c';
    box.style.fontWeight = 'bold';

    // Highlight card
    card.style.boxShadow = '0 0 0 2px #3b82f6';
}

// (Deuxième définition supprimée - la bonne version est au-dessus avec les IDs card-team-X, status-X, answer-X)

async function saveCollectiveScore(equipe, isCorrect, feedbackEl, btnCorrect, btnIncorrect) {
    // Désactiver boutons
    btnCorrect.disabled = true;
    btnIncorrect.disabled = true;
    feedbackEl.textContent = "Sauvegarde...";

    try {
        const pointsToAdd = isCorrect ? notationSession.pointsPerQuestion : 0;

        // Accumuler avec le score existant
        if (typeof equipe.currentScore === 'undefined') equipe.currentScore = 0;

        // Plafonner localement pour éviter les dépassements (ex: 150/100)
        const newTotal = Math.min(equipe.currentScore + pointsToAdd, currentRubrique.points_max);

        if (equipe.currentScore >= currentRubrique.points_max && isCorrect) {
            feedbackEl.textContent = "Score déjà au maximum !";
            btnCorrect.disabled = false;
            btnIncorrect.disabled = false;
            return;
        }

        // Payload similaire à saveNotation classique
        const payload = {
            session_id: currentRubrique.session_id,
            manche_id: currentManche.id,
            rubrique_id: currentRubrique.id,
            equipe_id: equipe.id,
            note_totale: newTotal,
            commentaire: "Question Collective",
            criteres: {
                question_id: notationSession.currentQuestion.id,
                is_correct: isCorrect,
                added_points: pointsToAdd
            }
        };

        const result = await apiRequest('/notation', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (result.success) {
            // Mettre à jour le score local pour la prochaine question
            equipe.currentScore = newTotal;

            // Mettre à jour l'affichage du score total sur la carte
            const totalEl = document.getElementById(`total-score-${equipe.id}`);
            if (totalEl) totalEl.textContent = newTotal;

            feedbackEl.textContent = isCorrect ? `✅ Note enregistrée (+${pointsToAdd})` : "❌ Note enregistrée (+0)";
            feedbackEl.style.color = isCorrect ? "green" : "red";

            // Highlight selection
            btnCorrect.style.background = isCorrect ? "#dcfce7" : "";
            btnIncorrect.style.background = !isCorrect ? "#fee2e2" : "";
        } else {
            throw new Error(result.message);
        }
    } catch (e) {
        console.error(e);
        feedbackEl.textContent = "Erreur ! Réessayer.";
        btnCorrect.disabled = false;
        btnIncorrect.disabled = false;
    }
}

async function resetTeamScore(equipe, feedbackEl, buttons) {
    if (!confirm(`Voulez-vous vraiment remettre à zéro le score de l'équipe ${equipe.nom} pour cette rubrique ?`)) return;

    buttons.forEach(b => b.disabled = true);
    feedbackEl.textContent = "Réinitialisation...";

    try {
        const payload = {
            session_id: currentRubrique.session_id,
            manche_id: currentManche.id,
            rubrique_id: currentRubrique.id,
            equipe_id: equipe.id,
            note_totale: 0,
            commentaire: "Réinitialisation Score",
            criteres: { action: 'reset' }
        };

        const result = await apiRequest('/notation', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (result.success) {
            equipe.currentScore = 0;
            const totalEl = document.getElementById(`total-score-${equipe.id}`);
            if (totalEl) totalEl.textContent = "0";

            feedbackEl.textContent = "🔄 Score réinitialisé à 0";
            feedbackEl.style.color = "orange";

            // Nettoyer feedback visuel des autres boutons
            buttons[0].style.background = ""; // Correct
            buttons[1].style.background = ""; // Incorrect
        }
    } catch (e) {
        console.error(e);
        feedbackEl.textContent = "Erreur !";
    } finally {
        buttons.forEach(b => b.disabled = false);
    }
}


function finishCollectiveTour() {
    if (confirm("Avez-vous noté toutes les équipes ? On passe à la question suivante ?")) {
        notationSession.currentQuestionIndex++;

        if (notationSession.currentQuestionIndex < notationSession.totalQuestions) {
            // Reset UI pour la prochaine question
            document.getElementById('collectiveContainer').innerHTML = '';

            const btnGen = document.getElementById('generateBtn');
            btnGen.style.display = 'block';
            btnGen.disabled = false;
            btnGen.textContent = `Générer Question Commune ${notationSession.currentQuestionIndex + 1}/${notationSession.totalQuestions}`;

            document.getElementById('questionText').innerHTML = `
                <div style="text-align:center; color:#666;">
                    ⏳ Prêt pour la prochaine question...
                </div>
            `;
            document.getElementById('timer').textContent = '--';
            document.getElementById('questionNum').textContent = notationSession.currentQuestionIndex + 1;
        } else {
            alert("Rubrique terminée !");
            window.location.reload(); // Ou reset propre
        }
    }
}


async function generateQuestion() {
    // Guard : ne pas exécuter en mode collectif (le onclick est overridé mais addEventListener reste)
    if (currentRubrique && currentRubrique.mode_affichage === 'collectif') {
        console.log('⚠️ generateQuestion ignoré en mode collectif');
        return;
    }

    try {
        document.getElementById('generateBtn').disabled = true;
        document.getElementById('questionText').textContent = 'Chargement...';

        const response = await fetch(`/api/questions/random?rubrique_id=${currentRubrique.id}`);
        const result = await response.json();

        if (!response.ok || !result.success || !result.data) throw new Error('Erreur question');

        const question = result.data;

        // Affichage Admin (Question + Réponse)
        document.getElementById('questionText').innerHTML = `
            <div style="margin-bottom: 1.5rem;">
                <strong>Question :</strong><br/>${question.question_texte}
            </div>
            <div style="background: #e6ffed; padding: 1rem; border-radius: 6px;">
                <strong style="color: #065f46;">✓ Réponse :</strong><br/>
                <span style="color: #047857;">${question.reponse_correcte}</span>
            </div>
        `;

        document.getElementById('questionNum').textContent = notationSession.currentQuestionIndex + 1;
        document.getElementById('answerButtons').style.display = 'grid';
        document.getElementById('generateBtn').style.display = 'none'; // Cacher pour ce tour

        // SOCKET : Diffuser la question (Candidat voit question, Admin a déjà vu)
        if (socket) {
            socket.emit('question_generated', {
                question: question,
                temps: notationSession.timePerQuestion
            });
        }

        startTimer();

        notationSession.questions.push({
            question: question,
            answered: false,
            correct: null
        });

    } catch (error) {
        console.error(error);
        document.getElementById('questionText').textContent = "Erreur de génération.";
        document.getElementById('generateBtn').disabled = false;
    }
}

function startTimer() {
    notationSession.timeRemaining = notationSession.timePerQuestion;
    updateTimerDisplay();

    if (notationSession.timer) clearInterval(notationSession.timer);

    notationSession.timer = setInterval(() => {
        notationSession.timeRemaining--;
        updateTimerDisplay();

        // Sync avec socket toutes les secondes (ou optimiser)
        if (socket && notationSession.timeRemaining % 5 === 0) { // Sync toutes les 5s pour pas spammer
            socket.emit('timer_sync', {
                tempsRestant: notationSession.timeRemaining,
                mancheId: currentManche.id
            });
        }

        if (notationSession.timeRemaining <= 0) {
            clearInterval(notationSession.timer);
            // showNotification('Temps écoulé !', 'warning');
        }
    }, 1000);
}

function updateTimerDisplay() {
    const el = document.getElementById('timer');
    el.textContent = notationSession.timeRemaining + 's';
    if (notationSession.timeRemaining <= 5) el.classList.add('warning');
    else el.classList.remove('warning');
}

function validateAnswer(isCorrect) {
    if (notationSession.timer) clearInterval(notationSession.timer);

    // SOCKET : Envoyer résultat
    if (socket) {
        socket.emit('end_question', {
            mancheId: currentManche.id,
            result: isCorrect ? 'correct' : 'incorrect'
        });
    }

    const currentQuestion = notationSession.questions[notationSession.currentQuestionIndex];
    if (currentQuestion) {
        currentQuestion.answered = true;
        currentQuestion.correct = isCorrect;
    }

    if (isCorrect) {
        notationSession.score += notationSession.pointsPerQuestion;
        notationSession.correctCount++;
    } else {
        notationSession.incorrectCount++;

        // LOGIQUE RELAIS : Arrêt immédiat si mauvaise réponse
        // On vérifie le type de rubrique (par nom ou structure)
        if (currentRubrique.type === 'relais' || currentRubrique.nom.toLowerCase().includes('relais')) {
            alert("❌ Mauvaise réponse en Relais ! Fin du tour pour cette équipe.");
            finishNotation();
            return; // On sort pour ne pas incrémenter l'index et proposer la suite
        }
    }

    updateProgressUI();

    notationSession.currentQuestionIndex++;

    if (notationSession.currentQuestionIndex < notationSession.totalQuestions) {
        // Next question setup
        document.getElementById('answerButtons').style.display = 'none';
        document.getElementById('generateBtn').style.display = 'block';
        document.getElementById('generateBtn').disabled = false;

        document.getElementById('questionText').innerHTML = `
            <div style="text-align:center; color:#666;">
                Question ${notationSession.currentQuestionIndex + 1} Prête.<br>
                ⏳ En attente que le candidat clique sur "Générer"...
            </div>
        `;
        document.getElementById('timer').textContent = '--';

        // Réactiver le bouton candidat via socket
        updateActiveState();

    } else {
        finishNotation();
    }
}

function updateProgressUI() {
    // (Simple update des barres et textes)
    const progress = (notationSession.currentQuestionIndex + 1) / notationSession.totalQuestions * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('currentScore').textContent = notationSession.score.toFixed(1);
}

function finishNotation() {
    document.getElementById('questionBox').style.display = 'none';
    document.getElementById('scoreSummary').style.display = 'grid';
    document.getElementById('correctCount').textContent = notationSession.correctCount;
    document.getElementById('incorrectCount').textContent = notationSession.incorrectCount;
    document.getElementById('finalScore').textContent = notationSession.score.toFixed(1);

    document.getElementById('finalSection').style.display = 'block'; // Sauvegarder
}

async function saveNotation() {
    if (!currentManche || !currentRubrique || !currentEquipe) return;

    const btn = document.getElementById('saveBtn');
    btn.disabled = true;
    btn.textContent = 'Sauvegarde...';

    try {
        // Collecter les critères si mode critère
        let criteresData = {};
        if (currentRubrique.criteres_evaluation && currentRubrique.criteres_evaluation.voix !== undefined) {
            const sliders = document.querySelectorAll('#criteriaContainer input[type="range"]');
            sliders.forEach(input => {
                // Retrouver le nom du critère via le label précédent
                const label = input.previousElementSibling.querySelector('label').textContent;
                criteresData[label] = parseFloat(input.value);
            });
        } else {
            // Mode Question
            criteresData = {
                questions: notationSession.questions,
                correctCount: notationSession.correctCount,
                incorrectCount: notationSession.incorrectCount
            };
        }

        const payload = {
            session_id: currentRubrique.session_id,
            manche_id: currentManche.id,
            rubrique_id: currentRubrique.id,
            equipe_id: currentEquipe.id,
            note_totale: notationSession.score, // Corrigé (note -> note_totale)
            commentaire: document.getElementById('commentaire').value || '', // Corrigé (commentaires -> commentaire)
            criteres: criteresData // Corrigé (details -> criteres)
        };

        const result = await apiRequest('/notation', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (result.success) {
            // showNotification('Note enregistrée avec succès !', 'success');

            // Passer à l'équipe suivante
            setTimeout(() => {
                goToNextTeam();
            }, 1000);

        } else {
            throw new Error(result.message || 'Erreur sauvegarde');
        }

    } catch (e) {
        console.error(e);
        alert('Erreur lors de la sauvegarde: ' + e.message);
    } finally {
        btn.disabled = false;
        btn.textContent = 'Enregistrer & Suivant';
    }
}

function goToNextTeam() {
    // Trouver l'index de l'équipe actuelle
    const currentIndex = equipes.findIndex(e => e.id === currentEquipe.id);

    if (currentIndex !== -1 && currentIndex < equipes.length - 1) {
        const nextEquipe = equipes[currentIndex + 1];

        // Mettre à jour le select
        const select = document.getElementById('equipeSelect');
        select.value = nextEquipe.id;

        // Simuler le changement
        // On appelle directement la logique pour plus de propreté
        currentEquipe = nextEquipe;
        initNotationSession();
        updateActiveState();

        console.log(`⏩ Passage automatique à l'équipe suivante : ${nextEquipe.nom}`);

        // Scroll top
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } else {
        alert("Terminé ! Toutes les équipes ont été notées pour cette rubrique.");
        // On pourrait reset ou proposer de changer de rubrique
        document.getElementById('notationForm').classList.remove('visible');
        updateActiveState(); // Pour reset le candidat en attente
    }
}

function resetNotation() {
    if (confirm('Tout effacer ?')) initNotationSession();
}

function cleanupNotationForm() {
    // Reset UI elements
}


// Helpers
function showNotification(msg, type) {
    alert(msg); // Placeholder
}


function extractQuestionCount(description) {
    if (!description) return 1;

    description = description.toLowerCase();

    // 1. Chercher explicitement "X questions"
    const match = description.match(/(\d+)\s*(questions?|qsts?)/);
    if (match) return parseInt(match[1]);

    // 2. Déduction par type (Relais / Culture)
    if (description.includes('relais') || description.includes('culture')) return 4;

    // 3. Déduction par nom de rubrique (via variable globale si besoin, mais ici on a que desc)
    // On suppose que si non trouvé -> 1 par défaut (ou 4 pour être safe ?)
    return 1;
}
