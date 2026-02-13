const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'alilm2026',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

const newQuestions = [
    // JURISPRUDENCE (PHASE ELIMINATOIRE) - Facile
    {
        texte: "Quelles sont les conditions d’obligation du jeûne ?",
        reponse: "L'Islam, la puberté, la raison, la santé (capacité), et la résidence (ne pas être en voyage).",
        difficulte: "facile"
    },
    {
        texte: "Quelles sont les conditions de validité du jeûne ?",
        reponse: "L'intention (Niyyah), l'abstention (manger/boire/sexe), la pureté (femmes), et le moment (Ramadan).",
        difficulte: "facile"
    },
    {
        texte: "Manger volontairement annule-t-il le jeûne ?",
        reponse: "Oui, cela l'annule et nécessite une réparation (Qada) et souvent une expiation (Kaffara).",
        difficulte: "facile"
    },
    {
        texte: "Manger par oubli annule-t-il ?",
        reponse: "Non, le jeûne reste valide selon la majorité des savants ('C'est Allah qui l'a nourri').",
        difficulte: "facile"
    },
    {
        texte: "Le vomissement volontaire annule-t-il ?",
        reponse: "Oui, s'il est provoqué. S'il est involontaire, non.",
        difficulte: "facile"
    },

    // JURISPRUDENCE (QUART DE FINAL) - Moyen
    {
        texte: "Quelles sont les obligations du wudû ?",
        reponse: "Intention, laver le visage, les bras (coudes), essuyer la tête, les pieds (chevilles), l'ordre et continuité.",
        difficulte: "moyen"
    },
    {
        texte: "Quelles sont les choses qui annulent le wudû ?",
        reponse: "Sortie de gaz/urine/excréments, sommeil profond, perte de conscience, toucher de parties intimes directement.",
        difficulte: "moyen"
    },
    {
        texte: "Quand le ghusl devient-il obligatoire ?",
        reponse: "Rapport sexuel, éjaculation, fin des règles (menstrues), fin des lochies, et le décès.",
        difficulte: "moyen"
    },
    {
        texte: "Toucher une femme annule-t-il le wudû ?",
        reponse: "Non, sauf s'il y a désir charnel ou contact direct voluptueux (selon les écoles Maliki/Shafi'i).",
        difficulte: "moyen"
    },
    {
        texte: "Peut-on faire le tayammum en présence d’eau ?",
        reponse: "Non, sauf si l'eau est inaccessible ou présente un danger réel pour la santé de l'individu.",
        difficulte: "moyen"
    },

    // JURISPRUDENCE (DEMI FINAL) - Difficile
    {
        texte: "Quelle est la différence entre pilier (rukn) et obligation (wâjib) ?",
        reponse: "Le pilier manquant invalide l'acte totalement. L'obligation manquée par oubli peut être compensée par Sujud as-Sahw.",
        difficulte: "difficile"
    },
    {
        texte: "La prière en groupe est-elle obligatoire ou recommandée ?",
        reponse: "C'est une Sunna Mouakkada (fortement recommandée) ou une obligation communautaire (Fard Kifaya) selon les avis.",
        difficulte: "difficile"
    },
    {
        texte: "Si on doute entre 3 et 4 rak‘ât, que fait-on ?",
        reponse: "On se base sur le nombre le plus petit (3), on termine la prière et on effectue la prosternation de l'oubli.",
        difficulte: "difficile"
    },
    {
        texte: "Rire pendant la prière annule-t-il ?",
        reponse: "Oui, le rire aux éclats annule la prière (et parfois les ablutions selon l'école Hanafi).",
        difficulte: "difficile"
    },
    {
        texte: "Peut-on prier en chaussures ?",
        reponse: "Oui, à condition qu'elles soient parfaitement pures (tahir). Le Prophète (ﷺ) a prié avec ses chaussures.",
        difficulte: "difficile"
    },

    // JURISPRUDENCE (FINAL) - Difficile
    {
        texte: "L’injection non nutritive annule-t-elle ?",
        reponse: "Non, les injections intramusculaires ou intraveineuses non nutritives n'annulent pas le jeûne.",
        difficulte: "difficile"
    },
    {
        texte: "L’intention est-elle obligatoire pour le wudû ?",
        reponse: "Oui, selon la majorité des écoles (Maliki, Shafi'i, Hanbali), car c'est un acte d'adoration.",
        difficulte: "difficile"
    },
    {
        texte: "L’eau qui change de couleur reste-t-elle pure ?",
        reponse: "Oui si le changement vient d'un élément pur (terre/feuilles). Non s'il vient d'une impureté (Nadjassa).",
        difficulte: "difficile"
    },
    {
        texte: "Oublier un pilier invalide-t-il la prière ?",
        reponse: "Oui, si on ne le rattrape pas immédiatement. Un pilier ne peut être remplacé par une prosternation d'oubli.",
        difficulte: "difficile"
    },
    {
        texte: "Le jeûne est-il valide si l’on oublie le ghusl avant Fajr ?",
        reponse: "Oui, le jeûne reste valide. On peut commencer le jeûne en état de Janaba et faire le ghusl après l'aube.",
        difficulte: "difficile"
    }
];

async function updateQuestions() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log('🧹 Suppression des anciennes questions de Jurisprudence (id: 5)...');
        await client.query('DELETE FROM questions WHERE rubrique_id = 5');

        console.log('📥 Insertion des 20 nouvelles questions...');
        for (const q of newQuestions) {
            await client.query(`
                INSERT INTO questions (rubrique_id, question_texte, reponse_correcte, type, difficulte, points)
                VALUES (5, $1, $2, 'texte_libre', $3, 25)
            `, [q.texte, q.reponse, q.difficulte]);
            console.log(`✅ Ajouté : ${q.texte.substring(0, 50)}...`);
        }

        await client.query('COMMIT');
        console.log('\n✨ Mise à jour terminée avec succès !');

    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur :', e);
    } finally {
        client.release();
        await pool.end();
    }
}

updateQuestions();
