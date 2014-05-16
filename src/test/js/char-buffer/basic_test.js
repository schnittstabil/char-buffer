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
  var MAX_LEN = 40,
      dataLen = data.length,
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
      if(j === Math.round(dataLen/2)){
        expect(buffer.getLength()).to.be(j+1);
        expect(buffer.toString()).to.be(data.substr(0,j+1));
      }
    }

    expect(buffer.toString()).to.be(data);

    expect(function(){
      buffer.setLength(-1);
    }).to.throwException();

    expect(function(){
      buffer.setLength(1);
    }).not.to.throwException();

    expect(buffer.toString()).to.be(data.substr(0,1));

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
