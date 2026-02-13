const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'alilm2026',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

const moreQuestions = [
    // JURISPRUDENCE (Rubrique 5)
    { rub: 5, q: "Qu'est-ce que le 'Tayammum' ?", r: "Ablution à sec avec de la terre ou du sable pur en l'absence d'eau.", diff: "moyen" },
    { rub: 5, q: "Peut-on faire la prière sans ablutions si on a oublié ?", r: "Non, la prière est invalide et doit être refaite après avoir fait les ablutions.", diff: "facile" },
    { rub: 5, q: "Qu'est-ce que la 'Sutrah' ?", r: "Un objet placé devant celui qui prie pour délimiter son espace et empêcher le passage.", diff: "difficile" },
    { rub: 5, q: "Combien de fois est-il Sunna de laver chaque membre pendant le Wudu ?", r: "Trois fois.", diff: "facile" },
    { rub: 5, q: "Que faire si on oublie le premier Tashahhud dans une prière de 4 Rak'at ?", r: "Continuer sa prière et effectuer deux prosternations de l'oubli (Sujud as-Sahw) avant le Salam.", diff: "difficile" },
    { rub: 5, q: "La zakat est-elle obligatoire sur la maison que l'on habite ?", r: "Non, la zakat ne s'applique pas à la résidence principale.", diff: "moyen" },
    { rub: 5, q: "Qu'est-ce que le 'Ihram' ?", r: "L'état de sacralisation rituelle pour accomplir le Hajj ou l'Omra.", diff: "moyen" },
    { rub: 5, q: "La prière du vendredi (Jumu'ah) est-elle obligatoire pour les femmes ?", r: "Non, elle est recommandée mais pas obligatoire (elles prient le Dhuhr).", diff: "moyen" },
    { rub: 5, q: "Le café ou le thé rompent-ils le jeûne ?", r: "Oui, toute consommation volontaire de boisson rompt le jeûne.", diff: "facile" },
    { rub: 5, q: "Peut-on essuyer sur ses chaussettes (Mash) pendant les ablutions ?", r: "Oui, sous certaines conditions (les avoir mises en état de pureté).", diff: "difficile" },

    // RELAIS (Rubrique 8)
    { rub: 8, q: "Comment s'appelait la première femme du Prophète ﷺ ?", r: "Khadija bint Khuwaylid.", diff: "facile", ref: "LISTE SUPPLEMENTAIRE" },
    { rub: 8, q: "Quel est le nom de la montagne où le Prophète ﷺ a reçu la première révélation ?", r: "Le mont Hira (Djebel an-Nour).", diff: "facile", ref: "LISTE SUPPLEMENTAIRE" },
    { rub: 8, q: "Combien de filles le Prophète ﷺ a-t-il eu ?", r: "Quatre (Zainab, Ruqayya, Umm Kulthum et Fatima).", diff: "moyen", ref: "LISTE SUPPLEMENTAIRE" },
    { rub: 8, q: "Quel prophète est surnommé 'Khalil Allah' (l'ami d'Allah) ?", r: "Ibrahim (Abraham).", diff: "facile", ref: "LISTE SUPPLEMENTAIRE" },
    { rub: 8, q: "Quelle ville était appelée Yathrib avant l'arrivée de l'Islam ?", r: "Médine (Al-Madinah).", diff: "facile", ref: "LISTE SUPPLEMENTAIRE" },
    { rub: 8, q: "Quel Calife a ordonné la compilation finale de l'exemplaire officiel du Coran (Mushaf) ?", r: "Othman ibn Affan.", diff: "moyen", ref: "LISTE SUPPLEMENTAIRE" },
    { rub: 8, q: "Comment s'appelle le voyage nocturne du Prophète ﷺ de la Mecque à Jérusalem ?", r: "Al-Isra.", diff: "moyen", ref: "LISTE SUPPLEMENTAIRE" },
    { rub: 8, q: "Quel est le premier mois du calendrier hégirien ?", r: "Mouharram.", diff: "moyen", ref: "LISTE SUPPLEMENTAIRE" },
    { rub: 8, q: "Quel prophète a été sauvé du déluge par l'arche ?", r: "Le prophète Nouh (Noé).", diff: "facile", ref: "LISTE SUPPLEMENTAIRE" },
    { rub: 8, q: "Qui a été surnommé 'Al-Farouq' parmi les califes ?", r: "Omar ibn al-Khattab.", diff: "difficile", ref: "LISTE SUPPLEMENTAIRE" }
];

async function addMoreQuestions() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log('📥 Ajout de 20 questions supplémentaires...');
        for (const q of moreQuestions) {
            await client.query(`
                INSERT INTO questions (rubrique_id, question_texte, reponse_correcte, type, difficulte, points, reference)
                VALUES ($1, $2, $3, 'texte_libre', $4, $5, $6)
            `, [q.rub, q.q, q.r, q.diff, q.rub === 5 ? 25 : 10, q.ref || null]);
            console.log(`✅ Ajouté (Rubrique ${q.rub}) : ${q.q.substring(0, 50)}...`);
        }

        await client.query('COMMIT');
        console.log('\n✨ Questions supplémentaires ajoutées avec succès !');

    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur :', e);
    } finally {
        client.release();
        await pool.end();
    }
}

addMoreQuestions();
