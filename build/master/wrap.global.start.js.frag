(function (root, factory) {
  // Browser globals
  var cbSuite = factory();
  root.CharBuffer = cbSuite.global;
  root.CharBuffer.require = cbSuite.require;
  root.CharBuffer.define = cbSuite.define;
}(this, function () {
