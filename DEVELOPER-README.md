# DEVELOPER README

## Setup target/doc

### 1st time

```bash
mkdir --parents target/doc/ && cd target/doc/
git clone git@github.com:schnittstabil/char-buffer.git .
git checkout --orphan gh-pages
git rm -rf .
cd ../.. && grunt doc && cd target/doc/
git add .
git commit -m "Initial commit"
git push -u origin gh-pages
git branch --delete master
cd ../..
git pull
```

### nth time

```bash
mkdir --parents target/doc/ && cd target/doc/
git clone git@github.com:schnittstabil/char-buffer.git .
git checkout gh-pages
git branch --delete master
```

## Setup target/bower

### 1st time

```bash
mkdir --parents target/bower/ && cd target/bower/
git clone git@github.com:schnittstabil/char-buffer.git .
git checkout --orphan bower
git rm -rf .
cd ../.. && grunt bower && cd target/bower/
git add .
git commit -m "Initial commit"
git push -u origin bower
git branch --delete master
cd ../..
git pull
```

### nth time

```bash
mkdir --parents target/bower/ && cd target/bower/
git clone git@github.com:schnittstabil/char-buffer.git .
git checkout bower
git branch --delete master
```

## Publish NPM Package

```bash
grunt npm
cd target/npm/

# run tests
npm install && npm test

npm pack && xdg-open char-buffer*.tgz
rm char-buffer*.tgz

# if ok
npm publish
```

## Publish Bower Package

### 1st time

```bash
grunt bower
cd target/bower/
git add .
git commit -m "v0.1.0 [ci skip]"
git tag -a v0.1.0 -m "bower v0.1.0"
git push origin bower --tags
bower register char-buffer git@github.com:schnittstabil/char-buffer.git
```

### nth time

```bash
grunt bower
cd target/bower/
git add .
git commit -m vX.Y.Z
git tag -a vX.Y.Z -m "bower vX.Y.Z"
git push origin bower --tags
```

## Links

* [JS Unit Testing on Sauce](https://saucelabs.com/docs/javascript-unit-testing-tutorial)


