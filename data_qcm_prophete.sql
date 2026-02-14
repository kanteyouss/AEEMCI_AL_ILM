DO $$
DECLARE
    v_rubrique_id INTEGER;
BEGIN
    SELECT id INTO v_rubrique_id FROM rubriques WHERE nom = 'Vie du Prophète';

    -- Supprimer les anciennes questions de cette rubrique
    DELETE FROM questions WHERE rubrique_id = v_rubrique_id;

    -- Insérer les 50 nouvelles questions QCM
    INSERT INTO questions (rubrique_id, question_texte, type, choix_a, choix_b, choix_c, reponse_correcte, points, difficulte) VALUES
    (v_rubrique_id, 'Quel était le surnom du Prophète ﷺ avant la révélation ?', 'qcm', 'Al-Amin', 'Al-Faruq', 'As-Siddiq', 'choix_a', 6, 'facile'),
    (v_rubrique_id, 'En quelle année a eu lieu l''Hégire (migration vers Médine) ?', 'qcm', '610 ap. J.C.', '622 ap. J.C.', '632 ap. J.C.', 'choix_b', 6, 'facile'),
    (v_rubrique_id, 'Quel âge avait le Prophète ﷺ à la mort de sa mère Amina ?', 'qcm', '2 ans', '4 ans', '6 ans', 'choix_c', 6, 'facile'),
    (v_rubrique_id, 'Qui fut la première femme à se convertir à l''Islam ?', 'qcm', 'Aïcha', 'Khadija', 'Fatima', 'choix_b', 6, 'facile'),
    (v_rubrique_id, 'Dans quelle grotte le Prophète ﷺ a-t-il reçu la première révélation ?', 'qcm', 'Grotte de Hira', 'Grotte de Thawr', 'Grotte de Uhud', 'choix_a', 6, 'facile'),
    (v_rubrique_id, 'Quel compagnon a accompagné le Prophète ﷺ lors de l''Hégire ?', 'qcm', 'Umar ibn Al-Khattab', 'Othman ibn Affan', 'Abu Bakr As-Siddiq', 'choix_c', 6, 'facile'),
    (v_rubrique_id, 'Combien d''enfants avait le Prophète ﷺ avec Khadija ?', 'qcm', '4', '6', '7', 'choix_b', 6, 'moyen'),
    (v_rubrique_id, 'Quelle bataille fut la première grande victoire des musulmans ?', 'qcm', 'Bataille de Badr', 'Bataille de Uhud', 'Bataille du Fossé', 'choix_a', 6, 'moyen'),
    (v_rubrique_id, 'Qui est appelé "Le Lion d''Allah" ?', 'qcm', 'Khalid ibn Walid', 'Hamza ibn Abd Al-Muttalib', 'Ali ibn Abi Talib', 'choix_b', 6, 'moyen'),
    (v_rubrique_id, 'Quel est le nom de la nourrice qui a allaité le Prophète ﷺ après sa mère ?', 'qcm', 'Halima As-Sa''dita', 'Thuwayba', 'Barakah', 'choix_a', 6, 'difficile'),
    (v_rubrique_id, 'Quel oncle du Prophète ﷺ l''a protégé sans se convertir ?', 'qcm', 'Abou Lahab', 'Abou Talib', 'Al-Abbas', 'choix_b', 6, 'moyen'),
    (v_rubrique_id, 'Quel compagnon a été nommé premier muezzin de l''Islam ?', 'qcm', 'Bilal ibn Rabah', 'Abdullah ibn Masud', 'Zaid ibn Haritha', 'choix_a', 6, 'facile'),
    (v_rubrique_id, 'Combien de temps a duré la révélation du Coran ?', 'qcm', '10 ans', '23 ans', '40 ans', 'choix_b', 6, 'moyen'),
    (v_rubrique_id, 'Quelle sourate a été révélée en premier ?', 'qcm', 'Al-Fatiha', 'Al-Alaq', 'Al-Muddathir', 'choix_b', 6, 'facile'),
    (v_rubrique_id, 'Qui a proposé de creuser un fossé lors de la Bataille du Fossé (Khandaq) ?', 'qcm', 'Salman Al-Farisi', 'Omar ibn Al-Khattab', 'Ali ibn Abi Talib', 'choix_a', 6, 'difficile'),
    (v_rubrique_id, 'Quel est le nom de la monture du Prophète ﷺ lors du Voyage Nocturne ?', 'qcm', 'Al-Qaswa', 'Al-Buraq', 'Duldul', 'choix_b', 6, 'facile'),
    (v_rubrique_id, 'Quelle année est appelée "L''année de la tristesse" ?', 'qcm', 'La 5ème année de la révélation', 'La 10ème année de la révélation', 'La 13ème année de la révélation', 'choix_b', 6, 'moyen'),
    (v_rubrique_id, 'Qui était le mari de la fille du Prophète, Ruqayyah, puis de Umm Kulthum ?', 'qcm', 'Ali ibn Abi Talib', 'Othman ibn Affan', 'Zubayr ibn Al-Awwam', 'choix_b', 6, 'difficile'),
    (v_rubrique_id, 'Quel compagnon est connu comme "Le gardien du secret du Prophète" ?', 'qcm', 'Hudhayfa ibn Al-Yaman', 'Abu Huraira', 'Anas ibn Malik', 'choix_a', 6, 'difficile'),
    (v_rubrique_id, 'Où le Prophète ﷺ est-il enterré ?', 'qcm', 'La Mecque', 'Médine', 'Jérusalem', 'choix_b', 6, 'facile'),
    (v_rubrique_id, 'Combien de fois le Prophète ﷺ a-t-il accompli le Hajj ?', 'qcm', '1 fois', '3 fois', 'Plusieurs fois', 'choix_a', 6, 'moyen'),
    (v_rubrique_id, 'Quel compagnon a rassemblé le Coran en un livre unique ?', 'qcm', 'Omar ibn Al-Khattab', 'Abu Bakr As-Siddiq', 'Othman ibn Affan', 'choix_b', 6, 'difficile'),
    (v_rubrique_id, 'Quel est le dernier sermon du Prophète ﷺ appelé ?', 'qcm', 'Khutbat al-Jumu''a', 'Khutbat al-Wada''', 'Khutbat al-Eid', 'choix_b', 6, 'moyen'),
    (v_rubrique_id, 'Quel âge avait le Prophète ﷺ lors de sa mort ?', 'qcm', '53 ans', '60 ans', '63 ans', 'choix_c', 6, 'facile'),
    (v_rubrique_id, 'Qui a tué Hamza lors de la bataille de Uhud ?', 'qcm', 'Abu Sufyan', 'Wahshi', 'Ikrimah', 'choix_b', 6, 'difficile'),
    (v_rubrique_id, 'Quelle tribu contrôlait La Mecque à la naissance du Prophète ﷺ ?', 'qcm', 'Aws', 'Khazraj', 'Quraïch', 'choix_c', 6, 'facile'),
    (v_rubrique_id, 'Qui a dormi dans le lit du Prophète ﷺ la nuit de l''Hégire ?', 'qcm', 'Ali ibn Abi Talib', 'Abu Bakr', 'Othman', 'choix_a', 6, 'moyen'),
    (v_rubrique_id, 'Quelle était la profession du Prophète ﷺ avant la prophétie ?', 'qcm', 'Forgeron', 'Commerçant/Berger', 'Agriculteur', 'choix_b', 6, 'facile'),
    (v_rubrique_id, 'Quel compagnon a rapporté le plus de hadiths ?', 'qcm', 'Aïcha', 'Abdullah ibn Omar', 'Abu Huraira', 'choix_c', 6, 'moyen'),
    (v_rubrique_id, 'Quelle prière a été rendue obligatoire lors du Voyage Nocturne ?', 'qcm', 'Les 5 prières quotidiennes', 'La prière du Vendredi', 'La prière de l''Aïd', 'choix_a', 6, 'moyen'),
    (v_rubrique_id, 'Qui était le chef des hypocrites à Médine ?', 'qcm', 'Abdullah ibn Ubayy', 'Abu Jahl', 'Abu Lahab', 'choix_a', 6, 'difficile'),
    (v_rubrique_id, 'Quel est le nom du grand-père du Prophète ﷺ qui l''a élevé ?', 'qcm', 'Abu Talib', 'Abd Al-Muttalib', 'Hashim', 'choix_b', 6, 'facile'),
    (v_rubrique_id, 'Quel roi chrétien a accueilli les musulmans en Abyssinie ?', 'qcm', 'Héraclius', 'Le Négus (An-Najashi)', 'Muqawqis', 'choix_b', 6, 'moyen'),
    (v_rubrique_id, 'Quelle bataille a vu la défaite des musulmans à cause des archers ?', 'qcm', 'Badr', 'Uhud', 'Hunayn', 'choix_b', 6, 'moyen'),
    (v_rubrique_id, 'Qui a été surnommé "Dhun-Nurayn" (L''homme aux deux lumières) ?', 'qcm', 'Abu Bakr', 'Omar', 'Othman', 'choix_c', 6, 'difficile'),
    (v_rubrique_id, 'Quel ange apportait la révélation au Prophète ﷺ ?', 'qcm', 'Mikail', 'Israfil', 'Jibril', 'choix_c', 6, 'facile'),
    (v_rubrique_id, 'Combien de filles avait le Prophète ﷺ ?', 'qcm', '3', '4', '5', 'choix_b', 6, 'moyen'),
    (v_rubrique_id, 'Quel pacte de chevalerie le Prophète ﷺ a-t-il rejoint jeune ?', 'qcm', 'Hilf al-Fudul', 'Pacte d''Aqaba', 'Traité de Hudaybiya', 'choix_a', 6, 'difficile'),
    (v_rubrique_id, 'Qui a tenté de tuer le Prophète ﷺ à Ta''if ?', 'qcm', 'Les dirigeants de Thaqif', 'Abu Jahl', 'Abu Sufyan', 'choix_a', 6, 'difficile'),
    (v_rubrique_id, 'Quel compagnon était connu pour sa belle voix en récitant le Coran ?', 'qcm', 'Abu Musa Al-Ash''ari', 'Khalid ibn Walid', 'Zubayr', 'choix_a', 6, 'moyen'),
    (v_rubrique_id, 'Qui a dirigé la prière pendant la maladie finale du Prophète ﷺ ?', 'qcm', 'Omar', 'Ali', 'Abu Bakr', 'choix_c', 6, 'moyen'),
    (v_rubrique_id, 'Quel est le nom de la première mosquée construite par le Prophète ﷺ ?', 'qcm', 'Masjid Al-Haram', 'Masjid Quba', 'Masjid An-Nabawi', 'choix_b', 6, 'moyen'),
    (v_rubrique_id, 'Qui était Zaid ibn Haritha pour le Prophète ﷺ ?', 'qcm', 'Son oncle', 'Son fils adoptif', 'Son cousin', 'choix_b', 6, 'moyen'),
    (v_rubrique_id, 'Quelle ville a accueilli le Prophète ﷺ après La Mecque ?', 'qcm', 'Ta''if', 'Yathrib (Médine)', 'Tabuk', 'choix_b', 6, 'facile'),
    (v_rubrique_id, 'Qui a tué le faux prophète Musaylima ?', 'qcm', 'Khalid ibn Walid', 'Wahshi', 'Ali ibn Abi Talib', 'choix_b', 6, 'difficile'),
    (v_rubrique_id, 'Quelle sourate le Prophète ﷺ a-t-il appelée "Le cœur du Coran" ?', 'qcm', 'Al-Mulk', 'Ya-Sin', 'Ar-Rahman', 'choix_b', 6, 'moyen'),
    (v_rubrique_id, 'Quel âge avait le Prophète ﷺ lors de son mariage avec Khadija ?', 'qcm', '25 ans', '30 ans', '40 ans', 'choix_a', 6, 'moyen'),
    (v_rubrique_id, 'Qui était la plus jeune épouse du Prophète ﷺ ?', 'qcm', 'Hafsa', 'Zaynab', 'Aïcha', 'choix_c', 6, 'facile'),
    (v_rubrique_id, 'Quel surnom a été donné à Khalid ibn Walid ?', 'qcm', 'Saifullah (L''épée d''Allah)', 'As-Siddiq', 'Al-Faruq', 'choix_a', 6, 'moyen'),
    (v_rubrique_id, 'Combien d''années le Prophète ﷺ a-t-il prêché à La Mecque ?', 'qcm', '10 ans', '13 ans', '23 ans', 'choix_b', 6, 'moyen');
END $$;
