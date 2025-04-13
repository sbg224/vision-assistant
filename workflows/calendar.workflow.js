// workflows/calendar.workflow.js
import { google } from 'googleapis';
import { getOAuth2Client } from '../config/google-auth.js';

/**
 * Crée un événement Google Calendar à partir des infos du message utilisateur
 * @param {string} date - Date du rendez-vous (ex: "2025-04-22")
 * @param {string} hour - Heure du rendez-vous (ex: "16:00")
 * @param {string} from - Identifiant (téléphone) de l'utilisateur
 * @returns {string} - Message de confirmation
 */
export async function createCalendarEvent(date, hour, from = '') {
  const oauth2Client = await getOAuth2Client();
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const startDateTime = new Date(`${date}T${hour}:00`);
  const endDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000); // Durée = 30 min

  const event = {
    summary: `Rendez-vous avec ${from}`,
    description: '📆 RDV automatique ajouté depuis WhatsApp via Vision Assistant',
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: 'Europe/Paris',
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: 'Europe/Paris',
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    return `✅ Rendez-vous créé pour le ${date} à ${hour} ! 📅\n👉 ${response.data.htmlLink}`;
  } catch (err) {
    console.error('❌ Erreur Google Calendar:', err.message);
    return '❌ Impossible de créer le rendez-vous dans Google Calendar.';
  }
}
