export async function applyRules(message, context) {
  const msg = message.toLowerCase();

  if (msg.includes('rdv')) {
    return 'Souhaitez-vous prendre rendez-vous ?';
  }

  if (msg.includes('email')) {
    return 'Voulez-vous que je traite vos emails ?';
  }

  if (msg.includes('bonjour')) {
    return 'Bonjour ! Comment puis-je vous aider ?';
  }

  return null;
}
