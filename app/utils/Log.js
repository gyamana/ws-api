'use strict';

var Moment = require('moment');
var Winston = require('winston');

var Common = require('./Common');
var Env = require('../Env');

var EXTRA_MESSAGE = 'extraMessage';

new Winston.Logger({
    transports: [
        new Winston.transports.Console({ level: Env.LOG_LEVEL })
    ]
});

exports.EXTRA_MESSAGE = EXTRA_MESSAGE;

exports.debug = function(message) {
    if (Winston.level === 'debug') {
        Winston.debug(Moment(Date.now()).format(Common.DATE_FORMAT) + ' ' + message);
    }
};

exports.error = function(message) {
    if (Env.DISABLE_LOG_COLOUR) {
        Winston.error(
            Moment(Date.now()).format(Common.DATE_FORMAT) + ' ' +
            message
        );
    }
    else {
        Winston.error(
            Common.CONSOLE_GREEN +
            Moment(Date.now()).format(Common.DATE_FORMAT) + ' ' +
            Common.CONSOLE_RED +
            message +
            Common.CONSOLE_RESET
        );
    }
};

exports.extraMessage = function(res, message) {

    var extraMessage = res.request[EXTRA_MESSAGE];

    if (extraMessage) {
        res.request[EXTRA_MESSAGE] = extraMessage + ' ' + message;
    }
    else {
        res.request[EXTRA_MESSAGE] = message;
    }
};

exports.info = function(message) {
    if (Env.DISABLE_LOG_COLOUR) {
        Winston.info(
            Moment(Date.now()).format(Common.DATE_FORMAT) + ' ' +
            message
        );
    }
    else {
        Winston.info(
            Common.CONSOLE_GREEN +
            Moment(Date.now()).format(Common.DATE_FORMAT) + ' ' +
            Common.CONSOLE_YELLOW +
            message +
            Common.CONSOLE_RESET);
    }
};