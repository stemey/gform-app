/*jshint node:true*/
module.exports = function (grunt) {

    grunt.loadNpmTasks('intern')
    require('load-grunt-tasks')(grunt, ['grunt-*']);
    var path = require('path');

    var stripComments = /<\!--.*?-->/g,
        collapseWhiteSpace = /\s+/g;

    grunt.initConfig({
        dojo: {
            dist: {
                options: {
                    dojo: path.join('src', 'dojo', 'dojo.js'),
                    dojoConfig: path.join('src', 'dojoConfig.js'),
                    profile: path.join('profiles', 'gform-app.profile.js'),
                    releaseDir: path.join('..', 'dist'),
                    basePath: path.join(__dirname, 'src')
                }
            }
        },
        copy: {
            config: {
                options: {
                    processContent: function (content) {
                        content = content.replace(/isDebug:\s+(true|1),?\s+/, '');
                        // somehow mapping a package to a different path does not work with the build as expected
                        content = content.replace('ace-builds/src-noconflict', 'ace')
                        return content;
                    }
                },
                files: [{
                    src: path.join('src', 'dojoConfig.js'),
                    dest: path.join('dist', 'dojoConfig.js')
                }]
            },
            deps: {
                files: [
                    // includes files within path
                    {expand: true, cwd:'src', src: ['handlebars/**/*'], dest: 'dist'},
                    {expand: true,  cwd:'src', src: ['bootstrap/**/*'], dest: 'dist'},
                    {expand: true,  cwd:'src', src: ['jquery/**/*'], dest: 'dist'}
                    ]
            },
            index: {
                options: {
                    processContent: function (content) {
                        return content
                            .replace(stripComments, '')
                            .replace(collapseWhiteSpace, ' ');
                    }
                },
                files: [{
                    src: path.join('src', 'mongodb.html'),
                    dest: path.join('dist', 'mongodb.html')
                }, {
                    src: path.join('src', 'cms-jcr.html'),
                    dest: path.join('dist', 'cms-jcr.html')
                }, {
                    src: path.join('src', 'cms.html'),
                    dest: path.join('dist', 'cms.html')
                }]
            }
        },
        connect: {
            options: {
                port: 8888,
                hostname: 'localhost'
            },
            test: {
                options: {
                    base: 'src'
                }
            },
            dist: {
                options: {
                    base: 'dist'
                }
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        'dist'
                    ]
                }]
            }
        },
        intern: {
            local: {
                options: {
                    runType: 'client',
                    config: 'src/gform-app/tests/intern'
                }
            },
            remote: {
                options: {
                    runType: 'runner',
                    config: 'src/gform-app/tests/intern'
                }
            }
        }
    });

    grunt.registerTask('default', []);
    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run([
                'build',
                'connect:dist:keepalive'
            ]);
        }

        grunt.task.run([
            'connect:test:keepalive'
        ]);
    });
    grunt.registerTask('build', ['clean', 'dojo:dist', 'copy']);
    grunt.registerTask('test', ['intern:local']);
};
