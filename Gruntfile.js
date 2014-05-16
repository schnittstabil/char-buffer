'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    connect: {
      server: {
        options: {
          base: "",
          port: 9999
        }
      }
    },
    'saucelabs-mocha': {
      all: {
        options: {
          urls: ['http://127.0.0.1:9999/test/index.html'],
          build: process.env.TRAVIS_JOB_ID,
          concurrency: 1,
          browsers: grunt.file.readJSON('browsers.json'),
          testname: 'char-buffer_' + grunt.template.today('yymmdd-HH:MM'),
          tags: ['bower']
        }
      }
    },
    watch: {}
  });

  // Loading dependencies
  for (var key in grunt.file.readJSON('package.json').devDependencies) {
    if (key !== 'grunt' && key.indexOf('grunt') === 0) grunt.loadNpmTasks(key);
  }

  grunt.registerTask('dev', ['connect', 'watch']);
  grunt.registerTask("test", ["connect", "saucelabs-mocha"]);
};