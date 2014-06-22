# DEVELOPMENT README

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

## Setup target/master

```bash
mkdir --parents target/master/ && cd target/master/
git clone git@github.com:schnittstabil/char-buffer.git .
```

## Publish

### Bower 1st time

```bash
grunt dist
cd target/master/
git add .
git commit -m "bower v0.1.0"
git tag v0.1.0
git push origin master --tags
bower register char-buffer git@github.com:schnittstabil/char-buffer.git
```

### nth time
```bash
grunt dist
cd target/master/

# run tests
npm install && npm test

npm pack && xdg-open char-buffer*.tgz
rm char-buffer*.tgz

# if ok
npm publish

# bower:
# bump version @ package.json && build dist
git add .
git commit -m "bump version"
git tag vX.Y.Z
git push origin master --tags
```

## Links

* [JS Unit Testing on Sauce](https://saucelabs.com/docs/javascript-unit-testing-tutorial)
