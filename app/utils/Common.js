'use strict';

function getBasicCredentials(authorization) {

    var credentialsArray,
        credentialsPart;

    credentialsPart = new Buffer(authorization, 'base64').toString();
    credentialsArray = credentialsPart.split(':');

    if (credentialsArray.length !== 2) {
        return null;
    }

    //First half is the username
    return { username: credentialsArray[0], password: credentialsArray[1] };
}

exports.getBasicCredentials = getBasicCredentials;
/**
 Include common attributes that are used throughout the application in this file.
 */
exports.CONSOLE_RED = '\u001b[31m';
exports.CONSOLE_GREEN = '\u001b[32m';
exports.CONSOLE_YELLOW = '\u001b[33m';
exports.CONSOLE_BLUE = '\u001b[34m';
exports.CONSOLE_RESET = '\u001b[0m';

exports.DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss,SSSZ';

exports.PUSH_EVENT = 'standard';

exports.STATUS_ACTIVE = 'active';
