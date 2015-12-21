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

exports.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/spotz-push';

exports.PORT = process.env.PORT || '15002';

exports.REDIS_HOST = process.env.REDIS_HOST;
exports.REDIS_PORT = process.env.REDIS_PORT;
