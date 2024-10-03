# Development Guide

This is a guide to run the complete Torrust Index solution in development mode. It is not intended to be used in production.

The whole solution includes the following:

- The Torrust Tracker (the tracker linked to the Index).
- The Torrust Index (the API).
- The Torrust Index GUI (the front-end web GUI).

It runs all the services locally, so you can modify the code and see the changes immediately.
You will need to run these all the three services.

Before installing and running the services you can create a new directory to clone all the repositories from GitHub.

```s
cd /tmp && mkdir torrust && cd torrust/
git clone https://github.com/torrust/torrust-tracker
git clone https://github.com/torrust/torrust-index
git clone https://github.com/torrust/torrust-index-gui
```

After installing all the repos you will have the following directory structure.

```s
$ tree -L 2
.
├── torrust-index
│   ├── build.rs
│   ├── Cargo.lock
│   ├── Cargo.toml
│   ├── codecov.yaml
│   ├── compose.yaml
│   ├── Containerfile
│   ├── contrib
│   ├── cspell.json
│   ├── docs
│   ├── LICENSE
│   ├── migrations
│   ├── packages
│   ├── project-words.txt
│   ├── README.md
│   ├── rustfmt.toml
│   ├── share
│   ├── src
│   ├── templates
│   ├── tests
│   └── upgrades
├── torrust-index-gui
│   ├── app.vue
│   ├── assets
│   ├── bin
│   ├── components
│   ├── composables
│   ├── compose.yaml
│   ├── Containerfile
│   ├── contrib
│   ├── COPYRIGHT
│   ├── cspell.json
│   ├── cypress
│   ├── cypress.config.ts
│   ├── docs
│   ├── dot.env.local
│   ├── img
│   ├── LICENSE-AGPL_3_0
│   ├── LICENSE-MIT_0
│   ├── licensing
│   ├── nuxt.config.ts
│   ├── package.json
│   ├── package-lock.json
│   ├── pages
│   ├── plugins
│   ├── postcss.config.js
│   ├── project-words.txt
│   ├── public
│   ├── README.md
│   ├── SECURITY.md
│   ├── share
│   ├── src
│   ├── tailwind.config.js
│   └── tsconfig.json
└── torrust-tracker
    ├── Cargo.lock
    ├── Cargo.toml
    ├── codecov.yaml
    ├── compose.yaml
    ├── Containerfile
    ├── contrib
    ├── cSpell.json
    ├── docs
    ├── LICENSE
    ├── NOTICE
    ├── packages
    ├── README.md
    ├── rustfmt.toml
    ├── SECURITY.md
    ├── share
    ├── src
    └── tests

33 directories, 40 files
```

You can also run the Index GUI using the docker images for the [Tracker][tracker] and [Index][index].
Please refer to their respective documentation for more information.

## Run the tracker

Please refer to the [Tracker documentation][tracker].

## Run the Index

Please refer to the [Index documentation][index].

By default, the Index API has the most restrictive CORS policy. This means that the Index GUI cannot access the Index API, because they are running on different ports. If you run the backend as it is, you will see the following error in the browser console.

```s
Access to fetch at 'http://localhost:3001/v1/torrents?page_size=50&page=0&sort=UploadedDesc&categories=&tags=' from origin 'http://localhost:3000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
```

You need to enable the Cors layer with the permissive option setting the environment variable `TORRUST_INDEX_API_CORS_PERMISSIVE` to `true`.

For example:

```console
TORRUST_INDEX_API_CORS_PERMISSIVE=true cargo run
```

## Run the Index GUI

Requirements:

- Node: `^20.10.0`

```s
git clone git@github.com:torrust/torrust-index-gui.git
cd torrust-index-gui/
cp .env.local .env
npm install
npm run dev
```

**NOTICE** Make sure the `.env` file is present in the root directory of the Index GUI. And contains the API URL.

```s
API_BASE_URL=http://localhost:3001/v1
```

After running `npm run dev` you should see something like this in the console.

```s
Nuxi 3.7.4 with Nitro 2.6.3

  -> Local:    http://localhost:3000/ 
  -> Network:  use --host to expose

ℹ Using Tailwind CSS from ~/assets/css/tailwind.css
...
```

You can also see this warning in the console.

```s
WARN  Browserslist: caniuse-lite is outdated. Please run:
  npx update-browserslist-db@latest
  Why you should do it regularly: https://github.com/browserslist/update-db#readme
```

You only need to follow the instructions and run `npx update-browserslist-db@latest`.

If you want to run the Index GUI like int production you can run the following command.

```s
npm run build && npm run preview
```

More information about the [nuxt][nuxt] command can be found [here][nuxt_commands].

### Working with Torrust Dependencies

We have two internal dependencies:

