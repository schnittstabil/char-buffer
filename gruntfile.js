'use strict';
const util = require('util');
const chalk = require('chalk');
const execa = require('execa');
const pkg = require('./package.json');

const defaultBrowsers = [
	{
		browserName: 'internet explorer',
		version: '10'
	}, {
		browserName: 'internet explorer',
		version: '11'
	}, {
		browserName: 'MicrosoftEdge',
		version: '13'
	}, {
		browserName: 'chrome',
		version: '26'
	}, {
		browserName: 'chrome',
		version: '51'
	}, {
		browserName: 'chrome',
		version: 'beta'
	}, {
		browserName: 'firefox',
		version: '4'
	}, {
		browserName: 'firefox',
		version: '47'
	}, {
		browserName: 'firefox',
		version: 'beta'
	}, {
		browserName: 'android',
		version: '4.0'
	}, {
		browserName: 'android',
		version: '5.1'
	}, {
		browserName: 'safari',
		version: '6'
	}, {
		browserName: 'safari',
		version: '9'
	}, {
		browserName: 'iPhone 6 Simulator'
	}, {
		browserName: 'iPad 2 Simulator'
	}
];

module.exports = function (grunt) {
	const hash = execa.shellSync('git rev-parse --short HEAD').stdout;
	const tags = execa.shellSync('git tag -l --contains HEAD').stdout.split(/\n/).sort();
	const browser = (grunt.option('browser') || '').split(':');
	const browsers = browser.length > 1 ? [{
		browserName: browser[0],
		version: browser[1]
	}] : defaultBrowsers;

	grunt.initConfig({
		'compile-handlebars': {
			'gh-pages': {
				files: [{
					src: 'readme.md.hbs',
					dest: 'gh-pages/readme.md'
				}],
				templateData: {html: true},
				globals: [
					'./package.json'
				],
				helpers: 'resources/handlebars-code-helper.js'
			},
			'readme': {
				files: [{
					src: 'readme.md.hbs',
					dest: 'readme.md'
				}],
				templateData: {html: false},
				globals: [
					'./package.json'
				],
				helpers: 'resources/handlebars-code-helper.js'
			}
		},
		'connect': {
			server: {
				options: {
					base: '',
					port: 9999
				}
			}
		},
		'watch': {
		},
		'saucelabs-mocha': {
			all: {
				options: {
					urls: [
						'http://127.0.0.1:9999/test.html'
					],
					testname: pkg.name + (tags.length ? ' ' + tags.join('-') : ''),
					build: hash,
					public: tags.length ? 'public' : 'share',
					sauceConfig: {
						'record-video': false,
						'record-screenshots': true
					},
					statusCheckAttempts: 900,
					maxRetries: 2,
					tags: [pkg.name, hash],
					onTestComplete: function (result, cb) {
						if (!result.passed) {
							if (result.result && result.result.reports) {
								console.error(chalk.red('reports:'));

								result.result.reports.forEach(function (report) {
									var stack = report.stack;
									delete report.stack;
									console.error(util.inspect(report, {colors: true, showHidden: false, depth: null}));
									console.error(chalk.red(stack));
								});
							} else {
								console.error(chalk.red('no reports found'));
							}

							console.error(chalk.yellow('Want to rerun? Try:\n  grunt saucelabs --browser="' + result.platform[1] + ':' + result.platform[2] + '"'));
						}

						cb(null, result.passed);
					},
					browsers: browsers
				}
			}
		}
	});

	// Loading dependencies
	for (var key in grunt.file.readJSON('package.json').devDependencies) {
		if (key !== 'grunt' && key.indexOf('grunt') === 0) {
			grunt.loadNpmTasks(key);
		}
	}

	grunt.registerTask('outputBrowsers', 'output selected browsers', function () {
		console.error(chalk.yellow(util.inspect(browsers, {colors: true, depth: null})));
	});
	grunt.registerTask('default', ['connect', 'watch']);
	grunt.registerTask('saucelabs', ['outputBrowsers', 'connect', 'saucelabs-mocha']);
	grunt.registerTask('docs', ['compile-handlebars']);
};
