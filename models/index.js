'use strict';

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const mongoDB = (process.env.DB || require('../config/config').db); //eslint-disable-line

const configMongo = 'mongodb://' + mongoDB + '/Battleship';

// instance the connection
const db = mongoose.connection;

// error handler
db.on('error', err => {
    console.error('Error:', err);
    process.exit(-1);
});

// connection handler
db.once('open', () => {
    console.info('Connected to Mongo');
});

// connecting
mongoose.connect(configMongo);

fs.readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach(function (file) {
        require(path.join(__dirname, file)); //eslint-disable-line
    });

