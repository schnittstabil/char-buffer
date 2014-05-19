
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
