import { applyRules } from './rules.js';

export async function runAgent(message, context = {}) {
  const response = await applyRules(message, context);
  return response || "Je n'ai pas compris votre demande.";
}
