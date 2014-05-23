'use strict';

function buildTestString(len){
  var strBuffer = '',
      i,
      charCode;

  for(i=0; i<len; i++){
    charCode = i%94+32;
    strBuffer += String.fromCharCode(charCode);
  }
  return strBuffer;
}

var data_ = {
      defaults: [
        'user@example.com',
        '\uD834\uDF06',
        'latinкирилицаαβγδεζηあいうえお',
        buildTestString(1000),
        buildTestString(65535*2+1)
      ]
    },
    i, name_;

function describeBasicTest(BufferConstr, data, useNew){
  var dataLen = data.length,
      MAX_LEN = dataLen<=40 ? dataLen : 40,
      MID = Math.round(dataLen/2),
      TEST_CHAR = 'a',
      TEST_CHARCODE = TEST_CHAR.charCodeAt(0),
      shortened = data.substring(0, MAX_LEN),
      bufferConstr = BufferConstr;

  if(dataLen > MAX_LEN){
    shortened += '...';
  }

  it('should work well on "' + shortened + '"', function(done){
    var buffer = useNew ? new BufferConstr(dataLen) : bufferConstr(dataLen),
        j;

    for(j=0; j<dataLen; j++){
      buffer.append(data.charCodeAt(j));
      if(j === MID){
        expect(buffer.length).to.be(j+1);
        expect(buffer.toString()).to.be(data.substr(0,j+1));
      }
    }

    expect(buffer.length).to.be(dataLen);
    expect(buffer.toString()).to.be(data);

    buffer.write(TEST_CHARCODE, MID);

    for(j=0; j<MAX_LEN; j++){
      if(j===MID){
        expect(buffer.charAt(j)).to.be(TEST_CHAR);
        expect(buffer.charCodeAt(j)).to.be(TEST_CHARCODE);
      }else{
        expect(buffer.charAt(j)).to.be(data.charAt(j));
        expect(buffer.charCodeAt(j)).to.be(data.charCodeAt(j));
      }
    }

    expect(function(){
      buffer.setLength(-1);
    }).to.throwException();

    expect(function(){
      buffer.setLength(1);
    }).not.to.throwException();

    expect(buffer.toString()).to.be(data.substr(0,1));

    expect(function(){
      // same as append
      buffer.write(data.charCodeAt(1), buffer.getLength());
    }).not.to.throwException();
    expect(buffer.toString()).to.be(data.substr(0,2));

    done();
  });
}

function describeBasicTests(BufferConstr, dataArray){
  dataArray = dataArray || data_.defaults;

  describe(BufferConstr.name, function(){
    for(var i=0; i<dataArray.length; i++){
      describeBasicTest(BufferConstr, dataArray[i], i%2);
    }
  });
}


function describeShouldActLikeACharBuffer(SUT){
  if(SUT.isSupported){
    describe(SUT.name, function(){
      it('should act like a CharBuffer', function(){
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

function describeShouldBeACharBuffer(SUT){
  var sut = SUT;
  describe(SUT.name, function(){
    it('should exists', function(){
      expect(SUT).to.be.a('function');
    });
    it('should have a name', function(){
      expect(SUT.name).to.be.a('string');
    });
    if(SUT.isSupported || SUT === CharBuffer.CharBuffer){
      it('constructor should return an instance of CharBuffer', function(){
        expect(sut(0) instanceof CharBuffer.CharBuffer).to.be.ok();
      });
      it('constructor (using new) should return an instance of CharBuffer', function(){
        expect(new SUT(0) instanceof CharBuffer.CharBuffer).to.be.ok();
      });
    }
  });
}

for(i=0; i<CharBuffer.supported.length; i++){
  name_ = CharBuffer.supported[i];
  describeBasicTests(CharBuffer[name_]);
}

describe('default CharBuffer', function(){
  describeShouldBeACharBuffer(CharBuffer);
  describeShouldActLikeACharBuffer(CharBuffer);
});

describe('CharBuffer.CharBuffers', function(){
  it('should contain CharBuffer._default', function(){
      expect(CharBuffer.CharBuffers).to.contain(CharBuffer._default);
    });

  for(i=0; i<CharBuffer.CharBuffers.length; i++){
      describeShouldBeACharBuffer(CharBuffer.CharBuffers[i]);
      describeShouldActLikeACharBuffer(CharBuffer.CharBuffers[i]);
  }
});
