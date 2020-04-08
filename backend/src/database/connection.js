const knex = require('knex');

const configuration = require('../../knexfile');

const connection = knex(configuration.development /* configuração de development do knexfile */);

module.exports = connection;