import { getResponse } from './rules.js';

export async function runAgent(message, context = {}) {
  const response = await getResponse(message);
  return response || "Je n'ai pas compris votre demande.";
}
