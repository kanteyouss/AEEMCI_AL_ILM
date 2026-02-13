const isProduction = process.env.NODE_ENV === 'production';

// Configuration de la connexion PostgreSQL
// On privilégie DATABASE_URL (automatique sur Render)
const poolConfig = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: isProduction ? { rejectUnauthorized: false } : false
    }
    : {
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'alilm2026',
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT || '5432'),
    };

const pool = new Pool({
    ...poolConfig,
    max: 20, // Nombre maximum de clients dans le pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

// Gestion des événements du pool
pool.on('connect', () => {
    console.log('✅ Nouvelle connexion à PostgreSQL établie');
});

pool.on('error', (err) => {
    console.error('❌ Erreur inattendue du client PostgreSQL', err);
    process.exit(-1);
});

// Fonction pour tester la connexion
const testConnection = async () => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        console.log('🗄️  Base de données connectée à:', result.rows[0].now);
        client.release();
        return true;
    } catch (err) {
        console.error('❌ Erreur de connexion à la base de données:', err.message);
        return false;
    }
};

// Exporter le pool et la fonction de test
module.exports = {
    query: (text, params) => pool.query(text, params),
    pool,
    testConnection
};
