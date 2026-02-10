const socketIO = require('socket.io');

module.exports = (server) => {
    const io = socketIO(server, {
        cors: {
            origin: "*", // A ajuster en prod
            methods: ["GET", "POST"]
        }
    });

    // État du jeu en mémoire (simple)
    let gameState = {
        mancheId: null,
        rubriqueId: null,
        equipeId: null,
        question: null, // La question en cours (avec réponse pour admin, sans pour candidat)
        timer: null,
        isTimerRunning: false,
        tempsRestant: 0
    };

    io.on('connection', (socket) => {
        console.log('Nouveau client connecté:', socket.id);

        // Rejoindre une room (admin ou candidat)
        socket.on('join_game', (data) => {
            const { role, mancheId } = data; // role: 'admin' | 'candidat' | 'public'

            if (role === 'public' || role === 'candidat') {
                socket.join('public_room'); // Room globale pour l'affichage
                console.log(`Client ${socket.id} joined public_room`);
            }

            if (mancheId && mancheId !== 'all') {
                socket.join(`manche_${mancheId}`);
            }

            // Envoyer l'état actuel au nouveau venu
            socket.emit('game_state', {
                mancheId: gameState.mancheId, // On envoie aussi la manche active
                rubriqueId: gameState.rubriqueId,
                equipeId: gameState.equipeId,
                equipeNom: gameState.equipeNom, // Il faudra stocker le nom pour l'affichage facile
                question: gameState.question ? (role === 'admin' ? gameState.question : { ...gameState.question, reponse_correcte: undefined, reponse_text: undefined }) : null,
                tempsRestant: gameState.tempsRestant,
                isTimerRunning: gameState.isTimerRunning
            });
        });

        // ADMIN: Activer une rubrique/équipe
        socket.on('set_active_state', (data) => {
            // data: { mancheId, rubriqueId, equipeId, equipeNom, mancheNom }
            // On ajoute les noms pour simplifier l'affichage côté client sans requêtes
            gameState.mancheId = data.mancheId;
            gameState.rubriqueId = data.rubriqueId;
            gameState.equipeId = data.equipeId;
            gameState.equipeNom = data.equipeNom;
            gameState.mancheNom = data.mancheNom;

            gameState.question = null;
            gameState.tempsRestant = 0;

            // Diffuser à tout le monde (Public + Admins)
            io.to('public_room').emit('state_updated', {
                mancheId: data.mancheId,
                mancheNom: data.mancheNom,
                rubriqueId: data.rubriqueId,
                equipeId: data.equipeId,
                equipeNom: data.equipeNom
            });
        });

        // CANDIDAT: Demander à générer une question
        socket.on('request_question_generation', async (data) => {
            // data: { mancheId }
            // Sécurité : Vérifier si c'est autorisé (rubrique active, pas de question en cours...)
            if (!gameState.rubriqueId || !gameState.equipeId) return;

            // Émettre un événement vers l'admin pour qu'il fasse l'appel API (ou le faire ici, mais l'architecture actuelle sépare bien)
            // Pour simplifier et sécuriser, on va demander à l'admin (client) de faire la requête API
            // OU MIEUX : Le serveur fait la requête DB ici. 
            // Vu que j'ai pas accès facile aux controllers ici sans refacto, 
            // on va émettre un event 'admin_generate_question' que le client Admin écoutera pour faire l'appel API.
            // C'est un pattern un peu hybride mais ça évite de dupliquer la logique de génération.

            // MAIS attendez, le client Admin va recevoir ça et faire fetch('/api/jeu/generer').

            io.to(`manche_${data.mancheId}`).emit('admin_trigger_generation', {
                rubriqueId: gameState.rubriqueId,
                equipeId: gameState.equipeId
            });
        });

        // ADMIN: Question générée (après appel API)
        socket.on('question_generated', (data) => {
            // data: { question, temps }
            gameState.question = data.question;
            gameState.tempsRestant = data.temps;
            gameState.isTimerRunning = true; // On lance le timer

            // Diffuser aux candidats (SANITIZED)
            const questionCandidat = {
                ...data.question,
                reponse_correcte: undefined, // Masquer la réponse
                reponse_text: undefined
            };

            // Diffuser à tout le monde
            io.to('public_room').emit('new_question', {
                audio_url: data.question.audio_url,
                question: questionCandidat,
                temps: data.temps
            });

            // Diffuser la réponse UNIQUEMENT aux admins (s'ils sont dans une room spécifique admin, sinon l'admin a déjà la donnée locale)
            // L'admin a déjà la donnée car c'est lui qui a émis 'question_generated'.
        });

        // TIMER SYNC (L'admin est le maître du temps)
        socket.on('timer_sync', (data) => {
            // data: { tempsRestant, mancheId }
            gameState.tempsRestant = data.tempsRestant;
            io.to('public_room').emit('timer_update', { tempsRestant: data.tempsRestant });
        });

        // ADMIN: Fin du timer / Validation
        socket.on('end_question', (data) => {
            // data: { mancheId, result } // result = 'correct', 'incorrect', 'timeout'
            gameState.isTimerRunning = false;
            // gameState.question = null; // On garde pour l'instant

            io.to('public_room').emit('question_result', { result: data.result });
        });

        socket.on('disconnect', () => {
            console.log('Client déconnecté:', socket.id);
        });
    });

    return io;
};
