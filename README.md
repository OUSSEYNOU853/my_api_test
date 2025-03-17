# API REST Finance - Documentation

Cette API REST permet de gérer des utilisateurs et leurs transactions financières de manière sécurisée.

## Technologies utilisées

- Laravel 12.x
- PHP 8.3
- JWT pour l'authentification
- MySQL/PostgreSQL pour la base de données

## Installation

1. Cloner le dépôt
bash
git clone https://github.com/OUSSEYNOU853/my_api_test.git
cd api-finance


2. Installer les dépendances
bash
composer install


3. Configurer l'environnement
bash
cp .env.example .env
php artisan key:generate


4. Configurer la base de données dans le fichier .env

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=my_api_test
DB_USERNAME=
DB_PASSWORD=


5. Générer la clé JWT
bash
php artisan jwt:secret


6. Exécuter les migrations
bash
php artisan migrate


7. Lancer le serveur de développement
bash
php artisan serve


## Architecture du projet

Le projet suit une architecture en couches avec les éléments suivants:

- *Controllers*: Gèrent les requêtes HTTP et les réponses
- *Services*: Contiennent la logique métier
- *Repositories*: Gèrent l'accès aux données
- *Models*: Représentent les entités de base de données
- *Requests*: Valident les données entrantes
- *Resources*: Transforment les données en sortie

## Endpoints API

### Authentication

| Méthode | Endpoint | Description | Auth requise |
|---------|----------|-------------|-------------|
| POST | /api/register | Créer un nouvel utilisateur | Non |
| POST | /api/login | Authentifier un utilisateur | Non |
| POST | /api/logout | Déconnecter un utilisateur | Oui |

### Users

| Méthode | Endpoint | Description | Auth requise |
|---------|----------|-------------|-------------|
| GET | /api/users | Liste des utilisateurs (paginée) | Oui |
| POST | /api/users | Créer un utilisateur | Oui |
| GET | /api/users/{id} | Récupérer un utilisateur | Oui |
| PUT | /api/users/{id} | Mettre à jour un utilisateur | Oui |
| DELETE | /api/users/{id} | Supprimer un utilisateur | Oui |

### Transactions

| Méthode | Endpoint | Description | Auth requise |
|---------|----------|-------------|-------------|
| GET | /api/users/{id}/transactions | Transactions d'un utilisateur | Oui |
| POST | /api/users/{id}/transactions | Créer une transaction | Oui |

## Format des données

### Utilisateur

json
{
  "id": 1,
  "name": "Ousseynou Diedhiou",
  "email": "ousseynou.diedhiou@example.com",
  "created_at": "2025-03-15T12:00:00Z",
  "updated_at": "2025-03-15T12:00:00Z"
}


### Transaction

json
{
  "id": 1,
  "user_id": 1,
  "amount": "150.75",
  "type": "credit",
  "description": "Paiement reçu",
  "created_at": "2025-03-15T12:00:00Z",
  "updated_at": "2025-03-15T12:00:00Z"
}


## Sécurité

L'API est sécurisée grâce à:

1. *JWT Authentication*: Tous les endpoints protégés nécessitent un token JWT valide
2. *Protection XSS*: Échappement des données via Laravel
3. *Protection SQL Injection*: Utilisation d'Eloquent ORM et Query Builder
4. *Validation des données*: Form Requests pour tous les endpoints

## Performance

Les optimisations de performance incluent:

1. *Eager Loading*: Évite le problème N+1
2. *Pagination*: Limite la taille des résultats
3. *Index de base de données*: Optimise les requêtes fréquentes
4. *Mise en cache*: Pour les requêtes répétées