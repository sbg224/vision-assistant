// workflows/calendar.workflow.js
import { google } from 'googleapis';
import { getOAuth2Client } from '../config/google-auth.js';

/**
 * Crée un événement Google Calendar à partir des infos utilisateur
 * @param {string} date - Date au format AAAA-MM-JJ (ex: "2025-04-22")
 * @param {string} hour - Heure au format HH:MM (ex: "16:00")
 * @param {string} from - Identifiant de l'utilisateur (numéro WhatsApp)
 * @returns {string} - Message de confirmation ou d’erreur
 */
export async function createCalendarEvent(date, hour, from = '') {
  const oauth2Client = await getOAuth2Client();
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  try {
    // 🔐 Vérification et construction de la date/heure
    if (!date || !hour) throw new Error('Date ou heure manquante');

    const startDateTime = new Date(`${date}T${hour}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000); // +30min

    if (Number.isNaN(startDateTime.getTime()) || Number.isNaN(endDateTime.getTime())) {
      throw new Error('Format de date ou d’heure invalide');
    }

    const event = {
      summary: `Rendez-vous avec ${from}`,
      description: '📆 RDV automatique depuis WhatsApp - Vision Assistant',
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'Europe/Paris',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'Europe/Paris',
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    return `✅ Rendez-vous créé pour le ${date} à ${hour} ! 📅\n👉 ${response.data.htmlLink}`;
  } catch (err) {
    console.error('❌ Erreur Google Calendar:', err.message);
    return `❌ Impossible de créer le rendez-vous : ${err.message}`;
  }
}
