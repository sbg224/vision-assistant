# 🤖 Vision Assistant — Assistant personnel intelligent via WhatsApp

Vision Assistant est un **agent automatisé** capable de recevoir des messages WhatsApp, d’en comprendre les intentions, de conserver un historique et de déclencher des **workflows personnalisés** (comme créer un événement dans Google Calendar ou envoyer un e-mail via Gmail).

---

## 🎯 Objectifs

- Créer un assistant IA **local**, sans appel à ChatGPT, qui comprend des messages et déclenche des actions.
- Utiliser **WhatsApp comme point d’entrée (déclencheur)** pour lancer des workflows (rendez-vous, email, tâches…).
- Mettre en place une **mémoire conversationnelle** avec un fichier JSON.
- Construire des workflows **modulables** et connectés à des services comme :
  - 📅 Google Calendar
  - 📧 Gmail
  - ⚙️ D'autres modules à venir...

---

## 📁 Architecture du projet

vision-assistant/ ├── agent/ │ ├── agent.js ← Cœur de l'agent │ ├── rules.js ← Règles de réponses simples │ └── services/ │ └── session.file.js ← Mémoire utilisateur (fichier JSON) │ ├── config/ │ └── google-auth.js ← Authentification Google OAuth2 │ ├── database/ │ └── sessions.json ← Sauvegarde des sessions utilisateur │ ├── integrations/ │ └── whatsapp.js ← Point d’entrée Webhook WhatsApp │ ├── server/ │ └── index.js ← Démarrage Express │ ├── workflows/ │ ├── calendar.workflow.js ← Création de rendez-vous Google Calendar │ └── mail.workflow.js ← Envoi d’e-mail via Gmail │ ├── .env ← Variables d’environnement ├── Dockerfile ← Conteneurisation ├── package.json ← Dépendances et scripts └── README.md ← Ce fichier

yaml
Copier
Modifier

---

## 💬 Commandes WhatsApp supportées

Tu peux interagir avec ton assistant via ces messages :

- `je veux un rdv demain à 15h` → crée un événement dans Google Calendar
- `envoie un mail à Karim` → déclenche le workflow de mail
- `voir ma session` → inspecte la session active
- `reset ma session` → efface la session en cours
- `test mémoire` → teste l’écriture JSON
- `bonjour`, `merci`, `salut` → génère une réponse humaine

---

## 🌐 Technologies utilisées

- `Node.js` + `Express`
- `Google Calendar API` + `Gmail API`
- `WhatsApp Business Cloud API`
- `nodemailer` (optionnel pour Gmail)
- `Docker` pour le déploiement
- `Render` (ou local avec ngrok)

---

## ⚙️ Exemple de fichier `.env`

```env
# WhatsApp Cloud API
WHATSAPP_TOKEN=your_facebook_whatsapp_token
PHONE_NUMBER_ID=your_whatsapp_number_id

# Google Calendar OAuth2
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=https://developers.google.com/oauthplayground
GOOGLE_REFRESH_TOKEN=...

# PORT utilisé par Express
PORT=10000
✅ Instructions de démarrage
1. Cloner et installer
bash
Copier
Modifier
git clone https://github.com/ton-compte/vision-assistant.git
cd vision-assistant
npm install
2. Remplir le fichier .env
Copie .env.example en .env et ajoute tes variables d’environnement (Google et WhatsApp).

3. Lancer en local
bash
Copier
Modifier
npm start
Ou via Docker :

bash
Copier
Modifier
docker build -t vision-assistant .
docker run -p 10000:10000 --env-file .env vision-assistant
📬 Tester avec un curl
bash
Copier
Modifier
curl -X POST https://ton-url.onrender.com/whatsapp/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "entry": [{
      "changes": [{
        "value": {
          "messages": [{
            "from": "337510000000",
            "text": { "body": "je veux un rdv demain à 15h" }
          }]
        }
      }]
    }]
  }'
🧠 Exemple de session sauvegardée
json
Copier
Modifier
{
  "337510000000": {
    "last_intent": "awaiting_rdv_hour",
    "temp_data": {
      "date": "2025-04-22"
    },
    "updated_at": "2025-04-13T22:02:00.000Z"
  }
}
🛠 Workflows actifs
📅 Google Calendar
Lecture de messages type : rendez-vous lundi à 14h

Création automatique d’un événement dans le calendrier

Confirmation par retour WhatsApp

📧 Gmail (à activer)
Lecture de envoie un mail à X

Possibilité d’intégrer nodemailer ou Gmail API

Authentification OAuth2 requise

✅ Fonctionnalités à venir
🔎 NLP pour compréhension avancée

📌 Interface visuelle de création de workflows

🧠 Apprentissage de nouveaux comportements via fichiers .txt/.pdf

📊 Historique des actions

🔁 Intégration à Notion, Drive, Sheets, Discord...

👨‍💻 Auteur
Ce projet a été conçu par [MSB]
Tu peux contribuer, forker, adapter ou réutiliser librement ce repo !

yaml
Copier
Modifier

---






