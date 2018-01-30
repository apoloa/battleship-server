'use strict';

function test (req, res, next) {
    return next(res.json(200, {status: 'OK'}));
}

module.exports = test;
