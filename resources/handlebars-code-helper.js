var handlebars = require('handlebars');

module.exports = function (options) {
	var content = '';
	var lang = options.hash.lang || '';
	var indent = options.hash.indent || 0;
	var indentStr = new Array((indent * 4) + 1).join(' ');
	var inner = options.fn(this).trim();

	if (options.data.root.html) {
		content += '<pre class="prettyprint">';

		if (lang) {
			content += '<code class="lang-' + lang + '">';
		} else {
			content += '<code>';
		}

		content += handlebars.Utils.escapeExpression(inner);
		content += '</code></pre>';
	} else {
		content += '```' + lang + '\n';
		content += inner;
		content += '\n```';
	}

	return indentStr + content.replace(/(\r\n|\n|\r)/g, '\n' + indentStr);
};
