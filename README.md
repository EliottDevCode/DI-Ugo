# DI-Ugo

## Démarrage complet du projet avec Docker

Assurez-vous d'avoir **Docker** et **Docker Compose** installés sur votre machine.

### 1. Cloner le dépôt

```bash
git clone <url-du-repo>
cd DI-Ugo
```

### 2. Lancer les services avec Docker Compose

```bash
docker-compose up --build
```

Cette commande va :
- Construire et démarrer le backend Symfony (port 8000)
- Démarrer la base de données PostgreSQL (port 5432)
- Construire et démarrer le frontend React (port 80)

### 3. Initialiser la base de données

Ouvrez un nouveau terminal et exécutez la commande suivante pour accéder au conteneur du backend :

```bash
docker exec -it symfony-backend bash
```

Puis, à l'intérieur du conteneur, lancez les migrations Doctrine pour créer les tables :

```bash
php bin/console doctrine:migrations:migrate
```

### 4. Importer les données de test

Toujours dans le conteneur backend, exécutez la commande suivante pour importer les clients et les achats à partir des fichiers CSV fournis :

```bash
php bin/console ugo:orders:import
```

Un message de succès s'affichera si l'import s'est bien déroulé.

### 5. Accéder à l'application

- **Frontend** : [http://localhost](http://localhost)
- **Backend (API)** : [http://localhost:8000/api](http://localhost:8000/api)

### 6. Arrêter les services

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

### Remarques importantes

- Les données de la base PostgreSQL sont persistées dans un volume Docker nommé `db-data`.
- Les fichiers CSV d'exemple sont situés dans `backend/csv/`.
- Vous pouvez modifier les fichiers dans `frontend/` ou `backend/` pour voir les changements appliqués automatiquement (hot reload).
- Si vous souhaitez réinitialiser la base de données, supprimez le volume Docker associé ou utilisez les commandes Doctrine appropriées.
