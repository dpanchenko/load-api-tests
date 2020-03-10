# Test API

## Environment

 - Development environment
`Node v12.13.1`
`MongoDB v4.0.11`

## Start

 - Clone or download this repository
``` bash
git clone
```

 - Configure local environments with settings:
``` bash
export PORT=8080 # default is 8080
export MONGODB_URL=mongodb://localhost:27017/test_db # default is mongodb://localhost:27017/test_db

```

 - Enter your local directory, and install dependencies:

``` bash
npm i
```

## Commands

``` bash
# run server in development mode
npm run dev
```

``` bash
# run test suite
npm test
```

``` bash
# run linter
npm run lint
```

``` bash
# build docs
npm run doc
```

``` bash
# run prod start
npm start
```

## Description

To run this application and test suite it's a requirement to have local installed `MongoDB`.
There is possible to containerize this into Docker and create docker-compose to spin up this app and MongoDB in containers, but it's a bit outside of scope of this test task. Also its possible to setup `CircleCI` configuration (I mostly use CircleCI in my projects) to run test suite during CI workflow, `CircleCI` support using images with preinstallled `MongoDB` to run integration tests.

- About application.

This application implemented like rest-api service which has endpoints to import data into database and endpoints to get `patients` list and `patient` info. There is automaticaly generated documentation, which available by accessing url `http://<server-url:port>/docs` after start server.
There is implemented test suites with examples of unit testing and integration testing the functionality. I'm using one of most popular test framework `mocha` (https://mochajs.org) with also popular assertion library `chai` (https://www.chaijs.com). As requested for report generation I'm using `mochawesome` plugin which is allow to generate well formated html reports and allow to add to these reports some extra context. I decided to use these tools and add some requested information (like ids of patients with empty names) as context to the report.
Unit tests covers `parser` library, which is responsible for parsing lines of data file. It is covered with 100% lines.
Integration tests implemented all requested changes, using sample file for loading data into database and the same sample file parsed manually during tests as source of truth (for parsing file during test I'm using the same parser which is covered by unit tests). Test suite can be run by command `npm test`, after finish report will be generated to `public/report` folder and it will be available by accessing url `http://<server-url:port>/report` after start server.

## Detailed steps to run and check app

- make sure that you have installed localy `NodeJS` and `MongoDB`, this tested on `NodeJS v12.13.1` and `MongoDB v4.0.11`
- clone git repository
- run `npm i` for install all dependencies
- you can setup local env vars for server port (assign `PORT`) and custom `MongoDB` connection string (assign `MONGODB_URL`). By default app will use `PORT=8080` and `MONGODB_URL=mongodb://localhost:27017/test-load-db`, for test suite `MongoDB` connection string is `MONGODB_URL=mongodb://localhost:27017/integration-test-load-db`. IMPORTANT!! Make sure that you don't have any important data in these databases on local `MongoDB`.
- run command `npm test` to run test suite, report will be saved to `public/report` folder.
- you can open report manually, just open file `public/report/index.html`
- or you can start the server by the command `npm start` (or `npm run dev`)
- get access to the report by url `http://localhost:8080/report/`
- get access to the api documantation by url `http://localhost:8080/docs/`

## Code description

This app is simple ExpressJS based application. Most important files is:
- `app/lib/parser.js` - contain all parse logic, this works with separate lines of file, parse it and validate data before put into databse
- `app/modules/patients/**/*.*` - this folder contain all files reltated to patients import, here is models, service with business logic and router/controller
- `tests/**/*.*` - this folder contains all tests (utin and integration) with all fixtures

