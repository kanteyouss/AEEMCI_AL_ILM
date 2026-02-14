// ============================================
// DASHBOARD ÉQUIPE - AL ILM 2026
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Dashboard Equipe chargé (v2.0)');
    // Vérifier l'authentification
    const user = getUser();
    if (!user || user.type !== 'equipe') {
        window.location.href = '/login.html';
        return;
    }

    try {
        await loadTeamData(user.id);
    } catch (error) {
        console.error('Erreur chargement dashboard:', error);
        alert('Impossible de charger les données de l\'équipe');
    }
    // Gestion de la déconnexion
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            console.log('Déconnexion...');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login.html';
        });
    }
});

async function loadTeamData(teamId) {
    const loading = document.getElementById('loading');
    const content = document.getElementById('dashboardContent');

    try {
        // Appels parallèles : Info équipe uniquement
        const response = await apiRequest(`/equipes/${teamId}`);

        if (!response.success) throw new Error('Erreur données équipe');

        const team = response.data;
        const members = team.membres || [];

        // 1. Remplir Header
        document.getElementById('teamName').textContent = team.nom;
        document.getElementById('teamSignification').textContent = team.signification || 'Aucune devise';
        document.getElementById('memberCount').textContent = `${members.length} membres`;

        // 2. Remplir Membres
        renderMembers(members);

        // 3. Prochaine Manche
        renderNextEvent(teamId);

        // Afficher le contenu
        loading.style.display = 'none';
        content.style.display = 'block';

        // Initialiser le Socket pour le mode Collectif LIVE
        initSocketConnection(teamId, team.nom);

    } catch (error) {
        console.error(error);
        loading.innerHTML = `<p style="color: red">Erreur: ${error.message}</p>`;
    }
}

async function renderNextEvent(teamId) {
    const container = document.getElementById('nextEventContent');

    try {
        // Récupérer à la fois les manches publiées et celles en cours
        const [publieRes, enCoursRes] = await Promise.all([
            apiRequest('/manches?statut=publie'),
            apiRequest('/manches?statut=en_cours')
        ]);

        let allManches = [];
        if (publieRes.success) allManches = [...allManches, ...publieRes.data];
        if (enCoursRes.success) allManches = [...allManches, ...enCoursRes.data];

        if (!allManches.length) {
            container.innerHTML = `
                <div style="padding: 1.5rem; background: #fff5f5; border-radius: 12px; border: 1px solid #fee2e2;">
                    <h3 style="color: #c53030; margin: 0 0 0.5rem 0; font-weight: 800;">Épreuves à venir</h3>
                    <p style="margin: 0; color: #7f1d1d;">Aucune manche publiée pour l'instant.</p>
                </div>
            `;
            return;
        }

        // Garder les manches d'aujourd'hui et futures, triées par date
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const upcomingManches = allManches
            .filter(m => new Date(m.date_manche) >= now)
            .sort((a, b) => {
                const dateA = new Date(a.date_manche);
                const dateB = new Date(b.date_manche);
                if (dateA.getTime() !== dateB.getTime()) return dateA - dateB;
                // Si même date, trier par heure de début
                return (a.heure_debut || "").localeCompare(b.heure_debut || "");
            });

        if (!upcomingManches.length) {
            container.innerHTML = `
                <div style="padding: 1.5rem; background: #f0f9ff; border-radius: 12px; border: 1px solid #e0f2fe;">
                    <h3 style="color: #0369a1; margin: 0 0 0.5rem 0; font-weight: 800;">Calendrier terminé</h3>
                    <p style="margin: 0; color: #0c4a6e;">Toutes les manches prévues sont terminées.</p>
                </div>
            `;
            return;
        }

        // Générer le HTML pour chaque manche
        container.innerHTML = `
            <div class="calendar-list" style="display: flex; flex-direction: column; gap: 1.5rem;">
                ${upcomingManches.map(manche => {
            const participe = manche.equipes && manche.equipes.some(e => e.id == teamId);
            const date = new Date(manche.date_manche).toLocaleDateString('fr-FR', {
                weekday: 'short', day: 'numeric', month: 'short'
            });
            const heure = manche.heure_debut ? manche.heure_debut.substring(0, 5) : '--:--';

            // Mapping Type
            const typeLabels = {
                'preliminaire': 'Phase Élim.',
                'quart': '1/4 Finale',
                'demi': '1/2 Finale',
                'finale': 'Finale'
            };
            const typeLabel = typeLabels[manche.type] || manche.type.toUpperCase();

            // Mapping Statut
            let statutLabel = 'À venir';
            let statutClass = 'badge-statut a-venir';

            if (manche.statut === 'en_cours') {
                statutLabel = 'En Direct';
                statutClass = 'badge-statut en-cours';
            }

            return `
                        <div class="calendar-item next-event-card ${participe ? 'participation-confirmed' : ''}" 
                             style="padding: 1.25rem; margin-bottom: 0;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                                <div style="display: flex; gap: 0.5rem;">
                                    <span class="${statutClass}">${statutLabel}</span>
                                    <span class="badge-type">${typeLabel}</span>
                                </div>
                                ${participe ? `
                                    <span style="font-size: 0.75rem; font-weight: 800; color: #059669; background: #d1fae5; padding: 2px 8px; border-radius: 4px; text-transform: uppercase;">
                                        Ma Participation
                                    </span>
                                ` : `
                                    <span style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">
                                        Spectateur
                                    </span>
                                `}
                            </div>
                            
                            <h4 style="color: #1e293b; margin: 0.25rem 0; font-size:1.1rem; font-weight: 800;">
                                ${manche.nom}
                            </h4>
                            
                            <p style="font-weight: 600; color: #64748b; font-size: 0.9rem; margin-bottom: 0;">
                                ${date} à ${heure} • <span style="font-weight: 500;">${manche.lieu || 'ESATIC'}</span>
                            </p>
                        </div>
                    `;
        }).join('')}
            </div>
        `;

    } catch (error) {
        console.error('Erreur chargement calendrier:', error);
        container.innerHTML = `<p style="color: #ef4444; font-weight: 600;">Erreur lors de la récupération du calendrier.</p>`;
    }
}


