'use strict';

var Async = require('async'),
    _ = require('lodash'),
    MongoDb = require('mongodb'),
    Io = require('socket.io'),
    Redis = require('redis');

var Common = require('./utils/Common'),
    Env = require('./Env'),
    Log = require('./utils/Log');

var db,
    io,
    ioSockets = {},
    mongoClient = MongoDb.MongoClient;

function checkAndCreateSocket(socket, query, done) {

    var credentials,
        deviceId,
        projectId,
        secret;

    Async.waterfall([
        function (next) {

            credentials = Common.getBasicCredentials(query.authorization);
            deviceId = query.deviceId;
            projectId = credentials.username;
            secret = credentials.password;
            db.collection('projects').find({ projectId: projectId }, { status: 1, clientKeys: 1 }).limit(1).next(next);
        },
        function (result, next) {

            if (!result || result.status !== Common.STATUS_ACTIVE) {
                return next('projectId not found: ' + projectId);
            }

            var keys = _.where(result.clientKeys, { key: secret });

            if (keys.length !== 1) {
                return next('clientKey not found: ' + projectId);
            }

            db.collection('devices').find({ deviceId: deviceId }, { _id: 1 }).limit(1).next(next);
        },
        function (result, next) {

            if (!result) {
                return next('deviceId not found: ' + deviceId);
            }

            db.collection('devices').updateOne({ deviceId: deviceId }, { $set: {'notification.socketIoChannel': socket.id }}, next);
        }
    ], function (err) {

        if (err) {
            Log.error(err);
            return done(new Error());
        }
        done();
    });
}

function createSocketServer() {

    Async.waterfall([
        function (callback) {

            mongoClient.connect(Env.MONGO_URI, callback);
        },
        function (result, callback) {

            Log.info('Connected to: ' + Env.MONGO_URI);
            db = result;
            io = new Io();
            io.serveClient(false);
            io.on('connection', function (socket) {

                var redisClient = Redis.createClient(Env.REDIS_PORT, Env.REDIS_HOST);

                Log.info('Client connected: ' + socket.id);

                redisClient.on('message', function (channel, message) {

                    Log.info('Received for channel: ' + channel + ' message: ' + message);
                    socket.emit(Common.PUSH_EVENT, JSON.parse(message));
                });

                redisClient.subscribe('socketIo-' + socket.id);

                ioSockets[socket.id] = {
                    socket: socket,
                    redis: redisClient
                };

                socket.on('disconnect', function () {

                    Log.info('Client disconnect: ' + socket.id);
                    ioSockets[socket.id].redis.quit();
                    ioSockets[socket.id] = null;
                });
            });
            io.use(function (socket, done) {

                var query = socket.handshake.query;

                if (!query.authorization || !query.deviceId) {
                    Log.error('Missing query parameters: ' + JSON.stringify(query));
                    return done(new Error('Missing parameters'));
                }

                checkAndCreateSocket(socket, query, done);
            });

            io.listen(Env.PORT);
            callback();
        }
    ], function (err) {

        if (err) {
            Log.error(err);
        }
        Log.info('Started socket.io server on port: ' + Env.PORT);
    });
}

exports.checkAndCreateSocket = checkAndCreateSocket;
exports.createSocketServer = createSocketServer;
exports.ioSockets = ioSockets;
