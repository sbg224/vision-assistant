import express from 'express';
import { runAgent } from '../agent/agent.js';
import fetch from 'node-fetch'; // pour envoyer la réponse

const router = express.Router();

// ✅ Route GET pour vérification Meta
router.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = 'vision123';
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token && mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Vérification webhook réussie.');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Vérification échouée.');
    res.sendStatus(403);
  }
});

// ✅ Fonction pour envoyer une réponse à WhatsApp
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
    console.error('❌ Erreur lors de l\'envoi WhatsApp :', error);
  }
};

// ✅ Route POST pour recevoir les messages
router.post('/webhook', async (req, res) => {
  console.log('📨 POST reçu de WhatsApp !');
  console.log(JSON.stringify(req.body, null, 2));

  const msg = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  const messageText = msg?.text?.body || '';
  const from = msg?.from;

  if (messageText && from) {
    const reply = await runAgent(messageText, { from });

    console.log(`💬 Message de ${from} : ${messageText}`);
    console.log(`🤖 Réponse générée : ${reply}`);

    // ✅ Envoie la réponse dans WhatsApp automatiquement
    await sendWhatsAppReply(from, reply);
  }

  res.sendStatus(200);
});

export default router;
