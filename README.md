# HNS Stake

## Project Structure

### Client

React App, Typescript, Tailwind CSS

### Server

NodeJS, Typescript, express, TypeORM.

#### Main folders

```
src
├── controllers: Each *Controller.ts file are automatically registered as routes
├── db
│   ├── connect.ts
│   └── migrations: database versioning
├── models
└── server.ts: entrypoint
```

## Running locally

This repo contains 2 projects: `client` and `server`. You'll need to install their dependencies:

```bash
cd client
yarn install

cd ../server
yarn install
```

Then, you need to run both project. You can have 2 terminal windows and run `yarn start` in each folder.
For convenience, there's a PM2 script, so we can run `yarn start` once at the root folder.

## Database

The server modules use a Postgres database. Its credentials are stored in `ormconfig.json`. For convenience, there's a `yarn script` in the server's package that can start a Postgres container on Docker:

```bash
cd server
yarn docker:db:start
```

To apply the current database changes, run:

```
yarn typeorm migration:run
```
