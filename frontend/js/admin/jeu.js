// ============================================
// INTERFACE CANDIDAT (JEU) - AL ILM 2026
// ============================================

const socket = io();

// État local
let state = {
    mancheId: null,
    rubriqueId: null,
    equipeId: null,
    isActive: false // Est-ce que c'est une phase de jeu active (candidat doit jouer) ?
};

// UI Elements
const ui = {
    headerTitle: document.querySelector('.header-admin h1'), // "Jeu en Direct"
    alertInfo: document.getElementById('alerteDemarrage'), // "Sélectionnez une manche..."
    selectionContainer: document.querySelector('.jeu-container > div:nth-child(2)'), // Container du select manche (à cacher)
    jeuGrid: document.getElementById('jeuGrid'), // Grille principale

    // Panneaux
    progressionPanel: document.querySelector('.progression-panel'), // À cacher/adapter
    mainPanel: document.querySelector('.main-panel'),

    // Display
    questionDisplay: document.getElementById('questionDisplay'),
    questionTexte: document.getElementById('questionTexte'),
    questionPoints: document.getElementById('questionPoints'),
    optionsContainer: document.getElementById('optionsContainer'),
    timer: document.getElementById('chronometre'),

    // Bouton
    btnGenerer: document.getElementById('btnGenerer'),

    // Feedback
    feedbackOverlay: document.getElementById('feedbackOverlay'),
    feedbackContent: document.getElementById('feedbackContent'),
    feedbackSub: document.getElementById('feedbackSub')
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Interface Candidat Passive Initialisée');

    // 1. Nettoyer l'interface (Cacher les sélecteurs)
    setupInitialUI();

    // 2. Connexion Socket
    setupSocket();
});

function setupInitialUI() {
    // Cacher le selecteur de manche qui est hardcodé dans le HTML
    if (ui.selectionContainer) ui.selectionContainer.style.display = 'none';

    // Cacher panel progression si pas pertinent pour candidat (ou le garder ?) 
    // Pour l'instant on cache pour épuré
    if (ui.progressionPanel) ui.progressionPanel.style.display = 'none';

    // Ajuster la grille (supprimer la colonne de gauche)
    if (ui.jeuGrid) {
        ui.jeuGrid.style.display = 'block'; // Au lieu de grid
        ui.jeuGrid.style.gridTemplateColumns = '1fr';
    }

    // Cacher les selects internes (Rubrique/Equipe/Membre)
    const selects = document.querySelectorAll('.selection-grid');
    selects.forEach(el => el.style.display = 'none');

    ui.alertInfo.textContent = "En attente du Jury...";
    ui.alertInfo.style.display = 'block';

    // Cacher le reste
    ui.mainPanel.style.display = 'none';
}

function setupSocket() {
    socket.emit('join_game', { role: 'public', mancheId: 'all' });

    socket.on('game_state', (data) => {
        handleStateUpdate(data);
    });

    socket.on('state_updated', (data) => {
        handleStateUpdate(data);
    });

    socket.on('new_question', (data) => {
        displayQuestion(data);
    });

    socket.on('timer_update', (data) => {
        updateTimer(data.tempsRestant);
    });

    socket.on('question_result', (data) => {
        showResult(data.result);
    });

    // Listener pour le bouton générer
    ui.btnGenerer.addEventListener('click', () => {
        if (!state.isActive) return;

        socket.emit('request_question_generation', {
            mancheId: state.mancheId,
            rubriqueId: state.rubriqueId,
            equipeId: state.equipeId
        });

        ui.btnGenerer.textContent = "Tirage...";
        ui.btnGenerer.disabled = true;
    });
}

function handleStateUpdate(data) {
    console.log('State:', data);

    // Mettre à jour l'état local
    state.mancheId = data.mancheId;
    state.rubriqueId = data.rubriqueId;
    state.equipeId = data.equipeId;

    // Si on a une équipe active, on affiche l'interface
    if (state.equipeId) {
        ui.alertInfo.style.display = 'none';
        ui.mainPanel.style.display = 'block';

        // Mettre à jour le titre
        let titre = data.equipeNom ? `À vous de jouer : ${data.equipeNom}` : "À vous de jouer !";
        ui.headerTitle.textContent = titre; // Ou un gros titre dans la page

        // Reset question display
        ui.questionDisplay.style.display = 'none';
        ui.optionsContainer.style.display = 'none';

        // Montrer le bouton générer
        ui.btnGenerer.style.display = 'block';
        ui.btnGenerer.disabled = false;
        ui.btnGenerer.textContent = "GÉNÉRER LA QUESTION";

        state.isActive = true; // On assume que si une équipe est set, c'est pour jouer
    } else {
        // En attente
        ui.alertInfo.style.display = 'block';
        ui.alertInfo.textContent = "Pause / En attente du Jury";
        ui.mainPanel.style.display = 'none';
        state.isActive = false;
    }
}

function displayQuestion(data) {
    const q = data.question;

    // UI Updates
    ui.btnGenerer.style.display = 'none';
    ui.questionDisplay.style.display = 'block';

    ui.questionTexte.textContent = q.question_texte;
    ui.questionPoints.textContent = `${q.points} points`;

    ui.timer.textContent = data.temps;
    ui.timer.classList.remove('urgent');

    // Options QCM
    ui.optionsContainer.innerHTML = '';

    // Options QCM
    ui.optionsContainer.innerHTML = '';

    if (q.type === 'qcm') {
        const options = [];
        if (q.choix_a) options.push(q.choix_a);
        if (q.choix_b) options.push(q.choix_b);
        if (q.choix_c) options.push(q.choix_c);
        if (q.choix_d) options.push(q.choix_d);

        if (options.length > 0) {
            ui.optionsContainer.style.display = 'grid';
            options.forEach((opt, i) => {
                const div = document.createElement('div');
                div.className = 'option-card';
                div.innerHTML = `<span class="option-lettre">${['A', 'B', 'C', 'D'][i]}</span> ${opt}`;
                ui.optionsContainer.appendChild(div);
            });
        } else {
            ui.optionsContainer.style.display = 'none';
        }
    } else {
        ui.optionsContainer.style.display = 'none';
    }
}

function updateTimer(seconds) {
    ui.timer.textContent = seconds;
    if (seconds <= 5) ui.timer.classList.add('urgent');
    else ui.timer.classList.remove('urgent');
}

function showResult(result) {
    const isCorrect = result === 'correct';
    const msg = isCorrect ? "BONNE RÉPONSE !" : "MAUVAISE RÉPONSE";
    const color = isCorrect ? "#4ade80" : "#f87171";

    showOverlay(msg, isCorrect ? "+ Points" : "Dommage...", color);

    setTimeout(() => {
        ui.feedbackOverlay.style.display = 'none';
        // Retour à l'état initial du tour (bouton générer ou attente next state)
        // En général l'admin va changer de question ou d'équipe, donc on attend le prochain state_updated
        // Mais on peut remettre le bouton générer au cas où c'est la même qui rejoue
        ui.questionDisplay.style.display = 'none';
        ui.btnGenerer.style.display = 'block';
        ui.btnGenerer.textContent = "Prêt pour la suivante";
        ui.timer.textContent = "--";
    }, 4000);
}

function showOverlay(title, sub, color) {
    ui.feedbackContent.textContent = title;
    ui.feedbackContent.style.color = color;
    ui.feedbackSub.textContent = sub;
    ui.feedbackOverlay.style.display = 'flex';
}
