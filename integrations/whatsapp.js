import express from 'express';
import { runAgent } from '../agent/agent.js';

const router = express.Router();

// ✅ Vérification initiale du Webhook par Meta (GET)
router.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = 'vision123'; // doit être identique à Facebook

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

// ✅ Réception des messages WhatsApp (POST)
router.post('/webhook', async (req, res) => {
  console.log('📨 POST reçu de WhatsApp !');
  console.log(JSON.stringify(req.body, null, 2));
  const msg = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  const messageText = msg?.text?.body || '';
  const from = msg?.from;

  if (messageText && from) {
    const reply = await runAgent(messageText, { from });
    console.log(`💬 De ${from} : ${messageText}`);
    console.log(`🤖 Réponse : ${reply}`);
  }

  res.sendStatus(200);
});

export default router;
