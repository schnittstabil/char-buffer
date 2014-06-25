# char-buffer [![Dependencies Status Image](https://gemnasium.com/schnittstabil/char-buffer.svg)](https://gemnasium.com/schnittstabil/char-buffer) [![Build Status Image](https://travis-ci.org/schnittstabil/char-buffer.svg)](https://travis-ci.org/schnittstabil/char-buffer) [![Coverage Status](https://coveralls.io/repos/schnittstabil/char-buffer/badge.png)](https://coveralls.io/r/schnittstabil/char-buffer) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

Collect CharCodes and convert them to a string.

[![Selenium Test Status](https://saucelabs.com/browser-matrix/char-buffer.svg)](https://saucelabs.com/u/char-buffer)

## Basic Usage

`CharBuffer` provides multiple implementations to collect `CharCodes` via a common interface (`CharBuffer.AbstractCharBuffer`):

* `CharBuffer.StringBuffer` uses a single `String`
* `CharBuffer.StringArrayBuffer` uses an `Array` of `String`s
* `CharBuffer.TypedArrayBuffer` uses an [Uint16Array](https://developer.mozilla.org/en-US/docs/Web/API/Uint16Array)
* `CharBuffer.NodeBuffer` uses a [Node.js Buffer](http://nodejs.org/api/buffer.html)

```javascript
var buffer;

// Create the default CharBuffer of your platform:
buffer = new CharBuffer();

// Same as before, but provide an estimate of the length of your string:
buffer = new CharBuffer(3);

// Create a specific CharBuffer implementation, if supported:
if(CharBuffer.TypedArrayBuffer.isSupported)
  buffer = new CharBuffer.TypedArrayBuffer(3);
}


// Append a CharCode:
buffer.append(102);

// Append two more CharCodes:
buffer.append(111).append(111);

// Output 'foo':
console.log(buffer.toString());
```


## Documentations

* [API](http://schnittstabil.github.io/char-buffer/api/#!/api)
* [Code Coverage Report](http://schnittstabil.github.io/char-buffer/coverage)


## Node Package Manager (npm)

### Installation

1. Install [node.js](http://nodejs.org/) ([npm comes with node](https://www.npmjs.org/doc/README.html#super-easy-install)).

2. Install CharBuffer from [NPM](https://www.npmjs.org/):
    ```bash
    npm install char-buffer
    ```

### Examples
```javascript
// Create the default CharBuffer implementation:
var CharBuffer = require('char-buffer'),
    buffer     = new CharBuffer(3);

// Or create a specific CharBuffer implementation by CharBuffer:
var CharBuffer       = require('char-buffer'),
    TypedArrayBuffer = CharBuffer.TypedArrayBuffer,
    buffer           = new TypedArrayBuffer(3);

// Or create a specific CharBuffer implementation by package:
var TypedArrayBuffer = require('char-buffer/typed-array-buffer'),
    buffer           = new TypedArrayBuffer(3);


// Output 'foo':
console.log(buffer.append(102).append(111).append(111).toString());
```


## Component

### Installation

1. Install [node.js](http://nodejs.org/) ([npm comes with node](https://www.npmjs.org/doc/README.html#super-easy-install)).

2. Install [component](http://component.io/):
    ```bash
    npm install component --global
    ```

3. Create `component.json`:
    ```json
    {
      "name": "getting-started",
      "dependencies": {
        "schnittstabil/char-buffer": "*"
      }
    }
    ```

4. Install dependencies:
    ```bash
    component install
    ```

5. Run build
    ```bash
    component build
    ```

### Examples

```html
<script src="build/build.js"></script>
<script>
// Create the default CharBuffer implementation:
var CharBuffer = require('char-buffer'),
    buffer = new CharBuffer(3);

// Or create a specific CharBuffer implementation:
var CharBuffer = require('char-buffer'),
    TypedArrayBuffer = CharBuffer.TypedArrayBuffer,
    buffer           = new TypedArrayBuffer(3);


// Output 'foo'
console.log(buffer.append(102).append(111).append(111).toString());
</script>
```


## Bower

### Installation

1. Install [node.js](http://nodejs.org/) ([npm comes with node](https://www.npmjs.org/doc/README.html#super-easy-install)).

2. Install [Bower](http://bower.io/):
    ```bash
    npm install bower --global
    ```

3. Install CharBuffer from [bower.io](http://bower.io/search):
    ```bash
    bower install char-buffer
    ```

### Examples using SystemJS

See [systemjs/systemjs](https://github.com/systemjs/systemjs) for details.

Install [system.js](https://github.com/systemjs/systemjs):
```bash
bower install system.js
```

```html
<script type="text/javascript" src="bower_components/traceur/traceur.js"></script>
<script type="text/javascript" src="bower_components/es6-module-loader/dist/es6-module-loader.js"></script>
<script type="text/javascript" src="bower_components/system.js/dist/system.js"></script>
<script type="module">
  import CharBuffer from 'bower_components/char-buffer/char-buffer';
  import TypedArrayBuffer from 'bower_components/char-buffer/typed-array-buffer';
  // Create the default CharBuffer implementation:
  var buffer = new CharBuffer(3);
  // Or create a specific CharBuffer implementation:
      buffer = new TypedArrayBuffer(3);

  // Output 'foo'
  console.log(buffer.append(102).append(111).append(111).toString());
</script>
```

### Examples using Browser Globals

```html
<script src="bower_components/char-buffer/char-buffer.global.js"></script>
<script>
// Create the default CharBuffer implementation:
var buffer = new CharBuffer(3);

// Or create a specific CharBuffer implementation:
var TypedArrayBuffer = CharBuffer.TypedArrayBuffer,
    buffer           = new TypedArrayBuffer(3);


// Output 'foo'
console.log(buffer.append(102).append(111).append(111).toString());
</script>
```


### Examples using Asynchronous Module Definition

See [Asynchronous Module Definition (AMD)](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) for details.

```html
<script src="path/to/your/amd/loader.js"></script>
<script src="bower_components/char-buffer/char-buffer.amd.js"></script>
<script>
/**
 * Use the CharBuffer package:
 */
require(['char-buffer'], function(CharBuffer){
  // create the default CharBuffer implementation:
  var buffer = new CharBuffer(3);

  // Or create a specific CharBuffer implementation by CharBuffer:
  var TypedArrayBuffer = CharBuffer.TypedArrayBuffer,
      buffer = new TypedArrayBuffer(3);


  // Output 'foo'
  console.log(buffer.append(102).append(111).append(111).toString());
});


/**
  * Or use a specific CharBuffer package:
  */
require(['char-buffer/typed-array-buffer'], function(TypedArrayBuffer){

  var buffer = new TypedArrayBuffer(3);

  // Output 'foo'
  console.log(buffer.append(102).append(111).append(111).toString());
});
</script>
```


## License

Copyright (c) 2014 Michael Mayer

Licensed under the MIT license.

