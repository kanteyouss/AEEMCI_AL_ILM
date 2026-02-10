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

    const user = getUser();
    if (!user || (user.role !== 'admin' && user.role !== 'jury')) {
        window.location.href = '/login.html';
        return;
    }

    document.getElementById('userName').textContent = `${user.prenom} ${user.nom}`;

    document.getElementById('logoutBtn').addEventListener('click', () => {
        clearAuthToken();
        window.location.href = '/login.html';
    });

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
        const response = await fetch('/api/manches');
        if (!response.ok) throw new Error('Erreur chargement manches');
        const result = await response.json();
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
        const response = await fetch(`/api/notation/sessions?manche_id=${mancheId}`);
        if (!response.ok) throw new Error('Erreur chargement rubriques');
        const result = await response.json();
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
                    temps_par_question: session.temps_par_question // Assurez-vous que l'API renvoie ça
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
        const response = await fetch(`/api/notation/equipes/${mancheId}`);
        if (!response.ok) throw new Error('Erreur chargement équipes');
        const result = await response.json();
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
        document.getElementById('equipeSelect').disabled = false;
        updateActiveState(); // Mettre à jour si équipe déjà sélectionnée
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
        const response = await fetch(
            `/api/notation/check?equipe_id=${currentEquipe.id}&manche_id=${currentManche.id}&rubrique_id=${currentRubrique.id}`
        );
        const result = await response.json();
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

    // Force 4 questions si c'est une rubrique Relais (par type ou nom)
    const isRelais = (currentRubrique.type === 'relais' || currentRubrique.nom.toLowerCase().includes('relais'));
    if (isRelais && nbQuestions < 4) {
        nbQuestions = 4;
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


async function generateQuestion() {
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

        const response = await fetch('/api/notation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok && result.success) {
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
