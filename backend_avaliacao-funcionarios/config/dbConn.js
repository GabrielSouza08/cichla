const mysql = require('mysql2')
require ('dotenv').config()

//constantes
const {DB_USER, DB_PASSWORD, DB_HOST, DB_DATABASE, PORT} = process.env;

conection
const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  database: DB_DATABASE,
  password: DB_PASSWORD
  });

console.log(connection);

module.exports = connection;
