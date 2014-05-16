var handlebars = require('handlebars');

module.exports = function (options) {
  var pre,
      post
      indent = options.hash.indent || 0,
      indentStr = new Array(indent*4+1).join(' '),
      inner = options.fn(this).trim();


  if(options.data.root.html){
    pre = '<pre class="prettyprint">';
    if(options.hash.lang){
      pre += '<code class="lang-' + options.hash.lang + '">';
    }else{
      pre += '<code>';
    }
    inner = handlebars.Utils.escapeExpression(inner);
    post = '</code></pre>';
  }else{
    pre = '```' + options.hash.lang + '\n';
    post = '\n```';
  }

  return indentStr+(pre + inner + post).replace(/(\r\n|\n|\r)/g, '\n'+indentStr);
};
