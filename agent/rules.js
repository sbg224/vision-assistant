export const runAgent = async (message, context) => {
  const msg = message.toLowerCase();

  // Salutations
  if (['bonjour', 'salut', 'hello', 'yo'].some(greet => msg.includes(greet))) {
    return '👋 Bonjour ! Je suis votre assistant IA. Je peux vous aider à gérer vos rendez-vous, e-mails, ou répondre à d’autres demandes.';
  }

  // Rendez-vous
  if (msg.includes('rdv') || msg.includes('rendez-vous')) {
    if (msg.includes('prendre') || msg.includes('planifier')) {
      return '📅 Très bien, pour quel jour et quelle heure souhaitez-vous planifier ce rendez-vous ?';
    }if (msg.includes('annuler')) {
      return '🗑️ D’accord, quel rendez-vous voulez-vous annuler ? (jour / heure / nom)';
    }
    return '🗓️ Souhaitez-vous planifier, consulter ou annuler un rendez-vous ?';
  }

  // E-mails
  if (msg.includes('email') || msg.includes('mail')) {
    if (msg.includes('lire') || msg.includes('consulter')) {
      return '📬 Je vais consulter vos derniers e-mails. Vous voulez que je vous fasse un résumé ?';
    }if (msg.includes('envoyer')) {
      return '✉️ Quel est le contenu de l’e-mail et à qui dois-je l’envoyer ?';
    }
      return '📥 Vous souhaitez consulter, envoyer ou trier vos e-mails ?';
  }

  // Agenda
  if (msg.includes('agenda') || msg.includes('calendrier')) {
    return '📆 Voici votre agenda. Vous voulez consulter vos événements de la semaine ou en ajouter un ?';
  }

  // Infos générales
  if (msg.includes('aide') || msg.includes('que peux-tu faire')) {
    return '🧠 Je peux vous aider à :\n- Gérer vos rendez-vous\n- Lire / envoyer des e-mails\n- Gérer votre agenda\n- Répondre à des questions simples\nDites-moi ce que vous voulez faire !';
  }

  // Test / ping
  if (msg.includes('test')) {
    return '✅ Le système fonctionne parfaitement. Envoyez-moi une vraie demande 😊';
  }

  // Au revoir
  if (msg.includes('merci') || msg.includes('à bientôt') || msg.includes('au revoir')) {
    return '👋 Avec plaisir ! N’hésitez pas à revenir me parler si vous avez besoin de moi.';
  }

  // Réponse par défaut
  return '🤖 Je ne suis pas sûr de comprendre. Vous pouvez me demander un rendez-vous, m’envoyer un e-mail, ou me parler de votre agenda.';
};
