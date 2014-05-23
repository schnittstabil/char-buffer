'use strict';
var _ = require('lodash'),
    glob = require('glob'),
    examples = require('./src/build/templates/examples'),
    srcs = glob.sync('**/*.js', {cwd:'src/main/js/char-buffer'});

module.exports = function(grunt) {
  var packageJson = grunt.file.readJSON('package.json');

  // Project configuration.
  grunt.initConfig({
    pkg: packageJson,
    clean: {
      'master': {
        src: ['target/master/**/*', 'target/master/**/.*', '!target/master/.git'],
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
      master: {
        files: [
          {
            expand: true,
            cwd: 'src/build/resources/', src: ['**', '**/.*'],
            dest: 'target/master'
          },
          {
            expand: true,
            cwd: '.', src: ['LICENSE'],
            dest: 'target/master'
          },
          {
            expand: true,
            cwd: 'src/main/js/char-buffer', src: ['**', '**/.*'],
            dest: 'target/master'
          },
          {
            expand: true,
            cwd: 'src/test/js/', src: ['**', '**/.*'],
            dest: 'target/master/test/js'
          },
          {
            expand: true,
            cwd: 'src/test/', src: ['inject.js'],
            dest: 'target/master/test/'
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
        dest: 'target/master/test/tests.js',
      },
    },
    requirejs: {
      'bower.amd': {
        options: {
          baseUrl: 'target/temp/requirejs',
          name: 'char-buffer',
          cjsTranslate: true,
          out: 'target/master/char-buffer.amd.js',
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
            startFile: 'src/build/templates/wrap.umd.start.frag',
            endFile: 'src/build/templates/wrap.umd.end.frag'
          },
          out: 'target/master/char-buffer.global.js',
          optimize: 'none',
        }
      }
    },
    'compile-handlebars': {
      bowerJson: {
        template: 'src/build/templates/bower.json.hbs',
        output: 'target/master/bower.json',
        templateData: packageJson,
      },
      packageJson: {
        template: 'src/build/templates/package.json.hbs',
        output: 'target/master/package.json',
        templateData: packageJson,
      },
      componentJson: {
        template: 'src/build/templates/component.json.hbs',
        output: 'target/master/component.json',
        templateData: _.merge(_.clone(packageJson, true), {scripts:srcs}),
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
        output: 'target/master/README.md',
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


  // master task
  grunt.registerTask(
    'master',
    [
      'clean:master',
      'clean:temp',

      'copy:master',

      'copy:bower-requirejs-pre',
      'requirejs',
      'concat:bower-test',

      'compile-handlebars:bowerJson',
      'compile-handlebars:packageJson',
      'compile-handlebars:componentJson',
      'compile-handlebars:README',
    ]
  );

  // Dist tasks.
  grunt.registerTask('dist', ['master', 'doc']);

  // Default task.
  grunt.registerTask('default', ['compile-handlebars:README']);
};
