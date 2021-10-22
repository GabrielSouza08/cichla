const mysql = require('mysql2')
require ('dotenv').config()

//constantes
const {DB_USER, DB_PASSWORD, DB_HOST, DB_DATABASE} = process.env

//conection
const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  database: DB_DATABASE,
  password: DB_PASSWORD
  });

  console.log(connection)
const MongoClient = require("mongodb").MongoClient;
// Connection URI
const uri = "mongodb://localhost:27017";

// Connect the client to the server
function connection(f) {
  MongoClient.connect(uri, (err, db) => {
    f(err, db.db("cichla_db"));
  });
}
module.exports = connection;
