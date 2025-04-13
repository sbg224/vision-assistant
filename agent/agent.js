// agent/agent.js
import { getResponse } from './rules.js';
import { getSession, updateSession } from './services/session.file.js';
import { createCalendarEvent } from '../workflows/calendar.workflow.js'; // ✅ MODIF : appel dynamique à Google Calendar
import { runMailWorkflow } from '../workflows/mail.workflow.js';

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

    // ✅ Création dynamique dans Google Calendar
    const confirmation = await createCalendarEvent(date, hour, phone);
    
    await updateSession(phone, null, {});
    return confirmation;
  }

  // 📩 Envoi d'email (autre workflow)
  if (msg.includes('mail') || msg.includes('email')) {
    return await runMailWorkflow(msg, context);
  }

  // 📅 Intention détectée pour rendez-vous
  if (msg.includes('rendez-vous') || msg.includes('rdv')) {
    await updateSession(phone, 'awaiting_rdv_date', {});
    return '📅 Très bien ! Pour quelle date souhaitez-vous prendre un rendez-vous ?';
  }

  // 🤖 Fallback
  const baseReply = getResponse(msg);
  return baseReply || '🤖 Je n’ai pas bien compris. Essayez : "je veux un rendez-vous".';
}
