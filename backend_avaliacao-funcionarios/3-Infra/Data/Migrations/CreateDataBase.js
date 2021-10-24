/* infra/data/creates/CreateDataBase*/
require('dotenv').config()
const { DB_DATABASE } = process.env;


module.exports = CreateDataBase = async() => {

    var t = this;
    let accessDb = require("../../../4-Shared/DbConnection");
    t.DataBese = new accessDb(false);

    t.scriptCreate = `CREATE DATABASE IF NOT EXISTS ${DB_DATABASE};`;

    t.start = async() => {
        return await t.DataBese.query(t.scriptCreate)
            .then(() => {}, err => {
                return t.DataBese.close().then(() => { throw `$Create Database: ${err}`; })
            })
            .then(() => {
                return true;
            }).catch(err => {
                console.log("Create Database - MESSAGE:", err.message);
            });
    }

    var execute = async() => {
        let status = await t.start();
        t.DataBese.close();
        return status;
    };

    return await execute();
}