function renderMembers(members) {
    const list = document.getElementById('memberList');
    const captainBadge = document.getElementById('captainName');

    const membersList = Array.isArray(members) ? members : (members.data || []);

    list.innerHTML = membersList.map(m => {
        const isCaptain = m.est_capitaine;
        if (isCaptain && captainBadge) captainBadge.textContent = `${m.prenom} ${m.nom}`;

        const roles = [];
        if (m.genre) roles.push(`<span class="role-tag">${m.genre}</span>`);
        if (m.role_adhan) roles.push('<span class="role-tag" style="background:rgba(3,105,161,0.1); color:#7dd3fc; border-color:rgba(3,105,161,0.2);">Adhan</span>');
        if (m.role_coran_ouvert) roles.push('<span class="role-tag" style="background:rgba(22,101,52,0.1); color:#86efac; border-color:rgba(22,101,52,0.2);">Coran Ouvert</span>');
        if (m.role_coran_ferme) roles.push('<span class="role-tag" style="background:rgba(22,101,52,0.1); color:#86efac; border-color:rgba(22,101,52,0.2);">Coran Fermé</span>');
        if (m.role_hadith) roles.push('<span class="role-tag" style="background:rgba(153,27,27,0.1); color:#fca5a5; border-color:rgba(153,27,27,0.2);">Hadith</span>');

        if (roles.length === 0) roles.push('<span class="role-tag">Candidat</span>');

        return `
            <li class="member-item">
                <div class="member-avatar ${isCaptain ? 'captain-avatar' : ''}">
                    ${m.prenom.charAt(0)}${m.nom.charAt(0)}
                </div>
                <div class="member-info">
                    <div class="member-name">
                        ${m.prenom} ${m.nom}
                        ${isCaptain ? '<span class="captain-badge-minimal">Capitaine</span>' : ''}
                    </div>
                    <div class="member-role" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        ${roles.join('')}
                    </div>
                </div>
            </li>
        `;
    }).join('');
}

// ============================================
// MODE COLLECTIF NUMÉRIQUE (Socket.IO)
// ============================================

let socket = null;
let currentQuestionId = null;
let liveTimerInterval = null;

function initSocketConnection(teamId, teamName) {
    if (typeof io === 'undefined') {
        const script = document.createElement('script');
        script.src = '/socket.io/socket.io.js';
        script.onload = () => setupSocket(teamId, teamName);
        document.body.appendChild(script);
    } else {
        setupSocket(teamId, teamName);
    }
}

