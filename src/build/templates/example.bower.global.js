
// Create the default CharBuffer implementation:
var buffer = new CharBuffer(3);

// Or create a specific CharBuffer implementation:
var TypedArrayBuffer = CharBuffer.TypedArrayBuffer,
    buffer           = new TypedArrayBuffer(3);


// Output 'foo'
console.log(buffer.append(102).append(111).append(111).toString());
