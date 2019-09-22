# Maintaining [![Dependency Status](https://david-dm.org/schnittstabil/char-buffer.svg)](https://david-dm.org/schnittstabil/char-buffer) [![devDependency Status](https://david-dm.org/schnittstabil/char-buffer/dev-status.svg)](https://david-dm.org/schnittstabil/char-buffer#info=devDependencies) [![Coverage Status](https://coveralls.io/repos/github/schnittstabil/char-buffer/badge.svg?branch=master)](https://coveralls.io/github/schnittstabil/char-buffer?branch=master)


## Setup

```bash
docker run -it --rm -v $PWD:/app -w /app  node:8 npm i
```

## Testing

### Linting and Unit Tests

```bash
docker run -it --rm -v $PWD:/app -w /app node:8 npm test
```

## Publish

### 1. docs

```bash
docker run -it --rm -v $PWD:/app -w /app node:12 npm i
docker run -it --rm -v $PWD:/app -w /app node:12 npm run build
docker run -it --rm -v $PWD:/app -w /app node:12 npm run docs
```

### 2. master

```bash
git add . && git commit && git push
# or
git add . && git commit --amend  && git push --force
```

### 3. npm
```bash

# build and review package
npm pack && xdg-open char-buffer*.tgz
rm char-buffer*.tgz

# if ok
npm publish
```

## Links

* [JavaScript Unit Testing on Sauce](https://wiki.saucelabs.com/display/DOCS/JavaScript+Unit+Testing)
