'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
    owner: {type: String},
    opponent: {type: String}, //{type: Schema.Types.ObjectId},
    winner: {type: String},
    active: {type: Boolean},
    boardOwner: [[[Number]]],
    boardOpponent: [[[Number]]],
    isSetBoardOwner: {type: Boolean, default: false},
    isSetBoardOpponent: {type: Boolean, default: false},
    playerTurn: Number,
    created: {type: Date, default: Date.now}
});

gameSchema.statics.new = function (owner, opponent) {
    return new Promise((resolve, reject) => {
        this.create({
            owner: owner,
            opponent: opponent,
            winner: null,
            active: true,
            boardOwner: [...new Array(10)].map(x => [...new Array(10)].map(x => [...new Array(2)].fill(0))),
            boardOpponent: [...new Array(10)].map(x => [...new Array(10)].map(x => [...new Array(2)].fill(0)))
        }, (err, newBoard) => {
            if (err) {
                return reject(err);
            }
            return resolve(newBoard);
        });
    });
};

gameSchema.statics.findById = function (id) {
    return new Promise((resolve, reject) => {
        this.findOne({
            _id: id
        }, (err, board) => {
            if (err) {
                return reject(err);
            }
            return resolve(board);
        });
    });
};

gameSchema.statics.upd = function (model) {
    return new Promise((resolve, reject) => {
        model.save((err, board) => {
            if (err) {
                return reject(err);
            }
            return resolve(board);
        });
    });
};

gameSchema.statics.updateSelect = function (id, nameBoard, arr) {
    return new Promise((resolve, reject) => {
        const updateObj = {};
        const key = `${nameBoard}`;
        updateObj[key] = arr;
        this.updateOne({_id: id}, updateObj,
            err => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                return resolve();
            });
    });
};


const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
