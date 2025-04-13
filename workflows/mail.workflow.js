// workflows/mail.workflow.js
import nodemailer from 'nodemailer';

export async function runMailWorkflow(message, context) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: 'collaborateur@mail.com',
      subject: '📩 Rapport de projet',
      text: 'Voici le rapport demandé. Cordialement, Vision Assistant',
    });
    return '📤 Mail envoyé à votre collègue !';
  } catch (err) {
    console.error('❌ Erreur mail:', err.message);
    return '❌ Problème lors de l’envoi du mail.';
  }
}
