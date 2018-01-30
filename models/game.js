'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
    owner: {type: Schema.Types.ObjectId},
    opponent: {type: Schema.Types.ObjectId},
    winner: {type: Schema.Types.ObjectId},
    active: {type: Boolean},
    boardOwner: [[Number]],
    boardOpponent: [[Number]],
    created: {type: Date, default: Date.now}
});

gameSchema.statics.new = function (owner, opponent) {
    return new Promise((resolve, reject) => {
        this.create({
            owner: owner,
            opponent: opponent,
            winner: null,
            active: true,
            boardOwner: [...new Array(10)].map(x => [...new Array(10)].map(x => 0)),
            boardOpponent: [...new Array(10)].map(x => [...new Array(10)].map(x => 0))
        }, (err, newBoard) => {
            if (err) {
                return reject(err);
            }
            return resolve(newBoard);
        });
    });
};


const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
