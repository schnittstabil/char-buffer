# Maintaining [![Dependency Status](https://david-dm.org/schnittstabil/char-buffer.svg)](https://david-dm.org/schnittstabil/char-buffer) [![devDependency Status](https://david-dm.org/schnittstabil/char-buffer/dev-status.svg)](https://david-dm.org/schnittstabil/char-buffer#info=devDependencies) [![Coverage Status](https://coveralls.io/repos/github/schnittstabil/char-buffer/badge.svg?branch=master)](https://coveralls.io/github/schnittstabil/char-buffer?branch=master)


## Testing

### Linting and Unit Tests

```bash
npm test
# or with coverage report
npm run test-cover-html
```

### Browser

```bash
node_modules/.bin/jspm update
node_modules/.bin/jspm bundle test/_mocha.js test-build.js
# Local
npm run test-browser-local
# Saucelabs
SAUCE_USERNAME=schnittstabil SAUCE_ACCESS_KEY=… node_modules/.bin/grunt saucelabs
```


## Publish

### 1. gh-pages

#### Prerequisites

```bash
[sudo] gem install jsduck

mkdir gh-pages
cd gh-pages
git clone git@github.com:schnittstabil/char-buffer.git .
git checkout gh-pages
cd ..
```

#### Build

```bash
cd gh-pages && git pull && cd ..
npm run docs
```

#### Upload

```bash
cd gh-pages && git add . && git commit && git push && cd ..
# or
cd gh-pages && git add . && git commit --amend && git push --force && cd ..
```

### 2. master

```bash

# ensure readme.md is the current version
npm run docs

git add . && git commit && git push
# or
git add . && git commit --amend  && git push --force
```

### 3. npm
```bash

# ensure readme.md is the current version
npm run docs

# build and review package
npm pack && xdg-open char-buffer*.tgz
rm char-buffer*.tgz

# if ok
npm publish
```

## Links

* [JavaScript Unit Testing on Sauce](https://wiki.saucelabs.com/display/DOCS/JavaScript+Unit+Testing)
