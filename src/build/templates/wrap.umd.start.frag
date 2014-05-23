// bootstrap: @see https://github.com/umdjs/umd

(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    // AMD. Register module.
    define('char-buffer',[],function registerAMD(){
      var cbSuite = factory();
      root.CharBuffer = cbSuite.global;
      root.CharBuffer.require = cbSuite.require;
      root.CharBuffer.define = cbSuite.define;
      return root.CharBuffer;
    });
  } else {
    // Browser globals
    var cbSuite = factory();
    root.CharBuffer = cbSuite.global;
    root.require = root.CharBuffer.require = cbSuite.require;
    root.define = root.CharBuffer.define = cbSuite.define;
  }
}(this, function () {
