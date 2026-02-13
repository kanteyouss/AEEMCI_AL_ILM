const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'alilm2026',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

const seerahQuestions = [
    { q: "Quels étaient les noms des parents du Prophète ﷺ ?", r: "Abdallah (père) et Amina (mère)." },
    { q: "Dans quelle ville et en quelle année est né le Prophète ﷺ ?", r: "À La Mecque, en l'an 570 (L'année de l'Éléphant)." },
    { q: "Qui était la nourrice (mère de lait) du Prophète ﷺ ?", r: "Halima Sa'diya." },
    { q: "Qui a pris soin du Prophète ﷺ après la mort de sa mère et de son grand-père ?", r: "Son oncle Abou Talib." },
    { q: "Comment appelait-on le Prophète ﷺ avant la révélation pour son honnêteté ?", r: "Al-Amin (Le digne de confiance)." },
    { q: "À quel âge le Prophète ﷺ a-t-il reçu la première révélation ?", r: "À 40 ans." },
    { q: "Dans quelle grotte le Prophète ﷺ a-t-il reçu les premiers versets ?", r: "La grotte de Hira (Djebel an-Nour)." },
    { q: "Quel est le premier mot révélé au Prophète ﷺ par l'ange Jibril ?", r: "Iqra (Lis !)." },
    { q: "Qui était la première femme à embrasser l'Islam ?", r: "Khadija bint Khuwaylid." },
    { q: "Qui était le premier homme (adulte) à embrasser l'Islam ?", r: "Abou Bakr As-Siddiq." },
    { q: "Qui était le premier enfant à embrasser l'Islam ?", r: "Ali ibn Abi Talib." },
    { q: "Comment appelle-t-on l'année où le Prophète ﷺ a perdu son épouse Khadija et son oncle Abou Talib ?", r: "L'année de la tristesse (Aam al-Huzn)." },
    { q: "Quel est le nom du voyage nocturne du Prophète ﷺ de La Mecque à Jérusalem puis aux cieux ?", r: "Al-Isra wal Mi'raj." },
    { q: "Vers quelle ville le Prophète ﷺ et les musulmans ont-ils émigré (Hijra) ?", r: "Yathrib (renommée Médine)." },
    { q: "Quelle est la première mosquée construite par le Prophète ﷺ à son arrivée à Médine ?", r: "La mosquée de Qouba." },
    { q: "Quelle fut la première grande bataille entre les musulmans et les Quraich ?", r: "La bataille de Badr." },
    { q: "En quelle année hégirienne a eu lieu la bataille de Badr ?", r: "En l'an 2 de l'Hégire." },
    { q: "Quelle bataille a suivi celle de Badr, où les musulmans ont subi des pertes ?", r: "La bataille d'Uhud." },
    { q: "Quel compagnon a été surnommé 'Le Lion d'Allah' et est tombé martyr à Uhud ?", r: "Hamza ibn Abd al-Muttalib." },
    { q: "Comment s'appelle le pacte de paix signé entre le Prophète ﷺ et les Mecquois ?", r: "Le pacte d'Al-Houdaybiyya." },
    { q: "En quelle année le Prophète ﷺ est-il retourné triomphalement à La Mecque ?", r: "En l'an 8 de l'Hégire (La conquête de La Mecque)." },
    { q: "Quel est le nom du dernier pèlerinage effectué par le Prophète ﷺ ?", r: "Le pèlerinage d'adieu (Hajjat al-Wada)." },
    { q: "En quelle année et à quel âge est décédé le Prophète ﷺ ?", r: "En l'an 11 de l'Hégire, à l'âge de 63 ans." },
    { q: "Combien d'années a duré la mission prophétique au total ?", r: "23 ans (13 à La Mecque et 10 à Médine)." },
    { q: "Quel compagnon a accompagné le Prophète ﷺ pendant sa Hijra vers Médine ?", r: "Abou Bakr As-Siddiq." },
    { q: "Comment appelait-on les habitants de Médine qui ont accueilli les émigrés ?", r: "Les Ansars (Les Auxiliaires)." },
    { q: "Comment appelait-on les musulmans qui ont émigré de La Mecque vers Médine ?", r: "Les Mouhajirines (Les Émigrés)." },
    { q: "Quel était le nom de la chamelle du Prophète ﷺ ?", r: "Al-Qaswa." },
    { q: "Qui était le poète officiel du Prophète ﷺ ?", r: "Hassan ibn Thabit." },
    { q: "Quelle épouse du Prophète ﷺ était la fille d'Abou Bakr ?", r: "Aïcha bint Abi Bakr." },
    { q: "Quelle fille du Prophète ﷺ était l'épouse d'Ali ibn Abi Talib ?", r: "Fatima Az-Zahra." },
    { q: "Comment s'appelait le fils du Prophète ﷺ né de Maria la Copte ?", r: "Ibrahim." },
    { q: "Quel compagnon le Prophète ﷺ a-t-il envoyé comme premier ambassadeur à Médine ?", r: "Mous'ab ibn 'Omayr." },
    { q: "Pendant combien d'années le Prophète ﷺ a-t-il prêché secrètement à La Mecque ?", r: "3 ans." },
    { q: "Quelles sont les deux tribus de Médine que le Prophète ﷺ a réconciliées ?", r: "Les Aws et les Khazraj." },
    { q: "Quel était le nom du grand-père du Prophète ﷺ qui l'a nommé Muhammad ?", r: "Abdul-Muttalib." },
    { q: "Quel miracle physique le Prophète ﷺ a-t-il accompli pour les Mecquois (mentionné dans le Coran) ?", r: "La fente de la lune (Inshiqaq al-Qamar)." },
    { q: "Quel était le métier du Prophète ﷺ dans sa jeunesse ?", r: "Berger, puis commerçant." },
    { q: "À quelle tribu appartenait le Prophète ﷺ ?", r: "La tribu des Quraish (clan des Banu Hashim)." },
    { q: "Où le Prophète ﷺ a-t-il été enterré ?", r: "À Médine, dans la chambre d'Aïcha (aujourd'hui dans la Mosquée du Prophète)." }
];

async function addSeerahQuestions() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log('📥 Insertion des 40 questions Seerah (Rubrique ID: 4)...');
        for (const q of seerahQuestions) {
            await client.query(`
                INSERT INTO questions (rubrique_id, question_texte, reponse_correcte, type, difficulte, points)
                VALUES (4, $1, $2, 'texte_libre', 'facile', 15)
            `, [q.q, q.r]);
        }

        await client.query('COMMIT');
        console.log('\n✨ 40 questions Seerah ajoutées avec succès !');

    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur :', e);
    } finally {
        client.release();
        await pool.end();
    }
}

addSeerahQuestions();
