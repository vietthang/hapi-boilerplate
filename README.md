# hapi-boilerplate

Hapi.js boilerplate

## Installation

Download node at [nodejs.org](http://nodejs.org) and install it, if you haven't already.

```sh
npm install hapi-boilerplate --save
```


## Tests

```sh
npm install
npm test
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
```
npm run watch # run build and continously watch files for changed and rebuild
npm run server # run server and auto reload when file change
npm run mocha # run all test cases (lighter than "npm test")
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
  | | ├ asyncHandler.js     # <-- Hapi.js plugin to help write route handlers
  | | |                     #     using async/await more naturally.
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

## Dependencies

- [bluebird](https://github.com/petkaantonov/bluebird): Full featured Promises/A+ implementation with exceptionally good performance
- [bookshelf](https://github.com/tgriesser/bookshelf): A lightweight ORM for PostgreSQL, MySQL, and SQLite3
- [boom](https://github.com/hapijs/boom): HTTP-friendly error objects
- [confidence](https://github.com/hapijs/confidence): Configuration API
- [good](https://github.com/hapijs/good): Server and process monitoring plugin
- [good-console](https://github.com/hapijs/good-console): Console broadcasting for Good process monitor
- [hapi](https://github.com/hapijs/hapi): HTTP Server framework
- [hapi-swaggered-ui](https://github.com/z0mt3c/hapi-swaggered-ui): Easy swagger-ui drop-in plugin for hapi to be used with hapi-swaggered.
- [inert](https://github.com/hapijs/inert): Static file and directory handlers plugin for hapi.js
- [joi](https://github.com/hapijs/joi): Object schema validation
- [knex](https://github.com/tgriesser/knex): A batteries-included SQL query &amp; schema builder for Postgres, MySQL and SQLite3 and the Browser
- [lodash](https://github.com/lodash/lodash): Lodash modular utilities.
- [mysql](https://github.com/felixge/node-mysql): A node.js driver for mysql. It is written in JavaScript, does not require compiling, and is 100% MIT licensed.
- [redis](https://github.com/NodeRedis/node_redis): Redis client library
- [source-map-support](https://github.com/evanw/node-source-map-support): Fixes stack traces for files with source maps
- [sqlite3](https://github.com/mapbox/node-sqlite3): Asynchronous, non-blocking SQLite3 bindings
- [swagger-parser](https://github.com/BigstickCarpet/swagger-parser): Swagger 2.0 parser and validator for Node and browsers
- [uuid](https://github.com/defunctzombie/node-uuid): Rigorous implementation of RFC4122 (v1 and v4) UUIDs.
- [vision](https://github.com/hapijs/vision): Templates rendering plugin support for hapi.js

## Dev Dependencies

- [babel-cli](https://github.com/babel/babel/tree/master/packages): Babel command line.
- [babel-core](https://github.com/babel/babel/tree/master/packages): Babel compiler core.
- [babel-eslint](https://github.com/babel/babel-eslint): Custom parser for ESLint
- [babel-loader](https://github.com/babel/babel-loader): babel module loader for webpack
- [babel-plugin-add-module-exports](https://github.com/59naga/babel-plugin-add-module-exports): Fix babel/babel#2212
- [babel-plugin-istanbul](https://github.com/istanbuljs/babel-plugin-istanbul): A babel plugin that adds istanbul instrumentation to ES6 code
- [babel-plugin-lodash](https://github.com/lodash/babel-plugin-lodash): Modular Lodash builds without the hassle.
- [babel-preset-node6](https://github.com/salakar/babel-preset-node6): Babel preset for Node 6.x (ES6 / ES2015)
- [babel-preset-stage-2](https://github.com/babel/babel/tree/master/packages): Babel preset for stage 2 plugins
- [bugger](https://github.com/buggerjs/bugger): Chrome Devtools Agents for node.js
- [chai](https://github.com/chaijs/chai): BDD/TDD assertion library for node.js and the browser. Test framework agnostic.
- [chai-as-promised](https://github.com/domenic/chai-as-promised): Extends Chai with assertions about promises.
- [concurrently](https://github.com/kimmobrunfeldt/concurrently): Run commands concurrently
- [eslint](https://github.com/eslint/eslint): An AST-based pattern checker for JavaScript.
- [eslint-config-airbnb](https://github.com/airbnb/javascript): Airbnb&#39;s ESLint config, following our styleguide
- [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import): Import with sanity.
- [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y): A static analysis linter of jsx and their accessibility with screen readers.
- [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react): React specific linting rules for ESLint
- [forever](https://github.com/foreverjs/forever): A simple CLI tool for ensuring that a given node script runs continuously (i.e. forever)
- [json-schema-loader](https://github.com/cloudflare/json-schema-loader): Webpack loader that resolves Json Schema references.
- [mocha](https://github.com/mochajs/mocha): simple, flexible, fun test framework
- [nyc](https://github.com/istanbuljs/nyc): the Istanbul command line interface
- [source-map-support](https://github.com/evanw/node-source-map-support): Fixes stack traces for files with source maps
- [webpack](https://github.com/webpack/webpack): Packs CommonJs/AMD modules for the browser. Allows to split your codebase into multiple bundles, which can be loaded on demand. Support loaders to preprocess files, i.e. json, jade, coffee, css, less, ... and your custom stuff.
- [webpack-node-externals](https://github.com/liady/webpack-node-externals): Easily exclude node_modules in Webpack bundle


## License

MIT

_Generated by [package-json-to-readme](https://github.com/zeke/package-json-to-readme)_
