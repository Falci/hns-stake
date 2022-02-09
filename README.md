# HNS Stake

## Project Structure

### Client

React App, Typescript, Tailwind CSS

### Server

NodeJS, Typescript, express, Sequelize.

#### Main folders

```js
src
├── db
│   ├── connect.ts
│   ├── seed.ts         // useful for dev environment
│   └── migrations      // database versioning
├── middleware          // API common intercetors
├── models
├── queue
│   ├── producer.ts     // monitors hsd and populate the queue
│   ├── queue.ts        // define queues used by multiple processes
│   ├── rest.ts         // /queue endpoint (dev only)
│   └── types.ts        // TS definitions used by queue
├── resolvers           // graphQL resolvers
├── service
│   ├── apolloServer.ts // graphQL server
│   └── hsd.ts          // `hsd` functions
├── types               // some Typescript definitions
└── server.ts           // entrypoint
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

## Docker

There are multiple yarn scripts that helps to bootstrap an local environment:

- `docker:db:start` for the main Postgres database
- `docker:redis:start` for the queue database
- `docker:hsd:start` starts hsd on regtest

TDB: migration script

## Queue

`websocket.ts` is a webscoket client connected to hsd. For each mempool or new block, this script will add their respective data in queues
