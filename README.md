# ♟ UpChess

UpChess est un jeu d'échecs en ligne qui permet à 2 utilisateurs de jouer
ensemble.

## 📦 Installation

### ✅ Prérequis

Pour faire fonctionner le serveur, il vous faut:
- Node.js v18.13.0 ou supérieure

### 🔧 Configuration

Pour faire fonctionner le serveur, vous devez créer un fichier de configuration.
Un modèle est fournie dans le dossier, il vous suffit de suivre ces étapes :

1. Créez un fichier de configuration en utilisant l'exemple avec la commande `cp config.exemple.json config.json`.
2. Ouvrez le fichier config.json et renseignez les informations demandées.

La configuration est terminée, vous pouvez passer à l'installation.

### 📥 Guide d'installation

1. Installation des dépendances avec la commande `npm install`.
2. Lancer le serveur avec `node app.js`.
3. Vous pouvez consulter le site web à l'adresse http://localhost:3000

## 💡 Pour les développeurs

### 📚Générer la documentation

1. Installez les dépendances de développement avec `npm install --include=dev`.
2. Générez la documentation avec `npm run generate-docs`.
3. Exécutez `npm run serve-docs` et rendez-vous à l'adresse affichée pour consulter la documentation

### 💻Tests

1. Installez les dépendances de développement avec `npm install --include=dev`
2. Lancez les testes avec `npm test`