- [torrust-index-types-lib](https://github.com/torrust/torrust-index-types-lib): Basic TypeScript types for the Index API.
- [torrust-index-api-lib](https://github.com/torrust/torrust-index-api-lib): A wrapper in TypeScript for the INdex API.

Sometimes when the Index API changes, it might be useful to test the Index GUI with the new packages versions at the same time before releasing new versions for these packages. You could even be working on the Index API, the Index GUI and these packages at the same time if the feature requires changes in the API.

There are two ways of using local packages with NPM:

- [npm link](https://docs.npmjs.com/cli/v10/commands/npm-link).
- [npm install](https://docs.npmjs.com/cli/v10/commands/npm-install).

We will describe the `npm install` option.

It's possible to install a local dependency by using its path:

```console
npm install --save ../torrust-index-api-lib
npm install --save ../torrust-index-types-lib
```

After running those commands your `package.json` will have:

```json
{
  "name": "torrust-index-gui",
  "dependencies": {
    "torrust-index-api-lib": "file:../torrust-index-api-lib",
    "torrust-index-types-lib": "file:../torrust-index-types-lib",
  }
}
```

And your `node_modules` should have symbolic links for these packages.

You can start changing any project. You will need to rebuild the dependency (`npm run build`) any time you make a change. If you are using `npm run dev` for the Index GUI you won't need to do anything else.

> Warning: You can't push these changes in the `package.json`. Once you are done you have to release a new package version and update the `package.json`.

## Testing

### Unit tests

We do not have nay unit tests yet. You can contribute by:

- [Setting up the scaffolding for unit testing](https://github.com/torrust/torrust-index-gui/issues/164).
- Adding unit tests.

You can take a look at issues tagged with [testing](https://github.com/torrust/torrust-index-gui/issues?q=is%3Aissue+is%3Aopen+label%3Atesting).

### E2E tests

For now we only have E2E tests. We are starting to write E2E tests for the Index GUI. The [Index Index API](https://github.com/torrust/torrust-index/tree/develop/tests/e2e) has some tests, so part of the functionality is tested.

You can contribute adding more E2E tests. We are using this [issue](https://github.com/torrust/torrust-index-gui/issues/148) to track the tests we want to add.

In order to run the E2E test you need to have a running application at <http://localhost:3000>. There are two important variables hardcoded in the Cypress configuration file `cypress.config.ts`:

- The base URL: `http://localhost:3000` for the E2E testing environment.
- The database file path: `./storage/index/lib/database/e2e_testing_sqlite3.db` for the E2E testing environment.

Those variables describe how to access the system under test.

> **IMPORTANT** The database file path is relative to the root directory of the Index GUI. We should try to avoid this kind of dependencies. But for now, it is the easiest way to run the E2E tests. Ideally we should be able to run the test suit against any environment. For example, we should be able to run the test suit against an staging environment. That's still possible if we are running the tests from a machine that has access to the filesystem environment or we could start running the test using MySQL SQLite.

The Cypress configuration file looks like this:

```TypeScript
export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents (on, config) {
      on("task", {
        // Category context
        deleteCategory: ({ name }) => {
          return deleteCategory(name, databaseConfig(config));
        },
        addCategory: ({ name }) => {
          return addCategory(name, databaseConfig(config));
        },
        // Tag context
        deleteTags: () => {
          return deleteTags(databaseConfig(config));
        },
        addTag: ({ name }) => {
          return addTag(name, databaseConfig(config));
        },
        // Torrent context
        deleteTorrent: ({ infohash }) => {
          return deleteTorrent(infohash, databaseConfig(config));
        },
        deleteTorrentsInfoFromDatabase: () => {
          return deleteTorrentsInfoFromDatabase(databaseConfig(config));
        },
        // User context
        grantAdminRole: ({ username }) => {
          return grantAdminRole(username, databaseConfig(config));
        },
        deleteUser: ({ username }) => {
          return deleteUser(username, databaseConfig(config));
        }
      });
    }
  },
  env: {
    db_file_path: "./storage/index/lib/database/e2e_testing_sqlite3.db"
  }
});
```

The database file path (`db_file_path`) is needed because some tests need to access the database directly. For example, the test that grants the `admin` role to a user. There is no way to create administrator users using the Index GUI. So, we need to do it directly in the database.

You can run the E2E test environments in two different ways:

- Using docker compose.
- Running the Tracker, Index and the Index GUI locally (development environment).

If you want to use the docker-compose environment you need to run the following command:

```s
./contrib/dev-tools/container/e2e/sqlite/run-e2e-tests.sh
```

This is the way we run the E2E tests in the CI/CD pipeline.

You should use the development environment if you want to debug the E2E tests or you are writing tests and code at the same time.

**NOTICE** You will need to change the database file path in the Index to use the same as in the Index GUI so the running Index and the Cypress tests can access the same database. For example, change the database `connect_url` value in the Index config file to `"sqlite://../torrust-index-gui/storage/index/lib/database/e2e_testing_sqlite3.db?mode=rwc"` or whatever the path is in your machine.

Once the E2E environment is up, you can run the E2E tests with the following command.

```s
npm run cypress:run
```

With that command you will use the headless browser. If you want to see the browser while the tests are running you can run the following command:

```s
npm run cypress:open
```

Please refer to the [Cypress documentation](https://docs.cypress.io/) for more information.

If you want to contribute please read the [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices) documentation.

[tracker]: https://github.com/torrust/torrust-tracker
[index]: https://github.com/torrust/torrust-index
[nuxt]: https://nuxt.com/
[nuxt_commands]: https://nuxt.com/docs/api/commands/add
