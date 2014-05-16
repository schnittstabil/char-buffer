
// create the default CharBuffer implementation:
var buffer = new CharBuffer(3);

// or create a specific CharBuffer implementation:
var TypedArrayBuffer = CharBuffer.TypedArrayBuffer,
    buffer           = new TypedArrayBuffer(3);


// output 'foo'
console.log(buffer.append(102).append(111).append(111).toString());
