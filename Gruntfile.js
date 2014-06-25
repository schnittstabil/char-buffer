'use strict';

module.exports = function(grunt) {
  var browsers = grunt.file.readJSON('browsers.json'),
      legacyBrowsers = grunt.file.readJSON('legacy-browsers.json'),
      testname = 'char-buffer_' + grunt.template.today('yymmdd-HH:MM'),
      build = process.env.TRAVIS_JOB_ID + '_' + grunt.template.today('yymmdd-HHMM');

  grunt.initConfig({
    connect: {
      server: {
        options: {
          base: '',
          port: 9999
        }
      }
    },
    'saucelabs-mocha': {
      es6: {
        options: {
          urls: [
            'http://127.0.0.1:9999/tests.html',
          ],
          build: build,
          throttled: 1,
          browsers: browsers,
          testname: testname,
          tags: ['es6'],
        },
      },
      global: {
        options: {
          urls: [
            'http://127.0.0.1:9999/tests_global.html',
          ],
          build: build,
          throttled: 1,
          browsers: legacyBrowsers,
          testname: testname,
          tags: ['global'],
        },
      },
      component: {
        options: {
          urls: [
            'http://127.0.0.1:9999/tests_component.html',
          ],
          build: build,
          throttled: 1,
          browsers: legacyBrowsers,
          testname: testname,
          tags: ['component'],
        },
      },
      amd: {
        options: {
          urls: [
            'http://127.0.0.1:9999/tests_amd.html',
          ],
          build: build,
          throttled: 1,
          browsers: legacyBrowsers,
          testname: testname,
          tags: ['amd'],
        },
      },
    },
  });

  // Loading dependencies
  for (var key in grunt.file.readJSON('package.json').devDependencies) {
    if (key !== 'grunt' && key.indexOf('grunt') === 0) grunt.loadNpmTasks(key);
  }

  grunt.registerTask('test', ['connect', 'saucelabs-mocha']);
};
