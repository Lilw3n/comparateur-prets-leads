import nodemailer from 'nodemailer';

interface ContactRequest {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  typeDemande: 'BIEN' | 'PRET' | 'ASSURANCE';
  message?: string;
  montant?: number;
  duree?: number;
  typeBien?: string;
  typeAssurance?: string;
  [key: string]: any; // Pour les données supplémentaires
}

// Configuration du transporteur email
const createTransporter = () => {
  // Utiliser les variables d'environnement pour la configuration
  // En production, utiliser un service comme Gmail SMTP, SendGrid, Resend, etc.
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true pour 465, false pour les autres ports
    auth: {
      user: process.env.SMTP_USER || process.env.EMAIL_FROM,
      pass: process.env.SMTP_PASS || process.env.EMAIL_PASSWORD,
    },
  });

  return transporter;
};

// Email de contact simple (sans authentification SMTP)
const sendEmailSimple = async (to: string, subject: string, html: string) => {
  // En production, utiliser un vrai service d'email
  // Pour l'instant, on log juste l'email
  console.log('📧 Email à envoyer:');
  console.log('À:', to);
  console.log('Sujet:', subject);
  console.log('Contenu:', html);
  
  // Si SMTP est configuré, utiliser nodemailer
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to,
        subject,
        html,
      });
      return { success: true, message: 'Email envoyé avec succès' };
    } catch (error) {
      console.error('Erreur envoi email:', error);
      return { success: false, message: 'Erreur lors de l\'envoi de l\'email' };
    }
  }
  
  return { success: true, message: 'Email loggé (SMTP non configuré)' };
};

export const sendContactEmail = async (contactData: ContactRequest) => {
  const { nom, prenom, email, telephone, typeDemande, message, montant, duree, typeBien, typeAssurance } = contactData;

  // Déterminer le sujet selon le type de demande
  const sujetMap: Record<string, string> = {
    BIEN: 'Nouvelle demande de recherche de bien immobilier',
    PRET: 'Nouvelle demande de prêt immobilier',
    ASSURANCE: 'Nouvelle demande d\'assurance',
  };

  const sujet = sujetMap[typeDemande] || 'Nouvelle demande de contact';

  // Construire le contenu HTML de l'email
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .info-row { margin: 10px 0; padding: 10px; background: white; border-radius: 4px; }
        .label { font-weight: bold; color: #667eea; }
        .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${sujet}</h1>
        </div>
        <div class="content">
          <h2>Informations du client</h2>
          
          <div class="info-row">
            <span class="label">Nom complet:</span> ${prenom} ${nom}
          </div>
          
          <div class="info-row">
            <span class="label">Email:</span> <a href="mailto:${email}">${email}</a>
          </div>
          
          ${telephone ? `
          <div class="info-row">
            <span class="label">Téléphone:</span> <a href="tel:${telephone}">${telephone}</a>
          </div>
          ` : ''}
          
          <div class="info-row">
            <span class="label">Type de demande:</span> ${typeDemande}
          </div>
          
          ${montant ? `
          <div class="info-row">
            <span class="label">Montant souhaité:</span> ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(montant)}
          </div>
          ` : ''}
          
          ${duree ? `
          <div class="info-row">
            <span class="label">Durée:</span> ${duree} ans
          </div>
          ` : ''}
          
          ${typeBien ? `
          <div class="info-row">
            <span class="label">Type de bien:</span> ${typeBien}
          </div>
          ` : ''}
          
          ${typeAssurance ? `
          <div class="info-row">
            <span class="label">Type d'assurance:</span> ${typeAssurance}
          </div>
          ` : ''}
          
          ${message ? `
          <div class="info-row">
            <span class="label">Message:</span>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          ` : ''}
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #667eea;">
            <p><strong>Action requise:</strong> Contacter le client au plus vite pour répondre à sa demande.</p>
            <a href="mailto:${email}" class="button">Répondre au client</a>
          </div>
          
          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            Cet email a été généré automatiquement depuis le site comparateur-prets-leads.vercel.app
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Envoyer l'email au courtier
  const courtierEmail = process.env.COURTIER_EMAIL || 'courtier972@gmail.com';
  const result = await sendEmailSimple(courtierEmail, sujet, html);

  return result;
};

export default {
  sendContactEmail,
};
