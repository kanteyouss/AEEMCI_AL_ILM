/**
 * Script pour mettre à jour les questions de la rubrique 'Hadith' 
 * avec les 10 premiers hadiths de l'Imam An-Nawawi (Texte Intégral + Source).
 */

require('dotenv').config();
const db = require('../config/database');

const NAWAWI_HADITHS = [
    {
        numero: 1,
        titre: "Les actes ne valent que par les intentions",
        texte: "D'après l'Émir des croyants, Abou Hafs 'Omar ibn al-Khattâb (qu'Allah l'agrée) qui a dit : « J'ai entendu l'Envoyé d'Allah (que la prière et la paix d'Allah soient sur lui) dire : « Certes, les œuvres ne valent que par les intentions et chaque individu sera rétribué en fonction de son intention. Ainsi, quiconque émigre vers Allah et Son Messager, alors son émigration est pour Allah et Son Messager ; et quiconque émigre pour obtenir quelque bien de ce bas monde, ou pour épouser une femme, son émigration ne lui sera comptée que pour ce vers quoi il a émigré. »\n\nSource : Rapporté par Al-Bukhari et Muslim."
    },
    {
        numero: 2,
        titre: "L'Islam, la foi et l'excellence (Ihsan)",
        texte: "D'après 'Omar (qu'Allah l'agrée) : « Un jour, alors que nous étions assis auprès de l'Envoyé d'Allah (que la prière et la paix d'Allah soient sur lui), voici qu'apparut à nous un homme aux vêtements d'une blancheur éclatante et aux cheveux d'une noirceur intense... [Il posa des questions sur l'Islam, la Foi et l'Excellence]... Puis l'homme partit. Le Prophète (que la prière et la paix d'Allah soient sur lui) me demanda : « Ô 'Omar, sais-tu qui m'a interrogé ? » Je répondis : « Allah et Son Messager savent mieux. » Il dit : « C'est Gabriel (Jibril) qui est venu vous enseigner votre religion. »\n\nSource : Rapporté par Muslim."
    },
    {
        numero: 3,
        titre: "Les piliers de l'Islam",
        texte: "D'après Abou Abd er-Rah'man, Abd Allah ibn Omar, ibn l-Khattab (qu'Allah l'agrée) : « J'ai entendu l'Envoyé de Dieu (que la prière et la paix d'Allah soient sur lui) dire : « L'Islam est bâti sur cinq piliers : 1. Le témoignage qu'il n'est d'autre Dieu qu'Allah et que Mohammed est Son Envoyé. 2. L'accomplissement de la prière rituelle. 3. L'acquittement de l'aumône (impôt rituel). 4. Le pèlerinage à la Maison de Dieu. 5. Le Jeûne du mois de Ramadan. »\n\nSource : Rapporté par Al-Bukhari et Muslim."
    },
    {
        numero: 4,
        titre: "La prédestination de l'homme",
        texte: "D'après 'Abdallah ibn Mas'ud (qu'Allah l'agrée) : « L'Envoyé d'Allah (que la prière et la paix d'Allah soient sur lui), le véridique, le digne de foi, nous a dit : « La création de chacun de vous s'accomplit dans le ventre de sa mère en quarante jours, sous forme de goutte de sperme... Ensuite, Allah lui envoie un Ange qui insuffle l'âme en lui et lui ordonne d'écrire quatre choses : sa subsistance, son terme, ses œuvres et s'il sera malheureux ou heureux... »\n\nSource : Rapporté par Al-Bukhari et Muslim."
    },
    {
        numero: 5,
        titre: "Rejet des innovations en religion",
        texte: "D'après la Mère des Croyants, Oumm Abdallah 'Aïcha (qu'Allah l'agrée) : « L'Envoyé de Dieu (que la prière et la paix d'Allah soient sur lui) a dit : « Quiconque apporte à notre religion une nouveauté qui n'en provient pas, celui-là est à repousser. »\n\nSource : Rapporté par Al-Bukhari et Muslim."
    },
    {
        numero: 6,
        titre: "Le licite et l'illicite sont évidents",
        texte: "D'après Abou Abdallah En-Noumân ben Bachîr (qu'Allah l'agrée) : « J'ai entendu l'Envoyé de Dieu (que la prière et la paix d'Allah soient sur lui) dire : « Certes, ce qui est permis est évident, et ce qui est interdit est évident aussi. Mais, entre l'un et l'autre, il y a bien des choses équivoques... Quiconque se préserve des choses équivoques, a certes mis à l'abri sa religion et son honneur... Certes, il y a dans le corps un morceau de chair : s'il est sain, tout le corps est sain... C'est le cœur. »\n\nSource : Rapporté par Al-Bukhari et Muslim."
    },
    {
        numero: 7,
        titre: "La religion est le bon conseil",
        texte: "D'après Abou Rouqayya Tamim ibn Aws Ad-Dari (qu'Allah l'agrée) : « Le Prophète (que la prière et la paix d'Allah soient sur lui) a dit : « La religion est le bon conseil (An-Nasiha). » Nous dîmes : « Pour qui ? » Il répondit : « Pour Allah, pour Son Livre, pour Son Messager, pour les dirigeants des Musulmans et pour l'ensemble des Musulmans. »\n\nSource : Rapporté par Muslim."
    },
    {
        numero: 8,
        titre: "Le caractère sacré du Musulman",
        texte: "D'après Ibn 'Omar (qu'Allah l'agrée) : « L'Envoyé d'Allah (que la prière et la paix d'Allah soient sur lui) a dit : « Il m'a été ordonné de combattre les gens jusqu'à ce qu'ils témoignent qu'il n'y a de divinité digne d'adoration qu'Allah et que Muhammad est Son Messager, qu'ils accomplissent la prière et qu'ils s'acquittent de la zakat. S'ils font cela, ils auront préservé vis-à-vis de moi leur sang et leurs biens... »\n\nSource : Rapporté par Al-Bukhari et Muslim."
    },
    {
        numero: 9,
        titre: "La responsabilité et le bon comportement",
        texte: "« J’ai entendu l’Envoyé de Dieu (que la prière et le salut d’Allah soient sur lui) dire :\n“Ce que je vous ai interdit, éloignez-vous-en ; et ce que je vous ai ordonné, accomplissez-le dans la mesure où cela vous est possible.\nCraignez Allah là où que vous soyez, et faites suivre une mauvaise action d’une bonne action qui l’efface ; et comportez-vous envers les gens avec une bonne conduite.” »\n\nSource : Rapporté par al-Boukhari et Mouslim (authentique)."
    },
    {
        numero: 10,
        titre: "Ne sont acceptées que les bonnes choses",
        texte: "D'après Abou Hourayra (qu'Allah l'agrée) : « L'Envoyé de Dieu (que la prière et la paix d'Allah soient sur lui) a dit : « Dieu le Très-Haut est bon et n'accepte que ce qui est bon. Sachez que Dieu a ordonné aux croyants ce qu'Il a ordonné aux Envoyés... Puis il parla de l'homme qui fait un long voyage... levant les mains au ciel criant : « Seigneur ! Seigneur ! », alors que sa nourriture est de source illicite... Il est loin pour que son invocation soit exaucée. »\n\nSource : Rapporté par Muslim."
    }
];

async function updateHadiths() {
    try {
        console.log('🔄 Mise à jour raffinée des Hadiths de Nawawi (Rubrique ID 7)...');

        // 1. Supprimer les anciennes questions Hadith
        await db.query('DELETE FROM questions WHERE rubrique_id = 7');
        console.log('🗑️ Anciennes questions supprimées.');

        // 2. Insérer les nouveaux Hadiths raffinés
        for (const hadith of NAWAWI_HADITHS) {
            const questionTexte = `Réciter le hadith ${hadith.numero} : ${hadith.titre}`;
            await db.query(
                `INSERT INTO questions (rubrique_id, question_texte, reponse_correcte, points, difficulte, type)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [7, questionTexte, hadith.texte, 20, 'moyen', 'texte_libre']
            );
            console.log(`✅ Hadith ${hadith.numero} raffiné ajouté : ${hadith.titre}`);
        }

        console.log('\n✨ Mise à jour raffinée terminée avec succès !');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors de la mise à jour :', error);
        process.exit(1);
    }
}

updateHadiths();
