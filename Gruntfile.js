'use strict';
var _ = require('lodash'),
    examples = require('./src/build/templates/examples');

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      'bower-target': {
        src: ['target/bower/**/*', 'target/bower/**/.*', '!target/bower/.git'],
      },
      temp: {
        src: ['target/temp/**/*'],
      },
      doc: {
        src: ['target/doc/**/*', 'target/doc/**/.*', '!target/doc/.git'],
      },
      docApi: {
        src: ['target/doc/api/**/*'],
      },
      docCoverage: {
        src: ['target/doc/coverage/**/*'],
      },
      'npm-pre': {
        src: ['target/npm/**/*', 'target/npm/**/.*', '!target/npm/.git'],
      },
      'bower-requirejs-pre': {
        src: ['target/temp/requirejs/**/*'],
      },
      'bower-requirejs-post': {
        src: ['target/temp/bower/build.txt']
      },
    },
    copy: {
      'bower-requirejs-pre': {
        files: [
          {
            expand: true,
            cwd: 'src/main/js/', src: ['**'],
            dest: 'target/temp/requirejs'
          },
          {
            expand: true,
            cwd: 'src/test/js/', src: ['**'],
            dest: 'target/temp/requirejs/test'
          },
        ],
      },
      'bower-requirejs-post': {
        files: [
          {
            expand: true,
            cwd: 'target/temp/bower', src: ['**'],
            dest: 'target/bower'
          },
        ],
      },
      'bower-resources': {
        files: [
          {
            expand: true,
            cwd: 'src/build/resources/', src: ['**', '**/.*'],
            dest: 'target/bower'
          },
          {
            expand: true,
            cwd: 'src/build/bower/resources/', src: ['**', '**/.*'],
            dest: 'target/bower'
          },
        ],
      },
      npm: {
        files: [
          {
            expand: true,
            cwd: 'src/build/resources/', src: ['**', '**/.*'],
            dest: 'target/npm'
          },
          {
            expand: true,
            cwd: 'src/build/npm/resources/', src: ['**', '**/.*'],
            dest: 'target/npm'
          },
          {
            expand: true,
            cwd: 'src/main/js/char-buffer', src: ['**', '**/.*'],
            dest: 'target/npm'
          },
          {
            expand: true,
            cwd: 'src/test/js/', src: ['**', '**/.*'],
            dest: 'target/npm/test/js'
          },
          {
            expand: true,
            cwd: 'src/test/', src: ['inject.js'],
            dest: 'target/npm/test/'
          },
        ],
      },
      project: {
        files: [
          {
            expand: true,
            cwd: 'src/build/resources/', src: ['**', '**/.*'],
            dest: './'
          },
        ],
      },
    },
    concat: {
      options: {
        process: function(src, filepath) {
          var result = '(function(){\n  ';
          result += '/* source: ' + filepath + ' */\n';
          result += src.replace(/^/gm, '  ');
          result += '/* ecruos: ' + filepath + ' */\n';
          result += '}());\n';
          return result;
        },
      },
      'bower-test': {
        src: ['src/test/js/**/*.js'],
        dest: 'target/bower/test/tests.js',
      },
    },
    requirejs: {
      'bower.amd': {
        options: {
          baseUrl: 'target/temp/requirejs',
          name: 'char-buffer',
          cjsTranslate: true,
          dir: 'target/temp/bower',
          optimize: 'none',
        }
      },
      'bower.global': {
        options: {
          baseUrl: 'target/temp/requirejs',
          name: '../../../node_modules/almond/almond',
          include: ['char-buffer'],
          cjsTranslate: true,
          wrap: {
            startFile: 'src/build/bower/templates/wrap.umd.start.frag',
            endFile: 'src/build/bower/templates/wrap.umd.end.frag'
          },
          out: 'target/bower/char-buffer.global.js',
          optimize: 'none',
        }
      }
    },
    'compile-handlebars': {
      bowerBowerJson: {
        template: 'src/build/bower/templates/bower.hbs',
        output: 'target/bower/bower.json',
        templateData: 'package.json',
      },
      bowerPackageJson: {
        template: 'src/build/bower/templates/package.hbs',
        output: 'target/bower/package.json',
        templateData: 'package.json',
      },
      npmPackageJson: {
        template: 'src/build/npm/templates/package.hbs',
        output: 'target/npm/package.json',
        templateData: 'package.json',
      },
      docWelcome: {
        template: 'src/build/templates/README.md.hbs',
        helpers: 'src/build/templates/code_helper.js',
        partials: 'src/build/templates/**/*.hbs',
        templateData: _.merge(_.clone(examples, true), {html:true}),
        output: 'target/temp/doc/WELCOME.md',
      },
      README: {
        template: 'src/build/templates/README.md.hbs',
        helpers: 'src/build/templates/code_helper.js',
        partials: 'src/build/templates/**/*.hbs',
        templateData: _.merge(_.clone(examples, true), {html:false}),
        output: 'README.md',
      },
      bowerREADME: {
        template: 'src/build/templates/README.md.hbs',
        helpers: 'src/build/templates/code_helper.js',
        partials: 'src/build/templates/**/*.hbs',
        templateData: _.merge(_.clone(examples, true), {html:false}),
        output: 'target/bower/README.md',
      },
      npmREADME: {
        template: 'src/build/templates/README.md.hbs',
        helpers: 'src/build/templates/code_helper.js',
        partials: 'src/build/templates/**/*.hbs',
        templateData: _.merge(_.clone(examples, true), {html:false}),
        output: 'target/npm/README.md',
      },
    },
    mochaTest: {
      fast: {
        options: {
          reporter: 'spec',
          require: ['src/test/inject'],
        },
        src: ['src/test/js/**/*_test.js', '!**/*_slow_test.js']
      },
      slow: {
        options: {
          reporter: 'spec',
          require: ['src/test/inject'],
        },
        src: ['src/test/js/**/*_slow_test.js']
      },
    },
    'mocha_istanbul': {
      coverageDoc: {
        src: 'src/test/js',
        options: {
          recursive: true,
          reporter: 'spec',
          mask: '**/*_test.js',
          require: ['src/test/inject'],
          coverageFolder: 'target/doc/coverage',
          reportFormats: ['html'],
        }
      },
      coveralls: {
        src: 'src/test/js',
        options: {
          coverage: true,
          recursive: true,
          reporter: 'spec',
          mask: '**/*_test.js',
          require: ['src/test/inject'],
          coverageFolder: 'target/doc/coverage',
          reportFormats: ['lcovonly'],
        }
      },
    },
    jsduck: {
      main: {
        src: [
          'src/main/**/*.js',
        ],
        dest: 'target/doc/api',
        options: {
          'builtin-classes': true,
          'title': '<%= pkg.name %>',
          'welcome': 'target/temp/doc/WELCOME.md',
        }
      }
    },
    jshint: {
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      main: {
        options: {
          jshintrc: 'src/main/.jshintrc'
        },
        src: ['src/main/**/*.js']
      },
      test: {
        options: {
          jshintrc: 'src/test/.jshintrc'
        },
        src: ['src/test/**/*.js']
      },
    },
    watch: {
      test: {
        files: ['src/**'],
        tasks: ['mochaTest:fast']
      },
      doc: {
        files: ['src/**'],
        tasks: ['doc:api']
      },
    },
    githooks: {
      all: {
        'pre-commit': 'lint test:fast dist',
      }
    }
  });

  // Load grunt tasks.
  for (var key in grunt.file.readJSON('package.json').devDependencies) {
    if (key !== 'grunt' && key.indexOf('grunt') === 0){
      grunt.loadNpmTasks(key);
    }
  }

  grunt.event.on('coverage', function(lcov, done){
    require('coveralls').handleInput(lcov, function(err){
      if (err) {
        return done(err);
      }
      done();
    });
  });

  // simple aliases
  grunt.registerTask('lint', ['jshint']);

  // Test tasks.
  grunt.registerTask('test', ['mocha_istanbul:coveralls']);
  grunt.registerTask('test:fast', ['mochaTest:fast']);
  grunt.registerTask('test:slow', ['mochaTest:slow']);
  grunt.registerTask('test:all', ['mochaTest']);

  // Doc tasks.
  grunt.registerTask('doc', ['clean:doc', 'doc:api', 'doc:coverage']);
  grunt.registerTask(
    'doc:api',
    [
      //'clean:docApi',
      'compile-handlebars:docWelcome',
      'jsduck',
    ]
  );
  grunt.registerTask(
      'doc:coverage',
      [
        'clean:docCoverage',
        'mocha_istanbul:coverageDoc',
      ]
    );

  // Bower tasks
  grunt.registerTask(
    'bower-requirejs-pre',
    ['clean:bower-requirejs-pre', 'copy:bower-requirejs-pre']
  );
  grunt.registerTask(
    'bower-requirejs-post',
    ['clean:bower-requirejs-post', 'copy:bower-requirejs-post']
  );
  grunt.registerTask(
    'bower-requirejs',
    ['bower-requirejs-pre', 'requirejs', 'bower-requirejs-post']
  );
  grunt.registerTask(
    'bower-templates',
    [
      'compile-handlebars:bowerBowerJson',
      'compile-handlebars:bowerPackageJson',
      'compile-handlebars:bowerREADME',
    ]
  );
  grunt.registerTask(
    'bower',
    [
      'clean:bower-target',
      'bower-requirejs',
      'copy:bower-resources', 'concat:bower-test', 'bower-templates'
    ]
  );

  // Npm tasks.
  grunt.registerTask('npm-pre',  ['clean:npm-pre']);
  grunt.registerTask(
    'npm-templates',
    [
      'compile-handlebars:npmPackageJson',
      'compile-handlebars:npmREADME',
    ]
  );
  grunt.registerTask('npm', ['npm-pre', 'copy:npm', 'npm-templates']);

  // Project tasks.
  grunt.registerTask('project', ['compile-handlebars:README', 'copy:project']);

  // Dist tasks.
  grunt.registerTask('dist', ['project', 'bower', 'doc', 'npm']);

  // Default task.
  grunt.registerTask('default', ['compile-handlebars:README']);
};
