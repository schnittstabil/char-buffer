/**
 * inject expect.js globally for mocha tests
 */
global.expect = require('expect.js');

/**
 * inject node facade globally for mocha tests
 */
global.CharBuffer = require('char-buffer');
