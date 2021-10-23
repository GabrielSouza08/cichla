/* infra/data/creates/CreateDataBase*/
require('dotenv').config()
const { DB_DATABASE } = process.env;

module.exports = CreateDataBase = function() {

    var t = this;
    t.connection = require("../../../4-Shared/dbConn");
    t.validation = require("../Migrations/ValidationsDb");

    t.scriptCreate = `CREATE DATABASE IF NOT EXISTS ${DB_DATABASE};`;

    t.IncludeDataBase = function() {
        //Não utilizará a base oficial para rodar o script de criação de base
        t.connection(false).query(t.scriptCreate);
    }

    var start = function() {
        if (!t.validation()) {
            t.IncludeDataBase();
            console.log(`BASE DADOS CRIADA. NOME:${DB_DATABASE}`)
        } else
            console.log(`BASE DADOS CONFIRMADA. NOME: ${DB_DATABASE}.`)
    };

    start();
}