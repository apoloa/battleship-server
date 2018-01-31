'use strict';

const restify = require('restify');
const models = require('../models');
const SocketIo = require('socket.io');
const testRoute = require('../routes/test');
const userRoute = require('../routes/v1/users');

const socketImp = require('../routes/socket');

const server = restify.createServer({
    name: 'BattleshipServer'
});

server.use(restify.plugins.queryParser({mapParams: true}));
server.use(restify.plugins.bodyParser({mapParams: true}));
const io = SocketIo(server.server);
/**
 * When Server has problem send error to SNS using server
 */
server.on('uncaughtException', function (req, res, route, err) {
    const message = (err && err.stack) ? err.stack : err;
    console.log(message);
});

io.on('connection', socketImp);

server.get('/test', testRoute);
server.post('/test', testRoute);
server.put('/test', testRoute);
server.post('/v1/users', userRoute.POST);


module.exports = server;
