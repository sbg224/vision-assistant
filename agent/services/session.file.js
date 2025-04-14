// agent/services/session.file.js
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.resolve(__dirname, '../database/sessions.json');

console.log(`🧠 Fichier de session utilisé : ${filePath}`);

async function ensureFileExists() {
  try {
    await fs.access(filePath);
  } catch {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, '{}', 'utf-8');
    console.log('✅ Fichier sessions.json créé avec un contenu vide.');
  }
}

export async function getSession(phone) {
  try {
    await ensureFileExists();
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);
    console.log(`📥 Session récupérée pour ${phone} :`, data[phone]);
    return data[phone] || null;
  } catch (error) {
    console.error('❌ Erreur lecture mémoire :', error.message);
    return null;
  }
}

export async function updateSession(phone, intent = null, tempData = {}) {
  try {
    await ensureFileExists();
    const content = await fs.readFile(filePath, 'utf-8');
    const sessions = JSON.parse(content);

    sessions[phone] = {
      last_intent: intent,
      temp_data: tempData,
      updated_at: new Date().toISOString(),
    };

    await fs.writeFile(filePath, JSON.stringify(sessions, null, 2));
    console.log(`💾 Session mise à jour pour ${phone}`);
  } catch (err) {
    console.error('❌ Erreur écriture mémoire :', err.message);
  }
}