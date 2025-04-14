import express from 'express';
import { runAgent } from '../agent/agent.js';
import fetch from 'node-fetch';

const router = express.Router();

// ✅ Vérification du webhook par Meta
router.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = 'vision123';
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Vérification webhook réussie.');
    return res.status(200).send(challenge);
  }

  console.warn('❌ Vérification webhook échouée.');
  res.sendStatus(403);
});

// ✅ Envoi de la réponse à WhatsApp
const sendWhatsAppReply = async (to, message) => {
  try {
    const phoneNumberId = process.env.PHONE_NUMBER_ID;
    const token = process.env.WHATSAPP_TOKEN;

    const url = `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        text: { body: message },
      }),
    });

    const result = await response.json();
    console.log('📤 Réponse envoyée à WhatsApp :', result);
  } catch (error) {
    console.error('❌ Erreur lors de l’envoi à WhatsApp :', error.message);
  }
};

// ✅ Extraction propre des messages (et non des statuts)
const extractIncomingMessage = (body) => {
  try {
    const entry = body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;

    // 🛑 Ignore les événements sans "messages"
    if (!value?.messages || !Array.isArray(value.messages)) {
      return null;
    }

    const message = value.messages[0];
    return {
      text: message.text?.body || '',
      from: message.from,
    };
  } catch (err) {
    console.error('❌ Erreur extraction message :', err.message);
    return null;
  }
};

// ✅ Réception des messages
router.post('/webhook', async (req, res) => {
  console.log('📨 Message reçu de WhatsApp :');
  console.dir(req.body, { depth: null });

  const incoming = extractIncomingMessage(req.body);

  if (!incoming || !incoming.text || !incoming.from) {
    console.warn('⚠️ Données de message incomplètes ou non pertinentes (statuts ignorés).');
    return res.sendStatus(200); // Toujours répondre 200 à WhatsApp
  }

  console.log(`💬 Message de ${incoming.from} : ${incoming.text}`);

  const reply = await runAgent(incoming.text, { from: incoming.from });

  console.log(`🤖 Réponse générée : ${reply}`);
  await sendWhatsAppReply(incoming.from, reply);

  res.sendStatus(200);
});

export default router;