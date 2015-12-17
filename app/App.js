'use strict';

var Io = require('socket.io');

var Env = require('./Env'),
    Log = require('./utils/Log');

var io,
    ioSockets = {};

function createSocketServer() {

    io = new Io();
    io.on('connection', function (socket) {

        ioSockets[socket.id] = socket;

        Log.info('Client connected: ' + socket.id);
        socket.emit('standard', { message: 'Grande!' });

        socket.on('connect', function () {

            Log.info('socket.io connection!');

            socket.emit('standard', { message: 'Hello' });
        });

        socket.on('disconnect', function () {

            Log.info('socket.io disconnect!!');
            ioSockets[socket.id] = null;
        });
    });

    io.listen(Env.PORT);
}

Log.info('Starting socket.io server on port: ' + Env.PORT);
createSocketServer();
