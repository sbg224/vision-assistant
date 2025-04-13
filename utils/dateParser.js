// utils/dateParser.js
import * as chrono from 'chrono-node';


/**
 * Parse une phrase naturelle comme "demain à 16h" en { date, hour }
 * @param {string} input
 * @returns {{ date: string, hour: string } | null }
 */
export function parseNaturalDateTime(input) {
  const results = chrono.fr.parse(input); // 🇫🇷 langage naturel FR
  if (!results.length) return null;

  const dateObj = results[0].start.date(); // Objet Date
  const iso = dateObj.toISOString();       // ex: 2025-04-22T16:00:00.000Z
  const date = iso.slice(0, 10);
  const hour = iso.slice(11, 16);

  return { date, hour };
}
