'use strict';

var request = require('request');

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-contrib-less');

  var reloadPort = 35729, files;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'app.js'
      }
    },
    watch: {
      options: {
        nospawn: true,
        livereload: reloadPort
      },
      server: {
        files: [
          'app.js',
          'routes/*.js'
        ],
        tasks: ['develop', 'delayed-livereload']
      },
      js: {
        files: ['ui/app/{,*/}*.js'],
        tasks: ['jshint', 'browserify'],
        options: {
          livereload: reloadPort
        }
      },
      less: {
        files: ['less/*.less'],
        tasks: ["less"],
        options: {
          livereload: reloadPort
        }
      },
      html: {
        files: ['ui/{,*/}*.html'],
        options: {
          livereload: reloadPort
        }
      }
    },
    less: {
      development: {
        options: {
          paths: ["less"]
        },
        files: {
          "public/css/app.css": "less/app.less"
        }
      },
      production: {
        options: {
          paths: ["less"],
          cleancss: true
        },
        files: {
          "public/css/app.css": "less/app.less"
        }
      }
    },
    browserify: {
      development: {
        src: ['ui/app/{,*/}*.js'],
        options: {

        },
        dest: 'public/js/app.js'
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        'public/js/src/{,*/}*.js'
      ]
    },
  });

  grunt.config.requires('watch.server.files');
  files = grunt.config('watch.server.files');
  files = grunt.file.expand(files);

  grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
    var done = this.async();
    setTimeout(function () {
      request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),  function (err, res) {
          var reloaded = !err && res.statusCode === 200;
          if (reloaded) {
            grunt.log.ok('Delayed live reload successful.');
          } else {
            grunt.log.error('Unable to make a delayed live reload.');
          }
          done(reloaded);
        });
    }, 500);
  });

  grunt.registerTask('default', ['develop', 'watch']);
};
