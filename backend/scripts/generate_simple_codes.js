const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'alilm2026',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

async function generateAccessCodes() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log('🔑 Génération des codes d\'accès équipes...\n');

        // Récupérer toutes les équipes
        const res = await client.query('SELECT id, nom FROM equipes ORDER BY nom');
        const equipes = res.rows;

        const codes = [];

        for (const equipe of equipes) {
            // Nettoyer le nom pour créer une base de code
            // Ex: "AL-FURQAN" -> "FURQAN"
            // Ex: "AZ-ZAKIROUNE" -> "ZAKIROUNE"
            // Ex: "AS-SORBIROUNE" -> "SORBIROUNE"

            let baseName = equipe.nom.toUpperCase()
                .replace(/^AL[\s-]/, '')
                .replace(/^AZ[\s-]/, '')
                .replace(/^AS[\s-]/, '')
                .replace(/^AT[\s-]/, '')
                .replace(/^ASH[\s-]/, '')
                .replace(/[^A-Z]/g, '');

            // Si le nom est trop court, on garde tout
            if (baseName.length < 3) baseName = equipe.nom.toUpperCase().replace(/[^A-Z]/g, '');

            // Générer le code
            const code = `${baseName}024`;

            // Mettre à jour la DB
            await client.query('UPDATE equipes SET code_acces = $1 WHERE id = $2', [code, equipe.id]);

            codes.push({
                equipe: equipe.nom,
                code: code
            });

            console.log(`✅ ${equipe.nom} -> ${code}`);
        }

        await client.query('COMMIT');

        console.log('\n📋 LISTE DES CODES D\'ACCÈS GÉNÉRÉS :');
        console.log('==================================');
        codes.forEach(c => {
            console.log(`🔹 ${c.equipe.padEnd(20)} : ${c.code}`);
        });
        console.log('==================================');

    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur :', e);
    } finally {
        client.release();
        await pool.end();
    }
}

generateAccessCodes();