function setupSocket(teamId, teamName) {
    socket = io();

    socket.emit('join_game', { role: 'candidat', equipeId: teamId });
    console.log('Connecté au serveur de jeu');

    socket.on('new_question', (data) => {
        if (data.question.mode === 'collectif') {
            console.log('Nouvelle épreuve collective détectée');
            localStorage.setItem('last_question_content', data.question.question_texte);
            startLiveGame(data);
        }
    });

    socket.on('timer_start', (data) => {
        console.log('Début du décompte');
        runLiveTimer(data.duration || 30);
    });

    socket.on('force_submit', () => {
        console.warn('Fin du temps réglementaire - Envoi forcé');
        submitLiveAnswer(true);
    });

    socket.on('question_result', () => {
        // Optionnel : Feedback de clôture
    });

    // Gestion de la reconnexion / état initial
    socket.on('game_state', (state) => {
        console.log('État du jeu reçu:', state);
        if (state.question) {
            console.log('Restauration de la question en cours...');
            // Adaptation du format pour startLiveGame
            const data = {
                question: {
                    ...state.question,
                    mode: 'collectif' // Forcer le mode si absent
                }
            };
            startLiveGame(data);

            // Si le timer tourne, on pourrait aussi le synchroniser
            if (state.isTimerRunning && state.tempsRestant > 0) {
                runLiveTimer(state.tempsRestant);
            }
        } else {
            // Pas de question active, on s'assure que l'overlay est caché
            document.getElementById('liveGameSection').style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Gestion de l'Interface Live

function startLiveGame(data) {
    const section = document.getElementById('liveGameSection');
    const waiting = document.getElementById('liveWaitingState');
    const active = document.getElementById('liveQuestionState');
    const submitted = document.getElementById('liveSubmittedState');

    // Reset UI
    waiting.style.display = 'none';
    active.style.display = 'block';
    submitted.style.display = 'none';

    // Afficher section plein écran
    section.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Remplir Question
    const q = data.question;
    console.log('🔴 Question reçue Dashboard:', q);
    console.log('Type:', q.type);
    console.log('Options:', q.options);

    currentQuestionId = q.id;
    document.getElementById('liveQuestionText').textContent = q.question_texte;
    document.getElementById('liveTeamName').textContent = document.getElementById('teamName').textContent;
    document.getElementById('liveTitle').textContent = q.nom_manche || 'ÉPREUVE EN DIRECT';

    // Champs Réponse
    const inputArea = document.getElementById('liveInputMode');
    const qcmArea = document.getElementById('liveQcmMode');
    const textArea = document.getElementById('liveResponseInput');

    textArea.value = '';
    textArea.disabled = true;
    document.getElementById('btnSubmitLive').disabled = true;

    if ((q.type || '').trim().toLowerCase() === 'qcm') {
        inputArea.style.display = 'none';
        qcmArea.style.display = 'grid';
        qcmArea.innerHTML = '';

        // Fallback ultime : si options manquantes, on les génère
        if (!q.options || Object.keys(q.options).length === 0) {
            console.warn('⚠️ Options manquantes pour QCM, génération par défaut');
            q.options = {
                A: "Réponse A",
                B: "Réponse B",
                C: "Réponse C"
            };
        }

        ['A', 'B', 'C', 'D'].forEach(opt => {
            // Check if options exist and are not empty
            if (q.options && q.options[opt]) {
                const btn = document.createElement('button');
                btn.className = 'qcm-btn';
                btn.textContent = `${opt}. ${q.options[opt]}`;
                btn.onclick = () => selectQcmOption(btn, opt);
                qcmArea.appendChild(btn);
            }
        });
    } else {
        inputArea.style.display = 'block';
        qcmArea.style.display = 'none';
    }

    // Timer UI Reset
    document.getElementById('liveTimerFill').style.width = '100%';
    document.getElementById('liveTimerText').textContent = "PRÉPARATION...";
}

let selectedQcmOption = null;

function selectQcmOption(btn, value) {
    const buttons = document.getElementById('liveQcmMode').querySelectorAll('.qcm-btn');
    buttons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedQcmOption = value;
}

function runLiveTimer(duration) {
    // Activer les champs
    document.getElementById('liveResponseInput').disabled = false;
    document.getElementById('btnSubmitLive').disabled = false;
    document.getElementById('liveResponseInput').focus();

    let timeLeft = duration;
    const fill = document.getElementById('liveTimerFill');
    const text = document.getElementById('liveTimerText');

    if (liveTimerInterval) clearInterval(liveTimerInterval);

    fill.style.transition = `width ${duration}s linear`;
    setTimeout(() => fill.style.width = '0%', 50);

    text.textContent = timeLeft + " s";

    liveTimerInterval = setInterval(() => {
        timeLeft--;
        text.textContent = timeLeft + " s";
        if (timeLeft <= 5) text.style.color = '#dc2626';

        if (timeLeft <= 0) {
            clearInterval(liveTimerInterval);
            text.textContent = "TEMPS ÉCOULÉ";
            submitLiveAnswer(true);
        }
    }, 1000);

    document.getElementById('btnSubmitLive').onclick = () => submitLiveAnswer(false);
}

function submitLiveAnswer(forced = false) {
    if (liveTimerInterval) clearInterval(liveTimerInterval);

    let content = '';
    const qcmMode = document.getElementById('liveQcmMode').style.display !== 'none';

    if (qcmMode) {
        content = selectedQcmOption || '';
    } else {
        content = document.getElementById('liveResponseInput').value;
    }

    const payload = {
        equipeId: getUser().id,
        questionId: currentQuestionId,
        content: content,
        forced: forced
    };

    console.log('Soumission de la réponse:', payload);
    socket.emit('team_submit_answer', payload);

    document.getElementById('liveQuestionState').style.display = 'none';
    document.getElementById('liveSubmittedState').style.display = 'block';
}


