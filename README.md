# hapi-boilerplate

Hapi.js boilerplate

## Installation

Download node at [nodejs.org](http://nodejs.org) and install it, if you haven't already.

```sh
npm install
```

## Tests

```sh
npm install
npm test # check for code style, run all test cases and generate coverage report
```

## Build (production)
```sh
npm build
```

## Start (production)
```sh
npm start --production
```

## Development

### Before run

Setup database as in file `/src/db/knexfile.js`, 'development' config. Then run

```
npm run migrate:latest
npm run seed:run
```

### Run

Quick start:
```
npm run dev # run build & server, also watch source files for rebuild & restart server
```

Or run each for following command in separate command line tabs:
```
npm run watch # run build and continuously watch files for changed and rebuild
```

```
npm run server # run server and auto reload when source files change
```

```
npm run mocha # run all test cases
```

## Database migrations
Read [knex](http://knexjs.org/#Migrations) for more information.

### Create new migration file
```
npm run migrate:make [name]
```

### Update database to latest version
```
npm run migrate:latest
```

### Rollback a version of database
```
npm run migrate:rollback
```

### Make a new seed file
```
npm run seed:make [name]
```

### Run seed files
```
npm run seed:run
```

## Project structure
```
└ project
  ├ src/                    # <-- Directory contains all source code
  | |
  | ├ components/           # <-- Directory contains all helpers/utilities
  | |                       #     which don't depend on hapi.js
  | | |
  | | ├ config.js           # <-- Helper to load config from config.js file and
  | | |                     #     parse base on NODE_ENV environment variable.
  | | |                     #     Using confidence.
  | | |
  | | ├ knex.js             # <-- Return an instance of knex.
  | | |
  | | ├ orm.js              # <-- Simple module to wrap bookshelf Model to
  | | |                     #     provide some utilities functions like
  | | |                     #     validation.
  | | |
  | | ├ redis.js            # <-- Return an instance of redis. Also provide
  | | |                     #     promise interface.
  | | |
  | | ├ resolveAllOf.js     # <-- Helper to resolve "allOf" in json schema.
  | | |
  | | └ ...
  | |
  | ├ controllers/          # <-- Directory contains all controllers (hapi
  | |                       #     handler functions)
  | |
  | ├ db/                   # <-- Directory contains db configuration,
  | | |                     #     migrations, seed files to work with both
  | | |                     #     application and knex command line.
  | | |
  | | ├ migrations/         # <-- Directory contains migration files. Read
  | | |                     #     knex.js docs for more information.
  | | |
  | | ├ seeds/              # <-- Directory contains seed files. Read knex.js
  | | |                     #     docs for more information.
  | | |
  | | └ knexfile.js         # <-- knex configuration file. Read knex.js docs
  | |                       #     for more information.
  | |
  | ├ models/               # <-- Directory contains all models.
  | |
  | ├ modules/              # <-- Directory contains all modules which work
  | | |                     #     as hapi.js plugin
  | | |
  | | ├ apiLoader.js        # <-- Loader swagger config and generate hapi.js
  | | |                     #     route config.
  | | |
  | | └ ...
  | |
  | ├ schemas/              # <-- Directory contains schemas of api & models.
  | | |
  | | ├ api.swagger.yaml    # <-- Root api file, defines all routes here.
  | | |
  | | ├ common.yaml         # <-- Include common parameters for api.
  | | |
  | | └ models/             # <-- Directory contains all models definitions.
  | |   |
  | |   ├ common.yaml       # <-- Include common properties for all models.
  | |   |
  | |   └ ...
  | |
  | ├ config.js             # <-- Application config file, using "confidence".
  | |
  | ├ index.js              # <-- Application entry, contains "main" function,
  | |                       #     load hapi.js server(with plugins) and start.
  | |
  | └ routes.js             # <-- Mapping from swagger operationId to handler
  |                         #     method in controllers.
  |
  ├ test/                   # <-- Directory contains all test files. (Files
  | |                       #     with name "*.spec.js" will be run when test)
  | |
  | ├ common/               # <-- Directory contains some helpers included
  | |                       #     in many test cases.
  | |
  | └ ...
  |
  ├ scripts/                # <-- Directory contains webpack build scripts.
  | |                       #     (Some advanced & confusing shit.)
  | |
  | └ ...
  |
  ├ lib/                    # <-- Auto generated directory contains compiled
  |                         #     library to use in production.
  |
  ├ build/                  # <-- Auto generated directory contains compiled
  |                         #     artifacts for test & dev.
  |
  ├ coverage/               # <-- Auto generated directory contains code
  |                         #     coverage information.
  |
  ├ .babelrc                # <-- Babel configuration file.
  |
  ├ .eslintignore           # <-- ESLint ignore file.
  |
  ├ .eslintrc               # <-- ESLint configuration file.
  |
  ├ index.js                # <-- Entry file. Load in build if NODE_ENV is
  |                         #     "development" or lib if NODE_ENV is "production"
  |
  ├ package.json            # <-- npm configuration file. Contains magic.
  |
  ├ README.md               # <-- This stupid file.
  |
  └  ...
```

## License

MIT
