# DI-Ugo

## Démarrage complet du projet avec Docker

Assurez-vous d'avoir **Docker** et **Docker Compose** installés sur votre machine.

### 1. Cloner le dépôt

```bash
git clone <url-du-repo>
cd DI-Ugo
```

### 2. Configuration de la base de données

Créez un fichier `.env.local` dans le répertoire `backend/` avec le contenu suivant :

```
DATABASE_URL="postgresql://symfony:symfony@db:5432/symfony?serverVersion=15&charset=utf8"
```

Cette configuration est essentielle pour que votre application se connecte correctement à la base de données PostgreSQL dans l'environnement Docker.

### 3. Lancer les services avec Docker Compose

```bash
docker-compose up --build
```

Cette commande va :
- Construire et démarrer le backend Symfony (port 8000)
- Démarrer la base de données PostgreSQL (port 5432)
- Construire et démarrer le frontend React (port 80)

### 4. Initialiser la base de données

Ouvrez un nouveau terminal et exécutez la commande suivante pour accéder au conteneur du backend :

```bash
docker exec -it symfony-backend bash
```

Puis, à l'intérieur du conteneur, lancez les migrations Doctrine pour créer les tables :

```bash
php bin/console doctrine:migrations:migrate
```

### 5. Importer les données de test

Toujours dans le conteneur backend, exécutez la commande suivante pour importer les clients et les achats à partir des fichiers CSV fournis :

```bash
php bin/console ugo:orders:import
```

Un message de succès s'affichera si l'import s'est bien déroulé.

### 6. Accéder à l'application

- **Frontend** : [http://localhost](http://localhost)
- **Backend (API)** : [http://localhost:8000/api](http://localhost:8000/api)

### 7. Arrêter les services

Pour arrêter tous les services Docker :

```bash
docker-compose down
```

---

## Exécuter les tests

### Tests du backend (Symfony)

Pour exécuter les tests unitaires et fonctionnels du backend :

```bash
php bin/phpunit
```

### Tests du frontend (React)

### Tests end-to-end avec Cypress

Pour exécuter spécifiquement les tests de composants :

```bash
npx cypress run --component
```

---

### Améliorations du projet
- Améliorer l'UX du frontend
- Configuration d'un cache (Redis) pour améliorer les performances
- Pagination et chargement optimisé des données dans les tableaux pour de meilleures performances
- Fonctionnalité de facturation basée sur les commandes
- Système de notification par email pour les nouvelles commandes
- Ajouter un système de gestion des utilisateurs et de contrôle d'accès
