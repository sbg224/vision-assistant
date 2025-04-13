import fs from 'node:fs/promises';

const filePath = new URL('../database/sessions.json', import.meta.url);
export async function getSession(phone) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);
    return data[phone] || null;
  } catch (error) {
    console.error('Erreur lecture mémoire :', error.message);
    return null;
  }
}

export async function updateSession(phone, intent = null, tempData = {}) {
  let sessions = {};

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    sessions = JSON.parse(content);
  } catch (e) {
    sessions = {};
  }

  sessions[phone] = {
    last_intent: intent,
    temp_data: tempData,
    updated_at: new Date().toISOString()
  };

  await fs.writeFile(filePath, JSON.stringify(sessions, null, 2));
}
