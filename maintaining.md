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

### 0. bump version

```bash
version=MAJOR.MINOR.PATCH
sed -i "s/\(\"version\":\)\s*\".*\"/\1 \"$version\"/" package.json
```

### 1. docs

```bash
docker run -it --rm -v $PWD:/app -w /app node:8 npm i
docker run -it --rm -v $PWD:/app -w /app node:8 npm run build
docker run -it --rm -v $PWD:/app -w /app node:8 npm run docs
```

### 2. master

```bash
git add . && git commit -m "v$version"
```

### 3. npm

```bash
# build and review package
docker run -it --rm -v $PWD:/app -w /app node:8 npm pack && file-roller char-buffer*.tgz && rm char-buffer*.tgz

# if ok
git tag "v$version" && git push && git push --tags && npm publish
```

## Links

* [JavaScript Unit Testing on Sauce](https://wiki.saucelabs.com/display/DOCS/JavaScript+Unit+Testing)
