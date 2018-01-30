'use strict';

const userController = require('./controllers/users');
const user = new userController({email: 'h', password: 'g'});
console.log(user);
