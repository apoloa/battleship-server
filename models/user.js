'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, trim: true, unique: true},
    email: {type: String, trim: true, lowercase: true, unique: true},
    password: String
});

const User = mongoose.model('User', userSchema);

userSchema.new = (name, email, password) => new Promise((resolve, reject) => {
    User.create({name: name, email: email, password: password}, (err, newUser) => {
        if (err) {
            return reject(err);
        }
        return resolve(newUser);
    });
});

module.exports = User;
