module.exports = function(grunt) {
    grunt.initConfig({
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'node_modules/bootstrap/dist',
                        src: ['fonts/*', 'css/*'],
                        dest: 'public/'
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/angular/',
                        src: ['*.js', '*.map'],
                        dest: 'public/vendors'
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/angular-route/',
                        src: ['*.js', '*.map'],
                        dest: 'public/vendors'
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/sweetalert/dist',
                        src: ['*'],
                        dest: 'public/vendors'
                    }
                ]
            }
        },
        watch: {
            files: ['client/*.js', 'client/**/*.js'],
            tasks: ['uglify', 'copy']
        },
        uglify: {
            my_target: {
                options: {mangle: false},
                files: {
                    'public/scripts/client.min.js': [
                        'client/*.js',
                        'client/**/*.js'
                    ]
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['watch']);
};
