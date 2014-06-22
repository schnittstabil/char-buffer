// credits: https://github.com/umdjs/umd/blob/master/commonjsStrictGlobal.js
(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define('char-buffer/test/umd_test', ['expect', 'char-buffer/index'], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    factory(require('expect'), require('../index'));
  } else {
    // Browser globals
    factory(expect, root.CharBuffer);
  }
}(this, function (expect, CharBuffer) {
  'use strict';
  var charBuffer = CharBuffer;
  describe('CharBuffer facade', function() {
    it('should exists', function() {
      expect(CharBuffer).to.be.a('function');
    });
    it('should have a name', function() {
      expect(CharBuffer.name).to.be.a('string');
    });
    if (CharBuffer.isSupported && CharBuffer !== CharBuffer.AbstractCharBuffer) {
      it('constructor should return an instance of AbstractCharBuffer', function() {
        expect(charBuffer(0) instanceof CharBuffer.AbstractCharBuffer).to.be.ok();
      });
      it('constructor (using new) should return an instance of AbstractCharBuffer', function() {
        expect(new CharBuffer(0) instanceof CharBuffer.AbstractCharBuffer).to.be.ok();
      });
    }
  });
}));