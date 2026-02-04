require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Import des routes
const authRoutes = require('./routes/auth');
const participantsRoutes = require('./routes/participants');
const equipesRoutes = require('./routes/equipes');
const manchesRoutes = require('./routes/manches');
const rubriquesRoutes = require('./routes/rubriques');
const questionsRoutes = require('./routes/questions');
const soumissionsRoutes = require('./routes/soumissions');
const evaluationsRoutes = require('./routes/evaluations');
const scoresRoutes = require('./routes/scores');
const classementRoutes = require('./routes/classement');
const uploadRoutes = require('./routes/upload');

// Import du middleware d'erreur
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// CRÉATION AUTOMATIQUE DES DOSSIERS D'UPLOAD
// ============================================
const uploadsPath = path.join(__dirname, '../frontend/assets/uploads');
const uploadDirs = [
    path.join(uploadsPath, 'adhan'),
    path.join(uploadsPath, 'coran'),
    path.join(uploadsPath, 'hadith')
];

uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Dossier créé: ${dir}`);
    }
});

// ============================================
// MIDDLEWARES GLOBAUX
// ============================================
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (Frontend)
app.use(express.static(path.join(__dirname, '../frontend')));

// Servir les fichiers uploadés
app.use('/uploads', express.static(path.join(__dirname, '../frontend/assets/uploads')));

// Logging des requêtes (en développement)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
        next();
    });
}

// ============================================
// ROUTES API
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/participants', participantsRoutes);
app.use('/api/equipes', equipesRoutes);
app.use('/api/manches', manchesRoutes);
app.use('/api/rubriques', rubriquesRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/soumissions', soumissionsRoutes);
app.use('/api/evaluations', evaluationsRoutes);
app.use('/api/scores', scoresRoutes);
app.use('/api/classement', classementRoutes);
app.use('/api/upload', uploadRoutes);

// ============================================
// ROUTE RACINE (Pour tester le serveur)
// ============================================
app.get('/api', (req, res) => {
    res.json({
        message: 'Bienvenue sur l\'API du Jeu Concours AL ILM 2026 🕌',
        version: '1.0.0',
        organisation: 'AEEMCI - Section ESATIC',
        devise: 'Pour une identité islamique !',
        endpoints: {
            auth: '/api/auth',
            participants: '/api/participants',
            equipes: '/api/equipes',
            manches: '/api/manches',
            rubriques: '/api/rubriques',
            questions: '/api/questions',
            soumissions: '/api/soumissions',
            evaluations: '/api/evaluations',
            scores: '/api/scores',
            classement: '/api/classement',
            upload: '/api/upload'
        }
    });
});

// Toutes les autres routes servent index.html (SPA routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ============================================
// MIDDLEWARE DE GESTION D'ERREURS
// ============================================
app.use(errorHandler);

// ============================================
// DÉMARRAGE DU SERVEUR
// ============================================
app.listen(PORT, () => {
    console.log('\n🕌 ========================================');
    console.log(`   JEU CONCOURS AL ILM 2026`);
    console.log(`   AEEMCI - Section ESATIC`);
    console.log('========================================== 🕌\n');
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
    console.log(`\n🌙 Ramadan 2026 - Que la lumière de la connaissance vous guide !\n`);
});

module.exports = app;
