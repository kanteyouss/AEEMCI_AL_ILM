require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { Client } = require('pg');

const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'alilm2026',
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432')
});

// Questions pour la rubrique Questions relais
const questionsRelais = [
    // Questions niveau facile (pour participants 1-2)
    {
        question: "Quel est le premier pilier de l'Islam ?",
        reponse: "La Shahada (l'attestation de foi)",
        difficulte: "facile"
    },
    {
        question: "Combien de fois par jour les musulmans prient-ils ?",
        reponse: "5 fois par jour",
        difficulte: "facile"
    },
    {
        question: "Quel est le livre sacré de l'Islam ?",
        reponse: "Le Coran",
        difficulte: "facile"
    },
    {
        question: "Dans quelle ville se trouve la Kaaba ?",
        reponse: "La Mecque (Makkah)",
        difficulte: "facile"
    },
    {
        question: "Quel est le mois du jeûne pour les musulmans ?",
        reponse: "Ramadan",
        difficulte: "facile"
    },
    
    // Questions niveau moyen (pour participants 2-3)
    {
        question: "Quel ange a révélé le Coran au Prophète Muhammad (ﷺ) ?",
        reponse: "Jibril (Gabriel)",
        difficulte: "moyen"
    },
    {
        question: "Combien de sourates compte le Coran ?",
        reponse: "114 sourates",
        difficulte: "moyen"
    },
    {
        question: "Quelle est la première sourate révélée au Prophète (ﷺ) ?",
        reponse: "Sourate Al-Alaq (L'adhérence)",
        difficulte: "moyen"
    },
    {
        question: "Combien de temps a duré la révélation du Coran ?",
        reponse: "23 ans",
        difficulte: "moyen"
    },
    {
        question: "Quel est le nom de la prière de la nuit durant Ramadan ?",
        reponse: "Tarawih",
        difficulte: "moyen"
    },
    
    // Questions niveau difficile (pour participants 3-4)
    {
        question: "Quel compagnon a été surnommé 'As-Siddiq' (le véridique) ?",
        reponse: "Abou Bakr",
        difficulte: "difficile"
    },
    {
        question: "En quelle année de l'hégire a eu lieu la bataille de Badr ?",
        reponse: "An 2 de l'hégire",
        difficulte: "difficile"
    },
    {
        question: "Quel calife a compilé le Coran en un seul mushaf ?",
        reponse: "Uthman ibn Affan",
        difficulte: "difficile"
    },
    {
        question: "Quelle sourate ne commence pas par 'Bismillah' ?",
        reponse: "Sourate At-Tawbah (Le repentir)",
        difficulte: "difficile"
    },
    {
        question: "Combien d'années le Prophète Nouh (Noé) a-t-il appelé son peuple ?",
        reponse: "950 ans",
        difficulte: "difficile"
    },
    
    // Questions culture générale islamique
    {
        question: "Quel est le dernier des prophètes de l'Islam ?",
        reponse: "Muhammad (ﷺ)",
        difficulte: "facile"
    },
    {
        question: "Quelle mosquée est la troisième plus sacrée de l'Islam ?",
        reponse: "Al-Aqsa (Jérusalem)",
        difficulte: "moyen"
    },
    {
        question: "Qui était la première épouse du Prophète (ﷺ) ?",
        reponse: "Khadija bint Khuwaylid",
        difficulte: "facile"
    },
    {
        question: "Quel compagnon a été surnommé 'Le Lion d'Allah' ?",
        reponse: "Hamza ibn Abdul-Muttalib",
        difficulte: "difficile"
    },
    {
        question: "Quel jour de la semaine est considéré comme le meilleur ?",
        reponse: "Le vendredi (Yawm al-Jumu'ah)",
        difficulte: "moyen"
    }
];

async function insertQuestionsRelais() {
    try {
        await client.connect();
        console.log('📡 Connexion à la base de données...\n');
        
        // Récupérer l'ID de la rubrique Questions relais
        const rubriqueResult = await client.query(`
            SELECT id FROM rubriques WHERE nom = 'Questions relais'
        `);
        
        if (rubriqueResult.rows.length === 0) {
            console.log('❌ Rubrique "Questions relais" introuvable');
            return;
        }
        
        const rubriqueId = rubriqueResult.rows[0].id;
        console.log(`✅ Rubrique trouvée (ID: ${rubriqueId})\n`);
        
        // Supprimer les anciennes questions relais
        await client.query(`
            DELETE FROM questions WHERE rubrique_id = $1
        `, [rubriqueId]);
        console.log('🗑️  Anciennes questions supprimées\n');
        
        // Insérer les nouvelles questions
        let inserted = 0;
        for (const q of questionsRelais) {
            await client.query(`
                INSERT INTO questions (
                    rubrique_id,
                    question_texte,
                    reponse_correcte,
                    type,
                    difficulte,
                    points
                ) VALUES ($1, $2, $3, $4, $5, $6)
            `, [rubriqueId, q.question, q.reponse, 'texte_libre', q.difficulte, 10]);
            inserted++;
        }
        
        console.log(`✅ ${inserted} questions insérées pour Questions relais\n`);
        
        // Afficher le résumé
        const stats = await client.query(`
            SELECT 
                difficulte,
                COUNT(*) as nombre
            FROM questions
            WHERE rubrique_id = $1
            GROUP BY difficulte
            ORDER BY 
                CASE difficulte
                    WHEN 'facile' THEN 1
                    WHEN 'moyen' THEN 2
                    WHEN 'difficile' THEN 3
                END
        `, [rubriqueId]);
        
        console.log('📊 Répartition par difficulté :');
        stats.rows.forEach(row => {
            const emoji = row.difficulte === 'facile' ? '🟢' : row.difficulte === 'moyen' ? '🟡' : '🔴';
            console.log(`   ${emoji} ${row.difficulte} : ${row.nombre} questions`);
        });
        
        console.log('\n💡 Conseil : Utilisez des questions faciles au début, difficiles à la fin du relais');
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        await client.end();
        console.log('\n🔌 Connexion fermée');
    }
}

insertQuestionsRelais();
