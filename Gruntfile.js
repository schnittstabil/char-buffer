'use strict';

module.exports = function(grunt) {
  var browsers = grunt.file.readJSON('browsers.json'),
      legacyBrowsers = grunt.file.readJSON('legacy-browsers.json'),
      branch = process.env.TRAVIS_BRANCH,
      isPull = process.env.TRAVIS_PULL_REQUEST !== 'false',
      semver = branch ? branch.match(/^v?\d+\.\d+.\d+/) : null,
      visiblity = (!isPull && semver) ? 'public' : 'share',
      testname = 'char-buffer' + (visiblity === 'public' ? ' ' + branch : ''),
      build = testname + grunt.template.today(' yymmdd-HHMM');

  grunt.initConfig({
    connect: {
      server: {
        options: {
          base: '',
          port: 9999
        }
      }
    },
    watch: {

    },
    'saucelabs-mocha': {
      es6: {
        options: {
          urls: [
            'http://127.0.0.1:9999/tests.html',
          ],
          testname: testname,
          build: build + ' es6',
          'public': visiblity,
          'record-video': false,
          'record-screenshots': true,
          throttled: 1,
          browsers: browsers,
          tags: ['es6'],
        },
      },
      amd: {
        options: {
          urls: [
            'http://127.0.0.1:9999/tests_amd.html',
          ],
          testname: testname,
          build: build + ' amd',
          'public': visiblity,
          'record-video': false,
          'record-screenshots': true,
          throttled: 1,
          browsers: legacyBrowsers,
          tags: ['amd'],
        },
      },
      global: {
        options: {
          urls: [
            'http://127.0.0.1:9999/tests_global.html',
          ],
          testname: testname,
          build: build + ' global',
          'public': visiblity,
          'record-video': false,
          'record-screenshots': true,
          throttled: 1,
          browsers: legacyBrowsers,
          tags: ['global'],
        },
      },
    },
  });

  // Loading dependencies
  for (var key in grunt.file.readJSON('package.json').devDependencies) {
    if (key !== 'grunt' && key.indexOf('grunt') === 0) grunt.loadNpmTasks(key);
  }

  grunt.registerTask('default', ['connect', 'watch']);

  grunt.registerTask('test', ['connect', 'saucelabs-mocha']);

  grunt.registerTask('test:es6', ['connect', 'saucelabs-mocha:es6']);
  grunt.registerTask('test:global', ['connect', 'saucelabs-mocha:global']);
  grunt.registerTask('test:amd', ['connect', 'saucelabs-mocha:amd']);
};
