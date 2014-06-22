'use strict';

module.exports = function(grunt) {
  var browsers = grunt.file.readJSON('browsers.json'),
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
      global: {
        options: {
          urls: [
            'http://127.0.0.1:9999/test/index.global.html',
          ],
          build: build,
          throttled: 1,
          browsers: browsers,
          testname: testname,
          tags: ['global'],
        },
      },
      component: {
        options: {
          urls: [
            'http://127.0.0.1:9999/test/index.component.html',
          ],
          build: build,
          throttled: 1,
          browsers: browsers,
          testname: testname,
          tags: ['component'],
        },
      },
      amd: {
        options: {
          urls: [
            'http://127.0.0.1:9999/test/index.amd.html',
          ],
          build: build,
          throttled: 1,
          browsers: browsers,
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
