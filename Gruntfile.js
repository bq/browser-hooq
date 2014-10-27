/*
 * Gruntfile : 'wrapper' function, which encapsulates the Grunt configuration.
 */
'use strict';
module.exports = function(grunt) {
    require('time-grunt')(grunt);

    //Load npm grunt tasks
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    //Grunt initialize configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            file     : '<%= pkg.name %>',
            endpoint : 'dist/'
        },
        source: {
            style     : 'stylesheets/',
            scripts   : 'scripts/',
            resources : 'resources/',
            templates : 'templates/',
        },
        // Limpia el directorio target
        clean: ['<%= meta.endpoint %>'],
        // Copia todos los recursos del módulo a la carpeta publica
        copy: {
            images: {
                expand  : true,
                cwd     : '<%= source.resources %>',
                filter  : 'isFile',
                src     : '{,**/}*.{png,jpg,jpeg,gif}',
                dest    : '<%= meta.endpoint %>images/',
                flatten : true
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            scripts: {
                files: [{
                    expand : true,
                    cwd    : '<%= source.scripts %>',
                    src    : ['{,**/}*.js'],
                    dest   : '<%= meta.endpoint %>scripts/'
                }]
            },
            templates: {
                files: [{
                    expand : true,
                    cwd    : '<%= source.templates %>',
                    src    : ['{,**/}*.tmpl.js'],
                    dest   : '<%= meta.endpoint %>templates/'
                }]
            },
            dist: {
                files: {
                    '<%= meta.endpoint %>scripts/<%= meta.file %>.min.js': ['<%= meta.endpoint %>templates/*.tmpl.js', '<%= meta.endpoint %>scripts/*.js']
                }
            }
        },
        imagemin: {
            images: {
                files: [{
                    expand : true,
                    cwd    : '<%= meta.endpoint %>images/',
                    src    : '{,**/}*/*.{png,jpg,gif}',
                    dest   : '<%= meta.endpoint %>images/'
                }]
            }
        },
        // Genera un fichero css concatenando todos estilos del módulo
        compass: {
            options: {
                sassDir        : '<%= source.style %>',
                cssDir         : '<%= meta.endpoint %>css/',
                fontsDir       : '<%= meta.endpoint %>resources/',
                outputStyle    : 'compressed',
                cacheDir       : 'sass_cache',
                relativeAssets : true,
                debugInfo      : false,
                noLineComments : true,
                raw            : 'Sass::Script::Number.precision = 3\n'
            },
            dist: {
                options: {
                    outputStyle: 'compressed'
                }
            },
            dev: {
                options: {
                    outputStyle: 'compact'
                }
            }
        },
        watch: {
            // Lanza compass:dev en el momento que se modifica algún archivo .scss del proyecto/componente
            compass: {
                files: [
                    '{,**/}*.scss',
                ],
                tasks: ['compass:dev']
            },
            copy: {
                files: [
                    '{,**/}*.{png,jpg,jpeg,gif}'
                ],
                tasks: ['copy:images']
            },
            images: {
                files: [
                    'dist/{,**/}*.{png,jpg,jpeg,gif}'
                ],
                tasks: ['imagemin:images']
            },
            scripts : {
                files: [
                    '{,**/}*.js',
                    '!{,**/}*.tmpl.js'
                ],
                tasks: ['uglify:scripts']
            },
            templates : {
                files: [
                    '{,**/}*.tmpl.js'
                ],
                tasks: ['uglify:templates']
            }
        }
    });

    // Servidor mockup para imitar vertx e integración
    grunt.registerTask(
        '__dist',
        'Task for generate dist dir',
        ['clean', 'uglify:scripts', 'uglify:templates', 'uglify:dist', 'compass:dev', 'copy:images', 'imagemin:images']
    );

    grunt.registerTask(
        '__watch',
        'Task for Developers Only: Watch', ['clean', 'watch']
    );

};
