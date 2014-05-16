var buffer;

// Create the default CharBuffer of your platform:
buffer = new CharBuffer();

// Same as before, but provide an estimate for the length of your string:
buffer = new CharBuffer(3);

// Create a specific CharBuffer implementation, if supported:
if(CharBuffer.TypedArrayBuffer.isSupported)
  buffer = new CharBuffer.TypedArrayBuffer(3);
}


// Append a Charcode:
buffer.append(102);

// Append two more Charcodes:
buffer.append(111).append(111);

// Output 'foo':
console.log(buffer.toString());
