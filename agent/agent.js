// agent/agent.js
import { getResponse } from './rules.js';
import { getSession, updateSession } from './services/session.file.js';
import { createCalendarEvent } from '../workflows/calendar.workflow.js';
import { runMailWorkflow } from '../workflows/mail.workflow.js';
import { parseNaturalDateTime } from '../utils/dateParser.js'; // 🧠 Nouvelle lib pour comprendre "vendredi à 14h"

export async function runAgent(message, context = {}) {
  const phone = context.from;
  const session = await getSession(phone);
  const msg = message.toLowerCase().trim();

  // 🔄 Étape 1 : Attente de la date
  if (session?.last_intent === 'awaiting_rdv_date') {
    const temp = { ...session.temp_data, date: msg };
    await updateSession(phone, 'awaiting_rdv_hour', temp);
    return `🕓 Merci. À quelle heure souhaitez-vous ce rendez-vous le ${msg} ?`;
  }

  // 🔄 Étape 2 : Attente de l'heure
  if (session?.last_intent === 'awaiting_rdv_hour') {
    const date = session.temp_data?.date || '[date inconnue]';
    const hour = msg;

    const isValid = !Number.isNaN(new Date(`${date}T${hour}:00`).getTime());
    if (!isValid) {
      await updateSession(phone, null, {});
      return '❌ Date ou heure invalide. Veuillez recommencer avec un format correct.';
    }

    const confirmation = await createCalendarEvent(date, hour, phone);
    await updateSession(phone, null, {});
    return confirmation;
  }

  // 📩 Intention email
  if (msg.includes('mail') || msg.includes('email')) {
    return await runMailWorkflow(msg, context);
  }

  // 📅 Intention rendez-vous → tentative NLP directe
  if (msg.includes('rendez-vous') || msg.includes('rdv')) {
    const parsed = parseNaturalDateTime(msg);
    if (parsed) {
      const { date, hour } = parsed;
      const confirmation = await createCalendarEvent(date, hour, phone);
      return confirmation;
    }

    await updateSession(phone, 'awaiting_rdv_date', {});
    return '📅 Très bien ! Pour quelle date souhaitez-vous prendre un rendez-vous ?';
  }

  if (msg === 'reset ma session') {
    await updateSession(phone, null, {});
    return '🧼 Session réinitialisée. Tu peux recommencer une nouvelle demande.';
  }
  
  if (msg === 'voir ma session') {
    const session = await getSession(phone);
    if (!session) return '📭 Aucune session active.';
    return `🧠 Voici ta session actuelle :\n${JSON.stringify(session, null, 2)}`;
  }
  
  if (msg === 'aide développeur') {
    return `👨‍💻 Commandes dispo :
  - reset ma session → Vide la mémoire
  - voir ma session → Affiche ce que je sais de toi
  - test mémoire → Vérifie si la mémoire fonctionne
  - logs → (à implémenter si besoin)`;
  }
  
  if (msg === 'test mémoire') {
    await updateSession(phone, 'debug_intent', { test: true });
    return '✅ Mémoire test : session enregistrée avec un champ "debug_intent".';
  }
  

  // 🧠 Réponses standards (fallback)
  const baseReply = getResponse(msg);
  return baseReply || '🤖 Je n’ai pas bien compris. Essayez : "je veux un rendez-vous".';
}
