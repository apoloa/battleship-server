'use strict';

const mongoose = require('mongoose');
const UserModel = mongoose.model('User');
const sha512 = require('js-sha512').sha512;

class User {
    static async create (name, email, password) {
        await UserModel.new(name, email, sha512(password));
    }
}

module.exports = User;
