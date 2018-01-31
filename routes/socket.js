'use strict';

const users = [];

const GameController = require('../controllers/game');

function getUserBySocket (socket) {
    for (const user of users) {
        if (user.socket === socket) {
            return user;
        }
    }
    return null;
}

function getUserById (userId) {
    for (const user of users) {
        if (user.userId === userId) {
            return user;
        }
    }
    return null;
}

function updateSocketForUser (userId, socket) {
    for (const user of users) {
        if (user.userId === userId) {
            user.socket = socket;
            return;
        }
    }
}

function SocketImplementation (socket) {
    console.log('a user connected');
    socket.on('login', function (user) {
        console.log('Logged User', user);

        if (getUserById(user)) {
            updateSocketForUser(user, socket);
        } else {
            users.push({
                userId: user,
                socket: socket
            });
        }
    });
    socket.on('newGame', async function (userId) {
        console.log('New Game');
        const userObject = getUserBySocket(socket);
        if (userObject) {
            const game = await GameController.create(userObject.userId, userId);
            const opponent = getUserById(userId);
            opponent.socket.emit('setBoats', game.toString());
            socket.emit('setBoats', game.toString());
        }
    });

    socket.on('finalizedSetBoats', async function (game) {
        console.log('Finalized Set Boats');
        const userObject = getUserBySocket(socket);
        const gameObject = JSON.parse(game);
        if (userObject) {
            const board = await GameController.loadFromId(gameObject.id);
            if (board.owner === userObject.userId) {
                await board.setBoardOwner(gameObject.board);
                if (board.isSetup()) {
                    const opponent = getUserById(board.opponent);
                    socket.emit('yourTorn', gameObject.id);
                    opponent.socket.emit('waitTorn', gameObject.id);
                }
            }
            if (board.opponent === userObject.userId) {
                await board.setBoardOpponent(gameObject.board);
                if (board.isSetup()) {
                    const owner = getUserById(board.owner);
                    socket.emit('waitTorn', gameObject.id);
                    owner.socket.emit('yourTorn', gameObject.id);
                }
            }
        }
    });

    socket.on('setSelected', async function (message) {
        console.log('Set Selected');
        const userObject = getUserBySocket(socket);
        const cellSelected = JSON.parse(message);
        if (userObject) {
            const game = await GameController.loadFromId(cellSelected.id);
            if (game.owner === userObject.userId) {
                const otherUser = getUserById(game.opponent);
                const row = await game.setSelectedOpponent(cellSelected.x, cellSelected.y);
                const result = JSON.stringify({
                    x: cellSelected.x,
                    y: cellSelected.y,
                    value: row
                });
                socket.emit('updateOpponentBoard', result);
                otherUser.socket.emit('updateOwnerBoard', result);
                socket.emit('waitTorn', cellSelected.id);
                otherUser.socket.emit('yourTorn', cellSelected.id);
            } else {
                const otherUser = getUserById(game.owner);
                const row = await game.setSelectedOwner(cellSelected.x, cellSelected.y);
                const result = JSON.stringify({
                    x: cellSelected.x,
                    y: cellSelected.y,
                    value: row
                });
                socket.emit('updateOpponentBoard', result);
                otherUser.socket.emit('updateOwnerBoard', result);
                socket.emit('waitTorn', cellSelected.id);
                otherUser.socket.emit('yourTorn', cellSelected.id);
            }
            const winner = await game.isFinalized();
            if (winner !== null) {
                getUserById(winner).socket.emit('winner', 'You Win');
                if (game.owner !== winner) {
                    getUserById(game.owner).socket.emit('loser', 'You Lose');
                } else {
                    getUserById(game.opponent).socket.emit('loser', 'You Lose');
                }

            }
        }
    });
}

module.exports = SocketImplementation;
