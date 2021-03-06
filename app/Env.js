'use strict';

/**
 * Central file to initialise environmental variables.
 *
 * ONLY INCLUDE NON-SENSITIVE CONFIGURATION
 * @type {string|*}
 */
exports.DISABLE_LOG_COLOUR = process.env.DISABLE_LOG_COLOUR || false;

exports.ENV = process.env.ENV || 'dev';

exports.LOG_LEVEL = process.env.LOG_LEVEL || 'info';

exports.SOCKET_IO_PORT = process.env.SOCKET_IO_PORT || 8443;
