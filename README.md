# Projet e-commerce : Frontend et Backend

Ce projet contient deux parties séparées :

- `back-end/` : le serveur Node.js avec NestJS
- `frontend/` : l’application web React + Vite + Tailwind

---

## 1. Backend

### Ce que j’utilise

- `NestJS` : framework Node.js/TypeScript pour construire des APIs.
- `MongoDB` avec `mongoose` : base de données NoSQL pour stocker les utilisateurs, produits, messages, etc.
- `Passport` et `passport-jwt` : authentification JWT.
- `class-validator` / `class-transformer` : validation et transformation des DTOs.

### Structure principale

- `back-end/src/main.ts` : point d’entrée du serveur.
- `back-end/src/app.module.ts` : configuration globale des modules.
- `back-end/src/auth/` : authentification et sécurité.
- `back-end/src/products/` : gestion des produits.
- `back-end/src/users/` : gestion des utilisateurs.
- `back-end/src/messages/` : gestion des messages/contact.
- `back-end/src/config/database.ts` : configuration de la connexion MongoDB.

### Fonctions de base du backend

- API REST pour créer, lire, mettre à jour et supprimer des produits.
- Gestion des utilisateurs avec création et mise à jour de profils.
- Authentification JWT pour sécuriser les routes et les sessions.
- Enregistrement et lecture des messages de contact.
- Validation des données d’entrée avec les DTOs.
- Connexion à MongoDB via Mongoose.

### Commandes utiles

Ouvrir un terminal dans `back-end/` puis :

```bash
npm install
npm run start:dev
```

Pour exécuter le serveur NestJS en mode développement.

Autres scripts disponibles :

```bash
npm run build       # build du back-end
npm run lint        # correction/contrôle ESLint
npm run test        # tests unitaires
npm run test:e2e    # tests d'intégration
```

---

## 2. Frontend

### Ce que j’utilise

- `React` : bibliothèque pour construire l’interface utilisateur.
- `Vite` : outil de développement rapide et build.
- `Tailwind CSS` : framework CSS utilitaire pour le design.
- `react-router-dom` : navigation entre les pages.
- `@heroicons/react` : icônes pour l’interface.

### Structure principale

- `frontend/src/main.jsx` : point d’entrée React.
- `frontend/src/App.jsx` : routes principales et layout.
- `frontend/src/pages/` : pages du site (Home, Shop, Login, etc.).
- `frontend/src/components/` : composants réutilisables.
- `frontend/src/contexts/` : contexte React pour l’authentification et le panier.
- `frontend/src/utils/api.js` : appels vers l’API backend.
- `frontend/tailwind.config.js` : configuration de Tailwind.

### Fonctions de base du frontend

- Navigation entre les pages publiques et privées.
- Affichage des produits et détails produits.
- Gestion du panier et des totaux.
- Authentification utilisateur (inscription et connexion).
- Envoi de formulaires de contact et de messages.
- Interface responsive avec Tailwind.

### Commandes utiles

Ouvrir un terminal dans `frontend/` puis :

```bash
npm install
npm run dev
```

Pour lancer l’application en mode développement.

Autres scripts :

```bash
npm run build   # production build du frontend
npm run preview # prévisualisation du build
npm run lint    # vérification ESLint
```

---

## 3. Comment utiliser ce projet

1. Démarrer le backend :
   - `cd back-end`
   - `npm install`
   - `npm run start:dev`

2. Démarrer le frontend :
   - `cd frontend`
   - `npm install`
   - `npm run dev`

3. Ouvrir le navigateur sur l’adresse indiquée par Vite (généralement `http://localhost:5173`).

4. Vérifier que le backend est bien connecté à MongoDB avant d’utiliser les pages qui appellent l’API.

---

## 4. Notes utiles

- Le backend et le frontend sont deux applications indépendantes.
- Le frontend appelle le backend via des requêtes HTTP à l’API.
- Si tu veux modifier les pages du site, regarde `frontend/src/pages/`.
- Si tu veux modifier les données ou les routes API, regarde `back-end/src/`.

---

## 5. Fichier explicatif

Ce document sert de guide pour comprendre ce qui est utilisé dans chaque partie du projet et comment lancer les deux applications.
