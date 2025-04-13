import { getResponse } from './rules.js';
import { getSession, updateSession } from './services/session.file.js';

export async function runAgent(message, context = {}) {
  const phone = context.from;
  const session = await getSession(phone);
  const msg = message.toLowerCase().trim();

  // 🧠 Si une intention est en cours (ex : attente d’horaire)
  if (session?.last_intent === 'awaiting_rdv_hour') {
    await updateSession(phone, null, {}); // on efface l’intention
    return `📌 Super, je note votre rendez-vous à ${msg}. Il sera enregistré dans votre Google Agenda (plus tard 😏).`;
  }

  // 🎯 Nouvelle intention détectée
  if (msg.includes('rendez-vous') || msg.includes('rdv')) {
    await updateSession(phone, 'awaiting_rdv_hour', { step: 1 });
    return '🗓️ Pour quel jour ou quelle heure souhaitez-vous ce rendez-vous ?';
  }

  // 🤖 Réponse standard via rules.js
  const baseReply = getResponse(msg);
  return baseReply || 'Je n’ai pas compris. Essayez : "je veux un rdv" ou "email".';
}
