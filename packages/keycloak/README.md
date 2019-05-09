# Magi Shift Keycloak

Magishift is Low-Code Framework, helps you to build application easier, faster and a more efficient use of time. By using magishift it doesn’t matter whether you have software engineer background or not to start deploy your application.

## To start example app

### Prerequisites

- Make sure you have docker with docker-compose installed properly in your machine
- Make sure you have node with npm or yarn in your machine.

### Start Docker Container

```
docker-compose up -d
```

### Run the app

using npm:

```
npm install
npm run start
```

using yarn:

```
yarn install
yarn start
```

### Run the serverless offline

using npm:

```
npm run sls:offline
```

using yarn:

```
yarn sls:offline
```


check api endpoint
`http://localhost:{PORT}`

## Database migration

Automatic generate migration script

```
npm run migration:generate -n MigrationFileName
or
yarn migration:generate -n MigrationFileName
```

Run migration script

```
npm run migration:run
or
yarn migration:run
```

Revert migration script

```
npm run migration:revert
or
yarn migration:revert
```

more advanced command and config refer to here:

- [TypeOrm Migration](https://github.com/typeorm/typeorm/blob/master/docs/migrations.md)

## Code of conduct

- Never create feature/module that specific to one project
- Always create interface and abstraction layer
- If you unsure always ask, cause if you break something here means other project will break
- Always create unit test properly
