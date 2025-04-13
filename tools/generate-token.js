// tools/generate-token.js
import { google } from 'googleapis';
import readline from 'node:readline';
import dotenv from 'dotenv';
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly'
];

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent',
});

console.log('\n🔐 Ouvre ce lien dans ton navigateur :');
console.log(authUrl);

rl.question('\n✏️ Colle ici le code d’authentification : ', async (code) => {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    console.log('\n✅ Token reçu :');
    console.log(tokens);
    console.log('\n💾 Mets ça dans ton .env ou sur Render :');
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    rl.close();
  } catch (err) {
    console.error('❌ Erreur Google :', err.message);
    rl.close();
  }
});
