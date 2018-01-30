'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, trim: true, unique: true},
    email: {type: String, trim: true, lowercase: true, unique: true},
    password: {type: String}
});

userSchema.statics.new = function (name, email, password) {
    return new Promise((resolve, reject) => {
        this.create({name: name, email: email, password: password}, (err, newUser) => {
            if (err) {
                return reject(err);
            }
            return resolve(newUser);
        });
    });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
