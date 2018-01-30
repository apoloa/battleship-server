'use strict';

const UsersController = require('../../controllers/game');
const validator = require('validator');
const errs = require('restify-errors');

async function create (req, res, next) {
    if (!req.params.hasOwnProperty('name') || req.params.name.length === 0) {
        return next(new errs.BadRequestError('Name Required'));
    }
    if (!req.params.hasOwnProperty('password') || req.params.name.length === 0) {
        return next(new errs.BadRequestError('Password Required'));
    }
    if (!req.params.hasOwnProperty('email') || !validator.isEmail(req.params.email)) {
        return next(new errs.BadRequestError('Email Required'));
    }

    try {
        return next(res.send(200, await UsersController.create(req.params.name, req.params.email,
            req.params.password)));
    } catch (err) {
        return next(new errs.ConflictError(err));
    }
}

module.exports = {
    POST: create
};
