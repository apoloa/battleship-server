'use strict';

const GameModel = require('../models/game');

class Game {
    constructor (user) {
        this.user = user;
    }

    static async create (ownerId, ) {
        return new Game(await GameModel.new(name, email, sha512(password)));
    }

    toString () {
        return JSON.stringify({
            name: this.user.name,
            email: this.user.email
        });
    }

    toJSON () {
        return {
            id: this.user._doc._id,
            name: this.user._doc.name,
            email: this.user._doc.email
        };
    }
}

module.exports = User;