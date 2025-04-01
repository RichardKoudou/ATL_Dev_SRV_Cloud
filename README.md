Une API moderne conçue pour avoir plus d'informations sur des films (genre, directeurs, commentaires). 
Elle permet aux utilisateurs de consulter les films, tout en assurant la sécurité, la performance et la facilité d'utilisation.

## Table des matières

- Fonctionnalités
- Technologies utilisées 
- Installation et Configuration
- Déploiement local
- Déploiement via Vercel

## Fonctionnalités

- Authentification des utilisateurs : Inscription, connexion, gestion des sessions.
- Sécurité : Cryptage des mots de passe avec `bcrypt` pour garantir la sécurité des données sensibles.
- Déploiement facile : Hébergement avec Vercel pour une mise en ligne rapide et sans effort et déploiement local (npm run build).

## Technologies utilisées

- Backend : Node.js, Nextjs
- Base de données : MongoDB
- Sécurité : `bcrypt` pour le hachage des mots de passe, `jsonwebtoken` pour la gestion des tokens.
- Déploiement : Vercel pour le déploiement continu.

## Installation et Configuration

### Prérequis

Avant de commencer, assurez-vous que vous avez installé les éléments suivants :

- **Node.js** (version recommandée : 14.x ou supérieure)
- **npm**

### Étapes d'installation

1. Clonez ce repository :

   ```bash
   git clone https://github.com/RichardKOUDOU/ATL_Dev_SRV_Cloud.git
   ```

2. Accédez au répertoire du projet :

   ```bash
   cd ATL_Dev_SRV_Cloud/with-mongodb-atl_service_cloud
   ```

3. Installez les dépendances :

   Avec npm :

   ```bash
   npm install
   ```


4. Lancez le serveur de développement :

   Avec npm :

   ```bash
   npm run dev
   ```

   Cela démarrera l'application en mode développement sur `http://localhost:3000`.

## Consulter la documentation de l'API

GET : http://localhost:3000/api-doc


## Déploiement local

   ```bash
   npm run build
   ```

## Déploiement avec Vercel via Vercel CLI
 ### Prérequis
 
  Installer Vercel  
  
   ```bash
   cd ATL_Dev_SRV_Cloud/with-mongodb-atl_service_cloud
   ```

   ```bash
   npm i -g vercel
   ```
   ```bash
   vercel --version
   ```

  ### Se connecter
  
   ```bash
   vercel login
   ```
   ```bash
   vercel project ls
   ```

  ### Déployer
  
   ```bash
   vercel --prod
   ```
