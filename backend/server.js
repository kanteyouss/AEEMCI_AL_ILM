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
const notationRoutes = require('./routes/notation');
const jeuRoutes = require('./routes/jeu');

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
app.use('/api/classement-config', require('./routes/classement-config'));
app.use('/api/notation', notationRoutes);
app.use('/api/jeu', jeuRoutes);
app.use('/api/upload', uploadRoutes);

// ============================================
// ENDPOINT TEMPORAIRE DE MIGRATION
// ============================================
app.get('/api/migrate-etapes', async (req, res) => {
    const db = require('./config/database');
    const client = await db.pool.connect();
    try {
        // 1. Ajouter colonne etape
        await client.query(`ALTER TABLE manches ADD COLUMN IF NOT EXISTS etape VARCHAR(50) DEFAULT 'preliminaire'`);

        // 2. Mettre à jour les manches existantes selon leur type
        await client.query(`UPDATE manches SET etape = type WHERE type IN ('preliminaire', 'quart', 'demi', 'finale')`);

        // 3. Ajouter config etape_publiee
        await client.query(`
            INSERT INTO classement_config (cle, valeur, type, description) 
            VALUES ('etape_publiee', '', 'text', 'Code de l''étape actuellement publiée')
            ON CONFLICT (cle) DO NOTHING
        `);

        // 4. Vérifier
        const manchesResult = await client.query(`SELECT id, nom, numero, type, etape FROM manches ORDER BY numero`);
        const configResult = await client.query(`SELECT * FROM classement_config WHERE cle = 'etape_publiee'`);

        res.json({
            success: true,
            message: 'Migration réussie !',
            manches: manchesResult.rows,
            config: configResult.rows[0]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    } finally {
        client.release();
    }
});

// ============================================
// ENDPOINT DE SANTÉ (Diagnostic)
// ============================================
app.get('/api/health', (req, res) => {
    res.json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        database: 'Connected' // On suppose que si le serveur tourne, la DB est OK ou sera testée ici plus tard
    });
});

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
            health: '/api/health',
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
// ============================================
// DÉMARRAGE DU SERVEUR
// ============================================
const server = require('http').createServer(app);
const io = require('./socket/gameHandler')(server);

// Rendre io accessible dans les routes via req.app.get('io')
app.set('io', io);

server.listen(PORT, () => {
    console.log('\n🕌 ========================================');
    console.log(`   JEU CONCOURS AL ILM 2026`);
    console.log(`   AEEMCI - Section ESATIC`);
    console.log('========================================== 🕌\n');
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
    console.log(` URL: http://localhost:${PORT}`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
    console.log(`\n🌙 Ramadan 2026 - Que la lumière de la connaissance vous guide !\n`);
});

module.exports = app;
