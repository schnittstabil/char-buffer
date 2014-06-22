'use strict';
module.exports = function(grunt) {
  var es6ToCommonjsTransform = require('es6-module-jstransform'),
      scripts = grunt.file.expand({cwd: 'src/char-buffer/'}, ['**/*.js', '!test/**/*']),
      testScripts = grunt.file.expand({cwd: 'src/char-buffer/'}, ['!**/*.js', 'test/**/*.js']),
      testScriptsFullPath = grunt.file.expand({cwd: 'src/'}, ['!**/*.js', '**/test/**/*.js']),
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
      'char-buffer': {
        files: [
          {
            expand: true,
            cwd: 'src',
            src: ['**/*.js'],
            dest: 'temp/commonjs/',
          },
        ],
      },
    },
    'compile-handlebars': {
      'templates_temp_gh-pages': {
        template: 'build/templates/**/*.hbs',
        templateData: {html: true, scripts: scripts, test: {scripts: testScripts}},
        globals: [
          './package.json',
        ],
        helpers: 'build/templates/code_helper.js',
        output: 'temp/gh-pages/**/*',
      },
      master: {
        template: 'build/master/templates/**/*.hbs',
        templateData: {html: false, scripts: scripts, test: {scripts: testScripts}},
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
        templateData: {html: false, scripts: scripts, test: {scripts: testScripts}},
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
            dest: 'target/master/test',
          },
          {
            expand: true,
            cwd: 'build/master/resources',
            src: ['**', '**/.*'],
            dest: 'target/master',
          },
          {
            expand: true,
            cwd: 'src/char-buffer',
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
            cwd: 'temp/commonjs/char-buffer',
            src: ['**', '**/.*'],
            dest: 'target/npm',
          },
        ],
      },
    },
    requirejs: {
      amd: {
        options: {
          baseUrl: 'temp/commonjs',
          name: 'char-buffer',
          cjsTranslate: true,
          out: 'temp/amd/char-buffer.amd.js',
          optimize: 'none',
        },
      },
      'amd_test': {
        options: {
          baseUrl: 'temp/commonjs',
          include: testScriptsFullPath,
          paths: {
            'expect': 'empty:',
            'char-buffer': 'empty:',
          },
          cjsTranslate: true,
          out: 'temp/amd_tests/char-buffer.amd_tests.js',
          optimize: 'none',
        },
      },
      global: {
        options: {
          baseUrl: 'temp/commonjs',
          name: '../../node_modules/almond/almond',
          include: ['char-buffer'],
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
          'temp/commonjs/**/test/**/*_test.js',
          '!temp/commonjs/**/test/**/*_slow_test.js',
        ],
      },
      slow: {
        options: {
          reporter: 'spec',
        },
        src: ['temp/commonjs/**/test/**/*_slow_test.js'],
      },
    },
    'mocha_istanbul': {
      'char-bufferCoverage': {
        src: 'temp/commonjs/char-buffer/test',
        options: {
          recursive: true,
          reporter: 'spec',
          mask: '**/*_test.js',
          coverageFolder: 'target/gh-pages/coverage',
          reportFormats: ['html'],
        },
      },
      coveralls: {
        src: 'temp/commonjs/char-buffer/test',
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
      'temp/commonjs': {
        src: ['temp/commonjs/char-buffer/**/*.js', '!temp/commonjs/char-buffer/test/**/*.js'],
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
          jshintrc: 'build/src.char-buffer.jshintrc',
        },
        src: ['src/**/*.js', '!src/**/test/**/*.js'],
      },
      test: {
        options: {
          jshintrc: 'build/src.char-buffer.test.jshintrc',
        },
        src: ['!src/**/*.js', 'src/**/test/**/*.js'],
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
      'temp/commonjs': {
        options: {
          config: 'build/.jscsrc',
        },
        files: {
          src: ['temp/commonjs/**/*.js', '!temp/commonjs/**/test/**/*.js'],
        },
      },
      'temp/commonjs/test': {
        options: {
          config: 'build/.jscsrc',
        },
        files: {
          src: ['!temp/commonjs/**/*.js', 'temp/commonjs/**/test/**/*.js'],
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
    'mocha_istanbul:char-bufferCoverage',
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
    'mocha_istanbul:char-bufferCoverage',
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
