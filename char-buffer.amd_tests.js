define('char-buffer/test/char-buffer_test.js',['require','exports','module','../char-buffer','expect'],function (require, exports, module) {
var CharBuffer = require('../char-buffer');
var expect = require('expect');

function buildTestString(len) {
  var strBuffer = '',
      i,
      charCode;

  for (i = 0; i < len; i++) {
    charCode = i % 94 + 32; // only ASCII CharCodes
    strBuffer += String.fromCharCode(charCode);
  }
  return strBuffer;
}

var testStrings = {
      defaults: [
        'user@example.com',
        '\uD834\uDF06',
        'latinкирилицаαβγδεζηあいうえお',
        buildTestString(500),
        buildTestString(65535 * 2 + 1)
      ]
    },
    i, charBufferName;

function describeBasicTest(BufferConstr, testString, useNew) {
  var testStringLen = testString.length,
      MAX_LEN = testStringLen <= 40 ? testStringLen : 40,
      MID = Math.round(testStringLen / 2),
      TEST_CHAR = 'a',
      TEST_CHARCODE = TEST_CHAR.charCodeAt(0),
      shortened = testString.substring(0, MAX_LEN),
      bufferConstr = BufferConstr;

  if (testStringLen > MAX_LEN) {
    shortened += '...';
  }

  it('should work well on "' + shortened + '"', function(done) {
    var buffer = useNew ? new BufferConstr(testStringLen) : bufferConstr(testStringLen),
        j;

    // append testString
    for (j = 0; j < testStringLen; j++) {
      buffer.append(testString.charCodeAt(j));
      if (j === MID) {
        // check length and content
        expect(buffer.length).to.be(j + 1);
        expect(buffer.toString()).to.be(testString.substr(0, j + 1));
      }
    }

    // check length and content
    expect(buffer.length).to.be(testStringLen);
    expect(buffer.toString()).to.be(testString);

    // overwrite char
    buffer.write(TEST_CHARCODE, MID);

    // check content
    for (j = 0; j < MAX_LEN; j++) {
      if (j === MID) {
        expect(buffer.charAt(j)).to.be(TEST_CHAR);
        expect(buffer.charCodeAt(j)).to.be(TEST_CHARCODE);
      } else {
        expect(buffer.charAt(j)).to.be(testString.charAt(j));
        expect(buffer.charCodeAt(j)).to.be(testString.charCodeAt(j));
      }
    }

    // try illegal truncation
    expect(function() {
      buffer.setLength(-1);
    }).to.throwException();

    // truncate
    expect(function() {
      buffer.setLength(1);
    }).not.to.throwException();
    expect(buffer.toString()).to.be(testString.substr(0, 1));

    // append single char
    expect(function() {
      // same as append
      buffer.write(testString.charCodeAt(1), buffer.getLength());
    }).not.to.throwException();
    expect(buffer.toString()).to.be(testString.substr(0, 2));

    done();
  });
}

function describeBasicTests(BufferConstr, dataArray) {
  dataArray = dataArray || testStrings.defaults;

  describe(BufferConstr.name, function() {
    for (var i = 0; i < dataArray.length; i++) {
      describeBasicTest(BufferConstr, dataArray[i], i % 2);
    }
  });
}

function describeAppendFunction(SUT) {
  if (SUT.isSupported) {
    describe(SUT.name, function() {
      it('should act like a CharBuffer', function() {
        var sut = SUT;
        expect(sut(0)).to.be.ok();
        expect(sut(0).append).to.be.a('function');
        expect(new SUT(0).append).to.be.a('function');
        expect(
          sut(3).append(102).append(111).append(111).toString()
        ).to.be('foo');
        expect(
          new SUT(3).append(102).append(111).append(111).toString()
        ).to.be('foo');
        expect(
          sut(1).append(102).append(111).append(111).toString()
        ).to.be('foo');
      });
    });
  }
}

function describeShouldBeAnAbstractCharBufferInstance(SUT) {
  var sut = SUT;
  describe(SUT.name, function() {
    it('should exists', function() {
      expect(SUT).to.be.a('function');
    });
    it('should have a name', function() {
      expect(SUT.name).to.be.a('string');
    });
    if (SUT.isSupported && SUT !== CharBuffer.AbstractCharBuffer) {
      it('constructor should return an instance of AbstractCharBuffer', function() {
        expect(sut(0) instanceof CharBuffer.AbstractCharBuffer).to.be.ok();
      });
      it('constructor (using new) should return an instance of AbstractCharBuffer', function() {
        expect(new SUT(0) instanceof CharBuffer.AbstractCharBuffer).to.be.ok();
      });
    }
  });
}

for (i = 0; i < CharBuffer.supported.length; i++) {
  charBufferName = CharBuffer.supported[i];
  describeBasicTests(CharBuffer[charBufferName]);
}

describe('default CharBuffer', function() {
  describeShouldBeAnAbstractCharBufferInstance(CharBuffer);
  describeAppendFunction(CharBuffer);
});

describe('CharBuffer.CharBuffers', function() {
  it('should contain CharBuffer', function() {
    expect(CharBuffer.CharBuffers).to.contain(CharBuffer);
  });

  for (i = 0; i < CharBuffer.CharBuffers.length; i++) {
    describeShouldBeAnAbstractCharBufferInstance(CharBuffer.CharBuffers[i]);
    describeAppendFunction(CharBuffer.CharBuffers[i]);
  }
});

});

// credits: https://github.com/umdjs/umd/blob/master/commonjsStrictGlobal.js
(function (root, factory) {
  
  if (typeof define === 'function' && define.amd) {
    // AMD
    define('char-buffer/test/umd_test.js',['expect', '../char-buffer'], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    factory(require('expect'), require('../char-buffer'));
  } else {
    // Browser globals
    factory(expect, root.CharBuffer);
  }
}(this, function (expect, CharBuffer) {
  
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

