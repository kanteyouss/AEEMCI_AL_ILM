const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'alilm2026',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

const complexQuestions = [
    // MATHÉMATIQUES AVANCÉES (Limites, Dérivées, Intégrales)
    { q: "Calcul : Quelle est la dérivée de f(x) = 3x² + 2x - 5 ?", r: "f'(x) = 6x + 2" },
    { q: "Calcul : Limite de (x² - 4)/(x - 2) quand x tend vers 2 ?", r: "4" },
    { q: "Calcul : Intégrale de ∫(2x + 3)dx ?", r: "x² + 3x + C" },
    { q: "Calcul : Dérivée de f(x) = x³ - 6x² + 9x ?", r: "f'(x) = 3x² - 12x + 9" },
    { q: "Calcul : Limite de (sin x)/x quand x tend vers 0 ?", r: "1" },
    { q: "Calcul : Intégrale de ∫x²dx entre 0 et 2 ?", r: "8/3" },
    { q: "Calcul : Résoudre l'équation : 2x² - 8x + 6 = 0", r: "x = 1 ou x = 3" },
    { q: "Calcul : Dérivée de f(x) = ln(x) ?", r: "f'(x) = 1/x" },
    { q: "Calcul : Primitive de f(x) = cos(x) ?", r: "F(x) = sin(x) + C" },
    { q: "Calcul : Développer (x + 3)² ?", r: "x² + 6x + 9" },
    { q: "Calcul : Factoriser x² - 9 ?", r: "(x - 3)(x + 3)" },
    { q: "Calcul : Résoudre : 3x - 7 = 2x + 5 ?", r: "x = 12" },
    { q: "Calcul : Si f(x) = e^x, quelle est f'(x) ?", r: "e^x" },

    // QUESTIONS DE RÉFLEXION COMPLEXES (Côte d'Ivoire & Islam)
    { q: "Réflexion : Quel est le lien entre la politique de l'Houphouëtisme et le développement économique de la Côte d'Ivoire post-indépendance ?", r: "Politique de dialogue, coopération avec la France, agriculture d'exportation (cacao, café)." },
    { q: "Réflexion : Expliquez le concept de 'Tawhid' en Islam et son importance théologique.", r: "L'unicité absolue d'Allah, fondement de la foi musulmane, rejet de tout associationnisme (shirk)." },
    { q: "Réflexion : Quelle est la différence entre le Hajj et la Omra ?", r: "Le Hajj est obligatoire une fois dans la vie (pilier), la Omra est recommandée et peut se faire toute l'année." },
    { q: "Réflexion : Analysez l'impact de la crise politico-militaire de 2002-2011 sur l'économie ivoirienne.", r: "Division du pays, ralentissement économique, destruction d'infrastructures, baisse des investissements étrangers." },
    { q: "Réflexion : Qu'est-ce que le 'Ijtihad' en jurisprudence islamique ?", r: "L'effort d'interprétation des textes par les savants qualifiés pour répondre aux nouvelles situations." },
    { q: "Réflexion : Expliquez le rôle du CEDEAO dans la résolution des crises en Côte d'Ivoire.", r: "Médiation, sanctions, déploiement de forces de maintien de la paix, facilitation du dialogue politique." },
    { q: "Réflexion : Quelle est la différence entre Sunna et Hadith ?", r: "La Sunna est l'ensemble des pratiques du Prophète ﷺ, le Hadith est le récit rapportant ses paroles et actes." },
    { q: "Réflexion : Analysez les enjeux de la diversité ethnique en Côte d'Ivoire (Akan, Mandé, Krou, Gur).", r: "Cohabitation pacifique, équilibre politique, gestion de l'ivoirité, unité nationale." },
    { q: "Réflexion : Qu'est-ce que le 'Fiqh' et comment diffère-t-il de la Charia ?", r: "Le Fiqh est la jurisprudence (interprétation humaine), la Charia est la loi divine révélée." },
    { q: "Réflexion : Expliquez le système de la 'Françafrique' et son impact sur la Côte d'Ivoire.", r: "Relations privilégiées France-Afrique, influence politique et économique, franc CFA, accords de défense." },
    { q: "Réflexion : Quelle est la signification du 'Laylatul Qadr' et pourquoi est-elle importante ?", r: "Nuit du Destin, révélation du Coran, meilleure que mille mois, recherchée dans les 10 derniers jours de Ramadan." },
    { q: "Réflexion : Analysez le rôle du cacao dans l'économie ivoirienne depuis l'indépendance.", r: "1er producteur mondial, 40% des recettes d'exportation, vulnérabilité aux cours mondiaux, dépendance économique." },
    { q: "Réflexion : Qu'est-ce que le 'Bid'ah' en Islam et pourquoi est-il problématique ?", r: "Innovation religieuse non fondée sur le Coran et la Sunna, risque de dévier de la voie prophétique." }
];

async function upgradeToComplexQuestions() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log('🧹 Suppression des questions trop faciles...');

        // Supprimer les questions géographiques basiques
        await client.query(`
            DELETE FROM questions 
            WHERE rubrique_id = 6 
            AND (
                question_texte LIKE '%capitale politique de la Côte d''Ivoire%' OR
                question_texte LIKE '%capitale économique de la Côte d''Ivoire%' OR
                question_texte LIKE '%premier président de la République de Côte d''Ivoire%' OR
                question_texte LIKE '%date de l''indépendance de la Côte d''Ivoire%' OR
                question_texte LIKE '%couleurs du drapeau ivoirien%' OR
                question_texte LIKE '%hymne national de la Côte d''Ivoire%' OR
                question_texte LIKE '%actuel président de la Côte d''Ivoire%' OR
                question_texte LIKE '%principal produit d''exportation de la Côte d''Ivoire%' OR
                question_texte LIKE '%point culminant de la Côte d''Ivoire%' OR
                question_texte LIKE '%port autonome d''Abidjan%' OR
                question_texte LIKE '%sculpteur ivoirien%' OR
                question_texte LIKE '%livre a été révélé au prophète Issa%'
            )
        `);

        // Supprimer les calculs trop simples restants
        await client.query(`
            DELETE FROM questions 
            WHERE rubrique_id = 6 
            AND question_texte LIKE 'Calcul :%'
            AND (
                question_texte LIKE '%15 x 4%' OR
                question_texte LIKE '%125 + 75%' OR
                question_texte LIKE '%Le tiers de 90%' OR
                question_texte LIKE '%8 x 7%' OR
                question_texte LIKE '%1000 - 350%' OR
                question_texte LIKE '%9 x 9%' OR
                question_texte LIKE '%7 x 9%' OR
                question_texte LIKE '%200 ÷ 4%' OR
                question_texte LIKE '%100 x 0,5%' OR
                question_texte LIKE '%17 + 18%' OR
                question_texte LIKE '%6 x 8%' OR
                question_texte LIKE '%500 - 125%' OR
                question_texte LIKE '%10 x 10 x 10%'
            )
        `);

        console.log('📥 Insertion de questions de réflexion complexes...');
        for (const q of complexQuestions) {
            await client.query(`
                INSERT INTO questions (rubrique_id, question_texte, reponse_correcte, type, difficulte, points)
                VALUES (6, $1, $2, 'texte_libre', 'difficile', 25)
            `, [q.q, q.r]);
        }

        await client.query('COMMIT');
        console.log('\n✨ Questions complexes ajoutées avec succès !');
        console.log('📊 Total : 26 questions de haut niveau (13 maths avancées + 13 réflexion)');

    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur :', e);
    } finally {
        client.release();
        await pool.end();
    }
}

upgradeToComplexQuestions();
