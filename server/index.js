import express from 'express';
import dotenv from 'dotenv';
import whatsappRouter from '../integrations/whatsapp.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/whatsapp', whatsappRouter);

app.listen(PORT, () => {
  console.log(`✅ Vision Assistant lancé sur le port ${PORT}`);
});
