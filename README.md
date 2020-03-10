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

## Links

Documentation is available on root url like `http://localhost:8080/docs` after run command `npm run doc`

