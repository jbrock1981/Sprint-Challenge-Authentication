const dbConfig = require('../knexfile.js');
const knex = require('knex');
const db = knex(dbConfig.development);

add = (user) => {
    return db('users').insert(user)
}

login = (username) => {
    return db('users')
        .where('username', username)
        .first();
}


module.exports = {
    add, login
}