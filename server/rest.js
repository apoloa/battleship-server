'use strict';

const restify = require('restify');
const server = restify.createServer({
    name: 'BattleshipServer'
});

/**
 * When Server has problem send error to SNS using server
 */
server.on('uncaughtException', function (req, res, route, err) {
    const message = (err && err.stack) ? err.stack : err;
    console.log(message);
});

module.exports = server;
