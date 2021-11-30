require('dotenv').config();
const db = require('mysql2');

//constantes
const { DB_USER, DB_PASSWORD, DB_HOST, DB_DATABASE } = process.env;

class Database {
    constructor(usesDbOfficial) {
        this.dataBase = DB_DATABASE;

        if (!usesDbOfficial) this.dataBase = "sys";

        this.connection = db.createConnection({
            host: DB_HOST,
            user: DB_USER,
            database: this.dataBase,
            password: DB_PASSWORD,
        });
    }

    changeDataBase(data) {
        this.dataBase = data
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {

            this.connection.query(sql, args, (err, rows) => {
                if (err) {
                    console.log("dbConn", err)
                    return reject(err);
                }

                resolve(rows);
            });

        });
    }
    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
}

module.exports = Database;