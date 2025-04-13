import express from 'express';
import { runAgent } from '../agent/agent.js';

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

// ✅ Route POST pour messages
router.post('/webhook', async (req, res) => {
  console.log('📨 POST reçu de WhatsApp (ou autre)');
  console.log(JSON.stringify(req.body, null, 2));

  const msg = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  const messageText = msg?.text?.body || '';
  const from = msg?.from;

  if (messageText && from) {
    const reply = await runAgent(messageText, { from });
    console.log(`💬 Message de ${from} : ${messageText}`);
    console.log(`🤖 Réponse générée : ${reply}`);
  }

  res.sendStatus(200);
});

export default router;
