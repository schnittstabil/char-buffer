'use strict';
var CharBuffer = require('../char-buffer');
var xpect = require('xpect');
var forEach = require('./for-each');

var testStrings = require('./test-strings');

function shortenString(string, maxLength) {
  var len = string.length <= maxLength ? string.length : maxLength,
      shortened = string.substring(0, len);
  if (len < string.length) {
    shortened += '...';
  }
  return shortened;
}

function describeBasicTest(BufferConstr, testString) {
  var testStringLen = testString.length,
      MAX_LEN = testStringLen <= 40 ? testStringLen : 40,
      MID = Math.round(testStringLen / 2),
      TEST_CHAR = 'a',
      TEST_CHARCODE = TEST_CHAR.charCodeAt(0),
      shortened = shortenString(testString, MAX_LEN);

  if (testStringLen > MAX_LEN) {
    shortened += '...';
  }

  it('should work well on "' + shortened + '"', function(done) {
    var buffer = new BufferConstr(testStringLen),
        j;

    // append testString
    for (j = 0; j < testStringLen; j++) {
      buffer.append(testString.charCodeAt(j));
      if (j === MID) {
        // check length and content
        xpect(buffer.length).to.be(j + 1);
        xpect(buffer.toString()).to.be(testString.substr(0, j + 1));
      }
    }

    // check length and content
    xpect(buffer.length).to.be(testStringLen);
    xpect(buffer.toString()).to.be(testString);

    // overwrite char
    buffer.write(TEST_CHARCODE, MID);

    // check content
    for (j = 0; j < MAX_LEN; j++) {
      if (j === MID) {
        xpect(buffer.charAt(j)).to.be(TEST_CHAR);
        xpect(buffer.charCodeAt(j)).to.be(TEST_CHARCODE);
      } else {
        xpect(buffer.charAt(j)).to.be(testString.charAt(j));
        xpect(buffer.charCodeAt(j)).to.be(testString.charCodeAt(j));
      }
    }

    // try illegal truncation
    xpect(function() {
      buffer.setLength(-1);
    }).to.throwException();

    // truncate
    xpect(function() {
      buffer.setLength(1);
    }).not.to.throwException();
    xpect(buffer.toString()).to.be(testString.substr(0, 1));

    // append single char
    xpect(function() {
      // same as append
      buffer.write(testString.charCodeAt(1), buffer.getLength());
    }).not.to.throwException();
    xpect(buffer.toString()).to.be(testString.substr(0, 2));

    done();
  });
}

function describeAppendFunction(SUT) {
  if (SUT.isSupported) {
    describe(SUT.name, function() {
      it('should act like a CharBuffer', function() {
        var sut = SUT;
        xpect(sut(0)).to.be.ok();
        xpect(sut(0).append).to.be.a('function');
        xpect(new SUT(0).append).to.be.a('function');
        xpect(
          sut(3).append(102).append(111).append(111).toString()
        ).to.be('foo');
        xpect(
          new SUT(3).append(102).append(111).append(111).toString()
        ).to.be('foo');
        xpect(
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
      xpect(SUT).to.be.a('function');
    });
    it('should have a name', function() {
      xpect(SUT.name).to.be.a('string');
    });
    if (SUT.isSupported && SUT !== CharBuffer.AbstractCharBuffer) {
      it('constructor should return an instance of AbstractCharBuffer', function() {
        xpect(sut(0) instanceof CharBuffer.AbstractCharBuffer).to.be.ok();
      });
      it('constructor (using new) should return an instance of AbstractCharBuffer', function() {
        xpect(new SUT(0) instanceof CharBuffer.AbstractCharBuffer).to.be.ok();
      });
    }
  });
}

forEach(CharBuffer.supported, function(charBufferName) {
  var Constr = CharBuffer[charBufferName];
  describe(Constr.name, function() {
    switch (Constr.name) {
      case 'TypedArrayBuffer':
        forEach(testStrings.slow, function(testString) {
          describeBasicTest(Constr, testString);
        });
        break;
      default:
        forEach(testStrings.fast, function(testString) {
          describeBasicTest(Constr, testString);
        });
    }
  });
});

describe('default CharBuffer', function() {
  describeShouldBeAnAbstractCharBufferInstance(CharBuffer);
  describeAppendFunction(CharBuffer);
});

describe('CharBuffer.CharBuffers', function() {
  it('should contain CharBuffer', function() {
    xpect(CharBuffer.CharBuffers).to.contain(CharBuffer);
  });

  forEach(CharBuffer.CharBuffers, function(Constr) {
    describeShouldBeAnAbstractCharBufferInstance(Constr);
    describeAppendFunction(Constr);
  });
});

function plusOne(x) {
  return x + 1;
}

function minusOne(x) {
  return x - 1;
}

forEach(CharBuffer.supported, function(charBufferName) {
  describe(charBufferName + '.fromString', function() {
    forEach(testStrings.fast, function(string) {
      it('(minusOne ° plusOne) should act like identity for ' + shortenString(string, 40), function() {
        xpect(CharBuffer[charBufferName].fromString(string).toString()).to.be(string);
        var p1 = CharBuffer[charBufferName].fromString(string, plusOne).toString(),
            id = CharBuffer[charBufferName].fromString(p1, minusOne).toString();
        xpect(id).to.be(string);
      });
    });
  });
});

forEach(CharBuffer.supported, function(charBufferName) {
  describe(charBufferName + '.map', function() {

    it('throws exception on non callback', function() {
      xpect(function() {
        new CharBuffer[charBufferName]().map(null);
      }).to.throwException(/not a function/);
    });

    it('should respect thisArg', function() {
      var thisArg = { count: 0 },
          buffer = new CharBuffer[charBufferName](3);
      buffer.append(102).append(111);
      buffer.map(function(charCode, index, charBuffer) {
        xpect(charBuffer).to.be(buffer);
        xpect(charCode).to.be(index ? 111 : 102);
        xpect(this).to.be(thisArg);
        this.count++;
        return charCode;
      }, thisArg);
      xpect(thisArg.count).to.be(2);
    });

    forEach(testStrings.fast, function(string) {
      it('(minusOne ° plusOne) should act like identity for ' + shortenString(string, 40), function() {
        var org = CharBuffer[charBufferName].fromString(string),
            p1 = org.map(plusOne),
            id = p1.map(minusOne);
        xpect(id.toString()).to.be(string);
      });
    });
  });
});

forEach(CharBuffer.supported, function(charBufferName) {
  describe(charBufferName + '.forEach', function() {

    it('throws exception on non callback', function() {
      xpect(function() {
        new CharBuffer[charBufferName]().forEach(null);
      }).to.throwException(/not a function/);
    });

    it('should call callback with every written charCode', function() {
      var count = 0,
          buffer = new CharBuffer[charBufferName](3);
      buffer.append(102).append(111);
      buffer.forEach(function(charCode, index, charBuffer) {
        xpect(charBuffer).to.be(buffer);
        xpect(charCode).to.be(index ? 111 : 102);
        count++;
      });
      xpect(count).to.be(2);
    });

    it('should respect thisArg', function() {
      var thisArg = { count: 0 },
          buffer = new CharBuffer[charBufferName](2);
      buffer.append(102).append(111);
      buffer.forEach(function() {
        xpect(this).to.be(thisArg);
        this.count++;
      }, thisArg);
      xpect(thisArg.count).to.be(2);
    });
  });
});
