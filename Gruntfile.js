'use strict';
module.exports = function(grunt) {
  var es6ToCommonjsTransform = require('es6-module-jstransform'),
      scripts = grunt.file.expand({cwd: 'src'}, ['**/*.js', '!**/test/**/*']),
      tests = grunt.file.expand({cwd: 'src'}, ['test/**/*.js']),
      testsRequireJs = tests.map( function(path) { return 'char-buffer/' + path.slice(0, -3); } ),
      packageJson = grunt.file.readJSON('package.json');

  // Project configuration.
  grunt.initConfig({
    pkg: packageJson,
    clean: {
      temp: {
        src: ['temp/**/*'],
      },
      npm: {
        src: ['target/npm/**/*'],
      },
      master: {
        src: ['target/master/**/*', 'target/master/**/.*', '!target/master/**/.git'],
      },
      'gh-pages': {
        src: ['target/gh-pages/**/*', 'target/gh-pages/**/.*', '!target/gh-pages/.git'],
      },
      'gh-pages:api': {
        src: ['target/gh-pages/api/**/*'],
      },
      'gh-pages:coverage': {
        src: ['target/gh-pages/coverage/**/*'],
      },
    },
    es6ToCommonjs: {
      'commonjs': {
        files: [
          {
            expand: true,
            cwd: 'src',
            src: ['**/*.js'],
            dest: 'temp/char-buffer',
          },
        ],
      },
    },
    'compile-handlebars': {
      'templates_temp_gh-pages': {
        template: 'build/templates/**/*.hbs',
        templateData: {html: true},
        globals: [
          './package.json',
        ],
        helpers: 'build/templates/code_helper.js',
        output: 'temp/gh-pages/**/*',
      },
      master: {
        template: 'build/master/templates/**/*.hbs',
        templateData: {html: false, scripts: scripts, tests: tests},
        globals: [
          './package.json',
        ],
        output: 'target/master/**/*',
      },
      'templates_master': {
        template: 'build/templates/**/*.hbs',
        templateData: {html: false},
        globals: [
          './package.json',
        ],
        helpers: 'build/templates/code_helper.js',
        output: 'target/master/**/*',
      },
      npm: {
        template: 'build/npm/templates/**/*.hbs',
        templateData: {html: false},
        globals: [
          './package.json',
        ],
        output: 'target/npm/**/*',
      },
      'templates_npm': {
        template: 'build/templates/**/*.hbs',
        templateData: {html: false},
        globals: [
          './package.json',
        ],
        helpers: 'build/templates/code_helper.js',
        output: 'target/npm/**/*',
      },
    },
    copy: {
      'gh-pages': {
        files: [
          {
            expand: true,
            src: ['LICENSE'],
            dest: 'target/gh-pages',
          },
          {
            expand: true,
            cwd: 'build/gh-pages/resources',
            src: ['**', '**/.*'],
            dest: 'target/gh-pages',
          },
        ],
      },
      master: {
        files: [
          {
            expand: true,
            flatten: true,
            src: [
              'LICENSE',
              'temp/amd/char-buffer.amd.js',
              'temp/global/char-buffer.global.js',
            ],
            dest: 'target/master/',
          },
          {
            expand: true,
            flatten: true,
            src: [
              'temp/amd_tests/char-buffer.amd_tests.js',
            ],
            dest: 'target/master/',
          },
          {
            expand: true,
            cwd: 'build/master/resources',
            src: ['**', '**/.*'],
            dest: 'target/master',
          },
          {
            expand: true,
            cwd: 'src',
            src: ['**', '**/.*'],
            dest: 'target/master',
          },
        ],
      },
      npm: {
        files: [
          {
            expand: true,
            src: ['LICENSE'],
            dest: 'target/npm',
          },
          {
            expand: true,
            cwd: 'build/npm/resources',
            src: ['**', '**/.*'],
            dest: 'target/npm',
          },
          {
            expand: true,
            cwd: 'temp/char-buffer',
            src: ['**', '**/.*'],
            dest: 'target/npm',
          },
        ],
      },
    },
    requirejs: {
      amd: {
        options: {
          baseUrl: 'temp',
          name: 'char-buffer/char-buffer',
          cjsTranslate: true,
          out: 'temp/amd/char-buffer.amd.js',
          optimize: 'none',
          wrap: {
            end: 'define(\'char-buffer\', [\'char-buffer/char-buffer\'], function(cb){ return cb; });',
          }
        },
      },
      'amd_test': {
        options: {
          baseUrl: 'temp',
          include: testsRequireJs,
          paths: {
            'expect': 'empty:',
            'char-buffer/char-buffer': 'empty:',
          },
          cjsTranslate: true,
          out: 'temp/amd_tests/char-buffer.amd_tests.js',
          optimize: 'none',
        },
      },
      global: {
        options: {
          baseUrl: 'temp',
          name: '../node_modules/almond/almond',
          include: ['char-buffer/char-buffer'],
          cjsTranslate: true,
          wrap: {
            startFile: 'build/master/wrap.global.start.js.frag',
            endFile: 'build/master/wrap.global.end.js.frag'
          },
          out: 'temp/global/char-buffer.global.js',
          optimize: 'none',
        }
      },
    },
    mochaTest: {
      fast: {
        options: {
          reporter: 'spec',
        },
        src: [
          'temp/char-buffer/**/test/**/*_test.js',
          '!temp/char-buffer/**/test/**/*_slow_test.js',
        ],
      },
      slow: {
        options: {
          reporter: 'spec',
        },
        src: ['temp/char-buffer/**/test/**/*_slow_test.js'],
      },
    },
    'mocha_istanbul': {
      coverage: {
        src: 'temp/char-buffer',
        options: {
          recursive: true,
          reporter: 'spec',
          mask: '**/*_test.js',
          coverageFolder: 'target/gh-pages/coverage',
          reportFormats: ['html'],
        },
      },
      coveralls: {
        src: 'temp/char-buffer',
        options: {
          coverage: true,
          recursive: true,
          reporter: 'spec',
          mask: '**/*_test.js',
          coverageFolder: 'target/gh-pages/coverage',
          reportFormats: ['lcovonly'],
        },
      },
    },
    jsduck: {
      'temp/char-buffer': {
        src: ['temp/char-buffer/**/*.js', '!temp/char-buffer/**/test/**/*.js'],
        dest: 'target/gh-pages/api',
        options: {
          'builtin-classes': true,
          'title': '<%= pkg.name %>',
          'welcome': 'temp/gh-pages/README.md',
        },
      },
    },
    jshint: {
      gruntfile: {
        options: {
          jshintrc: 'build/.jshintrc',
        },
        src: ['Gruntfile.js'],
      },
      src: {
        options: {
          jshintrc: 'build/src.jshintrc',
        },
        src: ['src/**/*.js', '!src/**/test/**/*.js'],
      },
      test: {
        options: {
          jshintrc: 'build/src.test.jshintrc',
        },
        src: [
          'temp/char-buffer/test/**/*.js',
          '!temp/char-buffer/*.js',
          '!temp/char-buffer/test/**/test-strings.js',
        ],
      },
    },
    jscs: {
      gruntfile: {
        options: {
          config: 'build/.jscsrc',
        },
        files: {
          src: ['Gruntfile.js'],
        },
      },
      'temp/char-buffer': {
        options: {
          config: 'build/.jscsrc',
        },
        files: {
          src: ['temp/char-buffer/**/*.js', '!temp/char-buffer/**/test/**/*.js'],
        },
      },
      'temp/char-buffer/test': {
        options: {
          config: 'build/.jscsrc',
        },
        files: {
          src: [
            'temp/char-buffer/test/**/*.js',
            '!temp/char-buffer/*.js',
            '!temp/char-buffer/test/**/test-strings.js',
          ],
        },
      },
    },
    watch: {
      lint: {
        files: ['Gruntfile.js', 'package.json', 'src/**'],
        tasks: ['lint'],
      },
    },
    githooks: {
      all: {
        'pre-commit': 'lint dist',
      },
    },
  });

  // Load grunt tasks.
  for (var key in packageJson.devDependencies) {
    if (key !== 'grunt' && key.indexOf('grunt') === 0) {
      grunt.loadNpmTasks(key);
    }
  }

  grunt.registerMultiTask('es6ToCommonjs', function() {
    this.files.forEach(function(files) {
      var output = '';
      files.src.forEach(function(src) {
        var input = grunt.file.read(src);
        output += es6ToCommonjsTransform(input).code;
      });
      grunt.file.write(files.dest, output);
    });
  });

  grunt.event.on('coverage', function(lcov, done) {
    // repair paths
    lcov = lcov.replace(/\/temp\/char-buffer\//g, '/src/');
    require('coveralls').handleInput(lcov, function(err) {
      if (err) {
        return done(err);
      }
      done();
    });
  });

  // lint
  grunt.registerTask('lint', [
    'es6ToCommonjs',
    'jscs',
    'jshint',
  ]);

  // test
  grunt.registerTask('test', [
    'es6ToCommonjs',
    'mochaTest',
  ]);

  // npm
  grunt.registerTask('npm', [
    'es6ToCommonjs',
    'copy:npm',
    'compile-handlebars:npm',
    'compile-handlebars:templates_npm',
  ]);

  // gh-pages
  grunt.registerTask('coverage', [
    'es6ToCommonjs',
    'mocha_istanbul:coverage',
  ]);
  grunt.registerTask('report-coveralls', [
    'es6ToCommonjs',
    'mocha_istanbul:coveralls',
  ]);
  grunt.registerTask('api', [
    'es6ToCommonjs',
    'compile-handlebars:templates_temp_gh-pages',
    'jsduck',
  ]);
  grunt.registerTask('gh-pages', [
    'es6ToCommonjs',
    'mocha_istanbul:coverage',
    'compile-handlebars:templates_temp_gh-pages',
    'jsduck',
  ]);

  // master
  grunt.registerTask('master', [
    'es6ToCommonjs',
    'requirejs',
    'copy:master',
    'compile-handlebars:master',
    'compile-handlebars:templates_master',
  ]);

  // dist
  grunt.registerTask('dist', [
    'clean',
    'lint',
    'gh-pages',
    'master',
    'npm',
  ]);
};
