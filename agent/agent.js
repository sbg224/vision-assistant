// agent/agent.js
import { getResponse } from './rules.js';
import { getSession, updateSession } from './services/session.file.js';
import { createCalendarEvent } from '../workflows/calendar.workflow.js';
import { runMailWorkflow } from '../workflows/mail.workflow.js';
import { parseNaturalDateTime } from '../utils/dateParser.js';

/**
 * Fonction principale de traitement du message utilisateur.
 * @param {string} message - Message WhatsApp
 * @param {object} context - Contexte du message, doit contenir le numéro (from)
 * @returns {Promise<string>} - Réponse à renvoyer à l’utilisateur
 */
export async function runAgent(message, context = {}) {
  const phone = context.from;
  if (!phone) {
    console.warn('⚠️ Numéro non fourni dans le contexte. Impossible de mémoriser.');
    return '❌ Erreur interne : numéro manquant.';
  }

  const msg = message.toLowerCase().trim();
  const session = await getSession(phone);

  // Cas de session active en attente de date ou heure
  if (session?.last_intent === 'awaiting_rdv_date') {
    const temp = { ...session.temp_data, date: msg };
    await updateSession(phone, 'awaiting_rdv_hour', temp);
    return `🕓 Merci. À quelle heure souhaitez-vous ce rendez-vous le ${msg} ?`;
  }

  if (session?.last_intent === 'awaiting_rdv_hour') {
    const date = session.temp_data?.date || '[date inconnue]';
    const hour = msg;
    const isValid = !Number.isNaN(new Date(`${date}T${hour}:00`).getTime());

    if (!isValid) {
      await updateSession(phone, null, {});
      return '❌ Format de date/heure invalide. Merci de recommencer.';
    }

    const confirmation = await createCalendarEvent(date, hour, phone);
    await updateSession(phone, null, {});
    return confirmation;
  }

  // Intention : envoi ou consultation de mail
  if (msg.includes('mail') || msg.includes('email')) {
    return await runMailWorkflow(msg, context);
  }

  // Intention : prise de rendez-vous avec parsing intelligent
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

  // Commandes spéciales de debug
  if (msg === 'reset ma session') {
    await updateSession(phone, null, {});
    return '🧼 Session réinitialisée. Tu peux recommencer une nouvelle demande.';
  }

  if (msg === 'voir ma session') {
    const currentSession = await getSession(phone);
    return currentSession
      ? `🧠 Voici ta session actuelle :\n${JSON.stringify(currentSession, null, 2)}`
      : '📭 Aucune session active.';
  }

  if (msg === 'test mémoire') {
    await updateSession(phone, 'debug_intent', { test: true });
    return '✅ Test mémoire effectué. Données de session mises à jour.';
  }

  if (msg === 'aide développeur') {
    return `👨‍💻 Commandes dispo :
- reset ma session → Vide la mémoire
- voir ma session → Affiche la session actuelle
- test mémoire → Vérifie si la mémoire fonctionne`;
  }

  // Fallback sur réponse simple
  const fallback = getResponse(msg);
  return fallback || '🤖 Je n’ai pas bien compris. Essayez : "je veux un rendez-vous".';
}