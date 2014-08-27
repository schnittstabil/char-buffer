// credits: https://github.com/umdjs/umd/blob/master/commonjsStrictGlobal.js
(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['xpect', '../char-buffer'], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    factory(require('xpect'), require('../char-buffer'));
  } else {
    // Browser globals
    factory(xpect, root.CharBuffer);
  }
}(this, function (xpect, CharBuffer) {
  'use strict';
  var charBuffer = CharBuffer;
  describe('CharBuffer facade', function() {
    it('should exists', function() {
      xpect(CharBuffer).to.be.a('function');
    });
    it('should have a name', function() {
      xpect(CharBuffer.name).to.be.a('string');
    });
    if (CharBuffer.isSupported && CharBuffer !== CharBuffer.AbstractCharBuffer) {
      it('constructor should return an instance of AbstractCharBuffer', function() {
        xpect(charBuffer(0) instanceof CharBuffer.AbstractCharBuffer).to.be.ok();
      });
      it('constructor (using new) should return an instance of AbstractCharBuffer', function() {
        xpect(new CharBuffer(0) instanceof CharBuffer.AbstractCharBuffer).to.be.ok();
      });
    }
  });
}));
