'use strict';

module.exports = function(grunt) {
  var browsers = grunt.file.readJSON('browsers.json'),
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
      all: {
        options: {
          urls: [
            'http://127.0.0.1:9999/tests_es6.html',
            'http://127.0.0.1:9999/tests_amd.html',
            'http://127.0.0.1:9999/tests_global.html',
          ],
          testname: testname,
          build: build,
          'public': visiblity,
          'record-video': false,
          'record-screenshots': true,
          throttled: 1,
          browsers: browsers,
          tags: [testname],
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
};
