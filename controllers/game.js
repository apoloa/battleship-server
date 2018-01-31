'use strict';

const GameModel = require('../models/game');

class Game {
    constructor (game) {
        this.game = game;
        this.owner = this.game._doc.owner;
        this.opponent = this.game._doc.opponent;
    }

    async _updateGame () {
        this.game = await GameModel.upd(this.game);
    }

    async _reload () {
        this.game = await(GameModel.findById(this.game._doc._id));
    }

    async setBoardOwner (matrix) {
        this.game.boardOwner = matrix;
        this.game.isSetBoardOwner = true;
        await this._updateGame();
    }

    async setSelectedOwner (x, y) {
        if (this.game.boardOwner[x][y][1] !== 1) {
            this.game.boardOwner[x][y][1] = 1;
            await GameModel.updateSelect(this.game._doc._id, 'boardOwner', this.game.boardOwner.slice());
            await this._reload();
            return this.game.boardOwner[x][y];
        }
    }

    _isFinalizedOwner () {
        for (const arr of this.game.boardOwner) {
            for (const row of arr) {
                if (row[0] > 0 && row[1] !== 1) {
                    return false;
                }
            }
        }
        return true;
    }

    _isFinalizedOpponent () {
        for (const arr of this.game.boardOpponent) {
            for (const row of arr) {
                if (row[0] > 0 && row[1] !== 1) {
                    return false;
                }
            }
        }
        return true;
    }

    printboard () {
        console.log('-----------');
        for (const arr of this.game.boardOwner) {
            let rowP = '';
            for (const row of arr) {
                rowP += row[0] + ' ' + row[1] + '\t';
            }
            console.log(rowP);
        }
        console.log();
        for (const arr of this.game.boardOpponent) {
            let rowP = '';
            for (const row of arr) {
                rowP += row[0] + ' ' + row[1] + '\t';
            }
            console.log(rowP);
        }
        console.log('-----------');
    }

    async isFinalized () {
        this.printboard();
        if (this._isFinalizedOwner()) {
            this.game.winner = this.opponent;
            await this._updateGame();
            return this.game.winner;
        }
        if (this._isFinalizedOpponent()) {
            this.game.winner = this.owner;
            await this._updateGame();
            return this.game.winner;
        }
        return null;
    }

    async setSelectedOpponent (x, y) {
        if (this.game.boardOpponent[x][y][1] !== 1) {
            this.game.boardOpponent[x][y][1] = 1;
            await GameModel.updateSelect(this.game._doc._id, 'boardOpponent',
                this.game.boardOpponent.slice());
            await this._reload();
            return this.game.boardOpponent[x][y];
        }
    }

    isSetup () {
        if (this.game.isSetBoardOwner === true && this.game.isSetBoardOpponent === true) {
            return true;
        }
    }

    async setBoardOpponent (matrix) {
        this.game.boardOpponent = matrix;
        this.game.isSetBoardOpponent = true;
        await this._updateGame();
    }

    static async create (ownerId, opponentId) {
        return new Game(await GameModel.new(ownerId, opponentId));
    }

    static async loadFromId (id) {
        return new Game(await GameModel.findById(id));
    }

    toString () {
        return JSON.stringify({
            id: this.game._doc._id,
            owner: this.game._doc.owner,
            opponent: this.game._doc.opponent
        });
    }

    toJSON () {
        return {
            id: this.game._doc._id,
            owner: this.game._doc.name,
            opponent: this.game._doc.email
        };
    }
}

module.exports = Game;