import { getResponse } from './rules.js';
import { getSession, updateSession } from '../server/session.file.js';


export async function runAgent(message, context = {}) {
  const phone = context.from;
  const session = await getSession(phone);
  const msg = message.toLowerCase().trim();

  // --- Étape 1 : attente de la date ---
  if (session?.last_intent === 'awaiting_rdv_date') {
    // Sauvegarder la date reçue
    const temp = { ...session.temp_data, date: msg };
    await updateSession(phone, 'awaiting_rdv_hour', temp);
    return `🕓 Merci. À quelle heure souhaitez-vous ce rendez-vous le ${msg} ?`;
  }

  // --- Étape 2 : attente de l'heure ---
  if (session?.last_intent === 'awaiting_rdv_hour') {
    const date = session.temp_data?.date || '[date inconnue]';
    const hour = msg;

    // Ici tu pourrais appeler Google Calendar ou autre
    await updateSession(phone, null, {});
    return `✅ Rendez-vous confirmé pour le ${date} à ${hour}.`;
  }

  // --- Détection nouvelle intention ---
  if (msg.includes('rendez-vous') || msg.includes('rdv')) {
    await updateSession(phone, 'awaiting_rdv_date', {});
    return '📅 Très bien ! Pour quelle date souhaitez-vous prendre un rendez-vous ?';
  }

  // --- Réponse standard (fallback) ---
  const baseReply = getResponse(msg);
  return baseReply || '🤖 Je n’ai pas bien compris. Essayez : "je veux un rendez-vous".';
}
