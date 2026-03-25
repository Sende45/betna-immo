# Utilisation d'une image Node légère
FROM node:20-alpine

# Dossier de travail dans le container
WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install --production

# Copie du reste du code source
COPY . .

# Exposition du port (celui utilisé par Render/Local)
EXPOSE 5000

# Commande de lancement
CMD ["node", "server.js"]