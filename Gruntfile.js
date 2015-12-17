'use strict';

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.initConfig({
        mochaTest: {
            unit: {
                src: ['tests/unit/Test*.js']
            },
            functional: {
                src: ['tests/functional/Test*.js']
            }
        }
    });

    grunt.registerTask('test', ['mochaTest:unit', 'mochaTest:functional']);
};