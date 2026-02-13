const nodemailer = require('nodemailer');

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true pour 465, false pour autres ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

/**
 * Envoie un email
 * @param {Object} options - Options de l'email
 * @param {String} options.to - Destinataire
 * @param {String} options.subject - Sujet
 * @param {String} options.text - Contenu texte
 * @param {String} options.html - Contenu HTML
 */
const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const mailOptions = {
            from: `"JEU CONCOURS AL ILM 2026" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html: html || text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('📧 Email envoyé:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Erreur envoi email:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Envoie un email de bienvenue à un participant
 */
const sendWelcomeEmail = async (participant) => {
    const subject = '🕌 Bienvenue au Jeu Concours AL ILM 2026 !';
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2C3E50;">As-Salamu Alaykum ${participant.prenom} ${participant.nom} !</h2>
            
            <p>Bienvenue au <strong>Jeu Concours AL ILM - Édition 2026</strong> organisé par l'AEEMCI - Section ESATIC.</p>
            
            <div style="background: #F8F9FA; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong> Vos informations :</strong></p>
                <ul>
                    <li>Nom : ${participant.nom}</li>
                    <li>Prénom : ${participant.prenom}</li>
                    <li>Établissement : ${participant.etablissement}</li>
                    <li>Email : ${participant.email}</li>
                </ul>
            </div>
            
            <p>Vous serez bientôt affecté(e) à une équipe. Vous recevrez un code d'accès pour vous connecter et suivre le concours.</p>
            
            <p style="color: #27AE60;"><strong>🌙 Qu'Allah facilite votre parcours dans la quête de la connaissance !</strong></p>
            
            <hr style="border: none; border-top: 1px solid #DDD; margin: 30px 0;">
            <p style="color: #7F8C8D; font-size: 12px;">
                AEEMCI - Association des Élèves et Étudiants Musulmans de Côte d'Ivoire<br>
                Section ESATIC - "Pour une identité islamique !"
            </p>
        </div>
    `;

    return await sendEmail({ to: participant.email, subject, html });
};

/**
 * Envoie le code d'accès à une équipe
 */
const sendTeamAccessCode = async (equipe, capitaine) => {
    const subject = `🎯 Code d'accès équipe ${equipe.nom} - AL ILM 2026`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2C3E50;">Équipe ${equipe.nom}</h2>
            
            <p>As-Salamu Alaykum <strong>${capitaine.prenom}</strong>,</p>
            
            <p>Félicitations ! Votre équipe <strong>${equipe.nom}</strong> est officiellement constituée pour le Jeu Concours AL ILM 2026.</p>
            
            <div style="background: ${equipe.couleur}; color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 25px 0;">
                <p style="margin: 0; font-size: 14px;">CODE D'ACCÈS DE L'ÉQUIPE</p>
                <h1 style="margin: 10px 0; letter-spacing: 3px;">${equipe.code_acces}</h1>
                <p style="margin: 0; font-size: 12px;">À communiquer à tous les membres</p>
            </div>
            
            <div style="background: #F8F9FA; padding: 15px; border-radius: 5px;">
                <p><strong>${equipe.symbole} ${equipe.nom}</strong></p>
                <p style="font-style: italic; color: #555;">"${equipe.signification}"</p>
            </div>
            
            <p>Connectez-vous sur <a href="${process.env.FRONTEND_URL}/equipe/login.html">la plateforme</a> avec ce code pour accéder à votre espace équipe.</p>
            
            <p style="color: #E74C3C;"><strong>⚠️ Gardez ce code confidentiel et partagez-le uniquement avec vos coéquipiers.</strong></p>
            
            <p style="color: #27AE60;"><strong>🏆 Qu'Allah vous accorde la victoire !</strong></p>
            
            <hr style="border: none; border-top: 1px solid #DDD; margin: 30px 0;">
            <p style="color: #7F8C8D; font-size: 12px;">
                AEEMCI - Section ESATIC<br>
                "Pour une identité islamique !"
            </p>
        </div>
    `;

    return await sendEmail({ to: capitaine.email, subject, html });
};

module.exports = {
    transporter,
    sendEmail,
    sendWelcomeEmail,
    sendTeamAccessCode
};
