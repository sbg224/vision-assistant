/**
 * Prend un message texte utilisateur et retourne une réponse textuelle.
 * @param {string} message - Message texte reçu depuis WhatsApp
 * @returns {string} - Réponse textuelle adaptée
 */
export function getResponse(message) {
  const msg = message.toLowerCase().trim();

  // --- Salutations ---
  const greetings = ['bonjour', 'salut', 'hello', 'yo'];
  if (greetings.some(word => msg.includes(word))) {
    return '👋 Bonjour ! Je suis votre assistant IA. Je peux vous aider à planifier un rendez-vous, gérer vos e-mails ou répondre à vos questions.';
  }

  // --- Rendez-vous ---
  const rdvKeywords = ['rdv', 'rendez-vous', 'rendez vous'];
  if (rdvKeywords.some(word => msg.includes(word))) {
    if (msg.includes('prendre') || msg.includes('planifier') || msg.includes('fixer') || msg.includes('réserver')) {
      return '📅 D’accord, pour quel jour et quelle heure souhaitez-vous planifier ce rendez-vous ?';
    }

    if (msg.includes('annuler') || msg.includes('supprimer')) {
      return '🗑️ Très bien. Quel rendez-vous souhaitez-vous annuler (jour, heure, ou personne) ?';
    }

    return '🗓️ Souhaitez-vous prendre, consulter ou annuler un rendez-vous ?';
  }

  // --- Emails ---
  const emailKeywords = ['email', 'mail', 'e-mail'];
  if (emailKeywords.some(word => msg.includes(word))) {
    if (msg.includes('lire') || msg.includes('consulter')) {
      return '📬 Je vais consulter vos derniers e-mails. Souhaitez-vous un résumé ou un tri ?';
    }

    if (msg.includes('envoyer') || msg.includes('écrire')) {
      return '✉️ D’accord. Quel est le contenu de l’e-mail et à qui dois-je l’envoyer ?';
    }

    return '📥 Vous souhaitez consulter, envoyer ou trier vos e-mails ?';
  }

  // --- Agenda ---
  const agendaKeywords = ['agenda', 'calendrier'];
  if (agendaKeywords.some(word => msg.includes(word))) {
    return '📆 Vous voulez consulter votre agenda de la semaine ou ajouter un événement ?';
  }

  // --- Infos générales ---
  const infoKeywords = ['aide', 'capacité', 'tu fais quoi', 'fonctionnalité'];
  if (infoKeywords.some(word => msg.includes(word))) {
    return '🧠 Je peux :\n- Gérer vos rendez-vous\n- Gérer vos e-mails\n- Gérer votre agenda\n- Répondre à des questions simples\nDites-moi ce que vous voulez faire.';
  }

  // --- Tests / Debug ---
  if (msg.includes('test')) {
    return '✅ Système opérationnel. Envoyez une vraie commande pour continuer.';
  }

  // --- Politesse / Fin de conversation ---
  const politeWords = ['merci', 'au revoir', 'à bientôt', 'bye'];
  if (politeWords.some(word => msg.includes(word))) {
    return '👋 Avec plaisir ! N’hésitez pas à revenir si vous avez besoin de moi.';
  }

  // --- Réponse par défaut ---
  return '🤖 Je n’ai pas compris votre demande. Essayez : "je veux prendre un rdv", "consulter mes emails", ou simplement "bonjour".';
}