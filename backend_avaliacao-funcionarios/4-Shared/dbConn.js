const mysql = require('mysql2');
require('dotenv').config()

//constantes
const { DB_USER, DB_PASSWORD, DB_HOST, DB_DATABASE, PORT } = process.env;

module.exports = Connections = function(utilizaOficial) {

    this.base = DB_DATABASE;

    if (!utilizaOficial)
        this.base = "sys";

    return mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        database: this.base,
        password: DB_PASSWORD
    });
}