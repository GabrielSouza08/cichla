/* infra/data/creates/CreateDataBase*/
require('dotenv').config()
const { DB_DATABASE } = process.env;

module.exports = CreateDataBase = function() {

    var t = this;
    t.connection = require("../../../4-Shared/dbConn");

    t.scriptCreate = `CREATE DATABASE IF NOT EXISTS DB_CICHLA;`;

    t.scriptBaseStatusConfirmation = `
                                      SELECT 
                                      SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA as data
                                      WHERE SCHEMA_NAME="DB_CICHLA"
                                    `;

    t.IncludeDataBase = function() {
        //Não utilizará a base oficial para rodar o script de criação de base
        t.connection(false).query(t.scriptCreate);
    }

    t.StatusDataBaseCreate = function() {
        t.connection(false).query(t.scriptBaseStatusConfirmation,
            function(error, results) {
                if (error) throw new Error(`Erro na validação do da existencia da base de dados`);

                if (results) {
                    console.log(`BASE DADOS CONFIRMADA: ${DB_DATABASE}.`)
                } else {
                    console.log(`BASE DADOS NÃO CONFIRMADA.`)
                }
            }
        );
    }

    var start = function() {
        t.IncludeDataBase();
        t.StatusDataBaseCreate();
    };

    start();
}