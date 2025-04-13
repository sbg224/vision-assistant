// get-google-token.js
import readline from 'node:readline';
import open from 'open';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
} = process.env;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
  console.error('❌ Les variables .env sont manquantes. Vérifie GOOGLE_CLIENT_ID, SECRET et REDIRECT_URI.');
  process.exit(1);
}

const SCOPE = encodeURIComponent('https://www.googleapis.com/auth/calendar');
const AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=${SCOPE}&prompt=consent&response_type=code&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}`;

console.log('\n🔐 Ouvre ce lien dans ton navigateur :\n');
console.log(AUTH_URL);
console.log('\n✏️ Copie-colle ensuite le code d’authentification ici :\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('👉 Code : ', async (code) => {
  console.log('\n⏳ Échange du code contre un token...');

  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code'
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error('❌ Erreur OAuth :', data.error_description || data.error);
    } else {
      console.log('\n✅ Token généré avec succès !\n');
      console.log('🔑 access_token :', data.access_token);
      console.log('🔁 refresh_token :', data.refresh_token);
      console.log('\n📌 Ajoute ce refresh_token dans ton fichier .env :\n');
      console.log(`GOOGLE_REFRESH_TOKEN=${data.refresh_token}`);
    }
  } catch (err) {
    console.error('❌ Erreur fetch :', err.message);
  }

  rl.close();
});
