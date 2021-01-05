# Audioconf
Des conférences téléphoniques pour les agents de l'Etat.

## Développement

L'environnement de développement est préconfiguré pour Visual Code.
Pour profiter de l'intégration avec ESLint, il faut installer le plugin du même nom.

## Lancer le projet

### Générer clé API OVH

Demander à vos collègues les identifiants pour générer la clé sur ce lien : https://eu.api.ovh.com/createToken/

### Configuration OVH de Dev
Avec OVH_ROOM_ACCOUNT_NUMBER à demander à vos collègues
```
POST /telephony/${OVH_ROOM_ACCOUNT_NUMBER}/*
PUT /telephony/${OVH_ROOM_ACCOUNT_NUMBER}/*
GET /telephony/${OVH_ROOM_ACCOUNT_NUMBER}/*
```

### En local sans docker
Installer et lancer postgres et maildev en local, ensuite: 
1. `cp .env.sample .env`. Remplir le fichier avec les configurations obtenues par OVH
2. `npm install`
3. `npm run migrate`
4. `npm run dev`

### Avec docker compose
1. `cp .env.sample .env.conferences.dev`. Remplir le fichier avec les configurations obtenues par OVH
2. Récupérer les dépendences : `docker-compose run -u root web npm install`
3. Créer les tables de la DB : `docker-compose run web npm run migrate`
4. Lancer le service : `docker-compose up` ou `docker-compose run -p 8080:8080 web npm run dev`

### Bon déroulement de l'opération
Vous devriez normalement voir dans les logs ceci : 
```
CoucouCollègues listening at http://localhost:8080
```

## Test
### Docker compose
```
docker-compose run web npm test
```

### Sans docker
```
npm test
```

### Tester manuellement l'application
1. Se connecter sur http://localhost:8080
2. Remplir son email et son horaire
3. Consulter le http://localhost:1080/#/ pour voir l'email envoyé par le service

## Créer des migrations

[KnexJS](http://knexjs.org/#Migrations) permet de créer des migrations de base de données. Un shortcut a été ajouté au `package.json` pour créer une migration :

```
npm run makeMigration <nom de la migration>
```

Une fois la migration créée, vous pouvez l'appliquer avec :

```
npm run migrate
```


Pour utiliser d'autres commandes, le [CLI de KnexJS](http://knexjs.org/#Migrations) est disponible avec `./node_modules/knex/bin/cli.js`. Par exemple, pour faire un rollback :

```
./node_modules/knex/bin/cli.js migrate:rollback
```

## Test de charge Locust

- `cd locust`
- `docker-compose up --scale worker=8` (8 c'est pour 8 CPU)
- Ouvrir http://localhost:8089/

## Tester que le HTML d'un site est valide

```
npm run checkHTML --  <url du site à tester>
```

Si on veut checker pour une PR donnée, utiliser l'url de la review app de la PR (voir les checks dans la PR).

Pour valider le code en local :

```
npm run checkHTMLLocal
```

## Sticky sessions

Le système de session est `in memory`. Dans un environnement à plusieurs containers web, cela peut poser des problèmes. 
Comme la production est dans ce cas, il faut activer les sticky sessions. 
Bien vérifier donc qu'ils sont activés (dans Scalingo > Settings).

## SQL

- Total de réservation par nom de domaine : `select substring(email from '@[^@]*$') as domain, count(*) from conferences group by domain order by count DESC;`
- Nombre de réservations par durée de réservation : `SELECT "durationInMinutes" , count(*) as count from conferences GROUP BY "durationInMinutes" ORDER BY count DESC;`
- Nombre de réservations annulées : `SELECT "canceledAt" IS NOT NULL as canceled, count(*) from conferences GROUP BY canceled;`### Configuration OVH de Prod


## Configuration production OVH pour générer les clés
Points d'API nécessaires pour les fonctionalités actuelles, pour l'API Rooms :

```
POST /telephony/${OVH_ROOM_ACCOUNT_NUMBER}/conference/${OVH_ROOM_PHONE_NUMBER}/rooms
PUT /telephony/${OVH_ROOM_ACCOUNT_NUMBER}/conference/${OVH_ROOM_PHONE_NUMBER}/rooms/*
GET /telephony/${OVH_ROOM_ACCOUNT_NUMBER}/conference/${OVH_ROOM_PHONE_NUMBER}/roomsStats
```